import React from "react";
import { Brain, Baby, Syringe, Eye, HeartPulse, Stethoscope, Microscope, Sparkles } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function SpecializedModulesDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  const modules = [
    { title: "Psychiatry & Mental Health", icon: Brain, status: "Active", patients: 45, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "IVF & Fertility", icon: Baby, status: "Active", patients: 12, color: "text-pink-600", bg: "bg-pink-50" },
    { title: "Dentistry", icon: Sparkles, status: "Active", patients: 28, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Ophthalmology", icon: Eye, status: "Active", patients: 34, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Cardiology (Cath Lab)", icon: HeartPulse, status: "Active", patients: 15, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Dermatology", icon: Microscope, status: "Active", patients: 42, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "ENT", icon: Stethoscope, status: "Active", patients: 21, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Pain Management", icon: Syringe, status: "Active", patients: 18, color: "text-slate-600", bg: "bg-slate-50" },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "العيادات التخصصية" : "Specialized Clinical Modules"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 8 - Dedicated Workflows for Specific Specialties
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {modules.map((mod, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                 <div className={`w-12 h-12 rounded-xl ${mod.bg} flex items-center justify-center ${mod.color} group-hover:scale-110 transition-transform`}>
                    <mod.icon className="w-6 h-6" />
                 </div>
                 <div className="text-right">
                    <span className="text-xl font-black text-slate-900">{mod.patients}</span>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patients</p>
                 </div>
              </div>
              <h3 className="text-sm font-black text-slate-800 mb-1">{mod.title}</h3>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 {mod.status}
              </p>
           </div>
         ))}
      </div>
    </div>
  );
}
