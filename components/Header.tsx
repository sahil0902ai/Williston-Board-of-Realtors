'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInvestOpen, setIsInvestOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Properties', href: '/properties' },
    { name: 'Rent', href: '/rent' },
    { name: 'Learn', href: '/#learn' },
    { name: 'Calculator', href: '/calculator' },
  ];

  return (
    <header className={`fixed top-0 w-full z-[1000] transition duration-300 ${isScrolled ? 'bg-[rgba(4,9,26,0.97)] border-b border-gold/20 py-4' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-2xl font-bold tracking-widest text-gold text-left">WILLISTON</span>
          <span className="text-[8px] uppercase tracking-[0.3em] text-gray-text">Board of Realtors & Investments</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="relative group" onMouseEnter={() => setIsInvestOpen(true)} onMouseLeave={() => setIsInvestOpen(false)}>
            <button suppressHydrationWarning className="text-xs font-medium uppercase tracking-widest text-gray-text hover:text-gold transition-colors flex items-center gap-1 py-4">
              Invest <ChevronDown size={14} className={`transition-transform duration-200 ${isInvestOpen ? 'rotate-180 text-gold' : ''}`} />
            </button>
            <div className={`absolute top-full left-0 w-64 pt-2 pb-4 transition duration-300 transform origin-top ${isInvestOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="bg-[#020510] border border-border-gold rounded-xl shadow-[0_10px_40px_-10px_rgba(201,168,76,0.15)] flex flex-col p-2 overflow-hidden">
                <Link href="/#invest" className="px-4 py-3 hover:bg-navy-mid text-gray-300 text-sm rounded-lg transition-colors border border-transparent hover:border-border-subtle group/link">
                  <div className="font-bold text-white group-hover/link:text-gold transition-colors">Investment Plans</div>
                  <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Foundation, Prosperity, Legacy</div>
                </Link>
                <div className="h-px bg-border-subtle/50 mx-4 my-1"></div>
                <Link href="/investment-plans" className="px-4 py-3 hover:bg-navy-mid text-gray-300 text-sm rounded-lg transition-colors border border-transparent hover:border-border-subtle group/link">
                  <div className="font-bold text-white group-hover/link:text-gold transition-colors">Buy Property</div>
                  <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Commercial, Standard, Luxury</div>
                </Link>
                <div className="h-px bg-border-subtle/50 mx-4 my-1"></div>
                <Link href="/rent" className="px-4 py-3 hover:bg-navy-mid text-gray-300 text-sm rounded-lg transition-colors border border-transparent hover:border-border-subtle group/link">
                  <div className="font-bold text-white group-hover/link:text-gold transition-colors">Rent Apartment</div>
                  <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">2 Bed & 3 Bed Fully Furnished</div>
                </Link>
              </div>
            </div>
          </div>

          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-xs font-medium uppercase tracking-widest text-gray-text hover:text-gold transition-colors">
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 border-l border-border-subtle pl-8 ml-2">
            <Link href="/deposit" className="px-5 py-2 bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gold hover:text-navy transition flex items-center gap-1.5">
              💳 Deposit
            </Link>
            <Link href="/login" className="px-6 py-2.5 border border-border-subtle text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:border-gold hover:text-gold transition">
              Login
            </Link>
            <Link href="/#invest" className="px-6 py-2.5 bg-gold border border-gold text-navy text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:border-white hover:text-navy transition">
              Start Investing
            </Link>
          </div>
        </nav>

        {/* Mobile Nav Toggle */}
        <button suppressHydrationWarning className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#04091A] z-[999] md:hidden flex flex-col px-6 pt-[100px] pb-32 overflow-y-auto transition-[opacity,visibility,transform] duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Invest</div>
        <Link href="/#invest" className="text-2xl font-serif text-white hover:text-gold py-3 pl-4 border-l border-gold/10 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Investment Plans</Link>
        <Link href="/investment-plans" className="text-2xl font-serif text-white hover:text-gold py-3 pl-4 border-l border-gold/10 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Buy Property</Link>
        <Link href="/rent" className="text-2xl font-serif text-white hover:text-gold py-3 pl-4 mb-6 border-l border-gold/10 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Rent Apartment</Link>
        
        <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4 mt-4">Menu</div>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-2xl font-serif text-white hover:text-gold py-4 border-b border-border-subtle transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        
        <div className="mt-12 flex flex-col gap-4">
          <Link href="/deposit" className="bg-gold/10 border border-gold/30 text-center text-gold font-bold uppercase tracking-widest text-sm px-6 py-4 rounded-xl transition-colors flex items-center justify-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            💳 Deposit Funds
          </Link>
          <Link href="/login" className="bg-transparent border border-border-subtle text-center hover:border-gold hover:text-gold text-white font-bold uppercase tracking-widest text-sm px-6 py-4 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            Login
          </Link>
          <Link href="/#invest" className="bg-gold text-center hover:bg-white text-navy font-bold uppercase tracking-widest text-sm px-6 py-4 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            Start Investing
          </Link>
        </div>
      </div>
    </header>
  );
}
