import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

// GET: Fetch all notifications and unread count
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch user notifications or broadcasts
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${user.id},is_broadcast.eq.true`)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Count unread
    const unreadCount = notifications ? notifications.filter((n: any) => !n.is_read).length : 0;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    }, { status: 200 });

  } catch (error: any) {
    console.error('GET Notifications Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Mark notification(s) as read
export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAll } = body;

    if (!notificationId && !markAll) {
      return NextResponse.json({ error: 'Notification ID or markAll flag is required' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('notifications')
      .update({ is_read: true });

    if (markAll) {
      // Mark all user notifications as read
      query = query.eq('user_id', user.id);
    } else {
      // Mark specific notification as read
      query = query.eq('id', notificationId).eq('user_id', user.id);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: markAll ? 'All notifications marked as read' : 'Notification marked as read',
    }, { status: 200 });

  } catch (error: any) {
    console.error('PATCH Notifications Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
