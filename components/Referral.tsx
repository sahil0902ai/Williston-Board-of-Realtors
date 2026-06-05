import { Link as LinkIcon, Share2, Wallet } from "lucide-react";
import { FadeUp, FadeUpItem } from './FadeUp';
import SectionLabel from './SectionLabel';
import Link from 'next/link';

export default function Referral() {
  return (
    <section id="referral" className="py-16 md:py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-navy-mid border border-border-gold rounded-2xl overflow-hidden relative">
          
          <div className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://picsum.photos/seed/pattern/1000/1000?grayscale&opacity=5')" }}></div>

          <div className="grid lg:grid-cols-2">
            <FadeUp delay={0.1} stagger className="p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center">
              <FadeUpItem>
                <SectionLabel>Partner Program</SectionLabel>
              </FadeUpItem>
              
              <FadeUpItem>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6 leading-tight">
                  Grow With Us. <br /> Earn Commission.
                </h2>
              </FadeUpItem>
              
              <FadeUpItem>
                <p className="text-gray-text text-lg mb-8 max-w-md">
                  Invite friends and family to build wealth with Williston. Earn up to 10% commission on their first investment cycle.
                </p>
              </FadeUpItem>
 
              <FadeUpItem className="bg-navy border border-border-gold rounded-lg p-6 mb-8 max-w-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-bl-full"></div>
                <div className="text-sm text-gray-text uppercase tracking-widest mb-2 relative z-10">Average Partner Earnings</div>
                <div className="text-3xl font-serif text-gold relative z-10">$500+ /mo</div>
              </FadeUpItem>
 
              <FadeUpItem>
                <Link href="/register" className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded text-center transition-colors max-w-max inline-block">
                  Join Referral Program
                </Link>
              </FadeUpItem>
            </FadeUp>

            <FadeUp delay={0.3} stagger className="bg-navy-light/50 p-8 md:p-12 lg:p-16 border-t lg:border-t-0 lg:border-l border-border-subtle relative z-10">
              <FadeUpItem>
                <h3 className="font-serif text-2xl mb-10">How It Works</h3>
              </FadeUpItem>
              
              <div className="space-y-10">
                <FadeUpItem className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-navy border border-border-gold flex items-center justify-center text-gold">
                    <LinkIcon size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">1. Get Your Link</h4>
                    <p className="text-gray-text text-sm leading-relaxed">Sign up as an investor or partner to access your unique referral dashboard and tracking link.</p>
                  </div>
                </FadeUpItem>

                <FadeUpItem className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-navy border border-border-gold flex items-center justify-center text-gold">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">2. Share & Invite</h4>
                    <p className="text-gray-text text-sm leading-relaxed">Share your link via WhatsApp, social media, or directly with your network and cooperatives.</p>
                  </div>
                </FadeUpItem>

                <FadeUpItem className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-navy border border-border-gold flex items-center justify-center text-gold">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">3. Earn Commission</h4>
                    <p className="text-gray-text text-sm leading-relaxed">Earn 5% to 10% instant commission deposited straight to your withdrawal wallet.</p>
                  </div>
                </FadeUpItem>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
