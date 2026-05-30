import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InvestmentPackages from '@/components/InvestmentPackages';
import PropertyPlans from '@/components/PropertyPlans';
import { ShieldCheck, Lock, Landmark } from 'lucide-react';
import { FadeUp } from '@/components/FadeUp';

export const metadata: Metadata = {
  title: 'Investment Plans',
  description: 'Choose from our tailored real estate investment packages designed to grow your capital with security. Discover our Foundation, Prosperity, Legacy, and Dynasty plans.',
};

export default function InvestmentPlans() {
  return (
    <>
      <Header />
      <div className="pt-24 bg-navy">
        
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-text tracking-wider uppercase">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-gold">&gt;</span>
            <span className="text-white">Investment Plans</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="pt-12 pb-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
            <FadeUp>
              <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block animate-fade-in">Investment Packages</span>
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
                Choose Your <span className="italic text-gold">Investment Plan</span>
              </h1>
              <p className="text-gray-text text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                Every plan is asset-backed by verified US real estate. Start from $500 and earn up to 35% annual returns.
              </p>
              
              {/* Trust Badges Inline */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-center text-xs md:text-sm font-semibold uppercase tracking-widest text-gold/90">
                <div className="flex items-center gap-2 px-4 py-2 border border-gold/15 rounded-full bg-navy-mid/40">
                  <ShieldCheck size={14} className="text-gold" />
                  SEC Registered
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-gold/15 rounded-full bg-navy-mid/40">
                  <Lock size={14} className="text-gold" />
                  Capital Secured
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-gold/15 rounded-full bg-navy-mid/40">
                  <Landmark size={14} className="text-gold" />
                  Monthly Payouts
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        <InvestmentPackages hideHeader={true} />
        <PropertyPlans />
      </div>
      <Footer />
    </>
  );
}
