'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Building2, Eye, Search } from 'lucide-react';
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';

interface RealEstateListingsProps {
  isPropertiesPage?: boolean;
}

const allProperties = [
  {
    name: "Williston Heights — River Oaks",
    location: "River Oaks District, Houston, TX",
    type: "Residential",
    typeDisplay: "Residential Duplexes",
    price: "$850,000 / Unit",
    roi: "28%",
    status: "Open",
    imageSeed: "luxury+apartment",
  },
  {
    name: "Williston Sunrise — Sugar Land",
    location: "Sugar Land, Houston, TX",
    type: "Land",
    typeDisplay: "Land Plots with C of O",
    price: "$220,000 / Plot",
    roi: "35%",
    status: "Hot Deal",
    imageSeed: "land+estate",
  },
  {
    name: "Williston Commerce Center — Downtown Houston",
    location: "Downtown Houston, TX",
    type: "Commercial",
    typeDisplay: "Mixed-Use Commercial",
    price: "$1.5M / Unit",
    roi: "22%",
    status: "Open",
    imageSeed: "commercial+building",
  },
  {
    name: "Williston Plaza — Miami",
    location: "Miami, FL",
    type: "Commercial",
    typeDisplay: "Commercial Plaza",
    price: "$2.1M / Unit",
    roi: "26%",
    status: "Open",
    imageSeed: "shopping+mall",
  },
  {
    name: "Williston Gardens — Atlanta",
    location: "Atlanta, GA",
    type: "Residential",
    typeDisplay: "Residential Gardens",
    price: "$420,000 / Unit",
    roi: "22%",
    status: "Hot Deal",
    imageSeed: "garden+apartment",
  },
  {
    name: "Williston Business Park — Dallas",
    location: "Dallas, TX",
    type: "Commercial",
    typeDisplay: "Business Park",
    price: "$850,000 / Unit",
    roi: "24%",
    status: "Open",
    imageSeed: "office+park",
  },
  {
    name: "Williston Villas — Charlotte",
    location: "Charlotte, NC",
    type: "Residential",
    typeDisplay: "Residential Villas",
    price: "$380,000 / Unit",
    roi: "20%",
    status: "Open",
    imageSeed: "suburban+villa",
  },
  {
    name: "Williston Residences — Phoenix",
    location: "Phoenix, AZ",
    type: "Residential",
    typeDisplay: "Residential Residences",
    price: "$310,000 / Unit",
    roi: "19%",
    status: "Coming Soon",
    imageSeed: "modern+residence",
  },
  {
    name: "Williston Square — Las Vegas",
    location: "Las Vegas, NV",
    type: "Commercial",
    typeDisplay: "Commercial Square",
    price: "$1.2M / Unit",
    roi: "28%",
    status: "Hot Deal",
    imageSeed: "city+square",
  }
];

export default function RealEstateListings({ isPropertiesPage = false }: RealEstateListingsProps) {
  // Search & Filter State
  const [locationInput, setLocationInput] = useState('');
  const [typeInput, setTypeInput] = useState('All');
  
  const [locationSearch, setLocationSearch] = useState('');
  const [dropdownType, setDropdownType] = useState('All');
  const [selectedPill, setSelectedPill] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocationSearch(locationInput);
    setDropdownType(typeInput);
  };

  const handlePillClick = (pill: string) => {
    setSelectedPill(pill);
  };

  // Filter properties
  const propertiesToFilter = isPropertiesPage ? allProperties : allProperties.slice(0, 3);

  const filteredProperties = propertiesToFilter.filter((prop) => {
    // 1. Search text (location/name)
    const matchesLocation = locationSearch === '' || 
      prop.location.toLowerCase().includes(locationSearch.toLowerCase()) ||
      prop.name.toLowerCase().includes(locationSearch.toLowerCase());

    // 2. Dropdown Type
    const matchesDropdownType = dropdownType === 'All' || prop.type === dropdownType;

    // 3. Pill Filter
    let matchesPill = true;
    if (selectedPill === 'Residential') {
      matchesPill = prop.type === 'Residential';
    } else if (selectedPill === 'Commercial') {
      matchesPill = prop.type === 'Commercial';
    } else if (selectedPill === 'Land') {
      matchesPill = prop.type === 'Land';
    } else if (selectedPill === 'Available') {
      matchesPill = prop.status === 'Open' || prop.status === 'Hot Deal';
    } else if (selectedPill === 'Hot Deals') {
      matchesPill = prop.status === 'Hot Deal';
    }

    return matchesLocation && matchesDropdownType && matchesPill;
  });

  return (
    <section id="properties" className={`relative bg-navy-mid ${isPropertiesPage ? 'py-12' : 'py-16 md:py-24'}`}>
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* HOMEPAGE VIEW HEADER */}
        {!isPropertiesPage && (
          <FadeUp className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 md:mb-16 gap-6">
            <div className="max-w-2xl">
              <SectionLabel>Our Portfolio</SectionLabel>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4">Featured Properties</h2>
              <p className="text-gray-text text-lg">
                Asset-backed investments mapped to high-value real estate projects across the United States.
              </p>
            </div>
            <Link href="/properties" className="border-b border-gold text-gold hover:text-white hover:border-white transition-colors pb-1 uppercase tracking-widest text-sm font-semibold max-w-max">
              View All Properties
            </Link>
          </FadeUp>
        )}

        {/* PROPERTIES PAGE VIEW HEADER & SEARCH / FILTER HERO */}
        {isPropertiesPage && (
          <div className="mb-16">
            <FadeUp className="text-center max-w-3xl mx-auto mb-10">
              <SectionLabel className="justify-center">Investment Catalog</SectionLabel>
              <h1 className="text-4xl md:text-6xl font-serif mb-4 text-white">Our Property Portfolio</h1>
              <p className="text-gray-text text-lg md:text-xl">
                Asset-backed real estate investments across the United States
              </p>
            </FadeUp>

            {/* Search Bar Form */}
            <FadeUp className="max-w-4xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-navy p-4 rounded-2xl border border-white/5 shadow-2xl">
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                    <MapPin size={18} />
                  </span>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter city, state or project name..."
                    className="w-full pl-12 pr-4 py-3 bg-[#04091A] rounded-xl text-white placeholder-gray-600 border border-white/5 focus:outline-none focus:border-gold text-sm transition-all"
                  />
                </div>
                
                <div className="w-full md:w-60 relative">
                  <select
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value)}
                    className="w-full px-4 py-3 bg-[#04091A] rounded-xl text-white border border-white/5 focus:outline-none focus:border-gold text-sm transition-all appearance-none cursor-pointer"
                  >
                    <option value="All">All Property Types</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Search size={16} /> Search
                </button>
              </form>
            </FadeUp>

            {/* Filter Pills */}
            <FadeUp className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {['All', 'Residential', 'Commercial', 'Land', 'Available', 'Hot Deals'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => handlePillClick(pill)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border transition-all ${
                    selectedPill === pill
                      ? 'bg-gold border-gold text-navy shadow-md shadow-gold/10'
                      : 'bg-navy/40 border-white/5 text-gray-text hover:text-white hover:border-white/10'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </FadeUp>
          </div>
        )}

        {/* PROPERTY LISTINGS GRID */}
        {filteredProperties.length > 0 ? (
          <FadeUp stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop, idx) => (
              <FadeUpItem key={idx} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden group/image bg-gradient-to-br from-navy-mid to-navy flex flex-col items-center justify-center">
                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10 pointer-events-none"></div>

                  <Building2 size={72} className="text-white/5 opacity-50 group-hover:scale-110 transition-transform duration-700" strokeWidth={1} />
                  <span className="text-gold/50 uppercase tracking-widest text-[10px] font-semibold mt-4 z-10">{prop.typeDisplay}</span>

                  {/* Hover overlay with Quick View */}
                  <div className="absolute inset-0 bg-[rgba(4,9,26,0.97)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center border border-gold/30 rounded-t-xl">
                    <button className="px-6 py-3 bg-gold/10 border border-gold text-gold hover:bg-gold hover:text-navy font-semibold uppercase tracking-wider text-xs rounded transition duration-300 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 shadow-[0_0_20px_rgba(201,168,76,0.15)]">
                      <Eye size={16} /> Quick View
                    </button>
                  </div>
                  
                  <div className="absolute top-4 left-4 z-30 bg-[rgba(4,9,26,0.97)] backdrop-blur border border-white/10 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded text-white flex items-center gap-2 shadow-lg">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${prop.status === 'Hot Deal' ? 'bg-gold text-gold' : prop.status === 'Coming Soon' ? 'bg-amber-500 text-amber-500' : 'bg-green-500 text-green-500'}`}></div>
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
                
                <div className="bg-navy border border-border-subtle rounded-b-xl p-6 group-hover:border-border-gold transition-colors duration-300 relative z-30 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-serif text-2xl group-hover:text-gold transition-colors line-clamp-1">{prop.name}</h3>
                        <div className="flex items-center text-sm text-gray-text mt-2">
                          <MapPin size={14} className="mr-1 shrink-0" /> <span className="line-clamp-1">{prop.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="my-5 h-px w-full bg-border-subtle"></div>

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

                  {isPropertiesPage && (
                    <Link 
                      href="/register" 
                      className="mt-6 w-full py-2.5 bg-gold hover:bg-gold-light text-navy text-center font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-gold/10"
                    >
                      Invest Now
                    </Link>
                  )}
                </div>
              </FadeUpItem>
            ))}
          </FadeUp>
        ) : (
          <FadeUp className="text-center py-20 bg-navy/20 border border-dashed border-white/5 rounded-2xl">
            <Building2 size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-white mb-2">No Properties Found</h3>
            <p className="text-gray-text text-sm">We couldn't find any listings matching your current filter criteria.</p>
          </FadeUp>
        )}

      </div>
    </section>
  );
}
