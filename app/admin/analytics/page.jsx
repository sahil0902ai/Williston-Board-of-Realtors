'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  Lock, 
  LogOut, 
  Award, 
  Percent, 
  UserPlus, 
  ChevronRight, 
  HelpCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const PIE_COLORS = ['#C9A84C', '#10B981', '#6366F1', '#EC4899']; // Gold, Green, Indigo, Pink

export default function AdminAnalytics() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutMsg, setLockoutMsg] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  // Authentication check
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isAuth) {
      setLoggedIn(true);
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [loggedIn]);

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (failedAttempts >= 3) {
      setLockoutMsg('Access blocked. Too many wrong attempts.');
      return;
    }

    // Normalizing secret check
    const targetPassword = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'williston_admin_secret_2025';
    if (
      authUsername.trim().toLowerCase() === 'willistonadmin' &&
      authPassword === targetPassword
    ) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoggedIn(true);
      setLoginError('');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
        setLockoutMsg('Access blocked. Too many wrong attempts.');
      } else {
        setLoginError(`Access Denied. (${3 - newAttempts} attempts remaining)`);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setLoggedIn(false);
    setData(null);
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'williston_admin_secret_2025';
      const res = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${adminSecret}`
        }
      });
      if (res.ok) {
        const body = await res.json();
        if (body.success) {
          setData(body.analytics);
        } else {
          setError(body.error || 'Failed to fetch analytics');
        }
      } else {
        const errBody = await res.json().catch(() => ({}));
        setError(errBody.error || 'Server error loading analytics');
      }
    } catch (err) {
      console.error(err);
      setError('Network error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const formatNaira = (num) => {
    if (num === undefined || num === null) return '₦0';
    return '₦' + Math.round(num).toLocaleString('en-NG');
  };

  const formatPercent = (val) => {
    return val > 0 ? `↑ ${val}%` : `↓ ${Math.abs(val)}%`;
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#04091A] flex items-center justify-center px-6 py-12 relative overflow-hidden font-sans">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0A1628]/60 border border-gold/15 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif text-white tracking-wide">Williston Investments</h2>
            <p className="text-xs text-gray-text mt-1 uppercase tracking-widest font-semibold">Client Analytics Portal</p>
          </div>

          {lockoutMsg ? (
            <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-bold">
              {lockoutMsg}
            </div>
          ) : (
            <form onSubmit={handleAdminLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Username</label>
                <input suppressHydrationWarning
                  type="text"
                  required
                  placeholder="Username"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full bg-[#04091A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition duration-200"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Password</label>
                <input suppressHydrationWarning
                  type="password"
                  required
                  placeholder="Password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-[#04091A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition duration-200"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                  {loginError}
                </div>
              )}

              <button suppressHydrationWarning
                type="submit"
                className="w-full bg-gold text-navy font-bold py-3.5 px-4 rounded-xl text-sm transition duration-300 hover:bg-gold-light hover:shadow-lg active:scale-[0.98]"
              >
                Enter Analytics Portal
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#04091A] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-text mt-4">Loading business analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#04091A] flex flex-col items-center justify-center px-6 font-sans">
        <div className="bg-[#0A1628] border border-red-500/20 p-8 rounded-2xl max-w-md text-center shadow-xl">
          <span className="text-4xl">⚠️</span>
          <h3 className="text-lg font-bold text-white mt-4">Error Loading Analytics</h3>
          <p className="text-sm text-gray-text mt-2">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-6 bg-gold text-navy font-bold py-2.5 px-6 rounded-xl text-xs hover:bg-gold-light transition duration-200"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // Calculate comparisons percentages
  const signupChange = Math.round(
    ((data.weeklyComparison.signupsThisWeek - data.weeklyComparison.signupsLastWeek) / 
    (data.weeklyComparison.signupsLastWeek || 1)) * 100
  );
  const depositChange = Math.round(
    ((data.weeklyComparison.depositsThisWeek - data.weeklyComparison.depositsLastWeek) / 
    (data.weeklyComparison.depositsLastWeek || 1)) * 100
  );

  return (
    <div className="min-h-screen bg-[#04091A] text-white py-12 px-6 sm:px-12 font-sans relative overflow-x-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-8 mb-12 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif text-white tracking-wide">Williston Growth Dashboard</h1>
            <span className="bg-gold/10 text-gold text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-gold/15">
              Client View
            </span>
          </div>
          <p className="text-sm text-gray-text mt-1 font-light leading-relaxed">
            See exactly how your real estate investment platform is growing at a glance.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border border-white/10 hover:border-gold hover:text-gold rounded-xl px-4 py-2.5 text-xs transition duration-200 bg-white/[0.01]"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* ================= SNAPSHOT ================= */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-serif tracking-wide">Today's Snapshot</h2>
            <div className="relative group">
              <HelpCircle size={14} className="text-gray-text hover:text-white cursor-pointer" />
              <div className="absolute left-0 bottom-6 hidden group-hover:block bg-[#0A1628] border border-gold/20 text-xs text-gray-text rounded-xl p-3 w-64 shadow-xl z-50">
                This shows the sign-ups and transaction activity recorded on the platform since midnight today.
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* New Signups */}
            <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs uppercase tracking-wider text-gray-text font-semibold">New Sign Ups</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <UserPlus size={16} />
                </div>
              </div>
              <h3 className="text-3xl font-semibold tracking-tight font-serif text-white">{data.newUsersToday}</h3>
              <p className="text-xs text-gray-text mt-2 font-light">Investors who created an account today.</p>
            </div>

            {/* Money Deposited */}
            <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs uppercase tracking-wider text-gray-text font-semibold">Money Deposited</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <h3 className="text-3xl font-semibold tracking-tight font-serif text-emerald-400">
                {formatNaira(data.totalDepositedToday)}
              </h3>
              <p className="text-xs text-gray-text mt-2 font-light">Total funds paid in today.</p>
            </div>

            {/* Money Withdrawn */}
            <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs uppercase tracking-wider text-gray-text font-semibold">Money Withdrawn</span>
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <ArrowDownRight size={16} />
                </div>
              </div>
              <h3 className="text-3xl font-semibold tracking-tight font-serif text-rose-400">
                {formatNaira(data.totalWithdrawnToday)}
              </h3>
              <p className="text-xs text-gray-text mt-2 font-light">Total payout requests approved today.</p>
            </div>

            {/* Net Growth */}
            <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs uppercase tracking-wider text-gray-text font-semibold">Net Growth</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  data.netGrowthToday >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {data.netGrowthToday >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
              </div>
              <h3 className={`text-3xl font-semibold tracking-tight font-serif ${
                data.netGrowthToday >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatNaira(data.netGrowthToday)}
              </h3>
              <p className="text-xs text-gray-text mt-2 font-light">Net increase in active platform funds today.</p>
            </div>
          </div>
          <p className="text-xs text-gray-text mt-4 flex items-center gap-1.5 font-light">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            <strong>Simple explanation:</strong> This shows how much money came in today versus how much went out. Green means you're growing, red means more people are withdrawing than depositing.
          </p>
        </div>

        {/* ================= THIS WEEK VS LAST WEEK ================= */}
        <div>
          <h2 className="text-xl font-serif tracking-wide mb-6">This Week vs Last Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Signups Comparison */}
            <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase tracking-wider text-gray-text font-semibold">Sign Ups Comparison</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  signupChange >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {formatPercent(signupChange)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <span className="text-[10px] text-gray-text uppercase block font-semibold">This Week</span>
                  <span className="text-2xl font-serif font-bold text-white mt-1 block">
                    {data.weeklyComparison.signupsThisWeek}
                  </span>
                </div>
                <div className="border-l border-white/5 pl-4">
                  <span className="text-[10px] text-gray-text uppercase block font-semibold">Last Week</span>
                  <span className="text-2xl font-serif font-bold text-gray-text/75 mt-1 block">
                    {data.weeklyComparison.signupsLastWeek}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-text mt-4 font-light">
                <strong>Simple explanation:</strong> Compares how many new accounts were created in the last 7 days versus the 7 days before. A positive percentage means user acquisition speed is increasing.
              </p>
            </div>

            {/* Deposits Comparison */}
            <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase tracking-wider text-gray-text font-semibold">Deposits Comparison</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  depositChange >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {formatPercent(depositChange)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <span className="text-[10px] text-gray-text uppercase block font-semibold">This Week</span>
                  <span className="text-2xl font-serif font-bold text-white mt-1 block">
                    {formatNaira(data.weeklyComparison.depositsThisWeek)}
                  </span>
                </div>
                <div className="border-l border-white/5 pl-4">
                  <span className="text-[10px] text-gray-text uppercase block font-semibold">Last Week</span>
                  <span className="text-2xl font-serif font-bold text-gray-text/75 mt-1 block">
                    {formatNaira(data.weeklyComparison.depositsLastWeek)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-text mt-4 font-light">
                <strong>Simple explanation:</strong> Compares total deposits received in the last 7 days versus the previous 7 days. Higher value shows growing investor trust and capital intake.
              </p>
            </div>
          </div>
        </div>

        {/* ================= SIMPLE CHART — MONEY IN VS OUT ================= */}
        <div>
          <h2 className="text-xl font-serif tracking-wide mb-2">Money In vs Money Out</h2>
          <p className="text-xs text-gray-text mb-6">Visual tracking of daily deposits vs payouts over the last 30 days.</p>
          
          <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyData30Days} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" stroke="#8A9BB5" fontSize={10} tickLine={false} />
                  <YAxis stroke="#8A9BB5" fontSize={10} tickLine={false} tickFormatter={(val) => `₦${(val/1000)}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0A1628', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold', fontFamily: 'serif' }}
                    itemStyle={{ fontSize: '12px' }}
                    formatter={(val) => [formatNaira(val), '']}
                  />
                  <Bar dataKey="deposits" name="Money In (Deposits)" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="withdrawals" name="Money Out (Payouts)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center gap-6 mt-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block"></span>
                <span>Deposits (Money In)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-rose-500 inline-block"></span>
                <span>Withdrawals (Money Out)</span>
              </div>
            </div>

            <p className="text-xs text-gray-text mt-6 border-t border-white/5 pt-4 font-light">
              <strong>Simple explanation:</strong> The green bars show how much money investors put in each day, and the red bars show how much they withdrew. Ideally, green bars should be significantly taller than red bars.
            </p>
          </div>
        </div>

        {/* ================= LEADERBOARD & POPULAR PLANS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Investors Leaderboard */}
          <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-serif tracking-wide">Top Investors This Month</h2>
                <Award className="text-gold" size={20} />
              </div>
              <div className="space-y-4">
                {data.topInvestors.map((investor, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#04091A]/50 border border-white/[0.03] rounded-xl p-4 transition hover:border-gold/15">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0 ? 'bg-gold text-navy' : idx === 1 ? 'bg-gray-300 text-navy' : idx === 2 ? 'bg-orange-800 text-white' : 'bg-white/10 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-medium text-sm text-white">{investor.name}</span>
                    </div>
                    <span className="font-bold text-gold text-sm">{formatNaira(investor.invested)}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-text mt-6 border-t border-white/5 pt-4 font-light">
              <strong>Simple explanation:</strong> This shows your highest-value clients. These are the investors who currently have the most capital deployed on the platform. Retaining these clients is key.
            </p>
          </div>

          {/* Popular Plans (Pie Chart) */}
          <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <h2 className="text-lg font-serif tracking-wide mb-6">Most Popular Plans</h2>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* Pie chart */}
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.popularPlans}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {data.popularPlans.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Plan legend */}
                <div className="space-y-2 flex-1">
                  {data.popularPlans.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between text-xs bg-[#04091A]/30 px-3 py-2 rounded-lg border border-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                        <span className="font-medium text-white">{plan.name}</span>
                      </div>
                      <span className="font-bold text-gray-text">{plan.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-text mt-6 border-t border-white/5 pt-4 font-light">
              <strong>Simple explanation:</strong> Shows which investment plans are preferred by your clients. Use this information to promote other plans or double down on marketing your most popular ones.
            </p>
          </div>

        </div>

        {/* ================= REFERRALS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Referrers */}
          <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <h2 className="text-lg font-serif tracking-wide mb-6">Top Referrers This Month</h2>
              
              <div className="space-y-4">
                {data.topReferrers.map((referrer, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#04091A]/50 border border-white/[0.03] rounded-xl p-4 transition hover:border-gold/15">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-text font-medium w-5">{idx + 1}.</span>
                      <span className="font-medium text-sm text-white">{referrer.name}</span>
                    </div>
                    <span className="font-bold text-gold text-xs">{referrer.count} new sign-ups</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-text mt-6 border-t border-white/5 pt-4 font-light">
              <strong>Simple explanation:</strong> Shows which of your users are inviting the most new investors. Consider awarding these users with extra bonuses or cash commissions to keep them motivated!
            </p>
          </div>

          {/* Bonus Sunday Telegram / WhatsApp Summary info */}
          <div className="bg-[#0A1628]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📊</span>
                <h2 className="text-lg font-serif tracking-wide">Weekly Sunday Summary</h2>
              </div>
              <p className="text-xs text-gray-text leading-relaxed font-light mb-6">
                Your system is configured to send you an automated summary of the week's growth every <strong>Sunday at 9:00 AM</strong>.
              </p>

              <div className="bg-[#04091A] border border-gold/15 rounded-xl p-4 font-mono text-[11px] text-gray-text relative select-all">
                <div className="absolute top-2 right-2.5 text-[9px] uppercase tracking-wider text-gold font-bold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/10 select-none">
                  Summary Preview
                </div>
                <p className="text-white font-bold mb-2">📊 Weekly Summary — Williston Investments</p>
                <p>This week:</p>
                <p>👥 32 new investors</p>
                <p>💰 ₦1,200,000 deposited</p>
                <p>💸 ₦180,000 withdrawn</p>
                <p className="mb-2">📈 Net growth: ₦1,020,000</p>
                <p>Top plan: Foundation (45% of investments)</p>
                <p className="mb-2">Most active day: Friday</p>
                <p className="text-white font-semibold">Keep up the momentum!</p>
              </div>
            </div>

            <p className="text-xs text-gray-text mt-6 border-t border-white/5 pt-4 font-light">
              <strong>Simple explanation:</strong> This is an automatic message sent straight to your phone so you can check your weekly performance numbers on Sunday morning without even opening this dashboard.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
