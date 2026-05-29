"use client";
import { useState, useEffect } from 'react';
import { FileText, RefreshCw, Calendar, TrendingUp, Loader2 } from 'lucide-react';

interface MyInvestmentsTabProps {
  profile: any;
  fetchProfile: () => void;
}

export default function MyInvestmentsTab({ profile, fetchProfile }: MyInvestmentsTabProps) {
  const [filter, setFilter] = useState('All');
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const tabs = ['All', 'Active', 'Matured'];

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const statusParam = filter === 'All' ? 'all' : filter.toLowerCase();
      const res = await fetch(`/api/investments/list?status=${statusParam}`);
      if (res.ok) {
        const data = await res.json();
        setInvestments(data || []);
      }
    } catch (err) {
      console.error('Error fetching investments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [filter]);

  // Calculate elapsed progress percent for an investment
  const calculateProgress = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) return 0;
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const now = Date.now();

    if (now >= end) return 100;
    if (now <= start) return 0;

    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-gold" />
        </div>
      ) : investments.length === 0 ? (
        <div className="bg-navy-mid border border-border-subtle rounded-xl p-12 text-center text-gray-text">
          No investments found matching this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {investments.map(inv => {
            const progress = calculateProgress(inv.start_date, inv.end_date);
            const isMatured = inv.status === 'matured';
            return (
              <div key={inv.id} className="bg-navy-mid border border-border-subtle rounded-xl p-6 relative overflow-hidden group hover:border-gold/30 transition-colors">
                {!isMatured && <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl pointer-events-none group-hover:bg-gold/20 transition-colors"></div>}
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-xs text-gold uppercase tracking-wider font-semibold mb-1">REF: {inv.id.substring(0, 8).toUpperCase()}</div>
                    <h3 className="text-xl font-serif text-white">{inv.plan_name}</h3>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                    !isMatured ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {!isMatured && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                    {isMatured && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                    {inv.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                     <div className="text-gray-text text-xs mb-1">Amount Invested</div>
                     <div className="font-medium text-white">${parseFloat(inv.amount).toLocaleString()}</div>
                  </div>
                  <div>
                     <div className="text-gray-text text-xs mb-1">Expected ROI</div>
                     <div className="font-medium text-green-400">{inv.roi_percent}%</div>
                  </div>
                  <div>
                     <div className="text-gray-text text-xs mb-1">Returns Earned</div>
                     <div className="font-medium text-white">${parseFloat(inv.total_profit || '0').toLocaleString()}</div>
                  </div>
                  <div>
                     <div className="text-gray-text text-xs mb-1">Maturity Timeline</div>
                     <div className="font-medium text-white flex items-center gap-1">
                        <Calendar size={12} className="text-gold" /> {new Date(inv.end_date).toLocaleDateString()}
                     </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-text mb-2">
                    <span>{new Date(inv.start_date).toLocaleDateString()}</span>
                    <span>{new Date(inv.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isMatured ? 'bg-blue-500' : 'bg-gold'}`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-xs text-gray-text mt-2">{progress}% elapsed</div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border-subtle">
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 bg-navy border border-border-gold rounded-lg hover:bg-gold/10 transition-colors text-sm font-medium text-gold">
                    <FileText size={16} /> Certificate
                  </button>
                  {isMatured ? (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
