import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Meet the Founder | Williston Investments',
  description: 'Learn about Chukwuebuka Irenaus Onyegere, the founder of Williston Board of Realtors & Investments.',
};

export default function AboutFounderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy text-white pt-32 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-12 border-b border-border-subtle pb-4">
            Meet the <span className="text-gold">Founder</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Image Card */}
            <div className="md:col-span-4 bg-navy-mid border border-border-subtle rounded-2xl p-5 text-center shadow-xl">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-gold shadow-lg mb-4">
                <Image
                  src="/images/founder.png"
                  alt="Chukwuebuka Irenaus Onyegere"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h2 className="text-xl font-serif font-bold text-white">Chukwuebuka I. Onyegere</h2>
              <p className="text-xs text-gold font-medium uppercase tracking-wider mt-1">Founder & CEO</p>
              <p className="text-xs text-gray-text mt-2">Onitsha, Anambra State, Nigeria</p>
            </div>

            {/* Right Column: Bio details */}
            <div className="md:col-span-8 space-y-6 text-gray-text leading-relaxed font-sans">
              <p className="text-lg text-white font-serif italic">
                &ldquo;Democratizing wealth creation for Nigerians both at home and in the diaspora by connecting everyday investors to high-yield real estate opportunities.&rdquo;
              </p>

              <p>
                Williston Board of Realtors and Investments was founded by <strong>Chukwuebuka Irenaus Onyegere</strong> with a vision to make real estate investing accessible to everyone. Traditionally, prime real estate developments in metropolitan Nigeria were reserved only for institutional players or the extremely wealthy. Williston bridges this gap, allowing everyday investors to co-invest and grow their capital securely.
              </p>

              <p>
                We believe in radical transparency. While we are currently completing our formal business registration with the <strong>Corporate Affairs Commission (CAC) of Nigeria</strong>, our operations are managed with direct founder accountability, strict documentation, and underlying physical property collateral.
              </p>

              <div className="bg-navy-mid border border-border-subtle rounded-2xl p-6 mt-8 space-y-4">
                <h3 className="text-lg font-serif font-bold text-white mb-2">Direct Founder Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://wa.me/2349167455410"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-navy rounded-xl border border-border-subtle hover:border-green-500 transition group"
                  >
                    <span className="text-2xl select-none group-hover:scale-110 transition-transform">📲</span>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">WhatsApp Direct</p>
                      <p className="text-xs text-white font-semibold font-mono">+234 916 745 5410</p>
                    </div>
                  </a>

                  <a
                    href="mailto:willistonboardofrealtors@gmail.com"
                    className="flex items-center gap-3 px-4 py-3 bg-navy rounded-xl border border-border-subtle hover:border-gold transition group"
                  >
                    <span className="text-2xl select-none group-hover:scale-110 transition-transform">✉️</span>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Email Address</p>
                      <p className="text-xs text-white font-semibold font-mono">willistonboardofrealtors@gmail.com</p>
                    </div>
                  </a>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                As we scale, we remain committed to securing full regulatory certifications, building a world-class team, and acquiring prime lands to maximize your financial growth. Thank you for investing with us.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
