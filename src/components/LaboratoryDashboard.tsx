import React, { createElement, useState, useMemo } from "react";
import { 
  Microscope, Search, AlertTriangle, FlaskConical, ScanLine, X, Activity,
  TestTube, Box, CheckCircle2, Clock, BarChart3, Settings, Printer,
  Thermometer, MonitorPlay, Droplets, ArrowRightLeft, FileSpreadsheet,
  Download, Filter, ChevronDown, Check, Beaker, ListTodo, FileSearch,
  LayoutDashboard, UserPlus, History, MoreVertical, Eye, Bell, FileOutput,
  ArrowLeft, ArrowRight, Plus, ChevronRight, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";

export default function LaboratoryDashboard({ language, onClose }: { language: "ar" | "en", onClose?: () => void }) {
  const isAr = language === "ar";
  const { currentUser, patients } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Lab Analytics", ar: "تحليلات المختبر" },
    { id: "workqueue", icon: Activity, en: "Work Queue", ar: "قائمة العمل" },
    { id: "samples", icon: TestTube, en: "Sample Tracking", ar: "تتبع العينات" },
    { id: "phlebotomy", icon: Droplets, en: "Phlebotomy", ar: "سحب العينات" },
    { id: "inventory", icon: Box, en: "Inventory", ar: "المخزون" },
    { id: "qc", icon: BarChart3, en: "Quality Control", ar: "ضبط الجودة" },
    { id: "search", icon: FileSearch, en: "Search Center", ar: "مركز البحث" },
  ];

  const labStats = [
    { label: isAr ? "إجمالي العينات" : "Total Samples", value: "1,248", change: "+12%", icon: TestTube, color: "indigo" },
    { label: isAr ? "قيد المعالجة" : "Processing", value: "84", change: "+5%", icon: Activity, color: "blue" },
    { label: isAr ? "عينات حرجة" : "Critical Alerts", value: "6", change: "-2", icon: AlertTriangle, color: "rose" },
    { label: isAr ? "وقت الاستجابة (TAT)" : "Avg TAT", value: "42m", change: "-5m", icon: Clock, color: "emerald" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* LIS Module Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between shadow-sm z-30 gap-4 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 rounded-xl sm:rounded-[22px] flex items-center justify-center shadow-xl shadow-indigo-100 border-2 border-indigo-50 shrink-0">
            <Microscope className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                {isAr ? "نظام المختبرات (LIS)" : "Laboratory Information System"}
              </h1>
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-indigo-50 text-indigo-700 text-[8px] sm:text-[10px] font-black rounded-full border border-indigo-100 uppercase tracking-widest">
                v4.2
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
              <span className="text-xs sm:text-sm font-bold text-slate-400">{isAr ? "إدارة التحاليل" : "Lab Diagnostics"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full" />
                <span className="text-[8px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {isAr ? "متصل" : "Online"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end sm:justify-start">
           <button 
             onClick={onClose}
             className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm group shrink-0"
           >
              <Plus className="w-5 h-5 sm:w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
           </button>
           <button className="p-2 sm:p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-xl sm:rounded-2xl transition-all shadow-sm shrink-0">
             <Bell className="w-5 h-5 sm:w-6 h-6" />
           </button>
           <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-xl sm:rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm">
             <ScanLine className="w-4 h-4 sm:w-5 h-5" />
             <span>{isAr ? "مسح عينة" : "Scan Sample"}</span>
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 overflow-x-auto no-scrollbar shrink-0">
         <div className="flex gap-2 min-w-max">
            {mainTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setSelectedSampleId(null);
                }}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeMainTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 sm:w-4 h-4 ${activeMainTab === tab.id ? "text-indigo-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeMainTab === tab.id && (
                  <motion.div 
                    
                    className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {selectedSampleId ? (
             <motion.div 
               key="lis-details"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="h-full flex flex-col"
             >
                <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm z-10">
                   <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                      <button onClick={() => setSelectedSampleId(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                      </button>
                      <div className="w-[1px] h-8 bg-slate-200" />
                      <div>
                         <h3 className="text-lg font-black text-slate-800 tracking-tight">{isAr ? "إدخال نتائج التحليل" : "Lab Results Entry"}</h3>
                         <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{isAr ? "عينة: " + selectedSampleId : "Sample: " + selectedSampleId}</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-slate-200">
                        {isAr ? "إعادة تحليل" : "Re-Run Test"}
                      </button>
                      <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-[14px] text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                        {isAr ? "اعتماد النتائج" : "Validate Results"}
                      </button>
                   </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                   <div className="w-full space-y-6">
                      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">{isAr ? "البيانات المسجلة" : "Recorded Parameters"}</h4>
                         <div className="space-y-4">
                            {[
                              { id: "wbc", name: "WBC", value: "7.2", unit: "10^3/uL", range: "4.0 - 11.0", status: "normal" },
                              { id: "rbc", name: "RBC", value: "4.8", unit: "10^6/uL", range: "4.5 - 5.5", status: "normal" },
                              { id: "hgb", name: "HGB", value: "11.2", unit: "g/dL", range: "12.0 - 16.0", status: "low" },
                              { id: "plt", name: "PLT", value: "245", unit: "10^3/uL", range: "150 - 450", status: "normal" },
                            ].map((param) => (
                              <div key={param.id} className="grid grid-cols-5 gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                 <span className="font-black text-slate-700">{param.name}</span>
                                 <input type="text" defaultValue={param.value} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500" />
                                 <span className="text-xs font-bold text-slate-400">{param.unit}</span>
                                 <span className="text-xs font-bold text-slate-500">{param.range}</span>
                                 <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${param.status === 'normal' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 animate-pulse'}`}>
                                      {param.status}
                                    </span>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          ) : (
            <div className="h-full overflow-y-auto no-scrollbar p-3 sm:p-6 lg:p-8">
               {activeMainTab === "dashboard" && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {labStats.map((stat, i) => (
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                          <div className="flex justify-between items-center mb-10">
                             <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "العينات العاجلة والحرجة" : "Urgent & Critical Queue"}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "تتطلب اعتماد فوري" : "Requires Immediate Validation"}</p>
                             </div>
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-2xl transition-all"><MoreVertical className="w-6 h-6" /></button>
                          </div>
                          <div className="space-y-4">
                             {patients.slice(0, 4).map((p, i) => (
                               <div key={p.id} className="group p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all flex items-center justify-between cursor-pointer" onClick={() => setSelectedSampleId('SML-' + (1000 + i))}>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
                                     <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-black text-lg border border-rose-200">
                                        !
                                     </div>
                                     <div>
                                        <h4 className="font-black text-slate-800 text-base leading-tight">
                                           <GlobalEntityLink entityId={p.id} entityName={isAr ? p.nameAr : p.nameEn} entityType="patient" isAr={isAr}>
                                              {isAr ? p.nameAr : p.nameEn}
                                           </GlobalEntityLink>
                                        </h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SML-{1000+i} • CBC Panel • ER Dept</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <div className="text-right">
                                        <span className="block text-[10px] font-black text-slate-400 uppercase">Wait</span>
                                        <span className="text-xs font-black text-rose-600">12m</span>
                                     </div>
                                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
                          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(79,70,229,0.2),transparent)] pointer-events-none" />
                          <div>
                             <div className="flex justify-between items-start mb-10">
                                <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight uppercase">{isAr ? "تحكم جودة الأجهزة" : "Analyzer QC Monitor"}</h3>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                   <Zap className="w-6 h-6 text-amber-400" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                {[
                                  { name: "Sysmex XN-10", status: "Online", qc: "Pass" },
                                  { name: "Cobas 6000", status: "Calibration", qc: "Pending" },
                                  { name: "Abbott Alinity", status: "Online", qc: "Pass" },
                                ].map((an, i) => (
                                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                                     <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{an.status}</p>
                                        <p className="font-black text-sm">{an.name}</p>
                                     </div>
                                     <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${an.qc === 'Pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        QC: {an.qc}
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 mt-10">
                             {isAr ? "عرض تقرير الجودة الكامل" : "View Full QC Report"}
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "workqueue" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                       <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                          <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">{isAr ? "قائمة عمل المختبر" : "Clinical Work Queue"}</h2>
                          <div className="flex gap-4">
                             <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="Search samples..." className="pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                             </div>
                             <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><Filter className="w-5 h-5" /></button>
                          </div>
                       </div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                   <th className="py-5 px-8">{isAr ? "رقم العينة" : "Sample ID"}</th>
                                   <th className="py-5 px-8">{isAr ? "المريض" : "Patient"}</th>
                                   <th className="py-5 px-8">{isAr ? "الفحص" : "Test Name"}</th>
                                   <th className="py-5 px-8">{isAr ? "الأولوية" : "Priority"}</th>
                                   <th className="py-5 px-8">{isAr ? "الحالة" : "Status"}</th>
                                   <th className="py-5 px-8 text-right">{isAr ? "الإجراء" : "Action"}</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {patients.slice(0, 8).map((p, i) => (
                                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-all">
                                     <td className="py-5 px-8 font-mono text-xs font-black text-indigo-600">SML-{1000 + i}</td>
                                     <td className="py-5 px-8">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                           <div className="w-5 h-5 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs uppercase">{p.nameEn[0]}</div>
                                           <div>
                                              <p className="text-sm font-black text-slate-800">
                                                 <GlobalEntityLink entityId={p.id} entityName={isAr ? p.nameAr : p.nameEn} entityType="patient" isAr={isAr}>
                                                    {isAr ? p.nameAr : p.nameEn}
                                                 </GlobalEntityLink>
                                              </p>
                                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.mrn}</p>
                                           </div>
                                        </div>
                                     </td>
                                     <td className="py-5 px-8 text-xs font-bold text-slate-600">Renal Function Panel</td>
                                     <td className="py-5 px-8">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${i % 3 === 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                                          {i % 3 === 0 ? 'Urgent' : 'Routine'}
                                        </span>
                                     </td>
                                     <td className="py-5 px-8">
                                        <div className="flex items-center gap-2">
                                           <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{i % 2 === 0 ? 'In Progress' : 'Pending Reception'}</span>
                                        </div>
                                     </td>
                                     <td className="py-5 px-8 text-right">
                                        <button onClick={() => setSelectedSampleId('SML-' + (1000 + i))} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 opacity-0 group-hover:opacity-100 transition-all active:scale-95">
                                           {isAr ? "إدخال نتائج" : "Enter Results"}
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

               {activeMainTab === "phlebotomy" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                       <div className="flex justify-between items-center mb-10">
                          <div>
                             <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "مركز سحب العينات" : "Phlebotomy Center"}</h3>
                             <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "إدارة المرضى بانتظار سحب الدم" : "Patient Queue for Specimen Collection"}</p>
                          </div>
                          <div className="flex gap-4">
                             <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black border border-indigo-100">8 Waiting</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {patients.slice(0, 6).map((p, i) => (
                            <div key={p.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col justify-between group">
                               <div>
                                  <div className="flex justify-between items-start mb-4">
                                     <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                        {i + 1}
                                     </div>
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "رقم الانتظار" : "Queue No"}</span>
                                  </div>
                                  <h4 className="font-black text-slate-800 text-lg leading-tight mb-1">
                                     <GlobalEntityLink entityId={p.id} entityName={isAr ? p.nameAr : p.nameEn} entityType="patient" isAr={isAr}>
                                        {isAr ? p.nameAr : p.nameEn}
                                     </GlobalEntityLink>
                                  </h4>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{p.mrn} • Room 4</p>
                                  <div className="flex flex-wrap gap-2 mb-6">
                                     {["CBC", "CMP", "HbA1c"].map((test, ti) => (
                                       <span key={ti} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase">{test}</span>
                                     ))}
                                  </div>
                               </div>
                               <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm">
                                  {isAr ? "تم سحب العينة" : "Collect Sample"}
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "inventory" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                       <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                          <div>
                             <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">{isAr ? "مخزون الكواشف والمستهلكات" : "Reagents & Consumables Inventory"}</h2>
                             <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "مراقبة مستويات المخزون والتواريخ" : "Monitoring stock levels and expiration dates"}</p>
                          </div>
                          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                             <Plus className="w-4 h-4" />
                             <span>{isAr ? "طلب توريد" : "New Requisition"}</span>
                          </button>
                       </div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                   <th className="py-5 px-8">{isAr ? "المادة" : "Item Name"}</th>
                                   <th className="py-5 px-8">{isAr ? "التصنيف" : "Category"}</th>
                                   <th className="py-5 px-8">{isAr ? "الكمية الحالية" : "Current Stock"}</th>
                                   <th className="py-5 px-8">{isAr ? "تاريخ الانتهاء" : "Expiry"}</th>
                                   <th className="py-5 px-8">{isAr ? "الحالة" : "Status"}</th>
                                   <th className="py-5 px-8 text-right">{isAr ? "إجراء" : "Action"}</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {[
                                   { item: "CBC Reagent Pack (XN)", category: "Hematology", stock: "14 Units", expiry: "2025-12-10", status: "In Stock" },
                                   { item: "Glucose Hexokinase Kit", category: "Biochemistry", stock: "2 Units", expiry: "2025-08-22", status: "Low Stock" },
                                   { item: "CRP Immunoassay Cartridge", category: "Immunology", stock: "45 Units", expiry: "2026-02-15", status: "In Stock" },
                                   { item: "Urine Analysis Strips", category: "Urinalysis", stock: "0 Units", expiry: "N/A", status: "Out of Stock" },
                                ].map((item, i) => (
                                   <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                                      <td className="py-5 px-8">
                                         <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            <div className="w-5 h-5 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center text-indigo-600">
                                               <Box className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-slate-800">{item.item}</span>
                                         </div>
                                      </td>
                                      <td className="py-5 px-8 text-xs font-bold text-slate-500 uppercase tracking-widest">{item.category}</td>
                                      <td className="py-5 px-8 text-sm font-black text-slate-700">{item.stock}</td>
                                      <td className="py-5 px-8 text-xs font-bold text-slate-400">{item.expiry}</td>
                                      <td className="py-5 px-8">
                                         <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                           item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 
                                           item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 
                                           'bg-rose-100 text-rose-700'
                                         }`}>
                                            {item.status}
                                         </span>
                                      </td>
                                      <td className="py-5 px-8 text-right">
                                         <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all">
                                            <MoreVertical className="w-5 h-5" />
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

               {activeMainTab === "samples" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                       <div className="flex justify-between items-center mb-10">
                          <div>
                             <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "تتبع مسار العينات" : "Sample Lifecycle Tracking"}</h3>
                             <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "مراقبة موقع وحالة العينات حياً" : "Real-time monitoring of specimen location & status"}</p>
                          </div>
                          <div className="flex gap-4">
                             <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                                {isAr ? "تحديث المسار" : "Update Route"}
                             </button>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[
                             { id: "SML-9021", patient: patients[0], stage: "In Transit", location: "Courier B", time: "12m ago" },
                             { id: "SML-9022", patient: patients[1], stage: "Received", location: "Reception A", time: "5m ago" },
                             { id: "SML-9023", patient: patients[2], stage: "Processing", location: "Biochem Unit", time: "Just now" },
                             { id: "SML-9024", patient: patients[3], stage: "Delayed", location: "ER Pickup", time: "45m ago" },
                          ].map((s, i) => (
                             <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                                      <ScanLine className="w-5 h-5 text-indigo-600" />
                                   </div>
                                   <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${s.stage === 'Delayed' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                      {s.stage}
                                   </span>
                                </div>
                                <h4 className="font-black text-slate-800 text-base leading-tight mb-1 truncate">{isAr ? s.patient.nameAr : s.patient.nameEn}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{s.id}</p>
                                <div className="pt-4 border-t border-slate-100">
                                   <div className="flex items-center gap-2 mb-1">
                                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                      <span className="text-[10px] font-black text-slate-600 uppercase">{s.location}</span>
                                   </div>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase">{s.time}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "qc" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                       <div className="flex justify-between items-center mb-10">
                          <div>
                             <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "لوحة التحكم في الجودة" : "Quality Control Dashboard"}</h3>
                             <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "مراقبة منحنيات Levey-Jennings" : "Levey-Jennings Chart Monitoring"}</p>
                          </div>
                          <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                             <option>Sysmex XN-1000</option>
                             <option>Cobas 6000</option>
                          </select>
                       </div>
                       <div className="h-64 bg-slate-50 rounded-[32px] border border-slate-100 flex items-end justify-between p-8 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full border-y-2 border-slate-200/50 border-dashed pointer-events-none" />
                          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-indigo-500/20 pointer-events-none" />
                          {[40, 60, 45, 55, 50, 48, 52, 45, 70, 50, 45, 55, 60, 40].map((h, i) => (
                             <div key={i} className="flex flex-col items-center gap-2 group relative">
                                <motion.div 
                                   initial={{ height: 0 }} 
                                   animate={{ height: `${h}%` }} 
                                   className={`w-4 rounded-t-lg transition-all ${h > 65 || h < 35 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                                />
                                <span className="text-[8px] font-black text-slate-400 uppercase">D{i+1}</span>
                             </div>
                          ))}
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                          {[
                             { label: "Standard Deviation (SD)", value: "0.42", color: "indigo" },
                             { label: "Coefficient of Var (CV%)", value: "2.1%", color: "blue" },
                             { label: "Mean Deviation", value: "0.15", color: "emerald" },
                          ].map((metric, i) => (
                             <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{metric.label}</p>
                                <p className={`text-lg sm:text-2xl font-black text-${metric.color}-600`}>{metric.value}</p>
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
                          <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mb-4">{isAr ? "مركز أبحاث المختبر" : "Lab Search Center"}</h3>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                             {isAr ? "البحث في الأرشيف عن نتائج تاريخية، تقارير مجمعة، وإحصائيات وبائية" : "Search archives for historical results, aggregated reports, and epidemiological stats"}
                          </p>
                       </div>
                       <div className="max-w-3xl mx-auto flex flex-col gap-8">
                          <div className="relative">
                             <Search className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500" />
                             <input 
                                type="text" 
                                placeholder={isAr ? "ابحث برقم العينة، المريض، أو نوع التحليل..." : "Search by Sample ID, Patient, or Test type..."} 
                                className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] text-lg font-bold outline-none focus:border-indigo-500/30 focus:bg-white transition-all shadow-inner"
                             />
                             <button className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                                {isAr ? "بحث متقدم" : "Advanced Search"}
                             </button>
                          </div>
                          <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                             {[
                                { label: isAr ? "تحاليل CBC" : "CBC Panels", icon: Droplets },
                                { label: isAr ? "كيمياء حيوية" : "Biochemistry", icon: FlaskConical },
                                { label: isAr ? "هرمونات" : "Hormones", icon: Beaker },
                                { label: isAr ? "تراكمي" : "HbA1c Archive", icon: History },
                             ].map((cat, i) => (
                                <button key={i} className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500/50 hover:shadow-xl transition-all flex flex-col items-center gap-3 group">
                                   <cat.icon className="w-5 h-5 sm:w-8 sm:h-8 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600">{cat.label}</span>
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
