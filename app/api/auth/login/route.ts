import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import speakeasy from 'speakeasy';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  let requestBody: any = {};
  
  try {
    requestBody = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  const { email, password, totpToken } = requestBody;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ynvgmpasrogjdpjpiqie.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mockAnonKey';
    const cookieStore = await cookies();

    const supabaseServer = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore
            }
          },
        },
      }
    );

    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      // Log failed attempt to fraud logs
      await supabaseAdmin.from('fraud_logs').insert({
        event_type: 'failed_login',
        ip_address: ip,
        details: { email, error: authError?.message || 'Invalid credentials' },
        risk_score: 15,
      });

      return NextResponse.json({ error: authError?.message || 'Invalid credentials' }, { status: 401 });
    }

    const userId = authData.user.id;

    // 2. Fetch User Profile status and 2FA settings
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('account_status, two_fa_enabled, two_fa_secret')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // 3. Check Account Status
    if (profile.account_status !== 'active') {
      await supabaseServer.auth.signOut();
      return NextResponse.json({ error: 'Your account has been suspended. Contact support.' }, { status: 403 });
    }

    // 4. Check 2FA Requirements
    if (profile.two_fa_enabled) {
      if (!totpToken) {
        // Sign out to prevent incomplete session hijacking
        await supabaseServer.auth.signOut();
        return NextResponse.json({
          two_fa_required: true,
          userId,
          message: '2FA verification code required',
        }, { status: 200 }); // Return 200 with 2fa flag to prompt frontend TOTP modal
      }

      // Verify Speakeasy token
      const verified = speakeasy.totp.verify({
        secret: profile.two_fa_secret,
        encoding: 'base32',
        token: totpToken.trim(),
        window: 2,
      });

      if (!verified) {
        await supabaseServer.auth.signOut();
        await supabaseAdmin.from('fraud_logs').insert({
          user_id: userId,
          event_type: 'failed_2fa_verification',
          ip_address: ip,
          details: { email },
          risk_score: 40,
        });

        return NextResponse.json({ error: 'Invalid 2FA code. Access denied.' }, { status: 401 });
      }
    }

    // 5. Update last login records
    await supabaseAdmin
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        login_ip: ip,
      })
      .eq('id', userId);

    return NextResponse.json({
      success: true,
      session: authData.session,
      user: {
        id: userId,
        email: authData.user.email,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
