import { supabase } from './supabase'

/**
 * Register a new user profile via the backend API.
 * This runs on the client-side and invokes the backend rate-limit-bypassing registration flow.
 */
export async function registerUser({ fullName, email, password, phone, country, referralCode }) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName,
      email,
      password,
      phone,
      country,
      referralCode,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
}

/**
 * Log in a user via the backend API (verifies TOTP 2FA if enabled and logs IP/timestamps)
 * and then sets the session in the client-side Supabase Auth instance.
 */
export async function loginUser({ email, password, totpToken }) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      totpToken,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Set the session client-side in the Supabase JS instance
  if (data.session) {
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
    if (setSessionError) {
      console.error('Failed to set client-side session:', setSessionError.message);
    }
  }

  return data;
}

/**
 * Log out the user from the Supabase session.
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  // Clear any local next.js auth cookies via client logout endpoint
  await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
}

/**
 * Retrieve the current authenticated Supabase user.
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
