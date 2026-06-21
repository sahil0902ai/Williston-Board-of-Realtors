'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CircleDollarSign, TrendingUp, Calculator as CalcIcon, Percent, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FadeUp } from '@/components/FadeUp';

interface Plan {
  name: string;
  roi: number; // annual or flat
  isFlat: boolean;
  minDuration: number;
  maxDuration: number;
  durationUnit: 'days' | 'months';
  description: string;
  minAmount: number;
  maxAmount: number;
}

const plans: Record<string, Plan> = {
  quick7: {
    name: '7-Day Quick',
    roi: 8,
    isFlat: true,
    minDuration: 7,
    maxDuration: 7,
    durationUnit: 'days',
    description: 'Quick Returns (8% in 7 days)',
    minAmount: 20000,
    maxAmount: 200000,
  },
  standard30: {
    name: '30-Day Standard',
    roi: 15,
    isFlat: true,
    minDuration: 30,
    maxDuration: 30,
    durationUnit: 'days',
    description: '15% in 30 days',
    minAmount: 50000,
    maxAmount: 1000000,
  },
  foundation: {
    name: 'Foundation',
    roi: 15,
    isFlat: false,
    minDuration: 1, // 30 days
    maxDuration: 6, // 180 days
    durationUnit: 'months',
    description: '15% p.a. Secure Entry',
    minAmount: 50000,
    maxAmount: 500000,
  },
  growth: {
    name: 'Growth',
    roi: 20,
    isFlat: false,
    minDuration: 3, // 90 days
    maxDuration: 6, // 180 days
    durationUnit: 'months',
    description: '20% p.a. Wealth Growth',
    minAmount: 100000,
    maxAmount: 2000000,
  },
  premium: {
    name: 'Premium',
    roi: 28,
    isFlat: false,
    minDuration: 6, // 180 days
    maxDuration: 12, // 365 days
    durationUnit: 'months',
    description: '28% p.a. Premium Yield',
    minAmount: 500000,
    maxAmount: 10000000,
  },
  elite: {
    name: 'Elite',
    roi: 35,
    isFlat: false,
    minDuration: 12, // 365 days
    maxDuration: 24, // custom
    durationUnit: 'months',
    description: '35% p.a. Elite Wealth',
    minAmount: 2000000,
    maxAmount: 50000000,
  }
};

export default function CalculatorPage() {
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>('growth');
  const activePlan = plans[selectedPlanKey];

  const [amount, setAmount] = useState<number>(100000);
  const [duration, setDuration] = useState<number>(3);

  // Sync duration and amount when activePlan changes
  useEffect(() => {
    if (duration < activePlan.minDuration) {
      setDuration(activePlan.minDuration);
    } else if (duration > activePlan.maxDuration) {
      setDuration(activePlan.maxDuration);
    }

    if (amount < activePlan.minAmount) {
      setAmount(activePlan.minAmount);
    } else if (amount > activePlan.maxAmount) {
      setAmount(activePlan.maxAmount);
    }
  }, [selectedPlanKey, activePlan]);

  // Calculations
  const roi = activePlan.roi;
  const isDays = activePlan.durationUnit === 'days';
  
  const totalProfit = activePlan.isFlat
    ? amount * (roi / 100)
    : amount * (roi / 100) * (duration / 12);

  const totalReturn = amount + totalProfit;
  const profitPercentage = (totalProfit / amount) * 100;

  const monthlyReturn = activePlan.isFlat
    ? totalProfit / (duration / 30) // average monthly for flat
    : (amount * (roi / 100)) / 12;

  const principalRatio = (amount / totalReturn) * 100;
  const profitRatio = (totalProfit / totalReturn) * 100;

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  return (
    <>
      <Header />
      <div className="pt-24 bg-navy min-h-screen text-white flex flex-col justify-between">
        
        {/* Breadcrumb & Title */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-text tracking-wider uppercase mb-8">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-gold">&gt;</span>
            <span className="text-white">ROI Calculator</span>
          </div>

          <FadeUp className="text-center md:text-left mb-12">
            <span className="text-gold uppercase tracking-widest text-xs font-bold mb-3 block">Projection Tools</span>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Real Estate ROI <span className="italic text-gold">Calculator</span>
            </h1>
            <p className="text-gray-text max-w-2xl text-base leading-relaxed">
              Estimate your passive returns by configuring your allocation size, choosing a secured asset plan, and setting your lock duration.
            </p>
          </FadeUp>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-12 gap-8 mb-24">
            
            {/* Inputs Panel */}
            <div className="lg:col-span-7 bg-[#0e162f]/45 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col justify-between space-y-8">
              
              {/* Input 1: Investment Amount */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-text uppercase tracking-wider block flex items-center gap-1.5">
                    <CircleDollarSign size={16} className="text-gold" />
                    Investment Amount
                  </label>
                  <span className="text-2xl font-serif text-gold font-bold">
                    ₦{amount.toLocaleString('en-NG')}
                  </span>
                </div>

                <input 
                  type="range" 
                  min={activePlan.minAmount} 
                  max={activePlan.maxAmount} 
                  step={activePlan.minAmount >= 500000 ? 50000 : 10000} 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))} 
                  className="w-full h-1 bg-navy-mid border-0 rounded-lg appearance-none cursor-pointer accent-gold"
                />

                {/* Quick select buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickAmounts
                    .filter(amt => amt >= activePlan.minAmount && amt <= activePlan.maxAmount)
                    .map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt)}
                        className={`text-xs px-3.5 py-2 rounded-lg font-semibold border transition ${
                          amount === amt 
                            ? 'bg-gold text-navy border-gold' 
                            : 'bg-[#04091A]/60 text-gray-300 border-white/5 hover:border-gold/30 hover:text-white'
                        }`}
                      >
                        ₦{(amt / 1000).toFixed(0)}K
                      </button>
                    ))}
                  <button
                    onClick={() => {
                      const customVal = window.prompt(`Enter custom investment amount (₦) between ₦${activePlan.minAmount.toLocaleString()} and ₦${activePlan.maxAmount.toLocaleString()}:`, amount.toString());
                      if (customVal) {
                        const parsed = parseInt(customVal.replace(/\D/g, ''), 10);
                        if (!isNaN(parsed) && parsed >= activePlan.minAmount && parsed <= activePlan.maxAmount) {
                          setAmount(parsed);
                        } else if (!isNaN(parsed)) {
                          alert(`Please enter a valid amount within plan limits.`);
                        }
                      }
                    }}
                    className="text-xs px-3.5 py-2 rounded-lg font-semibold border bg-[#04091A]/60 text-gray-300 border-white/5 hover:border-gold/30 hover:text-gold transition"
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Input 2: Investment Plan Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-text uppercase tracking-wider block flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-gold" />
                  Investment Plan Package
                </label>
                <div className="relative">
                  <select
                    value={selectedPlanKey}
                    onChange={(e) => setSelectedPlanKey(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#04091A] rounded-xl border border-white/5 text-sm text-white focus:outline-none focus:border-gold appearance-none cursor-pointer"
                  >
                    <option value="quick7">7-Day Quick Plan — 8% ROI (7 Days)</option>
                    <option value="standard30">30-Day Standard Plan — 15% ROI (30 Days)</option>
                    <option value="foundation">Foundation Plan — 15% p.a. ROI</option>
                    <option value="growth">Growth Plan — 20% p.a. ROI</option>
                    <option value="premium">Premium Plan — 28% p.a. ROI</option>
                    <option value="elite">Elite Plan — 35% p.a. ROI</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
                <p className="text-[11px] text-gray-text italic">
                  * Plan type is asset-backed. Current Selection: {activePlan.name} ({activePlan.roi}% {activePlan.isFlat ? 'Flat' : 'Annual'} ROI).
                </p>
              </div>

              {/* Input 3: Duration Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-text uppercase tracking-wider block flex items-center gap-1.5">
                    <Calendar size={16} className="text-gold" />
                    Lock Duration
                  </label>
                  <span className="text-lg font-semibold text-white">
                    {duration} {activePlan.durationUnit === 'days' ? 'Days' : 'Months'}
                  </span>
                </div>

                <input 
                  type="range" 
                  min={activePlan.minDuration} 
                  max={activePlan.maxDuration} 
                  step={1} 
                  value={duration} 
                  onChange={(e) => setDuration(Number(e.target.value))} 
                  className="w-full h-1 bg-navy-mid border-0 rounded-lg appearance-none cursor-pointer accent-gold"
                  disabled={activePlan.minDuration === activePlan.maxDuration}
                />

                <div className="flex justify-between text-[10px] font-bold text-gray-text uppercase tracking-wider">
                  <span>Min: {activePlan.minDuration} {activePlan.durationUnit}</span>
                  <span>Max: {activePlan.maxDuration} {activePlan.durationUnit}</span>
                </div>
              </div>

            </div>

            {/* Live Outputs Panel */}
            <div className="lg:col-span-5 bg-navy-mid border border-gold/15 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div>
                <h3 className="text-lg font-serif text-white mb-6 pb-4 border-b border-white/5 flex items-center gap-2">
                  <CalcIcon size={18} className="text-gold animate-pulse" />
                  Estimated Projections
                </h3>

                {/* Outputs Cards Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  
                  {/* Card 1: Periodic Return */}
                  <div className="bg-[#04091A]/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-text uppercase tracking-wider mb-1 font-bold">
                      {activePlan.isFlat ? 'Daily Equiv.' : 'Monthly Return'}
                    </div>
                    <div className="text-lg font-bold text-white">
                      ₦{((activePlan.isFlat ? totalProfit / duration : monthlyReturn)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Card 2: Total Profit */}
                  <div className="bg-[#04091A]/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-text uppercase tracking-wider mb-1 font-bold">Total Profit</div>
                    <div className="text-lg font-bold text-gold">₦{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>

                  {/* Card 3: Total at Maturity */}
                  <div className="bg-[#04091A]/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-text uppercase tracking-wider mb-1 font-bold">At Maturity</div>
                    <div className="text-lg font-bold text-white">₦{totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>

                  {/* Card 4: Profit Percentage */}
                  <div className="bg-[#04091A]/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-text uppercase tracking-wider mb-1 font-bold flex items-center gap-1">
                      <Percent size={11} className="text-gold" /> Net ROI
                    </div>
                    <div className="text-lg font-bold text-gold">{profitPercentage.toFixed(1)}%</div>
                  </div>

                </div>

                {/* Visual Bar Indicator */}
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between text-[10px] font-bold text-gray-text uppercase tracking-wider">
                    <span>Principal (₦{amount.toLocaleString()})</span>
                    <span>Profit (₦{totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
                  </div>
                  <div className="w-full h-3 bg-[#04091A] rounded-full overflow-hidden flex border border-white/5">
                    <div className="bg-navy-light h-full" style={{ width: `${principalRatio}%` }} title="Principal"></div>
                    <div className="bg-gold h-full" style={{ width: `${profitRatio}%` }} title="Estimated Profit"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-text">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-navy-light"></div>
                      {principalRatio.toFixed(0)}% Allocation
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-gold"></div>
                      {profitRatio.toFixed(0)}% Growth
                    </span>
                  </div>
                </div>
              </div>

              {/* Action & Footer */}
              <div className="space-y-4">
                <Link 
                  href={`/register?plan=${activePlan.name.toLowerCase()}`}
                  className="w-full py-4 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gold/5 uppercase tracking-wider"
                >
                  Start This Investment Plan <ArrowRight size={16} />
                </Link>
                
                <p className="text-[10px] text-center text-gray-text italic">
                  "Returns are estimated projections. Actual returns may vary."
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
