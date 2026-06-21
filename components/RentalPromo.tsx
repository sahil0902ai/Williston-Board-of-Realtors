import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowRight } from 'lucide-react';
import { FadeUp } from '@/components/FadeUp';

export default function RentalPromo({ isRentPage = false }: { isRentPage?: boolean }) {
  return (
    <section className="py-24 bg-[#020510] relative border-b border-border-subtle">
      <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://picsum.photos/seed/interior1/1920/1080?grayscale')" }}></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="bg-navy border border-border-gold rounded-3xl p-8 md:p-16 overflow-hidden relative shadow-[0_0_50px_rgba(201,168,76,0.05)]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest mb-6">
                <Home size={14} /> New Service
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                Premium Furnished <span className="italic text-gold">Apartments</span>
              </h2>
              <p className="text-gray-text text-lg mb-8 leading-relaxed max-w-lg">
                Visiting Onitsha? We now offer luxury short-stay and long-term serviced apartments. Enjoy 24/7 power, full security, and premium comfort without the hassle of setting up a new home.
              </p>
              
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span> Daily, Weekly, Monthly & Yearly rates
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span> 2 & 3 Bedroom fully furnished options
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span> All utilities included (Solar + Generator Backup + Fast WiFi)
                </li>
              </ul>

              {isRentPage ? (
                <a href="#apartments" className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-8 py-4 rounded-xl hover:bg-white transition-colors">
                  View Available Apartments <ArrowRight size={20} />
                </a>
              ) : (
                <Link href="/rent" className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-8 py-4 rounded-xl hover:bg-white transition-colors">
                  View Available Apartments <ArrowRight size={20} />
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-border-subtle relative translate-y-8">
                  <Image src="https://picsum.photos/seed/rent1/400/500" alt="Apartment living room" fill className="object-cover" lr-id="rental-img-1" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                </div>
                <div className="p-4 bg-navy-mid border border-border-subtle rounded-2xl">
                  <div className="text-center">
                    <div className="text-xl font-serif text-white mb-1">2 Bed</div>
                    <div className="text-xs text-gray-text">From ₦50,000/night</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-navy-mid border border-border-subtle rounded-2xl">
                  <div className="text-center">
                    <div className="text-xl font-serif text-white mb-1">3 Bed</div>
                    <div className="text-xs text-gray-text">From ₦80,000/night</div>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-border-subtle relative -translate-y-8">
                  <Image src="https://picsum.photos/seed/rent2/400/500" alt="Apartment bedroom" fill className="object-cover" lr-id="rental-img-2" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
