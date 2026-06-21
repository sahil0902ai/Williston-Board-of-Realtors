import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

// GET: Generate a new 2FA secret and return QR code Data URL
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Williston Investments';
    const secret = speakeasy.generateSecret({
      name: `${appName}:${user.email}`,
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCodeUrl,
    });

  } catch (error: any) {
    console.error('GET 2FA Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Verify token and enable 2FA
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { token, secret } = body;

    if (!token || !secret) {
      return NextResponse.json({ error: 'Token and secret are required' }, { status: 400 });
    }

    // Verify code
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token.trim(),
      window: 1,
    });

    if (!verified) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Update users table in db
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .update({
        two_fa_enabled: true,
        two_fa_secret: secret,
      })
      .eq('id', user.id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Generate 8 backup codes
    const backupCodes = Array.from({ length: 8 }).map(() =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // Save backup codes to user metadata in auth schema
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { user_metadata: { ...user.user_metadata, backup_codes: backupCodes } }
    );

    if (authError) {
      console.error('Failed to save backup codes to auth metadata:', authError.message);
    }

    // Add notification
    await supabaseAdmin.from('notifications').insert({
      user_id: user.id,
      title: 'Two-Factor Authentication Enabled',
      message: 'Your account is now secured with two-factor authentication (2FA). Keep your backup codes safe.',
      type: 'success',
      is_read: false,
    });

    return NextResponse.json({
      success: true,
      backupCodes,
    });

  } catch (error: any) {
    console.error('POST 2FA Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Disable 2FA
export async function DELETE(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let token = '';
    try {
      const body = await request.json();
      token = body.token;
    } catch (e) {
      // Body might be empty
    }

    // Verify code before disabling if user has 2FA enabled
    const { data: profile, error: dbError } = await supabaseAdmin
      .from('users')
      .select('two_fa_enabled, two_fa_secret')
      .eq('id', user.id)
      .single();

    if (dbError || !profile) {
      return NextResponse.json({ error: dbError?.message || 'Profile not found' }, { status: 404 });
    }

    if (profile.two_fa_enabled && profile.two_fa_secret && token) {
      const verified = speakeasy.totp.verify({
        secret: profile.two_fa_secret,
        encoding: 'base32',
        token: token.trim(),
        window: 1,
      });

      if (!verified) {
        return NextResponse.json({ error: 'Invalid 2FA code. Access denied.' }, { status: 400 });
      }
    }

    // Disable 2FA in db
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        two_fa_enabled: false,
        two_fa_secret: null,
      })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Clear backup codes in user metadata
    const cleanMeta = { ...user.user_metadata };
    delete cleanMeta.backup_codes;
    await supabaseAdmin.auth.admin.updateUserById(user.id, { user_metadata: cleanMeta });

    // Add notification
    await supabaseAdmin.from('notifications').insert({
      user_id: user.id,
      title: 'Two-Factor Authentication Disabled',
      message: 'Two-factor authentication (2FA) has been disabled for your account.',
      type: 'warning',
      is_read: false,
    });

    return NextResponse.json({
      success: true,
      message: '2FA disabled successfully',
    });

  } catch (error: any) {
    console.error('DELETE 2FA Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
