import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

// GET: Fetch all tickets for user
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: tickets, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(tickets, { status: 200 });

  } catch (error: any) {
    console.error('GET Support Tickets Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a support ticket
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message, category, priority } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject,
        message,
        category: category || 'general',
        priority: priority || 'normal',
        status: 'open',
      })
      .select('*')
      .single();

    if (error || !ticket) {
      return NextResponse.json({ error: `Failed to open support ticket: ${error?.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ticketId: ticket.id,
      message: 'Support ticket successfully created',
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST Support Ticket Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
