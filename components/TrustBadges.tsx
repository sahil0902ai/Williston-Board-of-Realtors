import { FadeUp, FadeUpItem } from './FadeUp';
import { ShieldCheck, Lock, Building, CheckCircle2, Server, Key } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    { icon: <Building size={14} />, text: 'LLC Registered' },
    { icon: <ShieldCheck size={14} />, text: 'SEC Registered' },
    { icon: <Lock size={14} />, text: 'Escrow Protected' },
    { icon: <Server size={14} />, text: 'SSL Secured' },
    { icon: <Key size={14} />, text: '256-bit Encryption' },
    { icon: <ShieldCheck size={14} />, text: 'AML Compliant' },
  ];

  return (
    <section className="bg-navy-mid border-t border-gold/10 py-8 relative z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-text mb-6 font-semibold">Trusted, Verified & Regulated</span>
          <FadeUp stagger className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap justify-center gap-3 w-full">
            {badges.map((badge, idx) => (
              <FadeUpItem key={idx}>
                <div className="flex items-center justify-center gap-2 px-4 py-2 border border-gold/20 rounded-full bg-navy/50 text-gold/80 text-[10px] md:text-xs font-semibold uppercase tracking-wider hover:bg-gold/10 hover:border-gold/40 transition-colors w-full">
                  {badge.icon}
                  <span className="truncate">{badge.text}</span>
                </div>
              </FadeUpItem>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
