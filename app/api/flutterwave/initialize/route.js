import { NextResponse } from 'next/server'
import { initializeFlutterwave } from '@/lib/flutterwave'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
  try {
    const { userId, amount, planName } = await req.json()

    if (!amount || amount < 1000) {
      return NextResponse.json(
        { error: 'Minimum deposit is ₦1,000' },
        { status: 400 }
      )
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email, full_name, phone')
      .eq('id', userId)
      .single()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const txRef = 'WBR-FLW-' +
      uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()

    const transaction = await initializeFlutterwave({
      email: user.email,
      amount,
      userId,
      planName,
      userName: user.full_name,
      phone: user.phone || '',
      txRef,
    })

    // Save pending deposit
    await supabaseAdmin.from('deposits').insert({
      user_id: userId,
      amount,
      method: 'Flutterwave',
      bank_reference: txRef,
      status: 'pending',
      notes: `Plan: ${planName}`,
    })

    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: '⏳ Payment Initiated',
      message: `Complete your ₦${amount.toLocaleString()} payment on Flutterwave. Reference: ${txRef}`,
      type: 'info',
    })

    return NextResponse.json({
      success: true,
      link: transaction.link,
      txRef,
    })

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
