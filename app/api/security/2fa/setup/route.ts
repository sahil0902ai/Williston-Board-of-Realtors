import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and email are required' }, { status: 400 });
    }

    // 1. Generate Speakeasy Secret
    const secret = speakeasy.generateSecret({
      name: `Williston Investments (${email})`,
      issuer: 'Williston Board of Realtors',
    });

    if (!secret.otpauth_url) {
      return NextResponse.json({ error: 'Failed to generate 2FA auth URL' }, { status: 500 });
    }

    // 2. Generate base64 QR Code Data URL
    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    // 3. Save secret to users table (base32 string)
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .update({
        two_fa_secret: secret.base32,
      })
      .eq('id', userId);

    if (dbError) {
      return NextResponse.json({ error: `Database update failed: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
    }, { status: 200 });

  } catch (error: any) {
    console.error('2FA Setup Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
