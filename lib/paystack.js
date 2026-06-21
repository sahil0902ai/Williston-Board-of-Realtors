const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_BASE = 'https://api.paystack.co'

// Initialize a Paystack transaction
export async function initializePaystack({
  email,
  amount,
  userId,
  planName,
  reference,
}) {
  const response = await fetch(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        // Paystack amount is in kobo (multiply by 100)
        amount: Math.round(amount * 100),
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/deposit/success`,
        metadata: {
          userId,
          planName,
          custom_fields: [
            {
              display_name: 'Investment Plan',
              variable_name: 'plan_name',
              value: planName,
            },
            {
              display_name: 'User ID',
              variable_name: 'user_id',
              value: userId,
            },
          ],
        },
        channels: [
          'card',
          'bank',
          'ussd',
          'bank_transfer',
          'mobile_money',
          'qr',
        ],
        currency: 'NGN',
      }),
    }
  )

  const data = await response.json()

  if (!data.status) {
    throw new Error(data.message || 'Paystack initialization failed')
  }

  return data.data
}

// Verify a Paystack transaction
export async function verifyPaystack(reference) {
  const response = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    }
  )

  const data = await response.json()

  if (!data.status) {
    throw new Error(data.message || 'Verification failed')
  }

  return data.data
}

// Verify Paystack webhook
import crypto from 'crypto'

export function verifyPaystackWebhook(rawBody, signature) {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET || '')
    .update(rawBody)
    .digest('hex')
  return hash === signature
}
