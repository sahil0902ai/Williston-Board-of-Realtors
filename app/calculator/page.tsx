'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CircleDollarSign, TrendingUp, Calculator as CalcIcon, Percent, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FadeUp } from '@/components/FadeUp';

interface Plan {
  name: string;
  roi: number;
  minMonths: number;
  maxMonths: number;
  description: string;
}

const plans: Record<string, Plan> = {
  foundation: {
    name: 'Foundation',
    roi: 18,
    minMonths: 12,
    maxMonths: 12,
    description: 'Secure, entry-level plan'
  },
  prosperity: {
    name: 'Prosperity',
    roi: 24,
    minMonths: 12,
    maxMonths: 18,
    description: 'Popular growth allocation'
  },
  legacy: {
    name: 'Legacy',
    roi: 30,
    minMonths: 6,
    maxMonths: 24,
    description: 'High-yield wealth builder'
  },
  dynasty: {
    name: 'Dynasty',
    roi: 35,
    minMonths: 6,
    maxMonths: 24,
    description: 'Bespoke co-developer opportunity'
  }
};

export default function CalculatorPage() {
  const [amount, setAmount] = useState<number>(5000);
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>('prosperity');
  const [months, setMonths] = useState<number>(12);

  const activePlan = plans[selectedPlanKey];

  // Adjust duration if it falls outside the selected plan bounds
  useEffect(() => {
    if (months < activePlan.minMonths) {
      setMonths(activePlan.minMonths);
    } else if (months > activePlan.maxMonths) {
      setMonths(activePlan.maxMonths);
    }
  }, [selectedPlanKey, activePlan]);

  // Calculations
  const roi = activePlan.roi;
  const monthlyReturn = (amount * (roi / 100)) / 12;
  const totalProfit = amount * (roi / 100) * (months / 12);
  const totalReturn = amount + totalProfit;
  const profitPercentage = (totalProfit / amount) * 100;

  const principalRatio = (amount / totalReturn) * 100;
  const profitRatio = (totalProfit / totalReturn) * 100;

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

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
                    ${amount.toLocaleString('en-US')}
                  </span>
                </div>

                <input 
                  type="range" 
                  min={500} 
                  max={100000} 
                  step={500} 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))} 
                  className="w-full h-1 bg-navy-mid border-0 rounded-lg appearance-none cursor-pointer accent-gold"
                />

                {/* Quick select buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`text-xs px-3.5 py-2 rounded-lg font-semibold border transition ${
                        amount === amt 
                          ? 'bg-gold text-navy border-gold' 
                          : 'bg-[#04091A]/60 text-gray-300 border-white/5 hover:border-gold/30 hover:text-white'
                      }`}
                    >
                      ${amt.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const customVal = window.prompt('Enter custom investment amount ($):', amount.toString());
                      if (customVal) {
                        const parsed = parseInt(customVal.replace(/\D/g, ''), 10);
                        if (!isNaN(parsed) && parsed >= 500) {
                          setAmount(parsed);
                        } else if (!isNaN(parsed)) {
                          alert('Minimum investment amount is $500.');
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
                    <option value="foundation">Foundation — 18% ROI (12 months)</option>
                    <option value="prosperity">Prosperity — 24% ROI (12-18 months)</option>
                    <option value="legacy">Legacy — 30% ROI (6-24 months)</option>
                    <option value="dynasty">Dynasty — 35% ROI (Bespoke)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
                <p className="text-[11px] text-gray-text italic">
                  * Plan type is asset-backed. Current Selection: {activePlan.name} ({activePlan.roi}% Annual ROI).
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
                    {months} Months
                  </span>
                </div>

                <input 
                  type="range" 
                  min={activePlan.minMonths} 
                  max={activePlan.maxMonths} 
                  step={1} 
                  value={months} 
                  onChange={(e) => setMonths(Number(e.target.value))} 
                  className="w-full h-1 bg-navy-mid border-0 rounded-lg appearance-none cursor-pointer accent-gold"
                />

                <div className="flex justify-between text-[10px] font-bold text-gray-text uppercase tracking-wider">
                  <span>Min: {activePlan.minMonths} Months</span>
                  <span>Max: {activePlan.maxMonths} Months</span>
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
                  
                  {/* Card 1: Monthly Return */}
                  <div className="bg-[#04091A]/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-text uppercase tracking-wider mb-1 font-bold">Monthly Return</div>
                    <div className="text-lg font-bold text-white">${monthlyReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>

                  {/* Card 2: Total Profit */}
                  <div className="bg-[#04091A]/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-text uppercase tracking-wider mb-1 font-bold">Total Profit</div>
                    <div className="text-lg font-bold text-gold">${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>

                  {/* Card 3: Total at Maturity */}
                  <div className="bg-[#04091A]/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-text uppercase tracking-wider mb-1 font-bold">At Maturity</div>
                    <div className="text-lg font-bold text-white">${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                    <span>Principal (${amount.toLocaleString()})</span>
                    <span>Profit (${totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
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
