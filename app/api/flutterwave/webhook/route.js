import { NextResponse } from 'next/server'
import { verifyFlutterwaveWebhook, verifyFlutterwave } from '@/lib/flutterwave'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendDepositConfirmedEmail } from '@/lib/emails'

export async function POST(req) {
  try {
    const signature = req.headers.get('verif-hash') || ''

    if (!verifyFlutterwaveWebhook(signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const body = await req.json()

    if (body.event === 'charge.completed' &&
        body.data.status === 'successful') {
      const transaction = await verifyFlutterwave(body.data.id)

      if (transaction.status === 'successful') {
        const amount = transaction.amount
        const userId = transaction.meta?.userId
        const planName = transaction.meta?.planName
        const txRef = transaction.tx_ref

        await supabaseAdmin
          .from('deposits')
          .update({
            status: 'confirmed',
            confirmed_at: new Date().toISOString(),
            transaction_hash: transaction.id.toString(),
            notes: `Paid via ${transaction.payment_type} — ${planName}`,
          })
          .eq('bank_reference', txRef)

        const { data: user } = await supabaseAdmin
          .from('users')
          .select('wallet_balance, full_name, email')
          .eq('id', userId)
          .single()

        if (user) {
          const newBalance = (user.wallet_balance || 0) + amount

          await supabaseAdmin
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('id', userId)

          await supabaseAdmin.from('transactions').insert({
            user_id: userId,
            type: 'deposit',
            amount,
            balance_before: user.wallet_balance,
            balance_after: newBalance,
            description: `Flutterwave — ${transaction.payment_type} — ${planName}`,
            reference: txRef,
            status: 'completed',
          })

          await supabaseAdmin.from('notifications').insert({
            user_id: userId,
            title: '✅ Deposit Confirmed!',
            message: `₦${amount.toLocaleString()} deposited via Flutterwave and added to your wallet.`,
            type: 'success',
          })

          // Send confirmation email
          try {
            if (user.email) {
              await sendDepositConfirmedEmail({
                name: user.full_name || 'Investor',
                email: user.email,
                amount: amount,
                newBalance: newBalance,
              })
            }
          } catch (emailErr) {
            console.error('Deposit confirmation email error:', emailErr)
          }

          await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/notify-admin`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message:
                  `✅ FLUTTERWAVE DEPOSIT\n\n` +
                  `👤 ${user.full_name}\n` +
                  `💰 ₦${amount.toLocaleString()}\n` +
                  `💳 ${transaction.payment_type}\n` +
                  `📋 ${planName}`,
              }),
            }
          )
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Flutterwave webhook error:', err)
    return NextResponse.json({ received: true })
  }
}
