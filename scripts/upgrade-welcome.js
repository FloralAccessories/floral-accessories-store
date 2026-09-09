const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'app', 'page.tsx');
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('fa-welcome-grand')) {
  const css = `
@keyframes faWelcomeGrand{0%{opacity:0;transform:translate(-50%,-50%) scale(.15) rotate(-18deg)}45%{opacity:1;transform:translate(-50%,-50%) scale(1.28) rotate(4deg)}68%{transform:translate(-50%,-50%) scale(.94) rotate(-2deg)}82%{transform:translate(-50%,-50%) scale(1.06)}100%{opacity:0;transform:translate(-50%,-50%) scale(.72)}}
@keyframes faBubbleRise{0%{opacity:0;transform:translateY(20px) scale(.5)}15%{opacity:1;transform:translateY(0) scale(1)}75%{opacity:.9}100%{opacity:0;transform:translateY(-125px) scale(.82)}}
.fa-welcome-grand{position:fixed;left:50%;top:50%;width:min(360px,72vw);height:min(430px,72vh);z-index:200;pointer-events:none;animation:faWelcomeGrand 2.35s cubic-bezier(.2,.8,.2,1) forwards}
.fa-welcome-grand svg{width:100%;height:100%;filter:drop-shadow(0 24px 35px rgba(50,15,25,.25))}
.fa-welcome-burst{position:fixed;left:50%;top:50%;z-index:199;pointer-events:none}
.fa-rise-bubble{position:absolute;left:calc(var(--x)*1px);top:calc(var(--y)*1px);padding:8px 13px;border-radius:999px;background:#fff;border:1px solid #eadbd5;box-shadow:0 10px 25px rgba(50,20,25,.12);color:#6e1f2b;font:800 12px Arial,sans-serif;white-space:nowrap;animation:faBubbleRise 2.8s ease-out var(--delay) both}
@media(max-width:700px){.fa-welcome-grand{width:290px;height:350px}.fa-rise-bubble{font-size:10px;padding:7px 10px}}
`;
  s = s.replace('<style jsx global>{`', '<style jsx global>{`' + css);

  const marker = '{/* FLORAL_WELCOME_ASSISTANT */}';
  const markerIndex = s.indexOf(marker);
  if (markerIndex >= 0) {
    const grand = `<div className="fa-welcome-grand" aria-hidden="true"><svg viewBox="0 0 140 180"><circle cx="70" cy="72" r="31" fill="#f2c5a5"/><path d="M39 73c-6-31 9-49 32-49 25 0 37 21 28 49-6-10-9-23-10-31-11 12-27 17-50 14Z" fill="#342027"/><path d="M44 68c-2 21 5 35 26 35s28-14 26-35c-7 7-16 11-27 11S51 75 44 68Z" fill="#f2c5a5"/><ellipse cx="59" cy="73" rx="2.5" ry="3" fill="#32151b"/><ellipse cx="81" cy="73" rx="2.5" ry="3" fill="#32151b"/><path d="M63 87q7 6 14 0" fill="none" stroke="#a44a59" strokeWidth="2.5" strokeLinecap="round"/><path d="M43 117q-18 8-24 27M97 117q18-10 23-28" fill="none" stroke="#f2c5a5" strokeWidth="11" strokeLinecap="round"/><circle cx="121" cy="88" r="7" fill="#f2c5a5"/><path d="M38 163c2-31 10-52 32-55 22 3 30 24 32 55Z" fill="#6e1f2b"/><path d="M43 119c7 9 15 14 27 14s20-5 27-14l7 44H36Z" fill="#8b3042"/><circle cx="70" cy="110" r="8" fill="#d8aa55"/><circle cx="70" cy="110" r="3" fill="#fff5d8"/><path d="M57 159v10M83 159v10" stroke="#f2c5a5" strokeWidth="9" strokeLinecap="round"/><path d="M51 169h13M76 169h13" stroke="#32151b" strokeWidth="6" strokeLinecap="round"/></svg></div><div className="fa-welcome-burst" aria-hidden="true"><span className="fa-rise-bubble" style={{'--x':-120,'--y':20,'--delay':'.05s'}}>Welcome! 💕</span><span className="fa-rise-bubble" style={{'--x':55,'--y':15,'--delay':'.25s'}}>Hi beautiful! ✨</span><span className="fa-rise-bubble" style={{'--x':-30,'--y':75,'--delay':'.45s'}}>Happy shopping! 🛍️</span><span className="fa-rise-bubble" style={{'--x':90,'--y':80,'--delay':'.65s'}}>💎✨💕</span></div>`;
    s = s.slice(0, markerIndex + marker.length) + grand + s.slice(markerIndex + marker.length);
  }
  fs.writeFileSync(file, s);
}
