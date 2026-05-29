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
    const { ticketId, adminId: rawAdminId, reply } = body;

    if (!ticketId || !reply) {
      return NextResponse.json({ error: 'Ticket ID and reply message are required' }, { status: 400 });
    }

    let adminId = rawAdminId;
    if (!adminId) {
      const user = await getAuthenticatedUser(request);
      adminId = user?.id || null;
    }

    // 1. Fetch ticket to get user_id
    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
    }

    // 2. Update Ticket Reply details
    const { error: dbError } = await supabaseAdmin
      .from('support_tickets')
      .update({
        admin_reply: reply,
        replied_at: new Date().toISOString(),
        status: 'replied',
      })
      .eq('id', ticketId);

    if (dbError) {
      return NextResponse.json({ error: `Database update failed: ${dbError.message}` }, { status: 500 });
    }

    // 3. Send Notification to user
    await supabaseAdmin.from('notifications').insert({
      user_id: ticket.user_id,
      title: 'New Support Ticket Reply 📩',
      message: `Admin has replied to your support ticket: "${ticket.subject}". Check support portal to view details.`,
      type: 'info',
      is_read: false,
    });

    // 4. Log admin action
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: adminId,
      action: 'REPLY_SUPPORT_TICKET',
      target_table: 'support_tickets',
      target_id: ticketId,
      details: { reply_snippet: reply.substring(0, 100) },
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Reply submitted and user notified successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Support Reply API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
