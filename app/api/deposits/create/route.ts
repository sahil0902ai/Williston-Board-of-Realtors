import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';
import { sendDepositPendingEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const body = await request.json();
    const { amount: rawAmount, method, transactionHash, bankReference, walletAddress, proofUrl } = body;
    const amount = parseFloat(rawAmount);

    if (isNaN(amount) || amount <= 0 || !method) {
      return NextResponse.json({ error: 'Amount and method are required' }, { status: 400 });
    }

    // 1. Enforce minimum $100 deposit
    if (amount < 100) {
      return NextResponse.json({ error: 'Minimum deposit amount is $100' }, { status: 400 });
    }

    // 2. Calculate Fraud / Audit Score
    let fraudScore = 0;
    if (amount > 50000) {
      fraudScore = 80;
    } else if (amount > 10000) {
      fraudScore = 60;
    }

    // Fetch user details for email template
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const fullName = profile?.full_name || 'Investor';
    const email = profile?.email || '';

    // 3. Create Deposit Record
    const { data: deposit, error: dbError } = await supabaseAdmin
      .from('deposits')
      .insert({
        user_id: user.id,
        amount,
        method,
        wallet_address: walletAddress || null,
        transaction_hash: transactionHash || null,
        bank_reference: bankReference || null,
        proof_url: proofUrl || null,
        status: 'pending',
      })
      .select('*')
      .single();

    if (dbError || !deposit) {
      return NextResponse.json({ error: `Failed to create deposit: ${dbError?.message}` }, { status: 500 });
    }

    const refNumber = `DEP-${deposit.id.substring(0, 8).toUpperCase()}`;

    // 4. Log high-value deposits to fraud logs
    if (fraudScore > 50) {
      await supabaseAdmin.from('fraud_logs').insert({
        user_id: user.id,
        event_type: 'high_value_deposit',
        ip_address: ip,
        details: { amount, method, deposit_id: deposit.id },
        risk_score: fraudScore,
      });
    }

    // 4.5 Log Pending Transaction
    await supabaseAdmin.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: amount,
      method: method,
      reference: refNumber,
      proof_url: proofUrl || null,
      status: 'pending',
      description: `Pending deposit request via ${method}`,
    });

    // 5. Send User Notification
    await supabaseAdmin.from('notifications').insert({
      user_id: user.id,
      title: 'Deposit Received — Verification Pending',
      message: `Your deposit request of $${amount.toLocaleString()} via ${method} has been received. Reference: ${refNumber}. We are verifying details.`,
      type: 'info',
      is_read: false,
    });

    // 6. Send Deposit Pending Email
    if (email) {
      await sendDepositPendingEmail(fullName, email, amount, method);
    }

    return NextResponse.json({
      success: true,
      depositId: deposit.id,
      referenceNumber: refNumber,
      message: 'Deposit request submitted successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create Deposit Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
