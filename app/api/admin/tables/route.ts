import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const [
      usersRes,
      investmentsRes,
      transactionsRes,
      propertiesRes,
      referralsRes,
      notificationsRes,
      rentalsRes
    ] = await Promise.all([
      supabaseAdmin.from('users').select('*'),
      supabaseAdmin.from('investments').select('*'),
      supabaseAdmin.from('transactions').select('*'),
      supabaseAdmin.from('properties').select('*'),
      supabaseAdmin.from('referrals').select('*'),
      supabaseAdmin.from('notifications').select('*'),
      supabaseAdmin.from('rentals').select('*')
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: usersRes.data || [],
        investments: investmentsRes.data || [],
        transactions: transactionsRes.data || [],
        properties: propertiesRes.data || [],
        referrals: referralsRes.data || [],
        notifications: notificationsRes.data || [],
        rentals: rentalsRes.data || []
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
