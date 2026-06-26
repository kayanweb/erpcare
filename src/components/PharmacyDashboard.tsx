import React from "react";
import { Pill, Activity, Box, RotateCcw, AlertTriangle, Syringe } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function PharmacyDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <Pill className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "إدارة الصيدلية" : "Pharmacy Management"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 6 - Dispensing, Clinical Pharmacy, Inventory, IV Prep
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {[
           { title: "Pending Prescriptions", value: "42", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
           { title: "Low Stock Alerts", value: "15", icon: Box, color: "text-amber-600", bg: "bg-amber-50" },
           { title: "Narcotics Audit", value: "Pending", icon: Shield, color: "text-rose-600", bg: "bg-rose-50" },
           { title: "IV Prep Queue", value: "8", icon: Syringe, color: "text-indigo-600", bg: "bg-indigo-50" },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                 <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <RotateCcw className="w-5 h-5 text-indigo-500" />
               Clinical Pharmacy Queue
            </h3>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-y border-slate-100">
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alerts</th>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/50">
                     <td className="p-4 font-bold text-sm text-slate-800">John Doe (MRN: 10293)</td>
                     <td className="p-4 text-xs font-bold text-slate-600">Vancomycin 1g IV</td>
                     <td className="p-4"><span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-1 rounded uppercase">IV Prep</span></td>
                     <td className="p-4">
                        <span className="flex items-center gap-1 text-amber-600 text-[10px] font-black uppercase">
                           <AlertTriangle className="w-3 h-3" /> Renal Adj. Needed
                        </span>
                     </td>
                     <td className="p-4">
                        <button className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors">Verify</button>
                     </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                     <td className="p-4 font-bold text-sm text-slate-800">Sarah Smith (MRN: 10294)</td>
                     <td className="p-4 text-xs font-bold text-slate-600">Morphine 5mg IV</td>
                     <td className="p-4"><span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-1 rounded uppercase">Narcotic</span></td>
                     <td className="p-4"><span className="text-slate-400 text-xs">-</span></td>
                     <td className="p-4">
                        <button className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors">Dispense</button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
  );
}
