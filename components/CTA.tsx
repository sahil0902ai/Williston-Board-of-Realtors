import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';

export default function CTA() {
  return (
    <section className="relative py-24 md:py-32 bg-navy overflow-hidden">
      {/* Background styling for depth */}
      <div className="absolute inset-0 mix-blend-overlay opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://picsum.photos/seed/luxury/1920/1080?grayscale&opacity=5')" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-gold/5 rounded-[100%] blur-[120px] pointer-events-none"></div>

      <FadeUp stagger className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
        <FadeUpItem>
          <SectionLabel>Take Action</SectionLabel>
        </FadeUpItem>
        <FadeUpItem>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 leading-tight">
            Ready to Build <br />
            <span className="italic text-gold">Generational Wealth?</span>
          </h2>
        </FadeUpItem>
        
        <FadeUpItem>
          <div className="bg-navy-mid border border-border-gold p-2 md:p-3 rounded-xl inline-flex flex-col md:flex-row w-full max-w-xl mx-auto mb-2 shadow-[0_0_30px_rgba(201,168,76,0.1)] focus-within:shadow-[0_0_40px_rgba(201,168,76,0.2)] transition-shadow">
            <input suppressHydrationWarning
              type="email" 
              placeholder="Enter your email address" 
              className="bg-transparent border-none outline-none text-white px-6 py-4 flex-grow tracking-wide"
            />
            <button suppressHydrationWarning className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2 md:mt-0 whitespace-nowrap">
              Get Started Free <ArrowRight size={18} />
            </button>
          </div>
          <p className="text-center text-xs mt-2 mb-10 text-gray-400">
            Prefer to message us directly? 
            <br className="md:hidden" />
            <a href="mailto:willistonboardofrealtors@gmail.com" className="text-gold hover:underline">📧 willistonboardofrealtors@gmail.com</a> | <a href="https://t.me/willistonboardofrealtors" target="_blank" rel="noopener" className="text-[#0088cc] hover:underline">✈️ @willistonboardofrealtors</a>
          </p>
        </FadeUpItem>

        <FadeUpItem className="flex flex-col gap-6 mb-12 w-full items-center">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#invest" className="border border-border-gold hover:border-gold hover:bg-gold/5 px-8 py-3 rounded text-sm font-semibold tracking-wider uppercase transition-colors text-center">
              View Investment Plans
            </Link>
            <button suppressHydrationWarning className="border border-border-gold hover:border-gold hover:bg-gold/5 px-8 py-3 rounded text-sm font-semibold tracking-wider uppercase transition-colors">
              Speak to an Advisor
            </button>
          </div>
          <p className="text-gray-text text-sm">
            Or reach us on Telegram: <a href="https://t.me/willistonboardofrealtors" target="_blank" rel="noopener" className="text-gold hover:underline">@willistonboardofrealtors</a>
          </p>
        </FadeUpItem>

        <FadeUpItem className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs font-semibold uppercase tracking-widest text-gray-text">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> No Hidden Fees</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Cancel Anytime</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Capital Secured</span>
        </FadeUpItem>
      </FadeUp>
    </section>
  );
}
