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
const accountRow = "accountRow:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:14,padding:'14px 0',borderTop:'1px solid #eadbd5'},";
const copyBtn = "copyBtn:{border:'1px solid #6e1f2b',background:'#fff',color:'#6e1f2b',padding:'9px 13px',borderRadius:10,cursor:'pointer',fontWeight:700,whiteSpace:'nowrap'},";
while ((s.match(new RegExp(accountRow.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'g')) || []).length > 1) s = s.replace(accountRow, '');
while ((s.match(new RegExp(copyBtn.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'g')) || []).length > 1) s = s.replace(copyBtn, '');
fs.writeFileSync(file, s);
console.log('Fixed injected JSX markers and duplicate storefront patches.');
