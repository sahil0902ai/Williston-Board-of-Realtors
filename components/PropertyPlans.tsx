'use client';
import { Check, X } from 'lucide-react';
import { FadeUp, FadeUpItem } from '@/components/FadeUp';

export default function PropertyPlans() {
  
  return (
    <section className="py-24 bg-navy relative border-y border-border-subtle" id="property-plans">
      {/* Background layer */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="text-center mb-16">
          <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">Property Investment Plans</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Invest in Real Estate. <span className="italic text-gold">Own a Piece of the Future.</span>
          </h2>
          <p className="text-gray-text max-w-2xl mx-auto text-lg mb-8">
            Choose a property tier that matches your investment budget. All properties are asset-backed, legally titled, and managed by Williston.
          </p>
        </FadeUp>

        <FadeUp stagger className="grid lg:grid-cols-3 gap-8 mb-24">
          
          {/* Plan 1 Commercial */}
          <FadeUpItem className="bg-navy-mid border border-border-subtle rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-gold/30 transition-colors">
            <div className="mb-6">
              <span className="bg-navy border border-border-subtle text-gray-text text-[10px] uppercase tracking-widest px-3 py-1.5 rounded font-bold">Commercial Investment</span>
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">Commercial House</h3>
            <p className="text-gray-text text-sm mb-6 min-h-[80px]">
              High-yield commercial real estate investments in prime business districts across Onitsha. Ideal for investors seeking strong rental and capital appreciation returns.
            </p>
            
            <div className="mb-8 p-4 bg-navy border border-border-subtle rounded-xl text-center">
              <div className="text-sm text-gray-text uppercase tracking-widest mb-1 font-semibold">Price Range</div>
              <div className="text-2xl font-serif text-gold">₦20,000,000 — ₦50,000,000</div>
              <div className="text-xs text-gray-500 mt-2 font-mono">22–28% per annum ROI</div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {[
                'Prime commercial location',
                'Pre-leased to anchor tenants',
                '5-year minimum lease agreements secured',
                'Monthly rental income to investor',
                'Full warranty deed and title transferred',
                'Professional property management included',
                'Capital appreciation 15–20% yearly',
                'Legal documentation & deed of assignment',
                'Exit strategy: resale or continued leasing',
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-text">
                  <Check size={18} className="text-gold shrink-0" /> {feature}
                </li>
              ))}
            </ul>

            <button suppressHydrationWarning className="w-full py-4 rounded-xl border border-border-subtle bg-navy text-white font-bold hover:border-gold hover:text-gold transition-colors mt-auto">
              Invest in Commercial Property
            </button>
          </FadeUpItem>

          {/* Plan 2 Standard */}
          <FadeUpItem className="bg-navy-mid border border-gold rounded-2xl p-8 flex flex-col relative overflow-hidden transform lg:-translate-y-4 shadow-[0_0_40px_rgba(201,168,76,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="mb-6">
              <span className="bg-gold text-navy text-[10px] uppercase tracking-widest px-3 py-1.5 rounded font-bold">Most Popular · Residential</span>
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">Standard House</h3>
            <p className="text-gray-text text-sm mb-6 min-h-[80px]">
              Comfortable residential properties in fast-growing residential estates across Anambra State. Perfect for families and rental income investors.
            </p>
            
            <div className="mb-8 p-4 bg-navy border border-gold/30 rounded-xl text-center">
              <div className="text-sm text-gray-text uppercase tracking-widest mb-1 font-semibold">Price Range</div>
              <div className="text-3xl font-serif text-white">₦35,000,000 — ₦80,000,000</div>
              <div className="text-xs text-gold mt-2 font-mono font-medium">18–24% per annum ROI</div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {[
                '3-4 bedroom detached/semi-detached house',
                'Gated estate with 24/7 security',
                'Full title deed documentation included',
                'Ready to move-in or rent out immediately',
                'Rental management service available',
                '12-month defect liability warranty',
                'All government approvals included',
                'Proximity to schools, hospitals, markets',
                'Flexible payment: outright or installment plan',
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-text text-white/90">
                  <Check size={18} className="text-gold shrink-0" /> {feature}
                </li>
              ))}
            </ul>

            <button suppressHydrationWarning className="w-full py-4 rounded-xl bg-gold text-navy font-bold hover:bg-white transition-colors mt-auto">
              Invest in Standard House
            </button>
          </FadeUpItem>

          {/* Plan 3 Luxury */}
          <FadeUpItem className="bg-[#020510] border border-[#1a2235] rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-gold/30 transition-colors">
            <div className="mb-6">
              <span className="bg-[#1a2235] text-gray-400 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded font-bold border border-gray-800">Premium · Exclusive</span>
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">Luxury House</h3>
            <p className="text-gray-500 text-sm mb-6 min-h-[80px]">
              Ultra-premium luxury residential properties for the discerning investor. Bespoke finishes, smart home features, and exclusive locations in Onitsha GRA, Lekki, and Asokoro.
            </p>
            
            <div className="mb-8 p-4 bg-navy-mid border border-[#1a2235] rounded-xl text-center">
              <div className="text-sm text-gray-500 uppercase tracking-widest mb-1 font-semibold">Price Range</div>
              <div className="text-2xl font-serif text-white">₦150,000,000 — ₦1,000,000,000</div>
              <div className="text-xs text-gold mt-2 font-mono">30–40% per annum ROI</div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {[
                '4–6 bedroom luxury duplex or mansion',
                'Smart home automation system',
                'Private swimming pool & landscaped gardens',
                '3-car garage, CCTV, biometric entry',
                'Dedicated facility management team',
                'Exclusive gated community',
                'Backup power: solar + generator',
                'Interior design & furnishing package available',
                'Priority exit: Williston guaranteed buyback option',
                'Dedicated relationship manager assigned',
                'Eligible for co-developer profit sharing',
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-500">
                  <Check size={18} className="text-gold shrink-0" /> {feature}
                </li>
              ))}
            </ul>

            <button suppressHydrationWarning className="w-full py-4 rounded-xl border border-[#1a2235] bg-transparent text-white font-bold hover:border-gold hover:text-gold transition-colors mt-auto">
              Schedule Private Consultation
            </button>
          </FadeUpItem>

        </FadeUp>

        <FadeUp>
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="py-4 px-6 bg-navy-mid border-b border-border-subtle text-xs uppercase tracking-widest text-gray-text font-semibold rounded-tl-xl w-1/4">Feature</th>
                  <th className="py-4 px-6 bg-navy-mid border-b border-border-subtle text-xs uppercase tracking-widest text-white font-semibold flex-1">Commercial</th>
                  <th className="py-4 px-6 bg-navy-mid border-b border-border-subtle text-xs uppercase tracking-widest text-gold font-semibold flex-1 relative">
                    <div className="absolute inset-0 bg-gold/5 pointer-events-none rounded-t"></div>
                    Standard
                  </th>
                  <th className="py-4 px-6 bg-[#020510] border-b border-gray-800 text-xs uppercase tracking-widest text-gray-300 font-semibold flex-1 rounded-tr-xl">Luxury</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-border-subtle">
                  <td className="py-4 px-6 text-gray-text font-medium">Min Investment</td>
                  <td className="py-4 px-6 text-white">₦20,000,000</td>
                  <td className="py-4 px-6 text-white bg-gold/5">₦35,000,000</td>
                  <td className="py-4 px-6 text-gray-300 bg-[#020510]">₦150,000,000</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-4 px-6 text-gray-text font-medium">Property Type</td>
                  <td className="py-4 px-6 text-gray-400">Commercial</td>
                  <td className="py-4 px-6 text-gray-400 bg-gold/5">Residential</td>
                  <td className="py-4 px-6 text-gray-500 bg-[#020510]">Luxury Residential</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-4 px-6 text-gray-text font-medium">Annual ROI</td>
                  <td className="py-4 px-6 text-gold">22–28%</td>
                  <td className="py-4 px-6 text-gold bg-gold/5 font-medium">18–24%</td>
                  <td className="py-4 px-6 text-gold bg-[#020510]">30–40%</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-4 px-6 text-gray-text font-medium">Title Included</td>
                  <td className="py-4 px-6 text-white"><Check size={20} className="text-green-500" /></td>
                  <td className="py-4 px-6 text-white bg-gold/5"><Check size={20} className="text-green-500" /></td>
                  <td className="py-4 px-6 text-white bg-[#020510]"><Check size={20} className="text-green-500" /></td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-4 px-6 text-gray-text font-medium">Payment Plan</td>
                  <td className="py-4 px-6 text-white"><Check size={20} className="text-green-500" /></td>
                  <td className="py-4 px-6 text-white bg-gold/5"><Check size={20} className="text-green-500" /></td>
                  <td className="py-4 px-6 text-white bg-[#020510]"><Check size={20} className="text-green-500" /></td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-4 px-6 text-gray-text font-medium">Rental Management</td>
                  <td className="py-4 px-6 text-white"><Check size={20} className="text-green-500" /></td>
                  <td className="py-4 px-6 text-white bg-gold/5"><Check size={20} className="text-green-500" /></td>
                  <td className="py-4 px-6 text-white bg-[#020510]"><Check size={20} className="text-green-500" /></td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-4 px-6 text-gray-text font-medium">Dedicated Manager</td>
                  <td className="py-4 px-6 text-white"><X size={20} className="text-red-500/50" /></td>
                  <td className="py-4 px-6 text-white bg-gold/5"><X size={20} className="text-red-500/50" /></td>
                  <td className="py-4 px-6 text-white bg-[#020510]"><Check size={20} className="text-green-500" /></td>
                </tr>
                <tr className="">
                  <td className="py-4 px-6 text-gray-text font-medium rounded-bl-xl">Buyback Guarantee</td>
                  <td className="py-4 px-6 text-white"><X size={20} className="text-red-500/50" /></td>
                  <td className="py-4 px-6 text-white bg-gold/5 rounded-b"><X size={20} className="text-red-500/50" /></td>
                  <td className="py-4 px-6 text-white bg-[#020510] rounded-br-xl"><Check size={20} className="text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
