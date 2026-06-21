'use client';

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { FadeUp } from './FadeUp';
import SectionLabel from './SectionLabel';

const testimonials = [
  {
    name: "Chidinma E.",
    location: "Nurse, London UK",
    initials: "CE",
    investedAmount: "₦300,000",
    text: "I invested ₦300,000 from London and received my returns on time every month. I even got a land allocation in Onitsha. Williston is the real deal.",
    stars: 5
  },
  {
    name: "Emeka M.",
    location: "Engineer, Lagos",
    initials: "EM",
    investedAmount: "₦100,000",
    text: "As a young Nigerian engineer I never thought property investment was for me. Williston's Foundation plan changed that. I have completed 3 investment cycles and the returns are consistent.",
    stars: 5
  },
  {
    name: "Adaeze O.",
    location: "Cooperative Leader, Onitsha",
    initials: "AO",
    investedAmount: "₦5,000,000",
    text: "Our cooperative invested ₦5 million in the Premium plan. We received quarterly returns on time and our group now owns two plots in Awka.",
    stars: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setItemsPerView(window.innerWidth < 1024 ? 1 : 3);
      }, 300);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerView);

  // Group testimonials into slides
  const slides = [];
  for (let i = 0; i < testimonials.length; i += itemsPerView) {
    slides.push(testimonials.slice(i, i + itemsPerView));
  }

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const tick = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      if (elapsed >= 5000) {
        nextSlide();
        startTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, nextSlide, totalSlides]);

  return (
    <section className="py-20 md:py-28 bg-[#060C1C] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="text-center mb-16 flex flex-col items-center">
          <SectionLabel>Client Success</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">Word From Our Investors</h2>
          <p className="text-gray-text text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Join thousands of Nigerians at home and abroad who trust Williston to grow and secure their wealth.
          </p>
        </FadeUp>

        <div 
          className="relative" 
          onMouseEnter={() => setIsPaused(true)} 
          onMouseLeave={() => setIsPaused(false)}
        >
          <FadeUp>
            {/* Desktop Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button 
                  suppressHydrationWarning
                  onClick={prevSlide}
                  className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-navy border border-border-subtle rounded-full items-center justify-center text-gold hover:bg-gold hover:text-navy transition-colors hidden lg:flex shadow-xl focus:outline-none cursor-pointer"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button 
                  suppressHydrationWarning
                  onClick={nextSlide}
                  className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-navy border border-border-subtle rounded-full items-center justify-center text-gold hover:bg-gold hover:text-navy transition-colors hidden lg:flex shadow-xl focus:outline-none cursor-pointer"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Slider Viewport */}
            <div className="overflow-hidden md:px-2 mb-8">
              <div 
                className="flex transition-transform duration-500 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {slides.map((slideGroup, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0 flex flex-col lg:flex-row gap-6 md:gap-8 justify-center">
                    {slideGroup.map((testi, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 min-w-0 bg-[#0A1628]/95 border border-white/5 p-8 md:p-10 rounded-2xl relative group hover:border-gold/30 transition duration-300 flex flex-col shadow-2xl relative"
                      >
                        {/* Subtle Card Grid Background Pattern */}
                        <div 
                          className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-2xl"
                          style={{ 
                            backgroundImage: 'linear-gradient(rgba(201,168,76,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.15) 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                          }}
                        ></div>

                        {/* Top layout */}
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          {/* Star Rating */}
                          <div className="flex gap-1">
                            {Array.from({ length: testi.stars }).map((_, starIdx) => (
                              <Star key={starIdx} size={15} className="text-gold fill-gold" />
                            ))}
                          </div>
                          {/* Verified Badge */}
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold uppercase tracking-wider">
                            <CheckCircle2 size={10} className="stroke-[3]" />
                            <span>Verified Investor</span>
                          </div>
                        </div>

                        {/* Text */}
                        <p className="text-gray-200 font-light leading-relaxed mb-8 relative z-10 flex-grow text-[15px] italic">
                          &quot;{testi.text}&quot;
                        </p>

                        <div className="h-[1px] w-full bg-white/5 my-4 relative z-10"></div>

                        {/* User Details */}
                        <div className="flex items-center justify-between mt-auto relative z-10">
                          <div className="flex items-center gap-3.5 overflow-hidden">
                            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#0A1433] border border-gold/30 flex items-center justify-center text-gold font-serif font-bold group-hover:bg-gold group-hover:text-navy transition-colors duration-300">
                              {testi.initials}
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-semibold text-white truncate text-base">{testi.name}</div>
                              <div className="text-xs text-gray-text truncate font-light mt-0.5">{testi.location}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="block text-[9px] uppercase tracking-wider text-gray-500">Capital placement</span>
                            <span className="text-xs font-bold text-gold font-mono">{testi.investedAmount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Setup Indicators and Mobile arrows */}
            <div className="flex flex-col items-center gap-6">
              {/* Dots */}
              {totalSlides > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      suppressHydrationWarning
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors focus:outline-none cursor-pointer ${
                        currentIndex === idx ? 'bg-gold' : 'bg-white/10 hover:bg-gray-text'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Mobile Arrows (only shown if slider active) */}
              {totalSlides > 1 && (
                <div className="flex justify-center gap-4 lg:hidden">
                  <button 
                    suppressHydrationWarning
                    onClick={prevSlide}
                    className="w-10 h-10 bg-navy border border-border-subtle rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-colors focus:outline-none cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    suppressHydrationWarning
                    onClick={nextSlide}
                    className="w-10 h-10 bg-navy border border-border-subtle rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-colors focus:outline-none cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
