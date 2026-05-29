import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest, getAuthenticatedUser } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const body = await request.json();
    const { userId, status, reason } = body;

    if (!userId || !status) {
      return NextResponse.json({ error: 'User ID and status (active/suspended) are required' }, { status: 400 });
    }

    if (status !== 'active' && status !== 'suspended') {
      return NextResponse.json({ error: 'Status must be active or suspended' }, { status: 400 });
    }

    let adminId = null;
    const user = await getAuthenticatedUser(request);
    adminId = user?.id || null;

    // 1. Fetch user to verify they exist
    const { data: userProfile, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('full_name, email')
      .eq('id', userId)
      .single();

    if (fetchError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Update account status
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .update({
        account_status: status,
      })
      .eq('id', userId);

    if (dbError) {
      return NextResponse.json({ error: `Database update failed: ${dbError.message}` }, { status: 500 });
    }

    // 3. Send Notification to User
    const notes = reason || (status === 'suspended' ? 'Administrative suspension' : 'Administrative account activation');
    
    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: status === 'suspended' ? 'Account Suspended ⚠️' : 'Account Re-activated ✅',
      message: status === 'suspended' 
        ? `Your investor account has been suspended. Reason: ${notes}. Contact support to resolve.` 
        : 'Your investor account has been successfully re-activated. You can resume full platform activities.',
      type: status === 'suspended' ? 'error' : 'success',
      is_read: false,
    });

    // 4. Log admin action
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: adminId,
      action: `${status.toUpperCase()}_USER_ACCOUNT`,
      target_table: 'users',
      target_id: userId,
      details: { status, reason: notes },
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: `User account successfully ${status === 'suspended' ? 'suspended' : 'activated'}`,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Update Status Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
