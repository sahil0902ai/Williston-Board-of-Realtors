import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Williston Investments',
  description: 'Read the terms and conditions for using the Williston Investments platform.',
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
          
          <div className="space-y-8 text-gray-text leading-relaxed font-sans">
            <p className="text-xs text-gray-500">Last Updated: June 2026</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">1. Company Information</h2>
              <p>
                Williston Board of Realtors and Investments is operated by Chukwuebuka Irenaus Onyegere, currently in the process of formal business registration with the Corporate Affairs Commission (CAC) of Nigeria. We operate with full transparency and are committed to completing our CAC registration to provide additional assurance to our investors.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">2. Agreement to Terms</h2>
              <p>
                By accessing or using the Williston Investments platform, you agree to be bound by these Terms of Service. If you do not agree, you must immediately cease accessing and using our platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">3. Eligibility & Verification</h2>
              <p>
                To register as an investor, you must be at least 18 years old and successfully complete our identity verification process (KYC), including providing a valid government-issued ID (BVN/NIN) and proof of address. All information provided must be accurate and truthful.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">4. Investment Risk Disclosure</h2>
              <p>
                All investments carry risk. Past performance of our investment plans does not guarantee future returns. Real estate investments are subject to market fluctuations. We recommend investing only amounts you can afford within your risk tolerance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">5. Deposit and Withdrawal Terms</h2>
              <p>
                Deposits are accepted via bank transfer, OPay, and cryptocurrency. All deposits are manually verified before crediting to ensure security. Withdrawals are processed within 2-4 business hours for bank transfers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">6. Dispute Resolution</h2>
              <p>
                Any disputes will first be addressed through direct communication via WhatsApp (+234 916 745 5410) or email (willistonboardofrealtors@gmail.com). We are committed to resolving all investor concerns promptly and fairly.
              </p>
            </section>

            <section id="investor-protection" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-serif text-white">7. Investor Protection Policy</h2>
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
