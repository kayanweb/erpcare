import React, { useState } from "react";
import {  User, Activity, FileText, Plus, Clock, Search, HeartPulse, Filter, Settings, FileEdit, LogIn, Calendar, FileCheck2, Syringe, UserPlus, FileSearch, ArrowUpRight, Bed, ClipboardList, LayoutDashboard, MessageSquare, ListTodo, History as HistoryIcon, FileOutput, Stethoscope , Users } from "lucide-react";
import { PatientChartModal } from "./PatientChartModal";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { useHIS } from "../context/HISContext";
import { savePatient } from "../lib/storage";
import DepartmentTasks from "./DepartmentTasks";

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
    { id: "dashboard", icon: LayoutDashboard, en: "Dashboard", ar: "لوحة القيادة" },
    { id: "appointments", icon: Calendar, en: "Today's Appointments", ar: "مواعيد اليوم" },
    { id: "waiting", icon: Clock, en: "Waiting Queue", ar: "طابور الانتظار" },
    { id: "examination", icon: Stethoscope, en: "Examination Workspace", ar: "مساحة الفحص" },
    { id: "recent", icon: HistoryIcon, en: "Recent Patients", ar: "المرضى السابقين" },
    { id: "tasks", icon: ListTodo, en: "Tasks & Follow-ups", ar: "المهام والمتابعات" },
    { id: "chat", icon: MessageSquare, en: "Internal Chat", ar: "المحادثة الداخلية" },
    { id: "reports", icon: FileOutput, en: "Reports", ar: "التقارير" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a4275] flex items-center gap-3">
            <Activity className="w-7 h-7 text-sky-500" />
            {isAr ? "العيادات الخارجية (OPD)" : "Outpatient Clinics (OPD)"}
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            {isAr ? "مساحة العمل المتكاملة لإدارة العيادات" : "Integrated Clinical Workspace"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="clinic-im">{isAr ? "عيادة الباطنة" : "Internal Medicine"}</option>
            <option value="clinic-ped">{isAr ? "عيادة الأطفال" : "Pediatrics"}</option>
            <option value="clinic-cardio">{isAr ? "عيادة القلب" : "Cardiology"}</option>
            <option value="clinic-ortho">{isAr ? "عيادة العظام" : "Orthopedics"}</option>
            <option value="clinic-obgyn">{isAr ? "عيادة النساء والولادة" : "OB/GYN"}</option>
          </select>
          <button onClick={() => window.dispatchEvent(new CustomEvent('openPatientRegistration'))} className="bg-[#0a4275] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0a4275]/90 transition shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {isAr ? "تسجيل مريض جديد" : "New Patient Registration"}
          </button>
        </div>
      </div>

      {/* Workspace Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0 overflow-x-auto custom-scrollbar">
        <div className="flex space-x-1 space-x-reverse min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? "border-[#0a4275] text-[#0a4275]" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-sky-500" : ""}`} />
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold">{isAr ? "إجمالي المرضى" : "Total Patients"}</p>
                <h3 className="text-3xl font-black text-[#0a4275] mt-1">{activeClinicPatients.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold">{isAr ? "في الانتظار" : "Waiting"}</p>
                <h3 className="text-3xl font-black text-amber-600 mt-1">{activeClinicPatients.filter(p => p.status === ('waiting' as any) || p.status === 'triage').length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold">{isAr ? "المنتهين" : "Completed"}</p>
                <h3 className="text-3xl font-black text-emerald-600 mt-1">12</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <FileCheck2 className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold">{isAr ? "الوقت التقديري" : "Avg. Wait Time"}</p>
                <h3 className="text-3xl font-black text-indigo-600 mt-1">14<span className="text-base text-slate-500 ml-1">{isAr ? "دقيقة" : "min"}</span></h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {(activeTab === "appointments" || activeTab === "dashboard") && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-500" />
                {isAr ? "مواعيد اليوم" : "Today's Appointments"}
              </h2>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder={isAr ? "بحث برقم الملف أو الاسم..." : "Search MRN or Name..."}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" dir={isAr ? "rtl" : "ltr"}>
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4">{isAr ? "الوقت" : "Time"}</th>
                    <th className="p-4">{isAr ? "المريض" : "Patient"}</th>
                    <th className="p-4">{isAr ? "الطبيب" : "Doctor"}</th>
                    <th className="p-4">{isAr ? "النوع" : "Type"}</th>
                    <th className="p-4">{isAr ? "الحالة" : "Status"}</th>
                    <th className="p-4 text-center">{isAr ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeClinicPatients.map(patient => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition group">
                      <td className="p-4 text-sm font-bold text-slate-700 whitespace-nowrap">
                        {patient.time}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-[#0a4275]">
                          <GlobalEntityLink entityId={patient.id} entityName={isAr ? patient.nameAr : patient.name} entityType="patient" isAr={isAr}>
                            {isAr ? patient.nameAr : patient.name}
                          </GlobalEntityLink>
                        </div>
                        <div className="text-xs text-slate-500">
                          <GlobalEntityLink entityId={patient.id} entityName={isAr ? patient.nameAr : patient.name} entityType="patient" isAr={isAr}>
                            {patient.mrn}
                          </GlobalEntityLink>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-700">
                        <GlobalEntityLink entityName={patient.doctor} entityType="doctor" isAr={isAr}>
                          {patient.doctor}
                        </GlobalEntityLink>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200">
                          {isAr ? patient.typeAr : patient.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          (patient.status as string) === 'waiting' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          (patient.status as string) === 'in-progress' ? 'bg-sky-100 text-sky-700 border-sky-200' :
                          'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                          {isAr ? patient.statusAr : patient.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => {
                              updatePatientStatus(patient.id, 'triage');
                              window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Triage Started", titleAr: "بدء الفرز", type: "form" } }));
                            }}
                            className="px-2 py-1 text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 rounded transition" title={isAr ? "بدء الفرز" : "Start Triage"}
                          >
                            {isAr ? "فرز" : "Triage"}
                          </button>
                          <button 
                            onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: patient.id, patientName: patient.name, initialTab: "progress_notes" } }))}
                            className="px-2 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded transition" title={isAr ? "بدء الكشف" : "Consultation"}
                          >
                            {isAr ? "كشف" : "Consult"}
                          </button>
                          <button 
                            onClick={() => handleAdmissionRequest(patient)}
                            className="px-2 py-1 text-xs font-bold bg-sky-100 text-sky-700 hover:bg-sky-200 rounded transition flex items-center gap-1" title={isAr ? "طلب تنويم داخلي" : "IPD Admission Request"}
                          >
                            <Bed className="w-3 h-3" />
                            {isAr ? "تنويم" : "Admit"}
                          </button>
                          <button 
                            onClick={() => handleERReferral(patient)}
                            className="px-2 py-1 text-xs font-bold bg-rose-100 text-rose-700 hover:bg-rose-200 rounded transition flex items-center gap-1" title={isAr ? "إحالة للطوارئ" : "ER Referral"}
                          >
                            <Activity className="w-3 h-3" />
                            {isAr ? "طوارئ" : "ER"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {activeClinicPatients.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-lg">{isAr ? "لا توجد مواعيد اليوم" : "No appointments today"}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <DepartmentTasks language={language} departmentId={selectedClinic} departmentName={isAr ? "العيادات الخارجية" : "Outpatient Clinics"} />
        )}

        {activeTab === "waiting" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-slate-100 bg-amber-50/30 flex justify-between items-center">
              <h2 className="font-bold text-amber-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {isAr ? "طابور الانتظار والفرز" : "Waiting & Triage Queue"}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeClinicPatients.filter(p => p.status === ('waiting' as any) || p.status === 'triage').map((patient, idx) => (
                  <div key={patient.id} className="p-4 border border-slate-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-black text-[#0a4275]">{patient.mrn}</div>
                      <div className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full border border-amber-200">{patient.statusAr}</div>
                    </div>
                    <div className="font-bold text-slate-800 mb-1">{isAr ? patient.nameAr : patient.name}</div>
                    <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {isAr ? "وقت الوصول: " : "Arrived: "} {patient.time}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          updatePatientStatus(patient.id, 'triage');
                          window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Triage Started", titleAr: "بدء الفرز", type: "form" } }));
                        }}
                        className="flex-1 bg-white border border-amber-200 text-amber-700 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition"
                      >
                        {isAr ? "بدء الفرز" : "Start Triage"}
                      </button>
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: patient.id, patientName: patient.name, initialTab: "progress_notes" } }))}
                        className="flex-1 bg-amber-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-amber-700 transition shadow-sm"
                      >
                        {isAr ? "بدء الكشف" : "Consult"}
                      </button>
                    </div>
                  </div>
                ))}
                {activeClinicPatients.filter(p => p.status === ('waiting' as any) || p.status === 'triage').length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 italic font-bold">
                    {isAr ? "لا يوجد مرضى في قائمة الانتظار حالياً." : "No patients in waiting queue."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "examination" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
             <div className="p-4 border-b border-slate-100 bg-sky-50/30">
               <h2 className="font-bold text-sky-800 flex items-center gap-2">
                 <Stethoscope className="w-5 h-5" />
                 {isAr ? "مساحة عمل الطبيب والفرز السريري" : "Doctor Examination Workspace"}
               </h2>
             </div>
             <div className="p-12 text-center">
                <div className="w-16 h-16 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{isAr ? "اختر مريضاً من القائمة لبدء الفحص" : "Select a patient to begin examination"}</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">{isAr ? "يمكنك استخدام قائمة المواعيد أو طابور الانتظار لفتح الملف الطبي وبدء تسجيل الملاحظات السريرية." : "Use the appointment list or waiting queue to open a medical chart and start clinical documentation."}</p>
                <button onClick={() => setActiveTab("appointments")} className="bg-sky-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-sky-700 transition">
                  {isAr ? "الذهاب لمواعيد اليوم" : "Go to Today's Appointments"}
                </button>
             </div>
          </div>
        )}

        {activeTab === "recent" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
               <h2 className="font-bold text-slate-800 flex items-center gap-2">
                 <HistoryIcon className="w-5 h-5 text-slate-500" />
                 {isAr ? "المرضى الذين تم فحصهم مؤخراً" : "Recently Examined Patients"}
               </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" dir={isAr ? "rtl" : "ltr"}>
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4">{isAr ? "الوقت" : "Time"}</th>
                    <th className="p-4">{isAr ? "المريض" : "Patient"}</th>
                    <th className="p-4">{isAr ? "الطبيب" : "Doctor"}</th>
                    <th className="p-4">{isAr ? "الإجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeClinicPatients.filter(p => p.status === ('completed' as any) || p.status === ('pharmacy' as any)).map(patient => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 text-sm font-bold text-slate-500">{patient.time}</td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-slate-800">
                          <GlobalEntityLink entityId={patient.id} entityName={isAr ? patient.nameAr : patient.name} entityType="patient" isAr={isAr}>
                            {isAr ? patient.nameAr : patient.name}
                          </GlobalEntityLink>
                        </div>
                        <div className="text-xs text-slate-500">
                          <GlobalEntityLink entityId={patient.id} entityName={isAr ? patient.nameAr : patient.name} entityType="patient" isAr={isAr}>
                            {patient.mrn}
                          </GlobalEntityLink>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-600">{patient.doctor}</td>
                      <td className="p-4">
                         <button className="text-xs font-bold text-blue-600 hover:underline">{isAr ? "عرض الملخص" : "View Summary"}</button>
                      </td>
                    </tr>
                  ))}
                  {activeClinicPatients.filter(p => p.status === ('completed' as any) || p.status === ('pharmacy' as any)).length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-400 italic font-bold">
                        {isAr ? "لا يوجد مرضى سابقين لهذه الجلسة." : "No recent patients for this session."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 animate-fade-in">
             <h2 className="text-xl font-black text-[#0a4275] mb-6 flex items-center gap-2">
               <FileOutput className="w-6 h-6" />
               {isAr ? "تقارير العيادة والإنتاجية" : "Clinic Reports & Analytics"}
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { titleEn: "Patient Statistics", titleAr: "إحصائيات المرضى", descEn: "Daily, weekly and monthly patient volume", descAr: "حجم تدفق المرضى يومياً وأسبوعياً وشهرياً" },
                  { titleEn: "Revenue Report", titleAr: "تقرير الإيرادات", descEn: "Revenue per insurance and service type", descAr: "الإيرادات حسب شركة التأمين ونوع الخدمة" },
                  { titleEn: "Clinician Performance", titleAr: "أداء الأطباء", descEn: "Wait times and consultation durations", descAr: "أوقات الانتظار ومدة الاستشارات" },
                  { titleEn: "Missing Diagnoses", titleAr: "التشخيصات المفقودة", descEn: "Patients without ICD-10 codes", descAr: "المرضى الذين لم يتم إدخال كود التشخيص لهم" },
                  { titleEn: "Appointment No-Shows", titleAr: "التخلف عن المواعيد", descEn: "Percentage of missed appointments", descAr: "نسبة المرضى الذين لم يحضروا في موعدهم" }
                ].map((rpt, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-700">{isAr ? rpt.titleAr : rpt.titleEn}</h4>
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{isAr ? rpt.descAr : rpt.descEn}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === "chat" && <ClinicInternalChat isAr={isAr} />}
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
