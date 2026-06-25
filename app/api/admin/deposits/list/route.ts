import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const { data: deposits, error } = await supabaseAdmin
      .from('deposits')
      .select(`
        *,
        users(full_name, email, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map to include investorName and email directly for the frontend
    const mapped = deposits?.map((d: any) => ({
      id: d.id,
      investorName: d.users?.full_name || 'Anonymous',
      email: d.users?.email || '',
      phone: d.users?.phone || '',
      amount: parseFloat(d.amount),
      method: d.method,
      reference: d.transaction_hash || d.bank_reference || `DEP-${d.id.substring(0, 8).toUpperCase()}`,
      date: new Date(d.created_at).toLocaleDateString(),
      status: d.status,
      receipt: d.proof_url || null,
      notes: d.notes || '',
      is_flagged: d.is_flagged || false,
      flagged_reason: d.flagged_reason || null,
      created_at: d.created_at
    })) || [];

    return NextResponse.json({ success: true, deposits: mapped }, { status: 200 });

  } catch (error: any) {
    console.error('Admin List Deposits Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
