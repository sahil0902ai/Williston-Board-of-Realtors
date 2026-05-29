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

    const { data: properties, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(properties || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyName, address, city, state, type, priceUsd, purchaseDate, status, progressPercent, estimatedCompletion } = body;

    if (!propertyName || !address) {
      return NextResponse.json({ error: 'Property name and address are required' }, { status: 400 });
    }

    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .insert({
        user_id: user.id,
        property_name: propertyName,
        address,
        city: city || null,
        state: state || null,
        type: type || 'standard',
        price_usd: priceUsd || 0,
        purchase_date: purchaseDate || new Date().toISOString().split('T')[0],
        status: status || 'payment_confirmed',
        progress_percent: progressPercent || 0,
        estimated_completion: estimatedCompletion || null
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, property }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
