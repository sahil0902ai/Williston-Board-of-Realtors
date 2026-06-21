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

    const { data: investments, error } = await supabaseAdmin
      .from('investments')
      .select(`
        *,
        users(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = investments?.map((inv: any) => ({
      id: inv.id,
      userId: inv.user_id,
      userName: inv.users?.full_name || 'Anonymous',
      userEmail: inv.users?.email || '',
      planName: inv.plan_name,
      amount: parseFloat(inv.amount),
      roi: parseFloat(inv.roi_percent),
      startDate: new Date(inv.start_date).toLocaleDateString(),
      endDate: new Date(inv.end_date).toLocaleDateString(),
      status: inv.status, // active or matured
      dailyProfit: parseFloat(inv.daily_profit || 0)
    })) || [];

    return NextResponse.json({ success: true, investments: mapped }, { status: 200 });
  } catch (error: any) {
    console.error('List Investments Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
