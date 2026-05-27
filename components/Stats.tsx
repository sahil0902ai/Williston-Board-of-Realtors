'use client';

import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { FadeUp } from './FadeUp';

function Counter({ from, to, duration = 2 }: { from: number, to: number, duration?: number }) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  useEffect(() => {
    if (isInView) {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = Math.max(0, now - start);
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        let current = eased * (to - from) + from;
        
        // Handle float vs int
        if (to % 1 !== 0) {
          current = Math.round(current * 10) / 10; // 1 decimal place
        } else {
          current = Math.floor(current);
        }
        
        setCount(current);
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    }
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats() {
  return (
    <FadeUp className="w-full bg-navy-mid border-y border-gold/20 py-8 md:py-12 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 gap-y-12 gap-x-6 md:flex md:justify-between items-center text-[10px] md:text-[11px] font-medium tracking-[0.1em] md:tracking-[0.15em] text-gray-text uppercase text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="font-serif text-3xl md:text-4xl text-white normal-case tracking-normal">
              <Counter from={0} to={4800} />+
            </span>
            <span className="text-gray-text">Active Investors</span>
          </div>
          
          <span className="hidden md:inline text-gold/50 text-xl font-light">|</span>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="font-serif text-3xl md:text-4xl text-white normal-case tracking-normal">
              $<Counter from={0} to={2.4} />M+
            </span>
            <span className="text-gray-text">Returns Distributed</span>
          </div>

          <span className="hidden md:inline text-gold/50 text-xl font-light">|</span>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="font-serif text-3xl md:text-4xl text-white normal-case tracking-normal">
              <Counter from={0} to={120} />+
            </span>
            <span className="text-gray-text">Completed Projects</span>
          </div>

          <span className="hidden md:inline text-gold/50 text-xl font-light">|</span>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="font-serif text-3xl md:text-4xl text-gold normal-case tracking-normal">
              <Counter from={0} to={35} />%
            </span>
            <span className="text-gray-text">Max Annual ROI</span>
          </div>

          <span className="hidden md:inline text-gold/50 text-xl font-light">|</span>

          <div className="hidden lg:flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="font-serif text-3xl md:text-4xl text-white normal-case tracking-normal">
              <Counter from={0} to={8} />
            </span>
            <span className="text-gray-text">Years Experience</span>
          </div>

        </div>
      </div>
    </FadeUp>
  );
}
