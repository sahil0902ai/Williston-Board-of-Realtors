import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendWelcomeEmail } from '@/lib/emails';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WBR-${result}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  console.log('Auth callback query params:', Object.fromEntries(searchParams.entries()));
  
  const oauthError = searchParams.get('error');
  const oauthErrorDescription = searchParams.get('error_description');
  if (oauthError || oauthErrorDescription) {
    console.error('OAuth callback error parameter:', oauthError, oauthErrorDescription);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(oauthErrorDescription || oauthError || 'Authentication failed')}`);
  }

  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
              // Ignore if called in context where cookies can't be modified
            }
          },
        },
      }
    );

    const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError && exchangeData?.user) {
      const user = exchangeData.user;
      const email = user.email!;
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Google Investor';

      try {
        // Check if the user already has a profile in the public users table
        const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileCheckError) {
          console.error('Error checking user profile existence:', profileCheckError);
        }

        if (!existingProfile) {
          // New User! Let's generate a referral code and create their profile.
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

          const { error: insertError } = await supabaseAdmin.from('users').insert({
            id: user.id,
            full_name: fullName,
            email: email,
            phone: null,
            country: 'United States',
            password_hash: null, // OAuth users don't have local password hash
            referral_code: referralCode,
            referred_by: null,
            kyc_status: 'pending',
            account_status: 'active',
            wallet_balance: 0.0,
            total_invested: 0.0,
            total_returns: 0.0,
            is_active: true,
          });

          if (insertError) {
            console.error('Failed to create user profile in callback:', insertError.message);
          } else {
            // Welcome Notification
            await supabaseAdmin.from('notifications').insert({
              user_id: user.id,
              title: 'Welcome to Williston Board of Realtors & Investments!',
              message: `Your account has been successfully created via Google. Your referral code is ${referralCode}. Complete verification to start investing.`,
              type: 'info',
              is_read: false,
              is_broadcast: false,
            });

            // Send Welcome Email
            await sendWelcomeEmail({ name: fullName, email, referralCode }).catch((mailErr) => {
              console.error('Welcome email failed:', mailErr);
            });
          }
        }
      } catch (profileErr) {
        console.error('Exception during profile creation in callback:', profileErr);
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else if (exchangeError) {
      console.error('OAuth Code Exchange Error:', exchangeError.message);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Invalid auth callback parameters`);
}
