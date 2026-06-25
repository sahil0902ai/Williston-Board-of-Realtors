import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Risk Disclosure | Williston Investments',
  description: 'Understand the risks associated with real estate investments on the Williston platform.',
};

export default function RiskPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy text-white pt-32 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 border-b border-border-subtle pb-4">
            Risk <span className="text-gold">Disclosure</span>
          </h1>

          {/* Warning Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
            <span className="text-2xl mt-0.5 select-none shrink-0">⚠️</span>
            <div className="text-sm text-amber-200 leading-relaxed font-sans">
              <strong className="font-bold text-white block mb-1">Important Notice:</strong>
              Williston Board of Realtors and Investments is currently completing formal CAC registration. While we maintain full operational transparency, please invest responsibly and only amounts you are comfortable with during our growth phase.
            </div>
          </div>
          
          <div className="space-y-8 text-gray-text leading-relaxed font-sans">
            <p className="text-xs text-gray-500">Last Updated: June 2026</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">1. Business Registration Status</h2>
              <p>
                We are actively pursuing CAC registration. Current operations are run with full transparency and direct accountability from our founder.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">2. Market Risk</h2>
              <p>
                Real estate values can fluctuate based on economic conditions in Nigeria. Property market conditions, interest rates, inflation, and government policy shifts can affect property valuations and expected rental yields.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">3. Liquidity Risk</h2>
              <p>
                Funds invested in fixed plans cannot be withdrawn before maturity without a 10% early exit penalty. Real estate is fundamentally an illiquid asset, and capital allocation cycles must run their full course to generate optimal returns.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">4. No Guarantee</h2>
              <p>
                Returns are targeted based on our investment strategy but are not guaranteed by any regulatory body at this time. Past performance of our property programs is not an absolute indicator of future success.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
