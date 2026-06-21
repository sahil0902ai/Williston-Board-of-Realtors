'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Shield, CheckCircle, Landmark, Star, Play, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <section className="relative min-h-screen flex items-center bg-[#04091A] pt-28 pb-20 overflow-hidden">
      {/* Subtle Gold Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" 
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(201, 168, 76, 0.15) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(201, 168, 76, 0.15) 1px, transparent 1px)
          `, 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* Decorative Gold Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Side: 60% Width */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          {/* Trust Tag Pill */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0A1433] border border-gold/20 rounded-full"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-gold-light uppercase">
              Trusted Investment Platform &middot; Onitsha, Nigeria
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-white leading-[1.08] tracking-tight">
            <span className="block">Build Wealth.</span>
            <span className="block">Secure Your Future.</span>
            <span className="block text-gold italic font-semibold">Invest in Nigeria.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-gray-text text-base md:text-lg max-w-xl font-light leading-relaxed">
            Join thousands of investors growing wealth through real estate, land acquisition, and community investment projects right here in Nigeria. Open to Nigerians at home and in the diaspora.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link 
              suppressHydrationWarning
              href={isLoggedIn ? "/dashboard" : "/register"} 
              className="px-8 py-4 bg-gold text-navy font-bold uppercase text-xs tracking-widest shadow-xl shadow-gold/10 hover:bg-gold-light transition duration-300 text-center rounded-lg"
            >
              Start Investing Today
            </Link>
            <Link 
              suppressHydrationWarning
              href="#how-it-works" 
              className="px-8 py-4 border border-gold/30 hover:border-gold text-gold font-bold uppercase text-xs tracking-widest hover:bg-gold/5 transition duration-300 text-center rounded-lg flex items-center justify-center gap-2"
            >
              Watch How It Works <Play size={12} className="fill-current" />
            </Link>
          </div>

          {/* Trust Strip */}
          <div className="pt-8 border-t border-white/5 max-w-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold tracking-wider text-gray-text uppercase">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-gold shrink-0" />
                <span>CAC Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-gold shrink-0" />
                <span>SEC Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-gold shrink-0" />
                <span>Escrow Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-gold fill-gold shrink-0" />
                <span>Diaspora Friendly</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: 40% Width with Floating Cards */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] lg:min-h-[520px]">
          
          {/* Background Glow Behind Cards */}
          <div className="absolute w-72 h-72 bg-gold/15 rounded-full blur-[70px] pointer-events-none z-0"></div>

          {/* MAIN CARD: Live Portfolio */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[340px] bg-gradient-to-b from-[#0A1628]/95 to-[#050D1C]/95 border border-gold/20 p-6 rounded-2xl shadow-2xl relative z-10 backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Wallet size={16} />
                </div>
                <span className="text-sm font-semibold text-gray-200">Your Portfolio</span>
              </div>
              <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <div className="text-xs text-gray-400">Total Value</div>
              <div className="text-3xl font-serif font-bold text-white tracking-wide">₦12,450,000</div>
              <div className="text-xs font-semibold text-green-400 flex items-center gap-1">
                <TrendingUp size={14} /> +₦2,450,000 (24.5%) &uarr;
              </div>
            </div>

            {/* Mini Bar Chart */}
            <div className="space-y-2 mb-6">
              <div className="text-[10px] text-gray-text uppercase tracking-widest font-semibold">Growth Overview</div>
              <div className="h-24 flex items-end justify-between gap-2.5 pt-2">
                {[40, 55, 48, 70, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-gradient-to-t from-gold-dark via-gold to-gold-light rounded-t"
                      style={{ height: `${h}%` }}
                    ></div>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {['J', 'F', 'M', 'A', 'M', 'J'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[1px] w-full bg-white/5 my-4"></div>

            <div className="flex justify-between text-xs text-gray-text">
              <div>
                <span className="block text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Active Plans</span>
                <span className="font-semibold text-white">2 Plans</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Next Payout</span>
                <span className="font-semibold text-gold">Feb 15 · ₦180,000</span>
              </div>
            </div>
          </motion.div>

          {/* FLOATING CARD 1: Monthly Return */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 -left-6 md:-left-12 bg-[#0A1628]/95 border border-gold/15 p-4 rounded-xl shadow-xl z-20 w-48 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
              <Wallet size={20} />
            </div>
            <div className="overflow-hidden">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Monthly Return</span>
              <span className="text-sm font-bold text-white block">₦180,000 &uarr;</span>
              <span className="text-[9px] text-green-400 block font-medium">Paid on time</span>
            </div>
          </motion.div>

          {/* FLOATING CARD 2: Referrals Earned */}
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-10 -right-6 md:-right-12 bg-[#0A1628]/95 border border-gold/15 p-4 rounded-xl shadow-xl z-20 w-48 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
              <Star size={20} />
            </div>
            <div className="overflow-hidden">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Referrals Earned</span>
              <span className="text-sm font-bold text-white block">₦360,000</span>
              <span className="text-[9px] text-gray-400 block">3 active referrals</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
