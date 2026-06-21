'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { FadeUp } from './FadeUp';
import SectionLabel from './SectionLabel';

export default function InvestmentPackages({ hideHeader = false }: { hideHeader?: boolean }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'7-Day Quick' | '30-Day Standard' | 'Foundation' | 'Growth' | 'Premium' | 'Elite'>('7-Day Quick');

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        // Ignored
      }
    }
    checkAuth();
  }, []);

  const plans = {
    '7-Day Quick': {
      name: "7-Day Quick Plan",
      roi: "8%",
      minAmount: "₦20,000",
      maxAmount: "₦200,000",
      duration: "7 Days",
      allocation: "Short-term bridging finance for commercial land clearing and layout projects.",
      payoutSchedule: "Principal and interest paid in full at maturity.",
      features: [
        "8% ROI on completion",
        "Short 7-day maturity period",
        "Digital Certificate of Investment",
        "5% Referral Partner Commission",
        "Perfect for testing the platform"
      ]
    },
    '30-Day Standard': {
      name: "30-Day Standard Plan",
      roi: "15%",
      minAmount: "₦50,000",
      maxAmount: "₦1,000,000",
      duration: "30 Days",
      allocation: "Residential renovation and quick-turn flip properties in Anambra State.",
      payoutSchedule: "Principal and interest paid in full at maturity.",
      features: [
        "15% ROI on completion",
        "30-day maturity period",
        "Digital Certificate of Investment",
        "5% Referral Partner Commission",
        "Consistent short-term monthly gains"
      ]
    },
    'Foundation': {
      name: "Foundation Plan",
      roi: "15%",
      minAmount: "₦50,000",
      maxAmount: "₦500,000",
      duration: "90 Days",
      allocation: "Standard residential housing developments across prime Anambra estates.",
      payoutSchedule: "Returns paid monthly, principal returned at maturity.",
      features: [
        "15% Annualized Returns (Paid Monthly)",
        "90-day maturity period",
        "Digital Certificate of Co-ownership",
        "5% Referral Partner Commission",
        "Full capital security under local property equity"
      ]
    },
    'Growth': {
      name: "Growth Plan",
      roi: "20%",
      minAmount: "₦100,000",
      maxAmount: "₦2,000,000",
      duration: "180 Days",
      allocation: "High-value multi-family residential estates in Awka and Nnewi.",
      payoutSchedule: "Returns paid monthly, principal returned at maturity.",
      features: [
        "20% Annualized Returns (Paid Monthly)",
        "180-day maturity period",
        "Fractional real estate unit allocation",
        "7% Referral Partner Commission",
        "Priority investor support & reports"
      ]
    },
    'Premium': {
      name: "Premium Plan",
      roi: "28%",
      minAmount: "₦500,000",
      maxAmount: "₦10,000,000",
      duration: "365 Days",
      allocation: "Premium commercial office plazas and mixed-use properties in Onitsha.",
      payoutSchedule: "Selectable monthly or quarterly returns.",
      features: [
        "28% Annualized Returns (Paid Monthly/Quarterly)",
        "365-day maturity period",
        "Guaranteed physical property deed allocation",
        "10% Referral Partner Commission",
        "Dedicated Relationship Manager"
      ]
    },
    'Elite': {
      name: "Elite Plan",
      roi: "35%",
      minAmount: "₦2,000,000",
      maxAmount: "Unlimited",
      duration: "365 Days",
      allocation: "Bespoke luxury complexes and commercial co-development ventures in Lekki & Abuja.",
      payoutSchedule: "Customizable payout schedule matching project cycles.",
      features: [
        "35% Institutional-Grade Annualized Returns",
        "Bespoke contract structures & durations",
        "Joint-Venture and Co-Developer equity sharing",
        "Board-level platform access & physical assets",
        "Global currency bank wire and crypto support"
      ]
    }
  };

  const currentPlan = plans[activeTab];

  return (
    <section id="invest" className="py-20 md:py-28 bg-navy relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {!hideHeader && (
          <FadeUp className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel className="justify-center">Investment Tiers</SectionLabel>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 text-white">Choose Your Plan</h2>
            <p className="text-gray-text text-lg leading-relaxed">
              Every plan is backed by real, verified Nigerian real estate assets to guarantee your principal security.
            </p>
          </FadeUp>
        )}

        {/* Horizontal Tab Selector */}
        <FadeUp className="max-w-3xl mx-auto mb-12 border-b border-white/5 flex justify-between gap-2 md:gap-4 overflow-x-auto hide-scrollbar pb-1">
          {(['7-Day Quick', '30-Day Standard', 'Foundation', 'Growth', 'Premium', 'Elite'] as const).map((tabName) => {
            const isSelected = activeTab === tabName;
            return (
              <button
                key={tabName}
                suppressHydrationWarning
                onClick={() => setActiveTab(tabName)}
                className={`py-4 px-6 md:px-8 font-serif text-lg md:text-xl font-medium tracking-wide uppercase transition duration-300 relative border-b-2 whitespace-nowrap focus:outline-none cursor-pointer ${
                  isSelected 
                    ? 'border-gold text-gold font-semibold' 
                    : 'border-transparent text-gray-text hover:text-white'
                }`}
              >
                {tabName}
                {tabName === 'Foundation' && (
                  <span className="absolute -top-1 right-2 text-[9px] bg-gold text-navy font-bold uppercase tracking-widest px-2 py-0.5 rounded-full scale-90">
                    Popular
                  </span>
                )}
              </button>
            );
          })}
        </FadeUp>

        {/* Detailed Plan Panel */}
        <FadeUp>
          <div className="bg-[#0A1628]/95 border border-gold/15 p-8 md:p-12 rounded-2xl shadow-2xl backdrop-blur-sm grid lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Side: Plan Overview (5/12 width) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="text-sm font-semibold tracking-widest text-gray-text uppercase">
                  {currentPlan.name} Investment Tier
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-6xl md:text-7xl font-bold text-gold tracking-tight">
                    {currentPlan.roi}
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-gray-text uppercase">
                    {activeTab === '7-Day Quick' || activeTab === '30-Day Standard' ? 'return' : 'per annum'}
                  </span>
                </div>
              </div>

              {/* Plan metrics list */}
              <div className="space-y-4 py-6 border-y border-white/5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-text font-medium">Minimum Investment:</span>
                  <span className="text-white font-bold font-mono text-base">{currentPlan.minAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-text font-medium">Maximum Investment:</span>
                  <span className="text-white font-bold font-mono text-base">{currentPlan.maxAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-text font-medium">Plan Duration:</span>
                  <span className="text-white font-bold text-base">{currentPlan.duration}</span>
                </div>
              </div>

              <div className="pt-2">
                {currentPlan.name === 'Elite Plan' ? (
                  <a 
                    suppressHydrationWarning
                    href="https://t.me/willistonboardofrealtors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 bg-gold text-navy font-bold text-center block rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-gold/5 hover:bg-gold-light transition duration-300 cursor-pointer"
                  >
                    Schedule Consultation
                  </a>
                ) : (
                  <Link 
                    suppressHydrationWarning
                    href={isLoggedIn ? `/deposit?plan=${currentPlan.name.toLowerCase()}` : '/register'}
                    className="w-full py-4 px-6 bg-gold text-navy font-bold text-center block rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-gold/5 hover:bg-gold-light transition duration-300"
                  >
                    Invest In {currentPlan.name}
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side: Features & Allocation (7/12 width) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8 lg:pl-8 lg:border-l border-white/5">
              
              {/* Features check list */}
              <div className="space-y-4">
                <div className="text-xs font-bold tracking-widest text-gray-text uppercase mb-2">
                  Key Privileges & Features
                </div>
                <ul className="space-y-3.5">
                  {currentPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 text-sm md:text-base text-white/90 font-light">
                      <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-gold mt-0.5 shrink-0">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Property Allocation & Payout Schedule */}
              <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-white/5 text-xs">
                <div className="space-y-1.5">
                  <div className="font-bold tracking-widest text-gray-text uppercase">Property Allocation</div>
                  <p className="text-gray-text leading-relaxed font-light">{currentPlan.allocation}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="font-bold tracking-widest text-gray-text uppercase">Payout Schedule</div>
                  <p className="text-gray-text leading-relaxed font-light">{currentPlan.payoutSchedule}</p>
                </div>
              </div>

            </div>

          </div>
        </FadeUp>

        <FadeUp delay={0.4} className="text-center mt-12 text-xs text-gray-text tracking-wide font-light">
          * Returns are legally protected and secured against underlying assets. Terms &amp; Conditions apply.
        </FadeUp>

      </div>
    </section>
  );
}
