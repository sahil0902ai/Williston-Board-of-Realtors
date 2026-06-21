import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Williston Board of Realtors & Investments',
  description: 'Read the privacy policy for using the Williston Board of Realtors & Investments platform.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy text-white pt-32 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 border-b border-border-subtle pb-4">
            Privacy <span className="text-gold">Policy</span>
          </h1>
          
          <div className="space-y-6 text-gray-text leading-relaxed">
            <p className="text-sm">Last Updated: May 2026</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">1. Information We Collect</h2>
              <p>
                We collect personal information that you provide when registering, including your name, email, phone number, physical address, and verification details (KYC documentation, BVN, NIN, or passport copies).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">2. How We Use Your Data</h2>
              <p>
                Your information is used to verify your identity, process transactions, secure property deeds under your name, distribute payouts, and provide customer support. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">3. Data Protection & Security</h2>
              <p>
                We implement industry-standard security measures, including SSL encryption, restricted administrative access, and secure database hosting, to prevent unauthorized access, alteration, or disclosure of your information. We strictly comply with the Nigeria Data Protection Regulation (NDPR).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">4. Cookies & Tracking</h2>
              <p>
                We use cookies to analyze web traffic, remember user login states, and optimize platform navigation. You can manage your cookie preferences through our consent banner.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">5. Access and Rights</h2>
              <p>
                Under the NDPR, you have the right to request access to the personal data we hold about you and request corrections or deletion. For any inquiry, please email our support desk at willistonboardofrealtors@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
