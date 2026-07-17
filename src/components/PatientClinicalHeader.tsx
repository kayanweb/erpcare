import React from "react";
import { BadgeCheck, Clock, ShieldAlert, User, Activity, AlertTriangle } from "lucide-react";
import { Patient } from "../context/HISContext";

interface Props {
  patient: Patient;
  language: "ar" | "en";
  className?: string;
  showVitals?: boolean;
}

export const PatientClinicalHeader: React.FC<Props> = ({ patient, language, className = "", showVitals = true }) => {
  const isAr = language === "ar";
  
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${className}`} dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative group">
          <img 
            src={`https://i.pravatar.cc/150?u=${patient.id}`} 
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-sm border-2 border-white ring-1 ring-slate-100 object-cover" 
            alt="patient" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white">
            <BadgeCheck className="w-3 h-3" />
          </div>
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-black text-slate-900 truncate">
              {isAr ? patient.nameAr : patient.nameEn}
            </h2>
            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg text-[10px] font-black font-mono border border-indigo-100 shadow-sm uppercase tracking-wider">
              MRN: {patient.mrn || patient.id}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{isAr ? `${patient.age || 45} سنة` : `Age: ${patient.age || 45}`}</span>
              <span className="text-slate-300">•</span>
              <span>{isAr ? (patient.gender === "male" ? "ذكر" : "أنثى") : (patient.gender?.toUpperCase() || "MALE")}</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-600">
                {isAr ? "أخر زيارة: " : "Last Visit: "}
                <span className="font-mono text-indigo-600">2024-05-10</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isAr ? "حساسية: بنسيلين" : "Allergy: Penicillin"}</span>
            </div>
          </div>
        </div>
      </div>

      {showVitals && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          {[
            { label: isAr ? "حرارة" : "TEMP", value: "37.2°C", color: "blue" },
            { label: isAr ? "نبض" : "PULSE", value: "78 bpm", color: "rose" },
            { label: isAr ? "ضغط" : "BP", value: "120/80", color: "indigo" },
            { label: isAr ? "أكسجين" : "SpO2", value: "98%", color: "emerald" },
          ].map((v, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 flex flex-col items-center min-w-[80px]">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{v.label}</span>
              <span className={`text-sm font-black font-mono text-${v.color}-600`}>{v.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
