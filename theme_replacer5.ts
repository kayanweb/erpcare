import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix invisible text from previous replacements
code = code.replace(/bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-300/g, "bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800");
code = code.replace(/bg-slate-50 hover:bg-slate-850 border border-slate-200 text-\[11px\] font-bold rounded-lg transition text-slate-300 hover:text-white/g, "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold rounded-lg transition text-slate-800 hover:text-indigo-700");
code = code.replace(/<footer className="no-print bg-slate-50 border-t border-slate-800 text-slate-300 py-4/g, "<footer className=\"no-print bg-white border-t border-slate-200 text-slate-600 py-4");
code = code.replace(/<p className="text-slate-300">/g, "<p className=\"text-slate-700\">");

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
