import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace dark container of security vault
code = code.replace(/bg-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-6 text-right border border-pink-900\/30/g, "bg-white text-slate-800 p-6 rounded-2xl shadow-sm space-y-6 text-right border border-slate-200");

// Replace its header border and titles
code = code.replace(/border-white\/10 pb-4/g, "border-slate-100 pb-4");
code = code.replace(/text-pink-100/g, "text-slate-900");

// Replace inner containers
code = code.replace(/bg-slate-950\/65/g, "bg-slate-50");
code = code.replace(/bg-slate-950\/70/g, "bg-slate-50");
code = code.replace(/border border-white\/5/g, "border border-slate-100");
code = code.replace(/border border-white\/15/g, "border border-slate-100");

// Replace text colors
code = code.replace(/text-pink-300/g, "text-pink-600");
code = code.replace(/text-slate-400/g, "text-slate-500");

// Input background replacements
code = code.replace(/bg-slate-900 border border-slate-750 text-white/g, "bg-white border border-slate-200 text-slate-800");
code = code.replace(/bg-slate-950 border border-slate-750 text-white/g, "bg-white border border-slate-200 text-slate-800");

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
