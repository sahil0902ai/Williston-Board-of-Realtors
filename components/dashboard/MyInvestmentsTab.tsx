"use client";
import { useState } from 'react';
import { FileText, RefreshCw, Calendar, TrendingUp } from 'lucide-react';

export default function MyInvestmentsTab() {
  const [filter, setFilter] = useState('All');
  
  const tabs = ['All', 'Active', 'Matured', 'Pending'];
  
  const investments = [
    {
      id: 'INV-10294',
      plan: 'Prosperity Plan',
      amount: '$5,000',
      status: 'Active',
      startDate: 'Jan 15, 2025',
      endDate: 'Jan 15, 2026',
      roi: '24%',
      earned: '$500',
      progress: 35,
      nextPayout: 'Jun 15, 2026'
    },
    {
      id: 'INV-10382',
      plan: 'Foundation Plan',
      amount: '$350,000',
      status: 'Active',
      startDate: 'Mar 10, 2025',
      endDate: 'Mar 10, 2026',
      roi: '18%',
      earned: '$10,500',
      progress: 20,
      nextPayout: 'Jun 10, 2026'
    },
    {
      id: 'INV-09842',
      plan: 'Starter Plan',
      amount: '$100,000',
      status: 'Matured',
      startDate: 'May 01, 2024',
      endDate: 'May 01, 2025',
      roi: '15%',
      earned: '$15,000',
      progress: 100,
      nextPayout: '-'
    }
  ];

  const filteredInvestments = investments.filter(inv => filter === 'All' ? true : inv.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-serif">My Investments</h2>
        <div className="flex bg-navy-mid border border-border-subtle rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === tab ? 'bg-gold text-navy font-medium' : 'text-gray-text hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInvestments.map(inv => (
          <div key={inv.id} className="bg-navy-mid border border-border-subtle rounded-xl p-6 relative overflow-hidden group hover:border-gold/30 transition-colors">
            {inv.status === 'Active' && <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl pointer-events-none group-hover:bg-gold/20 transition-colors"></div>}
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs text-gold uppercase tracking-wider font-semibold mb-1">{inv.id}</div>
                <h3 className="text-xl font-serif text-white">{inv.plan}</h3>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                inv.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                inv.status === 'Matured' ? 'bg-blue-500/10 text-blue-400' :
                'bg-yellow-500/10 text-yellow-500'
              }`}>
                {inv.status === 'Active' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                {inv.status === 'Matured' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                {inv.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                 <div className="text-gray-text text-xs mb-1">Amount Invested</div>
                 <div className="font-medium text-white">{inv.amount}</div>
              </div>
              <div>
                 <div className="text-gray-text text-xs mb-1">Expected ROI</div>
                 <div className="font-medium text-green-400">{inv.roi}</div>
              </div>
              <div>
                 <div className="text-gray-text text-xs mb-1">Returns Earned</div>
                 <div className="font-medium text-white">{inv.earned}</div>
              </div>
              <div>
                 <div className="text-gray-text text-xs mb-1">Next Payout</div>
                 <div className="font-medium text-white flex items-center gap-1">
                    <Calendar size={12} className="text-gold" /> {inv.nextPayout}
                 </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-text mb-2">
                <span>{inv.startDate}</span>
                <span>{inv.endDate}</span>
              </div>
              <div className="h-1.5 w-full bg-navy rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${inv.status === 'Matured' ? 'bg-blue-500' : 'bg-gold'}`} 
                  style={{ width: `${inv.progress}%` }}
                ></div>
              </div>
              <div className="text-center text-xs text-gray-text mt-2">{inv.progress}% elapsed</div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border-subtle">
              <button className="flex-1 flex items-center justify-center gap-2 p-2 bg-navy border border-border-gold rounded-lg hover:bg-gold/10 transition-colors text-sm font-medium text-gold">
                <FileText size={16} /> Certificate
              </button>
              {inv.status === 'Matured' ? (
                 <button className="flex-1 flex items-center justify-center gap-2 p-2 bg-gold text-navy rounded-lg hover:bg-white transition-colors text-sm font-medium">
                   <RefreshCw size={16} /> Reinvest
                 </button>
              ) : (
                <button className="flex items-center justify-center gap-2 p-2 px-4 bg-navy text-gray-text border border-border-subtle rounded-lg hover:border-gold hover:text-white transition-colors text-sm font-medium" title="View Analytics">
                   <TrendingUp size={16} />
                 </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
