import React, { useState, useMemo } from "react";
import { 
  BedDouble, Users, Activity, FileText, BarChart3, ShieldAlert, ArrowRightLeft, 
  Settings, Plus, Search, Filter, LayoutDashboard, FileSearch, Printer, Zap,
  TrendingUp, MapPin, Phone, CheckCircle2, Siren, Thermometer, UserPlus, History,
  MoreVertical, ChevronRight, Eye, Bell, ListTodo, FileOutput, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import { GlobalEntityLink } from "./GlobalEntityLink";
import BedManagement from "./inpatient/BedManagement";
import PatientList from "./inpatient/PatientList";
import InpatientMetrics from "./inpatient/InpatientMetrics";
import AdmissionForm from "./inpatient/AdmissionForm";
import ReportsDashboard from "./inpatient/ReportsDashboard";

export const MODULE_TYPES = [
  { id: "ward_im", labelAr: "تنويم الباطنة", labelEn: "Internal Medicine Ward" },
  { id: "ward_surg", labelAr: "تنويم الجراحة", labelEn: "Surgery Ward" },
  { id: "ward_peds", labelAr: "تنويم الأطفال", labelEn: "Pediatrics Ward" },
  { id: "ward_obgyn", labelAr: "تنويم النساء والولادة", labelEn: "OB/GYN Ward" },
  { id: "ward_ortho", labelAr: "تنويم العظام", labelEn: "Orthopedics Ward" },
  { id: "ward_neuro", labelAr: "تنويم المخ والأعصاب", labelEn: "Neurology Ward" },
  { id: "icu", labelAr: "العناية المركزة", labelEn: "ICU" },
  { id: "nicu", labelAr: "عناية الأطفال حديثي الولادة", labelEn: "NICU" },
];

export default function IPDDashboard({ language, defaultModuleType = "ward_im", onOpenPatientChart }: { language: "ar" | "en"; defaultModuleType?: string, onOpenPatientChart?: (id: string, name: string, tab?: string) => void }) {
  const isAr = language === "ar";
  const { currentUser, patients: contextPatients } = useHIS();
  
  const [moduleType, setModuleType] = useState(defaultModuleType);
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedPatientId, setLocalSelectedPatientId] = useState<string | null>(null);

  const handleOpenChart = (pOrId: any) => {
    const p = typeof pOrId === "string" ? contextPatients.find(pat => pat.id === pOrId) : pOrId;
    if (!p) return;

    if (onOpenPatientChart) {
      onOpenPatientChart(p.id, isAr ? p.nameAr : p.nameEn);
    } else {
      setLocalSelectedPatientId(p.id);
    }
  };

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Unit Overview", ar: "نظرة عامة" },
    { id: "patients", icon: Users, en: "Patient List", ar: "قائمة المرضى" },
    { id: "beds", icon: BedDouble, en: "Bed Map", ar: "خارطة الأسرة" },
    { id: "admission", icon: UserPlus, en: "Admission", ar: "طلب دخول" },
    { id: "search", icon: FileSearch, en: "Search Center", ar: "مركز البحث" },
    { id: "analytics", icon: BarChart3, en: "Analytics", ar: "التحليلات" },
    { id: "tasks", icon: ListTodo, en: "Ward Tasks", ar: "مهام القسم" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd]" dir={isAr ? "rtl" : "ltr"}>
      {/* IPD Module Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-indigo-100 border-2 border-indigo-50">
            <BedDouble className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isAr ? "الأقسام الداخلية (IPD)" : "Inpatient Department"}
              </h1>
              <select
                value={moduleType}
                onChange={(e) => setModuleType(e.target.value)}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full border border-indigo-100 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {MODULE_TYPES.map(mod => (
                  <option key={mod.id} value={mod.id}>
                    {isAr ? mod.labelAr : mod.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-bold text-slate-400">{isAr ? "نظام إدارة التنويم الموحد" : "Unified Inpatient System"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                   {isAr ? "متصل بالنظام المركزي" : "Connected to Central HIS"}
                 </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden xl:block">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder={isAr ? "بحث في القسم..." : "Search Ward..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-[18px] text-sm focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none w-72 transition-all"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl transition-all shadow-sm">
            <Bell className="w-6 h-6" />
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
            <Plus className="w-5 h-5" />
            <span className="hidden lg:block">{isAr ? "دخول مريض" : "New Admission"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Header */}
      <div className="bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
         <div className="flex gap-1">
            {mainTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setLocalSelectedPatientId(null);
                }}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeMainTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeMainTab === tab.id ? "text-indigo-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeMainTab === tab.id && (
                  <motion.div layoutId="ipd-tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {localSelectedPatientId ? (
            <motion.div 
               key="ipd-clinical"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="h-full flex flex-col"
            >
               <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                     <button onClick={() => setLocalSelectedPatientId(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                     </button>
                     <div className="w-[1px] h-8 bg-slate-200" />
                     <div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight">{isAr ? "معاينة الملف الطبي (IPD)" : "Inpatient Clinical Desktop"}</h3>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{isAr ? "إدارة حالة مريض منوم" : "Mode: Ward Round Management"}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="px-5 py-2 bg-slate-100 text-slate-600 rounded-[14px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">
                        {isAr ? "تحويل قسم" : "Dept Transfer"}
                     </button>
                     <button className="px-5 py-2 bg-indigo-600 text-white rounded-[14px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                        {isAr ? "خروج سريري" : "Clinical Discharge"}
                     </button>
                  </div>
               </div>
               <div className="flex-1 overflow-hidden">
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
            <div className="h-full overflow-y-auto no-scrollbar p-8">
              {activeMainTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                   <InpatientMetrics language={language} moduleType={moduleType} />
                </motion.div>
              )}
              
              {activeMainTab === "patients" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <PatientList language={language} moduleType={moduleType} onPatientSelect={handleOpenChart} />
                </motion.div>
              )}

              {activeMainTab === "beds" && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                   <BedManagement language={language} moduleType={moduleType} />
                </motion.div>
              )}

              {activeMainTab === "admission" && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                   <AdmissionForm language={language} moduleType={moduleType} />
                </motion.div>
              )}

              {activeMainTab === "search" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto py-12"
                >
                   <div className="text-center space-y-4 mb-12">
                      <div className="w-24 h-24 bg-indigo-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-indigo-100">
                         <FileSearch className="w-12 h-12 text-indigo-600" />
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{isAr ? "مركز البحث المتقدم (IPD)" : "Inpatient Advanced Search"}</h2>
                      <p className="text-slate-500 font-bold text-lg max-w-md mx-auto">{isAr ? "ابحث في سجلات التنويم، الحركات السريرية، وتواريخ الدخول" : "Search through admission logs, clinical movements, and occupancy history"}</p>
                   </div>
                   
                   <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-10 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الاسم أو الرقم الطبي" : "Patient Name / MRN"}</label>
                            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-[24px] p-5 text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all focus:bg-white" placeholder="Search..." />
                         </div>
                         <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "حالة التنويم" : "Admission Status"}</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-[24px] p-5 text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all focus:bg-white appearance-none">
                               <option>All Active</option>
                               <option>Discharged</option>
                               <option>Pending Admission</option>
                               <option>Reserved</option>
                            </select>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                         <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-all">{isAr ? "إعادة تعيين" : "Reset Filters"}</button>
                         <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-[24px] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-4">
                            <Search className="w-6 h-6" />
                            <span className="text-lg">{isAr ? "بحث متقدم" : "Execute Search"}</span>
                         </button>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeMainTab === "analytics" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <ReportsDashboard language={language} moduleType={moduleType} />
                </motion.div>
              )}

              {activeMainTab === "tasks" && (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
                   <div className="w-32 h-32 bg-slate-100 rounded-[48px] flex items-center justify-center shadow-inner border border-slate-200">
                      <ListTodo className="w-16 h-16 text-slate-300" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{isAr ? "مهام القسم (Ward Tasks)" : "Departmental Task Hub"}</h2>
                      <p className="text-slate-400 font-bold max-w-md mx-auto mt-4 leading-relaxed uppercase tracking-widest text-sm">
                        {isAr ? "متابعة الطلبات المعلقة، الإحالات الداخلية، ومهام التمريض" : "Tracking pending orders, internal referrals, and nursing intervention tasks"}
                      </p>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-delay:0.4s]" />
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
