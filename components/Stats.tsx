'use client';

import { useEffect, useRef } from 'react';

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const counters = document.querySelectorAll('[data-count]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.count || '0');
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const isDecimal = target % 1 !== 0;
          const start = performance.now();
          const duration = 2000;
          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
      counters.forEach(el => observer.observe(el));

      return () => {
        counters.forEach(el => observer.unobserve(el));
      };
    }
  }, []);

  const statItems = [
    { count: "2.4", prefix: "₦", suffix: "B+", label: "Returns Paid" },
    { count: "4800", prefix: "", suffix: "+", label: "Investors" },
    { count: "120", prefix: "", suffix: "+", label: "Projects" },
    { count: "35", prefix: "", suffix: "%", label: "Max ROI" },
    { count: "8", prefix: "", suffix: " Years", label: "Experience" }
  ];

  return (
    <div className="w-full bg-[#060C1C] border-y border-[rgba(201,168,76,0.15)] py-10 z-20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12" ref={containerRef}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-4">
          {statItems.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left relative">
              {/* Stat Card */}
              <div className="flex flex-col items-center">
                <span 
                  className="font-serif text-[42px] leading-tight text-gold font-semibold tracking-tight"
                  data-count={item.count}
                  data-prefix={item.prefix}
                  data-suffix={item.suffix}
                >
                  {item.prefix}0{item.suffix}
                </span>
                <span className="text-[10px] tracking-[0.2em] text-gray-text uppercase font-semibold mt-1">
                  {item.label}
                </span>
              </div>

              {/* Vertical Gold Divider (Only on Desktop, between stats) */}
              {idx < statItems.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-[rgba(201,168,76,0.15)]"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
