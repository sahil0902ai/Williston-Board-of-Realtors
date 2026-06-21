const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY
const FLW_BASE = 'https://api.flutterwave.com/v3'

// Initialize Flutterwave payment
export async function initializeFlutterwave({
  email,
  amount,
  userId,
  planName,
  userName,
  phone,
  txRef,
}) {
  const response = await fetch(`${FLW_BASE}/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${FLW_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount,
      currency: 'NGN',
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/deposit/success`,
      customer: {
        email,
        name: userName,
        phonenumber: phone,
      },
      meta: {
        userId,
        planName,
      },
      customizations: {
        title: 'Williston Investments',
        description: `Investment deposit — ${planName}`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      },
      payment_options: 'card,banktransfer,ussd,account,opay',
    }),
  })

  const data = await response.json()

  if (data.status !== 'success') {
    throw new Error(data.message || 'Flutterwave init failed')
  }

  return data.data
}

// Verify Flutterwave transaction
export async function verifyFlutterwave(transactionId) {
  const response = await fetch(
    `${FLW_BASE}/transactions/${transactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${FLW_SECRET}`,
      },
    }
  )

  const data = await response.json()

  if (data.status !== 'success') {
    throw new Error(data.message || 'Verification failed')
  }

  return data.data
}

// Verify Flutterwave webhook
export function verifyFlutterwaveWebhook(signature) {
  return signature === process.env.FLUTTERWAVE_WEBHOOK_HASH
}
