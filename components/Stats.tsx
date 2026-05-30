'use client';

import { useEffect, useRef } from 'react';
import { FadeUp } from './FadeUp';

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function animateCounter(el: HTMLElement, target: number, prefix: string, suffix: string) {
      const start = performance.now();
      const duration = 1800;
      requestAnimationFrame(function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        let current: string | number;
        if (target % 1 !== 0) {
          current = (eased * target).toFixed(1);
        } else {
          current = Math.floor(eased * target);
        }
        
        el.textContent = (prefix || '') + Number(current).toLocaleString('en-US') + (suffix || '');
        if (progress < 1) requestAnimationFrame(tick);
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          
          animateCounter(el, target, prefix, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.stat-counter');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <FadeUp className="w-full bg-navy-mid border-y border-gold/20 py-8 md:py-12 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12" ref={containerRef}>
        <div className="grid grid-cols-2 gap-y-12 gap-x-6 md:flex md:justify-between items-center text-[10px] md:text-[11px] font-medium tracking-[0.1em] md:tracking-[0.15em] text-gray-text uppercase text-center md:text-left">
          
          {/* Active Investors */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span 
              className="stat-counter font-serif text-3xl md:text-4xl text-white normal-case tracking-normal"
              data-target="4800"
              data-suffix="+"
            >
              0+
            </span>
            <span className="text-gray-text">Active Investors</span>
          </div>
          
          <span className="hidden md:inline text-gold/50 text-xl font-light">|</span>

          {/* Returns Distributed */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span 
              className="stat-counter font-serif text-3xl md:text-4xl text-white normal-case tracking-normal"
              data-target="2.4"
              data-prefix="$"
              data-suffix="M+"
            >
              $0M+
            </span>
            <span className="text-gray-text">Returns Distributed</span>
          </div>

          <span className="hidden md:inline text-gold/50 text-xl font-light">|</span>

          {/* Completed Projects */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span 
              className="stat-counter font-serif text-3xl md:text-4xl text-white normal-case tracking-normal"
              data-target="120"
              data-suffix="+"
            >
              0+
            </span>
            <span className="text-gray-text">Completed Projects</span>
          </div>

          <span className="hidden md:inline text-gold/50 text-xl font-light">|</span>

          {/* Max Annual ROI */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span 
              className="stat-counter font-serif text-3xl md:text-4xl text-gold normal-case tracking-normal"
              data-target="35"
              data-suffix="%"
            >
              0%
            </span>
            <span className="text-gray-text">Max Annual ROI</span>
          </div>

          <span className="hidden md:inline text-gold/50 text-xl font-light">|</span>

          {/* Years Experience */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span 
              className="stat-counter font-serif text-3xl md:text-4xl text-white normal-case tracking-normal"
              data-target="8"
            >
              0
            </span>
            <span className="text-gray-text">Years Experience</span>
          </div>

        </div>
      </div>
    </FadeUp>
  );
}
