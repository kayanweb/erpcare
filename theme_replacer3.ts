import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// The CISO CONSOLE dashboard sections
code = code.replace(/bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4/g, "bg-white text-slate-800 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4");
code = code.replace(/bg-slate-100 pb-4/g, "border-slate-200 pb-4"); // Note: already slate-100, wait, keeping it slate-100 is fine
code = code.replace(/text-slate-100 flex items-center/g, "text-slate-900 flex items-center");

// Emergency global lockdown container
code = code.replace(/bg-red-955/g, "bg-red-50");
code = code.replace(/bg-red-950/g, "bg-red-50");
code = code.replace(/border-red-900\/60/g, "border-red-200");

// The inputs and smaller containers in CISO Console
code = code.replace(/bg-slate-900\/60/g, "bg-slate-50");
code = code.replace(/border border-slate-850/g, "border border-slate-200");
code = code.replace(/border border-slate-800/g, "border border-slate-200");
code = code.replace(/bg-slate-900/g, "bg-slate-50");

// The other panel at 18044: Clinical Templates Architecture
code = code.replace(/bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col/g, "bg-white text-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col");

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
