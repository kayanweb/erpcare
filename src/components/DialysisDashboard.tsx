import React, { useState } from "react";
import { 
  Droplet, Calendar, Scale, Activity, 
  AlertTriangle, FileText, CheckCircle2, Clock
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function DialysisDashboard({ language }: Props) {
  const isAr = language === "ar";

  const [sessions] = useState([
    { id: "D-401", patient: "Ahmed Youssef", type: "Hemodialysis", machine: "M-02", time: "08:00 AM", status: "In Progress", duration: "3h 45m" },
    { id: "D-402", patient: "Sarah Ali", type: "Hemodialysis", machine: "M-04", time: "09:30 AM", status: "Preparing", duration: "4h 00m" },
  ]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Droplet className="w-7 h-7 text-blue-600" />
            {isAr ? "قسم الغسيل الكلوي (Dialysis)" : "Hemodialysis Unit"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "إدارة جلسات الديلزة الدموية والصفاقية" : "Manage hemodialysis and peritoneal dialysis sessions"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Activity className="w-5 h-5 text-blue-500" />
                 {isAr ? "جلسات الغسيل الحالية" : "Active Dialysis Sessions"}
               </h3>
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm">
                 {isAr ? "جلسة جديدة" : "New Session"}
               </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold">{isAr ? "المريض" : "Patient"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الماكينة" : "Machine"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الوقت / المدة" : "Time / Duration"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الحالة" : "Status"}</th>
                      <th className="px-4 py-3 font-bold text-center">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessions.map((session, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-bold text-slate-800">{session.patient}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{session.machine}</td>
                        <td className="px-4 py-3 text-slate-600">{session.time} <span className="text-xs bg-slate-100 px-1 rounded ml-1">{session.duration}</span></td>
                        <td className="px-4 py-3">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold ${session.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                             {session.status}
                           </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                           <button onClick={() => toast.info("Weight logged")} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1">
                             <Scale className="w-3 h-3" /> {isAr ? "وزن" : "Weight"}
                           </button>
                           <button onClick={() => toast.info("Complications logged")} className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1">
                             <AlertTriangle className="w-3 h-3" /> {isAr ? "مضاعفات" : "Complications"}
                           </button>
                           <button onClick={() => toast.success("Session finished")} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1.5 rounded text-[10px] font-bold transition">
                             {isAr ? "إنهاء" : "End"}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">{isAr ? "إدارة الجلسات" : "Session Management"}</h3>
             <div className="space-y-3">
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <Scale className="w-5 h-5 text-emerald-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "وزن المريض (قبل وبعد)" : "Pre/Post Weight"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <Droplet className="w-5 h-5 text-blue-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "نوع الغسيل (دموي/صفاقي)" : "Dialysis Type Specs"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <AlertTriangle className="w-5 h-5 text-rose-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "سجل المضاعفات" : "Complications Log"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex items-center gap-3 transition border border-slate-200">
                 <FileText className="w-5 h-5 text-indigo-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "تقرير الجلسة الشامل" : "Comprehensive Report"}</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
