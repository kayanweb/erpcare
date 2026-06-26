import React from "react";
import { Settings, Bed, Car, WashingMachine, Wrench, Shield, ThermometerSnowflake, Trash2, Zap } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function HospitalOperationsDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  const ops = [
    { title: "Bed Management", icon: Bed, status: "Active", alerts: 2 },
    { title: "Housekeeping", icon: Trash2, status: "Active", alerts: 0 },
    { title: "Laundry & Linen", icon: WashingMachine, status: "Active", alerts: 1 },
    { title: "CSSD (Sterilization)", icon: Shield, status: "Active", alerts: 0 },
    { title: "Biomedical Eng.", icon: Zap, status: "Active", alerts: 4 },
    { title: "Maintenance", icon: Wrench, status: "Active", alerts: 12 },
    { title: "Transport/Ambulance", icon: Car, status: "Active", alerts: 1 },
    { title: "Dietary & Kitchen", icon: ThermometerSnowflake, status: "Active", alerts: 0 },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "العمليات التشغيلية للمستشفى" : "Hospital Operations (Non-Clinical)"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 10 - Facility, Bio-Med, CSSD, Transport
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {ops.map((op, idx) => (
           <div key={idx} className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <op.icon className="w-5 h-5" />
                 </div>
                 {op.alerts > 0 ? (
                   <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-black">
                      {op.alerts}
                   </span>
                 ) : (
                   <span className="w-2 h-2 rounded-full bg-emerald-500" />
                 )}
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">{op.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1">{op.status}</p>
           </div>
         ))}
      </div>

      <div className="mt-8 bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
               <h3 className="text-xl font-black tracking-tight mb-2">Centralized Helpdesk</h3>
               <p className="text-slate-400 font-bold text-sm">Unified ticketing for IT, Maintenance, Bio-Med, and Housekeeping.</p>
            </div>
            <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-900/50 transition-all flex items-center gap-2 whitespace-nowrap">
               <Zap className="w-4 h-4" /> Raise Ticket
            </button>
         </div>
      </div>
    </div>
  );
}
