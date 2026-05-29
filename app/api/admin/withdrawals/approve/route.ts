import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest, getAuthenticatedUser } from '@/lib/auth-helper';
import { sendWithdrawalApprovedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const body = await request.json();
    const { withdrawalId, adminId: rawAdminId, action, rejectionReason } = body;

    if (!withdrawalId || !action) {
      return NextResponse.json({ error: 'Withdrawal ID and action (approve/reject) are required' }, { status: 400 });
    }

    let adminId = rawAdminId;
    if (!adminId) {
      const user = await getAuthenticatedUser(request);
      adminId = user?.id || null;
    }

    // 1. Fetch withdrawal record
    const { data: withdrawal, error: fetchError } = await supabaseAdmin
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single();

    if (fetchError || !withdrawal) {
      return NextResponse.json({ error: 'Withdrawal record not found' }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: 'This withdrawal request has already been processed' }, { status: 400 });
    }

    const userId = withdrawal.user_id;
    const amount = parseFloat(withdrawal.amount as any);

    // 2. Fetch User Profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('wallet_balance, full_name, email')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const currentBalance = parseFloat(profile.wallet_balance as any);

    if (action === 'approve') {
      // Approve Withdrawal Flow
      await supabaseAdmin
        .from('withdrawals')
        .update({
          status: 'approved',
          approved_by: adminId,
          approved_at: new Date().toISOString(),
        })
        .eq('id', withdrawalId);

      // Log transaction update: the hold was already debited, so we just log the final completed state of the transaction
      await supabaseAdmin.from('transactions').insert({
        user_id: userId,
        type: 'withdrawal',
        amount: -amount,
        balance_before: currentBalance + amount, // Balance before hold
        balance_after: currentBalance, // Current balance with held amount already deducted
        description: `Withdrawal request WD-${withdrawalId.substring(0, 8).toUpperCase()} processed and paid`,
        reference: `WD-${withdrawalId.substring(0, 8).toUpperCase()}`,
        status: 'completed',
      });

      // Send User notification
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: 'Withdrawal Request Approved 💸',
        message: `Your withdrawal request of $${amount.toLocaleString()} has been approved and sent to your ${withdrawal.method}.`,
        type: 'success',
        is_read: false,
      });

      // Send email
      await sendWithdrawalApprovedEmail(profile.full_name, profile.email, amount, withdrawal.method);

    } else if (action === 'reject') {
      // Reject Withdrawal Flow - Refund held amount
      const newBalance = currentBalance + amount;
      const reason = rejectionReason || 'Information verification failed or details mismatched';

      await supabaseAdmin
        .from('withdrawals')
        .update({
          status: 'rejected',
          rejected_reason: reason,
        })
        .eq('id', withdrawalId);

      // Refund user wallet balance
      await supabaseAdmin
        .from('users')
        .update({ wallet_balance: newBalance })
        .eq('id', userId);

      // Log refund transaction
      await supabaseAdmin.from('transactions').insert({
        user_id: userId,
        type: 'withdrawal_refund',
        amount: amount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: `Refund for rejected withdrawal request WD-${withdrawalId.substring(0, 8).toUpperCase()}`,
        reference: `REF-WD-${withdrawalId.substring(0, 8).toUpperCase()}`,
        status: 'completed',
      });

      // Send user notification
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: 'Withdrawal Request Rejected ❌',
        message: `Your withdrawal of $${amount.toLocaleString()} was rejected and refunded. Reason: ${reason}.`,
        type: 'error',
        is_read: false,
      });

    } else {
      return NextResponse.json({ error: 'Invalid action. Must be approve or reject' }, { status: 400 });
    }

    // 3. Log Admin Action
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: adminId,
      action: `${action.toUpperCase()}_WITHDRAWAL`,
      target_table: 'withdrawals',
      target_id: withdrawalId,
      details: { amount, action, rejectionReason },
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal successfully ${action === 'approve' ? 'approved' : 'rejected'}`,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Approve Withdrawal API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
