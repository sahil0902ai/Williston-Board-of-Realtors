"use client";
import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Upload, History, Anchor } from 'lucide-react';

interface WalletTabProps {
  setActiveTab: (tab: string) => void;
}

export default function WalletTab({ setActiveTab }: WalletTabProps) {
  const [filter, setFilter] = useState('All');
  
  const filters = ['All', 'Deposits', 'Withdrawals', 'Returns', 'Referral Bonus'];

  const transactions = [
    { id: 'TRX-93820', type: 'Return Payout', amount: '+$10,000', date: 'May 15, 2026', status: 'Completed', category: 'Returns' },
    { id: 'TRX-58291', type: 'Referral Bonus', amount: '+$2,500', date: 'May 12, 2026', status: 'Completed', category: 'Referral Bonus' },
    { id: 'TRX-10394', type: 'Deposit', amount: '+$150,000', date: 'May 01, 2026', status: 'Completed', category: 'Deposits' },
    { id: 'TRX-10395', type: 'New Investment', amount: '-$150,000', date: 'May 01, 2026', status: 'Completed', category: 'Withdrawals' },
    { id: 'TRX-83921', type: 'Return Payout', amount: '+$10,000', date: 'Apr 15, 2026', status: 'Completed', category: 'Returns' },
    { id: 'TRX-42910', type: 'Withdrawal', amount: '-$500', date: 'Mar 22, 2026', status: 'Processing', category: 'Withdrawals' },
  ];

  const filteredTx = transactions.filter(tx => filter === 'All' ? true : tx.category === filter);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif">Wallet</h2>
      
      <div className="bg-gradient-to-br from-navy-mid to-navy border border-border-gold rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-gold uppercase tracking-widest text-xs font-semibold mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span> Available Balance
            </div>
            <div className="text-5xl md:text-6xl font-serif text-white mb-2 tracking-tight">$125,000<span className="text-2xl text-gray-text">.00</span></div>
            <div className="text-sm text-gray-text">Ready for withdrawal or reinvestment</div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setActiveTab('deposit')} className="flex-1 flex items-center justify-center gap-2 p-4 bg-gold text-navy rounded-xl hover:bg-white transition-colors text-base font-semibold shadow-lg shadow-gold/20">
              <ArrowDownRight size={20} /> Deposit
            </button>
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
              {filteredTx.map(tx => (
                <tr key={tx.id} className="hover:bg-navy-light/30 transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-text">{tx.id}</td>
                  <td className="p-4 text-gray-text">{tx.date}</td>
                  <td className="p-4">
                     <span className="font-medium text-white">{tx.type}</span>
                  </td>
                  <td className={`p-4 font-medium ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>
                    {tx.amount}
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-medium ${tx.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {tx.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTx.length === 0 && (
             <div className="p-8 text-center text-gray-text">
                No transactions found for this filter.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
