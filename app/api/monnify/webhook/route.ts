import { NextResponse } from 'next/server';
import { verifyMonnifyWebhook } from '@/lib/monnify';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendDepositConfirmedEmail } from '@/lib/emails';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('monnify-signature') || '';

    if (!verifyMonnifyWebhook(rawBody, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    if (event.eventType === 'SUCCESSFUL_TRANSACTION') {
      const data = event.eventData;
      const amount = Number(data.amountPaid);
      const accountReference = data.product?.reference;

      // Find which user owns this account
      const { data: account, error: accountError } = await supabaseAdmin
        .from('monnify_accounts')
        .select('user_id')
        .eq('account_reference', accountReference)
        .maybeSingle();

      if (accountError || !account) {
        console.error(`Monnify Webhook: account not found for reference ${accountReference}`, accountError);
        return NextResponse.json({ received: true });
      }

      const userId = account.user_id;

      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('wallet_balance, full_name, email')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        console.error(`Monnify Webhook: user not found for ID ${userId}`, userError);
        return NextResponse.json({ received: true });
      }

      const currentBalance = Number(user.wallet_balance || 0);
      const newBalance = currentBalance + amount;

      // Update user wallet balance
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ wallet_balance: newBalance })
        .eq('id', userId);

      if (updateError) {
        console.error(`Monnify Webhook: Failed to update user balance for ID ${userId}`, updateError);
        return NextResponse.json({ received: true });
      }

      // Record deposit in deposits table (for user's deposit history)
      const { error: depositError } = await supabaseAdmin.from('deposits').insert({
        user_id: userId,
        amount,
        method: 'Monnify Virtual Account',
        bank_reference: data.transactionReference,
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        notes: `Monnify virtual account deposit. Bank: ${data.destinationAccountInformation?.bankName || 'Wema Bank'}`,
      });

      if (depositError) {
        console.error(`Monnify Webhook: Failed to record deposit for ID ${userId}`, depositError);
      }

      // Record in transactions table
      const { error: txError } = await supabaseAdmin.from('transactions').insert({
        user_id: userId,
        type: 'deposit',
        amount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: `Monnify bank transfer — auto-confirmed`,
        reference: data.transactionReference,
        status: 'completed',
      });

      if (txError) {
        console.error(`Monnify Webhook: Failed to record transaction for ID ${userId}`, txError);
      }

      // Insert notification for the user
      const { error: notifError } = await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: '✅ Deposit Confirmed Automatically!',
        message: `₦${amount.toLocaleString()} received and credited to your wallet instantly.`,
        type: 'success',
      });

      if (notifError) {
        console.error(`Monnify Webhook: Failed to insert user notification`, notifError);
      }

      // Send email notification to user
      try {
        if (user.email) {
          await sendDepositConfirmedEmail({
            name: user.full_name || 'Investor',
            email: user.email,
            amount: amount,
            newBalance: newBalance,
          });
        }
      } catch (emailErr) {
        console.error('Monnify Webhook: deposit confirmation email error:', emailErr);
      }

      // Notify admin (Telegram/WhatsApp via notify-admin endpoint)
      try {
        const adminNotifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notify-admin`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message:
                `✅ AUTO-CONFIRMED DEPOSIT (Monnify)\n\n` +
                `👤 User: ${user.full_name}\n` +
                `💰 Amount: ₦${amount.toLocaleString()}\n` +
                `💼 New Balance: ₦${newBalance.toLocaleString()}\n\n` +
                `No action needed — already credited.`,
            }),
          }
        );
        if (!adminNotifyRes.ok) {
          const errMsg = await adminNotifyRes.text();
          console.error(`Monnify Webhook: Admin notification failed: ${errMsg}`);
        }
      } catch (notifErr) {
        console.error('Monnify Webhook: Admin notification request failed:', notifErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Monnify webhook error:', err);
    return NextResponse.json({ received: true });
  }
}
