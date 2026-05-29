import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import speakeasy from 'speakeasy';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, token } = body;

    if (!userId || !token) {
      return NextResponse.json({ error: 'User ID and 6-digit verification code are required' }, { status: 400 });
    }

    // 1. Fetch User Profile to get stored secret
    const { data: profile, error: dbError } = await supabaseAdmin
      .from('users')
      .select('two_fa_secret')
      .eq('id', userId)
      .single();

    if (dbError || !profile || !profile.two_fa_secret) {
      return NextResponse.json({ error: '2FA has not been set up yet for this user' }, { status: 404 });
    }

    // 2. Verify token
    const verified = speakeasy.totp.verify({
      secret: profile.two_fa_secret,
      encoding: 'base32',
      token: token.trim(),
      window: 2, // Allow leeway for timing drift (2 * 30 seconds before/after)
    });

    if (!verified) {
      return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 400 });
    }

    // 3. Update profile to enable 2FA
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        two_fa_enabled: true,
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json({ error: `Failed to enable 2FA in database: ${updateError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '2FA enabled successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('2FA Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
