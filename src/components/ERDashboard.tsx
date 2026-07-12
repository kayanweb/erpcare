import React, { useState, useEffect } from "react";
import { Search, Plus, Clock, AlertCircle, Edit, Activity, HeartPulse, Stethoscope, Users, Bed, Eye, Bell, ListTodo, FileOutput, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { GlobalEntityLink } from "./GlobalEntityLink";
import DepartmentTasks from "./DepartmentTasks";
import { useHIS } from "../context/HISContext";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import { ArrowLeft } from "lucide-react";

interface ERPatient {
  id: string;
  mrn: string;
  name: string;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  chiefComplaint: string;
  arrivalTime: string;
  status: string;
  zone: "Red" | "Yellow" | "Green" | "FastTrack";
  bed?: string;
}

export default function ERDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const { erQueue = [], currentUser, patients: contextPatients } = useHIS();
  
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Ambulance tracking state
  const [ambulances, setAmbulances] = useState([
    { id: "AMB-102", eta: 3, complaint: "Chest Pain / Suspected STEMI", complaintAr: "ألم بالصدر / اشتباه جلطة", status: "Critical", statusAr: "حرجة", bedId: "Resus-1", paramedic: "Saeed / Omar", hr: 110, bp: "145/95", spo2: 91 },
    { id: "AMB-205", eta: 7, complaint: "Polytrauma / Motor Vehicle Collision", complaintAr: "إصابات متعددة / حادث سير", status: "Severe", statusAr: "خطيرة", bedId: "", paramedic: "Mostafa / Ali", hr: 125, bp: "90/50", spo2: 88 },
    { id: "AMB-408", eta: 14, complaint: "Stroke Symptoms / Left Hemiparesis", complaintAr: "أعراض جلطة دماغية / شلل نصفي أيسر", status: "Stable-Urgent", statusAr: "مستقرة-عاجلة", bedId: "", paramedic: "Hassan / Samir", hr: 85, bp: "160/100", spo2: 96 }
  ]);

  // Resus GCS state
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);
  const [resusChecklist, setResusChecklist] = useState({
    airway: true,
    iv: true,
    ekg: false,
    epi: false,
    blood: false
  });

  // Fast track state
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [fastTrackNote, setFastTrackNote] = useState("");
  const [selectedFastTrackPatient, setSelectedFastTrackPatient] = useState<any>(null);

  // Smart alerts state
  const [erAlerts, setErAlerts] = useState([
    { id: 1, type: "panic", text: "قيمة حرجة من المختبر: التروبونين 1.45 نانوغرام/مل للمريض أحمد يوسف", textEn: "Critical lab panic value: Troponin 1.45 ng/mL for Ahmed Youssef", status: "active", time: "10:12 AM" },
    { id: 2, type: "triage", text: "تأخر في الفرز: 3 مرضى في الانتظار لأكثر من 25 دقيقة", textEn: "Triage Delay: 3 patients in waiting room for over 25 minutes", status: "active", time: "10:15 AM" },
    { id: 3, type: "vitals", text: "انخفاض الأكسجين: SpO2 < 90% للمريض في السرير Resus-1", textEn: "Hypoxia Alert: SpO2 < 90% for patient in bed Resus-1", status: "active", time: "10:20 AM" }
  ]);

  const patients = (contextPatients && Array.isArray(contextPatients))
    ? contextPatients.filter(p => p.status === "triage" || p.departmentId === "er-unit")
    : [];

  const filtered = patients.filter((p) => 
    p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.nameAr.includes(searchTerm) || 
    p.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTriageColor = (level: number) => {
    switch (level) {
      case 1: return "bg-rose-500 text-white border-rose-600 shadow-rose-200";
      case 2: return "bg-orange-500 text-white border-orange-600 shadow-orange-200";
      case 3: return "bg-yellow-400 text-slate-800 border-yellow-500 shadow-yellow-200";
      case 4: return "bg-emerald-500 text-white border-emerald-600 shadow-emerald-200";
      case 5: return "bg-blue-500 text-white border-blue-600 shadow-blue-200";
      default: return "bg-slate-200 text-slate-800 border-slate-300";
    }
  };

  const calculateWaitTime = (arrivalTime: string) => {
    if (!arrivalTime) return "N/A";
    const diff = Math.floor((new Date().getTime() - new Date(arrivalTime).getTime()) / 60000);
    if (diff < 60) return `${diff}m`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const tabs = [
    { id: "dashboard", icon: Activity, en: "Triage Board", ar: "لوحة الفرز" },
    { id: "critical", icon: HeartPulse, en: "Trauma & Resus", ar: "الإصابات والإنعاش" },
    { id: "ambulance", icon: AlertCircle, en: "Ambulance Track", ar: "تتبع الإسعاف" },
    { id: "fast_track", icon: ShieldAlert, en: "Fast Track", ar: "المسار السريع" },
    { id: "bed_status", icon: Bed, en: "ER Beds", ar: "أسرة الطوارئ" },
    { id: "tasks", icon: ListTodo, en: "Tasks", ar: "المهام" },
    { id: "alerts", icon: Bell, en: "Smart Alerts", ar: "التنبيهات الذكية" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-rose-900 flex items-center gap-3">
            <Activity className="w-7 h-7 text-rose-600" />
            {isAr ? "قسم الطوارئ (ER)" : "Emergency Department (ER)"}
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            {isAr ? "مساحة العمل المتكاملة لإدارة الطوارئ" : "Integrated Emergency Management Workspace"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openPatientRegistration'))}
            className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-700 transition shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isAr ? "تسجيل مريض جديد" : "New Registration"}
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
                  ? "border-rose-600 text-rose-700" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-rose-600" : ""}`} />
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {selectedPatientId ? (
          <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 flex items-center justify-between">
              <button 
                onClick={() => setSelectedPatientId(null)}
                className="flex items-center gap-2 text-rose-600 font-bold hover:text-rose-800 transition"
              >
                <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                {isAr ? "العودة للوحة الفرز" : "Back to Triage Board"}
              </button>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {isAr ? "نظام إدارة الحالة السريرية - طوارئ" : "Clinical Case Management - ER"}
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
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {[
                { title: isAr ? "المستوى 1 (إنعاش)" : "Level 1 (Resus)", count: patients.filter(p => p.triageLevel === 1).length, color: "rose" },
                { title: isAr ? "المستوى 2 (طوارئ)" : "Level 2 (Emergent)", count: patients.filter(p => p.triageLevel === 2).length, color: "orange" },
                { title: isAr ? "المستوى 3 (عاجل)" : "Level 3 (Urgent)", count: patients.filter(p => p.triageLevel === 3).length, color: "yellow" },
                { title: isAr ? "المستوى 4 (أقل استعجالاً)" : "Level 4 (Less Urgent)", count: patients.filter(p => p.triageLevel === 4).length, color: "emerald" },
                { title: isAr ? "المستوى 5 (غير عاجل)" : "Level 5 (Non-Urgent)", count: patients.filter(p => p.triageLevel === 5).length, color: "blue" },
              ].map((stat, i) => (
                <div key={i} className={`bg-white border-l-4 border-${stat.color}-500 rounded-lg shadow-sm p-4 flex flex-col`}>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.title}</span>
                  <span className={`text-2xl font-black text-${stat.color}-600 mt-1`}>{stat.count}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50">
                <h2 className="text-lg font-black text-slate-800">{isAr ? "لوحة الفرز الحي" : "Live Triage Board"}</h2>
                <div className="relative flex-1 md:w-64 max-w-xs">
                  <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`} />
                  <input
                    type="text"
                    placeholder={isAr ? "بحث بالرقم أو الاسم..." : "Search MRN or Name..."}
                    className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 font-bold`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-4 text-center">{isAr ? "الفرز" : "Triage"}</th>
                      <th className="px-4 py-4">{isAr ? "المريض" : "Patient"}</th>
                      <th className="px-4 py-4">{isAr ? "الشكوى الرئيسية" : "Chief Complaint"}</th>
                      <th className="px-4 py-4">{isAr ? "الحالة" : "Status"}</th>
                      <th className="px-4 py-4">{isAr ? "المنطقة" : "Zone"}</th>
                      <th className="px-4 py-4">{isAr ? "الانتظار" : "Wait Time"}</th>
                      <th className="px-4 py-4 text-center">{isAr ? "إجراء" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((patient) => {
                      const waitString = calculateWaitTime(patient.arrivalTime);
                      const isLongWait = waitString?.includes("h") || (waitString !== "N/A" && parseInt(waitString) > 30);
                      return (
                        <tr key={patient.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3 text-center">
                            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-black border-2 shadow-sm ${getTriageColor(patient.triageLevel || 3)}`}>
                              {patient.triageLevel || 3}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-bold text-slate-800">
                              <GlobalEntityLink entityId={patient.id} entityName={isAr ? patient.nameAr : patient.nameEn} entityType="patient" isAr={isAr}>
                                {isAr ? patient.nameAr : patient.nameEn}
                              </GlobalEntityLink>
                            </div>
                            <div className="text-xs font-mono text-slate-500">{patient.mrn}</div>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-700 min-w-[150px]">{patient.chiefComplaint || (isAr ? "غير محدد" : "Unspecified")}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200 whitespace-nowrap">{patient.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-bold whitespace-nowrap">
                            <span className={`px-2 py-1 rounded border shadow-sm whitespace-nowrap ${
                                patient.zone === "Red" ? "bg-rose-50 text-rose-700 border-rose-200"
                                : patient.zone === "Green" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : patient.zone === "Yellow" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                              }`}>
                              {patient.zone || "Yellow"} Zone
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold whitespace-nowrap">
                            <div className={`flex items-center gap-1.5 ${isLongWait ? "text-rose-600" : "text-slate-600"}`}>
                              <Clock className="w-3.5 h-3.5 shrink-0" /> {waitString}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <button 
                              onClick={() => setSelectedPatientId(patient.id)}
                              className="px-2.5 py-1.5 text-[11px] font-black bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-sm transition flex items-center gap-1.5 mx-auto"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              {isAr ? "كشف الطوارئ" : "Consult"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "tasks" && (
          <DepartmentTasks language={language} departmentId="er" departmentName={isAr ? "قسم الطوارئ" : "Emergency Department"} />
        )}

        {activeTab === "bed_status" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h2 className="font-black text-slate-800 flex items-center gap-2">
                <Bed className="w-5 h-5 text-rose-600" />
                {isAr ? "حالة أسرة الطوارئ" : "ER Bed Status"}
              </h2>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {["Resus-1", "Resus-2", "Red-1", "Red-2", "Red-3", "Yel-1", "Yel-2", "Yel-3", "Yel-4", "Yel-5", "Grn-1", "Grn-2"].map(bed => {
                const occupied = patients.find(p => p.bedId === bed);
                return (
                  <div key={bed} className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition ${occupied ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <Bed className={`w-8 h-8 ${occupied ? 'text-rose-600' : 'text-emerald-600'}`} />
                    <span className="text-xs font-black text-slate-700">{bed}</span>
                    <span className={`text-[10px] font-bold uppercase ${occupied ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {occupied ? (isAr ? "مشغول" : "Occupied") : (isAr ? "متاح" : "Available")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "critical" && (
          <div className="space-y-6 animate-fade-in text-right" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-rose-900 text-white p-6 rounded-2xl shadow-lg border border-rose-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  <HeartPulse className="w-6 h-6 animate-pulse text-rose-400 shrink-0" />
                  {isAr ? "وحدة الإنعاش والصدمات الكبرى" : "Major Trauma & Resuscitation Unit"}
                </h2>
                <p className="text-rose-100 text-xs font-bold mt-1 max-w-xl">
                  {isAr 
                    ? "إدارة الحالات الحرجة من المستوى 1 (Code Blue, Polytrauma, Cardiac Arrest). المتابعة الآنية لفرز المريض والتدخل السريري السريع." 
                    : "Direct management of Level 1 critical patients. Real-time vitals, resuscitation checklists, and rapid interventions."}
                </p>
              </div>
              <div className="bg-rose-800/80 px-4 py-2 rounded-xl text-center border border-rose-700/50">
                <span className="text-[10px] font-bold block uppercase tracking-widest text-rose-300">{isAr ? "حالة الإنعاش الحالية" : "Active Trauma Cases"}</span>
                <span className="text-xl font-black">{patients.filter(p => p.triageLevel === 1).length + 1}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Patient Selector & Resus Checklist */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Users className="w-5 h-5 text-rose-600" />
                      {isAr ? "المرضى في غرف الإنعاش" : "Patients in Resus Bays"}
                    </h3>
                  </div>
                  <div className="p-4 divide-y divide-slate-100">
                    {[
                      { id: "P-RES-1", nameAr: "أحمد يوسف عبد الله", nameEn: "Ahmed Youssef", mrn: "MRN-2026-0301", triageLevel: 1, bedId: "Resus-1", chiefComplaint: isAr ? "ألم شديد بالصدر واشتباه احتشاء العضلة القلبية" : "Acute MI / Chest Pain", hr: 118, bp: "88/54", spo2: 89 },
                      { id: "P-RES-2", nameAr: "سالم محمد الهاجري", nameEn: "Salem Al-Hajri", mrn: "MRN-2026-4402", triageLevel: 1, bedId: "Resus-2", chiefComplaint: isAr ? "نزيف حاد / حادث سيارة" : "Severe Hemorrhage / MVC", hr: 124, bp: "92/58", spo2: 91 }
                    ].map(patient => (
                      <div key={patient.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                            <span className="font-black text-slate-800 text-sm">{isAr ? patient.nameAr : patient.nameEn}</span>
                            <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200">Level 1</span>
                          </div>
                          <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-4">
                            <span>MRN: <span className="font-mono">{patient.mrn}</span></span>
                            <span>{isAr ? "السرير:" : "Bed:"} <span className="text-rose-600 font-black">{patient.bedId}</span></span>
                            <span>{isAr ? "الشكوى:" : "Complaint:"} <span className="text-slate-700 font-black">{patient.chiefComplaint}</span></span>
                          </p>
                        </div>
                        
                        {/* Simulation Vitals */}
                        <div className="flex gap-4">
                          <div className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl border border-rose-100 text-center animate-pulse">
                            <span className="block text-[9px] uppercase font-bold text-rose-400">{isAr ? "نبض القلب" : "HR"}</span>
                            <span className="text-sm font-black font-mono">{patient.hr} bpm</span>
                          </div>
                          <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl border border-blue-100 text-center">
                            <span className="block text-[9px] uppercase font-bold text-blue-400">{isAr ? "الأكسجين" : "SpO2"}</span>
                            <span className="text-sm font-black font-mono">{patient.spo2}%</span>
                          </div>
                          <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100 text-center">
                            <span className="block text-[9px] uppercase font-bold text-emerald-400">{isAr ? "الضغط" : "NIBP"}</span>
                            <span className="text-sm font-black font-mono">{patient.bp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resuscitation Checklist (Code Blue) */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                  <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <HeartPulse className="w-5 h-5 text-rose-600" />
                    {isAr ? "قائمة تدقيق إنعاش الحالات الحرجة (Code Blue Checklist)" : "Code Blue Resuscitation Checklist"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "airway", labelEn: "Airway Secured (Intubation/EtCO2 verified)", labelAr: "تأمين المجرى الهوائي (أنابيب الرغامي/التحقق)" },
                      { key: "iv", labelEn: "Two Large-Bore IV lines / IO established", labelAr: "تركيب خطين وريديين واسعين / داخل العظم" },
                      { key: "ekg", labelEn: "Continuous ECG monitor & Defibrillator connected", labelAr: "توصيل المونيتور وجهاز الصدمات الكهربائية" },
                      { key: "epi", labelEn: "Epinephrine administered (Cycle 1 - 1mg IV)", labelAr: "إعطاء الأدرينالين (الجرعة الأولى 1 ملغ)" },
                      { key: "blood", labelEn: "Massive Transfusion Protocol (MTP) initiated", labelAr: "تفعيل بروتوكول نقل الدم المكثف" },
                    ].map(item => (
                      <label key={item.key} className="flex items-start gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={(resusChecklist as any)[item.key]} 
                          onChange={(e) => {
                            setResusChecklist(prev => ({ ...prev, [item.key]: e.target.checked }));
                            toast.success(isAr ? "تم تحديث حالة قائمة التدقيق" : "Checklist status updated");
                          }}
                          className="mt-1 w-4 h-4 text-rose-600 focus:ring-rose-500 rounded border-slate-300"
                        />
                        <div className="text-right">
                          <span className="block text-sm font-bold text-slate-800">{isAr ? item.labelAr : item.labelEn}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Glasgow Coma Scale Calculator */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                  <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Activity className="w-5 h-5 text-rose-600" />
                    {isAr ? "حاسبة مقياس غلاسكو للغيبوبة (GCS)" : "Glasgow Coma Scale (GCS) Calculator"}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Eye Opening */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase text-right w-full">{isAr ? "استجابة العين (E)" : "Eye Opening (E)"}</label>
                      <select 
                        value={gcsEye} 
                        onChange={e => setGcsEye(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold"
                      >
                        <option value={4}>{isAr ? "4 - تلقائي" : "4 - Spontaneous"}</option>
                        <option value={3}>{isAr ? "3 - للأمر اللفظي" : "3 - To sound"}</option>
                        <option value={2}>{isAr ? "2 - للألم" : "2 - To pressure"}</option>
                        <option value={1}>{isAr ? "1 - لا توجد استجابة" : "1 - None"}</option>
                      </select>
                    </div>

                    {/* Verbal Response */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase text-right w-full">{isAr ? "الاستجابة اللفظية (V)" : "Verbal Response (V)"}</label>
                      <select 
                        value={gcsVerbal} 
                        onChange={e => setGcsVerbal(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold"
                      >
                        <option value={5}>{isAr ? "5 - متجاوب ومنتبه" : "5 - Orientated"}</option>
                        <option value={4}>{isAr ? "4 - مشوش" : "4 - Confused"}</option>
                        <option value={3}>{isAr ? "3 - كلمات غير مترابطة" : "3 - Inappropriate words"}</option>
                        <option value={2}>{isAr ? "2 - أصوات غير مفهومة" : "2 - Incomprehensible sounds"}</option>
                        <option value={1}>{isAr ? "1 - لا توجد استجابة" : "1 - None"}</option>
                      </select>
                    </div>

                    {/* Motor Response */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase text-right w-full">{isAr ? "الاستجابة الحركية (M)" : "Motor Response (M)"}</label>
                      <select 
                        value={gcsMotor} 
                        onChange={e => setGcsMotor(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold"
                      >
                        <option value={6}>{isAr ? "6 - يطيع الأوامر" : "6 - Obeys commands"}</option>
                        <option value={5}>{isAr ? "5 - يحدد مكان الألم" : "5 - Localising pain"}</option>
                        <option value={4}>{isAr ? "4 - انسحاب للألم" : "4 - Normal flexion (withdrawal)"}</option>
                        <option value={3}>{isAr ? "3 - ثني غير طبيعي (انقباض)" : "3 - Abnormal flexion (decorticate)"}</option>
                        <option value={2}>{isAr ? "2 - بسط غير طبيعي (انفتاح)" : "2 - Extension (decerebrate)"}</option>
                        <option value={1}>{isAr ? "1 - لا توجد استجابة" : "1 - None"}</option>
                      </select>
                    </div>

                    {/* Score Output */}
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center mt-6">
                      <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block">{isAr ? "إجمالي درجة GCS" : "GCS Score"}</span>
                      <span className="text-4xl font-black text-rose-700 block my-1">{gcsEye + gcsVerbal + gcsMotor} / 15</span>
                      <span className="text-xs font-bold text-slate-600 block mt-1">
                        {gcsEye + gcsVerbal + gcsMotor <= 8 
                          ? (isAr ? "غيبوبة شديدة (تطلب حماية المجرى الهوائي)" : "Severe (GCS ≤ 8, Intubation indicated)")
                          : gcsEye + gcsVerbal + gcsMotor <= 12 
                            ? (isAr ? "إصابة متوسطة" : "Moderate (GCS 9-12)")
                            : (isAr ? "إصابة خفيفة" : "Mild (GCS 13-15)")
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                  <h4 className="font-bold text-slate-800 text-sm mb-2">{isAr ? "فريق الصدمات المناوب" : "Trauma On-Call Team"}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg"><span className="text-slate-400 block">{isAr ? "قائد الفريق" : "Trauma Leader"}</span><strong className="text-slate-700">Dr. Ali Youssef</strong></div>
                    <div className="bg-slate-50 p-2 rounded-lg"><span className="text-slate-400 block">{isAr ? "ممرض الإنعاش" : "Resus Nurse"}</span><strong className="text-slate-700">Nurse Reem</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ambulance" && (
          <div className="space-y-6 animate-fade-in text-right" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    {isAr ? "شاشة تتبع وتحضير الإسعاف" : "Ambulance Pre-Arrival & Tracking"}
                  </h2>
                  <p className="text-slate-500 text-xs font-bold mt-1">
                    {isAr 
                      ? "رصد سيارات الإسعاف القادمة، مراجعة التقارير الميدانية من المسعفين، وتخصيص أسرة الطوارئ بشكل مسبق." 
                      : "Monitor en-route ambulances, view paramedic reports, and pre-assign ER beds."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Ambulance Fleet Cards */}
                <div className="xl:col-span-2 space-y-4">
                  {ambulances.map(amb => (
                    <div key={amb.id} className="border border-slate-200 rounded-2xl p-5 hover:border-rose-300 hover:shadow-md transition bg-white relative overflow-hidden text-right">
                      <div className="absolute top-0 right-0 left-0 h-1.5 bg-rose-500"></div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="bg-slate-100 text-slate-800 font-mono text-xs font-black px-2 py-1 rounded border border-slate-200">{amb.id}</span>
                            <span className="text-rose-600 font-bold text-xs flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {isAr ? `وصول خلال ${amb.eta} دقائق` : `ETA: ${amb.eta} mins`}
                            </span>
                            <span className={`text-xs font-black px-2 py-0.5 rounded ${amb.status === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                              {isAr ? amb.statusAr : amb.status}
                            </span>
                          </div>
                          
                          <h4 className="font-black text-slate-800 text-base mt-3">{isAr ? amb.complaintAr : amb.complaint}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-1">
                            {isAr ? `طاقم المسعفين: ${amb.paramedic}` : `Paramedics: ${amb.paramedic}`}
                          </p>
                        </div>

                        {/* Paramedic Field Vitals */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex gap-4 text-center">
                          <div>
                            <span className="block text-[9px] uppercase font-bold text-slate-400">{isAr ? "نبض القلب" : "HR"}</span>
                            <span className="text-sm font-black text-slate-700 font-mono">{amb.hr}</span>
                          </div>
                          <div className="border-r border-slate-200 h-8 self-center"></div>
                          <div>
                            <span className="block text-[9px] uppercase font-bold text-slate-400">{isAr ? "الضغط" : "BP"}</span>
                            <span className="text-sm font-black text-slate-700 font-mono">{amb.bp}</span>
                          </div>
                          <div className="border-r border-slate-200 h-8 self-center"></div>
                          <div>
                            <span className="block text-[9px] uppercase font-bold text-slate-400">{isAr ? "الأكسجين" : "SpO2"}</span>
                            <span className="text-sm font-black text-slate-700 font-mono">{amb.spo2}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Controls inside Card */}
                      <div className="border-t border-slate-100 mt-4 pt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">{isAr ? "تخصيص سرير مسبق:" : "Pre-assign Bed:"}</label>
                          <select 
                            value={amb.bedId} 
                            onChange={(e) => {
                              const bId = e.target.value;
                              setAmbulances(prev => prev.map(a => a.id === amb.id ? { ...a, bedId: bId } : a));
                              toast.success(isAr ? `تم تخصيص السرير ${bId} للإسعاف ${amb.id}` : `Pre-assigned ${bId} to ${amb.id}`);
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold p-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
                          >
                            <option value="">{isAr ? "-- اختر سرير --" : "-- Select Bed --"}</option>
                            <option value="Resus-1">Resus-1</option>
                            <option value="Resus-2">Resus-2</option>
                            <option value="Red-1">Red-1</option>
                            <option value="Red-2">Red-2</option>
                            <option value="Yel-1">Yel-1</option>
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              toast.success(isAr ? `تم تفعيل إنذار التحضير المسبق لسيارة ${amb.id}! فريق الصدمات متأهب.` : `Pre-arrival notification sent for ${amb.id}! Trauma team alerted.`);
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-sm transition"
                          >
                            {isAr ? "إنذار التحضير المسبق" : "Send Pre-arrival Alert"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulation Map or Dispatch Area */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden h-[300px] flex flex-col justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                  
                  <div className="relative z-10 text-right">
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase animate-pulse">{isAr ? "خريطة البث المباشر" : "LIVE MAP"}</span>
                    <h4 className="font-bold text-sm mt-2">{isAr ? "أقرب سيارات إسعاف في المحيط" : "Nearby En-Route Emergency Fleet"}</h4>
                  </div>

                  <div className="relative z-10 space-y-2 text-xs" dir="ltr">
                    <div className="flex justify-between items-center bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                      <span>AMB-102</span>
                      <span className="text-rose-400 font-bold">{isAr ? "طريق الملك عبد العزيز (3 دق)" : "King Abdulaziz Rd (3m)"}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                      <span>AMB-205</span>
                      <span className="text-amber-400 font-bold">{isAr ? "الدائري الشمالي (7 دق)" : "Northern Ring Rd (7m)"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "fast_track" && (
          <div className="space-y-6 animate-fade-in text-right" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-emerald-400 shrink-0" />
                  {isAr ? "مكتب فرز وتدفق المسار السريع (Fast Track)" : "Fast Track & Rapid Treatment Desk"}
                </h2>
                <p className="text-emerald-100 text-xs font-bold mt-1 max-w-xl">
                  {isAr 
                    ? "مساحة عمل مخصصة لعلاج الحالات الخفيفة وغير العاجلة (مستوى 4 و 5) لضمان تسريع دورة خروج المريض وتقليص الازدحام." 
                    : "Dedicated desk for minor injuries, acute minor illnesses, and green-triage cases to speed up patient turnaround."}
                </p>
              </div>
              <div className="bg-emerald-800/80 px-4 py-2 rounded-xl text-center border border-emerald-700/50">
                <span className="text-[10px] font-bold block uppercase tracking-widest text-emerald-300">{isAr ? "مرضى المسار السريع" : "Fast Track Queue"}</span>
                <span className="text-xl font-black">2</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Queue List */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 h-[500px] flex flex-col text-right">
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  {isAr ? "قائمة الانتظار السريعة" : "Fast Track Queue"}
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {[
                    { id: "FT-101", nameAr: "مريم حسن علي", nameEn: "Maryam Hassan", mrn: "MRN-2026-9081", triageLevel: 4, age: 28, chiefComplaint: isAr ? "جرح سطحي بسيط في أصبع اليد" : "Minor superficial cut on index finger" },
                    { id: "FT-102", nameAr: "سعد محمد القحطاني", nameEn: "Saad Al-Qahtani", mrn: "MRN-2026-8742", triageLevel: 5, age: 34, chiefComplaint: isAr ? "حرارة خفيفة واحتقان حلق" : "Mild fever and sore throat" }
                  ].map(patient => (
                    <div 
                      key={patient.id} 
                      onClick={() => {
                        setSelectedFastTrackPatient(patient);
                        setSelectedTemplate("");
                        setFastTrackNote("");
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer text-right ${
                        selectedFastTrackPatient?.id === patient.id 
                          ? 'bg-emerald-50 border-emerald-300 shadow-sm' 
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-800 text-sm">{isAr ? patient.nameAr : patient.nameEn}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${patient.triageLevel === 4 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          L{patient.triageLevel || 4}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500 font-bold mt-2">
                        <span>MRN: {patient.mrn}</span>
                        <span className="text-emerald-600 font-semibold">{patient.chiefComplaint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Treatment Area */}
              <div className="lg:col-span-2">
                {selectedFastTrackPatient ? (
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4 text-right">
                    <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-bold text-right w-full">Assessment Area / منطقة التقييم</span>
                        <h3 className="font-black text-slate-800 text-lg">{isAr ? selectedFastTrackPatient.nameAr : selectedFastTrackPatient.nameEn}</h3>
                        <p className="text-xs text-slate-500 font-bold mt-1">MRN: {selectedFastTrackPatient.mrn} | {isAr ? `العمر: ${selectedFastTrackPatient.age}` : `Age: ${selectedFastTrackPatient.age}`}</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-3 py-1 text-xs font-black">
                        {isAr ? "المسار السريع" : "Fast Track Area"}
                      </span>
                    </div>

                    {/* Quick Assessment Templates */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 text-right w-full">{isAr ? "اختر قالب الكشف السريع:" : "Select Fast Assessment Template:"}</label>
                      <select 
                        value={selectedTemplate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedTemplate(val);
                          if (val === "wound") {
                            setFastTrackNote(isAr 
                              ? "تم تنظيف الجرح بمحلول الملح، وتخدير موضعي ليدوكائين، وخياطة 3 غرز تجميلية مع وضع ضمادة معقمة. خروج مع توصية بتنظيف الجرح وإزالة الغرز خلال 7-10 أيام." 
                              : "Cleaned minor wound, local lidocaine anesthesia, 3 simple sutures applied, dry sterile dressing. Advised suture removal in 7-10 days.");
                          } else if (val === "flu") {
                            setFastTrackNote(isAr 
                              ? "التهاب بسيط بالحلق مع رشح وحرارة خفيفة. الصدر سليم. تم وصف خافض للحرارة وبنادول، وشرب سوائل دافئة والراحة بالمنزل." 
                              : "Acute mild pharyngitis and rhinorrhea. Chest clear. Prescribed Paracetamol 500mg, oral fluids, rest. Safe to discharge.");
                          } else if (val === "sprain") {
                            setFastTrackNote(isAr 
                              ? "إلتواء بالكاحل الأيمن مع ورم خفيف. فحص الأشعة لا يظهر أي كسور. تم عمل رباط ضاغط، ونصح برفع الساق وكمادات باردة مسكنة." 
                              : "Right ankle inversion sprain, mild edema. X-ray negative for fracture. Applied compression bandage, advised elevate foot, cold compresses, ibuprofen.");
                          } else {
                            setFastTrackNote("");
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold text-right"
                      >
                        <option value="">{isAr ? "-- قالب فارغ --" : "-- Blank Template --"}</option>
                        <option value="wound">{isAr ? "جرح بسيط غرز تجميلية" : "Minor Wound Laceration"}</option>
                        <option value="flu">{isAr ? "التهاب حلق / نزلات البرد" : "Common Cold / Pharyngitis"}</option>
                        <option value="sprain">{isAr ? "إلتواء المفاصل البسيط" : "Simple Sprain"}</option>
                      </select>
                    </div>

                    {/* Assessment Textarea */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 text-right w-full">{isAr ? "ملاحظة الفحص والوصفة:" : "Clinical Assessment Note & Prescription:"}</label>
                      <textarea 
                        value={fastTrackNote}
                        onChange={(e) => setFastTrackNote(e.target.value)}
                        placeholder={isAr ? "اكتب تفاصيل الكشف الطبي والوصفة العلاجية هنا..." : "Type clinical assessment findings and treatment plan..."}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                      <button 
                        onClick={() => {
                          toast.success(isAr ? `تم تحويل ${selectedFastTrackPatient.nameAr} للعيادات الخارجية بموعد غداً` : `Referred ${selectedFastTrackPatient.nameEn} to OPD Clinic for follow up`);
                          setSelectedFastTrackPatient(null);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                      >
                        {isAr ? "تحويل للعيادات OPD" : "OPD Referral"}
                      </button>
                      <button 
                        onClick={() => {
                          toast.success(isAr ? `تم حفظ العلاج والخروج السريع للمريض ${selectedFastTrackPatient.nameAr}` : `Fast discharge completed for ${selectedFastTrackPatient.nameEn}`);
                          setSelectedFastTrackPatient(null);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                      >
                        {isAr ? "خروج سريع ووصفة دواء" : "Instant Discharge & Prescription"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 h-full flex flex-col items-center justify-center">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mb-2" />
                    <p className="font-bold">{isAr ? "يرجى تحديد مريض من القائمة لبدء علاجه فوراً" : "Please select a patient from the queue to start treatment"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-6 animate-fade-in text-right" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Bell className="w-5 h-5 text-rose-600" />
                {isAr ? "نظام التنبيهات السريرية الذكي" : "ER Smart Clinical Alerts"}
              </h3>
              
              <div className="space-y-4">
                {erAlerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-xl border flex justify-between items-center gap-4 transition text-right ${
                    alert.type === 'panic' ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : alert.type === 'vitals' ? 'bg-orange-50 border-orange-200 text-orange-900'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-900'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{isAr ? alert.text : alert.textEn}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{alert.time}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setErAlerts(prev => prev.filter(a => a.id !== alert.id));
                          toast.success(isAr ? "تم إقرار التنبيه ومعالجته" : "Alert acknowledged and cleared");
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 whitespace-nowrap"
                      >
                        {isAr ? "إقرار ومعالجة" : "Acknowledge"}
                      </button>
                    </div>
                  </div>
                ))}
                {erAlerts.length === 0 && (
                  <div className="p-12 text-center text-slate-400 italic font-medium">
                    {isAr ? "لا توجد تنبيهات نشطة حالياً." : "No active clinical alerts."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
