import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const body = await request.json();
    const { 
      amount: rawAmount, 
      method: rawMethod, 
      cashappTag, 
      zelleEmail, 
      btcAddress, 
      usdtAddress, 
      bankName, 
      accountNumber, 
      routingNumber, 
      accountName 
    } = body;
    
    const amount = parseFloat(rawAmount);

    if (isNaN(amount) || amount <= 0 || !rawMethod) {
      return NextResponse.json({ error: 'Amount and method are required' }, { status: 400 });
    }

    // 1. Validate limits: ₦2,000 min
    if (amount < 2000) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is ₦2,000' }, { status: 400 });
    }

    // Map frontend method to DB allowed methods
    let method = rawMethod;
    if (method === 'bank' || method === 'opay') {
      method = 'bank_transfer';
    }

    // 2. Verify wallet balance
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const balance = parseFloat(profile.wallet_balance as any);
    if (balance < amount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // --- WITHDRAWAL FRAUD CHECKS ---
    
    // 1. User must have completed at least 1 confirmed deposit before withdrawing
    const { data: confirmedDeposits, error: depError } = await supabaseAdmin
      .from('deposits')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .limit(1);

    if (depError || !confirmedDeposits || confirmedDeposits.length === 0) {
      return NextResponse.json({ error: 'You must complete at least 1 confirmed deposit before you can make a withdrawal.' }, { status: 400 });
    }

    // 2. New accounts (under 24 hours old) cannot withdraw more than their deposited amount
    const { data: userRecord } = await supabaseAdmin
      .from('users')
      .select('created_at')
      .eq('id', user.id)
      .single();
    
    if (userRecord) {
      const accountAgeMs = Date.now() - new Date(userRecord.created_at).getTime();
      const accountAgeHours = accountAgeMs / (3600 * 1000);
      if (accountAgeHours < 24) {
        const { data: depositsData } = await supabaseAdmin
          .from('deposits')
          .select('amount')
          .eq('user_id', user.id)
          .eq('status', 'confirmed');
        
        const totalDepositedAmt = depositsData?.reduce((sum, d) => sum + parseFloat(d.amount as any), 0) || 0;
        if (amount > totalDepositedAmt) {
          return NextResponse.json({ 
            error: `New accounts under 24 hours old cannot withdraw more than their total deposited amount (₦${totalDepositedAmt.toLocaleString()}).` 
          }, { status: 400 });
        }
      }
    }

    // 3. Flag if withdrawal amount exactly matches a recent deposit (possible scam pattern)
    let isScamPattern = false;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { data: matchingDeposit } = await supabaseAdmin
      .from('deposits')
      .select('id')
      .eq('user_id', user.id)
      .eq('amount', amount)
      .gte('created_at', twentyFourHoursAgo)
      .limit(1)
      .maybeSingle();

    if (matchingDeposit) {
      isScamPattern = true;
    }

    // Calculate Audit Risk Score
    let fraudScore = 0;
    if (isScamPattern) {
      fraudScore = 95; // Flagged scam pattern
    } else if (amount > 40000) {
      fraudScore = 85;
    } else if (amount > 10000) {
      fraudScore = 60;
    }

    // Map wallet address
    let walletAddress = null;
    if (method === 'bitcoin') {
      walletAddress = btcAddress;
    } else if (method === 'usdt') {
      walletAddress = usdtAddress;
    }

    // Format Bank details in bank_name to prevent schema migration dependency
    let dbBankName = bankName || null;
    if (method === 'bank_transfer' && (routingNumber || accountName)) {
      dbBankName = `${bankName} (Routing: ${routingNumber}, Name: ${accountName})`;
    }

    // 4. Create Withdrawal Record
    const { data: withdrawal, error: dbError } = await supabaseAdmin
      .from('withdrawals')
      .insert({
        user_id: user.id,
        amount,
        method,
        wallet_address: walletAddress || null,
        bank_name: dbBankName,
        account_number: accountNumber || null,
        cashapp_tag: cashappTag || null,
        zelle_email: zelleEmail || null,
        status: 'pending',
        fraud_score: fraudScore,
      })
      .select('*')
      .single();

    if (dbError || !withdrawal) {
      return NextResponse.json({ error: `Failed to create withdrawal request: ${dbError?.message}` }, { status: 500 });
    }

    // 5. Deduct amount from wallet balance (Hold funds during review)
    const newBalance = balance - amount;
    await supabaseAdmin
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', user.id);

    // 6. Log transaction type 'withdrawal'
    const refNumber = `WD-${withdrawal.id.substring(0, 8).toUpperCase()}`;
    await supabaseAdmin.from('transactions').insert({
      user_id: user.id,
      type: 'withdrawal',
      amount: -amount,
      method: method,
      reference: refNumber,
      status: 'pending',
      balance_before: balance,
      balance_after: newBalance,
      description: `Held funds for withdrawal reference ${refNumber}`,
    });

    // 7. Log to fraud logs if risk is elevated
    if (fraudScore > 50) {
      await supabaseAdmin.from('fraud_logs').insert({
        user_id: user.id,
        event_type: 'high_value_withdrawal',
        ip_address: ip,
        details: { amount, method, withdrawal_id: withdrawal.id },
        risk_score: fraudScore,
      });
    }

    // 8. Send submitted notifications
    await supabaseAdmin.from('notifications').insert({
      user_id: user.id,
      title: 'Withdrawal Request Submitted',
      message: `Your withdrawal of ₦${amount.toLocaleString()} has been submitted and the funds placed on hold. Reference: ${refNumber}.`,
      type: 'info',
      is_read: false,
    });

    return NextResponse.json({
      success: true,
      withdrawalId: withdrawal.id,
      message: 'Withdrawal request submitted and funds placed on hold',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create Withdrawal Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
