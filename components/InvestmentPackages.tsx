'use client';

import { Check } from "lucide-react";
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function InvestmentPackages({ hideHeader = false }: { hideHeader?: boolean }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        // Not logged in
      }
    }
    checkAuth();
  }, []);

  const plans = [
    {
      name: "Foundation",
      minAmount: "$500",
      roi: "18%",
      duration: "12 Months",
      features: [
        "18% Annual Returns",
        "Monthly Payouts",
        "Digital Certificate",
        "5% Referral Bonus",
      ],
      isPopular: false,
    },
    {
      name: "Prosperity",
      minAmount: "$2,000",
      roi: "24%",
      duration: "12-18 Months",
      features: [
        "24% Annual Returns",
        "Monthly Payouts",
        "Real Estate Unit Allocation",
        "Priority Support",
        "7% Referral Bonus",
      ],
      isPopular: true,
    },
    {
      name: "Legacy",
      minAmount: "$5,000",
      roi: "30%",
      duration: "6-24 Months",
      features: [
        "30% Annual Returns",
        "Monthly/Quarterly Payouts",
        "Guaranteed Property Allocation",
        "Dedicated Account Manager",
        "10% Referral Bonus",
      ],
      isPopular: false,
    },
    {
      name: "Dynasty",
      minAmount: "$20,000+",
      roi: "35%+",
      duration: "Bespoke",
      features: [
        "35%+ Annual Returns",
        "Fully Bespoke Plan",
        "Co-Developer Opportunities",
        "Board-Level Access",
        "Multi-Currency Support",
      ],
      isPopular: false,
    },
  ];

  return (
    <section id="invest" className="py-16 md:py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {!hideHeader && (
          <FadeUp className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <SectionLabel>Investment Plans</SectionLabel>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4">Select Your Plan</h2>
            <p className="text-gray-text text-lg">
              Choose an investment package that aligns with your financial goals. All capital is secured against verified real estate assets.
            </p>
          </FadeUp>
        )}

        <FadeUp stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <FadeUpItem 
              key={index} 
              className={`relative bg-navy-mid border flex flex-col group transition duration-300 hover:-translate-y-2 
                ${plan.isPopular ? 'border-gold shadow-[0_0_30px_rgba(201,168,76,0.15)] mt-0 md:-mt-4 mb-0 md:-mb-4 z-10' : 'border-border-subtle hover:border-gold/50'}`
              }
            >
              {/* Highlight bar on hover */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gold transform origin-left transition-transform duration-300 ${plan.isPopular ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></div>
              
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-navy text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="p-8 border-b border-border-subtle text-center">
                <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
                <div className="text-sm text-gray-text uppercase tracking-wider mb-2">Starts at</div>
                <div className="text-3xl font-bold font-sans text-gold">{plan.minAmount}</div>
              </div>

              <div className="p-8 flex-grow">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-border-subtle">
                  <div>
                    <div className="text-xs text-gray-text uppercase tracking-wider mb-1">Duration</div>
                    <div className="font-semibold">{plan.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-text uppercase tracking-wider mb-1">Est. ROI</div>
                    <div className="font-semibold text-gold">{plan.roi}</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="text-gold mt-1 mr-3 shrink-0" size={16} />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0 mt-auto">
                {plan.name === 'Dynasty' ? (
                  <a 
                    suppressHydrationWarning
                    href="https://t.me/willistonboardofrealtors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded font-semibold transition-colors text-center block bg-navy-light text-white hover:bg-gold hover:text-navy cursor-pointer"
                  >
                    Schedule Consultation
                  </a>
                ) : (
                  <Link 
                    suppressHydrationWarning
                    href={isLoggedIn ? `/deposit?plan=${plan.name.toLowerCase()}` : '/register'}
                    className={`w-full py-3 px-4 rounded font-semibold transition-colors text-center block
                      ${plan.isPopular 
                        ? 'bg-gold text-navy hover:bg-gold-light' 
                        : 'bg-navy-light text-white hover:bg-gold hover:text-navy'}`}
                  >
                    Invest Now
                  </Link>
                )}
              </div>
            </FadeUpItem>
          ))}
        </FadeUp>

        <FadeUp delay={0.4} className="text-center mt-12 text-sm text-gray-text">
          Returns subject to investment terms. Capital secured against real estate assets. T&Cs apply.
        </FadeUp>
      </div>
    </section>
  );
}
