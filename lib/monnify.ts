import crypto from 'crypto';

const MONNIFY_BASE = process.env.MONNIFY_BASE_URL || 'https://api.monnify.com';
const MONNIFY_API_KEY = process.env.MONNIFY_API_KEY || '';
const MONNIFY_SECRET_KEY = process.env.MONNIFY_SECRET_KEY || '';
const MONNIFY_CONTRACT_CODE = process.env.MONNIFY_CONTRACT_CODE || '';

// Get auth token from Monnify
export async function getMonnifyToken(): Promise<string> {
  const credentials = Buffer.from(
    `${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`
  ).toString('base64');

  const response = await fetch(
    `${MONNIFY_BASE}/api/v1/auth/login`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Monnify authentication failed: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  if (!data.requestSuccessful || !data.responseBody || !data.responseBody.accessToken) {
    throw new Error(data.responseMessage || 'Failed to authenticate with Monnify');
  }
  return data.responseBody.accessToken;
}

export interface CreateReservedAccountParams {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

// Create a reserved virtual account for a user
// Each investor gets their OWN unique account number
export async function createReservedAccount({
  userId,
  userName,
  userEmail,
  userPhone,
}: CreateReservedAccountParams) {
  const token = await getMonnifyToken();

  const response = await fetch(
    `${MONNIFY_BASE}/api/v2/bank-transfer/reserved-accounts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountReference: `WBR-${userId}`,
        accountName: `Williston - ${userName}`,
        currencyCode: 'NGN',
        contractCode: MONNIFY_CONTRACT_CODE,
        customerEmail: userEmail,
        customerName: userName,
        getAllAvailableBanks: true,
      }),
    }
  );

  const data = await response.json();

  if (!data.requestSuccessful) {
    throw new Error(data.responseMessage || 'Failed to create account');
  }

  return data.responseBody;
}

// Verify webhook signature from Monnify
export function verifyMonnifyWebhook(rawBody: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha512', MONNIFY_SECRET_KEY)
    .update(rawBody)
    .digest('hex');
  return hash === signature;
}
