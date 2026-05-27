const fs = require('fs');
const files = [
  'app/calculator/page.tsx',
  'app/dashboard/page.tsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if(!content.includes('"use client"') && !content.includes("'use client'")) {
    fs.writeFileSync(f, '"use client";\n' + content);
  }
});
