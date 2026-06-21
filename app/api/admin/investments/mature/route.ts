import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest, getAuthenticatedUser } from '@/lib/auth-helper';
import { sendMaturedEmail } from '@/lib/emails';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const body = await request.json();
    const { investmentId } = body;

    if (!investmentId) {
      return NextResponse.json({ error: 'Investment ID is required' }, { status: 400 });
    }

    let adminId = null;
    const user = await getAuthenticatedUser(request);
    adminId = user?.id || null;

    // 1. Fetch investment record
    const { data: investment, error: fetchError } = await supabaseAdmin
      .from('investments')
      .select('*')
      .eq('id', investmentId)
      .single();

    if (fetchError || !investment) {
      return NextResponse.json({ error: 'Investment record not found' }, { status: 404 });
    }

    if (investment.status !== 'active') {
      return NextResponse.json({ error: `This investment is already ${investment.status}` }, { status: 400 });
    }

    const { user_id, plan_name, amount, total_profit, total_return } = investment;
    const principal = parseFloat(amount as any);
    const profit = parseFloat(total_profit as any);
    const totalRet = parseFloat(total_return as any);

    // 2. Fetch User Profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('wallet_balance, total_returns, full_name, email')
      .eq('id', user_id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const currentBalance = parseFloat(userProfile.wallet_balance as any);
    const currentReturns = parseFloat(userProfile.total_returns as any);

    const newBalance = currentBalance + totalRet;
    const newReturns = currentReturns + profit;

    // 3. Update User Wallet and Returns
    const { error: userUpdateError } = await supabaseAdmin
      .from('users')
      .update({
        wallet_balance: newBalance,
        total_returns: newReturns,
      })
      .eq('id', user_id);

    if (userUpdateError) {
      return NextResponse.json({ error: `Failed to update user wallet: ${userUpdateError.message}` }, { status: 500 });
    }

    // 4. Update Investment Status
    const { error: investUpdateError } = await supabaseAdmin
      .from('investments')
      .update({ status: 'matured' })
      .eq('id', investmentId);

    if (investUpdateError) {
      // Rollback user balance
      await supabaseAdmin
        .from('users')
        .update({
          wallet_balance: currentBalance,
          total_returns: currentReturns,
        })
        .eq('id', user_id);
      return NextResponse.json({ error: `Failed to update investment status: ${investUpdateError.message}` }, { status: 500 });
    }

    // 5. Log Return Transaction
    await supabaseAdmin.from('transactions').insert({
      user_id: user_id,
      type: 'return',
      amount: totalRet,
      balance_before: currentBalance,
      balance_after: newBalance,
      description: `Manual maturity return payout for ${plan_name} cycle by Admin`,
      reference: `RET-${investmentId.substring(0, 8).toUpperCase()}`,
      status: 'completed',
    });

    // 6. Send Notification to User
    await supabaseAdmin.from('notifications').insert({
      user_id: user_id,
      title: 'Investment Matured! 🎉',
      message: `Your investment in ${plan_name} has matured. $${totalRet.toLocaleString()} has been credited to your wallet balance.`,
      type: 'success',
      is_read: false,
    });

    // 7. Send Email to User
    try {
      await sendMaturedEmail({
        name: userProfile.full_name,
        email: userProfile.email,
        plan: plan_name,
        principal,
        profit,
        total: totalRet,
      });
    } catch (emailErr) {
      console.error('Email notify failed:', emailErr);
    }

    // 8. Log Admin Action
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: adminId,
      action: 'MANUAL_MATURE_INVESTMENT',
      target_table: 'investments',
      target_id: investmentId,
      details: { investmentId, userName: userProfile.full_name, amount: totalRet },
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: `Investment successfully matured and returns credited.`,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Manual Mature Investment Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
