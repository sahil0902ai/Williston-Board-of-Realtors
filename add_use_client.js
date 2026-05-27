const fs = require('fs');
const files = [
  'components/CookieConsent.tsx',
  'components/Header.tsx',
  'components/dashboard/WalletTab.tsx',
  'components/dashboard/TopBar.tsx',
  'components/dashboard/ReferralTab.tsx',
  'components/dashboard/WithdrawTab.tsx',
  'components/dashboard/DepositTab.tsx',
  'components/dashboard/MyInvestmentsTab.tsx',
  'components/Rentals.tsx',
  'components/FAQ.tsx',
  'components/Hero.tsx',
  'components/Stats.tsx',
  'components/ScrollToTop.tsx',
  'components/Testimonials.tsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if(!content.includes('"use client"') && !content.includes("'use client'")) {
    fs.writeFileSync(f, '"use client";\n' + content);
  }
});
