const fs = require('fs');
const glob = require('glob');
// Wait, I can just use purely Node fs traverse since glob might not be installed, but glob is usually available? I don't need glob, I can just traverse recursivly.
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
      callback(path.join(dir, f));
    }
  });
}

walkDir('components', file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/transition-all/g, 'transition');
  newContent = newContent.replace(/group-hover:shadow-\[[^\]]+\]/g, '');
  newContent = newContent.replace(/hover:shadow-\[[^\]]+\]/g, '');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
walkDir('app', file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/transition-all/g, 'transition');
  newContent = newContent.replace(/group-hover:shadow-\[[^\]]+\]/g, '');
  newContent = newContent.replace(/hover:shadow-\[[^\]]+\]/g, '');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
