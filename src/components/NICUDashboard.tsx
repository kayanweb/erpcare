import React, { useState } from "react";
import { 
  Baby, Activity, Scale, Syringe, HeartPulse, 
  ThermometerSnowflake, FileText, Beaker, Plus
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function NICUDashboard({ language }: Props) {
  const isAr = language === "ar";

  const [neonates] = useState([
    { id: "N-101", name: "Baby Boy Smith", motherMrn: "M-4821", weight: "1.2 kg", incubator: "Inc-01", status: "Critical", o2: "92%", hr: "145" },
    { id: "N-102", name: "Baby Girl Doe", motherMrn: "M-3910", weight: "2.1 kg", incubator: "Inc-04", status: "Stable", o2: "98%", hr: "120" },
  ]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Baby className="w-7 h-7 text-pink-500" />
            {isAr ? "العناية المركزة لحديثي الولادة (NICU)" : "Neonatal ICU (NICU)"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "مراقبة الحاضنات ورعاية المبتسرين" : "Incubator monitoring and premature care"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> {isAr ? "تسجيل مولود جديد" : "Register Newborn"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{isAr ? "قائمة الأطفال بالحضانات" : "Neonates in Incubators"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {neonates.map(baby => (
                <div key={baby.id} className={`border rounded-xl p-4 ${baby.status === 'Critical' ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800">{baby.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">ID: {baby.id} | Mother: {baby.motherMrn}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${baby.status === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {baby.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                       <Scale className="w-4 h-4 text-amber-500" />
                       <div className="flex flex-col">
                         <span className="text-[9px] text-slate-400 uppercase font-bold">Weight</span>
                         <span className="text-xs font-bold text-slate-700">{baby.weight}</span>
                       </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                       <ThermometerSnowflake className="w-4 h-4 text-blue-500" />
                       <div className="flex flex-col">
                         <span className="text-[9px] text-slate-400 uppercase font-bold">Incubator</span>
                         <span className="text-xs font-bold text-slate-700">{baby.incubator}</span>
                       </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                       <HeartPulse className="w-4 h-4 text-rose-500" />
                       <div className="flex flex-col">
                         <span className="text-[9px] text-slate-400 uppercase font-bold">HR</span>
                         <span className="text-xs font-bold text-slate-700">{baby.hr} bpm</span>
                       </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                       <Activity className="w-4 h-4 text-cyan-500" />
                       <div className="flex flex-col">
                         <span className="text-[9px] text-slate-400 uppercase font-bold">SpO2</span>
                         <span className="text-xs font-bold text-slate-700">{baby.o2}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
                    <button onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Feeding logged", titleAr: "Feeding logged", type: "form" } }))} className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1.5 rounded transition flex items-center gap-1">
                       <Baby className="w-3 h-3" /> {isAr ? "تغذية" : "Feed"}
                    </button>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Weight logged", titleAr: "Weight logged", type: "form" } }))} className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-2 py-1.5 rounded transition flex items-center gap-1">
                       <Scale className="w-3 h-3" /> {isAr ? "وزن" : "Weight"}
                    </button>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Meds administered", titleAr: "Meds administered", type: "form" } }))} className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-1.5 rounded transition flex items-center gap-1">
                       <Syringe className="w-3 h-3" /> {isAr ? "أدوية" : "Meds"}
                    </button>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "PKU Test ordered", titleAr: "PKU Test ordered", type: "form" } }))} className="text-[10px] bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold px-2 py-1.5 rounded transition flex items-center gap-1">
                       <Beaker className="w-3 h-3" /> {isAr ? "فحوصات (PKU)" : "Tests"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">{isAr ? "إجراءات الحضانة السريعة" : "NICU Quick Actions"}</h3>
            <div className="flex flex-col gap-3">
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-500" />
                <span className="text-sm">{isAr ? "مراقبة الحاضنة (Incubator Log)" : "Incubator Monitoring"}</span>
              </button>
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex items-center gap-3">
                <Baby className="w-5 h-5 text-pink-500" />
                <span className="text-sm">{isAr ? "ربط بملف الأم" : "Link to Mother's File"}</span>
              </button>
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex items-center gap-3">
                <Syringe className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">{isAr ? "جدول التطعيمات" : "Vaccination Schedule"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
