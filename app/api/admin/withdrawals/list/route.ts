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

    const { data: withdrawals, error } = await supabaseAdmin
      .from('withdrawals')
      .select(`
        *,
        users(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map to match frontend expected fields
    const mapped = withdrawals?.map((w: any) => ({
      id: w.id,
      investorName: w.users?.full_name || 'Anonymous',
      email: w.users?.email || '',
      amount: parseFloat(w.amount),
      method: w.method,
      bank: w.bank_name || '',
      accountNo: w.account_number || '',
      walletAddress: w.wallet_address || '',
      cashappTag: w.cashapp_tag || '',
      zelleEmail: w.zelle_email || '',
      date: new Date(w.created_at).toLocaleDateString(),
      status: w.status,
      fraudScore: w.fraud_score || 0,
      rejectedReason: w.rejected_reason || ''
    })) || [];

    return NextResponse.json({ success: true, withdrawals: mapped }, { status: 200 });

  } catch (error: any) {
    console.error('Admin List Withdrawals Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
