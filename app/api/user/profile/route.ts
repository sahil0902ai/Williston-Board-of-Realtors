import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

// GET: Fetch full user profile
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: error?.message || 'Profile not found' }, { status: 404 });
    }

    const dob = user.user_metadata?.dob || '';
    const preferred_currency = user.user_metadata?.preferred_currency || 'USD';
    const notification_settings = user.user_metadata?.notification_settings || null;

    return NextResponse.json({
      ...profile,
      dob,
      preferred_currency,
      notification_settings
    }, { status: 200 });

  } catch (error: any) {
    console.error('GET Profile Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update phone, country, avatar_url, full_name, dob, preferred_currency, notification_settings
export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phone, country, avatar_url, full_name, dob, preferred_currency, notification_settings } = body;

    // 1. Update public.users database fields if provided
    const updateData: any = {};
    if (phone !== undefined) updateData.phone = phone;
    if (country !== undefined) updateData.country = country;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (full_name !== undefined) updateData.full_name = full_name;

    let profile = null;

    if (Object.keys(updateData).length > 0) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      profile = data;
    } else {
      // If no users table columns are updated, select existing profile
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      profile = data;
    }

    // 2. Update auth user metadata for extra fields (dob, preferred_currency, notification_settings)
    const metaUpdates: any = {};
    if (dob !== undefined) metaUpdates.dob = dob;
    if (preferred_currency !== undefined) metaUpdates.preferred_currency = preferred_currency;
    if (full_name !== undefined) metaUpdates.full_name = full_name;
    if (notification_settings !== undefined) metaUpdates.notification_settings = notification_settings;

    let currentDob = user.user_metadata?.dob || '';
    let currentCurrency = user.user_metadata?.preferred_currency || 'USD';
    let currentNotifSettings = user.user_metadata?.notification_settings || null;

    if (Object.keys(metaUpdates).length > 0) {
      const newMetadata = { ...user.user_metadata, ...metaUpdates };
      const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { user_metadata: newMetadata }
      );
      if (metaError) {
        console.error('Failed to update user auth metadata:', metaError.message);
      } else {
        if (dob !== undefined) currentDob = dob;
        if (preferred_currency !== undefined) currentCurrency = preferred_currency;
        if (notification_settings !== undefined) currentNotifSettings = notification_settings;
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        dob: currentDob,
        preferred_currency: currentCurrency,
        notification_settings: currentNotifSettings
      },
      message: 'Profile updated successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('PATCH Profile Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
