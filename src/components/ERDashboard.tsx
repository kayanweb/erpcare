import React, { createElement, useState, useMemo, useEffect } from "react";
import { 
  Search, Plus, Clock, AlertCircle, Edit, Activity, HeartPulse, Stethoscope, 
  Users, Bed, Eye, Bell, ListTodo, FileOutput, ShieldAlert, LayoutDashboard,
  FileSearch, BarChart3, MoreVertical, ChevronRight, Printer, Zap, TrendingUp,
  MapPin, Phone, CheckCircle2, Siren, Thermometer, UserPlus, History, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { GlobalEntityLink } from "./GlobalEntityLink";
import DepartmentTasks from "./DepartmentTasks";
import { useHIS } from "../context/HISContext";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import { ArrowLeft } from "lucide-react";

export default function ERDashboard({ language, onOpenPatientChart }: { language: "ar" | "en", onOpenPatientChart?: (id: string, name: string, tab?: string) => void }) {
  const isAr = language === "ar";
  const { erQueue = [], currentUser, patients: contextPatients } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  // Removed local selectedPatientId state to use onOpenPatientChart prop if available
  const [localSelectedPatientId, setLocalSelectedPatientId] = useState<string | null>(null);

  const handleOpenChart = (p: any) => {
    if (onOpenPatientChart) {
      onOpenPatientChart(p.id, isAr ? p.nameAr : p.nameEn);
    } else {
      setLocalSelectedPatientId(p.id);
    }
  };

  // State for advanced features
  const [ambulances, setAmbulances] = useState<any[]>([
    { id: "AMB-102", eta: 3, status: "Critical", statusAr: "حرج", complaint: "Cardiac Arrest", complaintAr: "توقف قلب وتنفس", paramedic: "Sami A.", hr: 0, bp: "0/0", spo2: 0, bedId: "" },
    { id: "AMB-205", eta: 7, status: "Stable", statusAr: "مستقر", complaint: "Respiratory Distress", complaintAr: "ضيق تنفس", paramedic: "Omar K.", hr: 110, bp: "135/85", spo2: 92, bedId: "" }
  ]);

  const [resusChecklist, setResusChecklist] = useState({
    airway: true,
    iv: true,
    ekg: false,
    epi: false,
    blood: false
  });

  const [gcs, setGcs] = useState({ eye: 4, verbal: 5, motor: 6 });

  const patients = useMemo(() => {
    return (contextPatients && Array.isArray(contextPatients))
      ? contextPatients.filter(p => p.status === "triage" || p.departmentId === "er-unit")
      : [];
  }, [contextPatients]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    const lowerQuery = searchTerm.toLowerCase();
    return patients.filter(p => 
      p.nameEn.toLowerCase().includes(lowerQuery) || 
      p.nameAr.includes(searchTerm) || 
      p.mrn.toLowerCase().includes(lowerQuery)
    );
  }, [patients, searchTerm]);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Triage Board", ar: "لوحة الفرز" },
    { id: "critical", icon: HeartPulse, en: "Trauma & Resus", ar: "الإصابات والإنعاش" },
    { id: "ambulance", icon: Siren, en: "Ambulance Track", ar: "تتبع الإسعاف" },
    { id: "fast_track", icon: ShieldAlert, en: "Fast Track", ar: "المسار السريع" },
    { id: "beds", icon: Bed, en: "ER Bed Map", ar: "خارطة الأسرة" },
    { id: "search", icon: FileSearch, en: "Search Center", ar: "مركز البحث" },
    { id: "analytics", icon: BarChart3, en: "Analytics", ar: "التحليلات" },
  ];

  const getTriageColor = (level: number) => {
    switch (level) {
      case 1: return "bg-rose-500 text-white border-rose-600";
      case 2: return "bg-orange-500 text-white border-orange-600";
      case 3: return "bg-yellow-400 text-slate-800 border-yellow-500";
      case 4: return "bg-emerald-500 text-white border-emerald-600";
      case 5: return "bg-blue-500 text-white border-blue-600";
      default: return "bg-slate-200 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#fcfdfe]" dir={isAr ? "rtl" : "ltr"}>
      {/* Module Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col lg:flex-row lg:items-center justify-between shadow-sm z-30 gap-4 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight truncate">
                {isAr ? "قسم الطوارئ (ER)" : "Emergency Department"}
              </h1>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-black rounded-full border border-rose-100 uppercase shrink-0">
                v2.0
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-0.5">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 truncate">{isAr ? "المستشفى الرئيسي" : "Main Medical Center"}</span>
              <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-black text-rose-600 uppercase tracking-widest">
                  {patients.length} {isAr ? "مريض قيد المعالجة" : "Active ER Cases"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder={isAr ? "بحث في الطوارئ..." : "Search ER Board..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none w-64 transition-all focus:bg-white"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-xl transition-all shadow-sm">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-2 px-5">
            <UserPlus className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest hidden lg:block">{isAr ? "تسجيل مريض" : "Triage Patient"}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 overflow-x-auto no-scrollbar shrink-0">
         <div className="flex gap-2 min-w-max">
          {mainTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveMainTab(tab.id);
                setLocalSelectedPatientId(null);
              }}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeMainTab === tab.id 
                  ? "border-rose-600 text-rose-700 bg-rose-50/30" 
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeMainTab === tab.id ? "text-rose-600" : ""}`} />
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {localSelectedPatientId ? (
            <motion.div 
               key="clinical-desk"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="h-full flex flex-col"
            >
              <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                   <button 
                     onClick={() => setLocalSelectedPatientId(null)}
                     className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                   >
                     <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                   </button>
                   <div className="h-8 w-[1px] bg-slate-200" />
                   <div>
                     <h3 className="text-sm font-black text-slate-800">
                       {isAr ? "معاينة الطوارئ السريرية" : "Clinical ER Assessment"}
                     </h3>
                     <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                       {isAr ? "الحالة: مباشر" : "Mode: Live Assessment"}
                     </p>
                   </div>
                 </div>
                 <div className="flex gap-2 min-w-max">
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase hover:bg-slate-200 transition-colors">
                      {isAr ? "تحويل مريض" : "Transfer Patient"}
                    </button>
                    <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-black uppercase shadow-md hover:bg-rose-700 transition-all active:scale-95">
                      {isAr ? "إنهاء المعاينة" : "Finalize Consult"}
                    </button>
                 </div>
              </div>
              <div className="flex-1 overflow-hidden min-h-0">
                <DoctorConsultationDesk 
                  language={language}
                  currentUser={currentUser}
                  systemUsers={[]}
                  departments={[]}
                  forcedPatientId={localSelectedPatientId}
                  isEmbedded={true}
                />
              </div>
            </motion.div>
          ) : (
            <>
              {activeMainTab === "dashboard" && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 h-full overflow-y-auto space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { level: 1, label: isAr ? "إنعاش (L1)" : "Resus (L1)", color: "rose" },
                      { level: 2, label: isAr ? "طوارئ (L2)" : "Emergent (L2)", color: "orange" },
                      { level: 3, label: isAr ? "عاجل (L3)" : "Urgent (L3)", color: "yellow" },
                      { level: 4, label: isAr ? "أقل استعجالاً" : "Less Urgent", color: "emerald" },
                      { level: 5, label: isAr ? "غير عاجل" : "Non-Urgent", color: "blue" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                          <h3 className={`text-3xl font-black text-${stat.color}-600 mt-1`}>
                            {patients.filter(p => p.triageLevel === stat.level).length}
                          </h3>
                        </div>
                        <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 border border-${stat.color}-100`}>
                           <Activity className="w-5 h-5" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                        <h2 className="font-black text-slate-800 uppercase tracking-tight">{isAr ? "لوحة الفرز الحي" : "Live Triage Board"}</h2>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <Clock className="w-3.5 h-3.5" />
                           {isAr ? "تحديث تلقائي: نشط" : "Auto-Refresh: Active"}
                         </div>
                         <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Filter className="w-4 h-4" /></button>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="py-4 px-6">{isAr ? "الفرز" : "Triage"}</th>
                            <th className="py-4 px-6">{isAr ? "المريض" : "Patient"}</th>
                            <th className="py-4 px-6">{isAr ? "الشكوى" : "Complaint"}</th>
                            <th className="py-4 px-6">{isAr ? "الانتظار" : "Wait Time"}</th>
                            <th className="py-4 px-6">{isAr ? "الحالة" : "Status"}</th>
                            <th className="py-4 px-6 text-right">{isAr ? "الإجراء" : "Action"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredPatients.map(p => (
                            <tr key={p.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer" onClick={() => handleOpenChart(p)}>
                              <td className="py-4 px-6">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border shadow-sm ${getTriageColor(p.triageLevel || 3)}`}>
                                  {p.triageLevel || 3}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black text-sm border border-slate-200">
                                    {p.nameEn.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-slate-800 hover:text-rose-600 transition-colors">
                                      <GlobalEntityLink 
                                        entityId={p.id} 
                                        entityName={isAr ? p.nameAr : p.nameEn} 
                                        entityType="patient" 
                                        isAr={isAr}
                                      >
                                        {isAr ? p.nameAr : p.nameEn}
                                      </GlobalEntityLink>
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                      <GlobalEntityLink 
                                        entityId={p.id} 
                                        entityName={isAr ? p.nameAr : p.nameEn} 
                                        entityType="patient" 
                                        isAr={isAr}
                                      >
                                        {p.mrn}
                                      </GlobalEntityLink>
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 max-w-xs">
                                <p className="text-xs font-bold text-slate-600 truncate">{p.chiefComplaint || (isAr ? "غير محدد" : "Unspecified")}</p>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-1.5 text-xs font-black text-slate-500">
                                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                                  12m
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-black border border-slate-200 uppercase tracking-widest">
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                 <button className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    {isAr ? "بدء المعاينة" : "Begin Assessment"}
                                 </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMainTab === "critical" && (
                <motion.div 
                  key="critical"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 h-full overflow-y-auto space-y-6"
                >
                   <div className="bg-rose-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                      <Zap className="absolute top-[-40px] right-[-40px] w-64 h-64 text-white/5 rotate-12" />
                      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="space-y-4">
                           <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <div className="w-3 h-3 bg-rose-400 rounded-full animate-ping" />
                              <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-300">{isAr ? "وحدة الإنعاش المباشر" : "Direct Resuscitation Hub"}</span>
                           </div>
                           <h2 className="text-5xl font-black tracking-tighter">{isAr ? "إدارة الصدمات الكبرى" : "Major Trauma Command"}</h2>
                           <p className="text-rose-100/80 font-medium max-w-lg text-lg">
                              {isAr ? "مساحة عمل مخصصة للحالات من المستوى 1. تتبع البروتوكولات، تحليلات GCS، وربط فرق الاستجابة السريعة." : "Specialized workspace for Level 1 critical care. Protocol tracking, GCS analytics, and rapid response team synchronization."}
                           </p>
                        </div>
                        <div className="flex gap-4">
                           <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] text-center w-40">
                              <span className="text-[10px] font-black uppercase tracking-widest text-rose-300 block mb-2">{isAr ? "حالات نشطة" : "Active Cases"}</span>
                              <span className="text-4xl font-black">2</span>
                           </div>
                           <div className="bg-rose-500/30 backdrop-blur-xl border border-rose-400/30 p-6 rounded-[32px] text-center w-40">
                              <span className="text-[10px] font-black uppercase tracking-widest text-rose-300 block mb-2">{isAr ? "جاهزية الفريق" : "Team Status"}</span>
                              <span className="text-xl font-black uppercase">{isAr ? "متأهب" : "Ready"}</span>
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* GCS Calculator Integration */}
                      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                           <Activity className="w-6 h-6 text-rose-600" />
                           {isAr ? "حاسبة مقياس غلاسكو (GCS)" : "Glasgow Coma Scale Calculator"}
                        </h3>
                        <div className="space-y-4">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Eye Opening (E)</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                {[4, 3, 2, 1].map(v => (
                                  <button key={v} onClick={() => setGcs({...gcs, eye: v})} className={`py-3 rounded-2xl text-sm font-black transition-all ${gcs.eye === v ? 'bg-rose-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{v}</button>
                                ))}
                              </div>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Verbal Response (V)</label>
                              <div className="grid grid-cols-5 gap-2">
                                {[5, 4, 3, 2, 1].map(v => (
                                  <button key={v} onClick={() => setGcs({...gcs, verbal: v})} className={`py-3 rounded-2xl text-sm font-black transition-all ${gcs.verbal === v ? 'bg-rose-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{v}</button>
                                ))}
                              </div>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Motor Response (M)</label>
                              <div className="grid grid-cols-6 gap-2">
                                {[6, 5, 4, 3, 2, 1].map(v => (
                                  <button key={v} onClick={() => setGcs({...gcs, motor: v})} className={`py-3 rounded-2xl text-sm font-black transition-all ${gcs.motor === v ? 'bg-rose-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{v}</button>
                                ))}
                              </div>
                           </div>
                        </div>
                        <div className="bg-rose-50 rounded-3xl p-6 text-center border border-rose-100">
                           <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] block mb-2">Total Score</span>
                           <h4 className="text-6xl font-black text-rose-700">{gcs.eye + gcs.verbal + gcs.motor}</h4>
                           <p className="text-xs font-bold text-rose-600 mt-4 uppercase tracking-widest">
                             {gcs.eye + gcs.verbal + gcs.motor <= 8 ? "Severe (Intubate)" : gcs.eye + gcs.verbal + gcs.motor <= 12 ? "Moderate" : "Mild"}
                           </p>
                        </div>
                      </div>

                      {/* Resus Checklist Integration */}
                      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                           <HeartPulse className="w-6 h-6 text-rose-600" />
                           {isAr ? "قائمة تدقيق الإنعاش السريع" : "Rapid Resuscitation Checklist"}
                        </h3>
                        <div className="space-y-3">
                           {[
                             { key: "airway", label: "Airway Secured / ET Tube" },
                             { key: "iv", label: "Two Large Bore IV Access" },
                             { key: "ekg", label: "Cardiac Monitor Connected" },
                             { key: "epi", label: "Epinephrine Administered" },
                             { key: "blood", label: "Blood Products Ordered" },
                           ].map(item => (
                             <button 
                               key={item.key} 
                               onClick={() => setResusChecklist(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                               className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${(resusChecklist as any)[item.key] ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                             >
                                <span className="font-black text-sm uppercase tracking-tight">{item.label}</span>
                                {(resusChecklist as any)[item.key] ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />}
                             </button>
                           ))}
                        </div>
                        <button className="w-full py-5 bg-rose-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95">
                           {isAr ? "إنهاء وتسجيل الواقعة" : "Finalize & Log Event"}
                        </button>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeMainTab === "ambulance" && (
                <motion.div 
                  key="ambulance"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 sm:p-6 lg:p-8 h-full overflow-y-auto space-y-8"
                >
                   <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{isAr ? "مركز تتبع سيارات الإسعاف" : "Ambulance Command Center"}</h2>
                        <p className="text-slate-500 font-bold mt-2 text-lg">{isAr ? "رصد حي لحالات ما قبل الوصول إلى المستشفى" : "Real-time monitoring of pre-hospital emergency arrivals"}</p>
                      </div>
                      <div className="flex gap-3">
                         <div className="bg-white border border-slate-200 rounded-2xl px-6 py-3 flex flex-col justify-center shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En-Route</span>
                            <span className="text-lg sm:text-2xl font-black text-rose-600">3</span>
                         </div>
                         <button className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"><MapPin className="w-6 h-6" /></button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {ambulances.map((amb, idx) => (
                        <div key={amb.id} className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-2 h-full bg-rose-600" />
                           <div className="flex justify-between items-start mb-8">
                              <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                                 <div className="w-10 h-10 sm:w-14 sm:h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner border border-rose-100">
                                    <Siren className="w-5 h-5 sm:w-8 sm:h-8" />
                                 </div>
                                 <div>
                                    <h3 className="font-black text-slate-900 text-xl">{amb.id}</h3>
                                    <p className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1">
                                       <Clock className="w-3 h-3" />
                                       ETA: {amb.eta} MINS
                                    </p>
                                 </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${amb.status === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                 {isAr ? amb.statusAr : amb.status}
                              </span>
                           </div>

                           <div className="space-y-6">
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chief Complaint</p>
                                 <p className="text-base font-black text-slate-800">{isAr ? amb.complaintAr : amb.complaint}</p>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                 <div className="text-center">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase">HR</span>
                                    <span className="text-sm font-black text-slate-700 font-mono">{amb.hr || '--'}</span>
                                 </div>
                                 <div className="text-center border-x border-slate-200">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase">BP</span>
                                    <span className="text-sm font-black text-slate-700 font-mono">{amb.bp || '--'}</span>
                                 </div>
                                 <div className="text-center">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase">SpO2</span>
                                    <span className="text-sm font-black text-slate-700 font-mono">{amb.spo2 ? amb.spo2+'%' : '--'}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex -space-x-2">
                                 {[1,2].map(i => <div key={i} className="w-5 h-5 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">P{i}</div>)}
                              </div>
                              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all">
                                 {isAr ? "تحضير السرير" : "Assign Bed"}
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeMainTab === "search" && (
                <motion.div 
                  key="search"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 h-full flex flex-col items-center justify-center max-w-4xl mx-auto"
                >
                   <div className="w-full space-y-12">
                    <div className="text-center space-y-4">
                       <div className="w-24 h-24 bg-rose-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-rose-100">
                          <FileSearch className="w-12 h-12 text-rose-600" />
                       </div>
                       <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{isAr ? "مركز البحث المتقدم (ER)" : "ER Advanced Search"}</h2>
                       <p className="text-slate-500 font-bold text-lg max-w-md mx-auto">{isAr ? "ابحث في سجلات الطوارئ والفرز" : "Search through current and historical emergency records"}</p>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-10 space-y-8 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-2 h-full bg-rose-600" />
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{isAr ? "الاسم أو الرقم الطبي" : "Name / MRN"}</label>
                             <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-rose-100 outline-none transition-all focus:bg-white" placeholder="Search..." />
                          </div>
                          <div className="space-y-3">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{isAr ? "مستوى الفرز" : "Triage Level"}</label>
                             <select className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-rose-100 outline-none transition-all focus:bg-white appearance-none">
                                <option>All Levels</option>
                                <option>Level 1 (Resus)</option>
                                <option>Level 2 (Emergent)</option>
                                <option>Level 3 (Urgent)</option>
                             </select>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                          <button className="text-xs font-black text-slate-400 hover:text-rose-600 uppercase tracking-widest transition-colors">{isAr ? "مسح المعايير" : "Clear Filters"}</button>
                          <button className="bg-rose-600 hover:bg-rose-700 text-white px-12 py-5 rounded-[24px] font-black shadow-2xl shadow-rose-200 transition-all active:scale-95 flex items-center gap-2 sm:gap-4 flex-wrap ">
                             <Search className="w-6 h-6" />
                             <span className="text-lg">{isAr ? "بحث متقدم" : "Start Search"}</span>
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMainTab === "analytics" && (
                <motion.div 
                  key="analytics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 h-full"
                >
                  <div className="bg-white rounded-[40px] border border-slate-200 p-20 text-center shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                       <BarChart3 className="w-32 h-32 text-rose-50/50 -rotate-12" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-rose-100">
                         <TrendingUp className="w-12 h-12 text-rose-600" />
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{isAr ? "تحليلات أداء الطوارئ" : "ER Performance Analytics"}</h2>
                      <p className="text-slate-500 max-w-lg mx-auto text-lg font-medium leading-relaxed mb-10">
                        {isAr ? "متابعة آنية لأزمنة الانتظار، معدلات التدفق، وكفاءة الفرز السريري." : "Real-time tracking of waiting times, throughput rates, and clinical triage efficiency."}
                      </p>
                      
                      <div className="flex justify-center gap-6">
                        {[
                          { label: "Door to Doc Time", icon: Clock },
                          { level: "Waitlist Trends", icon: Users },
                          { label: "Critical Outcome Ratio", icon: Activity },
                        ].map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-2">
                             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                               <item.icon className="w-6 h-6" />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{item.label}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-12 flex justify-center gap-3">
                        <div className="w-3 h-3 bg-rose-600 rounded-full animate-bounce" />
                        <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-3 h-3 bg-rose-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeMainTab === "beds" && (
                <motion.div 
                  key="beds"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 sm:p-6 lg:p-8 h-full overflow-y-auto space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                       <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isAr ? "خارطة إشغال أسرة الطوارئ" : "ER Bed Capacity Map"}</h2>
                       <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "نظرة عامة على حالة الغرف والأسرة" : "Overview of room & bed occupancy status"}</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-rose-500 rounded-full" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Occupied</span>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {[
                       { id: "BED-ER-01", type: "Resuscitation", status: "Occupied", patient: patients[0] },
                       { id: "BED-ER-02", type: "Resuscitation", status: "Occupied", patient: patients[1] },
                       { id: "BED-ER-03", type: "Observation", status: "Available", patient: null },
                       { id: "BED-ER-04", type: "Observation", status: "Available", patient: null },
                       { id: "BED-ER-05", type: "Observation", status: "Occupied", patient: patients[2] },
                       { id: "BED-ER-06", type: "Observation", status: "Available", patient: null },
                       { id: "BED-ER-07", type: "Fast Track", status: "Available", patient: null },
                       { id: "BED-ER-08", type: "Fast Track", status: "Occupied", patient: patients[3] },
                     ].map((bed, idx) => (
                       <div key={bed.id} className={`bg-white rounded-[32px] border p-6 shadow-sm transition-all hover:shadow-xl ${bed.status === 'Occupied' ? 'border-rose-100 bg-rose-50/10' : 'border-slate-100 hover:border-emerald-100'}`}>
                          <div className="flex justify-between items-start mb-6">
                             <div className={`p-3 rounded-2xl ${bed.status === 'Occupied' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                <Bed className="w-6 h-6" />
                             </div>
                             <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${bed.status === 'Occupied' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                                {bed.status}
                             </span>
                          </div>
                          <h4 className="font-black text-slate-900 text-sm">{bed.id}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{bed.type}</p>
                          
                          <div className="pt-6 border-t border-slate-100">
                             {bed.patient ? (
                               <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Assigned Patient</p>
                                  <p className="text-xs font-black text-slate-800 truncate">
                                     {isAr ? bed.patient.nameAr : bed.patient.nameEn}
                                  </p>
                               </div>
                             ) : (
                               <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">
                                  {isAr ? "تخصيص مريض" : "Assign Patient"}
                               </button>
                             )}
                          </div>
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}
              {activeMainTab === "fast_track" && (
                <motion.div 
                  key="fast_track"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 sm:p-6 lg:p-8 h-full overflow-y-auto space-y-8"
                >
                  <div className="bg-emerald-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                     <Zap className="absolute top-[-40px] right-[-40px] w-64 h-64 text-white/5 rotate-12" />
                     <div className="relative z-10">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                           <ShieldAlert className="w-6 h-6" />
                           <span className="text-xs font-black uppercase tracking-[0.3em]">{isAr ? "وحدة المسار السريع" : "ER Fast Track Unit"}</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight">{isAr ? "إدارة الحالات الطفيفة" : "Minor Acuity Management"}</h2>
                        <p className="text-emerald-50/80 font-medium max-w-lg mt-4">
                           {isAr ? "تحسين تدفق المرضى للحالات من المستوى 4 و 5. تقليل زمن الانتظار وزيادة الكفاءة." : "Streamlining throughput for Level 4 & 5 acuity cases. Reducing wait times and improving patient flow."}
                        </p>
                     </div>
                  </div>

                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                     <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{isAr ? "قائمة العمل: المسار السريع" : "Fast Track Worklist"}</h3>
                        <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black border border-emerald-100">4 Waiting</span>
                     </div>
                     <div className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                           {patients.filter(p => (p.triageLevel || 3) >= 4).map((p, i) => (
                             <div key={p.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer group" onClick={() => handleOpenChart(p)}>
                                <div className="flex justify-between items-start mb-4">
                                   <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black">
                                      {i + 1}
                                   </div>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">L{p.triageLevel}</span>
                                </div>
                                <h4 className="font-black text-slate-800 text-sm leading-tight mb-1">
                                   <GlobalEntityLink entityId={p.id} entityName={isAr ? p.nameAr : p.nameEn} entityType="patient" isAr={isAr}>
                                      {isAr ? p.nameAr : p.nameEn}
                                   </GlobalEntityLink>
                                </h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.mrn}</p>
                                <div className="mt-6 flex items-center gap-2">
                                   <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                   <span className="text-[10px] font-black text-slate-500 uppercase">Wait: 5m</span>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
