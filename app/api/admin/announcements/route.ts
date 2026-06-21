import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

// GET: Fetch all announcements (admin gets all, public gets active only via public policy)
export async function GET(request: Request) {
  try {
    const { data: announcements, error } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(announcements, { status: 200 });

  } catch (error: any) {
    console.error('GET Announcements Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new announcement
export async function POST(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, type, target } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const { data: announcement, error } = await supabaseAdmin
      .from('announcements')
      .insert({
        title,
        message,
        type: type || 'info',
        target: target || 'all',
        is_active: true,
      })
      .select('*')
      .single();

    if (error || !announcement) {
      return NextResponse.json({ error: `Failed to create announcement: ${error?.message}` }, { status: 500 });
    }

    // Propagate to targeted users' notification feeds
    try {
      let userIds: string[] = [];
      const targetStr = String(target).toLowerCase();

      if (targetStr === 'all' || targetStr === 'all users') {
        // Fetch all user IDs
        const { data: users } = await supabaseAdmin.from('users').select('id');
        userIds = users?.map(u => u.id) || [];
      } else if (targetStr === 'active investors') {
        // Fetch users with active investments
        const { data: investments } = await supabaseAdmin
          .from('investments')
          .select('user_id')
          .eq('status', 'active');
        userIds = [...new Set(investments?.map(i => i.user_id) || [])];
      } else if (targetStr === 'pending kyc') {
        // Fetch users whose KYC status is not approved
        const { data: users } = await supabaseAdmin
          .from('users')
          .select('id')
          .neq('kyc_status', 'approved');
        userIds = users?.map(u => u.id) || [];
      } else {
        // Specific plan (e.g., "Growth Plan", "Starter Plan", etc.)
        const { data: investments } = await supabaseAdmin
          .from('investments')
          .select('user_id')
          .eq('status', 'active')
          .ilike('plan_name', `%${target}%`);
        userIds = [...new Set(investments?.map(i => i.user_id) || [])];
      }

      if (userIds.length > 0) {
        const notificationsToInsert = userIds.map(uid => ({
          user_id: uid,
          title,
          message,
          type: type || 'info',
          is_read: false,
          is_broadcast: true
        }));

        // Insert notifications in batches of 100 to avoid query payload limits
        const batchSize = 100;
        for (let i = 0; i < notificationsToInsert.length; i += batchSize) {
          const batch = notificationsToInsert.slice(i, i + batchSize);
          await supabaseAdmin.from('notifications').insert(batch);
        }
      }
    } catch (propagationError) {
      console.error('Failed to propagate announcement to user feeds:', propagationError);
    }

    return NextResponse.json({
      success: true,
      announcement,
      message: 'Announcement successfully posted',
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST Announcement Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Deactivate an announcement
export async function PATCH(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const body = await request.json();
    const { announcementId, isActive } = body;

    if (!announcementId) {
      return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });
    }

    const { data: updatedAnnouncement, error } = await supabaseAdmin
      .from('announcements')
      .update({
        is_active: isActive !== undefined ? isActive : false,
      })
      .eq('id', announcementId)
      .select('*')
      .single();

    if (error || !updatedAnnouncement) {
      return NextResponse.json({ error: `Failed to deactivate announcement: ${error?.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      announcement: updatedAnnouncement,
      message: 'Announcement status successfully updated',
    }, { status: 200 });

  } catch (error: any) {
    console.error('PATCH Announcement Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
