import type {Metadata} from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import MobileBottomNav from '@/components/MobileBottomNav';
import Chatbot from '@/components/Chatbot';
import SplashScreenController from '@/components/SplashScreenController';
import { GoogleAnalytics } from '@next/third-parties/google';

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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://williston-board-of-realtors.vercel.app'),
  title: {
    default: 'Williston Board of Realtors & Investments | Real Estate Investment Nigeria',
    template: '%s | Williston Investments'
  },
  description: "Nigeria's trusted real estate investment platform based in Onitsha, Anambra. Earn 15-35% returns. Pay via Paystack, bank transfer, or crypto. Diaspora friendly.",
  keywords: [
    'real estate investment Nigeria',
    'property investment Onitsha Anambra',
    'investment platform Nigeria',
    'wealth investment Nigeria',
    'diaspora investment Nigeria',
    'passive income Nigeria',
    'land investment Nigeria',
    'Williston Board of Realtors Nigeria',
  ],
  openGraph: {
    title: 'Williston Board of Realtors & Investments',
    description: 'Build wealth through premium real estate investment in Nigeria. 15-35% annual returns.',
    url: 'https://williston-board-of-realtors.vercel.app',
    siteName: 'Williston Investments',
    type: 'website',
    locale: 'en_NG',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Williston Board of Realtors and Investments',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Williston Board of Realtors & Investments',
    description: "Nigeria's trusted real estate investment | Onitsha, Anambra | 15-35% returns",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'your-google-verification-code',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💼</text></svg>',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://williston-board-of-realtors.vercel.app',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Williston Board of Realtors & Investments',
  image: 'https://williston-board-of-realtors.vercel.app/og-image.png',
  description: "Nigeria's trusted real estate investment platform based in Onitsha, Anambra. Earn 15-35% returns. Pay via Paystack, bank transfer, or crypto. Diaspora friendly. Join 4,800+ investors.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: '15 Oguta Road',
    addressLocality: 'Onitsha',
    addressRegion: 'Anambra State',
    addressCountry: 'NG',
  },
  email: 'willistonboardofrealtors@gmail.com',
  url: 'https://williston-board-of-realtors.vercel.app',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
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
        {/* HTML Loading Splash Screen Overlay with robust inline styles fallbacks */}
        <div 
          id="global-splash-screen" 
          style={{
            position: 'fixed',
            inset: 0,
            background: '#04091A',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.4s ease-in-out',
          }}
          className="transition-opacity duration-400"
        >
           <div 
             style={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               textAlign: 'center',
               paddingLeft: '16px',
               paddingRight: '16px',
               maxWidth: '448px',
               width: '100%',
             }}
           >
              {/* Animated Monogram */}
              <div style={{ marginBottom: '16px' }}>
                 <svg 
                   viewBox="0 0 100 100" 
                   style={{
                     width: '96px',
                     height: '96px',
                     color: '#C9A84C',
                   }}
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="3.5" 
                   strokeLinecap="round" 
                   strokeLinejoin="round"
                 >
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
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                  height: '40px',
                  userSelect: 'none',
                }}
              >
                 {Array.from("WILLISTON").map((char, idx) => (
                    <span 
                       key={idx} 
                       className="splash-letter font-serif"
                       style={{ 
                         animationDelay: `${0.8 + idx * 0.055}s`,
                         display: 'inline-block',
                         fontSize: '2rem',
                         letterSpacing: '0.1em',
                         color: '#ffffff',
                         fontWeight: 'bold',
                       }}
                    >
                       {char}
                    </span>
                 ))}
              </div>

              {/* Subtitle */}
              <p 
                className="splash-subtitle"
                style={{
                  color: '#C9A84C',
                  fontSize: '11px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  opacity: 0,
                  userSelect: 'none',
                  margin: 0,
                }}
              >
                 Board of Realtors & Investments
              </p>

              {/* Progress Bar */}
              <div 
                style={{
                  width: '180px',
                  height: '2px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginTop: '24px',
                }}
              >
                 <div 
                   className="splash-progress"
                   style={{
                     background: '#C9A84C',
                     height: '100%',
                     width: '0%',
                   }}
                 ></div>
              </div>

              {/* Loading Text */}
              <div style={{ height: '24px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span 
                   id="splash-loading-text" 
                   style={{
                     color: '#8A9BB5',
                     fontSize: '12px',
                     letterSpacing: '0.05em',
                     transition: 'opacity 0.15s ease-in-out',
                   }}
                 >
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
        <MobileBottomNav />
        {/* <GoogleAnalytics gaId="G-XXXXXXXXXX" /> */}
      </body>
    </html>
  );
}
