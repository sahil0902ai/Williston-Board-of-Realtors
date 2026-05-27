'use client';
import { useEffect } from 'react';

export default function SplashScreenController() {
   useEffect(() => {
      // Check if we should skip splash screen
      const navEntries = performance.getEntriesByType('navigation');
      const isReload = navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
      const shown = sessionStorage.getItem('splash_shown');

      // If we should skip it, make sure it is hidden (as a fallback in case the head script missed it)
      const splash = document.getElementById('global-splash-screen');
      if (shown && !isReload) {
         if (splash) splash.style.display = 'none';
         return;
      }

      // Cycle loading text
      const loadingTextEl = document.getElementById('splash-loading-text');
      
      const changeText = (text: string) => {
         if (loadingTextEl) {
            loadingTextEl.style.opacity = '0';
            setTimeout(() => {
               loadingTextEl.textContent = text;
               loadingTextEl.style.opacity = '1';
            }, 150);
         }
      };

      const t1 = setTimeout(() => {
         changeText("Loading investment data...");
      }, 1000);

      const t2 = setTimeout(() => {
         changeText("Preparing your experience...");
      }, 1900);

      // Failsafe & connection handling
      let isWindowLoaded = false;
      const checkLoad = () => {
         isWindowLoaded = true;
      };

      if (document.readyState === 'complete') {
         isWindowLoaded = true;
      } else {
         window.addEventListener('load', checkLoad);
      }

      const startFadeOut = () => {
         // Fade out loading text first at 2.5s
         if (loadingTextEl) loadingTextEl.style.opacity = '0';

         // Fade out entire splash at 2.6s (2600ms)
         setTimeout(() => {
            if (splash) {
               splash.style.opacity = '0';
               splash.style.transition = 'opacity 0.4s ease-in-out';
               splash.style.pointerEvents = 'none';
            }
            
            // Mark session flag
            sessionStorage.setItem('splash_shown', 'true');

            // Hide completely at 3.0s (2.6s + 0.4s)
            setTimeout(() => {
               if (splash) splash.style.display = 'none';
            }, 400);
         }, 100);
      };

      const minimumTime = 2500; // Start sequence at 2.5s
      const maxFailsafeTime = 4000;
      let checkInterval: NodeJS.Timeout;
      let failsafeTimeout: NodeJS.Timeout;

      const minTimer = setTimeout(() => {
         if (isWindowLoaded) {
            startFadeOut();
         } else {
            checkInterval = setInterval(() => {
               if (isWindowLoaded) {
                  clearInterval(checkInterval);
                  startFadeOut();
               }
            }, 100);

            failsafeTimeout = setTimeout(() => {
               clearInterval(checkInterval);
               startFadeOut();
            }, maxFailsafeTime - minimumTime);
         }
      }, minimumTime);

      return () => {
         clearTimeout(t1);
         clearTimeout(t2);
         clearTimeout(minTimer);
         if (checkInterval) clearInterval(checkInterval);
         if (failsafeTimeout) clearTimeout(failsafeTimeout);
         window.removeEventListener('load', checkLoad);
      };
   }, []);

   return null;
}
