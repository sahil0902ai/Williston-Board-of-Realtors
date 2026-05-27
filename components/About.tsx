import { Building2, ShieldCheck, PieChart, Globe } from 'lucide-react';
import Image from 'next/image';
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-navy-mid relative">
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          <FadeUp delay={0.1} stagger>
            <FadeUpItem>
              <SectionLabel>About Us</SectionLabel>
            </FadeUpItem>
            
            <FadeUpItem>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight mb-6">
                the United States&apos;s Premier <br /> Wealth Investment Platform
              </h2>
            </FadeUpItem>
            
            <FadeUpItem>
              <p className="text-gray-text leading-relaxed text-lg mb-4">
                Williston Board of Realtors and Investments is a fully registered and SEC-compliant real estate investment company headquartered in Houston, Texas. 
              </p>
            </FadeUpItem>
            <FadeUpItem>
              <p className="text-gray-text leading-relaxed text-lg mb-8">
                We provide access to secure, high-yield real estate investments for Americans globally, bridging the gap between local opportunities and diaspora capital. Our mission is to build lasting generational wealth.
              </p>
            </FadeUpItem>

            <FadeUpItem className="grid sm:grid-cols-2 gap-6 pt-6">
              <div className="flex gap-4">
                <div className="text-gold shrink-0">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Legally Registered</h4>
                  <p className="text-sm text-gray-text">Fully CAC and SEC compliant operations.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-gold shrink-0">
                  <Building2 size={28} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Escrow Protected</h4>
                  <p className="text-sm text-gray-text">Capital secured against physical assets.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-gold shrink-0">
                  <PieChart size={28} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Transparent Reports</h4>
                  <p className="text-sm text-gray-text">Real-time tracking of investments.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-gold shrink-0">
                  <Globe size={28} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Diaspora Friendly</h4>
                  <p className="text-sm text-gray-text">Multi-currency support for expats.</p>
                </div>
              </div>
            </FadeUpItem>
          </FadeUp>

          <FadeUp delay={0.3} className="relative">
            <div className="aspect-[4/5] relative rounded-lg overflow-hidden border border-border-subtle group">
              <Image 
                src="https://picsum.photos/seed/realestate/800/1000" 
                alt="Luxury Real Estate" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[rgba(4,9,26,0.97)] mix-blend-multiply duration-500 group-hover:opacity-50"></div>
              
              <div className="absolute inset-0 border-[16px] border-navy/20"></div>
              
              <div className="absolute bottom-8 left-8 right-8 bg-[rgba(4,9,26,0.97)]  border border-border-gold p-6 text-center">
                <div className="font-serif text-2xl text-gold mb-1">Est. 2016</div>
                <div className="tracking-widest uppercase text-xs text-white">in Houston, Texas</div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-gold text-navy p-6 rounded-lg shadow-xl hidden md:block">
              <div className="font-serif text-4xl font-bold mb-1">4.8k+</div>
              <div className="text-sm font-semibold uppercase tracking-wider">Happy Investors</div>
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  );
}
