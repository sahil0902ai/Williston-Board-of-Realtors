'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import SectionLabel from './SectionLabel';

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#060C1C] relative overflow-hidden">
      {/* Noise background */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          
          {/* Left Column: 5/12 Width - Decorative Monogram and Badges */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            
            {/* Outlined Monogram Container */}
            <div className="relative p-10 bg-gradient-to-br from-[#0A1628]/80 to-[#04091A]/80 border border-gold/15 rounded-2xl w-full max-w-[320px] flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm group hover:border-gold/30 transition duration-500">
              
              {/* Gold Monogram W */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-48 h-48 text-gold/35 group-hover:text-gold/60 transition-colors duration-500" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M15 25 L38 80 L50 45 L62 80 L85 25" />
                <path d="M25 25 L43 62 M57 62 L75 25" strokeWidth="0.8" opacity="0.5" />
              </svg>

              <div className="h-[1px] w-3/4 bg-gold/15 my-6"></div>

              <div className="space-y-1 text-center">
                <div className="font-serif text-lg text-gold tracking-[0.2em] font-medium uppercase">Est. 2016</div>
                <div className="text-[10px] tracking-[0.25em] text-gray-text uppercase font-semibold">Onitsha, Nigeria</div>
              </div>
            </div>

            {/* Certification Badges */}
            <div className="w-full max-w-[320px] grid grid-cols-4 gap-2.5">
              {['CAC', 'SEC', 'CBN', 'AML'].map((badge, i) => (
                <div 
                  key={i} 
                  className="border border-gold/15 bg-gold/[0.02] text-gold text-[10px] font-bold py-2 px-1 rounded uppercase tracking-wider text-center select-none shadow-md"
                >
                  {badge}
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: 7/12 Width - Content & Feature Pills */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="space-y-4">
              <SectionLabel>Who We Are</SectionLabel>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight text-white tracking-tight">
                Nigeria's Most Trusted Real Estate Investment Platform
              </h2>
            </div>

            <div className="space-y-6 text-gray-text leading-relaxed text-[15px] md:text-base font-light">
              <p>
                Williston Board of Realtors and Investments is a leading wealth management and real estate investment firm headquartered in Onitsha, Anambra State, Nigeria. We connect investors — both local and in the diaspora — to high-yield, verified real estate and community investment opportunities across Nigeria.
              </p>
              <p>
                Since 2018, we have bridged the gap between institutional-grade real estate assets and everyday investors. Our mission is to democratise wealth creation for every Nigerian, regardless of income level, starting with options from as low as ₦20,000.
              </p>
              <p>
                Whether you are a local resident looking for passive yield or a diaspora investor seeking a secure home for your capital back in Nigeria, our platform guarantees full regulatory compliance, transparent returns, and hassle-free management.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-4 max-w-xl">
              {[
                { icon: "🏛️", text: "CAC Registered" },
                { icon: "🔐", text: "Escrow Protected" },
                { icon: "📊", text: "Monthly Reports" },
                { icon: "🌍", text: "Diaspora Friendly" }
              ].map((pill, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 bg-[#0A1433] border border-white/5 py-3.5 px-5 rounded-xl text-sm font-semibold text-white/90 shadow-lg"
                >
                  <span className="text-lg">{pill.icon}</span>
                  <span>{pill.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Link */}
            <div className="pt-2">
              <Link 
                suppressHydrationWarning
                href="/investment-plans" 
                className="inline-flex border-b border-gold text-gold hover:text-white hover:border-white transition duration-300 pb-1.5 uppercase tracking-widest text-xs font-bold items-center"
                style={{
                  minHeight: '44px',
                  touchAction: 'manipulation',
                  cursor: 'pointer',
                }}
              >
                <span style={{ pointerEvents: 'none' }}>
                  Learn more about us &rarr;
                </span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
