'use client';

import Link from 'next/link';
import { Shield, FileText, ArrowRight, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';

export default function TrustSection() {
  const metrics = [
    { value: "₦2.4B+", label: "Returns Paid Out" },
    { value: "0", label: "Defaults in 8 Years" },
    { value: "4.9/5", label: "Investor Rating" },
    { value: "48hr", label: "Avg. Withdrawal Time" }
  ];

  const docs = [
    { title: "View our CAC registration", href: "/terms#sec-registration", desc: "Verify our active incorporation status under the Corporate Affairs Commission (CAC) of Nigeria." },
    { title: "Download investor agreement sample", href: "/terms#investor-agreement", desc: "Review our asset-backed contract template before investing." },
    { title: "Read our risk disclosure", href: "/risk", desc: "Understand the structural risks and mitigation models of properties." },
    { title: "View our legal pages", href: "/terms", desc: "Comprehensive documentation covering privacy, AML, and operations." }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#04091A] relative border-t border-white/5 overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <FadeUp className="mb-16">
          <SectionLabel>Institutional Trust</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
            Why Investors Trust Williston
          </h2>
          <p className="text-gray-text text-sm md:text-base max-w-xl mt-3 font-light leading-relaxed">
            We operate with bank-level accountability, verified assets, and complete transparency at every layer of the investment cycle.
          </p>
        </FadeUp>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Large Metrics (2x2 Grid - 5/12 width) */}
          <FadeUp stagger className="lg:col-span-5 grid grid-cols-2 gap-6 md:gap-8">
            {metrics.map((metric, idx) => (
              <FadeUpItem 
                key={idx} 
                className="bg-[#0A1628]/80 border border-white/5 p-6 rounded-2xl flex flex-col justify-between min-h-[140px] shadow-xl hover:border-gold/20 transition duration-300"
              >
                <span className="font-serif text-4xl md:text-5xl font-bold text-gold tracking-tight">
                  {metric.value}
                </span>
                <span className="text-xs font-semibold tracking-wider text-gray-text uppercase mt-4">
                  {metric.label}
                </span>
              </FadeUpItem>
            ))}
          </FadeUp>

          {/* Right Column: Legal Document Links (7/12 width) */}
          <FadeUp stagger className="lg:col-span-7 space-y-4">
            {docs.map((doc, idx) => (
              <FadeUpItem key={idx}>
                <Link 
                  suppressHydrationWarning
                  href={doc.href}
                  className="group flex items-center justify-between p-5 md:p-6 bg-[#0A1628]/40 hover:bg-[#0A1628]/80 border border-white/5 hover:border-gold/30 rounded-2xl transition duration-300 shadow-lg text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold mt-0.5 shrink-0 group-hover:bg-gold group-hover:text-navy transition duration-300">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base group-hover:text-gold transition duration-300 flex items-center gap-1.5">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-gray-text mt-1 font-light leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow Indicator */}
                  <div className="text-gray-text group-hover:text-gold transform group-hover:translate-x-1 transition duration-300 pl-4 shrink-0">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </FadeUpItem>
            ))}
          </FadeUp>

        </div>

      </div>
    </section>
  );
}
