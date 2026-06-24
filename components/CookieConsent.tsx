'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 500); // 500ms delay for a nice slide up after load
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.log('Storage not available', e);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie-consent', 'accepted');
    } catch (e) {
      console.log('Storage item set not available', e);
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('cookie-consent', 'declined');
    } catch (e) {
      console.log('Storage item set not available', e);
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6 pb-[env(safe-area-inset-bottom)]"
        >
          <div className="max-w-5xl mx-auto bg-navy-mid border border-border-subtle rounded-xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gold/5 opacity-20 pointer-events-none"></div>
            
            <p className="text-gray-text text-sm mb-0 relative z-10">
              We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our <Link href="/privacy" className="text-gold hover:text-white transition-colors underline decoration-gold/30 underline-offset-2">Privacy Policy</Link>.
            </p>
            
            <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0 relative z-10">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-none px-6 py-2.5 border border-border-subtle text-gray-text hover:text-white hover:border-border-gold rounded font-semibold text-xs tracking-widest uppercase transition-colors flex items-center justify-center"
                suppressHydrationWarning
                style={{
                  minHeight: '44px',
                  touchAction: 'manipulation',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ pointerEvents: 'none' }}>
                  Decline
                </span>
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-6 py-2.5 bg-gold hover:bg-gold-light text-navy rounded font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center"
                suppressHydrationWarning
                style={{
                  minHeight: '44px',
                  touchAction: 'manipulation',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ pointerEvents: 'none' }}>
                  Accept All
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
