import { useEffect, useState } from 'react';
import { TrendingUp, Plus, ArrowUpRight, ArrowDownRight, Wallet, ArrowRight, Share2, Loader2, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1E3A8A', '#C9A84C', '#10B981', '#6366F1']; // Navy blue, Gold, Green, Indigo

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
  profile: any;
  fetchProfile: () => void;
}

export default function OverviewTab({ setActiveTab, profile, fetchProfile }: OverviewTabProps) {
  const [investments, setInvestments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const handleReferFriend = () => {
    const referralLink = typeof window !== 'undefined' 
      ? `${window.location.origin}/register?ref=${profile?.referral_code || ''}`
      : `https://williston-board-of-realtors.vercel.app/register?ref=${profile?.referral_code || ''}`;
    
    navigator.clipboard.writeText(referralLink);
    setToastMessage("Referral link copied!");
    setTimeout(() => setToastMessage(''), 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, txRes, refRes] = await Promise.all([
          fetch('/api/investments/list?status=active'),
          fetch('/api/user/transactions'),
          fetch('/api/referrals/stats')
        ]);

        if (invRes.ok) {
          const invData = await invRes.json();
          setInvestments(invData || []);
        }
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData || []);
        }
        if (refRes.ok) {
          const refData = await refRes.json();
          setReferralStats(refData.stats || null);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  // Helper to construct dynamic monthly returns chart data
  const getBarData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const dataMap: { [key: string]: number } = {};

    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      dataMap[months[m]] = 0;
    }

    transactions.forEach((tx) => {
      const type = tx.type.toLowerCase();
      if (type.includes('return') || type.includes('payout')) {
        const date = new Date(tx.created_at);
        const mName = months[date.getMonth()];
        if (dataMap[mName] !== undefined) {
          dataMap[mName] += Math.abs(parseFloat(tx.amount));
        }
      }
    });

    const chartData = Object.keys(dataMap).map((name) => ({
      name,
      value: dataMap[name]
    }));

    // If no returns are logged yet, provide a friendly demo curve
    const hasData = chartData.some(d => d.value > 0);
    if (!hasData) {
      return [
        { name: 'Jan', value: 0 },
        { name: 'Feb', value: 0 },
        { name: 'Mar', value: 0 },
        { name: 'Apr', value: 0 },
        { name: 'May', value: 0 },
        { name: 'Jun', value: 0 },
      ];
    }
    return chartData;
  };

  // Helper to construct pie chart plan breakdown
  const getPieData = () => {
    if (investments.length === 0) {
      return [{ name: 'No Active Plans', value: 100 }];
    }
    const map: { [key: string]: number } = {};
    investments.forEach((inv) => {
      map[inv.plan_name] = (map[inv.plan_name] || 0) + parseFloat(inv.amount);
    });
    return Object.keys(map).map((name) => ({
      name,
      value: map[name]
    }));
  };

  const barData = getBarData();
  const pieData = getPieData();
  const totalInvested = parseFloat(profile?.total_invested || '0');
  const totalReturns = parseFloat(profile?.total_returns || '0');
  const referralEarnings = referralStats ? referralStats.totalEarned : 0;
  const activePlansCount = investments.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-navy-mid border border-border-subtle rounded-xl p-6">
        <div>
          <h2 className="text-2xl font-serif text-white">Dashboard Overview</h2>
          <p className="text-sm text-gray-text">Welcome back, {profile?.full_name || 'Investor'}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/deposit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: '#C9A84C',
              color: '#04091A',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              minHeight: '48px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-2">
              💳 Deposit Funds
            </span>
          </a>
          <a
            href="/withdraw"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: 'transparent',
              color: '#C9A84C',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              border: '1px solid rgba(201,168,76,0.4)',
              cursor: 'pointer',
              minHeight: '48px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-2">
              💸 Withdraw Funds
            </span>
          </a>
        </div>
      </div>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Total Invested</div>
          <div className="text-2xl font-serif text-white mb-2">₦{totalInvested.toLocaleString()}</div>
          <div className="flex items-center text-xs text-gold">
            Active capital earning daily returns
          </div>
        </div>
        
        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Total Returns Earned</div>
          <div className="text-2xl font-serif text-white mb-2">₦{totalReturns.toLocaleString()}</div>
          <div className="flex items-center text-xs text-green-400">
            <ArrowUpRight size={14} className="mr-1" /> Credited to wallet
          </div>
        </div>

        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Active Plans</div>
          <div className="text-2xl font-serif text-white mb-2">{activePlansCount}</div>
          <div className="flex items-center text-xs text-gold">
            {activePlansCount > 0 ? 'Plans actively maturing' : 'No plans running'}
          </div>
        </div>

        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Referral Earnings</div>
          <div className="text-2xl font-serif text-white mb-2">₦{referralEarnings.toLocaleString()}</div>
          <div className="flex items-center text-xs text-gray-text">
            From {referralStats?.totalReferrals || 0} registered invitees
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Returns Chart */}
        <div className="lg:col-span-3 bg-navy-mid border border-border-subtle rounded-xl p-6">
          <h3 className="text-lg font-serif mb-6">Monthly Returns</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₦${val}`} />
                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#04091A', borderColor: '#ffffff20', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#C9A84C" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="lg:col-span-2 bg-navy-mid border border-border-subtle rounded-xl p-6">
          <h3 className="text-lg font-serif mb-6">Investment Summary</h3>
          <div style={{
            width: '100%',
            minWidth: 0,
            height: '200px',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#04091A', borderColor: '#ffffff20', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-serif">
                {investments.length > 0 ? '100%' : '0%'}
              </span>
              <span className="text-xs text-gray-text">Portfolio</span>
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4">
            {pieData.map((entry, index) => (
               <div key={entry.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                 <span className="text-xs text-gray-text">{entry.name} ({investments.length > 0 ? `₦${entry.value.toLocaleString()}` : '0'})</span>
               </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a 
          href="/deposit" 
          className="flex items-center justify-center gap-2 p-4 bg-navy border border-border-gold rounded-xl hover:bg-gold/10 transition-colors text-sm font-medium text-gold"
          style={{
            minHeight: '48px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
            <ArrowDownRight size={16} /> Deposit Funds
          </span>
        </a>
        <a 
          href="/withdraw" 
          className="flex items-center justify-center gap-2 p-4 bg-navy border border-border-subtle rounded-xl hover:border-gold/30 hover:text-white transition-colors text-sm font-medium text-gray-text"
          style={{
            minHeight: '48px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
            <ArrowUpRight size={16} /> Withdraw
          </span>
        </a>
        <a 
          href="/#invest" 
          className="flex items-center justify-center gap-2 p-4 bg-navy border border-border-subtle rounded-xl hover:border-gold/30 hover:text-white transition-colors text-sm font-medium text-gray-text"
          style={{
            minHeight: '48px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
            <Plus size={16} /> New Investment
          </span>
        </a>
        <button 
          className="flex items-center justify-center gap-2 p-4 bg-navy border border-border-subtle rounded-xl hover:border-gold/30 hover:text-white transition-colors text-sm font-medium text-gray-text cursor-pointer" 
          onClick={handleReferFriend}
          style={{
            minHeight: '48px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
            <Share2 size={16} /> Refer a Friend
          </span>
        </button>
      </div>

      {/* Active Investments */}
      <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <h3 className="text-lg font-serif">Active Investments</h3>
          <button className="text-sm text-gold hover:underline" onClick={() => setActiveTab('investments')}>View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-light/50 text-xs text-gray-text uppercase tracking-wider">
                <th className="p-4 font-medium">Plan</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Start Date</th>
                <th className="p-4 font-medium">Maturity Date</th>
                <th className="p-4 font-medium">ROI</th>
                <th className="p-4 font-medium">Daily Profit</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border-subtle">
              {investments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-text">No active investments found. Click "New Investment" to start earning.</td>
                </tr>
              ) : (
                investments.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-navy-light/30 transition-colors">
                    <td className="p-4 font-medium">{inv.plan_name}</td>
                    <td className="p-4">₦{parseFloat(inv.amount).toLocaleString()}</td>
                    <td className="p-4 text-gray-text">{new Date(inv.start_date).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-text">{inv.end_date ? new Date(inv.end_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 text-green-400">{inv.roi_percent}%</td>
                    <td className="p-4">₦{parseFloat(inv.daily_profit || '0').toLocaleString()}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <h3 className="text-lg font-serif">Recent Transactions</h3>
          <button className="text-sm text-gold hover:underline" onClick={() => setActiveTab('wallet')}>View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-light/50 text-xs text-gray-text uppercase tracking-wider">
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Reference</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border-subtle">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-text">No transactions logged yet.</td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((tx) => {
                  const isPositive = parseFloat(tx.amount) > 0 || tx.type === 'deposit' || tx.type === 'referral';
                  return (
                    <tr key={tx.id} className="hover:bg-navy-light/30 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {isPositive ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <span className="font-medium capitalize">{tx.type}</span>
                      </td>
                      <td className={`p-4 font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}₦{Math.abs(parseFloat(tx.amount)).toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-text">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-xs font-mono text-gray-text">{tx.reference || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-green-500 text-white font-semibold px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
