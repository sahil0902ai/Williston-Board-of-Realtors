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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    // Calculate ranges for pagination in Supabase
    const fromIndex = (page - 1) * limit;
    const toIndex = fromIndex + limit - 1;

    let query = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' });

    // Apply Search filter (Full Name or Email)
    if (search.trim() !== '') {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply status filter (e.g. active, suspended)
    if (status !== 'all') {
      query = query.eq('account_status', status.toLowerCase());
    }

    // Sort by created_at descending
    query = query.order('created_at', { ascending: false }).range(fromIndex, toIndex);

    const { data: users, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      users: users || [],
      totalCount,
      page,
      totalPages,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Admin List Users Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
