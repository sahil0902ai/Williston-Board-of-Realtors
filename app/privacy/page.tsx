import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Williston Investments',
  description: 'Read the privacy policy for using the Williston Investments platform.',
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
          
          <div className="space-y-8 text-gray-text leading-relaxed font-sans">
            <p className="text-xs text-gray-500">Last Updated: June 2026</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">1. Information We Collect</h2>
              <p>
                We collect personal information that you provide when registering and using our platform. This includes:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1.5 text-gray-300">
                <li>Full name, email address, and phone number</li>
                <li>BVN (Bank Verification Number) or NIN (National Identification Number) for legal verification</li>
                <li>Bank account details for withdrawals</li>
                <li>Transaction history and proof of payments</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">2. How We Use Your Data</h2>
              <p>
                This information is used solely for:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1.5 text-gray-300">
                <li>Account verification and security validation (KYC)</li>
                <li>Processing deposit credits and payout withdrawals</li>
                <li>Communicating important updates about your investment accounts</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">3. Information Sharing</h2>
              <p>
                We do not sell or share your personal information with third parties except as required for payment processing (Monnify, local bank APIs) or legal compliance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">4. Data Storage & Security</h2>
              <p>
                Your data is stored securely using industry-standard encryption via our database provider Supabase. We implement technical and administrative guardrails to prevent unauthorized access, alteration, or exposure of your details.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif text-white">5. Cookies & Tracking</h2>
              <p>
                We use cookies to analyze web traffic, remember user login states, and optimize platform navigation. You can manage your cookie preferences through your browser settings.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
