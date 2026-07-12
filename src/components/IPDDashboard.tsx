import React, { useState } from "react";
import { User, Activity, FileText, Plus, Clock, Search, HeartPulse, Filter, Settings, FileEdit, LogIn, Calendar, FileCheck2, Syringe, UserPlus, FileSearch, ArrowUpRight, Bed, ClipboardList, BedDouble, LayoutDashboard, RefreshCcw, LogOut, ShieldAlert, Users, ListTodo, History, FileOutput, Stethoscope } from "lucide-react";
import { PatientChartModal } from "./PatientChartModal";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { useHIS } from "../context/HISContext";
import { HOSPITAL_WARDS } from "../lib/constants";
import DepartmentTasks from "./DepartmentTasks";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import { ArrowLeft } from "lucide-react";

export default function IPDDashboard({ language, forceDepartmentId }: { language: "ar" | "en", forceDepartmentId?: string }) {
  const isAr = language === "ar";
  const { patients: contextPatients, setAdmissionRequests, setErQueue, updatePatientStatus } = useHIS();
  
  const [selectedWard, setSelectedWard] = useState<string>(forceDepartmentId || "dept-im-m");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const { currentUser } = useHIS();

  const activeWardPatients = (contextPatients && Array.isArray(contextPatients)) 
    ? contextPatients.filter(p => p.status === "ward" && p.wardId === selectedWard)
    : [];

  const wardOptions = HOSPITAL_WARDS;

  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Ward Dashboard", ar: "لوحة الجناح" },
    { id: "bedmap", icon: BedDouble, en: "Bed Map", ar: "خريطة الأسرة" },
    { id: "admissions", icon: LogIn, en: "Admissions", ar: "الدخول" },
    { id: "transfers", icon: RefreshCcw, en: "Transfers", ar: "النقل الداخلي" },
    { id: "discharges", icon: LogOut, en: "Discharges", ar: "الخروج" },
    { id: "isolation", icon: ShieldAlert, en: "Isolation", ar: "العزل" },
    { id: "nursing_board", icon: ClipboardList, en: "Nursing Board", ar: "لوحة التمريض" },
    { id: "doctor_rounds", icon: Users, en: "Doctor Rounds", ar: "مرور الأطباء" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-indigo-900 flex items-center gap-3">
            <BedDouble className="w-7 h-7 text-indigo-500" />
            {isAr ? "الأقسام الداخلية والتنويم (IPD)" : "Inpatient Department (IPD)"}
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            {isAr ? "مساحة العمل المتكاملة لإدارة الأجنحة" : "Integrated Ward Management Workspace"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {wardOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{isAr ? opt.nameAr : opt.nameEn}</option>
            ))}
          </select>
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
                  ? "border-indigo-600 text-indigo-700" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-600" : ""}`} />
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {selectedPatientId ? (
          <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <button 
                onClick={() => setSelectedPatientId(null)}
                className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition"
              >
                <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                {isAr ? "العودة لقائمة الجناح" : "Back to Ward List"}
              </button>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {isAr ? "نظام إدارة الحالة السريرية - تنويم" : "Clinical Case Management - Inpatient"}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold">{isAr ? "نسبة الإشغال" : "Occupancy Rate"}</p>
                <h3 className="text-3xl font-black text-indigo-900 mt-1">85%</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <BedDouble className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold">{isAr ? "مرضى الجناح" : "Total Admitted"}</p>
                <h3 className="text-3xl font-black text-sky-600 mt-1">{activeWardPatients.length + 22}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold">{isAr ? "حالات الخروج المتوقعة" : "Expected Discharges"}</p>
                <h3 className="text-3xl font-black text-emerald-600 mt-1">4</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <LogOut className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold">{isAr ? "حالات حرجة" : "Critical Patients"}</p>
                <h3 className="text-3xl font-black text-rose-600 mt-1">2</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <HeartPulse className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {(activeTab === "bedmap" || activeTab === "dashboard") && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-indigo-500" />
                {isAr ? "قائمة أسرة الجناح" : "Ward Bed Roster"}
              </h2>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder={isAr ? "بحث بالسرير، المريض..." : "Search bed, patient..."}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" dir={isAr ? "rtl" : "ltr"}>
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4">{isAr ? "السرير" : "Bed"}</th>
                    <th className="p-4">{isAr ? "المريض" : "Patient"}</th>
                    <th className="p-4">{isAr ? "الطبيب المعالج" : "Consultant"}</th>
                    <th className="p-4">{isAr ? "الحالة" : "Status"}</th>
                    <th className="p-4 text-center">{isAr ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeWardPatients.map(patient => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition group">
                      <td className="p-4 text-sm font-bold text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <BedDouble className="w-4 h-4 text-indigo-400" />
                          {patient.bedId || "---"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-indigo-900">
                          <GlobalEntityLink entityId={patient.id} entityName={isAr ? patient.nameAr : patient.nameEn} entityType="patient" isAr={isAr}>
                            {isAr ? patient.nameAr : patient.nameEn}
                          </GlobalEntityLink>
                        </div>
                        <div className="text-xs text-slate-500">
                          {patient.mrn}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-700">
                        {patient.attendingDoctor || "DR. UNASSIGNED"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          patient.priority === 'high' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                          'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                          {patient.priority === 'high' ? (isAr ? "حرج" : "Critical") : (isAr ? "مستقر" : "Stable")}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => setSelectedPatientId(patient.id)}
                            className="px-2.5 py-1.5 text-[11px] font-black bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
                          >
                            <Stethoscope className="w-3 h-3" />
                            {isAr ? "كشف سريري" : "Consult"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "admissions" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-slate-100 bg-indigo-50/30">
               <h2 className="font-bold text-indigo-800 flex items-center gap-2">
                 <LogIn className="w-5 h-5" />
                 {isAr ? "طلبات التنويم الجديدة" : "New Admission Requests"}
               </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(useHIS().admissionRequests || []).map(req => (
                  <div key={req.id} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-black text-indigo-900">{req.patientId}</div>
                      <div className="text-[10px] font-black px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">{req.status}</div>
                    </div>
                    <div className="font-bold text-slate-800 mb-1">{req.patientName}</div>
                    <div className="text-xs text-slate-500 mb-4 italic">Diagnosis: {req.diagnosis}</div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition shadow-sm">
                        {isAr ? "تخصيص سرير" : "Assign Bed"}
                      </button>
                      <button className="px-3 bg-white border border-slate-200 text-slate-500 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition">
                        {isAr ? "رفض" : "Reject"}
                      </button>
                    </div>
                  </div>
                ))}
                {(useHIS().admissionRequests || []).length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 font-bold italic">
                    {isAr ? "لا توجد طلبات تنويم معلقة حالياً." : "No pending admission requests."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "transfers" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
             <div className="p-4 border-b border-slate-100 bg-slate-50">
               <h2 className="font-bold text-slate-800 flex items-center gap-2">
                 <RefreshCcw className="w-5 h-5 text-indigo-500" />
                 {isAr ? "النقل الداخلي بين الأجنحة" : "Internal Ward Transfers"}
               </h2>
             </div>
             <div className="p-12 text-center">
                <RefreshCcw className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-spin-slow" />
                <h3 className="text-lg font-black text-slate-800 mb-2">{isAr ? "إدارة طلبات النقل" : "Manage Transfer Requests"}</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">{isAr ? "هنا يمكنك مراجعة طلبات نقل المرضى بين الأقسام المختلفة وتخصيص الأسرة الجديدة." : "Review patient transfer requests between different wards and assign new beds."}</p>
                <div className="flex justify-center gap-2">
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition">
                    {isAr ? "طلب نقل جديد" : "New Transfer Request"}
                  </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === "discharges" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-slate-100 bg-emerald-50/30">
               <h2 className="font-bold text-emerald-800 flex items-center gap-2">
                 <LogOut className="w-5 h-5" />
                 {isAr ? "خروج المرضى المعلق" : "Pending Patient Discharges"}
               </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" dir={isAr ? "rtl" : "ltr"}>
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4">{isAr ? "المريض" : "Patient"}</th>
                    <th className="p-4">{isAr ? "تاريخ الدخول" : "Admit Date"}</th>
                    <th className="p-4">{isAr ? "حالة الفاتورة" : "Billing Status"}</th>
                    <th className="p-4 text-center">{isAr ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeWardPatients.slice(0, 2).map(patient => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="font-bold text-sm text-slate-800">{isAr ? patient.nameAr : patient.nameEn}</div>
                        <div className="text-xs text-slate-500">{patient.mrn}</div>
                      </td>
                      <td className="p-4 text-sm text-slate-500">2024-05-10</td>
                      <td className="p-4">
                        <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full border border-amber-200">{isAr ? "قيد التدقيق" : "Auditing"}</span>
                      </td>
                      <td className="p-4 text-center">
                         <button className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-sm hover:bg-emerald-700 transition">
                           {isAr ? "إتمام الخروج" : "Finalize Discharge"}
                         </button>
                      </td>
                    </tr>
                  ))}
                  {activeWardPatients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-400 italic font-bold">
                        {isAr ? "لا توجد حالات خروج معلقة." : "No pending discharges."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "isolation" && <IsolationWorkspace isAr={isAr} />}
        {activeTab === "nursing_board" && <NursingBoardWorkspace isAr={isAr} />}
        {activeTab === "doctor_rounds" && <DoctorRoundsWorkspace isAr={isAr} />}
          </>
        )}
      </div>
    </div>
  );
}

function IsolationWorkspace({ isAr }: any) {
    return (
        <div className="bg-white border border-rose-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-black text-rose-800 mb-4">{isAr ? "إدارة غرف العزل (Isolation Ward)" : "Isolation Ward Management"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rose-100 bg-rose-50 rounded-xl p-4">
                    <h3 className="font-bold text-rose-800 text-sm mb-2">Room 401 - Contact Isolation</h3>
                    <p className="text-xs text-rose-600 mb-2">Patient: MRN-10029</p>
                    <p className="text-[11px] text-rose-500 font-semibold">{isAr ? "متطلبات: قفازات، مريلة، نظارات واقية." : "Requirements: Gloves, Gown, Goggles."}</p>
                </div>
                <div className="border border-amber-100 bg-amber-50 rounded-xl p-4">
                    <h3 className="font-bold text-amber-800 text-sm mb-2">Room 405 - Airborne Isolation</h3>
                    <p className="text-xs text-amber-600 mb-2">Patient: MRN-10088</p>
                    <p className="text-[11px] text-amber-500 font-semibold">{isAr ? "متطلبات: كمامة N95، ضغط هواء سلبي." : "Requirements: N95 Respirator, Negative Pressure."}</p>
                </div>
            </div>
        </div>
    )
}

function NursingBoardWorkspace({ isAr }: any) {
    return (
        <div className="bg-white border border-indigo-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-black text-indigo-800 mb-4">{isAr ? "لوحة مهام التمريض (Nursing Board)" : "Nursing Task Board"}</h2>
            <table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
                <thead className="bg-indigo-50 text-indigo-800 font-bold">
                    <tr>
                        <th className="p-2 rounded-l-lg">{isAr ? "المريض" : "Patient"}</th>
                        <th className="p-2">{isAr ? "الغرفة" : "Room"}</th>
                        <th className="p-2">{isAr ? "المهمة القادمة" : "Next Task"}</th>
                        <th className="p-2">{isAr ? "الوقت" : "Time"}</th>
                        <th className="p-2 rounded-r-lg">{isAr ? "الإجراء" : "Action"}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50 text-slate-700">
                    <tr>
                        <td className="p-2 font-bold">Ahmed Ali</td>
                        <td className="p-2 font-mono text-xs">RM-201</td>
                        <td className="p-2 text-xs">IV Antibiotics</td>
                        <td className="p-2 text-rose-600 font-bold text-xs">10:00 AM</td>
                        <td className="p-2"><button className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700">{isAr ? "إنجاز" : "Done"}</button></td>
                    </tr>
                    <tr>
                        <td className="p-2 font-bold">Sarah Smith</td>
                        <td className="p-2 font-mono text-xs">RM-204</td>
                        <td className="p-2 text-xs">Vitals Check</td>
                        <td className="p-2 text-amber-600 font-bold text-xs">10:30 AM</td>
                        <td className="p-2"><button className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700">{isAr ? "إنجاز" : "Done"}</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function DoctorRoundsWorkspace({ isAr }: any) {
    return (
        <div className="bg-white border border-teal-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-black text-teal-800 mb-4">{isAr ? "المرور الطبي (Doctor Rounds)" : "Doctor Rounds"}</h2>
            <div className="space-y-3">
                <div className="p-4 border border-teal-100 rounded-xl hover:bg-teal-50 flex justify-between items-center cursor-pointer transition">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Bed 1 - Ali Hassan</h3>
                        <p className="text-xs text-slate-500 mt-1">Diagnosis: Pneumonia. On Day 3 of IV Ceftriaxone.</p>
                    </div>
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold shadow-sm">{isAr ? "بدء التقييم" : "Start Evaluation"}</button>
                </div>
                <div className="p-4 border border-teal-100 rounded-xl hover:bg-teal-50 flex justify-between items-center cursor-pointer transition">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Bed 4 - Fatima O.</h3>
                        <p className="text-xs text-slate-500 mt-1">Diagnosis: Post-op Appy. Ready for discharge.</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold shadow-sm">{isAr ? "مكتمل" : "Completed"}</button>
                </div>
            </div>
        </div>
    )
}
