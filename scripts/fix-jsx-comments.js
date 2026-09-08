const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'app', 'page.tsx');
let s = fs.readFileSync(file, 'utf8');
s = s.replace('<!-- FLORAL_WELCOME_ASSISTANT -->', '{/* FLORAL_WELCOME_ASSISTANT */}');
s = s.replace('<!-- FLORAL_CHAT_ASSISTANT -->', '{/* FLORAL_CHAT_ASSISTANT */}');
let seenCopy = false;
s = s.split('\n').filter(line => {
  if (line.includes('const copyAccount=async()=>')) {
    if (seenCopy) return false;
    seenCopy = true;
  }
  return true;
}).join('\n');
fs.writeFileSync(file, s);
console.log('Fixed injected JSX markers and duplicate storefront patches.');
