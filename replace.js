const fs = require('fs');

const files = [
  'components/dashboard/Sidebar.tsx',
  'components/dashboard/TopBar.tsx',
  'components/Hero.tsx',
  'components/RealEstateListings.tsx',
  'components/About.tsx',
  'components/Rentals.tsx',
  'components/MobileBottomNav.tsx',
  'app/properties/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/backdrop-blur-[a-z]*/g, '');
  content = content.replace(/bg-navy\/[0-9]+/g, 'bg-[rgba(4,9,26,0.97)]');
  content = content.replace(/bg-white\/[0-9]+/g, 'bg-[rgba(255,255,255,0.05)]');
  content = content.replace(/animate-float-delayed/g, '');
  content = content.replace(/animate-float/g, '');
  content = content.replace(/animate-pulse/g, '');
  content = content.replace(/animate-spin/g, '');
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
