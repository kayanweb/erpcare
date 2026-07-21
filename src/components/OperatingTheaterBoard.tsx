import React, { createElement, useState, useMemo } from "react";
import { 
  Scissors, Activity, Users, Clock, CheckSquare, ShieldCheck, HeartPulse,
  LayoutDashboard, ListTodo, FileSearch, MoreVertical, ChevronRight,
  ArrowLeft, ArrowRight, Bell, Zap, Eye, FileOutput, Printer, Filter,
  History, Package, MonitorPlay, ShieldAlert, Thermometer, UserPlus,
  Calendar, ClipboardCheck, Timer, Plus, BarChart3, Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";

export default function OperatingTheaterBoard({ language, onClose }: { language: "ar" | "en", onClose?: () => void }) {
  const isAr = language === "ar";
  const { currentUser, patients } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [selectedSurgeryId, setSelectedSurgeryId] = useState<string | null>(null);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "OT Command Center", ar: "مركز قيادة العمليات" },
    { id: "schedule", icon: Calendar, en: "OT Schedule", ar: "جدول العمليات" },
    { id: "intraop", icon: Scissors, en: "Intra-Operative", ar: "أثناء العملية" },
    { id: "pacu", icon: HeartPulse, en: "PACU / Recovery", ar: "الإفاقة" },
    { id: "sterile", icon: ShieldCheck, en: "Sterile Supply", ar: "التعقيم المركزي" },
    { id: "search", icon: FileSearch, en: "Archive Search", ar: "بحث الأرشيف" },
  ];

  const otStats = [
    { label: isAr ? "عمليات جارية" : "In Progress", value: "3", change: "+1", icon: Activity, color: "rose" },
    { label: isAr ? "مجدول اليوم" : "Today's Schedule", value: "12", change: "+2", icon: Calendar, color: "blue" },
    { label: isAr ? "متوسط وقت التجهيز" : "Avg Turnover", value: "22m", change: "-5m", icon: Timer, color: "emerald" },
    { label: isAr ? "جاهزية التعقيم" : "Sterility Ready", value: "98%", change: "stable", icon: ShieldCheck, color: "indigo" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* OT Module Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-rose-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-rose-100 border-2 border-rose-50">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isAr ? "نظام إدارة غرف العمليات (OTIS)" : "Operating Theater Management System"}
              </h1>
              <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-black rounded-full border border-rose-100 uppercase tracking-widest">
                Enterprise Edition v4.2
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-bold text-slate-400">{isAr ? "جدولة الغرف، ملف الجراحة، ومراقبة الإفاقة" : "OR Scheduling, Intra-Op Record & Recovery Monitoring"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {isAr ? "الغرف مراقبة حياً" : "Real-time Telemetry Active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={onClose}
             className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm group shrink-0"
           >
              <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
           </button>
           <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-2xl transition-all shadow-sm">
             <Bell className="w-6 h-6" />
           </button>
           <button className="px-6 py-3 bg-rose-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center gap-2 active:scale-95">
             <Zap className="w-5 h-5 text-rose-200" />
             <span className="hidden lg:block">{isAr ? "بدء جراحة طارئة" : "Emergency Case Start"}</span>
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
         <div className="flex gap-1">
            {mainTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setSelectedSurgeryId(null);
                }}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeMainTab === tab.id ? "text-rose-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeMainTab === tab.id ? "text-rose-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeMainTab === tab.id && (
                  <motion.div layoutId="ot-tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-rose-600 rounded-t-full" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedSurgeryId ? (
             <motion.div 
               key="ot-details"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="h-full flex flex-col"
             >
                <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedSurgeryId(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                      </button>
                      <div className="w-[1px] h-8 bg-slate-200" />
                      <div>
                         <h3 className="text-lg font-black text-slate-800 tracking-tight">{isAr ? "ملف الجراحة الموحد" : "Unified Surgical Record"}</h3>
                         <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{isAr ? "جراحة رقم: " + selectedSurgeryId : "Surgery ID: " + selectedSurgeryId}</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                        {isAr ? "سجل التخدير" : "Anesthesia Log"}
                      </button>
                      <button className="px-6 py-2.5 bg-rose-600 text-white rounded-[14px] text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all">
                        {isAr ? "إنهاء ونقل للإفاقة" : "End & Move to PACU"}
                      </button>
                   </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                   <div className="max-w-5xl mx-auto space-y-6">
                      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">{isAr ? "قائمة أمان الجراحة (WHO)" : "WHO Surgical Safety Checklist"}</h4>
                         <div className="space-y-4">
                            {[
                              "Patient Identity, Site, and Procedure Verified",
                              "Surgical Site Marked (if applicable)",
                              "Anesthesia Safety Check Completed",
                              "Pulse Oximeter on Patient and Functioning",
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                 <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center border border-emerald-200">
                                    <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                                 </div>
                                 <span className="text-sm font-bold text-slate-700">{item}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          ) : (
            <div className="h-full overflow-y-auto no-scrollbar p-8">
               {activeMainTab === "dashboard" && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {otStats.map((stat, i) => (
                         <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                               <div className={`p-4 bg-${stat.color}-50 rounded-2xl border border-${stat.color}-100`}>
                                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                               </div>
                               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : stat.change === 'stable' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                 {stat.change}
                               </span>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                               <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                          <div className="flex justify-between items-center mb-10">
                             <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "مراقبة الغرف المباشرة" : "Live Room Monitoring"}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "الحالة الحالية لغرف العمليات" : "Current Operating Room Utilization"}</p>
                             </div>
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-2xl transition-all"><MoreVertical className="w-6 h-6" /></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {[
                               { room: "OR-1", status: "In Progress", patient: patients[0], time: "01:22:00", type: "Major" },
                               { room: "OR-2", status: "Turnover", patient: null, time: "00:12:00", type: "Cleanup" },
                               { room: "OR-3", status: "In Progress", patient: patients[1], time: "00:45:00", type: "Minor" },
                               { room: "OR-4", status: "Ready", patient: null, time: "Ready", type: "Available" },
                             ].map((room, i) => (
                               <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-rose-100 transition-all cursor-pointer" onClick={() => setSelectedSurgeryId('SURG-980' + i)}>
                                  <div className="flex justify-between items-start mb-4">
                                     <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">{room.room}</h4>
                                     <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${room.status === 'In Progress' ? 'bg-rose-50 text-rose-600' : room.status === 'Ready' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                       {room.status}
                                     </span>
                                  </div>
                                  {room.patient ? (
                                    <div className="space-y-3">
                                       <div>
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                                          <p className="font-black text-slate-800 leading-tight">
                                             <GlobalEntityLink entityId={room.patient.id} entityName={isAr ? room.patient.nameAr : room.patient.nameEn} entityType="patient" isAr={isAr}>
                                                {isAr ? room.patient.nameAr : room.patient.nameEn}
                                             </GlobalEntityLink>
                                          </p>
                                       </div>
                                       <div className="flex justify-between items-center">
                                          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{room.time}</span>
                                          <ChevronRight className="w-4 h-4 text-slate-300" />
                                       </div>
                                    </div>
                                  ) : (
                                    <div className="h-[74px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{room.type}</p>
                                    </div>
                                  )}
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800">
                          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(225,29,72,0.15),transparent)] pointer-events-none" />
                          <div>
                             <div className="flex justify-between items-start mb-10">
                                <h3 className="text-2xl font-black tracking-tight leading-tight uppercase">{isAr ? "إحصائيات الكفاءة" : "Efficiency Metrics"}</h3>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                   <BarChart3 className="w-6 h-6 text-rose-400" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                {[
                                  { label: "On-time Start", val: "88%", color: "emerald" },
                                  { label: "Turnover Time", val: "22m", color: "blue" },
                                  { label: "Cancellation Rate", val: "2.1%", color: "rose" },
                                ].map((m, i) => (
                                  <div key={i} className="space-y-2">
                                     <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                                        <span className={`text-xs font-black text-${m.color}-400`}>{m.val}</span>
                                     </div>
                                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${m.color}-500 w-[70%]`} />
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 mt-10">
                             {isAr ? "تحميل التقرير اليومي" : "Download Daily Report"}
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "schedule" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                       <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                          <div>
                             <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "جدول العمليات الرئيسي" : "Main Surgical Schedule"}</h2>
                             <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "جميع الحالات المجدولة لليوم" : "All cases scheduled for today"}</p>
                          </div>
                          <div className="flex gap-4">
                             <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder={isAr ? "بحث في المواعيد..." : "Search schedule..."} className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none w-64 focus:ring-2 focus:ring-rose-500/20" />
                             </div>
                             <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                                <Plus className="w-4 h-4" />
                                <span>{isAr ? "حجز حالة" : "Book Case"}</span>
                             </button>
                          </div>
                       </div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                   <th className="py-5 px-8">{isAr ? "الوقت" : "Time"}</th>
                                   <th className="py-5 px-8">{isAr ? "الغرفة" : "Room"}</th>
                                   <th className="py-5 px-8">{isAr ? "المريض" : "Patient"}</th>
                                   <th className="py-5 px-8">{isAr ? "الإجراء الجراحي" : "Procedure"}</th>
                                   <th className="py-5 px-8">{isAr ? "الجراح" : "Surgeon"}</th>
                                   <th className="py-5 px-8">{isAr ? "الحالة" : "Status"}</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {[
                                   { time: "08:00", room: "OR-1", patient: patients[0], procedure: "Total Hip Replacement", surgeon: "Dr. Al-Fayed", status: "In Progress" },
                                   { time: "09:30", room: "OR-3", patient: patients[1], procedure: "Laparoscopic Cholecystectomy", surgeon: "Dr. Sarah Khalil", status: "Pre-Op" },
                                   { time: "11:00", room: "OR-2", patient: patients[2], procedure: "Coronary Artery Bypass", surgeon: "Dr. Ahmed Mansour", status: "Scheduled" },
                                   { time: "13:00", room: "OR-1", patient: patients[3], procedure: "Spinal Fusion L4-L5", surgeon: "Dr. Robert Chen", status: "Scheduled" },
                                ].map((s, i) => (
                                   <tr key={i} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => setSelectedSurgeryId('SURG-'+(700+i))}>
                                      <td className="py-5 px-8">
                                         <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-xs font-black text-slate-700">{s.time}</span>
                                         </div>
                                      </td>
                                      <td className="py-5 px-8 font-black text-rose-600 text-xs">{s.room}</td>
                                      <td className="py-5 px-8">
                                         <div>
                                            <p className="text-sm font-black text-slate-800">
                                               <GlobalEntityLink entityId={s.patient.id} entityName={isAr ? s.patient.nameAr : s.patient.nameEn} entityType="patient" isAr={isAr}>
                                                  {isAr ? s.patient.nameAr : s.patient.nameEn}
                                               </GlobalEntityLink>
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.patient.mrn}</p>
                                         </div>
                                      </td>
                                      <td className="py-5 px-8 text-xs font-bold text-slate-600 max-w-[200px] truncate">{s.procedure}</td>
                                      <td className="py-5 px-8 text-xs font-bold text-slate-700">{s.surgeon}</td>
                                      <td className="py-5 px-8">
                                         <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                           s.status === 'In Progress' ? 'bg-rose-100 text-rose-700' : 
                                           s.status === 'Pre-Op' ? 'bg-amber-100 text-amber-700' : 
                                           'bg-slate-100 text-slate-500'
                                         }`}>
                                            {s.status}
                                         </span>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "pacu" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 space-y-6">
                          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
                             <div className="flex justify-between items-center mb-8">
                                <div>
                                   <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "مرضى الإفاقة (PACU)" : "Recovery Monitoring (PACU)"}</h3>
                                   <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "مراقبة العلامات الحيوية بعد الجراحة" : "Post-Operative Vitals & Recovery Progress"}</p>
                                </div>
                                <div className="flex gap-2">
                                   <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100">4 Patients</span>
                                </div>
                             </div>
                             <div className="space-y-4">
                                {[
                                   { patient: patients[0], score: 9, bp: "122/80", hr: 78, spo2: 98, status: "Stable", time: "45m" },
                                   { patient: patients[4], score: 7, bp: "110/65", hr: 92, spo2: 96, status: "Observing", time: "15m" },
                                ].map((p, i) => (
                                   <div key={i} className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-between">
                                      <div className="flex items-center gap-5">
                                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-2 ${p.score >= 9 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                            {p.score}
                                         </div>
                                         <div>
                                            <h4 className="font-black text-slate-800 text-base leading-tight">
                                               <GlobalEntityLink entityId={p.patient.id} entityName={isAr ? p.patient.nameAr : p.patient.nameEn} entityType="patient" isAr={isAr}>
                                                  {isAr ? p.patient.nameAr : p.patient.nameEn}
                                               </GlobalEntityLink>
                                            </h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ALDRETE SCORE • {p.time} IN PACU</p>
                                         </div>
                                      </div>
                                      <div className="flex gap-8">
                                         <div className="text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">BP</p>
                                            <p className="font-black text-slate-700 text-sm">{p.bp}</p>
                                         </div>
                                         <div className="text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">HR</p>
                                            <p className="font-black text-slate-700 text-sm">{p.hr}</p>
                                         </div>
                                         <div className="text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">SpO2</p>
                                            <p className="font-black text-emerald-600 text-sm">{p.spo2}%</p>
                                         </div>
                                      </div>
                                      <button className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                                         {isAr ? "تخريج للجناح" : "Discharge to Ward"}
                                      </button>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">{isAr ? "تحكم الإفاقة" : "PACU Controls"}</h4>
                          <div className="space-y-4">
                             <button className="w-full p-6 bg-slate-900 text-white rounded-[32px] flex items-center justify-between group hover:bg-black transition-all">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                      <UserPlus className="w-6 h-6 text-rose-400" />
                                   </div>
                                   <div className="text-left">
                                      <p className="text-xs font-black uppercase tracking-widest">{isAr ? "استلام مريض" : "Handover In"}</p>
                                      <p className="text-[10px] text-slate-400">{isAr ? "من غرفة العمليات" : "Receive from OR"}</p>
                                   </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all" />
                             </button>
                             <button className="w-full p-6 bg-rose-50 text-rose-700 border border-rose-100 rounded-[32px] flex items-center justify-between group hover:bg-rose-100 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-rose-200/50 rounded-2xl flex items-center justify-center">
                                      <ShieldAlert className="w-6 h-6 text-rose-600" />
                                   </div>
                                   <div className="text-left">
                                      <p className="text-xs font-black uppercase tracking-widest">{isAr ? "تنبيه سريري" : "Clinical Alert"}</p>
                                      <p className="text-[10px] text-rose-500">{isAr ? "إبلاغ الطبيب فوراً" : "Notify Physician STAT"}</p>
                                   </div>
                                </div>
                             </button>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "intraop" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                       <div className="flex justify-between items-center mb-10">
                          <div>
                             <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "مراقبة العمليات الجارية" : "Live Intra-Operative Monitor"}</h3>
                             <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "متابعة الأحداث الجراحية والمقاييس الحيوية" : "Tracking surgical events and physiological metrics"}</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="flex -space-x-3">
                                {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">DR</div>)}
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الفريق الجراحي" : "Surgical Team"}</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                          <div className="lg:col-span-3 space-y-6">
                             <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                   { label: "O2 Sat", val: "99%", color: "emerald", icon: Activity },
                                   { label: "Heart Rate", val: "72", color: "rose", icon: HeartPulse },
                                   { label: "Temp", val: "36.8°C", color: "blue", icon: Thermometer },
                                   { label: "Duration", val: "01:24:00", color: "slate", icon: Clock },
                                ].map((v, i) => (
                                   <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center text-center">
                                      <v.icon className={`w-5 h-5 text-${v.color}-600 mb-2`} />
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{v.label}</p>
                                      <p className="text-xl font-black text-slate-800">{v.val}</p>
                                   </div>
                                ))}
                             </div>
                             <div className="bg-slate-900 rounded-[32px] p-8 text-white h-48 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,29,72,0.1),transparent)]" />
                                <div className="flex gap-2 items-end h-20">
                                   {[20, 40, 15, 60, 25, 45, 10, 30, 80, 20, 40, 15, 60, 25].map((h, i) => (
                                      <motion.div key={i} animate={{ height: [`${h}%`, `${h*0.8}%`, `${h}%`] }} transition={{ repeat: Infinity, duration: 2, delay: i*0.1 }} className="w-2 bg-rose-500/40 rounded-full" />
                                   ))}
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                   <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? "مراقبة حية ECG" : "Live ECG Stream"}</span>
                                </div>
                             </div>
                          </div>
                          <div className="bg-slate-50 rounded-[32px] border border-slate-100 p-8">
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{isAr ? "سجل الأحداث" : "Surgical Event Log"}</h4>
                             <div className="space-y-4">
                                {[
                                   { time: "08:12", msg: "Incision Made" },
                                   { time: "08:45", msg: "Cautery Start" },
                                   { time: "09:10", msg: "Implant Verified" },
                                ].map((ev, i) => (
                                   <div key={i} className="flex gap-4">
                                      <span className="text-[10px] font-black text-rose-600 font-mono">{ev.time}</span>
                                      <span className="text-[10px] font-bold text-slate-600 uppercase">{ev.msg}</span>
                                   </div>
                                ))}
                             </div>
                             <button className="w-full mt-10 py-3 bg-white border border-slate-200 text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                {isAr ? "إضافة ملاحظة" : "Add Event Note"}
                             </button>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "sterile" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                       <div className="flex justify-between items-center mb-10">
                          <div>
                             <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "إدارة التعقيم المركزي (CSSD)" : "Sterile Supply Management"}</h3>
                             <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "تتبع دورة تعقيم الآلات الجراحية" : "Tracking surgical instrument sterilization cycles"}</p>
                          </div>
                          <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-100">
                             <Package className="w-4 h-4" />
                             <span>{isAr ? "طلب طقم أدوات" : "Request Tray"}</span>
                          </button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                             { name: "Ortho Hip Set A", status: "Sterile", expiry: "2025-07-25", location: "OT Storage 2" },
                             { name: "Laparoscopic Set 4", status: "In Cycle", expiry: "Pending", location: "CSSD Unit" },
                             { name: "Major Vascular Tray", status: "Cooling", expiry: "2025-07-21", location: "CSSD Unit" },
                          ].map((tray, i) => (
                             <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col justify-between group hover:bg-white hover:shadow-xl transition-all">
                                <div>
                                   <div className="flex justify-between items-start mb-6">
                                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                                         <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                      </div>
                                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${tray.status === 'Sterile' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                         {tray.status}
                                      </span>
                                   </div>
                                   <h4 className="font-black text-slate-800 text-lg mb-1">{tray.name}</h4>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">LOC: {tray.location}</p>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                   <div>
                                      <p className="text-[8px] font-black text-slate-400 uppercase">{isAr ? "تاريخ الانتهاء" : "EXPIRY DATE"}</p>
                                      <p className="text-[10px] font-black text-slate-700">{tray.expiry}</p>
                                   </div>
                                   <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                                      <MoreVertical className="w-5 h-5" />
                                   </button>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "search" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                       <div className="max-w-2xl mx-auto text-center mb-12">
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{isAr ? "أرشيف الجراحة الذكي" : "Smart Surgical Archive"}</h3>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                             {isAr ? "البحث في تاريخ العمليات، سجلات التخدير، وتقارير ما بعد الجراحة" : "Search surgical history, anesthesia logs, and post-operative reports"}
                          </p>
                       </div>
                       <div className="max-w-3xl mx-auto flex flex-col gap-8">
                          <div className="relative">
                             <Search className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-rose-500" />
                             <input 
                                type="text" 
                                placeholder={isAr ? "ابحث برقم العملية، المريض، أو الجراح..." : "Search by Surgery ID, Patient, or Surgeon..."} 
                                className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] text-lg font-bold outline-none focus:border-rose-500/30 focus:bg-white transition-all shadow-inner"
                             />
                             <button className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-3 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all">
                                {isAr ? "بحث أرشيفي" : "Search Archive"}
                             </button>
                          </div>
                          <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                             {[
                                { label: isAr ? "جراحات العظام" : "Orthopedics", icon: Scissors },
                                { label: isAr ? "القلب والصدر" : "Cardiothoracic", icon: HeartPulse },
                                { label: isAr ? "المناظير" : "Laparoscopic", icon: MonitorPlay },
                                { label: isAr ? "سجلات التخدير" : "Anesthesia", icon: History },
                             ].map((cat, i) => (
                                <button key={i} className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-rose-500/50 hover:shadow-xl transition-all flex flex-col items-center gap-3 group">
                                   <cat.icon className="w-8 h-8 text-slate-300 group-hover:text-rose-600 transition-colors" />
                                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-rose-600">{cat.label}</span>
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}
            </div>
         )}
      </AnimatePresence>
      </div>
    </div>
  );
}
