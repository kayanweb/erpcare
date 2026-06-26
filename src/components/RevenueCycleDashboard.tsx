import React from "react";
import { CircleDollarSign, Receipt, FileCheck, Landmark, CreditCard, Activity } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function RevenueCycleDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <CircleDollarSign className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "دورة الإيرادات والتأمين" : "Revenue Cycle Management (RCM)"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 11 - Eligibility, Coding, Claims, Collections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <RCMStatCard title="Total Claims Generated" value="1,245" trend="+5.2%" isGood={true} icon={Receipt} />
         <RCMStatCard title="Clean Claim Rate" value="96.8%" trend="+1.1%" isGood={true} icon={FileCheck} />
         <RCMStatCard title="Denial Rate" value="4.2%" trend="-0.5%" isGood={true} icon={Activity} />
         <RCMStatCard title="A/R Days" value="28" trend="+2 days" isGood={false} icon={Landmark} />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <CreditCard className="w-5 h-5 text-indigo-500" />
               Claims Processing Queue
            </h3>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Run Batch Process</button>
         </div>
         <div className="p-8 text-center bg-slate-50/50 min-h-[300px] flex flex-col items-center justify-center">
            <CircleDollarSign className="w-16 h-16 text-slate-200 mb-4" />
            <h4 className="text-lg font-black text-slate-700 mb-2">Automated Coding Engine Active</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest max-w-md mx-auto mb-6 leading-relaxed">
               Mapping ICD-10 and CPT codes from clinical documentation using AI. DRG grouping is calculating optimally.
            </p>
            <div className="flex gap-4">
               <div className="px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900">342</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Pending Coding</span>
               </div>
               <div className="px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <span className="text-2xl font-black text-indigo-600">89</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Ready to Bill</span>
               </div>
               <div className="px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <span className="text-2xl font-black text-rose-600">12</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Denial Resubmissions</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function RCMStatCard({ title, value, trend, isGood, icon: Icon }: any) {
   return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
               <Icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isGood ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
               {trend}
            </span>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
         <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
   );
}
