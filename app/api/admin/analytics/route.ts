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

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayStr = startOfToday.toISOString();

    // Run queries in parallel
    const [
      totalUsersRes,
      newUsersTodayRes,
      activeInvestmentsRes,
      pendingDepositsRes,
      pendingWithdrawalsRes,
      confirmedDepositsRes,
      approvedWithdrawalsRes,
      returnsPaidRes,
      recentTransactionsRes,
      signupsHistoryRes,
      investmentsDistRes
    ] = await Promise.all([
      // 1. Total Users Count
      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),

      // 2. New Users Today
      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).gte('created_at', startOfTodayStr),

      // 3. Active Investments Count
      supabaseAdmin.from('investments').select('id', { count: 'exact', head: true }).eq('status', 'active'),

      // 4. Pending Deposits (amounts to sum in JS)
      supabaseAdmin.from('deposits').select('amount').eq('status', 'pending'),

      // 5. Pending Withdrawals (amounts to sum in JS)
      supabaseAdmin.from('withdrawals').select('amount').eq('status', 'pending'),

      // 6. Confirmed Deposits (amounts and methods to sum in JS)
      supabaseAdmin.from('deposits').select('amount, method').eq('status', 'confirmed'),

      // 7. Approved Withdrawals (amounts to sum in JS)
      supabaseAdmin.from('withdrawals').select('amount').eq('status', 'approved'),

      // 8. Total Returns Paid (sum transactions of type 'return')
      supabaseAdmin.from('transactions').select('amount').eq('type', 'return'),

      // 9. Recent 10 Transactions with joined user full_name
      supabaseAdmin.from('transactions').select('*, users(full_name)').order('created_at', { ascending: false }).limit(10),

      // 10. Fetch created_at dates for signup chart grouping
      supabaseAdmin.from('users').select('created_at'),

      // 11. Fetch plan names for active plans chart grouping
      supabaseAdmin.from('investments').select('plan_name').eq('status', 'active')
    ]);

    // Error checking
    if (
      totalUsersRes.error || 
      newUsersTodayRes.error || 
      activeInvestmentsRes.error || 
      pendingDepositsRes.error || 
      pendingWithdrawalsRes.error || 
      confirmedDepositsRes.error || 
      approvedWithdrawalsRes.error || 
      returnsPaidRes.error ||
      recentTransactionsRes.error ||
      signupsHistoryRes.error ||
      investmentsDistRes.error
    ) {
      return NextResponse.json({
        error: 'Failed to retrieve platform analytics from database',
        details: {
          totalUsers: totalUsersRes.error?.message,
          newUsers: newUsersTodayRes.error?.message,
          activeInvestments: activeInvestmentsRes.error?.message,
          pendingDeps: pendingDepositsRes.error?.message,
          pendingWds: pendingWithdrawalsRes.error?.message,
          confirmedDeps: confirmedDepositsRes.error?.message,
          approvedWds: approvedWithdrawalsRes.error?.message,
          returnsPaid: returnsPaidRes.error?.message,
          recentTx: recentTransactionsRes.error?.message
        }
      }, { status: 500 });
    }

    // Calculations
    const totalUsers = totalUsersRes.count || 0;
    const newUsersToday = newUsersTodayRes.count || 0;
    const activeInvestments = activeInvestmentsRes.count || 0;

    // Pending Deposits Sum
    const pendingDepositsCount = pendingDepositsRes.data?.length || 0;
    const pendingDepositsAmount = pendingDepositsRes.data?.reduce((sum, item) => sum + parseFloat(item.amount as any), 0) || 0;

    // Pending Withdrawals Sum
    const pendingWithdrawalsCount = pendingWithdrawalsRes.data?.length || 0;
    const pendingWithdrawalsAmount = pendingWithdrawalsRes.data?.reduce((sum, item) => sum + parseFloat(item.amount as any), 0) || 0;

    // Total Deposited
    const totalDeposited = confirmedDepositsRes.data?.reduce((sum, item) => sum + parseFloat(item.amount as any), 0) || 0;

    // Total Withdrawn
    const totalWithdrawn = approvedWithdrawalsRes.data?.reduce((sum, item) => sum + parseFloat(item.amount as any), 0) || 0;

    // Total Returns Paid
    const totalReturnsPaid = returnsPaidRes.data?.reduce((sum, item) => sum + Math.abs(parseFloat(item.amount as any)), 0) || 0;

    // Net Platform Balance
    const platformBalance = totalDeposited - totalWithdrawn;

    // Map recent transactions
    const recentTransactions = recentTransactionsRes.data?.map((tx: any) => ({
      id: tx.id,
      date: tx.created_at,
      type: tx.type,
      amount: parseFloat(tx.amount as any),
      investor: tx.users?.full_name || 'System Auto',
      reference: tx.reference,
      status: tx.status,
    })) || [];

    // Monthly signups grouping logic
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySignupsMap: { [key: string]: number } = {};
    
    // Pre-populate last 6 months
    const currentMonth = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      monthlySignupsMap[monthNames[m]] = 0;
    }

    signupsHistoryRes.data?.forEach((user: any) => {
      const date = new Date(user.created_at);
      const mName = monthNames[date.getMonth()];
      if (monthlySignupsMap[mName] !== undefined) {
        monthlySignupsMap[mName]++;
      }
    });

    const monthlySignups = Object.keys(monthlySignupsMap).map(name => ({
      name,
      value: monthlySignupsMap[name]
    }));

    // Deposits by Method breakdown
    const depositsByMethodMap: { [key: string]: number } = {};
    confirmedDepositsRes.data?.forEach((d: any) => {
      depositsByMethodMap[d.method] = (depositsByMethodMap[d.method] || 0) + parseFloat(d.amount as any);
    });
    const depositsByMethod = Object.keys(depositsByMethodMap).map(name => ({
      name,
      value: depositsByMethodMap[name]
    }));

    // Plan distribution breakdown
    const planDistributionMap: { [key: string]: number } = {};
    investmentsDistRes.data?.forEach((inv: any) => {
      planDistributionMap[inv.plan_name] = (planDistributionMap[inv.plan_name] || 0) + 1;
    });
    const planDistribution = Object.keys(planDistributionMap).map(name => ({
      name,
      value: planDistributionMap[name]
    }));

    return NextResponse.json({
      success: true,
      analytics: {
        totalUsers,
        newUsersToday,
        activeInvestments,
        pendingDeposits: {
          count: pendingDepositsCount,
          amount: pendingDepositsAmount
        },
        pendingWithdrawals: {
          count: pendingWithdrawalsCount,
          amount: pendingWithdrawalsAmount
        },
        totalDeposited,
        totalWithdrawn,
        totalReturnsPaid,
        platformBalance,
        recentTransactions,
        monthlySignups,
        depositsByMethod,
        planDistribution
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
