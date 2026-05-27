import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Risk Disclosure | Williston Board of Realtors & Investments',
  description: 'Understand the risks associated with real estate investments on the Williston platform.',
};

export default function RiskPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy text-white pt-32 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 border-b border-border-subtle pb-4">
            Risk <span className="text-gold">Disclosure</span>
          </h1>
          
          <div className="space-y-6 text-gray-text leading-relaxed">
            <p className="text-sm">Last Updated: May 2026</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">General Investment Warning</h2>
              <p>
                All financial investments carry some degree of risk, including the loss of principal. Real estate investments are not guaranteed and are subject to market conditions, supply and demand, local economic climates, and zoning laws.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">1. Liquidity Risk</h2>
              <p>
                Real estate is an inherently illiquid asset. Capital invested in property development plans is locked for the duration of the cycle (the maturity period). Early withdrawals are not guaranteed and may be subject to substantial liquidation fees.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">2. Projections & Forward-Looking Estimates</h2>
              <p>
                Projections, targets, and expected ROI presented on our platform are estimations based on historical data and current property market research. Actual performance may differ, and past performance is not a guarantee of future payouts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">3. Third-Party Risks</h2>
              <p>
                Development projects are subject to constructor performance, supply-chain constraints, material cost increases, and regulatory inspections. While Williston manages projects closely, delays in development cycles may occur.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">4. Secure Protections</h2>
              <p>
                To mitigate risk, Williston secures all investments with direct underlying physical assets (such as land titles or built structures) and maintains robust commercial property insurance policies.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
