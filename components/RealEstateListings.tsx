'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Building2, Home, Map, Eye, Search, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';
import { supabase } from '@/lib/supabase';

interface RealEstateListingsProps {
  isPropertiesPage?: boolean;
}

const allProperties = [
  {
    name: "Williston Heights Phase 1",
    location: "Awka Road, Onitsha, Anambra",
    type: "Residential",
    typeDisplay: "Residential Duplexes",
    price: "₦8,500,000 / Unit",
    roi: "28%",
    status: "Open",
    imageSeed: "luxury+apartment",
  },
  {
    name: "Williston Gardens Estate",
    location: "Nnewi Road, Anambra",
    type: "Residential",
    typeDisplay: "Residential Estates",
    price: "₦5,500,000 / Unit",
    roi: "35%",
    status: "Hot Deal",
    imageSeed: "land+estate",
  },
  {
    name: "Williston Commerce Plaza",
    location: "Bridge Head, Onitsha, Anambra",
    type: "Commercial",
    typeDisplay: "Mixed-Use Commercial",
    price: "₦15,000,000 / Unit",
    roi: "22%",
    status: "Open",
    imageSeed: "commercial+building",
  },
  {
    name: "Williston Lekki Towers",
    location: "Lekki Phase 1, Lagos",
    type: "Commercial",
    typeDisplay: "Commercial Towers",
    price: "₦25,000,000 / Unit",
    roi: "26%",
    status: "Open",
    imageSeed: "shopping+mall",
  },
  {
    name: "Williston Abuja Estate",
    location: "Gwarinpa, Abuja FCT",
    type: "Residential",
    typeDisplay: "Residential Gardens",
    price: "₦18,000,000 / Unit",
    roi: "22%",
    status: "Hot Deal",
    imageSeed: "garden+apartment",
  },
  {
    name: "Williston PH Gardens",
    location: "GRA Phase 2, Port Harcourt, Rivers",
    type: "Residential",
    typeDisplay: "Residential Gardens",
    price: "₦12,000,000 / Unit",
    roi: "24%",
    status: "Open",
    imageSeed: "modern+residence",
  }
];

export default function RealEstateListings({ isPropertiesPage = false }: RealEstateListingsProps) {
  // Search & Filter State
  const [locationInput, setLocationInput] = useState('');
  const [typeInput, setTypeInput] = useState('All');
  
  const [locationSearch, setLocationSearch] = useState('');
  const [dropdownType, setDropdownType] = useState('All');
  const [selectedPill, setSelectedPill] = useState('All');

  // Dynamic properties & user session states
  const [properties, setProperties] = useState<any[]>(allProperties);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Investment modal states
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [quickViewProperty, setQuickViewProperty] = useState<any>(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch properties and user session
  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              location: p.location,
              type: p.type,
              typeDisplay: p.type_display || p.type,
              price: p.price,
              roi: p.roi,
              status: p.status,
              imageUrl: p.image_url
            }));
            setProperties(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch properties catalog, using fallbacks:', err);
      }
    }

    async function checkUserSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: profile } = await supabase
            .from('users')
            .select('wallet_balance, full_name')
            .eq('id', user.id)
            .single();
          if (profile) {
            setUserProfile(profile);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }

    loadProperties();
    checkUserSession();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocationSearch(locationInput);
    setDropdownType(typeInput);
  };

  const handlePillClick = (pill: string) => {
    setSelectedPill(pill);
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    const amount = parseFloat(purchaseAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid investment amount');
      return;
    }

    const userBalance = parseFloat(userProfile?.wallet_balance || '0');
    if (amount > userBalance) {
      setErrorMessage('Insufficient wallet balance. Please fund your wallet.');
      return;
    }

    setPurchaseStatus('loading');
    try {
      const res = await fetch('/api/properties/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedProperty.id || selectedProperty.name,
          amount
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPurchaseStatus('success');
        setUserProfile((prev: any) => ({
          ...prev,
          wallet_balance: userBalance - amount
        }));
        setTimeout(() => {
          setSelectedProperty(null);
        }, 3000);
      } else {
        setPurchaseStatus('error');
        setErrorMessage(data.error || 'Failed to complete co-ownership purchase');
      }
    } catch (err: any) {
      console.error(err);
      setPurchaseStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  // Filter properties
  const propertiesToFilter = isPropertiesPage ? properties : properties.slice(0, 3);

  const filteredProperties = propertiesToFilter.filter((prop) => {
    const matchesLocation = locationSearch === '' || 
      prop.location.toLowerCase().includes(locationSearch.toLowerCase()) ||
      prop.name.toLowerCase().includes(locationSearch.toLowerCase());

    const matchesDropdownType = dropdownType === 'All' || prop.type === dropdownType;

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

  // Helper to format Location to small caps city/state
  const getCityStateCaps = (location: string) => {
    const parts = location.split(',');
    if (parts.length >= 2) {
      const city = parts[parts.length - 2].trim().toUpperCase();
      const state = parts[parts.length - 1].trim().toUpperCase();
      return `${city}, ${state}`;
    }
    return location.toUpperCase();
  };

  // Helper to get Property Icon & Theme color
  const getPropertyTypeSettings = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residential':
        return {
          icon: <Home size={16} />,
          colorClass: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
          badgeText: 'Residential'
        };
      case 'commercial':
        return {
          icon: <Building2 size={16} />,
          colorClass: 'bg-purple-600/10 text-purple-400 border-purple-500/20',
          badgeText: 'Commercial'
        };
      case 'land':
      default:
        return {
          icon: <Map size={16} />,
          colorClass: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
          badgeText: 'Land'
        };
    }
  };

  return (
    <section id="properties" className={`relative bg-[#04091A] border-t border-white/5 ${isPropertiesPage ? 'py-12' : 'py-20 md:py-28'}`}>
      
      {/* Map-style background layer */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* HOMEPAGE VIEW HEADER WITH MAP STYLE BACKDROP */}
        {!isPropertiesPage && (
          <div className="relative mb-16 overflow-hidden py-10 rounded-2xl bg-[#060C1C] border border-white/5 px-8 md:px-12">
            
            {/* Styled vector map lines behind header */}
            <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
              <svg viewBox="0 0 800 200" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="0.5" className="w-full h-full">
                <path d="M 0 50 Q 200 150 400 50 T 800 150" />
                <path d="M 0 120 C 150 40 350 160 500 80 T 800 120" />
                <path d="M 100 0 L 100 200" />
                <path d="M 300 0 L 300 200" />
                <path d="M 500 0 L 500 200" />
                <path d="M 700 0 L 700 200" />
                <circle cx="100" cy="50" r="3" fill="#C9A84C" />
                <circle cx="300" cy="115" r="3" fill="#C9A84C" />
                <circle cx="500" cy="80" r="3" fill="#C9A84C" />
              </svg>
            </div>

            <FadeUp className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div className="max-w-2xl">
                <SectionLabel>Our Portfolio</SectionLabel>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 text-white leading-tight">Featured Real Estate Listings</h2>
                <p className="text-gray-text text-base leading-relaxed">
                  Explore asset-backed real estate projects across Nigeria. Start building your portfolio through fractional property co-ownership.
                </p>
              </div>
              <Link 
                suppressHydrationWarning 
                href="/properties" 
                className="border-b border-gold text-gold hover:text-white hover:border-white transition-colors pb-1.5 uppercase tracking-widest text-xs font-bold shrink-0 flex items-center justify-center"
                style={{
                  minHeight: '48px',
                  minWidth: '48px',
                  padding: '14px 24px',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span style={{ pointerEvents: 'none' }}>
                  View All Properties &rarr;
                </span>
              </Link>
            </FadeUp>
          </div>
        )}

        {/* PROPERTIES PAGE VIEW HEADER & SEARCH / FILTER HERO */}
        {isPropertiesPage && (
          <div className="mb-16">
            <FadeUp className="text-center max-w-3xl mx-auto mb-10">
              <SectionLabel className="justify-center">Investment Catalog</SectionLabel>
              <h1 className="text-4xl md:text-6xl font-serif mb-4 text-white">Our Property Portfolio</h1>
              <p className="text-gray-text text-lg md:text-xl font-light">
                Secure property asset fragments yielding high-performance returns.
              </p>
            </FadeUp>

            {/* Search Bar Form */}
            <FadeUp className="max-w-4xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-[#0A1433] p-4 rounded-2xl border border-white/5 shadow-2xl">
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                    <MapPin size={18} />
                  </span>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter city, state or project name..."
                    className="w-full pl-12 pr-4 py-3.5 bg-[#04091A] rounded-xl text-white placeholder-gray-600 border border-white/5 focus:outline-none focus:border-gold text-sm transition-all"
                  />
                </div>
                
                <div className="w-full md:w-60 relative">
                  <select
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#04091A] rounded-xl text-white border border-white/5 focus:outline-none focus:border-gold text-sm transition-all appearance-none cursor-pointer"
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
                  className="px-8 py-3.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    minHeight: '48px',
                    minWidth: '48px',
                    padding: '14px 24px',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center gap-2">
                    <Search size={16} /> Search
                  </span>
                </button>
              </form>
            </FadeUp>

            {/* Filter Pills */}
            <FadeUp className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {['All', 'Residential', 'Commercial', 'Land', 'Available', 'Hot Deals'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => handlePillClick(pill)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                    selectedPill === pill
                      ? 'bg-gold border-gold text-navy shadow-md shadow-gold/10'
                      : 'bg-[#0A1433]/60 border-white/5 text-gray-text hover:text-white hover:border-white/10'
                  }`}
                  style={{
                    minHeight: '48px',
                    minWidth: '48px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span style={{ pointerEvents: 'none' }}>
                    {pill}
                  </span>
                </button>
              ))}
            </FadeUp>
          </div>
        )}

        {/* PROPERTY LISTINGS GRID - EXACTLY 3 IN A ROW */}
        {filteredProperties.length > 0 ? (
          <FadeUp stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop, idx) => {
              const typeSettings = getPropertyTypeSettings(prop.type);
              return (
                <FadeUpItem key={idx} className="group flex flex-col bg-[#0A1628]/95 border border-white/5 hover:border-gold/30 rounded-2xl overflow-hidden shadow-2xl transition duration-300">
                  
                  {/* Card Header Media area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#0A1433] to-[#04091A] flex flex-col items-center justify-center">
                    {prop.imageUrl || prop.image_url ? (
                      <img 
                        src={prop.imageUrl || prop.image_url} 
                        alt={prop.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://picsum.photos/seed/noise/400/400?grayscale')" }}></div>
                        <Building2 size={64} className="text-white/5 opacity-40 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                      </>
                    )}
                    
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-black/30 z-10 pointer-events-none"></div>

                    {/* Colored Property Type Header Bar */}
                    <div className="absolute top-0 left-0 right-0 z-30 px-4 py-3 bg-navy/60 backdrop-blur-sm border-b border-white/5 flex justify-between items-center">
                      <div className={`flex items-center gap-2 px-2.5 py-1 rounded border text-xs font-semibold ${typeSettings.colorClass}`}>
                        {typeSettings.icon}
                        <span>{typeSettings.badgeText}</span>
                      </div>
                      <span className="text-[10px] bg-gold/10 text-gold border border-gold/20 font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        {prop.status}
                      </span>
                    </div>

                    {/* ROI Badge Top Right overlay */}
                    <div className="absolute top-16 right-4 z-30 bg-gold text-navy font-bold px-3 py-1.5 rounded-lg text-sm shadow-xl flex flex-col items-center leading-none">
                      <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75 mb-0.5">Est. ROI</span>
                      <span className="text-base font-extrabold">{prop.roi}</span>
                    </div>

                    {/* Quick View Button overlay on hover */}
                    <div className="absolute inset-0 bg-[rgba(4,9,26,0.95)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center border border-gold/30 rounded-t-2xl">
                      <button 
                        suppressHydrationWarning
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProperty(prop);
                        }}
                        className="px-6 py-3 bg-gold/10 border border-gold text-gold hover:bg-gold hover:text-navy font-semibold uppercase tracking-wider text-xs rounded transition duration-300 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 shadow-[0_0_20px_rgba(201,168,76,0.15)] cursor-pointer"
                        style={{
                          minHeight: '48px',
                          minWidth: '48px',
                          padding: '14px 24px',
                          cursor: 'pointer',
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <span style={{ pointerEvents: 'none' }} className="flex items-center gap-2">
                          <Eye size={16} /> Quick View
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content Information */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      
                      {/* Location City/State Caps in Gold */}
                      <div className="text-[10px] text-gold font-bold tracking-[0.2em] uppercase font-sans">
                        {getCityStateCaps(prop.location)}
                      </div>
                      
                      <h3 className="font-serif text-2xl text-white group-hover:text-gold transition-colors duration-300 line-clamp-1 leading-snug">
                        {prop.name}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-text pt-0.5">
                        <MapPin size={14} className="mr-1 text-gold shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>

                      <div className="h-[1px] w-full bg-white/5 pt-2"></div>

                      <div className="flex justify-between items-center py-2">
                        <div>
                          <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-0.5">Fraction Value</div>
                          <div className="font-sans font-bold text-white text-lg">{prop.price}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-0.5">Asset Security</div>
                          <div className="font-semibold text-green-400 text-sm flex items-center gap-1 justify-end">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 100% Backed
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Units Sold Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] uppercase font-bold text-gray-text tracking-widest">
                          <span>{20 + (idx % 12)} Co-Owners Joined</span>
                          <span className="text-gold">48 Max Limits</span>
                        </div>
                        <div className="w-full h-1.5 bg-navy rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-gold-dark to-gold" 
                            style={{ width: `${50 + (idx * 15 % 40)}%` }}
                          ></div>
                        </div>
                      </div>

                      <button 
                        suppressHydrationWarning
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) {
                            window.location.href = '/register';
                          } else {
                            setSelectedProperty(prop);
                            setPurchaseStatus('idle');
                            setPurchaseAmount('');
                            setErrorMessage('');
                          }
                        }}
                        className="w-full py-3 bg-gold hover:bg-gold-light text-navy text-center font-bold rounded-xl text-xs uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-gold/10 cursor-pointer"
                        style={{
                          minHeight: '48px',
                          minWidth: '48px',
                          padding: '14px 24px',
                          cursor: 'pointer',
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <span style={{ pointerEvents: 'none' }}>
                          Invest Now
                        </span>
                      </button>
                    </div>

                  </div>
                </FadeUpItem>
              );
            })}
          </FadeUp>
        ) : (
          <FadeUp className="text-center py-20 bg-navy/20 border border-dashed border-white/5 rounded-2xl">
            <Building2 size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-white mb-2">No Properties Found</h3>
            <p className="text-gray-text text-sm">We couldn't find any listings matching your current filter criteria.</p>
          </FadeUp>
        )}

      </div>

      {/* Dynamic Investment Purchase Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-[rgba(4,9,26,0.97)] z-50 flex items-center justify-center p-4">
          <div className="bg-navy-mid border border-border-gold rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 text-gray-text hover:text-white bg-navy border border-border-subtle rounded-full p-1 flex items-center justify-center"
              style={{
                minHeight: '48px',
                minWidth: '48px',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                position: 'absolute',
                zIndex: 1,
              }}
            >
              <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center">
                <X size={20} />
              </span>
            </button>

            <div className="p-8">
              {purchaseStatus === 'success' ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Investment Confirmed!</h3>
                  <p className="text-gray-text">
                    You have successfully co-purchased fraction shares of <strong className="text-white">{selectedProperty.name}</strong>.
                    <br /><br />
                    Daily yields calculations are now active in your dashboard ledger.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedProperty(null);
                      window.location.href = '/dashboard';
                    }}
                    className="w-full mt-6 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-white transition-colors"
                    style={{
                      minHeight: '48px',
                      minWidth: '48px',
                      padding: '14px 24px',
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <span style={{ pointerEvents: 'none' }}>
                      Go to Dashboard
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-serif text-white mb-2">Invest in Property Co-ownership</h3>
                  <p className="text-sm text-gray-text mb-6">Purchase fraction shares in {selectedProperty.name} to yield consistent ROI.</p>

                  <div className="bg-navy p-4 border border-border-subtle rounded-xl mb-6 space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-gray-text">Location</span><span className="text-white font-medium">{selectedProperty.location}</span></div>
                    <div className="flex justify-between"><span className="text-gray-text">Expected ROI</span><span className="text-gold font-bold">{selectedProperty.roi}</span></div>
                    <div className="flex justify-between"><span className="text-gray-text">Target Price</span><span className="text-white font-medium">{selectedProperty.price}</span></div>
                    <div className="flex justify-between"><span className="text-gray-text">Wallet Balance</span><span className="text-white font-mono font-bold">₦{parseFloat(userProfile?.wallet_balance || '0').toLocaleString()}</span></div>
                  </div>

                  <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-text uppercase tracking-widest font-semibold">Investment Amount (₦)</label>
                      <input 
                        type="number"
                        required
                        min="1"
                        placeholder="Enter investment amount in NGN..."
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(e.target.value)}
                        className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:border-gold focus:outline-none placeholder-gray-text/50"
                      />
                    </div>

                    {errorMessage && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                        {errorMessage.includes('Insufficient wallet balance') && (
                          <Link href="/deposit" className="text-gold font-bold underline hover:text-gold-light mt-1 self-start">
                            💳 Deposit Funds Now →
                          </Link>
                        )}
                      </div>
                    )}

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={purchaseStatus === 'loading'}
                        className="w-full py-4 bg-gold text-navy font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{
                          minHeight: '48px',
                          minWidth: '48px',
                          padding: '14px 24px',
                          cursor: 'pointer',
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <span style={{ pointerEvents: 'none' }}>
                          {purchaseStatus === 'loading' ? 'Processing Purchase...' : 'Confirm Purchase'}
                        </span>
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-4">Funds will be immediately deducted from your primary wallet balance.</p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProperty && (
        <div className="fixed inset-0 bg-[rgba(4,9,26,0.97)] z-50 flex items-center justify-center p-4">
          <div className="bg-navy-mid border border-border-gold rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              suppressHydrationWarning
              onClick={() => setQuickViewProperty(null)}
              className="absolute top-4 right-4 text-gray-text hover:text-white bg-navy border border-border-subtle rounded-full p-1 flex items-center justify-center"
              style={{
                minHeight: '48px',
                minWidth: '48px',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                position: 'absolute',
                zIndex: 1,
              }}
            >
              <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center">
                <X size={20} />
              </span>
            </button>

            <div className="p-8">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 bg-navy flex items-center justify-center">
                {quickViewProperty.imageUrl || quickViewProperty.image_url ? (
                  <img 
                    src={quickViewProperty.imageUrl || quickViewProperty.image_url} 
                    alt={quickViewProperty.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <Building2 size={64} className="text-white/10" />
                )}
                <div className="absolute top-4 left-4 bg-gold text-navy text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  {quickViewProperty.status}
                </div>
              </div>

              <h3 className="text-3xl font-serif text-white mb-2">{quickViewProperty.name}</h3>
              <p className="text-sm text-gold font-semibold mb-4">{quickViewProperty.typeDisplay}</p>
              
              <div className="flex items-center text-sm text-gray-text mb-6">
                <MapPin size={16} className="mr-1 text-gold" /> {quickViewProperty.location}
              </div>

              <div className="grid grid-cols-2 gap-4 bg-navy p-4 border border-border-subtle rounded-xl mb-6">
                <div>
                  <span className="text-[10px] text-gray-text uppercase tracking-widest block mb-1">Buy Price</span>
                  <span className="text-white font-bold text-lg">{quickViewProperty.price}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-text uppercase tracking-widest block mb-1">Expected ROI</span>
                  <span className="text-gold font-bold text-lg">{quickViewProperty.roi}</span>
                </div>
              </div>

              <div className="space-y-4">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Invest in this asset-backed property to earn consistent high-yield monthly returns. Our properties are fully vetted, registered under CAC, and SEC Nigeria compliant, providing real physical security for your capital.
                  </p>

                <button 
                  suppressHydrationWarning
                  onClick={() => {
                    setQuickViewProperty(null);
                    if (!user) {
                      window.location.href = '/register';
                    } else {
                      setSelectedProperty(quickViewProperty);
                      setPurchaseStatus('idle');
                      setPurchaseAmount('');
                      setErrorMessage('');
                    }
                  }}
                  className="w-full py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-colors text-center block"
                  style={{
                    minHeight: '48px',
                    minWidth: '48px',
                    padding: '14px 24px',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span style={{ pointerEvents: 'none' }}>
                    Invest In This Property Now
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
