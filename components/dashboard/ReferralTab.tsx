"use client";
import { Copy, Share2, Facebook, Twitter, Mail, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ReferralTab() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://williston.com/ref/EA1092";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referrals = [
    { name: 'Chinedu Okafor', date: 'May 10, 2026', plan: 'Prosperity Plan', commission: '$35,000', status: 'Paid' },
    { name: 'Sarah Johnson', date: 'May 12, 2026', plan: 'Foundation Plan', commission: '$7,500', status: 'Paid' },
    { name: 'Michael Eze', date: 'May 18, 2026', plan: 'Starter Plan', commission: '$8,000', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif">Refer & Earn</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6 relative overflow-hidden">
          <div className="text-sm text-gray-text mb-2">Total Referred</div>
          <div className="text-3xl font-serif text-white">28</div>
        </div>
        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Commission Rate</div>
          <div className="text-3xl font-serif text-gold">7%</div>
        </div>
        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Total Earned</div>
          <div className="text-3xl font-serif text-green-400">$42,500</div>
        </div>
        <div className="bg-navy-mid border border-border-subtle rounded-xl p-6">
          <div className="text-sm text-gray-text mb-2">Pending Bonus</div>
          <div className="text-3xl font-serif text-yellow-500">$8,000</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-navy-mid border border-border-gold/30 rounded-xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          <h3 className="text-xl font-serif mb-2 relative z-10">Your Unique Referral Link</h3>
          <p className="text-gray-text text-sm mb-6 relative z-10 max-w-md">Share this link with your network. When they invest using your link, you earn a 7% commission on their first deposit.</p>
          
          <div className="flex items-center bg-navy border border-border-subtle rounded-lg p-1 max-w-lg mb-6 relative z-10">
            <div className="flex-1 px-4 text-sm text-gray-300 font-mono truncate">{referralLink}</div>
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-gold text-navy hover:bg-white'}`}
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />} 
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="relative z-10">
            <div className="text-xs text-gray-text uppercase tracking-wider font-semibold mb-3">Share directly via</div>
            <div className="flex flex-wrap gap-3">
               <button className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors">
                 <Share2 size={16} /> {/* WhatsApp placeholder icon */}
               </button>
               <button className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors">
                 <Twitter size={16} />
               </button>
               <button className="w-10 h-10 rounded-full bg-[#4267B2]/10 border border-[#4267B2]/20 flex items-center justify-center text-[#4267B2] hover:bg-[#4267B2] hover:text-white transition-colors">
                 <Facebook size={16} />
               </button>
               <button className="w-10 h-10 rounded-full bg-gray-500/10 border border-gray-500/20 flex items-center justify-center text-gray-300 hover:bg-white hover:text-navy transition-colors">
                 <Mail size={16} />
               </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-navy-mid border border-border-subtle rounded-xl p-6">
           <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border-subtle rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4">
                 <Share2 size={24} />
              </div>
              <h4 className="text-lg font-serif mb-2">How it works</h4>
              <ul className="text-sm text-gray-text space-y-3 text-left">
                <li className="flex gap-2 isolate"><span className="text-gold font-bold">1.</span> Share your link with friends</li>
                <li className="flex gap-2 isolate"><span className="text-gold font-bold">2.</span> Friend registers and verifies account</li>
                <li className="flex gap-2 isolate"><span className="text-gold font-bold">3.</span> Friend funds investment plan</li>
                <li className="flex gap-2 isolate"><span className="text-gold font-bold">4.</span> You receive 7% commission instantly</li>
              </ul>
           </div>
        </div>
      </div>

      <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border-subtle">
          <h3 className="text-lg font-serif">Referral Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-navy-light/50 text-xs text-gray-text uppercase tracking-wider">
                <th className="p-4 font-medium">Referred Name</th>
                <th className="p-4 font-medium">Date Joined</th>
                <th className="p-4 font-medium">Plan Invested</th>
                <th className="p-4 font-medium">Commission Earned</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border-subtle">
              {referrals.map((ref, i) => (
                <tr key={i} className="hover:bg-navy-light/30 transition-colors">
                  <td className="p-4 font-medium flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-navy border border-border-subtle flex items-center justify-center text-xs text-gold font-bold">
                        {ref.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     {ref.name}
                  </td>
                  <td className="p-4 text-gray-text">{ref.date}</td>
                  <td className="p-4 text-gray-text">{ref.plan}</td>
                  <td className="p-4 font-medium text-green-400">{ref.commission}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-medium ${ref.status === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {ref.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
