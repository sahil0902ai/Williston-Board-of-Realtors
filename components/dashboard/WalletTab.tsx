"use client";
import { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, History, Loader2 } from 'lucide-react';

interface WalletTabProps {
  setActiveTab: (tab: string) => void;
  profile: any;
  fetchProfile: () => void;
}

export default function WalletTab({ setActiveTab, profile, fetchProfile }: WalletTabProps) {
  const [filter, setFilter] = useState('All');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Deposits', 'Withdrawals', 'Returns', 'Referral Bonus'];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/user/transactions');
        if (res.ok) {
          const data = await res.json();
          setTransactions(data || []);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTx = transactions.filter(tx => {
    if (filter === 'All') return true;
    const type = tx.type.toLowerCase();
    if (filter === 'Deposits') return type === 'deposit';
    if (filter === 'Withdrawals') return type === 'withdrawal' || type === 'investment';
    if (filter === 'Returns') return type === 'return' || type.includes('payout');
    if (filter === 'Referral Bonus') return type === 'referral';
    return true;
  });

  const availableBalance = parseFloat(profile?.wallet_balance || '0');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-serif">Wallet</h2>
      
      <div className="bg-gradient-to-br from-navy-mid to-navy border border-border-gold rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-gold uppercase tracking-widest text-xs font-semibold mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span> Available Balance
            </div>
            <div className="text-5xl md:text-6xl font-serif text-white mb-2 tracking-tight">
              ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-text">Ready for withdrawal or reinvestment</div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/deposit" className="flex-1 flex items-center justify-center gap-2 p-4 bg-gold text-navy rounded-xl hover:bg-white transition-colors text-base font-semibold shadow-lg shadow-gold/20">
              <ArrowDownRight size={20} /> Deposit
            </a>
            <button onClick={() => setActiveTab('withdraw')} className="flex-1 flex items-center justify-center gap-2 p-4 bg-navy-light text-white border border-border-subtle rounded-xl hover:border-gold hover:text-gold transition-colors text-base font-medium">
              <ArrowUpRight size={20} /> Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-serif flex items-center gap-2"><History size={18} className="text-gold" /> Transaction History</h3>
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-3 py-1 text-xs rounded-full border transition-colors ${filter === f ? 'bg-gold/10 border-gold text-gold font-medium' : 'bg-navy border-border-subtle text-gray-text hover:text-white'}`}
               >
                 {f}
               </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-gold" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-navy-light/50 text-xs text-gray-text uppercase tracking-wider">
                  <th className="p-4 font-medium rounded-tl-lg">Reference</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border-subtle">
                {filteredTx.map(tx => {
                  const isPositive = parseFloat(tx.amount) > 0 || tx.type === 'deposit' || tx.type === 'referral';
                  return (
                    <tr key={tx.id} className="hover:bg-navy-light/30 transition-colors">
                      <td className="p-4 font-mono text-xs text-gray-text">{tx.reference || tx.id.substring(0, 13)}</td>
                      <td className="p-4 text-gray-text">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                         <span className="font-medium text-white capitalize">{tx.type}</span>
                      </td>
                      <td className={`p-4 font-medium ${isPositive ? 'text-green-400' : 'text-white'}`}>
                        {isPositive ? '+' : ''}${parseFloat(tx.amount).toLocaleString()}
                      </td>
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded text-xs font-medium ${tx.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            {tx.status}
                         </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filteredTx.length === 0 && (
             <div className="p-8 text-center text-gray-text">
                No transactions found for this filter.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
