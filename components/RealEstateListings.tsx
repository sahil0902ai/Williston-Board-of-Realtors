import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, Eye } from "lucide-react";
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';

export default function RealEstateListings() {
  const properties = [
    {
      name: "Williston Heights — River Oaks",
      location: "River Oaks District, Houston, TX",
      type: "Residential Duplexes",
      price: "$850,000 / Unit",
      roi: "28%",
      status: "Open",
      imageSeed: "luxury+apartment",
    },
    {
      name: "Williston Sunrise — Sugar Land",
      location: "Sugar Land, Houston, TX",
      type: "Land Plots with C of O",
      price: "$220,000 / Plot",
      roi: "35%",
      status: "Hot Deal",
      imageSeed: "land+estate",
    },
    {
      name: "Williston Commerce Center — Downtown Houston",
      location: "Downtown Houston, TX",
      type: "Mixed-Use Commercial",
      price: "$1.5M / Unit",
      roi: "22%",
      status: "Open",
      imageSeed: "commercial+building",
    },
  ];

  return (
    <section id="properties" className="py-16 md:py-24 bg-navy-mid relative">
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <SectionLabel>Our Portfolio</SectionLabel>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4">Featured Properties</h2>
            <p className="text-gray-text text-lg">
              Asset-backed investments mapped to high-value real estate projects across the United States.
            </p>
          </div>
          <Link href="/properties" suppressHydrationWarning className="border-b border-gold text-gold hover:text-white hover:border-white transition-colors pb-1 uppercase tracking-widest text-sm font-semibold max-w-max">
            View All Properties
          </Link>
        </FadeUp>

        <FadeUp stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop, idx) => (
            <FadeUpItem key={idx} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden group/image bg-gradient-to-br from-navy-mid to-navy flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10 pointer-events-none"></div>

                <Building2 size={72} className="text-white/5 opacity-50 group-hover:scale-110 transition-transform duration-700" strokeWidth={1} />
                <span className="text-gold/50 uppercase tracking-widest text-[10px] font-semibold mt-4 z-10">{prop.type}</span>

                {/* Hover overlay with Quick View */}
                <div className="absolute inset-0 bg-[rgba(4,9,26,0.97)]  opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center border border-gold/30 rounded-t-xl">
                  <button suppressHydrationWarning className="px-6 py-3 bg-gold/10 border border-gold text-gold hover:bg-gold hover:text-navy font-semibold uppercase tracking-wider text-xs rounded transition duration-300 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 shadow-[0_0_20px_rgba(201,168,76,0.15)]">
                    <Eye size={16} /> Quick View
                  </button>
                </div>
                
                <div className="absolute top-4 left-4 z-30 bg-[rgba(4,9,26,0.97)] backdrop-blur border border-white/10 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded text-white flex items-center gap-2 shadow-lg">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${prop.status === 'Hot Deal' ? 'bg-gold text-gold' : 'bg-green-500 text-green-500'}`}></div>
                  {prop.status}
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-30 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                   <div className="flex justify-between text-[9px] uppercase font-bold text-gray-text mb-1.5 tracking-widest">
                    <span>{20 + (idx % 12)} Units Sold</span>
                    <span className="text-gold">48 Total</span>
                  </div>
                  <div className="w-full h-1 bg-navy-light/50 overflow-hidden ">
                    <div className="h-full bg-gold" style={{ width: `${50 + (idx * 15 % 40)}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-navy border border-border-subtle rounded-b-xl p-6 group-hover:border-border-gold transition-colors duration-300 relative z-30">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-2xl group-hover:text-gold transition-colors">{prop.name}</h3>
                    <div className="flex items-center text-sm text-gray-text mt-2">
                      <MapPin size={14} className="mr-1" /> {prop.location}
                    </div>
                  </div>
                </div>

                <div className="my-6 h-px w-full bg-border-subtle"></div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-text uppercase tracking-widest mb-1">Buy Price</div>
                    <div className="font-semibold text-lg">{prop.price}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-text uppercase tracking-widest mb-1">Expected ROI</div>
                    <div className="font-semibold text-gold text-lg">{prop.roi}</div>
                  </div>
                </div>
              </div>
            </FadeUpItem>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
