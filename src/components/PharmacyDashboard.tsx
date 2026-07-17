import React, { useState, useMemo } from "react";
import { 
  Pill, Activity, Box, RotateCcw, AlertTriangle, Syringe, CheckCircle2, 
  Shield, Trash2, LayoutDashboard, ListTodo, FileSearch, MoreVertical,
  ChevronRight, ArrowLeft, ArrowRight, Bell, Zap, Eye, FileOutput, Printer,
  Search, Filter, History, Package, Truck, Beaker
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";

export default function PharmacyDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const { currentUser, patients, prescriptions } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [selectedRxId, setSelectedRxId] = useState<string | null>(null);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Pharmacy Hub", ar: "مركز الصيدلة" },
    { id: "dispensing", icon: Activity, en: "Dispensing Queue", ar: "طابور الصرف" },
    { id: "clinical", icon: Shield, en: "Clinical Pharmacy", ar: "الصيدلة السريرية" },
    { id: "inventory", icon: Package, en: "Inventory", ar: "المخزون" },
    { id: "iv-prep", icon: Beaker, en: "IV Admixture", ar: "التحضير الوريدي" },
    { id: "search", icon: FileSearch, en: "Search Center", ar: "مركز البحث" },
  ];

  const pharmStats = [
    { label: isAr ? "الوصفات النشطة" : "Active Rx", value: prescriptions.filter(p => p.status === 'pending').length.toString(), change: "+4", icon: Pill, color: "emerald" },
    { label: isAr ? "تحذيرات تفاعل" : "Interaction Alerts", value: "12", change: "+2", icon: AlertTriangle, color: "rose" },
    { label: isAr ? "نقص مخزون" : "Stock Outs", value: "8", change: "-3", icon: Package, color: "amber" },
    { label: isAr ? "متوسط وقت الصرف" : "Avg Dispense", value: "18m", change: "-2m", icon: Clock, color: "blue" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* Pharmacy Module Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between shadow-sm z-30 gap-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-emerald-600 rounded-[18px] sm:rounded-[22px] flex items-center justify-center shadow-xl shadow-emerald-100 border-2 border-emerald-50">
            <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                {isAr ? "نظام إدارة الصيدلية (PIS)" : "Pharmacy Information System"}
              </h1>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full border border-emerald-100 uppercase tracking-widest shrink-0">
                v6.0
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
              <span className="text-xs sm:text-sm font-bold text-slate-400 truncate">{isAr ? "إدارة الصرف، المخزون، والصيدلة السريرية" : "Dispensing, Inventory & Clinical Care"}</span>
              <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full" />
                <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {isAr ? "نظام آلي" : "Pyxis/Omnicell Linked"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
           <button className="flex-1 lg:flex-none p-3 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all shadow-sm flex items-center justify-center">
             <Bell className="w-5 h-5 sm:w-6 h-6" />
           </button>
           <button className="flex-[3] lg:flex-none px-4 sm:px-6 py-3 bg-emerald-600 text-white rounded-[16px] sm:rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 text-xs">
             <Zap className="w-4 h-4 sm:w-5 h-5 text-emerald-200" />
             <span>{isAr ? "صرف سريع" : "Rapid Dispense"}</span>
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 overflow-x-auto no-scrollbar sticky top-0 z-20">
         <div className="flex px-4 sm:px-8 min-w-max">
            {mainTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setSelectedRxId(null);
                }}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeMainTab === tab.id ? "text-emerald-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeMainTab === tab.id ? "text-emerald-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeMainTab === tab.id && (
                  <motion.div layoutId="pharm-tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedRxId ? (
             <motion.div 
               key="pharm-details"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="h-full flex flex-col"
             >
                <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedRxId(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                      </button>
                      <div className="w-[1px] h-8 bg-slate-200" />
                      <div>
                         <h3 className="text-lg font-black text-slate-800 tracking-tight">{isAr ? "مراجعة الصيدلي السريري" : "Clinical Pharmacy Verification"}</h3>
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{isAr ? "وصفة رقم: " + selectedRxId : "Rx Number: " + selectedRxId}</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-2.5 bg-rose-50 text-rose-600 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100">
                        {isAr ? "رفض / تدخل" : "Reject / Intervene"}
                      </button>
                      <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-[14px] text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
                        {isAr ? "اعتماد وصرف" : "Verify & Dispense"}
                      </button>
                   </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                   <div className="max-w-5xl mx-auto space-y-6">
                      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">{isAr ? "فحص التداخلات الدوائية" : "Drug-Drug Interaction Check"}</h4>
                         <div className="space-y-4">
                            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-6">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-emerald-200 shadow-sm">
                                  <Shield className="w-6 h-6 text-emerald-600" />
                               </div>
                               <div>
                                  <h5 className="font-black text-emerald-900">{isAr ? "لا توجد تداخلات خطيرة" : "No Major Interactions Detected"}</h5>
                                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">{isAr ? "بناءً على تاريخ المريض والوصفات النشطة" : "Based on patient history & active orders"}</p>
                               </div>
                            </div>
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
                       {pharmStats.map((stat, i) => (
                         <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                               <div className={`p-4 bg-${stat.color}-50 rounded-2xl border border-${stat.color}-100`}>
                                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                               </div>
                               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
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
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "طابور الصرف السريري" : "Clinical Dispensing Queue"}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "وصفات تتطلب مراجعة صيدلانية" : "Rx Requiring Pharmacist Validation"}</p>
                             </div>
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all"><MoreVertical className="w-6 h-6" /></button>
                          </div>
                          <div className="space-y-4">
                             {prescriptions.filter(p => p.status === 'pending').slice(0, 4).map((rx, i) => {
                               const patient = patients.find(pat => pat.id === rx.patientId);
                               return (
                                 <div key={rx.id} className="group p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all flex items-center justify-between cursor-pointer" onClick={() => setSelectedRxId(rx.id)}>
                                    <div className="flex items-center gap-5">
                                       <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-lg border border-emerald-200">
                                          <Pill className="w-6 h-6" />
                                       </div>
                                       <div>
                                          <h4 className="font-black text-slate-800 text-base leading-tight">
                                             <GlobalEntityLink entityId={rx.patientId} entityName={patient ? (isAr ? patient.nameAr : patient.nameEn) : "Unknown"} entityType="patient" isAr={isAr}>
                                                {patient ? (isAr ? patient.nameAr : patient.nameEn) : "Unknown"}
                                             </GlobalEntityLink>
                                          </h4>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{rx.id} • {rx.medication} • {rx.dose}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                       <div className="text-right">
                                          <span className="block text-[10px] font-black text-slate-400 uppercase">Wait</span>
                                          <span className="text-xs font-black text-emerald-600">8m</span>
                                       </div>
                                       <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                 </div>
                               );
                             })}
                          </div>
                       </div>

                       <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800">
                          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.15),transparent)] pointer-events-none" />
                          <div>
                             <div className="flex justify-between items-start mb-10">
                                <h3 className="text-2xl font-black tracking-tight leading-tight uppercase">{isAr ? "تحكم المخزون الذكي" : "Smart Stock Control"}</h3>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                   <Package className="w-6 h-6 text-emerald-400" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                {[
                                  { name: "Augmentin 1g Tab", status: "Low Stock", qty: "42" },
                                  { name: "Insulin Lantus", status: "Critical", qty: "8" },
                                  { name: "Paracetamol 500", status: "Normal", qty: "1.2k" },
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                                     <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.status}</p>
                                        <p className="font-black text-sm">{item.name}</p>
                                     </div>
                                     <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${item.status === 'Critical' ? 'bg-rose-500/20 text-rose-400' : item.status === 'Low Stock' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        Qty: {item.qty}
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 mt-10">
                             {isAr ? "إنشاء طلب توريد" : "Generate Purchase Order"}
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "dispensing" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                       <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "طابور الصرف الموحد" : "Unified Dispensing Worklist"}</h2>
                          <div className="flex gap-4">
                             <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="Search prescriptions..." className="pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                             </div>
                             <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-all"><Filter className="w-5 h-5" /></button>
                          </div>
                       </div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                   <th className="py-5 px-8">{isAr ? "رقم الوصفة" : "Rx ID"}</th>
                                   <th className="py-5 px-8">{isAr ? "المريض" : "Patient"}</th>
                                   <th className="py-5 px-8">{isAr ? "الدواء" : "Medication"}</th>
                                   <th className="py-5 px-8">{isAr ? "الجرعة" : "Dose"}</th>
                                   <th className="py-5 px-8">{isAr ? "الحالة" : "Status"}</th>
                                   <th className="py-5 px-8 text-right">{isAr ? "الإجراء" : "Action"}</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {prescriptions.slice(0, 8).map((rx, i) => {
                                  const patient = patients.find(pat => pat.id === rx.patientId);
                                  return (
                                    <tr key={rx.id} className="group hover:bg-slate-50/50 transition-all">
                                       <td className="py-5 px-8 font-mono text-xs font-black text-emerald-600">{rx.id}</td>
                                       <td className="py-5 px-8">
                                          <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs uppercase">{patient ? patient.nameEn[0] : "?"}</div>
                                             <div>
                                                <p className="text-sm font-black text-slate-800">
                                                   <GlobalEntityLink entityId={rx.patientId} entityName={patient ? (isAr ? patient.nameAr : patient.nameEn) : "Unknown"} entityType="patient" isAr={isAr}>
                                                      {patient ? (isAr ? patient.nameAr : patient.nameEn) : "Unknown"}
                                                   </GlobalEntityLink>
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{patient?.mrn}</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="py-5 px-8 text-xs font-bold text-slate-600">{rx.medication}</td>
                                       <td className="py-5 px-8 text-xs text-slate-500">{rx.dose}</td>
                                       <td className="py-5 px-8">
                                          <div className="flex items-center gap-2">
                                             <div className={`w-2 h-2 rounded-full ${rx.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{rx.status}</span>
                                          </div>
                                       </td>
                                       <td className="py-5 px-8 text-right">
                                          <button onClick={() => setSelectedRxId(rx.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 opacity-0 group-hover:opacity-100 transition-all active:scale-95">
                                             {isAr ? "مراجعة وصرف" : "Review & Dispense"}
                                          </button>
                                       </td>
                                    </tr>
                                  );
                                })}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </motion.div>
               )}

               {["clinical", "inventory", "iv-prep", "search"].includes(activeMainTab) && (
                 <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
                    <div className="w-32 h-32 bg-emerald-50 rounded-[48px] flex items-center justify-center shadow-inner border border-emerald-100">
                       {mainTabs.find(t => t.id === activeMainTab)?.icon && React.createElement(mainTabs.find(t => t.id === activeMainTab)!.icon, { className: "w-16 h-16 text-emerald-300" })}
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{isAr ? "مزامنة الصيدلية" : "Pharmacy System Sync"}</h2>
                       <p className="text-slate-400 font-bold max-w-md mx-auto mt-4 leading-relaxed uppercase tracking-widest text-sm">
                         {isAr ? "يتم الآن ربط موديول " + activeMainTab + " ضمن نظام الصيدلة الموحد" : "Linking " + activeMainTab + " data layer into the unified pharmacy framework"}
                       </p>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
                       <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                       <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce [animation-delay:0.4s]" />
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

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
