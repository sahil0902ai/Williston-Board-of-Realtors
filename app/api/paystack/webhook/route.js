import { NextResponse } from 'next/server'
import { verifyPaystackWebhook } from '@/lib/paystack'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendDepositConfirmedEmail } from '@/lib/emails'

export const runtime = 'nodejs'

export async function POST(req) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-paystack-signature') || ''

    if (!verifyPaystackWebhook(rawBody, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(rawBody)

    if (event.event === 'charge.success') {
      const charge = event.data
      const reference = charge.reference
      const amount = charge.amount / 100 // Convert from kobo
      const userId = charge.metadata?.userId
      const planName = charge.metadata?.planName

      // Update deposit
      await supabaseAdmin
        .from('deposits')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          transaction_hash: charge.id.toString(),
          notes: `Paid via ${charge.channel} — ${planName}`,
        })
        .eq('bank_reference', reference)

      // Credit wallet
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
          description: `Paystack — ${charge.channel} — ${planName}`,
          reference,
          status: 'completed',
        })

        await supabaseAdmin.from('notifications').insert({
          user_id: userId,
          title: '✅ Deposit Confirmed!',
          message: `₦${amount.toLocaleString()} deposited via ${charge.channel} and added to your wallet.`,
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

        // Notify admin on Telegram
        await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/notify-admin`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message:
                `✅ PAYSTACK DEPOSIT CONFIRMED\n\n` +
                `👤 User: ${user.full_name}\n` +
                `💰 Amount: ₦${amount.toLocaleString()}\n` +
                `💳 Channel: ${charge.channel}\n` +
                `📋 Plan: ${planName}\n` +
                `🔗 Reference: ${reference}\n` +
                `💼 New Balance: ₦${newBalance.toLocaleString()}`,
            }),
          }
        )
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Paystack webhook error:', err)
    return NextResponse.json({ received: true })
  }
}
