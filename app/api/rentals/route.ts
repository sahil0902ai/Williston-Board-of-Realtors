import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

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
