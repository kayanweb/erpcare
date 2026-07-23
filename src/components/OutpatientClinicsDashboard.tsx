import React, { useState } from "react";
import {  User, Activity, FileText, Plus, Clock, Search, HeartPulse, Filter, Settings, FileEdit, LogIn, Calendar, FileCheck2, Syringe, UserPlus, FileSearch, ArrowUpRight, Bed, ClipboardList, LayoutDashboard, MessageSquare, ListTodo, History as HistoryIcon, FileOutput, Stethoscope , Users, ChevronRight } from "lucide-react";
import { PatientChartModal } from "./PatientChartModal";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { useHIS } from "../context/HISContext";
import { savePatient } from "../lib/storage";
import DepartmentTasks from "./DepartmentTasks";
import { motion, AnimatePresence } from "motion/react";

export default function OutpatientClinicsDashboard({ language, forceDepartmentId }: { language: "ar" | "en", forceDepartmentId?: string }) {
  const isAr = language === "ar";
  const { patients: contextPatients, setAdmissionRequests, setErQueue, updatePatientStatus, addPatient } = useHIS();
  
  const [selectedClinic, setSelectedClinic] = useState<string>(forceDepartmentId || "clinic-im");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const activeClinicPatients = ((contextPatients && Array.isArray(contextPatients)) ? contextPatients.filter(p => ["waiting", "triage", "doctor", "pharmacy", "completed"].includes(p.status)).map((p, idx) => ({
      id: p.id, mrn: p.mrn, name: p.nameEn, nameAr: p.nameAr, time: "11:00 AM", status: p.status, statusAr: p.status === 'triage' ? 'فرز' : p.status, type: "General", typeAr: "عام", doctor: "Dr. Ali"
    })) : []);

  const handleAdmissionRequest = (patient: any) => {
    setAdmissionRequests(prev => [...prev, {
      id: `REQ-${Date.now()}`, patientId: patient.mrn, patientName: isAr ? patient.nameAr : patient.name,
      wardId: "dept-im", diagnosis: "Pending Assessment from Clinic", status: "Pending", timestamp: new Date()
    }]);
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Admission Requested", titleAr: "تم إرسال طلب التنويم", type: "form" } }));
  };

  const handleERReferral = (patient: any) => {
    setErQueue(prev => [...prev, {
      id: `ER-${Date.now()}`, patientId: patient.mrn, patientName: isAr ? patient.nameAr : patient.name,
      esiScore: 2, status: "En Route to ER", timestamp: new Date()
    }]);
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Referred to ER", titleAr: "تم التحويل للطوارئ", type: "form" } }));
  };

  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Clinic Overview", ar: "نظرة عامة" },
    { id: "appointments", icon: Calendar, en: "Today's Schedule", ar: "مواعيد اليوم" },
    { id: "waiting", icon: Clock, en: "Waiting Hall", ar: "صالة الانتظار" },
    { id: "examination", icon: Stethoscope, en: "Examination Desk", ar: "مساحة الفحص" },
    { id: "recent", icon: HistoryIcon, en: "Recent History", ar: "السجل القريب" },
    { id: "tasks", icon: ListTodo, en: "Unit Tasks", ar: "مهام القسم" },
    { id: "reports", icon: FileOutput, en: "Operational KPI", ar: "مؤشرات الأداء" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* Clinic Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
           <div className="w-10 h-10 sm:w-14 sm:h-14 bg-sky-900 rounded-[22px] flex items-center justify-center shadow-xl shadow-sky-100 border-2 border-sky-800 shrink-0">
             <Stethoscope className="w-5 h-5 sm:w-8 sm:h-8 text-sky-400" />
           </div>
           <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                 <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                   {isAr ? "العيادات الخارجية (OPD)" : "Outpatient Medical Services"}
                 </h1>
                 <span className="px-3 py-1 bg-sky-50 text-sky-700 text-[10px] font-black rounded-full border border-sky-100 uppercase tracking-widest">
                   {selectedClinic.split('-')[1].toUpperCase()} Unit
                 </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                 <span className="text-sm font-bold text-slate-400">{isAr ? "إدارة العيادات المتخصصة" : "Unified Ambulatory Care Management"}</span>
                 <div className="w-1 h-1 bg-slate-300 rounded-full" />
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Operational</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
           <select 
             value={selectedClinic}
             onChange={(e) => setSelectedClinic(e.target.value)}
             className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-50 transition-all shadow-sm outline-none"
           >
             <option value="clinic-im">{isAr ? "عيادة الباطنة العامة" : "Internal Medicine Clinic"}</option>
             <option value="clinic-ped">{isAr ? "عيادة الأطفال" : "Pediatrics Clinic"}</option>
             <option value="clinic-cardio">{isAr ? "مركز طب القلب" : "Cardiology Center"}</option>
           </select>
           <button onClick={() => window.dispatchEvent(new CustomEvent('openPatientRegistration'))} className="px-8 py-3.5 bg-sky-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all active:scale-95 flex items-center gap-2">
             <Plus className="w-5 h-5" />
             <span>{isAr ? "تسجيل مريض" : "New Registration"}</span>
           </button>
        </div>
      </div>

      {/* Navigation Ribbon */}
      <div className="bg-white border-b border-slate-200 px-2 sm:px-8 flex items-center overflow-x-auto custom-scrollbar sticky top-0 z-20 overflow-x-auto no-scrollbar shrink-0">
         <div className="flex gap-2 min-w-max">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? "text-sky-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-sky-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeTab === tab.id && (
                  <motion.div 
                    
                    className="absolute bottom-0 left-0 right-0 h-1 bg-sky-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: isAr ? "إجمالي الحالات" : "Total Volume", value: activeClinicPatients.length, icon: Users, color: "sky", trend: "+12%" },
                  { label: isAr ? "في الانتظار" : "Waitlist", value: activeClinicPatients.filter(p => p.status === 'waiting' || p.status === 'triage').length, icon: Clock, color: "amber", trend: "Normal" },
                  { label: isAr ? "تحت الكشف" : "In Consultation", value: activeClinicPatients.filter(p => p.status === 'doctor').length, icon: Stethoscope, color: "emerald", trend: "Live" },
                  { label: isAr ? "متوسط الانتظار" : "Avg. Wait", value: "14m", icon: Activity, color: "indigo", trend: "-5m" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <div className={`p-4 bg-${stat.color}-50 rounded-2xl border border-${stat.color}-100`}>
                          <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                       </div>
                       <span className="text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">{stat.trend}</span>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                       <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase flex flex-wrap items-center gap-2 sm:gap-3">
                    <Calendar className="w-5 h-5 text-sky-600" />
                    {isAr ? "جدول مواعيد الفترة الحالية" : "Current Session Schedule"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                     <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search..." className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold w-64 outline-none focus:ring-4 focus:ring-sky-50 transition-all" />
                     </div>
                     <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-sky-600 transition-all shadow-sm"><Filter className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="py-5 px-8">{isAr ? "الوقت" : "Time"}</th>
                        <th className="py-5 px-8">{isAr ? "المريض" : "Patient Info"}</th>
                        <th className="py-5 px-8">{isAr ? "الطبيب" : "Provider"}</th>
                        <th className="py-5 px-8">{isAr ? "الحالة" : "Clinical Status"}</th>
                        <th className="py-5 px-8 text-right">{isAr ? "إدارة" : "Workflow"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {activeClinicPatients.map(p => (
                        <tr key={p.id} className="group hover:bg-sky-50/50 transition-all">
                          <td className="py-5 px-8 font-black text-sky-600 text-sm">{p.time}</td>
                          <td className="py-5 px-8">
                            <div>
                               <div className="font-black text-slate-800 group-hover:text-sky-700 transition-colors">
                                  <GlobalEntityLink entityId={p.id} entityName={isAr ? p.nameAr : p.name} entityType="patient" isAr={isAr}>
                                     {isAr ? p.nameAr : p.name}
                                  </GlobalEntityLink>
                               </div>
                               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{p.mrn}</div>
                            </div>
                          </td>
                          <td className="py-5 px-8">
                            <span className="text-xs font-black text-slate-700">{p.doctor}</span>
                          </td>
                          <td className="py-5 px-8">
                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                              p.status === 'waiting' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              p.status === 'triage' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                              'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {isAr ? p.statusAr : p.status}
                            </span>
                          </td>
                          <td className="py-5 px-8 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-sky-600 hover:border-sky-200 transition-all"><Stethoscope className="w-4 h-4" /></button>
                                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"><FileCheck2 className="w-4 h-4" /></button>
                                <button className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-all shadow-lg shadow-sky-100"><ChevronRight className="w-4 h-4" /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-12 text-center">
               <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-6" />
               <h3 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">{isAr ? "إدارة مواعيد العيادة" : "Full Clinic Calendar Management"}</h3>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Enterprise Scheduling Engine Enabled</p>
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <DepartmentTasks language={language} departmentId={selectedClinic} departmentName={isAr ? "العيادات الخارجية" : "Outpatient Clinics"} />
          )}

          {activeTab === "reports" && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { title: "Volume Distribution", icon: Users, val: "142 pts", desc: "Daily throughput vs target" },
                    { title: "Revenue Cycle", icon: FileOutput, val: "$42.4k", desc: "Claims processed today" },
                    { title: "Patient Satisfaction", icon: HeartPulse, val: "4.8/5", desc: "Post-consultation feedback" }
                  ].map((rpt, i) => (
                    <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                       <rpt.icon className="w-10 h-10 text-sky-600 mb-6 group-hover:scale-110 transition-transform" />
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{rpt.title}</h4>
                       <div className="text-3xl font-black text-slate-900 mb-4">{rpt.val}</div>
                       <p className="text-xs font-bold text-slate-500 leading-relaxed">{rpt.desc}</p>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ClinicInternalChat({ isAr, mode }: any) {
    return (
        <div className="flex h-[600px] border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
                <div className="p-4 border-b border-slate-200 bg-white">
                    <h3 className="font-bold text-slate-800">{isAr ? "المحادثات" : "Chats"}</h3>
                    <input type="text" placeholder={isAr ? "ابحث..." : "Search..."} className="w-full mt-2 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {[
                        { name: isAr ? "د. أحمد (باطنة)" : "Dr. Ahmed (Internal)", msg: isAr ? "هل يمكننا مناقشة المريض X؟" : "Can we discuss patient X?", time: "10:30 AM", active: true },
                        { name: isAr ? "طوارئ الاستقبال" : "ER Reception", msg: isAr ? "مريض محول للعيادة." : "Patient transferred to clinic.", time: "09:15 AM", active: false }
                    ].map((chat, i) => (
                        <div key={i} className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition ${chat.active ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-sm text-slate-800">{chat.name}</h4>
                                <span className="text-xs text-slate-400">{chat.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{chat.msg}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-2/3 flex flex-col" dir={isAr ? "rtl" : "ltr"}>
                <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">{isAr ? "د. أحمد (باطنة)" : "Dr. Ahmed (Internal)"}</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm max-w-[70%] shadow-sm text-sm text-slate-700">
                            {isAr ? "مرحباً، هل لديك وقت لمناقشة حالة المريض في الغرفة 3؟" : "Hi, do you have time to discuss the patient in room 3?"}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[70%] shadow-sm text-sm">
                            {isAr ? "نعم بالتأكيد، أرسل لي التفاصيل." : "Yes sure, send me the details."}
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-200 bg-white flex gap-2">
                    <input type="text" placeholder={isAr ? "اكتب رسالة..." : "Type a message..."} className="flex-1 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-700">{isAr ? "إرسال" : "Send"}</button>
                </div>
            </div>
        </div>
    )
}
