import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Williston Board of Realtors & Investments',
  description: 'Read the terms and conditions for using the Williston Board of Realtors & Investments platform.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy text-white pt-32 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 border-b border-border-subtle pb-4">
            Terms of <span className="text-gold">Service</span>
          </h1>
          
          <div className="space-y-6 text-gray-text leading-relaxed">
            <p className="text-sm">Last Updated: May 2026</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">1. Agreement to Terms</h2>
              <p>
                By accessing or using the Williston Board of Realtors & Investments platform, you agree to be bound by these Terms of Service. If you do not agree, you must immediately cease accessing and using our platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">2. Eligibility & Verification</h2>
              <p>
                To register as an investor, you must be at least 18 years old and successfully complete our identity verification process (KYC), including providing a valid government-issued ID and proof of address. All information provided must be accurate and truthful.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">3. Investment Risks & Disclaimers</h2>
              <p>
                Real estate investments are subject to market fluctuations and capital risk. While we secure all investments with physical real estate assets, past performance is not indicative of future yields. Targeted returns are projections, not guarantees.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">4. Withdrawal and Payouts</h2>
              <p>
                Withdrawal requests are processed according to the maturity dates of active plans. Early withdrawal is subject to review and may incur penalties. Payouts are made through secure channels such as local bank transfers, OPay transfers, wire transfers, or other approved payment methods.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">5. Governing Law</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria, and any disputes shall be resolved in the competent courts of Anambra State, Nigeria.
              </p>
            </section>

            <section id="investor-protection" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-serif text-white">6. Investor Protection Policy</h2>
              <p>
                All investor funds are strictly protected. Each investment tier is collateralized by physical, fully verified real estate assets located in high-growth metropolitan areas across Nigeria. We maintain comprehensive insurance policies, legal deed registration, and conservative loan-to-value ratios to safeguard our investors&rsquo; principal capital.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
