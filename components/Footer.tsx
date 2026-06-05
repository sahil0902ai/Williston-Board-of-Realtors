import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Send, MessageCircle } from 'lucide-react';
import { FadeUp, FadeUpItem } from './FadeUp';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy pt-16 md:pt-24 pb-24 md:pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeUp stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12 md:mb-16">
          
          {/* Column 1: Brand */}
          <FadeUpItem className="lg:pr-8">
            <Link href="/" className="flex flex-col mb-6 inline-block">
              <span className="font-serif text-2xl font-bold tracking-widest text-gold text-left">WILLISTON</span>
              <span className="text-[10px] tracking-widest uppercase text-gray-text">Board of Realtors & Investments</span>
            </Link>
            <p className="text-sm text-gray-text leading-relaxed mb-6">
              Empowering Americans globally to build generational wealth through secure, asset-backed real estate investments.
            </p>
            <address className="not-italic text-sm text-gray-300 space-y-2">
              <p>1847 Westheimer Road, Suite 300, Houston</p>
              <p>Texas, United States</p>
              <p className="pt-2 text-sm text-gray-text">💬 Contact via WhatsApp or Telegram</p>
              <p className="flex items-center gap-2 hover:text-gold transition-colors"><a href="mailto:willistonboardofrealtors@gmail.com">✉️ willistonboardofrealtors@gmail.com</a></p>
              <p className="flex items-center gap-2 hover:text-gold transition-colors"><a href="https://t.me/willistonboardofrealtors" target="_blank" rel="noopener">✈️ t.me/willistonboardofrealtors</a></p>
            </address>
          </FadeUpItem>

          {/* Column 2: Invest */}
          <FadeUpItem>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-sm">Invest & Buy</h4>
            <ul className="space-y-4 text-sm text-gray-text">
              <li><Link href="/#invest" className="hover:text-gold transition-colors">Investment Plans</Link></li>
              <li><Link href="/investment-plans" className="hover:text-gold transition-colors">Buy Properties</Link></li>
              <li><Link href="/rent" className="hover:text-gold transition-colors">Rent Apartments</Link></li>
              <li><Link href="/properties" className="hover:text-gold transition-colors">Real Estate Listings</Link></li>
              <li><Link href="/calculator" className="hover:text-gold transition-colors">ROI Calculator</Link></li>
            </ul>
          </FadeUpItem>

          {/* Column 3: Company */}
          <FadeUpItem>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-sm">Account</h4>
            <ul className="space-y-4 text-sm text-gray-text">
              <li><Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link></li>
              <li><Link href="/deposit" className="hover:text-gold transition-colors">Deposit Funds</Link></li>
              <li><Link href="/withdraw" className="hover:text-gold transition-colors">Withdraw Funds</Link></li>
              <li><Link href="/#referral" className="hover:text-gold transition-colors">Referral Program</Link></li>
              <li><Link href="/#learn" className="hover:text-gold transition-colors">Financial Education</Link></li>
            </ul>
          </FadeUpItem>

          {/* Column 4: Legal */}
          <FadeUpItem>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-sm">Legal & Trust</h4>
            <ul className="space-y-4 text-sm text-gray-text">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Investment Agreement</Link></li>
              <li><Link href="/risk" className="hover:text-white transition-colors">Risk Disclosure</Link></li>
              <li><Link href="/aml" className="hover:text-white transition-colors">AML / KYC Policy</Link></li>
              <li><Link href="/terms#investor-protection" className="hover:text-white transition-colors text-gold">Investor Protection</Link></li>
            </ul>
          </FadeUpItem>
        </FadeUp>

        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-gray-text text-center md:text-left order-2 md:order-1">
            &copy; {currentYear} Williston Board of Realtors and Investments. LLC Registered. SEC Registered.<br className="hidden lg:block"/>
            Investment involves risk. Returns are targeted but not guaranteed. Past performance is not indicative of future results.
          </div>
          
          {/* Social Icons */}
          <div className="flex gap-4 order-1 md:order-2 flex-wrap justify-center">
            <a href="https://t.me/willistonboardofrealtors" target="_blank" rel="noopener" aria-label="Telegram" className="w-10 h-10 rounded-full bg-navy border border-border-subtle flex items-center justify-center text-gray-text hover:border-[#0088cc] hover:text-[#0088cc] transition-colors">
              <Send size={18} className="-ml-1" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
