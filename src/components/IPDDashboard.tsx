import React, { createElement, useState, useMemo } from "react";
import { 
  User, Activity, FileText, Plus, Clock, Search, HeartPulse, Filter, Settings, 
  FileEdit, LogIn, Calendar, FileCheck2, Syringe, UserPlus, FileSearch, 
  ArrowUpRight, Bed, ClipboardList, BedDouble, LayoutDashboard, RefreshCcw, 
  LogOut, ShieldAlert, Users, ListTodo, History, FileOutput, Stethoscope,
  MoreVertical, ChevronRight, BarChart3, TrendingUp, AlertCircle, CheckCircle2,
  Package, Printer, Share2, FilterX, Star, Bookmark, Download, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { useHIS } from "../context/HISContext";
import { HOSPITAL_WARDS } from "../lib/constants";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import { ArrowLeft } from "lucide-react";

export default function IPDDashboard({ language, forceDepartmentId }: { language: "ar" | "en", forceDepartmentId?: string }) {
  const isAr = language === "ar";
  const { patients: contextPatients, admissionRequests = [], currentUser } = useHIS();
  
  const [selectedWard, setSelectedWard] = useState<string>(forceDepartmentId || "dept-im-m");
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const wardOptions = HOSPITAL_WARDS;

  const activeWardPatients = useMemo(() => {
    return (contextPatients && Array.isArray(contextPatients)) 
      ? contextPatients.filter(p => p.status === "ward" && p.wardId === selectedWard)
      : [];
  }, [contextPatients, selectedWard]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return activeWardPatients;
    const lowerQuery = searchQuery.toLowerCase();
    return activeWardPatients.filter(p => 
      p.nameEn.toLowerCase().includes(lowerQuery) || 
      p.nameAr.includes(lowerQuery) || 
      p.mrn.toLowerCase().includes(lowerQuery) ||
      (p.bedId && p.bedId.toLowerCase().includes(lowerQuery))
    );
  }, [activeWardPatients, searchQuery]);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Unit Dashboard", ar: "لوحة الوحدة" },
    { id: "bedmap", icon: BedDouble, en: "Bed Roster", ar: "مخطط الأسرة" },
    { id: "admissions", icon: LogIn, en: "Admissions", ar: "طلبات الدخول" },
    { id: "transfers", icon: RefreshCcw, en: "Transfers", ar: "النقل الداخلي" },
    { id: "discharges", icon: LogOut, en: "Discharges", ar: "إجراءات الخروج" },
    { id: "search", icon: FileSearch, en: "Search Center", ar: "مركز البحث" },
    { id: "analytics", icon: BarChart3, en: "Analytics", ar: "التحليلات" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* Module Header - Enterprise Standard */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col lg:flex-row lg:items-center justify-between shadow-sm z-30 gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <BedDouble className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight truncate">
                {isAr ? "الأقسام الداخلية (IPD)" : "Inpatient Department"}
              </h1>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full border border-indigo-100 uppercase shrink-0">
                v2.0
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-0.5">
              <select 
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="text-[10px] sm:text-sm font-bold text-slate-500 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                {wardOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{isAr ? opt.nameAr : opt.nameEn}</option>
                ))}
              </select>
              <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {activeWardPatients.length} {isAr ? "مريض حالي" : "Active Patients"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
           <div className="relative flex-1 lg:flex-none">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text"
               placeholder={isAr ? "بحث..." : "Search..."}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full lg:w-48 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white"
             />
           </div>
           <button className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm flex items-center justify-center">
             <Printer className="w-4 h-4 sm:w-5 h-5" />
           </button>
           <button className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center">
             <Plus className="w-4 h-4 sm:w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 overflow-x-auto no-scrollbar">
         <div className="flex gap-1 min-w-max">
          {mainTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveMainTab(tab.id);
                setSelectedPatientId(null);
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeMainTab === tab.id 
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50/30" 
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeMainTab === tab.id ? "text-indigo-600" : ""}`} />
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>
        
        <div className="hidden lg:flex items-center gap-4 text-slate-400">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-tighter">Live System Connection</span>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedPatientId ? (
             <motion.div 
               key="clinical-desk"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="h-full flex flex-col"
             >
                <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setSelectedPatientId(null)}
                       className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                     >
                       <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                     </button>
                     <div className="h-8 w-[1px] bg-slate-200" />
                     <div>
                       <h3 className="text-sm font-black text-slate-800">
                         {isAr ? "ملف الحالة السريرية" : "Clinical Case File"}
                       </h3>
                       <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                         {isAr ? "الوضع: استعراض وتعديل" : "Mode: Review & Edit"}
                       </p>
                     </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase hover:bg-slate-200 transition-colors">
                        {isAr ? "سجل النشاط" : "Activity Log"}
                      </button>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase shadow-md hover:bg-indigo-700 transition-all active:scale-95">
                        {isAr ? "إغلاق الملف" : "Close Record"}
                      </button>
                   </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <DoctorConsultationDesk 
                    language={language}
                    currentUser={currentUser}
                    systemUsers={[]}
                    departments={[]}
                    forcedPatientId={selectedPatientId}
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
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: isAr ? "نسبة الإشغال" : "Unit Occupancy", value: "88%", icon: BedDouble, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+2%" },
                      { label: isAr ? "متوسط الإقامة" : "Avg. LOS", value: "4.2 Days", icon: Clock, color: "text-sky-600", bg: "bg-sky-50", trend: "-0.5" },
                      { label: isAr ? "خروج متوقع (اليوم)" : "Est. Discharges", value: "12", icon: LogOut, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Normal" },
                      { label: isAr ? "حالات حرجة" : "Critical Cases", value: "3", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50", trend: "+1" },
                    ].map((kpi, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                            <kpi.icon className="w-6 h-6" />
                          </div>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${kpi.trend.includes("+") ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                            {kpi.trend}
                          </span>
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{kpi.value}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Active Ward List */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                          <h2 className="font-black text-slate-800 uppercase tracking-tight">{isAr ? "خارطة أسرة الوحدة" : "Unit Bed Map"}</h2>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Filter className="w-4 h-4" /></button>
                          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </div>
                      
                      <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                              <th className="pb-4 px-2">{isAr ? "السرير" : "Bed"}</th>
                              <th className="pb-4 px-2">{isAr ? "المريض" : "Patient"}</th>
                              <th className="pb-4 px-2">{isAr ? "الطبيب" : "Attending"}</th>
                              <th className="pb-4 px-2">{isAr ? "أيام التنويم" : "Days"}</th>
                              <th className="pb-4 px-2">{isAr ? "الحالة" : "Acuity"}</th>
                              <th className="pb-4 px-2 text-right">{isAr ? "الإجراء" : "Action"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {filteredPatients.map(p => (
                              <tr key={p.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer" onClick={() => setSelectedPatientId(p.id)}>
                                <td className="py-4 px-2">
                                  <div className="flex items-center gap-2 font-black text-indigo-600">
                                    <Bed className="w-4 h-4" />
                                    {p.bedId || "N/A"}
                                  </div>
                                </td>
                                <td className="py-4 px-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm">
                                      {p.nameEn.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-slate-800">{isAr ? p.nameAr : p.nameEn}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase">{p.mrn}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-2">
                                  <p className="text-xs font-bold text-slate-600">{p.attendingDoctor || "Dr. Unassigned"}</p>
                                </td>
                                <td className="py-4 px-2">
                                  <span className="text-xs font-mono font-black text-slate-500">4d</span>
                                </td>
                                <td className="py-4 px-2">
                                   <div className="flex items-center gap-1.5">
                                      <div className={`w-1.5 h-1.5 rounded-full ${p.priority === 'high' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                      <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">
                                        {p.priority === 'high' ? (isAr ? "مرتفع" : "High") : (isAr ? "طبيعي" : "Normal")}
                                      </span>
                                   </div>
                                </td>
                                <td className="py-4 px-2 text-right">
                                   <button className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                                      <ChevronRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                                   </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {filteredPatients.length === 0 && (
                          <div className="py-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                              <BedDouble className="w-10 h-10 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{isAr ? "لا يوجد مرضى في هذه الوحدة" : "No active patients in this unit"}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Access & Notifications */}
                    <div className="space-y-6">
                       <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                          <Zap className="absolute top-[-20px] right-[-20px] w-40 h-40 text-white/5 rotate-12" />
                          <h3 className="text-lg font-black mb-1">{isAr ? "إدارة الورديات" : "Shift Handover"}</h3>
                          <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest mb-6 opacity-80">{isAr ? "الوردية الحالية: صباحي" : "Current Shift: Morning"}</p>
                          
                          <div className="space-y-4 relative z-10">
                             <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">{isAr ? "تذكير المهام" : "Task Reminders"}</p>
                                <p className="text-sm font-bold">4 {isAr ? "إجراءات معلقة" : "Pending Procedures"}</p>
                             </div>
                             <button className="w-full py-3 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-50 transition-all active:scale-95">
                                {isAr ? "بدء التسليم" : "Start Handover"}
                             </button>
                          </div>
                       </div>

                       <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-6">
                             <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{isAr ? "تنبيهات السريرية" : "Clinical Alerts"}</h3>
                             <span className="w-5 h-5 bg-rose-100 text-rose-600 text-[10px] font-black rounded-full flex items-center justify-center">2</span>
                          </div>
                          <div className="space-y-4">
                             {[
                               { title: "Lab Results Ready", time: "10m ago", color: "border-indigo-100 bg-indigo-50/30 text-indigo-700" },
                               { title: "High Acuity Alert: RM-204", time: "25m ago", color: "border-rose-100 bg-rose-50/30 text-rose-700" },
                             ].map((alert, idx) => (
                               <div key={idx} className={`p-4 border rounded-2xl ${alert.color} transition-all cursor-pointer hover:scale-[1.02]`}>
                                  <p className="text-xs font-black uppercase tracking-tight">{alert.title}</p>
                                  <p className="text-[10px] font-bold opacity-60 mt-1">{alert.time}</p>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMainTab === "admissions" && (
                <motion.div 
                  key="admissions"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 h-full overflow-y-auto"
                >
                  <div className="max-w-5xl mx-auto space-y-8">
                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isAr ? "مركز إدارة الدخول" : "Admission Management Center"}</h2>
                          <p className="text-slate-500 font-bold mt-1">{isAr ? "طلبات التنويم الجديدة والمراجعة المسبقة" : "New admission requests and pre-admission reviews"}</p>
                        </div>
                        <div className="flex gap-2">
                           <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm hover:bg-slate-50 transition-all">{isAr ? "سجل الطلبات" : "Request History"}</button>
                           <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">{isAr ? "طلب جديد" : "New Request"}</button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {admissionRequests.map((req: any) => (
                          <div key={req.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group">
                             <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100">
                                      {req.patientName?.charAt(0)}
                                   </div>
                                   <div>
                                      <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{req.patientName}</h3>
                                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{req.patientId}</p>
                                   </div>
                                </div>
                                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-100 uppercase tracking-widest">
                                   {req.status}
                                </span>
                             </div>
                             
                             <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                   <Activity className="w-4 h-4 text-slate-400" />
                                   <span className="text-xs font-bold text-slate-600">{req.diagnosis}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                   <Clock className="w-4 h-4 text-slate-400" />
                                   <span className="text-xs font-bold text-slate-500 italic">Requested 2 hours ago</span>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                                <button className="py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-indigo-700 transition-all active:scale-95">
                                   {isAr ? "تخصيص سرير" : "Approve & Bed"}
                                </button>
                                <button className="py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                                   {isAr ? "مراجعة التفاصيل" : "Review Case"}
                                </button>
                             </div>
                          </div>
                        ))}
                        {admissionRequests.length === 0 && (
                          <div className="col-span-full bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                                <Plus className="w-8 h-8 text-slate-300" />
                             </div>
                             <h3 className="text-lg font-black text-slate-800">{isAr ? "لا توجد طلبات معلقة" : "No Pending Requests"}</h3>
                             <p className="text-sm text-slate-500 mt-2">{isAr ? "سيتم عرض طلبات الدخول المحولة من الطوارئ والعيادات هنا" : "Admission requests from ER and Clinics will appear here"}</p>
                          </div>
                        )}
                     </div>
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
                       <div className="w-24 h-24 bg-indigo-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-indigo-100">
                          <FileSearch className="w-12 h-12 text-indigo-600" />
                       </div>
                       <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{isAr ? "مركز البحث المتقدم" : "IPD Advanced Search"}</h2>
                       <p className="text-slate-500 font-bold text-lg max-w-md mx-auto">{isAr ? "ابحث في سجلات التنويم التاريخية والحالية" : "Search through current and historical inpatient records"}</p>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-10 space-y-8 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600" />
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{isAr ? "الاسم أو الرقم الطبي" : "Name / MRN"}</label>
                             <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all focus:bg-white" placeholder="Search..." />
                          </div>
                          <div className="space-y-3">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{isAr ? "رقم الجناح / الغرفة" : "Ward / Room"}</label>
                             <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all focus:bg-white" placeholder="e.g. RM-301" />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase px-1">Consultant</label>
                             <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold focus:ring-0 outline-none">
                                <option>All Physicians</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase px-1">Admission Period</label>
                             <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold focus:ring-0 outline-none">
                                <option>Last 30 Days</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase px-1">Case Status</label>
                             <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold focus:ring-0 outline-none">
                                <option>All Records</option>
                                <option>Active Only</option>
                                <option>Discharged Only</option>
                             </select>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                          <button className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">{isAr ? "مسح المعايير" : "Clear All Filters"}</button>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-[24px] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-4">
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
                       <BarChart3 className="w-32 h-32 text-indigo-50/50 -rotate-12" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-100">
                         <TrendingUp className="w-12 h-12 text-emerald-600" />
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{isAr ? "مركز التحليلات والذكاء" : "Clinical Intelligence Center"}</h2>
                      <p className="text-slate-500 max-w-lg mx-auto text-lg font-medium leading-relaxed mb-10">
                        {isAr ? "نقوم حالياً بتحليل البيانات السريرية وسجلات الأجنحة لتقديم رؤى ذكية حول كفاءة التشغيل وجودة الرعاية الصحية." : "Real-time aggregation of unit occupancy, patient flow patterns, and clinical outcomes for data-driven decisions."}
                      </p>
                      
                      <div className="flex justify-center gap-6">
                        {[
                          { label: "Predictive Capacity", icon: BedDouble },
                          { label: "Resource Allocation", icon: Package },
                          { label: "Clinical KPI Tracking", icon: Activity },
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
                        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" />
                        <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-3 h-3 bg-indigo-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Default Fallback for other tabs - keep minimal to avoid clutter */}
              {["bedmap", "transfers", "discharges"].includes(activeMainTab) && (
                 <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center mb-8 border border-slate-200 shadow-inner">
                       {mainTabs.find(t => t.id === activeMainTab)?.icon && createElement(mainTabs.find(t => t.id === activeMainTab)!.icon, { className: "w-12 h-12 text-slate-300" })}
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{isAr ? "موديول " : "Module "}{activeMainTab}</h2>
                    <p className="text-sm text-slate-400 font-bold max-w-xs mt-2 uppercase tracking-widest">{isAr ? "واجهة الموديول" : "Module Interface"}</p>
                 </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

