import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';
import { sendReferralCommissionEmail } from '@/lib/email';
import { addDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, amount: rawAmount } = body;
    const amount = parseFloat(rawAmount);

    if (!planId || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Plan ID and a valid positive amount are required' }, { status: 400 });
    }

    // 1. Validate plan exists and is active
    const { data: plan, error: planError } = await supabaseAdmin
      .from('investment_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Selected investment plan not found' }, { status: 404 });
    }

    if (!plan.is_active) {
      return NextResponse.json({ error: 'This investment plan is currently inactive' }, { status: 400 });
    }

    // 2. Validate amount is within min and max
    if (amount < plan.min_deposit) {
      return NextResponse.json({ error: `Minimum investment for this plan is $${plan.min_deposit}` }, { status: 400 });
    }
    if (plan.max_deposit && amount > plan.max_deposit) {
      return NextResponse.json({ error: `Maximum investment for this plan is $${plan.max_deposit}` }, { status: 400 });
    }

    // 3. Check user wallet balance
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('wallet_balance, full_name, total_invested')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const currentBalance = parseFloat(profile.wallet_balance as any);
    if (currentBalance < amount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // 4. Calculate profits and dates
    const roi = parseFloat(plan.roi_percent as any);
    const duration = plan.duration_days;
    const totalProfit = amount * (roi / 100);
    const dailyProfit = totalProfit / duration;
    const totalReturn = amount + totalProfit;
    const startDate = new Date();
    const endDate = addDays(startDate, duration);

    // 5. Insert Investment record
    const { data: investment, error: investError } = await supabaseAdmin
      .from('investments')
      .insert({
        user_id: user.id,
        plan_id: plan.id,
        plan_name: plan.name,
        amount,
        roi_percent: roi,
        duration_days: duration,
        daily_profit: dailyProfit,
        total_profit: totalProfit,
        total_return: totalReturn,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
      })
      .select('*')
      .single();

    if (investError || !investment) {
      return NextResponse.json({ error: `Failed to create investment: ${investError?.message}` }, { status: 500 });
    }

    // 6. Deduct balance and update total invested
    const newBalance = currentBalance - amount;
    const newTotalInvested = parseFloat(profile.total_invested as any) + amount;

    await supabaseAdmin
      .from('users')
      .update({
        wallet_balance: newBalance,
        total_invested: newTotalInvested,
      })
      .eq('id', user.id);

    // 7. Log transaction type 'investment'
    await supabaseAdmin.from('transactions').insert({
      user_id: user.id,
      type: 'investment',
      amount: -amount,
      balance_before: currentBalance,
      balance_after: newBalance,
      description: `Activated ${plan.name} cycle`,
      reference: `INV-${investment.id.substring(0, 8).toUpperCase()}`,
      status: 'completed',
    });

    // 8. Send investment activation notification
    await supabaseAdmin.from('notifications').insert({
      user_id: user.id,
      title: 'Investment Plan Activated',
      message: `Your $${amount.toLocaleString()} investment in ${plan.name} has been activated and will mature on ${endDate.toLocaleDateString()}.`,
      type: 'success',
      is_read: false,
    });

    // 9. Process Referral Commission
    const { data: pendingReferral, error: refError } = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('referred_id', user.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (!refError && pendingReferral) {
      const commissionPercent = parseFloat(pendingReferral.commission_percent as any);
      const commissionAmount = amount * (commissionPercent / 100);
      const referrerId = pendingReferral.referrer_id;

      // Fetch referrer details
      const { data: referrer, error: referrerFetchError } = await supabaseAdmin
        .from('users')
        .select('wallet_balance, full_name, email')
        .eq('id', referrerId)
        .single();

      if (!referrerFetchError && referrer) {
        const referrerBalance = parseFloat(referrer.wallet_balance as any);
        const referrerNewBalance = referrerBalance + commissionAmount;

        // Credit referrer wallet
        await supabaseAdmin
          .from('users')
          .update({ wallet_balance: referrerNewBalance })
          .eq('id', referrerId);

        // Update referral record
        await supabaseAdmin
          .from('referrals')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
            commission_amount: commissionAmount,
            investment_id: investment.id,
          })
          .eq('id', pendingReferral.id);

        // Log transaction for referrer
        await supabaseAdmin.from('transactions').insert({
          user_id: referrerId,
          type: 'referral_commission',
          amount: commissionAmount,
          balance_before: referrerBalance,
          balance_after: referrerNewBalance,
          description: `Referral commission from ${profile.full_name}'s investment`,
          reference: `REF-${pendingReferral.id.substring(0, 8).toUpperCase()}`,
          status: 'completed',
        });

        // Notify referrer
        await supabaseAdmin.from('notifications').insert({
          user_id: referrerId,
          title: 'Referral Commission Paid!',
          message: `You earned $${commissionAmount.toLocaleString()} from ${profile.full_name}'s investment activation.`,
          type: 'success',
          is_read: false,
        });

        // Email referrer
        await sendReferralCommissionEmail(referrer.full_name, referrer.email, commissionAmount, profile.full_name);
      }
    }

    return NextResponse.json({
      success: true,
      investmentId: investment.id,
      message: 'Investment plan successfully activated',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create Investment Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
