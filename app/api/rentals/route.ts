import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: rentals, error } = await supabaseAdmin
      .from('rentals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(rentals || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apartmentType, guestName, guestEmail, guestPhone, checkinDate, checkoutDate, durationType, totalPrice } = body;

    if (!apartmentType || !guestName || !guestEmail || !checkinDate || !checkoutDate) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const { data: rental, error } = await supabaseAdmin
      .from('rentals')
      .insert({
        apartment_type: apartmentType,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone || null,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        duration_type: durationType || 'daily',
        total_price: totalPrice || 0,
        status: 'pending'
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, rental }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const isAdmin = await isAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing rental id or status' }, { status: 400 });
    }

    const allowedStatuses = ['pending', 'confirmed', 'checked_in', 'checked_out'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data: rental, error } = await supabaseAdmin
      .from('rentals')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, rental });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await isAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing rental id' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('rentals')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

