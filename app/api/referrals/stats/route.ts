import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch all referrals for this referrer
    const { data: referrals, error } = await supabaseAdmin
      .from('referrals')
      .select(`
        id,
        referred_id,
        level,
        commission_percent,
        commission_amount,
        status,
        created_at,
        users!referred_id (
          full_name,
          email
        )
      `)
      .eq('referrer_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Aggregate statistics
    let totalReferrals = 0;
    let totalEarned = 0;
    let pendingCommission = 0;
    const list: any[] = [];

    if (referrals) {
      totalReferrals = referrals.length;
      referrals.forEach((ref: any) => {
        const commAmt = parseFloat(ref.commission_amount || 0);
        if (ref.status === 'paid') {
          totalEarned += commAmt;
        } else if (ref.status === 'pending') {
          pendingCommission += commAmt;
        }

        const referredUser = ref.users as any;
        list.push({
          id: ref.id,
          name: referredUser?.full_name || 'Anonymous Investor',
          email: referredUser?.email || '',
          date: ref.created_at,
          commission: commAmt,
          status: ref.status,
          level: ref.level,
        });
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalReferrals,
        totalEarned,
        pendingCommission,
      },
      referralsList: list,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Referral Stats Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
