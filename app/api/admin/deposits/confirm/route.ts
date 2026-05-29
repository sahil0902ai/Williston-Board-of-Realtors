import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest, getAuthenticatedUser } from '@/lib/auth-helper';
import { sendDepositConfirmedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const body = await request.json();
    const { depositId, adminId: rawAdminId, action, rejectionReason } = body;

    if (!depositId || !action) {
      return NextResponse.json({ error: 'Deposit ID and action (confirm/reject) are required' }, { status: 400 });
    }

    let adminId = rawAdminId;
    if (!adminId) {
      const user = await getAuthenticatedUser(request);
      adminId = user?.id || null;
    }

    // 1. Fetch deposit record
    const { data: deposit, error: fetchError } = await supabaseAdmin
      .from('deposits')
      .select('*')
      .eq('id', depositId)
      .single();

    if (fetchError || !deposit) {
      return NextResponse.json({ error: 'Deposit record not found' }, { status: 404 });
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json({ error: 'This deposit has already been processed' }, { status: 400 });
    }

    const userId = deposit.user_id;
    const amount = parseFloat(deposit.amount as any);

    // 2. Fetch User Profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('wallet_balance, full_name, email')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Recipient user profile not found' }, { status: 404 });
    }

    const currentBalance = parseFloat(profile.wallet_balance as any);

    if (action === 'confirm') {
      // Confirm deposit Flow
      const newBalance = currentBalance + amount;

      // Update deposit status
      await supabaseAdmin
        .from('deposits')
        .update({
          status: 'confirmed',
          confirmed_by: adminId,
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', depositId);

      // Credit user wallet balance
      await supabaseAdmin
        .from('users')
        .update({ wallet_balance: newBalance })
        .eq('id', userId);

      // Log transaction for user
      await supabaseAdmin.from('transactions').insert({
        user_id: userId,
        type: 'deposit',
        amount: amount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: `Deposit via ${deposit.method} confirmed by administration`,
        reference: `DEP-${depositId.substring(0, 8).toUpperCase()}`,
        status: 'completed',
      });

      // Send User notification
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: 'Deposit Confirmed ✅',
        message: `Your deposit of $${amount.toLocaleString()} has been verified and credited to your wallet balance.`,
        type: 'success',
        is_read: false,
      });

      // Send confirmation email
      await sendDepositConfirmedEmail(profile.full_name, profile.email, amount, newBalance);

    } else if (action === 'reject') {
      // Reject deposit Flow
      const reason = rejectionReason || 'Invalid payment receipt or references mismatch';

      await supabaseAdmin
        .from('deposits')
        .update({
          status: 'rejected',
          notes: reason,
        })
        .eq('id', depositId);

      // Send rejection notification
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: 'Deposit Rejected ❌',
        message: `Your deposit request of $${amount.toLocaleString()} was rejected. Reason: ${reason}.`,
        type: 'error',
        is_read: false,
      });

    } else {
      return NextResponse.json({ error: 'Invalid action. Must be confirm or reject' }, { status: 400 });
    }

    // 3. Log Admin Action
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: adminId,
      action: `${action.toUpperCase()}_DEPOSIT`,
      target_table: 'deposits',
      target_id: depositId,
      details: { amount, action, rejectionReason },
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: `Deposit successfully ${action === 'confirm' ? 'confirmed' : 'rejected'}`,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Confirm Deposit API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
