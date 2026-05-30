import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

// GET all properties from the catalog
export async function GET() {
  try {
    const { data: properties, error } = await supabaseAdmin
      .from('property_catalog')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(properties || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new property to catalog (Admin only)
export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, location, type, type_display, price, roi, status, image_url } = body;

    if (!name || !location || !type || !price || !roi || !status) {
      return NextResponse.json({ error: 'Missing required property catalog fields' }, { status: 400 });
    }

    const { data: property, error } = await supabaseAdmin
      .from('property_catalog')
      .insert({
        name,
        location,
        type,
        type_display: type_display || type,
        price,
        roi,
        status,
        image_url: image_url || null
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

// DELETE: Remove property from catalog (Admin only)
export async function DELETE(request: Request) {
  try {
    const isAdmin = await isAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      // Check body as fallback
      try {
        const body = await request.json();
        id = body.id;
      } catch (e) {
        // Body was empty or invalid JSON
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing property id' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('property_catalog')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
