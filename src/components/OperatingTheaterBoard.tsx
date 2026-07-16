import React, { useState, useMemo } from "react";
import { 
  Scissors, Activity, Users, Clock, CheckSquare, ShieldCheck, HeartPulse,
  LayoutDashboard, ListTodo, FileSearch, MoreVertical, ChevronRight,
  ArrowLeft, ArrowRight, Bell, Zap, Eye, FileOutput, Printer, Filter,
  History, Package, MonitorPlay, ShieldAlert, Thermometer, UserPlus,
  Calendar, ClipboardCheck, Timer, Plus
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

               {["schedule", "intraop", "pacu", "sterile", "search"].includes(activeMainTab) && (
                 <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
                    <div className="w-32 h-32 bg-rose-50 rounded-[48px] flex items-center justify-center shadow-inner border border-rose-100">
                       {mainTabs.find(t => t.id === activeMainTab)?.icon && React.createElement(mainTabs.find(t => t.id === activeMainTab)!.icon, { className: "w-16 h-16 text-rose-300" })}
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{isAr ? "مزامنة الأنظمة" : "OT System Sync"}</h2>
                       <p className="text-slate-400 font-bold max-w-md mx-auto mt-4 leading-relaxed uppercase tracking-widest text-sm">
                         {isAr ? "يتم الآن ربط موديول " + activeMainTab + " ضمن نظام غرف العمليات الموحد" : "Linking " + activeMainTab + " data layer into the unified OR framework"}
                       </p>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" />
                       <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                       <div className="w-2 h-2 bg-rose-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                 </div>
               )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const BarChart3 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);
