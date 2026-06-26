import * as fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace WSD wrapper
code = code.replace(/bg-slate-900 text-slate-100 flex flex-col border-b md:border-b-0 md:border-r border-slate-800/g, "bg-[#0a4275] text-white flex flex-col border-b md:border-b-0");

// Replace Header wrapper
code = code.replace(/bg-white\/70 backdrop-blur-xl border-b border-white\/50 flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-4 shadow-\[0_4px_30px_rgba\(0,0,0,0\.05\)\] z-40 text-right transition-all/g, "bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-4 z-40 text-right transition-all");

// Replace top area borders
code = code.replace(/border-b border-slate-800/g, "border-b border-white/10");
code = code.replace(/bg-slate-950\/40/g, "bg-black/10");

// Replace active tabs
const activeRegex = /bg-slate-800 border-[a-z]+-[0-9]+ text-[a-z]+-[0-9]+ font-bold shadow-md( shadow-[a-z]+-[0-9]+\/20)?/g;
code = code.replace(activeRegex, "bg-blue-600 text-white font-bold shadow-md");

// Replace hover tabs
const hoverRegex = /border-transparent text-slate-400 hover:bg-slate-850 hover:text-white hover:border-[a-z]+-[0-9]+/g;
code = code.replace(hoverRegex, "text-slate-300 hover:bg-white/10 hover:text-white");

// Remove border-l-4 from those buttons
code = code.replace(/transition-all border-l-4/g, "transition-all rounded-lg mx-2");

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
