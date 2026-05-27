'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const marqueeText = "REAL ESTATE · LAND ACQUISITION · COMMUNITY INVESTMENT · PASSIVE INCOME · WEALTH MANAGEMENT · DIASPORA INVESTMENT · ";
  const marqueeArray = Array(4).fill(marqueeText).join(" ");

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-navy">
      {/* Background glow and pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>

      {/* Decorative Diagonal Lines */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[20%] w-[1px] h-[160%] bg-gradient-to-b from-transparent via-gold/30 to-transparent rotate-[35deg]"></div>
        <div className="absolute top-[-30%] left-[70%] w-[1px] h-[160%] bg-gradient-to-b from-transparent via-gold/10 to-transparent rotate-[35deg]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10 py-16 md:py-0 pb-32">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
          }}
          className="space-y-6 md:space-y-8 mt-12 md:mt-0 relative"
        >
          <motion.div variants={wordVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-navy-light border border-gold/30 rounded-full w-max">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-tighter text-gold-light">Trusted Investment Platform · Houston, Texas</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[1.1] font-light font-serif text-white">
            <span className="inline-flex overflow-hidden pb-1">
              <motion.span variants={wordVariants} className="inline-block mr-3">Build</motion.span>
            </span>
            <span className="inline-flex overflow-hidden pb-1">
              <motion.span variants={wordVariants} className="inline-block">Wealth.</motion.span>
            </span>
            <br />
            <span className="italic text-gold block mt-2">
              <span className="inline-flex overflow-hidden pb-1">
                <motion.span variants={wordVariants} className="inline-block mr-3">Secure</motion.span>
              </span>
              <span className="inline-flex overflow-hidden pb-1">
                <motion.span variants={wordVariants} className="inline-block mr-3">Your</motion.span>
              </span>
              <span className="inline-flex overflow-hidden pb-1">
                <motion.span variants={wordVariants} className="inline-block">Future.</motion.span>
              </span>
            </span>
          </h1>

          <motion.p variants={wordVariants} className="text-gray-text text-lg max-w-md font-light leading-relaxed">
            Premium real estate investment opportunities across the United States. Build generational wealth and secure high-yield returns from anywhere in the world.
          </motion.p>

          <motion.div variants={wordVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="#invest" className="px-8 py-4 bg-gold text-navy font-bold uppercase text-xs tracking-widest shadow-xl shadow-gold/10 hover:bg-gold-light transition-colors text-center">
              Explore Investment Plans
            </Link>
            <Link href="#how-it-works" className="px-8 py-4 border border-gold text-gold font-bold uppercase text-xs tracking-widest hover:bg-gold/5 transition-colors text-center">
              See How It Works
            </Link>
          </motion.div>

          <motion.div variants={wordVariants} className="pt-8 md:pt-12 flex flex-wrap gap-4 md:gap-8 opacity-60 grayscale text-[10px] font-medium text-gray-text uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              SEC Registered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              Bank-Level Security
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              LLC Registered
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Cards (Desktop) */}
        <div className="hidden lg:relative lg:h-[600px] lg:flex items-center justify-center pointer-events-none">
          {/* Abstract Gold Frames */}
          <div className="absolute w-72 h-96 border border-gold/20 rotate-6 translate-x-12 translate-y-6"></div>
          <div className="absolute w-72 h-96 border border-gold/20 -rotate-3"></div>

          <div className="absolute top-1/4 left-10 p-6 bg-navy-mid/80  border border-gold/30 w-48 shadow-2xl z-20  pointer-events-auto">
            <div className="text-3xl font-bold text-gold font-serif">4,800+</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-text mt-1">Active Investors</div>
          </div>

          <div className="absolute bottom-1/4 right-10 p-6 bg-navy-mid/80  border border-gold/30 w-48 shadow-2xl z-20  pointer-events-auto">
            <div className="text-3xl font-bold text-gold font-serif">35%</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-text mt-1">Max Annual ROI</div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-gradient-to-br from-navy-light to-navy border border-gold/50 w-64 shadow-2xl z-30  pointer-events-auto">
            <div className="text-4xl font-bold text-white mb-2 font-serif">$2.4M+</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">Returns Distributed</div>
            <div className="h-[1px] w-full bg-gold/20 my-4"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-text">Security Grade:</span>
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Tier 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-16 lg:bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 mb-2 font-semibold">Discover</span>
        <ChevronDown size={14} className="text-gold" />
      </div>

      {/* Marquee Strip */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-navy-light border-y border-gold/20 py-2.5 z-30 flex items-center shadow-2xl shadow-navy/50">
        <div 
          className="whitespace-nowrap text-[10px] md:text-xs text-gold/80 tracking-[0.25em] font-medium uppercase w-max"
        >
          {marqueeArray}
        </div>
      </div>
    </section>
  );
}

