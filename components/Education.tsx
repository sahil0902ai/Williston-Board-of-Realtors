import { PlayCircle, Clock, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';

export default function Education() {
  return (
    <section id="learn" className="py-16 md:py-24 bg-navy-mid relative">
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="mb-12 md:mb-16">
          <SectionLabel>Knowledge Base</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4">Financial Education</h2>
          <p className="text-gray-text text-lg max-w-2xl">
            We believe an educated investor is a successful investor. Access our free resources to master wealth building in the United States.
          </p>
        </FadeUp>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Course Highlight */}
          <FadeUp delay={0.1} className="lg:col-span-7 bg-navy border border-border-subtle rounded-xl overflow-hidden group">
            <div className="relative aspect-[16/9] w-full">
              <Image 
                src="https://picsum.photos/seed/seminar/1000/600"
                alt="Real Estate Masterclass"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-navy/50 mix-blend-multiply"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold/90 text-navy flex items-center justify-center pl-1 group-hover:scale-110 group-hover:bg-gold transition cursor-pointer">
                  <PlayCircle size={32} />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-navy px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold rounded border border-border-gold">
                Free Masterclass
              </div>
            </div>
            
            <div className="p-8">
              <h3 className="font-serif text-3xl mb-3 group-hover:text-gold transition-colors">Real Estate Investment Fundamentals for Americans</h3>
              <p className="text-gray-text mb-6">A comprehensive guide to understanding property markets, ROI calculations, and risk mitigation in the American real estate sector.</p>
              
              <div className="flex gap-6 text-sm font-medium text-gray-300">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-gold" />
                  6 Modules
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gold" />
                  4 Hours
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Articles Sidebar */}
          <FadeUp delay={0.3} stagger className="lg:col-span-5 flex flex-col gap-8">
            
             <FadeUpItem>
              <Link href="/articles/real-estate-yields-returns-decoded" className="flex gap-6 bg-navy border border-border-subtle rounded-xl p-6 group hover:border-border-gold transition-colors h-full">
                <div className="flex-grow flex flex-col justify-center">
                  <div className="text-xs font-bold text-gold uppercase tracking-widest mb-3">Guide</div>
                  <h4 className="font-serif text-xl mb-3 group-hover:text-white text-gray-100 leading-snug">How to Start Investing in Real Estate with Just $500</h4>
                  <div className="flex gap-4 text-xs text-gray-text font-medium mt-auto pt-4">
                    <span>5 Min Read</span>
                    <span>·</span>
                    <span>March 2026</span>
                  </div>
                </div>
              </Link>
            </FadeUpItem>

            <FadeUpItem>
              <Link href="/articles/diaspora-real-estate-investment-guide" className="flex gap-6 bg-navy border border-border-subtle rounded-xl p-6 group hover:border-border-gold transition-colors h-full">
                <div className="flex-grow flex flex-col justify-center">
                  <div className="text-xs font-bold text-gold uppercase tracking-widest mb-3">Diaspora Focus</div>
                  <h4 className="font-serif text-xl mb-3 group-hover:text-white text-gray-100 leading-snug">Diaspora Investment: Sending Money Home Smartly Without Tears</h4>
                  <div className="flex gap-4 text-xs text-gray-text font-medium mt-auto pt-4">
                    <span>8 Min Read</span>
                    <span>·</span>
                    <span>February 2026</span>
                  </div>
                </div>
              </Link>
            </FadeUpItem>

          </FadeUp>
        </div>
      </div>
    </section>
  );
}
