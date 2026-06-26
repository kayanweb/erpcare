import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// The Webhook dashboard sections
code = code.replace(/bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4/g, "bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4");
code = code.replace(/bg-slate-950 p-5 rounded-2xl border border-slate-800 text-white font-mono/g, "bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 font-mono");
code = code.replace(/bg-slate-950 p-4 rounded-2xl border border-slate-800/g, "bg-slate-50 p-4 rounded-2xl border border-slate-200");
code = code.replace(/bg-slate-950 border border-slate-900/g, "bg-slate-50 border border-slate-200");

// Text color changes inside Webhook Matrix
code = code.replace(/text-pink-400 uppercase tracking-widest/g, "text-pink-600 uppercase tracking-widest");
code = code.replace(/text-emerald-400/g, "text-emerald-600");

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
