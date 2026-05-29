import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

// GET: Fetch all investment plans (including inactive ones)
export async function GET(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const { data: plans, error } = await supabaseAdmin
      .from('investment_plans')
      .select('*')
      .order('min_deposit', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(plans, { status: 200 });

  } catch (error: any) {
    console.error('GET Plans Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new investment plan
export async function POST(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, roi_percent, duration_days, min_deposit, max_deposit, is_active, is_featured, icon } = body;

    if (!name || roi_percent === undefined || duration_days === undefined || min_deposit === undefined) {
      return NextResponse.json({ error: 'Plan name, ROI, duration, and minimum deposit are required' }, { status: 400 });
    }

    const { data: newPlan, error } = await supabaseAdmin
      .from('investment_plans')
      .insert({
        name,
        description: description || null,
        roi_percent: parseFloat(roi_percent),
        duration_days: parseInt(duration_days),
        min_deposit: parseFloat(min_deposit),
        max_deposit: max_deposit ? parseFloat(max_deposit) : null,
        is_active: is_active !== undefined ? is_active : true,
        is_featured: is_featured !== undefined ? is_featured : false,
        icon: icon || '💼',
      })
      .select('*')
      .single();

    if (error || !newPlan) {
      return NextResponse.json({ error: `Failed to create plan: ${error?.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      plan: newPlan,
      message: 'Investment plan successfully created',
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST Plan Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update plan fields
export async function PATCH(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const body = await request.json();
    const { planId, name, description, roi_percent, duration_days, min_deposit, max_deposit, is_active, is_featured, icon } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required for updates' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (roi_percent !== undefined) updateData.roi_percent = parseFloat(roi_percent);
    if (duration_days !== undefined) updateData.duration_days = parseInt(duration_days);
    if (min_deposit !== undefined) updateData.min_deposit = parseFloat(min_deposit);
    if (max_deposit !== undefined) updateData.max_deposit = max_deposit ? parseFloat(max_deposit) : null;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (is_featured !== undefined) updateData.is_featured = is_featured;
    if (icon !== undefined) updateData.icon = icon;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields provided for updates' }, { status: 400 });
    }

    const { data: updatedPlan, error } = await supabaseAdmin
      .from('investment_plans')
      .update(updateData)
      .eq('id', planId)
      .select('*')
      .single();

    if (error || !updatedPlan) {
      return NextResponse.json({ error: `Update failed: ${error?.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      plan: updatedPlan,
      message: 'Investment plan successfully updated',
    }, { status: 200 });

  } catch (error: any) {
    console.error('PATCH Plan Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
