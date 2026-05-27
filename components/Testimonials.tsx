'use client';

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeUp } from './FadeUp';
import SectionLabel from './SectionLabel';

const testimonials = [
  {
    name: "Marcus T.",
    role: "Software Engineer, Houston TX",
    initials: "MT",
    text: "I invested $2,000 in the Prosperity Plan and received consistent monthly returns. The process was fully online and the team was incredibly professional. Best investment decision I've made.",
  },
  {
    name: "Jennifer K.",
    role: "Nurse, Atlanta GA",
    initials: "JK",
    text: "As someone new to real estate investing, Williston made it simple. I started with the Foundation Plan and now I'm on my second cycle. Transparent, reliable, and trustworthy.",
  },
  {
    name: "David & Sarah M.",
    role: "Business Owners, Miami FL",
    initials: "DM",
    text: "We invested in the Legacy Plan and purchased a property through Williston. The whole process from investment to title transfer was smooth. We now earn passive rental income monthly.",
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
        setItemsPerView(window.innerWidth < 768 ? 1 : 3);
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
    if (isPaused) return;
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
  }, [isPaused, nextSlide]);

  return (
    <section className="py-16 md:py-24 bg-navy-mid relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="text-center mb-12 md:mb-16 flex flex-col items-center">
          <SectionLabel>Client Success</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4">Word From Our Investors</h2>
          <p className="text-gray-text text-lg max-w-2xl mx-auto">
            Join thousands of Americans home and abroad who trust Williston to grow and secure their wealth.
          </p>
        </FadeUp>

        <div 
          className="relative" 
          onMouseEnter={() => setIsPaused(true)} 
          onMouseLeave={() => setIsPaused(false)}
        >
          <FadeUp>
            {/* Desktop Navigation Arrows */}
            <button 
              suppressHydrationWarning
              onClick={prevSlide}
              className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-navy border border-border-subtle rounded-full items-center justify-center text-gold hover:bg-gold hover:text-navy transition-colors hidden md:flex shadow-xl focus:outline-none"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              suppressHydrationWarning
              onClick={nextSlide}
              className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-navy border border-border-subtle rounded-full items-center justify-center text-gold hover:bg-gold hover:text-navy transition-colors hidden md:flex shadow-xl focus:outline-none"
              aria-label="Next Testimonial"
            >
              <ChevronRight size={24} />
            </button>

            {/* Slider Viewport */}
            <div className="overflow-hidden md:px-4 mb-8">
              <div 
                className="flex transition-transform duration-500 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {slides.map((slideGroup, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0 flex gap-6 md:gap-8 justify-center">
                    {slideGroup.map((testi, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 min-w-0 bg-navy border border-border-subtle p-8 rounded-lg relative group hover:border-gold/30 transition-colors duration-300 flex flex-col"
                      >
                        <div className="absolute top-6 right-6 font-serif text-6xl text-navy-light leading-none rotate-180 group-hover:text-gold/10 transition-colors">
                          &quot;
                        </div>
                        
                        <div className="flex gap-1 mb-6">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={16} className="text-gold fill-gold" />
                          ))}
                        </div>

                        <p className="text-gray-300 italic mb-8 leading-relaxed relative z-10 flex-grow">
                          &quot;{testi.text}&quot;
                        </p>

                        <div className="flex items-center gap-4 mt-auto relative z-10">
                          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-navy-light border border-border-gold flex items-center justify-center text-gold font-serif font-bold group-hover:bg-gold group-hover:text-navy transition-colors">
                            {testi.initials}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-semibold text-white truncate">{testi.name}</div>
                            <div className="text-sm text-gray-text truncate">{testi.role}</div>
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
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    suppressHydrationWarning
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-colors focus:outline-none ${
                      currentIndex === idx ? 'bg-gold' : 'bg-border-subtle hover:bg-gray-text'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Mobile Arrows */}
              <div className="flex justify-center gap-4 md:hidden">
                <button 
                  suppressHydrationWarning
                  onClick={prevSlide}
                  className="w-10 h-10 bg-navy border border-border-subtle rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-colors focus:outline-none"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  suppressHydrationWarning
                  onClick={nextSlide}
                  className="w-10 h-10 bg-navy border border-border-subtle rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-colors focus:outline-none"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
