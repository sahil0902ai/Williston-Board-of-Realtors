'use client';

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { FadeUp, FadeUpItem } from './FadeUp';

export default function CTA() {
  return (
    <section className="relative py-20 md:py-28 bg-[#C9A84C] text-[#04091A] overflow-hidden">
      {/* Decorative background grid pattern with low opacity */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none z-0"
        style={{ 
          backgroundImage: 'linear-gradient(#04091A 1px, transparent 1px), linear-gradient(90deg, #04091A 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      ></div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center space-y-8">
        
        <FadeUp className="space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold tracking-tight leading-tight">
            Ready to Build Wealth?
          </h2>
          <p className="text-navy/80 font-medium text-lg max-w-xl mx-auto">
            Join 4,800+ investors. Start with just ₦20,000.
          </p>
        </FadeUp>

        {/* CTA Buttons */}
        <FadeUp className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-md">
          <Link 
            suppressHydrationWarning
            href="/register" 
            className="px-8 py-4 bg-[#04091A] text-[#C9A84C] hover:bg-[#0A1433] hover:text-white font-bold uppercase text-xs tracking-widest transition duration-300 rounded-lg shadow-xl shadow-black/10 text-center flex items-center justify-center gap-2"
            style={{
              minHeight: '48px',
              minWidth: '48px',
              padding: '14px 24px',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
              Create Free Account <ArrowRight size={14} className="stroke-[2.5]" />
            </span>
          </Link>
          <a 
            suppressHydrationWarning
            href="https://t.me/willistonboardofrealtors" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-[#04091A] text-[#04091A] hover:bg-[#04091A] hover:text-white font-bold uppercase text-xs tracking-widest transition duration-300 rounded-lg text-center flex items-center justify-center gap-2 cursor-pointer"
            style={{
              minHeight: '48px',
              minWidth: '48px',
              padding: '14px 24px',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
              Talk to an Advisor <MessageCircle size={14} />
            </span>
          </a>
        </FadeUp>

        {/* Trust disclaimer */}
        <FadeUp className="text-[11px] font-bold uppercase tracking-widest text-[#04091A]/60 flex flex-wrap justify-center gap-4 sm:gap-6 pt-4">
          <span>🛡️ Capital Secured</span>
          <span>⚡ 48hr Withdrawals</span>
          <span>💼 SEC Compliant</span>
        </FadeUp>

      </div>
    </section>
  );
}
