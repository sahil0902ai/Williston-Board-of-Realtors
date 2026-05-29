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
    const { amount: rawAmount, method, walletAddress, bankName, accountNumber, cashappTag, zelleEmail } = body;
    const amount = parseFloat(rawAmount);

    if (isNaN(amount) || amount <= 0 || !method) {
      return NextResponse.json({ error: 'Amount and payout method are required' }, { status: 400 });
    }

    // 1. Validate limits: $100 min, $50,000 max
    if (amount < 100) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is $100' }, { status: 400 });
    }
    if (amount > 50000) {
      return NextResponse.json({ error: 'Maximum single withdrawal amount is $50,000' }, { status: 400 });
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

    // 3. Calculate Audit Risk Score
    let fraudScore = 0;
    if (amount > 40000) {
      fraudScore = 85;
    } else if (amount > 10000) {
      fraudScore = 60;
    }

    // 4. Create Withdrawal Record
    const { data: withdrawal, error: dbError } = await supabaseAdmin
      .from('withdrawals')
      .insert({
        user_id: user.id,
        amount,
        method,
        wallet_address: walletAddress || null,
        bank_name: bankName || null,
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
      message: `Your withdrawal of $${amount.toLocaleString()} has been submitted and the funds placed on hold. Reference: WD-${withdrawal.id.substring(0, 8).toUpperCase()}.`,
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
