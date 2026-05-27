import type {Metadata} from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import MobileBottomBar from '@/components/MobileBottomBar';
import Chatbot from '@/components/Chatbot';
import SplashScreenController from '@/components/SplashScreenController';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://williston.vercel.app'),
  title: 'Williston Board of Realtors & Investments | Real Estate Investment the United States',
  description: "Invest in verified real estate and earn 18–35% annual returns. America's trusted wealth investment platform based in Houston. Join 4,800+ investors.",
  keywords: [
    'real estate investment the United States',
    'property investment Houston',
    'wealth investment platform the United States',
    'diaspora investment the United States',
    'passive income the United States'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Williston Board of Realtors & Investments | Real Estate Investment the United States',
    description: "Invest in verified real estate and earn 18–35% annual returns. America's trusted wealth investment platform based in Houston. Join 4,800+ investors.",
    url: '/',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/luxury/1200/630',
        width: 1200,
        height: 630,
        alt: 'Williston Board of Realtors & Investments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Williston Board of Realtors & Investments | Real Estate Investment the United States',
    description: "Invest in verified real estate and earn 18–35% annual returns. America's trusted wealth investment platform based in Houston. Join 4,800+ investors.",
    images: ['https://picsum.photos/seed/luxury/1200/630'],
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💰</text></svg>',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Williston Board of Realtors & Investments',
  image: 'https://picsum.photos/seed/luxury/1200/630',
  description: "Invest in verified real estate and earn 18–35% annual returns. America's trusted wealth investment platform based in Houston. Join 4,800+ investors.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Houston Business District',
    addressLocality: 'Houston',
    addressRegion: 'Texas',
    addressCountry: 'US',
  },
  telephone: '+17130000000',
  url: 'https://williston.vercel.app',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Early session-check script to prevent splash screen flash for returning users */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var navEntries = performance.getEntriesByType('navigation');
              var isReload = navEntries.length > 0 && navEntries[0].type === 'reload';
              var shown = sessionStorage.getItem('splash_shown');
              if (shown && !isReload) {
                document.documentElement.classList.add('skip-splash');
              }
            } catch (e) {
              console.error(e);
            }
          })();
        ` }} />

        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: #04091A; }
          .nav-critical { background: rgba(4,9,26,0.97); }

          /* Splash Screen Keyframes & Styling */
          .skip-splash #global-splash-screen {
            display: none !important;
          }
          
          .w-stroke-main {
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
            animation: drawStroke 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .w-stroke-accent {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: drawStroke 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: 0.2s;
          }

          @keyframes drawStroke {
            to {
              stroke-dashoffset: 0;
            }
          }

          .splash-letter {
            display: inline-block;
            opacity: 0;
            transform: translateY(6px);
            animation: fadeInLetter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes fadeInLetter {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .splash-subtitle {
            animation: fadeInSubtitle 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: 1.3s;
          }

          @keyframes fadeInSubtitle {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .splash-progress {
            animation: fillProgress 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: 1.7s;
          }

          @keyframes fillProgress {
            to {
              width: 100%;
            }
          }
        ` }} />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-navy text-white antialiased selection:bg-gold selection:text-navy" suppressHydrationWarning>
        {/* HTML Loading Splash Screen Overlay */}
        <div id="global-splash-screen" className="fixed inset-0 bg-[#04091A] z-[9999] flex flex-col items-center justify-center transition-opacity duration-400">
           <div className="flex flex-col items-center text-center px-4 max-w-sm md:max-w-md w-full">
              {/* Animated Monogram */}
              <div className="mb-4">
                 <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path 
                       d="M22 25 L40 75 L50 45 L60 75 L78 25" 
                       className="w-stroke-main"
                    />
                    <path 
                       d="M30 25 L43 60 M57 60 L70 25" 
                       className="w-stroke-accent"
                       strokeWidth="1.5"
                       opacity="0.6"
                    />
                 </svg>
              </div>

              {/* WILLISTON Text */}
              <div className="flex justify-center gap-1.5 mb-2 h-10 select-none">
                 {Array.from("WILLISTON").map((char, idx) => (
                    <span 
                       key={idx} 
                       className="splash-letter font-serif text-3xl md:text-4xl tracking-[0.1em] text-white font-bold"
                       style={{ animationDelay: `${0.8 + idx * 0.055}s` }}
                    >
                       {char}
                    </span>
                 ))}
              </div>

              {/* Subtitle */}
              <p className="splash-subtitle text-[#C9A84C] text-[10px] md:text-xs tracking-[0.25em] uppercase text-center opacity-0 select-none">
                 Board of Realtors & Investments
              </p>

              {/* Progress Bar */}
              <div className="w-44 md:w-56 h-[2px] bg-white/10 rounded-full overflow-hidden mt-6">
                 <div className="splash-progress bg-[#C9A84C] h-full w-0"></div>
              </div>

              {/* Loading Text */}
              <div className="h-6 mt-4 flex items-center justify-center">
                 <span id="splash-loading-text" className="text-gray-400 text-xs tracking-wider transition-opacity duration-150" style={{ transition: 'opacity 0.15s ease-in-out' }}>
                    Securing your connection...
                  </span>
              </div>
           </div>
        </div>

        <SplashScreenController />

        {children}
        <WhatsAppButton />
        <Chatbot />
        <CookieConsent />
        <MobileBottomBar />
      </body>
    </html>
  );
}
