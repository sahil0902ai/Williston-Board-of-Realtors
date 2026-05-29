import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendWelcomeEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WBR-${result}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone, country, referralCode: usedReferralCode } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Full name, email, and password are required' }, { status: 400 });
    }

    // 1. Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || 'Authentication signup failed' }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Resolve Referrer if code used
    let referredBy: string | null = null;
    if (usedReferralCode) {
      const { data: referrerData, error: referrerError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('referral_code', usedReferralCode.trim().toUpperCase())
        .single();

      if (!referrerError && referrerData) {
        referredBy = referrerData.id;
      }
    }

    // 3. Generate Unique Referral Code
    let referralCode = generateReferralCode();
    let isCodeUnique = false;
    let attempts = 0;
    while (!isCodeUnique && attempts < 5) {
      const { data: codeCheck } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('referral_code', referralCode)
        .maybeSingle();

      if (!codeCheck) {
        isCodeUnique = true;
      } else {
        referralCode = generateReferralCode();
        attempts++;
      }
    }

    // 4. Create User Profile in database
    const passwordHash = await bcrypt.hash(password, 10);
    const { error: profileError } = await supabaseAdmin.from('users').insert({
      id: userId,
      full_name: fullName,
      email,
      phone: phone || null,
      country: country || 'United States',
      password_hash: passwordHash,
      referral_code: referralCode,
      referred_by: referredBy,
      kyc_status: 'pending',
      account_status: 'active',
      wallet_balance: 0.0,
      total_invested: 0.0,
      total_returns: 0.0,
      is_active: true,
    });

    if (profileError) {
      // Clean up Auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: `Profile creation failed: ${profileError.message}` }, { status: 500 });
    }

    // 5. Create Referral record if referred
    if (referredBy) {
      await supabaseAdmin.from('referrals').insert({
        referrer_id: referredBy,
        referred_id: userId,
        status: 'pending',
        level: 1,
        commission_percent: 5.0,
        commission_amount: 0.0,
      });
    }

    // 6. Welcome Notification
    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Welcome to Williston Board of Realtors & Investments!',
      message: `Your account has been successfully created. Your referral code is ${referralCode}. Complete verification to start investing.`,
      type: 'info',
      is_read: false,
      is_broadcast: false,
    });

    // 7. Send Welcome Email
    await sendWelcomeEmail(fullName, email, referralCode);

    return NextResponse.json({
      success: true,
      userId,
      referralCode,
      message: 'Registration successful',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
