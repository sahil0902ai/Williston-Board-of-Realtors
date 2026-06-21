'use client';

import { UserPlus, Layers, Wallet, TrendingUp, ChevronDown } from 'lucide-react';
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <UserPlus className="w-6 h-6 text-gold" />,
      title: "Create Account",
      desc: "Sign up securely in minutes and complete your KYC verification to safeguard your portfolio."
    },
    {
      num: "02",
      icon: <Layers className="w-6 h-6 text-gold" />,
      title: "Choose a Plan",
      desc: "Select an institutional-grade investment package matching your yield targets and term goals."
    },
    {
      num: "03",
      icon: <Wallet className="w-6 h-6 text-gold" />,
      title: "Fund Your Wallet",
      desc: "Deposit funds easily via Paystack, Flutterwave, bank transfer, or secure crypto wallets."
    },
    {
      num: "04",
      icon: <TrendingUp className="w-6 h-6 text-gold" />,
      title: "Earn & Grow",
      desc: "Monitor your portfolio in real-time as monthly yield returns tick up and mature automatically."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#04091A] relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative">
        
        <FadeUp className="text-center mb-20 flex flex-col items-center">
          <SectionLabel>The Process</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white">How It Works</h2>
          <p className="text-gray-text text-sm md:text-base max-w-lg mt-3 leading-relaxed font-light">
            Start earning passive real estate yield in four simple, highly secure steps.
          </p>
        </FadeUp>

        {/* Alternating Timeline Section */}
        <div className="relative">
          {/* Vertical Dotted Line (Desktop Center, Mobile Left) */}
          <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 top-10 bottom-10 w-[1px] border-l border-dashed border-gold/30 z-0"></div>

          <div className="space-y-16 lg:space-y-24 relative z-10">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col lg:flex-row items-stretch gap-8 lg:gap-0 ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left Pane: Content (Odd) or Number (Even) */}
                  <div className={`w-full lg:w-1/2 pl-16 lg:pl-0 flex items-center ${
                    isEven ? 'lg:justify-start lg:pl-16' : 'lg:justify-end lg:pr-16 lg:text-right'
                  }`}>
                    {!isEven ? (
                      <FadeUpItem className="space-y-3 max-w-md">
                        <h3 className="font-serif text-2xl text-white">{step.title}</h3>
                        <p className="text-gray-text text-sm md:text-base font-light leading-relaxed">{step.desc}</p>
                      </FadeUpItem>
                    ) : (
                      <div className="hidden lg:block font-serif text-7xl md:text-8xl text-gold/10 font-black select-none tracking-tighter">
                        {step.num}
                      </div>
                    )}
                  </div>

                  {/* Central Node (Desktop Center, Mobile Left aligned with dotted line) */}
                  <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-20">
                    <div className="w-12 h-12 bg-[#0A1433] border-2 border-gold rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.2)] group hover:bg-gold hover:text-navy transition duration-300">
                      {step.icon}
                    </div>
                    {/* Floating Down Arrow (Show between nodes) */}
                    {idx < steps.length - 1 && (
                      <div className="absolute top-16 hidden lg:flex flex-col items-center text-gold/35">
                        <ChevronDown size={14} className="animate-bounce" />
                      </div>
                    )}
                  </div>

                  {/* Right Pane: Number (Odd) or Content (Even) */}
                  <div className={`w-full lg:w-1/2 pl-16 lg:pl-0 flex items-center ${
                    isEven ? 'lg:justify-end lg:pr-16 lg:text-right' : 'lg:justify-start lg:pl-16'
                  }`}>
                    {isEven ? (
                      <FadeUpItem className="space-y-3 max-w-md lg:text-left">
                        <h3 className="font-serif text-2xl text-white">{step.title}</h3>
                        <p className="text-gray-text text-sm md:text-base font-light leading-relaxed">{step.desc}</p>
                      </FadeUpItem>
                    ) : (
                      <div className="hidden lg:block font-serif text-7xl md:text-8xl text-gold/10 font-black select-none tracking-tighter">
                        {step.num}
                      </div>
                    )}
                  </div>

                  {/* Mobile Mobile Number Tag (Only shown on mobile) */}
                  <div className="lg:hidden absolute left-14 top-2 text-2xl font-serif font-black text-gold/25 select-none">
                    {step.num}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
