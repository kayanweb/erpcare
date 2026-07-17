import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix invisible text from previous replacements
code = code.replace(/bg-slate-50 text-white p-4 rounded-xl border border-pink-500\/20/g, "bg-slate-50 text-slate-800 p-4 rounded-xl border border-slate-200");
code = code.replace(/bg-slate-50 px-5 py-3.5 text-white/g, "bg-slate-50 px-5 py-3.5 text-slate-800");
code = code.replace(/bg-slate-50 hover:bg-slate-800 text-white/g, "bg-slate-800 hover:bg-slate-900 text-white");
code = code.replace(/bg-slate-50 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-pink-600 mb-6 mt-4 mx-4/g, "bg-white text-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 mt-4 mx-4");
code = code.replace(/<td className="p-2.5 font-bold text-white text-right">/g, "<td className=\"p-2.5 font-bold text-slate-800 text-right\">");

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
