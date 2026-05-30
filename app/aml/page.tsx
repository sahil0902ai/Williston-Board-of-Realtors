import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AML & KYC Policy | Williston Board of Realtors & Investments',
  description: 'Read the Anti-Money Laundering (AML) and Know Your Customer (KYC) policies for using the Williston platform.',
};

export default function AMLPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy text-white pt-32 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 border-b border-border-subtle pb-4">
            AML & KYC <span className="text-gold">Policy</span>
          </h1>
          
          <div className="space-y-6 text-gray-text leading-relaxed">
            <p className="text-sm">Last Updated: May 2026</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">1. Know Your Customer (KYC) Requirements</h2>
              <p>
                To maintain a secure investing environment and comply with federal regulations, all investors are required to complete identity verification. This process includes providing a government-issued ID (such as a Driver&rsquo;s License, State ID, or Passport), verify their residential address, and verify other relevant details.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">2. Anti-Money Laundering (AML) Compliance</h2>
              <p>
                Williston is committed to preventing money laundering, terrorist financing, and fraudulent transactions on our platform. We actively monitor all funding sources, deposits, and withdrawal accounts to ensure legitimacy and legal compliance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">3. Third-Party Payments Restriction</h2>
              <p>
                To protect against fraud, we strictly prohibit third-party payments. All deposit transactions and withdrawal requests must match the exact name registered on the investor&rsquo;s Williston account. Discrepancies will result in transaction holds and identity audits.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">4. Verification Process & Auditing</h2>
              <p>
                Submitted verification documentation is reviewed by our compliance team. Accounts showing suspicious patterns or incomplete information will be placed on temporary hold. We reserve the right to request additional verification documents or details at any point.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">5. Inquiry & Support</h2>
              <p>
                For questions regarding identity verification, document submission issues, or AML requirements, please reach out to our support department at willistonboardofrealtors@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
