import React, { useState, useMemo } from "react";
import { Plus, 
  Bone, Search, Filter, Calendar, Camera, 
  FileText, CheckCircle2, AlertTriangle, Monitor,
  Upload, Scan, Activity, Maximize2, Layers,
  LayoutDashboard, ListTodo, FileSearch, MoreVertical,
  ChevronRight, ArrowLeft, ArrowRight, Bell, Zap,
  Eye, FileOutput, Printer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";

export default function RadiologyDashboard({ language, onClose }: { language: "ar" | "en", onClose?: () => void }) {
  const isAr = language === "ar";
  const { currentUser, patients } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Imaging Hub", ar: "مركز الأشعة" },
    { id: "worklist", icon: Activity, en: "Modality Worklist", ar: "قائمة العمل" },
    { id: "pacs", icon: Monitor, en: "PACS Viewer", ar: "نظام الأرشفة" },
    { id: "reporting", icon: FileText, en: "Reporting", ar: "التقارير" },
    { id: "scheduling", icon: Calendar, en: "Scheduling", ar: "المواعيد" },
    { id: "search", icon: FileSearch, en: "Search Center", ar: "مركز البحث" },
  ];

  const radStats = [
    { label: isAr ? "إجمالي الفحوصات" : "Total Studies", value: "482", change: "+8%", icon: Camera, color: "cyan" },
    { label: isAr ? "بانتظار التقرير" : "Unreported", value: "24", change: "+3", icon: FileText, color: "amber" },
    { label: isAr ? "حالات طارئة" : "STAT Cases", value: "9", change: "-2", icon: AlertTriangle, color: "rose" },
    { label: isAr ? "متوسط TAT" : "Avg TAT", value: "2.4h", change: "-15m", icon: Activity, color: "emerald" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* Radiology Module Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-900 rounded-[22px] flex items-center justify-center shadow-xl shadow-slate-100 border-2 border-slate-800">
            <Bone className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isAr ? "الأشعة والتصوير الطبي (RIS/PACS)" : "Radiology Information System"}
              </h1>
              <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-black rounded-full border border-cyan-100 uppercase tracking-widest">
                Enterprise Edition v5.0
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-bold text-slate-400">{isAr ? "نظام الأرشفة والتقارير الموحد" : "Unified Archiving & Reporting"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {isAr ? "الأجهزة متصلة" : "Modalities Linked"}
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
           <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-cyan-600 rounded-2xl transition-all shadow-sm">
             <Bell className="w-6 h-6" />
           </button>
           <button className="px-6 py-3 bg-slate-900 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center gap-2 active:scale-95 border border-slate-800">
             <Upload className="w-5 h-5 text-cyan-400" />
             <span className="hidden lg:block text-white">{isAr ? "تحميل دراسة" : "Upload Study"}</span>
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
                  setSelectedStudyId(null);
                }}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeMainTab === tab.id ? "text-cyan-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeMainTab === tab.id ? "text-cyan-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeMainTab === tab.id && (
                  <motion.div layoutId="rad-tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-cyan-600 rounded-t-full" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedStudyId ? (
             <motion.div 
               key="rad-details"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="h-full flex flex-col bg-black text-white"
             >
                <div className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between shadow-sm z-10">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedStudyId(null)} className="p-3 hover:bg-slate-800 rounded-2xl transition-all text-slate-400">
                        <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                      </button>
                      <div className="w-[1px] h-8 bg-slate-800" />
                      <div>
                         <h3 className="text-lg font-black text-white tracking-tight">{isAr ? "عارض الأشعة التشخيصي" : "Diagnostic PACS Viewer"}</h3>
                         <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{isAr ? "رقم الدراسة: " + selectedStudyId : "Study ID: " + selectedStudyId}</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700">
                        {isAr ? "أدوات القياس" : "Measurement Tools"}
                      </button>
                      <button className="px-6 py-2.5 bg-cyan-600 text-white rounded-[14px] text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-900/50 hover:bg-cyan-700 transition-all">
                        {isAr ? "كتابة التقرير" : "Write Report"}
                      </button>
                   </div>
                </div>
                <div className="flex-1 flex overflow-hidden">
                   {/* PACS Sidebar Tools */}
                   <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 gap-6">
                      <button className="p-3 text-cyan-400 hover:bg-slate-800 rounded-xl transition-all"><Monitor className="w-6 h-6" /></button>
                      <button className="p-3 text-slate-500 hover:bg-slate-800 rounded-xl transition-all"><Maximize2 className="w-6 h-6" /></button>
                      <button className="p-3 text-slate-500 hover:bg-slate-800 rounded-xl transition-all"><Layers className="w-6 h-6" /></button>
                      <div className="w-8 h-[1px] bg-slate-800" />
                      <button className="p-3 text-slate-500 hover:bg-slate-800 rounded-xl transition-all"><Printer className="w-6 h-6" /></button>
                   </div>
                   {/* PACS Main Viewport */}
                   <div className="flex-1 bg-black p-8 flex items-center justify-center">
                      <div className="relative aspect-square max-h-full max-w-full bg-slate-900 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center group cursor-crosshair">
                         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-50"></div>
                         <div className="w-2/3 h-2/3 bg-slate-800/40 rounded-[45%] blur-3xl animate-pulse"></div>
                         <div className="absolute top-8 left-8 text-xs font-mono text-cyan-500/80 space-y-1">
                            <p className="font-black text-sm text-cyan-400">AHMED YOUSSEF</p>
                            <p>MRN: 902181</p>
                            <p>DOB: 1978-04-12</p>
                         </div>
                         <div className="absolute top-8 right-8 text-xs font-mono text-cyan-500/80 text-right space-y-1">
                            <p className="font-black text-sm text-cyan-400 uppercase">MRI BRAIN W/O CONTRAST</p>
                            <p>Se: 3 / Im: 42</p>
                            <p>Axial T2 FSE</p>
                         </div>
                         <div className="absolute bottom-8 left-8 text-xs font-mono text-cyan-500/80">
                            <p>WL: 500 / WW: 1000</p>
                            <p>Zoom: 1.2x</p>
                         </div>
                         <div className="absolute bottom-8 right-8 text-xs font-mono text-cyan-500/80 text-right uppercase tracking-widest">
                            <p>Enterprise PACS</p>
                            <p className="text-indigo-400">High Res</p>
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
                       {radStats.map((stat, i) => (
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
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "قائمة العمل الحديثة" : "Recent Study Worklist"}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "فحوصات بانتظار التقرير" : "Awaiting Reporting Workflow"}</p>
                             </div>
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-cyan-600 rounded-2xl transition-all"><MoreVertical className="w-6 h-6" /></button>
                          </div>
                          <div className="space-y-4">
                             {patients.slice(0, 4).map((p, i) => (
                               <div key={p.id} className="group p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-cyan-100 transition-all flex items-center justify-between cursor-pointer" onClick={() => setSelectedStudyId('RAD-' + (500 + i))}>
                                  <div className="flex items-center gap-5">
                                     <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center font-black text-lg border border-cyan-200">
                                        <Camera className="w-6 h-6" />
                                     </div>
                                     <div>
                                        <h4 className="font-black text-slate-800 text-base leading-tight">
                                           <GlobalEntityLink entityId={p.id} entityName={isAr ? p.nameAr : p.nameEn} entityType="patient" isAr={isAr}>
                                              {isAr ? p.nameAr : p.nameEn}
                                           </GlobalEntityLink>
                                        </h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">RAD-{500+i} • CT Chest • STAT</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <div className="text-right">
                                        <span className="block text-[10px] font-black text-slate-400 uppercase">Wait</span>
                                        <span className="text-xs font-black text-cyan-600">4m</span>
                                     </div>
                                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800">
                          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.15),transparent)] pointer-events-none" />
                          <div>
                             <div className="flex justify-between items-start mb-10">
                                <h3 className="text-2xl font-black tracking-tight leading-tight uppercase">{isAr ? "حالة الأجهزة" : "Modality Status"}</h3>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                   <Monitor className="w-6 h-6 text-cyan-400" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                {[
                                  { name: "MRI Siemens 3T", status: "Online", load: "High" },
                                  { name: "CT GE Revolution", status: "Maintenance", load: "Off" },
                                  { name: "XR Philips Digital", status: "Online", load: "Normal" },
                                ].map((an, i) => (
                                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                                     <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{an.status}</p>
                                        <p className="font-black text-sm">{an.name}</p>
                                     </div>
                                     <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${an.load === 'High' ? 'bg-rose-500/20 text-rose-400' : an.load === 'Normal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                        Load: {an.load}
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 mt-10">
                             {isAr ? "عرض جدول الصيانة" : "View Maintenance Schedule"}
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "worklist" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                       <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "قائمة عمل القسم" : "Department Modality Worklist"}</h2>
                          <div className="flex gap-4">
                             <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="Search orders..." className="pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                             </div>
                             <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-cyan-600 transition-all"><Filter className="w-5 h-5" /></button>
                          </div>
                       </div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                   <th className="py-5 px-8">{isAr ? "رقم الطلب" : "Order ID"}</th>
                                   <th className="py-5 px-8">{isAr ? "المريض" : "Patient"}</th>
                                   <th className="py-5 px-8">{isAr ? "نوع الفحص" : "Study Type"}</th>
                                   <th className="py-5 px-8">{isAr ? "الأولوية" : "Priority"}</th>
                                   <th className="py-5 px-8">{isAr ? "الحالة" : "Status"}</th>
                                   <th className="py-5 px-8 text-right">{isAr ? "الإجراء" : "Action"}</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {patients.slice(0, 8).map((p, i) => (
                                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-all">
                                     <td className="py-5 px-8 font-mono text-xs font-black text-cyan-600">RAD-{500 + i}</td>
                                     <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs uppercase">{p.nameEn[0]}</div>
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
                                     <td className="py-5 px-8 text-xs font-bold text-slate-600">MRI Knee w/o Contrast</td>
                                     <td className="py-5 px-8">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${i % 3 === 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                                          {i % 3 === 0 ? 'Urgent' : 'Routine'}
                                        </span>
                                     </td>
                                     <td className="py-5 px-8">
                                        <div className="flex items-center gap-2">
                                           <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-cyan-500' : 'bg-amber-500'}`} />
                                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{i % 2 === 0 ? 'Acquisition' : 'Scheduled'}</span>
                                        </div>
                                     </td>
                                     <td className="py-5 px-8 text-right">
                                        <button onClick={() => setSelectedStudyId('RAD-' + (500 + i))} className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-100 opacity-0 group-hover:opacity-100 transition-all active:scale-95">
                                           {isAr ? "فتح الدراسة" : "Open Study"}
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

               {["pacs", "reporting", "scheduling", "search"].includes(activeMainTab) && (
                 <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
                    <div className="w-32 h-32 bg-cyan-50 rounded-[48px] flex items-center justify-center shadow-inner border border-cyan-100">
                       {mainTabs.find(t => t.id === activeMainTab)?.icon && React.createElement(mainTabs.find(t => t.id === activeMainTab)!.icon, { className: "w-16 h-16 text-cyan-300" })}
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{isAr ? "مزامنة الأنظمة" : "PACS/RIS Sync"}</h2>
                       <p className="text-slate-400 font-bold max-w-md mx-auto mt-4 leading-relaxed uppercase tracking-widest text-sm">
                         {isAr ? "يتم الآن ربط قاعدة بيانات " + activeMainTab + " ضمن نظام الأشعة الموحد" : "Linking " + activeMainTab + " data layer into the unified imaging framework"}
                       </p>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" />
                       <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                       <div className="w-2 h-2 bg-cyan-200 rounded-full animate-bounce [animation-delay:0.4s]" />
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
