import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendMaturedEmail } from '@/lib/emails';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization Bearer Header
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET_KEY || 'williston_admin_secret_2025';
    
    if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch all active investments that have matured (end_date <= now)
    const now = new Date().toISOString();
    const { data: maturedInvestments, error: fetchError } = await supabaseAdmin
      .from('investments')
      .select('*')
      .eq('status', 'active')
      .lte('end_date', now);

    if (fetchError) {
      return NextResponse.json({ error: `Fetch failed: ${fetchError.message}` }, { status: 500 });
    }

    if (!maturedInvestments || maturedInvestments.length === 0) {
      return NextResponse.json({ success: true, processedCount: 0, message: 'No matured investments found' }, { status: 200 });
    }

    let processedCount = 0;

    // 3. Process each investment
    for (const investment of maturedInvestments) {
      const { user_id, plan_name, amount, total_profit, total_return, id: investmentId } = investment;
      const principal = parseFloat(amount as any);
      const profit = parseFloat(total_profit as any);
      const totalRet = parseFloat(total_return as any);

      // Fetch user profile
      const { data: userProfile, error: profileError } = await supabaseAdmin
        .from('users')
        .select('wallet_balance, total_returns, full_name, email')
        .eq('id', user_id)
        .single();

      if (profileError || !userProfile) {
        console.error(`Failed to fetch profile for user ${user_id} during investment ${investmentId} maturity processing`);
        continue; // Skip to next if user not found
      }

      const currentBalance = parseFloat(userProfile.wallet_balance as any);
      const currentReturns = parseFloat(userProfile.total_returns as any);

      const newBalance = currentBalance + totalRet;
      const newReturns = currentReturns + profit;

      // Update User Wallet and Returns
      const { error: userUpdateError } = await supabaseAdmin
        .from('users')
        .update({
          wallet_balance: newBalance,
          total_returns: newReturns,
        })
        .eq('id', user_id);

      if (userUpdateError) {
        console.error(`Failed to update wallet for user ${user_id} during investment ${investmentId} maturity processing`);
        continue;
      }

      // Update Investment Status
      const { error: investUpdateError } = await supabaseAdmin
        .from('investments')
        .update({ status: 'matured' })
        .eq('id', investmentId);

      if (investUpdateError) {
        console.error(`Failed to update status for investment ${investmentId}`);
        // Attempt to rollback user balance
        await supabaseAdmin
          .from('users')
          .update({
            wallet_balance: currentBalance,
            total_returns: currentReturns,
          })
          .eq('id', user_id);
        continue;
      }

      // Log Return Transaction
      await supabaseAdmin.from('transactions').insert({
        user_id: user_id,
        type: 'return',
        amount: totalRet,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: `Maturity return payout for ${plan_name} cycle`,
        reference: `RET-${investmentId.substring(0, 8).toUpperCase()}`,
        status: 'completed',
      });

      // Send Notification to User
      await supabaseAdmin.from('notifications').insert({
        user_id: user_id,
        title: 'Investment Matured! 🎉',
        message: `Your investment in ${plan_name} has matured. $${totalRet.toLocaleString()} (Principal: $${principal.toLocaleString()} + Profit: $${profit.toLocaleString()}) has been credited to your wallet balance.`,
        type: 'success',
        is_read: false,
      });

      // Send Email to User
      await sendMaturedEmail({
        name: userProfile.full_name,
        email: userProfile.email,
        plan: plan_name,
        principal,
        profit,
        total: totalRet,
      });

      processedCount++;
    }

    return NextResponse.json({
      success: true,
      processedCount,
      message: `Successfully processed ${processedCount} matured investments`,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Process Profits Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
