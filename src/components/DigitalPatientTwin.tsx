import React, { useState } from 'react';
import { 
  User, Activity, HeartPulse, Dna, Clock, Database, 
  Watch, Stethoscope, Video, FileText, Zap
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

export const DigitalPatientTwin: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  
  return (
    <div className={`p-4 h-[calc(100vh-4rem)] bg-slate-50 flex flex-col space-y-4 overflow-auto ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src="https://i.pravatar.cc/150?img=11" alt="Patient" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
              <Activity className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Ahmed Hassan</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
              <span>55 YRS</span>
              <span>•</span>
              <span>MALE</span>
              <span>•</span>
              <span className="font-mono text-indigo-600 font-bold">MRN: 9982431</span>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Hypertension</span>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Type 2 DM</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="text-center px-4 border-r border-slate-200 last:border-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">AI Risk Score</p>
            <p className="text-2xl font-black text-amber-500">42%</p>
          </div>
          <div className="text-center px-4 border-r border-slate-200 last:border-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Code Status</p>
            <p className="text-sm font-bold text-emerald-600 mt-2">FULL CODE</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        
        {/* Timeline (Left Column) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            {isAr ? "الجدول الزمني الطبي" : "Medical Timeline"}
          </h3>
          <div className="flex-1 relative">
            <div className={`absolute top-0 bottom-0 w-0.5 bg-slate-100 ${isAr ? 'right-4' : 'left-4'}`}></div>
            <div className="space-y-6">
              {[
                { date: "Today, 09:30 AM", title: "ER Admission", desc: "Chest pain", icon: Activity, color: "bg-rose-500" },
                { date: "Oct 12, 2025", title: "Cardiology Visit", desc: "Routine checkup. Meds adjusted.", icon: Stethoscope, color: "bg-indigo-500" },
                { date: "Mar 05, 2024", title: "Lab Results", desc: "HbA1c 7.2%", icon: Database, color: "bg-teal-500" },
              ].map((event, i) => (
                <div key={i} className={`relative flex gap-4 ${isAr ? 'pr-12' : 'pl-12'}`}>
                  <div className={`absolute top-0 ${isAr ? 'right-2' : 'left-2'} w-5 h-5 rounded-full ${event.color} border-4 border-white shadow-sm flex items-center justify-center`}></div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{event.date}</span>
                    <h4 className="font-bold text-sm text-slate-800">{event.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live IoT & Vitals (Middle Column) */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 text-white flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>
          <h3 className="font-bold text-emerald-400 mb-6 flex items-center gap-2">
            <Watch className="w-5 h-5" />
            {isAr ? "الحيوية والأجهزة المترابطة (Live)" : "Live Vitals & IoT Stream"}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-mono mb-1">HEART RATE</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-rose-400">88</span>
                <span className="text-xs text-rose-400/50 mb-1 font-mono">bpm</span>
              </div>
              <HeartPulse className="w-full h-8 text-rose-500/20 mt-2" />
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-mono mb-1">SpO2</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-cyan-400">98</span>
                <span className="text-xs text-cyan-400/50 mb-1 font-mono">%</span>
              </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-mono mb-1">BLOOD PRESSURE</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-emerald-400">135/85</span>
              </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center">
              <Watch className="w-6 h-6 text-slate-600 mb-2" />
              <p className="text-[10px] text-slate-500 font-mono">APPLE WATCH SYNCED</p>
              <p className="text-xs text-emerald-500">Active</p>
            </div>
          </div>
        </div>

        {/* AI Knowledge Graph & Summary (Right Column) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            {isAr ? "التحليل بالذكاء الاصطناعي" : "AI Synthesis"}
          </h3>
          
          <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-900 mb-4 font-medium leading-relaxed border border-indigo-100">
            "Patient is a 55-year-old male with a history of poorly controlled Type 2 Diabetes and Hypertension. Current presentation of chest pain requires immediate cardiac workup. Note: Patient is on Metformin; hold if contrast CT is ordered to prevent lactic acidosis risk."
          </div>

          <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center items-center text-center">
             <Dna className="w-10 h-10 text-slate-300 mb-3" />
             <h4 className="font-bold text-slate-700 text-sm">{isAr ? "مخطط المعرفة الطبي" : "Knowledge Graph"}</h4>
             <p className="text-xs text-slate-500 mt-2 max-w-[200px]">
               {isAr ? "ربط الأمراض المزمنة، الأدوية، والجينات الوراثية" : "Linking chronic conditions, current meds, and genetic predispositions"}
             </p>
             <button className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
               View Graph
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DigitalPatientTwin;
