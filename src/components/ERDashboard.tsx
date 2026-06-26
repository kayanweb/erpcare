import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Clock,
  Search,
  Plus,
  Filter,
  Users,
  Activity,
  FileText,
  ArrowRight,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface ERCase {
  id: string;
  mrn: string;
  name: string;
  arrivalTime: string;
  triageLevel: 1 | 2 | 3 | 4 | 5; // 1 = Resuscitation, 5 = Non-urgent
  chiefComplaint: string;
  status:
    | "Waiting Triage"
    | "In Triage"
    | "Waiting Doctor"
    | "In Treatment"
    | "Ready for Discharge"
    | "Admitted";
  assignedDoctor?: string;
  zone: "Red" | "Yellow" | "Green" | "Waiting";
}

export default function ERDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [patients, setPatients] = useState<ERCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentCase, setCurrentCase] = useState<Partial<ERCase>>({});

  useEffect(() => {
    const unsub = syncSetting("his_er_cases", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setPatients(data.value);
      } else {
        const seeded: ERCase[] = [
          {
            id: "ER-001",
            mrn: "MRN-5521",
            name: "Ibrahim Salem",
            arrivalTime: new Date(Date.now() - 3600000).toISOString(),
            triageLevel: 2,
            chiefComplaint: "Chest Pain, Diaphoresis",
            status: "In Treatment",
            assignedDoctor: "Dr. Khaled",
            zone: "Red",
          },
          {
            id: "ER-002",
            mrn: "MRN-8891",
            name: "Mona Hassan",
            arrivalTime: new Date(Date.now() - 1800000).toISOString(),
            triageLevel: 4,
            chiefComplaint: "Ankle Sprain",
            status: "Waiting Doctor",
            zone: "Green",
          },
          {
            id: "ER-003",
            mrn: "UNKNOWN",
            name: "John Doe",
            arrivalTime: new Date(Date.now() - 300000).toISOString(),
            triageLevel: 1,
            chiefComplaint: "MVA - Trauma",
            status: "In Treatment",
            zone: "Red",
          },
          {
            id: "ER-004",
            mrn: "MRN-1123",
            name: "Sami Omar",
            arrivalTime: new Date(Date.now() - 1200000).toISOString(),
            triageLevel: 3,
            chiefComplaint: "Severe Abdominal Pain",
            status: "Waiting Triage",
            zone: "Waiting",
          },
        ];
        setPatients(seeded);
        saveSetting("his_er_cases", seeded);
      }
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذه الحالة؟" : "Are you sure you want to delete this case?")) {
      const next = patients.filter(p => p.id !== id);
      setPatients(next);
      await saveSetting("his_er_cases", next);
      toast.success(isAr ? "تم الحذف بنجاح" : "Deleted successfully");
    }
  };

  const handleSaveModal = async () => {
    if (!currentCase.name || !currentCase.chiefComplaint) {
      toast.error(isAr ? "يرجى إدخال اسم المريض والشكوى" : "Please enter patient name and complaint");
      return;
    }

    let next: ERCase[];
    if (modalMode === "add") {
      next = [...patients, { 
        ...currentCase, 
        id: `ER-${Math.floor(1000 + Math.random() * 9000)}`,
        mrn: currentCase.mrn || "UNKNOWN",
        arrivalTime: new Date().toISOString(),
        triageLevel: currentCase.triageLevel || 3,
        status: currentCase.status || "Waiting Triage",
        zone: currentCase.zone || "Waiting"
      } as ERCase];
    } else {
      next = patients.map(p => p.id === currentCase.id ? { ...p, ...currentCase } as ERCase : p);
    }
    
    setPatients(next);
    await saveSetting("his_er_cases", next);
    setShowModal(false);
    toast.success(isAr ? "تم حفظ الحالة" : "Case saved");
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentCase({
      triageLevel: 3,
      status: "Waiting Triage",
      zone: "Waiting",
      mrn: "MRN-" + Math.floor(1000 + Math.random() * 9000)
    });
    setShowModal(true);
  };

  const openEditModal = (c: ERCase) => {
    setModalMode("edit");
    setCurrentCase(c);
    setShowModal(true);
  };

  const getTriageColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-rose-600 text-white border-rose-700";
      case 2:
        return "bg-orange-500 text-white border-orange-600";
      case 3:
        return "bg-amber-400 text-slate-800 border-amber-500";
      case 4:
        return "bg-emerald-500 text-white border-emerald-600";
      case 5:
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-slate-200 text-slate-800 border-slate-300";
    }
  };

  const calculateWaitTime = (arrival: string) => {
    const diffMins = Math.floor(
      (Date.now() - new Date(arrival).getTime()) / 60000,
    );
    if (diffMins > 60) {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
    return `${diffMins}m`;
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full relative"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-lg">
                  {modalMode === "add" 
                    ? (isAr ? "تسجيل مريض طوارئ" : "Register ER Patient")
                    : (isAr ? "تعديل حالة الطوارئ" : "Edit ER Case")
                  }
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم المريض" : "Patient Name"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-rose-500 outline-none" 
                    value={currentCase.name || ""} onChange={e => setCurrentCase({...currentCase, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الرقم الطبي (MRN)" : "MRN"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-rose-500 outline-none" 
                    value={currentCase.mrn || ""} onChange={e => setCurrentCase({...currentCase, mrn: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الشكوى الرئيسية" : "Chief Complaint"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-rose-500 outline-none" 
                    value={currentCase.chiefComplaint || ""} onChange={e => setCurrentCase({...currentCase, chiefComplaint: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "مستوى الفرز (Triage)" : "Triage Level"}</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-rose-500 outline-none"
                    value={currentCase.triageLevel || 3} onChange={e => setCurrentCase({...currentCase, triageLevel: parseInt(e.target.value) as any})}>
                    <option value={1}>1 - Resuscitation</option>
                    <option value={2}>2 - Emergent</option>
                    <option value={3}>3 - Urgent</option>
                    <option value={4}>4 - Less Urgent</option>
                    <option value={5}>5 - Non-Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "المنطقة (Zone)" : "Zone"}</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-rose-500 outline-none"
                    value={currentCase.zone || "Waiting"} onChange={e => setCurrentCase({...currentCase, zone: e.target.value as ERCase["zone"]})}>
                    <option value="Red">Red Zone</option>
                    <option value="Yellow">Yellow Zone</option>
                    <option value="Green">Green Zone</option>
                    <option value="Waiting">Waiting Area</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "حالة المريض" : "Patient Status"}</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-rose-500 outline-none"
                    value={currentCase.status || "Waiting Triage"} onChange={e => setCurrentCase({...currentCase, status: e.target.value as ERCase["status"]})}>
                    <option value="Waiting Triage">Waiting Triage</option>
                    <option value="In Triage">In Triage</option>
                    <option value="Waiting Doctor">Waiting Doctor</option>
                    <option value="In Treatment">In Treatment</option>
                    <option value="Ready for Discharge">Ready for Discharge</option>
                    <option value="Admitted">Admitted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الطبيب المعالج" : "Assigned Doctor"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-rose-500 outline-none" 
                    value={currentCase.assignedDoctor || ""} onChange={e => setCurrentCase({...currentCase, assignedDoctor: e.target.value})} />
                </div>
             </div>
             <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm">
                 {isAr ? "إلغاء" : "Cancel"}
               </button>
               <button onClick={handleSaveModal} className="px-4 py-2 font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition text-sm shadow-md">
                 {isAr ? "حفظ البيانات" : "Save Case"}
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <AlertCircle className="h-7 w-7 text-rose-600" />
            {isAr ? "شاشة الطوارئ (ER)" : "Emergency Department (ER)"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "توجيه وفرز الحالات الطارئة"
              : "Triage & emergency patient routing"}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-end">
          <div className="text-right mr-4 hidden md:block">
            <div className="text-xs font-bold text-slate-400 uppercase">
              {isAr ? "إجمالي الحالات" : "Total ER Census"}
            </div>
            <div className="text-xl font-black text-slate-800">
              {patients.length}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center mx-2 hidden lg:flex">
             <button onClick={() => toast.info(isAr ? "تسجيل حالة جديدة" : "New Case Registration")} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-1.5 rounded transition">
               {isAr ? "تسجيل حالة جديدة" : "New Case"}
             </button>
             <button onClick={() => toast.info(isAr ? "تصنيف الحالة (L1/L2/L3)" : "Triage Level (L1/L2/L3)")} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-1.5 rounded transition">
               {isAr ? "تصنيف الحالة" : "Triage Level"}
             </button>
             <button onClick={() => toast.info(isAr ? "تخطيط القلب (ECG)" : "ECG Request")} className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1.5 rounded transition">
               {isAr ? "تخطيط القلب (ECG)" : "ECG"}
             </button>
             <button onClick={() => toast.info(isAr ? "جهاز التنفس" : "Ventilator Setup")} className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1.5 rounded transition">
               {isAr ? "جهاز التنفس" : "Ventilator"}
             </button>
             <button onClick={() => toast.info(isAr ? "محلول وريدي" : "IV Fluids")} className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-1.5 rounded transition">
               {isAr ? "محلول وريدي" : "IV Fluids"}
             </button>
             <button onClick={() => toast.info(isAr ? "أدوية الطوارئ" : "Emergency Meds")} className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-1.5 rounded transition">
               {isAr ? "أدوية الطوارئ" : "ER Meds"}
             </button>
             <button onClick={() => toast.info(isAr ? "تقرير الإنعاش" : "Resuscitation Report")} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-1.5 rounded transition">
               {isAr ? "تقرير الإنعاش" : "Resuscitation Report"}
             </button>
          </div>
          <button onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Code Blue Activated! Emergency Team Notified.", titleAr: "Code Blue Activated! Emergency Team Notified.", type: "form" } }))} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap animate-pulse">
            <Activity className="h-4 w-4" /> {isAr ? "نداء الطوارئ (Code Blue)" : "Code Blue"}
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Rapid Response Team Notified.", titleAr: "Rapid Response Team Notified.", type: "form" } }))} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
            <AlertCircle className="h-4 w-4" /> {isAr ? "استجابة سريعة (RRT)" : "Rapid Response"}
          </button>
          <div className="relative flex-1 md:w-48">
            <Search
              className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`}
            />
            <input
              type="text"
              placeholder={isAr ? "بحث..." : "Search..."}
              className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 font-bold`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={openAddModal} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
            <Plus className="h-4 w-4" /> {isAr ? "تسجيل سريع" : "Quick Reg"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table
            className="w-full text-sm text-left"
            dir={isAr ? "rtl" : "ltr"}
          >
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 text-center">
                  {isAr ? "الفرز" : "Triage"}
                </th>
                <th className="px-4 py-4">{isAr ? "المريض" : "Patient"}</th>
                <th className="px-4 py-4">
                  {isAr ? "الشكوى الرئيسية" : "Chief Complaint"}
                </th>
                <th className="px-4 py-4">{isAr ? "الحالة" : "Status"}</th>
                <th className="px-4 py-4">{isAr ? "المنطقة" : "Zone"}</th>
                <th className="px-4 py-4">{isAr ? "الانتظار" : "Wait Time"}</th>
                <th className="px-4 py-4 text-right">
                  {isAr ? "إجراء" : "Action"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((patient) => {
                const waitString = calculateWaitTime(patient.arrivalTime);
                const isLongWait =
                  waitString.includes("h") || parseInt(waitString) > 30;

                return (
                  <tr key={patient.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-center">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-black border-2 shadow-sm ${getTriageColor(patient.triageLevel)}`}
                      >
                        {patient.triageLevel}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">
                        {patient.name}
                      </div>
                      <div className="text-xs font-mono text-slate-500">
                        {patient.mrn}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-700">
                      {patient.chiefComplaint}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">
                      <span
                        className={`px-2 py-1 rounded border shadow-sm ${
                          patient.zone === "Red"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : patient.zone === "Green"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : patient.zone === "Yellow"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {patient.zone} Zone
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">
                      <div
                        className={`flex items-center gap-1.5 ${isLongWait ? "text-rose-600" : "text-slate-600"}`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {waitString}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEditModal(patient)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title={isAr ? "تعديل" : "Edit"}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(patient.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title={isAr ? "حذف" : "Delete"}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500 font-bold"
                  >
                    {isAr ? "لا توجد حالات حالياً" : "No cases currently"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

