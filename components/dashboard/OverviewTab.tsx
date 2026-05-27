import { TrendingUp, Plus, ArrowUpRight, ArrowDownRight, Wallet, ArrowRight, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const barData = [
  { name: 'Jan', value: 18000 },
  { name: 'Feb', value: 25000 },
  { name: 'Mar', value: 31000 },
  { name: 'Apr', value: 28000 },
  { name: 'May', value: 42000 },
  { name: 'Jun', value: 60000 },
];

const pieData = [
  { name: 'Foundation', value: 30 },
  { name: 'Prosperity', value: 70 },
];

const COLORS = ['#1E3A8A', '#C9A84C']; // Navy blue and Gold

export default function OverviewTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Total Invested</div>
          <div className="text-2xl font-serif text-white mb-2">$850,000</div>
          <div className="flex items-center text-xs text-green-400">
            <ArrowUpRight size={14} className="mr-1" /> 12% this month
          </div>
        </div>
        
        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Total Returns Earned</div>
          <div className="text-2xl font-serif text-white mb-2">$204,000</div>
          <div className="flex items-center text-xs text-green-400">
            <ArrowUpRight size={14} className="mr-1" /> 8% overall
          </div>
        </div>

        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Active Plans</div>
          <div className="text-2xl font-serif text-white mb-2">2</div>
          <div className="flex items-center text-xs text-gold">
            Next maturity in 14 days
          </div>
        </div>

        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Referral Earnings</div>
          <div className="text-2xl font-serif text-white mb-2">$42,500</div>
          <div className="flex items-center text-xs text-gray-text">
            From 28 active referrals
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
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
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
              <span className="text-2xl font-serif">100%</span>
              <span className="text-xs text-gray-text">Portfolio</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, index) => (
               <div key={entry.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                 <span className="text-xs text-gray-text">{entry.name} ({entry.value}%)</span>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex items-center justify-center gap-2 p-4 bg-navy border border-border-gold rounded-xl hover:bg-gold/10 transition-colors text-sm font-medium text-gold" onClick={() => setActiveTab('deposit')}>
          <ArrowDownRight size={16} /> Deposit Funds
        </button>
        <button className="flex items-center justify-center gap-2 p-4 bg-navy border border-border-subtle rounded-xl hover:border-gold/30 hover:text-white transition-colors text-sm font-medium text-gray-text" onClick={() => setActiveTab('withdraw')}>
          <ArrowUpRight size={16} /> Withdraw
        </button>
        <button className="flex items-center justify-center gap-2 p-4 bg-navy border border-border-subtle rounded-xl hover:border-gold/30 hover:text-white transition-colors text-sm font-medium text-gray-text" onClick={() => setActiveTab('investments')}>
          <Plus size={16} /> New Investment
        </button>
        <button className="flex items-center justify-center gap-2 p-4 bg-navy border border-border-subtle rounded-xl hover:border-gold/30 hover:text-white transition-colors text-sm font-medium text-gray-text" onClick={() => setActiveTab('referrals')}>
          <Share2 size={16} /> Refer a Friend
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
                <th className="p-4 font-medium">Monthly Return</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border-subtle">
              <tr className="hover:bg-navy-light/30 transition-colors">
                <td className="p-4 font-medium">Prosperity Plan</td>
                <td className="p-4">$5,000</td>
                <td className="p-4 text-gray-text">Jan 2025</td>
                <td className="p-4 text-gray-text">Jan 2026</td>
                <td className="p-4 text-green-400">24%</td>
                <td className="p-4">$10,000</td>
                <td className="p-4"><span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active</span></td>
              </tr>
              <tr className="hover:bg-navy-light/30 transition-colors">
                <td className="p-4 font-medium">Foundation Plan</td>
                <td className="p-4">$350,000</td>
                <td className="p-4 text-gray-text">Mar 2025</td>
                <td className="p-4 text-gray-text">Mar 2026</td>
                <td className="p-4 text-green-400">18%</td>
                <td className="p-4">$5,250</td>
                <td className="p-4"><span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active</span></td>
              </tr>
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
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border-subtle">
              <tr className="hover:bg-navy-light/30 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400"><ArrowDownRight size={14} /></div>
                  <span className="font-medium">Return Payout</span>
                </td>
                <td className="p-4 text-green-400">+$10,000</td>
                <td className="p-4 text-gray-text">May 15, 2026</td>
                <td className="p-4"><span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">Completed</span></td>
              </tr>
              <tr className="hover:bg-navy-light/30 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold"><Share2 size={14} /></div>
                  <span className="font-medium">Referral Bonus</span>
                </td>
                <td className="p-4 text-green-400">+$2,500</td>
                <td className="p-4 text-gray-text">May 12, 2026</td>
                <td className="p-4"><span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">Completed</span></td>
              </tr>
              <tr className="hover:bg-navy-light/30 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400"><ArrowDownRight size={14} /></div>
                  <span className="font-medium">Deposit</span>
                </td>
                <td className="p-4 text-green-400">+$150,000</td>
                <td className="p-4 text-gray-text">May 01, 2026</td>
                <td className="p-4"><span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">Completed</span></td>
              </tr>
              <tr className="hover:bg-navy-light/30 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400"><ArrowUpRight size={14} /></div>
                  <span className="font-medium">New Investment</span>
                </td>
                <td className="p-4 text-red-400">-$150,000</td>
                <td className="p-4 text-gray-text">May 01, 2026</td>
                <td className="p-4"><span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">Completed</span></td>
              </tr>
              <tr className="hover:bg-navy-light/30 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400"><ArrowDownRight size={14} /></div>
                  <span className="font-medium">Return Payout</span>
                </td>
                <td className="p-4 text-green-400">+$10,000</td>
                <td className="p-4 text-gray-text">Apr 15, 2026</td>
                <td className="p-4"><span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
