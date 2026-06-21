'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, RefreshCw, Calendar, TrendingUp, Loader2, ArrowRight,
  ShieldCheck, HelpCircle, X, Download, Clock, DollarSign, Award,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

interface MyInvestmentsTabProps {
  profile: any;
  fetchProfile: () => Promise<void>;
}

export default function MyInvestmentsTab({ profile, fetchProfile }: MyInvestmentsTabProps) {
  const [filter, setFilter] = useState('All');
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInv, setSelectedInv] = useState<any>(null);
  const [modalTab, setModalTab] = useState<'summary' | 'documents' | 'history'>('summary');
  
  // Real-time ticking trigger
  const [tick, setTick] = useState(0);

  const tabs = ['All', 'Active', 'Matured', 'Pending'];

  const fetchInvestments = async () => {
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

  // Live ticking counter effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 5000); // Trigger a recalculation of active returns every 5 seconds
    return () => clearInterval(timer);
  }, []);

  // Helper: Calculate days elapsed between two dates
  const getDaysElapsed = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const now = Date.now();

    if (now >= end) {
      const diffTime = Math.abs(end - start);
      return Math.round(diffTime / (1000 * 60 * 60 * 24));
    }
    if (now <= start) return 0;

    const diffTime = Math.abs(now - start);
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper: Calculate total duration in days
  const getTotalDays = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const diffTime = Math.abs(end - start);
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  // Helper: Live calculations for active earnings
  const calculateLiveEarnings = (amount: number, roi: number, startDateStr: string, endDateStr: string) => {
    const daysElapsed = getDaysElapsed(startDateStr, endDateStr);
    const totalDays = getTotalDays(startDateStr, endDateStr);
    
    // Pro-rata earnings based on exact elapsed milliseconds for a ticking feel
    const startMs = new Date(startDateStr).getTime();
    const endMs = new Date(endDateStr).getTime();
    const nowMs = Date.now();

    if (nowMs >= endMs) {
      return (amount * roi) / 100;
    }
    if (nowMs <= startMs) return 0;

    const elapsedMs = nowMs - startMs;
    const totalMs = endMs - startMs;
    
    return ((amount * roi) / 100) * (elapsedMs / totalMs);
  };

  // Helper: Calculate Next Payout Info
  const calculateNextPayout = (amount: number, roi: number, startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const now = new Date();

    const monthlyPayout = (amount * (roi / 100)) / 12;

    if (now.getTime() >= end.getTime()) {
      return { amount: 0, dateLabel: 'Matured', daysLeft: 0 };
    }

    // Find the next monthly anniversary
    const nextAnniversary = new Date(start);
    let monthsToAdd = 1;
    
    while (nextAnniversary.getTime() <= now.getTime()) {
      nextAnniversary.setMonth(start.getMonth() + monthsToAdd);
      monthsToAdd++;
    }

    // If anniversary falls after end date, maturity is the next payout
    const payoutDate = nextAnniversary.getTime() > end.getTime() ? end : nextAnniversary;
    
    const diffTime = payoutDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      amount: monthlyPayout,
      dateLabel: payoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      daysLeft: Math.max(0, daysLeft)
    };
  };

  // Helper: Generate Payout Schedule Array
  const generatePayoutSchedule = (amount: number, roi: number, startDateStr: string, durationDays: number) => {
    const start = new Date(startDateStr);
    const months = Math.max(1, Math.round(durationDays / 30));
    const monthlyAmount = (amount * (roi / 100)) / 12;
    const schedule = [];

    for (let i = 1; i <= months; i++) {
      const payoutDate = new Date(start);
      payoutDate.setMonth(start.getMonth() + i);
      const isPaid = payoutDate.getTime() < Date.now();
      
      schedule.push({
        period: `Month ${i}`,
        amount: monthlyAmount,
        date: payoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: isPaid ? 'Paid' : 'Upcoming'
      });
    }
    return schedule;
  };

  // Helper: Generate History Timeline
  const generateHistoryTimeline = (amount: number, roi: number, startDateStr: string, durationDays: number) => {
    const start = new Date(startDateStr);
    const schedule = generatePayoutSchedule(amount, roi, startDateStr, durationDays);
    
    const timeline = [
      {
        date: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: 'Investment Created',
        desc: `Principal subscription of ₦${amount.toLocaleString()} started.`,
        isDone: true
      }
    ];

    schedule.forEach((item) => {
      timeline.push({
        date: item.date,
        title: item.status === 'Paid' ? 'Monthly Return Paid' : 'Monthly Return Scheduled',
        desc: `Return payout of ₦${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
        isDone: item.status === 'Paid'
      });
    });

    return timeline;
  };

  // Summary Bar stats calculations
  const totalInvested = investments
    .filter(i => i.status === 'active')
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const totalReturns = investments
    .reduce((sum, item) => {
      const live = calculateLiveEarnings(parseFloat(item.amount), item.roi_percent, item.start_date, item.end_date);
      return sum + live;
    }, 0);

  const activePlansCount = investments.filter(i => i.status === 'active').length;

  // Next Payout Date calculation across all plans
  const nextPayouts = investments
    .filter(i => i.status === 'active')
    .map(i => calculateNextPayout(parseFloat(i.amount), i.roi_percent, i.start_date, i.end_date))
    .filter(p => p.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const nextPayoutDateLabel = nextPayouts.length > 0 ? nextPayouts[0].dateLabel : 'N/A';

  // Donut chart calculations
  const planDistribution = investments.reduce((acc: any, item) => {
    const name = item.plan_name.replace(' Plan', '');
    const value = parseFloat(item.amount);
    const existing = acc.find((p: any) => p.name === name);
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name, value });
    }
    return acc;
  }, []);

  const donutColors = ['#C9A84C', '#E5C158', '#9B8133', '#F3D271'];

  // Bar chart (monthly returns mock based on historical yield)
  const barChartData = [
    { name: 'Jan', amount: 320 },
    { name: 'Feb', amount: 480 },
    { name: 'Mar', amount: 410 },
    { name: 'Apr', amount: 640 },
    { name: 'May', amount: 720 },
    { name: 'Jun', amount: totalReturns > 0 ? Math.round(totalReturns) : 580 },
  ];

  // Reinvest logic handler
  const handleReinvestAction = (amount: number, planName: string) => {
    window.location.href = `/deposit?amount=${amount}&plan=${encodeURIComponent(planName)}&reinvest=true`;
  };

  // Certificate Generator
  const downloadCertificate = (inv: any) => {
    const txtContent = `
============================================================
             WILLISTON BOARD OF REALTORS
                INVESTMENT CERTIFICATE
============================================================

This certificate is proudly presented to:
Investor Email: ${profile?.email || 'Valued Member'}
Full Name: ${profile?.full_name || 'Valued Investor'}

Subscription Details:
------------------------------------------------------------
Certificate ID: CERT-${inv.id.substring(0, 8).toUpperCase()}
Plan Level:     ${inv.plan_name}
Principal:      ₦${parseFloat(inv.amount).toLocaleString()} NGN
ROI Rate:       ${inv.roi_percent}% per cycle
Duration:       ${inv.duration_days} Days
Start Date:     ${new Date(inv.start_date).toLocaleString()}
Maturity Date:   ${new Date(inv.end_date).toLocaleString()}
Security Hash:  ${inv.id}

Underwritten by Williston Board of Realtors and Ltd Securities.
Capital secured against underlying property portfolio assets.

Authorized Signature: Williston Board Trustees
============================================================
`;
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `williston_certificate_${inv.id.substring(0, 8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Matured banner list checks
  const maturedInvestments = investments.filter(i => i.status === 'matured');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Matured Reinvest Banners */}
      {maturedInvestments.map(inv => (
        <div key={inv.id} className="bg-gradient-to-r from-gold/15 via-[#0A1224] to-gold/5 border border-border-gold rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg relative overflow-hidden animate-pulse">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gold"></div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Award size={16} className="text-gold" /> Matured Plan Completed!
            </h4>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              🎉 Your <strong>{inv.plan_name}</strong> has matured! <strong className="text-gold">₦{parseFloat(inv.amount).toLocaleString()}</strong> is in your wallet. Reinvest now to keep earning <strong>{inv.roi_percent}%</strong> returns.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button 
              onClick={() => handleReinvestAction(parseFloat(inv.amount), inv.plan_name)}
              className="px-4.5 py-2.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Reinvest Now
            </button>
            <button 
              onClick={() => window.location.href = '/withdraw'}
              className="px-4.5 py-2.5 bg-navy border border-border-subtle hover:border-gold text-gray-text hover:text-white rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Withdraw Instead
            </button>
          </div>
        </div>
      ))}

      {/* 2. Top Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-4.5 md:p-5 relative shadow-md">
          <div className="text-[10px] uppercase tracking-wider text-gray-text font-bold mb-2">Total Invested</div>
          <div className="text-xl md:text-2xl font-mono text-white font-bold">₦{totalInvested.toLocaleString()}</div>
          <div className="text-[9px] text-green-400 mt-1 flex items-center gap-1 font-sans">
            <TrendingUp size={10} /> Active Capital Yielding
          </div>
        </div>
        
        <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-4.5 md:p-5 relative shadow-md">
          <div className="text-[10px] uppercase tracking-wider text-gray-text font-bold mb-2">Returns Earned</div>
          <div className="text-xl md:text-2xl font-mono text-gold font-bold">
            ₦{totalReturns.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[9px] text-gray-400 mt-1 font-sans flex items-center gap-1">
            <Clock size={10} /> Recalculating live
          </div>
        </div>

        <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-4.5 md:p-5 relative shadow-md">
          <div className="text-[10px] uppercase tracking-wider text-gray-text font-bold mb-2">Active Plans</div>
          <div className="text-xl md:text-2xl font-mono text-white font-bold">{activePlansCount}</div>
          <div className="text-[9px] text-gold mt-1 font-sans">
            Subscribed Portfolios
          </div>
        </div>

        <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-4.5 md:p-5 relative shadow-md">
          <div className="text-[10px] uppercase tracking-wider text-gray-text font-bold mb-2">Next Payout Date</div>
          <div className="text-xl md:text-2xl font-sans text-white font-bold truncate">{nextPayoutDateLabel}</div>
          <div className="text-[9px] text-gray-400 mt-1 font-sans">
            Scheduled return date
          </div>
        </div>
      </div>

      {/* 3. Portfolio Charts */}
      {investments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          {/* Donut Chart */}
          <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-5 md:p-6 shadow-md flex flex-col">
            <h3 className="text-xs uppercase tracking-wider text-gold font-bold mb-4">Portfolio Asset Allocation</h3>
            <div className="h-56 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution.length > 0 ? planDistribution : [{ name: 'Empty', value: 100 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {planDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A1224', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-widest text-gray-text font-bold">Total Assets</span>
                <span className="text-lg font-mono font-bold text-white mt-1">₦{totalInvested.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3 text-[10px] font-sans font-semibold">
              {planDistribution.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: donutColors[index % donutColors.length] }}></div>
                  <span className="text-gray-300">{entry.name} ({Math.round((entry.value / (totalInvested || 1)) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-5 md:p-6 shadow-md flex flex-col">
            <h3 className="text-xs uppercase tracking-wider text-gold font-bold mb-4">Monthly Returns Received</h3>
            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A1224', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#C9A84C', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#fff', fontSize: '11px' }}
                  />
                  <Bar dataKey="amount" fill="#C9A84C" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 4. Filter Pills and Card Layout */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-serif font-bold text-white uppercase tracking-wider text-gold">My Subscribed Portfolios</h2>
          
          <div className="flex bg-[#0A1224] border border-border-subtle rounded-xl p-1.5 shrink-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition ${
                  filter === tab ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white cursor-pointer'
                }`}
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
          <div className="bg-[#0A1224] border border-border-subtle rounded-2xl p-12 text-center text-gray-text font-sans">
            No active or historical investments found matching the filter selection.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investments.map(inv => {
              const amount = parseFloat(inv.amount);
              const progress = Math.min(100, Math.round((getDaysElapsed(inv.start_date, inv.end_date) / getTotalDays(inv.start_date, inv.end_date)) * 100));
              
              // Live recalculation
              const liveEarnings = calculateLiveEarnings(amount, inv.roi_percent, inv.start_date, inv.end_date);
              
              const nextPayout = calculateNextPayout(amount, inv.roi_percent, inv.start_date, inv.end_date);
              const elapsedDays = getDaysElapsed(inv.start_date, inv.end_date);
              const totalDays = getTotalDays(inv.start_date, inv.end_date);

              const isMatured = inv.status === 'matured';
              const isPending = inv.status === 'pending';
              const isActive = inv.status === 'active';

              return (
                <div key={inv.id} className="bg-[#0A1224] border border-border-subtle rounded-2xl p-6 relative overflow-hidden group hover:border-gold/30 transition-colors shadow-lg">
                  {/* Subtle blur background effect */}
                  {isActive && <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none group-hover:bg-gold/15 transition-colors"></div>}
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-5 pb-4 border-b border-border-subtle/50">
                    <div>
                      <span className="text-[9px] text-gray-500 font-mono tracking-wider block mb-1">ID: {inv.id.substring(0, 8).toUpperCase()}</span>
                      <h3 className="text-md font-serif text-white font-bold">{inv.plan_name}</h3>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${
                      isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      isMatured ? 'bg-gold/15 text-gold border border-gold/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {isActive && <span className="w-1 h-1 rounded-full bg-green-500 animate-ping"></span>}
                      {inv.status}
                    </span>
                  </div>

                  {/* Amount Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-xs font-sans">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold mb-1">Principal</span>
                      <span className="font-mono text-white font-bold text-sm">₦{amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold mb-1">ROI</span>
                      <span className="text-green-400 font-bold text-sm">{inv.roi_percent}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold mb-1">Duration</span>
                      <span className="text-white font-medium text-sm">{Math.round(totalDays / 30) || 1} months</span>
                    </div>
                  </div>

                  {/* Progress section */}
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-[10px] font-sans font-bold">
                      <span className="text-gray-400">Investment Progress</span>
                      <span className="text-gold">Day {elapsedDays} of {totalDays} ({progress}%)</span>
                    </div>
                    <div className="h-2 w-full bg-navy rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full rounded-full bg-gold transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-gray-500 text-center font-sans">
                      Started {new Date(inv.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &bull; Matures {new Date(inv.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Live Earnings Card */}
                  <div className="bg-navy border border-border-subtle p-3 rounded-xl mb-4.5 flex justify-between items-center shadow-inner font-sans">
                    <span className="text-[10px] uppercase tracking-wider text-gray-text font-bold">Earnings to Date</span>
                    <span className="text-sm font-mono text-gold font-bold">
                      ₦{liveEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Next Payout Section */}
                  {isActive && nextPayout.amount > 0 && (
                    <div className="mb-6 p-3 bg-navy-light/20 border border-border-subtle/40 rounded-xl flex items-center justify-between text-[11px] text-gray-300 font-sans">
                      <span>Next Return Payout:</span>
                      <span className="font-bold text-white">
                        ₦{nextPayout.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (In {nextPayout.daysLeft} days &bull; {nextPayout.dateLabel})
                      </span>
                    </div>
                  )}

                  {/* Action Buttons Row */}
                  <div className="flex gap-3 pt-4 border-t border-border-subtle/50">
                    <button 
                      onClick={() => downloadCertificate(inv)}
                      className="flex-1 py-2 bg-navy border border-border-gold rounded-lg hover:bg-gold/10 transition-colors text-xs font-bold text-gold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText size={13} /> Certificate
                    </button>
                    <button 
                      onClick={() => { setSelectedInv(inv); setModalTab('summary'); }}
                      className="flex-1 py-2 bg-[#0E1B35] hover:bg-[#15274C] border border-border-subtle rounded-lg transition-colors text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      View Details
                    </button>
                    {isMatured && (
                      <button 
                        onClick={() => handleReinvestAction(amount, inv.plan_name)}
                        className="py-2 px-4 bg-gold hover:bg-gold-light text-navy rounded-lg font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
                      >
                        <RefreshCw size={13} /> Reinvest
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. INVESTMENT DETAIL MODAL */}
      {selectedInv && (() => {
        const amount = parseFloat(selectedInv.amount);
        const totalDays = getTotalDays(selectedInv.start_date, selectedInv.end_date);
        const liveEarnings = calculateLiveEarnings(amount, selectedInv.roi_percent, selectedInv.start_date, selectedInv.end_date);
        const payoutSchedule = generatePayoutSchedule(amount, selectedInv.roi_percent, selectedInv.start_date, totalDays);
        const historyTimeline = generateHistoryTimeline(amount, selectedInv.roi_percent, selectedInv.start_date, totalDays);

        return (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-navy-light border border-border-gold rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-border-subtle/50 pb-4 mb-5">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white leading-tight">{selectedInv.plan_name} Details</h3>
                  <span className="text-[10px] text-gray-500 font-mono tracking-wider block mt-1">UUID: {selectedInv.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedInv(null)} 
                  className="text-gray-text hover:text-white p-1 hover:bg-white/5 rounded transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-border-subtle/50 mb-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {['summary', 'documents', 'history'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab as any)}
                    className={`pb-2.5 px-4 transition border-b-2 ${
                      modalTab === tab ? 'border-gold text-gold' : 'border-transparent hover:text-white cursor-pointer'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Modal Content */}
              <div className="flex-1 space-y-4">
                {modalTab === 'summary' && (
                  <div className="space-y-6 font-sans">
                    {/* Investment Details Table */}
                    <div className="bg-navy p-4 rounded-xl border border-border-subtle/60 text-xs space-y-2.5">
                      <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Plan Name</span><span className="text-white font-medium">{selectedInv.plan_name}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Principal Investment</span><span className="text-white font-mono font-bold">₦{amount.toLocaleString()}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">ROI Percentage</span><span className="text-green-400 font-bold">{selectedInv.roi_percent}%</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Lock Duration</span><span className="text-white font-medium">{totalDays} Days</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Accrued Yields (Live)</span><span className="text-gold font-mono font-bold">₦{liveEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                      <div className="flex justify-between pb-1"><span className="text-gray-500">Total Return at Maturity</span><span className="text-white font-mono font-bold">₦{((amount * selectedInv.roi_percent) / 100).toLocaleString()}</span></div>
                    </div>

                    {/* Payout Schedule Table */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase tracking-wider text-gold font-bold">Scheduled Monthly Payouts</h4>
                      <div className="bg-navy rounded-xl border border-border-subtle/60 overflow-hidden text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-navy-light/30 border-b border-white/5 text-[9px] uppercase text-gray-500 font-bold">
                              <th className="p-3">Period</th>
                              <th className="p-3">Scheduled Date</th>
                              <th className="p-3">Payout Amount</th>
                              <th className="p-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payoutSchedule.map((payout, idx) => (
                              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-3 text-white font-semibold">{payout.period}</td>
                                <td className="p-3 font-mono text-gray-400">{payout.date}</td>
                                <td className="p-3 font-mono text-white font-medium">₦{payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="p-3 text-right">
                                  {payout.status === 'Paid' ? (
                                    <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold">Paid</span>
                                  ) : (
                                    <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold">Upcoming</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'documents' && (
                  <div className="space-y-4 font-sans text-xs">
                    <div className="bg-navy p-4 rounded-xl border border-border-subtle/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gold/10 border border-gold/20 rounded flex items-center justify-center text-gold"><FileText size={18} /></div>
                        <div>
                          <h4 className="text-xs font-semibold text-white">Co-Ownership Agreement PDF</h4>
                          <span className="text-[10px] text-gray-500">Legal co-ownership certificate & guidelines</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => downloadCertificate(selectedInv)}
                        className="px-3 py-1.5 bg-[#0E1B35] hover:bg-gold hover:text-navy text-white text-[10px] font-bold rounded uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>

                    <div className="bg-navy p-4 rounded-xl border border-border-subtle/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gold/10 border border-gold/20 rounded flex items-center justify-center text-gold"><Award size={18} /></div>
                        <div>
                          <h4 className="text-xs font-semibold text-white">Investment Certificate</h4>
                          <span className="text-[10px] text-gray-500">Digital ownership proof with transaction hash</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => downloadCertificate(selectedInv)}
                        className="px-3 py-1.5 bg-[#0E1B35] hover:bg-gold hover:text-navy text-white text-[10px] font-bold rounded uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>

                    <div className="bg-navy p-4 rounded-xl border border-border-subtle/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gold/10 border border-gold/20 rounded flex items-center justify-center text-gold"><DollarSign size={18} /></div>
                        <div>
                          <h4 className="text-xs font-semibold text-white">Deposit Payment Receipt</h4>
                          <span className="text-[10px] text-gray-500">Audited receipt of bank transfer/proof</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => downloadCertificate(selectedInv)}
                        className="px-3 py-1.5 bg-[#0E1B35] hover:bg-gold hover:text-navy text-white text-[10px] font-bold rounded uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>
                  </div>
                )}

                {modalTab === 'history' && (
                  <div className="space-y-4 font-sans text-xs">
                    <div className="relative pl-6 border-l border-white/10 space-y-6 py-2 ml-3">
                      {historyTimeline.map((item, index) => (
                        <div key={index} className="relative">
                          {/* Dot indicator */}
                          <div className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                            item.isDone ? 'bg-green-500 border-green-500 text-navy' : 'bg-navy border-white/20 text-gray-600'
                          }`}>
                            <CheckCircle2 size={12} />
                          </div>
                          
                          {/* Timeline Item Content */}
                          <div>
                            <span className="text-[9px] text-gold font-mono uppercase tracking-wider font-bold">{item.date}</span>
                            <h4 className="text-xs font-semibold text-white mt-0.5">{item.title}</h4>
                            <p className="text-[10px] text-gray-400 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
