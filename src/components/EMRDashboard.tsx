import { GlobalEntityLink } from "./GlobalEntityLink";
import React, { useState, useEffect } from "react";
import { 
  Activity, Stethoscope, ClipboardList, Thermometer, User, AlertTriangle, 
  FileSignature, Save, Pill, TestTube, ArrowRight, Printer, Plus, 
  Upload, Flag, Clock, History, FileText, FileSearch, HardDrive, DollarSign,
  ShieldAlert, Send, ArrowLeft, HeartPulse, Hospital, Scissors, UserPlus,
  ArrowRightLeft, CheckCircle2, Search, FileDown, Edit3
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";
import { saveSetting, syncSetting } from "../lib/firestoreService";
import { EXTENDED_LAB_TESTS } from "../data/labTests";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import { NursingConsole } from "./NursingConsole";
import { PatientClinicalHeader } from "./PatientClinicalHeader";

interface Props {
  language: "ar" | "en";
  currentUser?: any;
  onNavigate?: (tab: string) => void;
}

type PatientTab = "summary" | "encounter" | "vitals" | "diagnoses" | "orders" | "lab" | "radiology" | "medications" | "billing" | "documents" | "audit" | "timeline";

export default function EMRDashboard({ language, currentUser, onNavigate }: Props) {
  const isAr = language === "ar";
  const [viewMode, setViewMode] = useState<"queue" | "patient_file">("queue");
  const [activeRoleTab, setActiveRoleTab] = useState<"triage" | "emr">("triage");
  const [activePatientTab, setActivePatientTab] = useState<PatientTab>("summary");
  
  const { patients, updatePatientStatus, addPrescription, cpoeOrders, setCpoeOrders, prescriptions } = useHIS();
  const triagePatients = patients.filter(p => p.status === "registered" || p.status === "triage");
  const doctorPatients = patients.filter(p => p.status === "doctor");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // User Role Detection
  const currentUserStr = sessionStorage.getItem("hospital_currentUser");
  const currentUserObj = currentUserStr ? JSON.parse(currentUserStr) : null;
  const userRole = currentUserObj?.role || "doctor"; // Fallback to doctor
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  // Modals / Overlays
  const [showOrderLab, setShowOrderLab] = useState(false);
  const [showOrderRx, setShowOrderRx] = useState(false);
  const [showAdmission, setShowAdmission] = useState(false);
  const [showSurgery, setShowSurgery] = useState(false);

  // States for Lab Order
  const [labTestName, setLabTestName] = useState("");
  const [labSearchFocus, setLabSearchFocus] = useState(false);
  const [labPriority, setLabPriority] = useState("Routine");
  const [labNotes, setLabNotes] = useState("");
  
  // States for Rx Order
  const [rxMedName, setRxMedName] = useState("");
  const [rxDose, setRxDose] = useState("");
  
  // States for Surgery Order
  const [surgProcedure, setSurgProcedure] = useState("");
  const [surgPriority, setSurgPriority] = useState("Elective");

  const handleOpenPatient = (id: string, name?: string) => {
    const patient = patients.find(p => p.id === id);
    window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: id, patientName: name || (patient ? (isAr ? patient.nameAr : patient.nameEn) : "Patient"), initialTab: "summary" } }));
  };

  const handleBackToQueue = () => {
    setViewMode("queue");
    setSelectedPatientId(null);
  };

  const submitLabOrder = async () => {
    if (!selectedPatient) return;
    const newOrder = {
      id: `ORD-LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      orderType: "Lab",
      status: "Pending",
      priority: labPriority,
      patientName: isAr ? selectedPatient.nameAr : selectedPatient.nameEn,
      mrn: selectedPatient.mrn,
      doctorId: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed (Current User)",
      orderName: labTestName || "General Lab Panel",
      createdAt: new Date().toISOString(),
      visitId: selectedPatient.id
    };

    if (setCpoeOrders) {
      setCpoeOrders((prev: any) => [...prev, newOrder]);
    }
    
    toast.success(isAr ? "تم إرسال الطلب للمعمل" : "Lab order sent successfully");
    setShowOrderLab(false);
  };

  const submitRxOrder = async () => {
    if (!selectedPatient || !rxMedName) return;
    const newOrder = {
      id: `ORD-RX-${Math.floor(1000 + Math.random() * 9000)}`,
      orderType: "Medication",
      status: "Pending",
      patientName: isAr ? selectedPatient.nameAr : selectedPatient.nameEn,
      mrn: selectedPatient.mrn,
      doctorId: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed (Current User)",
      medication: rxMedName,
      dose: rxDose || "As directed",
      createdAt: new Date().toISOString(),
      visitId: selectedPatient.id
    };

    if (setCpoeOrders) {
      setCpoeOrders((prev: any) => [...prev, newOrder]);
    }
    
    toast.success(isAr ? "تم إرسال الوصفة للصيدلية" : "Prescription sent to pharmacy");
    setShowOrderRx(false);
  };

  const submitAdmission = () => {
    if (selectedPatient) {
      updatePatientStatus(selectedPatient.id, "ward");
    }
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Patient admitted to Ward & request sent to Bed Management", titleAr: "تم نقل المريض للتنويم الداخلي وتوجيه طلب لإدارة الأسرة", type: "form" } }));
    setShowAdmission(false);
    if (onNavigate) {
      onNavigate("ipd");
    }
  };

  const submitSurgery = () => {
    if (!selectedPatient || !surgProcedure) return;

    const newSurgery = {
      id: `SURG-${Math.floor(1000 + Math.random() * 9000)}`,
      mrn: selectedPatient.mrn,
      patientName: isAr ? selectedPatient.nameAr : selectedPatient.nameEn,
      procedure: surgProcedure,
      surgeon: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed (Current User)",
      anesthesiologist: "Pending Assignment",
      roomId: "Pending",
      status: "Scheduled",
      timeSlot: "TBD",
      priority: surgPriority
    };

    // Save directly to his_surgeries via localStorage to sync
    const currentSurgeriesStr = localStorage.getItem("his_surgeries");
    let currentSurgeries = [];
    if (currentSurgeriesStr) {
      try {
        const parsed = JSON.parse(currentSurgeriesStr);
        if (parsed && Array.isArray(parsed.value)) {
          currentSurgeries = parsed.value;
        }
      } catch (e) {}
    }
    
    currentSurgeries.push(newSurgery);
    localStorage.setItem("his_surgeries", JSON.stringify({ value: currentSurgeries, timestamp: Date.now() }));
    // Dispatch event to trigger listeners
    window.dispatchEvent(new Event("storage"));

    toast.success(isAr ? "تم إرسال طلب الجراحة لقسم العمليات" : "Surgery request sent to Operating Theater");
    setShowSurgery(false);
  };

  if (viewMode === "patient_file" && selectedPatient) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans" dir={isAr ? "rtl" : "ltr"}>
        {/* Modals */}
        {showOrderLab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-indigo-500" /> {isAr ? "طلب فحص معملي" : "Order Lab Test"}
                  </h3>
               </div>
               <div className="p-5 space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Test Name</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input 
                        value={labTestName} 
                        onChange={e => {
                          setLabTestName(e.target.value);
                          setLabSearchFocus(true);
                        }}
                        onFocus={() => setLabSearchFocus(true)}
                        onBlur={() => setTimeout(() => setLabSearchFocus(false), 200)}
                        type="text" 
                        placeholder="Search over 2000+ tests (e.g. CBC, LFT, Panel 1)..." 
                        className="w-full border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:border-indigo-500 outline-none" 
                      />
                    </div>
                    {labSearchFocus && labTestName.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {EXTENDED_LAB_TESTS.filter(t => t?.toLowerCase()?.includes(labTestName?.toLowerCase())).slice(0, 50).map((test, idx) => (
                          <div 
                            key={idx} 
                            className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                            onMouseDown={() => {
                              setLabTestName(test);
                              setLabSearchFocus(false);
                            }}
                          >
                            {test}
                          </div>
                        ))}
                        {EXTENDED_LAB_TESTS.filter(t => t?.toLowerCase()?.includes(labTestName?.toLowerCase())).length === 0 && (
                          <div className="px-3 py-2 text-sm text-slate-500 italic">No tests found.</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                    <select value={labPriority} onChange={e => setLabPriority(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none">
                      <option>Routine</option>
                      <option>Urgent</option>
                      <option>STAT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Clinical Notes</label>
                    <textarea value={labNotes} onChange={e => setLabNotes(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none min-h-[80px]"></textarea>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setShowOrderLab(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
                 <button className="px-4 py-2 font-bold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 text-sm">Save Draft</button>
                 <button onClick={submitLabOrder} className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-2">
                   <Send className="w-4 h-4" /> Save & Send
                 </button>
               </div>
            </div>
          </div>
        )}

        {showOrderRx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <Pill className="w-5 h-5 text-rose-500" /> {isAr ? "وصفة طبية جديدة" : "New E-Prescription"}
                  </h3>
               </div>
               <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم الدواء" : "Medication Name"}</label>
                    <input 
                      value={rxMedName} 
                      onChange={e => setRxMedName(e.target.value)}
                      placeholder="e.g. Paracetamol 500mg, Amoxicillin..." 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 focus:border-rose-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الجرعة والتعليمات" : "Dose & Instructions"}</label>
                    <input 
                      value={rxDose} 
                      onChange={e => setRxDose(e.target.value)}
                      placeholder="e.g. 1 tablet every 8 hours after meals" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 focus:border-rose-500 outline-none" 
                    />
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setShowOrderRx(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
                 <button onClick={submitRxOrder} className="px-4 py-2 font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 text-sm flex items-center gap-2">
                   <Send className="w-4 h-4" /> Save & Send
                 </button>
               </div>
            </div>
          </div>
        )}

        {showAdmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <Hospital className="w-5 h-5 text-indigo-500" /> {isAr ? "طلب تنويم" : "Admission Request"}
                  </h3>
               </div>
               <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Admission Type</label>
                    <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none">
                      <option>Medical</option>
                      <option>Surgical</option>
                      <option>ICU</option>
                      <option>Isolation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                    <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none">
                      <option>Routine</option>
                      <option>Urgent</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Reason for Admission</label>
                    <textarea className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none min-h-[80px]"></textarea>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setShowAdmission(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
                 <button onClick={submitAdmission} className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 text-sm">Send Request</button>
               </div>
            </div>
          </div>
        )}

        {showSurgery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-rose-500" /> {isAr ? "طلب عملية جراحية" : "Surgery Request"}
                  </h3>
               </div>
               <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Procedure Name</label>
                    <input 
                      type="text" 
                      value={surgProcedure}
                      onChange={e => setSurgProcedure(e.target.value)}
                      placeholder="e.g. Appendectomy" 
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                    <select 
                      value={surgPriority}
                      onChange={e => setSurgPriority(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none"
                    >
                      <option>Elective</option>
                      <option>Urgent</option>
                      <option>Emergency (STAT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Surgeon Instructions / Pre-Op Notes</label>
                    <textarea className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none min-h-[80px]"></textarea>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setShowSurgery(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
                 <button onClick={submitSurgery} className="px-4 py-2 font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 text-sm">Send to OT</button>
               </div>
            </div>
          </div>
        )}

        {/* Patient Header Banner */}
        <div className="bg-white border-b border-slate-200 shadow-sm p-4 shrink-0">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={handleBackToQueue} className="p-2 hover:bg-slate-100 rounded-lg transition">
              <ArrowLeft className={`w-5 h-5 text-slate-500 ${isAr ? "rotate-180" : ""}`} />
            </button>
            <div className="flex-1">
              <PatientClinicalHeader patient={selectedPatient} language={language} showVitals={true} />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap mt-2 pl-12">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Editing Patient Profile", titleAr: "تعديل بيانات المريض", type: "form" } }))}
              className="px-3 py-1.5 text-[11px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isAr ? "تعديل الملف" : "Edit Profile"}
            </button>
            <button 
              onClick={() => window.print()}
              className="px-3 py-1.5 text-[11px] font-black text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> {isAr ? "طباعة الملف" : "Print File"}
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Creating New Visit", titleAr: "إضافة زيارة جديدة", type: "form" } }))}
              className="px-3 py-1.5 text-[11px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> {isAr ? "زيارة جديدة" : "New Visit"}
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Uploading Clinical Document", titleAr: "رفع وثيقة طبية", type: "form" } }))}
              className="px-3 py-1.5 text-[11px] font-black text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-100 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" /> {isAr ? "رفع وثيقة" : "Upload Document"}
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Adding New Medical Report", titleAr: "إضافة تقرير طبي جديد", type: "form" } }))}
              className="px-3 py-1.5 text-[11px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5" /> {isAr ? "إضافة تقرير" : "Add Report"}
            </button>
            <button className="px-3 py-1.5 text-[11px] font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex items-center gap-1.5 shadow-sm">
              <Flag className="w-3.5 h-3.5" /> {isAr ? "تنبيه طوارئ" : "Emergency Flag"}
            </button>
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto gap-1 border-b border-slate-100 hide-scrollbar pt-2">
            {[
              { id: "summary", label: "Summary", icon: <User className="w-4 h-4" /> },
              { id: "encounter", label: "Active Encounter", icon: <Stethoscope className="w-4 h-4" /> },
              { id: "timeline", label: "Timeline", icon: <History className="w-4 h-4" /> },
              { id: "vitals", label: "Vitals", icon: <Activity className="w-4 h-4" /> },
              { id: "diagnoses", label: "Diagnoses", icon: <AlertTriangle className="w-4 h-4" /> },
              { id: "orders", label: "Orders", icon: <ClipboardList className="w-4 h-4" /> },
              { id: "lab", label: "Lab", icon: <TestTube className="w-4 h-4" /> },
              { id: "radiology", label: "Radiology", icon: <HardDrive className="w-4 h-4" /> },
              { id: "medications", label: "Medications", icon: <Pill className="w-4 h-4" /> },
              { id: "billing", label: "Billing", icon: <DollarSign className="w-4 h-4" /> },
              { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
              { id: "audit", label: "Audit", icon: <ShieldAlert className="w-4 h-4" /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActivePatientTab(tab.id as PatientTab)}
                className={`px-4 py-2.5 text-sm font-bold flex items-center gap-2 whitespace-nowrap border-b-2 transition-colors ${activePatientTab === tab.id ? 'border-emerald-500 text-emerald-700 bg-emerald-50/30' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                {tab.icon} {isAr && tab.id === "encounter" ? "الزيارة الحالية" : tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activePatientTab === "summary" && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
               <div className="flex justify-end gap-2 mb-4">
                  <button className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition border border-indigo-100">Edit Summary</button>
                  <button className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition border border-rose-100">Add Allergy</button>
                  <button className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition border border-emerald-100">Add History</button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">Chief Complaint</h3>
                    <p className="text-sm text-slate-600">Patient presents with chest pain radiating to the left arm, shortness of breath, and diaphoresis starting 2 hours ago.</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">History of Present Illness (HPI)</h3>
                    <p className="text-sm text-slate-600">Pain is described as crushing, 8/10 in severity. Not relieved by rest. Patient has a history of hypertension but is non-compliant with meds.</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">Past Medical History (PMH)</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                      <li>Hypertension (diagnosed 2018)</li>
                      <li>Type 2 Diabetes Mellitus</li>
                      <li>Appendectomy (2005)</li>
                    </ul>
                  </div>
                  <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 shadow-sm">
                    <h3 className="font-black text-rose-800 mb-3 text-sm border-b border-rose-200 pb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Allergies</h3>
                    <div className="flex gap-2 flex-wrap">
                       <span className="bg-rose-200 text-rose-800 px-3 py-1 rounded-lg text-xs font-bold">Penicillin (Hives)</span>
                       <span className="bg-rose-200 text-rose-800 px-3 py-1 rounded-lg text-xs font-bold">Peanuts (Anaphylaxis)</span>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">Current Medications</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                      <li>Lisinopril 10mg daily</li>
                      <li>Metformin 500mg BID</li>
                    </ul>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">Insurance Information</h3>
                    <p className="text-sm text-slate-600 font-bold">{selectedPatient.insurance}</p>
                    <p className="text-xs text-slate-500 mt-1">Policy No: POL-9928374</p>
                    <p className="text-xs text-slate-500">Status: <span className="text-emerald-600 font-bold">Active & Eligible</span></p>
                  </div>
               </div>
            </div>
          )}

          {activePatientTab === "encounter" && (
            <div className="max-w-7xl mx-auto flex flex-col h-full animate-fade-in space-y-6">
               {userRole === "staff" || userRole === "nurse" ? (
                 <NursingConsole 
                    patient={selectedPatient} 
                    staffId={currentUser?.id || "NURSE-01"} 
                    language={language}
                 />
               ) : (
                 <DoctorConsultationDesk
                    language={language}
                    currentUser={currentUser}
                    systemUsers={[]}
                    departments={[]}
                    forcedPatientId={selectedPatient.id}
                    isEmbedded={true}
                 />
               )}
            </div>
          )}

          {activePatientTab === "timeline" && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 animate-fade-in relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
               
               <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4 relative z-10">
                 <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
                    <History className="w-6 h-6 text-indigo-500" />
                    {isAr ? "السجل التشاركي ومسار المريض (Collaborative EMR Timeline)" : "Collaborative EMR Timeline"}
                 </h3>
                 <div className="flex gap-2">
                   <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Filter: Labs</button>
                   <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Filter: Consults</button>
                 </div>
               </div>
               
               <div className="relative pl-8 border-l-2 border-indigo-100 space-y-10 z-10">
                  {[
                    { id: "EVT-001", time: "08:00 AM", date: "2023-10-27", user: "Receptionist Ali", dept: "Front Desk", type: "Registration", action: "Registration & Check-in", desc: "Patient arrived and registered at main desk.", icon: <User className="w-5 h-5" />, color: "bg-blue-100 text-blue-600 border-blue-200", route: "reception" },
                    { id: "EVT-002", time: "08:10 AM", date: "2023-10-27", user: "Nurse Sara", dept: "Triage", type: "Vitals", action: "Vitals Recorded", desc: "BP: 145/90, HR: 98, Temp: 37.2°C, SpO2: 96%", icon: <Activity className="w-5 h-5" />, color: "bg-emerald-100 text-emerald-600 border-emerald-200", route: "triage" },
                    { id: "EVT-003", time: "08:20 AM", date: "2023-10-27", user: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed", dept: "Cardiology", type: "Encounter", action: "Initial Assessment", desc: "Patient reports chest pain radiating to left arm. ECG ordered immediately.", icon: <Stethoscope className="w-5 h-5" />, color: "bg-indigo-100 text-indigo-600 border-indigo-200", route: "emr_encounter" },
                    { id: "EVT-004", time: "08:35 AM", date: "2023-10-27", user: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed", dept: "Cardiology", type: "Order", action: "Lab Ordered (CBC, Troponin, Lipid)", desc: "STAT orders sent to central laboratory.", icon: <TestTube className="w-5 h-5" />, color: "bg-purple-100 text-purple-600 border-purple-200", route: "cpoe_orders" },
                    { id: "EVT-005", time: "09:30 AM", date: "2023-10-27", user: "Sysmex Analyzer (Auto)", dept: "Laboratory", type: "Result", action: "CBC Results Released", desc: "WBC elevated at 11.2. Click to view full report.", icon: <FileSearch className="w-5 h-5" />, color: "bg-rose-100 text-rose-600 border-rose-200", route: "lab_results" },
                    { id: "EVT-006", time: "09:45 AM", date: "2023-10-27", user: "Dr. Youssef", dept: "Internal Med", type: "Consult", action: "Internal Medicine Consult", desc: "Patient cleared for discharge with medication. Follow up in 1 week.", icon: <UserPlus className="w-5 h-5" />, color: "bg-amber-100 text-amber-600 border-amber-200", route: "consultations" },
                  ].map((event, i) => (
                    <div key={i} className="relative group cursor-pointer" onClick={() => {
                        window.dispatchEvent(new CustomEvent("openGenericModal", {
                          detail: { entityId: event.id, titleEn: event.action, titleAr: event.action, type: event.type }
                        }));
                    }}>
                       <div className={`absolute -left-[45px] top-0 w-10 h-10 rounded-xl flex items-center justify-center border-2 bg-white ${event.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                          {event.icon}
                       </div>
                       <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group-hover:border-indigo-200 ml-4 relative">
                          <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                             {event.date} {event.time}
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="font-black text-slate-800 text-base group-hover:text-indigo-600 transition-colors">{event.action}</span>
                             <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{event.dept}</span>
                          </div>
                          <p className="text-sm font-medium text-slate-600 mb-3 leading-relaxed">{event.desc}</p>
                          <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                             <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">
                                {event.user.charAt(0)}
                             </div>
                             <p className="text-xs text-slate-500 font-bold">Action by: <span className="text-slate-700">{event.user}</span></p>
                             <div className="flex-1"></div>
                             <span className="text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to view details &rarr;</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Placeholders for other tabs */}
          {["vitals", "diagnoses", "billing", "documents", "audit"]?.includes(activePatientTab) && (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-fade-in">
                <FileSearch className="w-16 h-16 mb-4 opacity-50" />
                <h2 className="text-xl font-black text-slate-700">{activePatientTab.charAt(0).toUpperCase() + activePatientTab.slice(1)} Module</h2>
                <p className="text-sm mt-2">This dedicated view is part of the comprehensive EMR suite.</p>
             </div>
          )}

          {/* Actual Orders / Lab / Radiology / Medications Tabs */}
          {["orders", "lab", "radiology", "medications"]?.includes(activePatientTab) && (() => {
             const patientCpoe = (cpoeOrders || []).filter((o: any) => o.mrn === selectedPatient?.mrn || o.visitId === selectedPatient?.id);
             const patientRx = (prescriptions || []).filter(rx => rx.patientId === selectedPatient?.id);
             
             let displayedItems = [];
             if (activePatientTab === "orders") {
               displayedItems = patientCpoe;
             } else if (activePatientTab === "lab") {
               displayedItems = patientCpoe.filter((o: any) => o.orderType === "Lab" || o.type === "LAB");
             } else if (activePatientTab === "radiology") {
               displayedItems = patientCpoe.filter((o: any) => o.orderType === "Radiology" || o.type === "RAD");
             } else if (activePatientTab === "medications") {
               // Combine CPOE Meds and Legacy Prescriptions
               const cpoeMeds = patientCpoe.filter((o: any) => o.orderType === "Medication");
               displayedItems = [...cpoeMeds, ...patientRx];
             }

             return (
               <div className="h-full animate-fade-in flex flex-col">
                 <h3 className="text-lg font-black text-slate-800 mb-4 capitalize">{isAr ? "السجلات السريرية" : activePatientTab}</h3>
                 {displayedItems.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                     <FileSearch className="w-8 h-8 mb-2 opacity-50" />
                     <p className="text-sm font-bold">{isAr ? "لا توجد سجلات" : "No records found"}</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {displayedItems.map((item: any, idx) => (
                       <div key={item.id || idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-slate-800 text-sm">{item.orderName || item.medication || "Clinical Order"}</h4>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                             item.status === 'Completed' || item.status === 'dispensed' ? 'bg-emerald-100 text-emerald-700' : 
                             item.status === 'Pending' || item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                             'bg-slate-100 text-slate-600'
                           }`}>
                             {item.status || "Unknown"}
                           </span>
                         </div>
                         {(item.instructions || item.dose) && (
                           <p className="text-xs text-slate-600 font-medium mb-3">{item.instructions || item.dose} {item.qty ? `(Qty: ${item.qty})` : ''}</p>
                         )}
                         <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-2 mt-auto">
                           <span>{item.createdAt || item.date ? new Date(item.createdAt || item.date).toLocaleDateString() : "No Date"}</span>
                           <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{item.orderType || "Prescription"}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             );
          })()}

        </div>
      </div>
    );
  }

  // Queue View (Default)
  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start gap-4 border-s-4 border-s-emerald-500 mb-6">
        <div className="flex flex-col md:flex-row justify-between w-full gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Activity className="h-7 w-7 text-emerald-600" />
              {isAr ? "العيادات الخارجية ومكتب الطبيب (OPD & Doctor EMR)" : "Outpatient Dept & Physician EMR"}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {isAr ? "محطة التمريض والفرز (Triage)، والملف الطبي الإلكتروني للطبيب (EMR, CPOE)." : "Nursing Triage Station and complete Physician EMR / CPOE."}
            </p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-start md:self-auto flex-wrap">
            <button onClick={() => setActiveRoleTab("triage")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeRoleTab === "triage" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <Thermometer className="w-4 h-4" /> {isAr ? "فرز التمريض (Triage)" : "Nurse Triage"}
            </button>
            <button onClick={() => setActiveRoleTab("emr")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeRoleTab === "emr" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <User className="w-4 h-4" /> {isAr ? "مكتب الطبيب (EMR)" : "Physician Desk"}
            </button>
          </div>
        </div>

        {/* Real-time Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-2 pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-800">{triagePatients.length + doctorPatients.length + 5}</span>
            <span className="text-xs font-bold text-slate-500">{isAr ? "إجمالي المسجلين اليوم" : "Total Registered Today"}</span>
          </div>
          <div className="flex flex-col border-s border-slate-100 ps-4">
            <span className="text-2xl font-black text-amber-600">{triagePatients.length}</span>
            <span className="text-xs font-bold text-slate-500">{isAr ? "في الانتظار (فرز)" : "Waiting (Triage)"}</span>
          </div>
          <div className="flex flex-col border-s border-slate-100 ps-4">
            <span className="text-2xl font-black text-emerald-600">{doctorPatients.length}</span>
            <span className="text-xs font-bold text-slate-500">{isAr ? "جاهز للدخول" : "Ready to see"}</span>
          </div>
          <div className="flex flex-col border-s border-slate-100 ps-4">
            <span className="text-2xl font-black text-indigo-600">5</span>
            <span className="text-xs font-bold text-slate-500">{isAr ? "اكتمل الكشف" : "Completed"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {activeRoleTab === "triage" && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[min(calc(100vh-200px),700px)] flex flex-col">
                 <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                       <ClipboardList className="w-5 h-5 text-emerald-500" /> {isAr ? "قائمة انتظار العيادة اليوم" : "Today's Clinic Queue"}
                    </h3>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {triagePatients.map((patient, idx) => {
                      // Simulated ESI level based on index (ESI-2 to ESI-5)
                      const esiLevel = (idx % 4) + 2;
                      const getEsiColor = (level: number) => {
                        if (level === 1) return "bg-rose-600 text-white animate-pulse shadow-sm";
                        if (level === 2) return "bg-orange-500 text-white shadow-sm";
                        if (level === 3) return "bg-amber-400 text-amber-900 shadow-sm";
                        if (level === 4) return "bg-emerald-500 text-white shadow-sm";
                        return "bg-blue-500 text-white shadow-sm";
                      };

                      return (
                        <div key={patient.id} className="border rounded-xl p-3 transition bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm">
                           <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => handleOpenPatient(patient.id)}>
                              <div>
                                <span className="font-bold text-slate-800 text-sm block">{isAr ? patient.nameAr : patient.nameEn}</span>
                                <span className="font-mono text-[10px] font-bold text-slate-500"><GlobalEntityLink entityId={patient.mrn} entityName={patient.nameEn} entityType="patient" isAr={isAr}>{patient.mrn}</GlobalEntityLink></span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${getEsiColor(esiLevel)}`}>
                                 ESI-{esiLevel}
                              </span>
                           </div>
                           <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                              <span className="text-xs text-slate-500 font-medium">
                                <Clock className="w-3 h-3 inline mr-1 text-slate-400" /> {isAr ? "انتظار:" : "Wait:"} {10 + idx * 5} min
                              </span>
                              <div className="flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Cancel Appointment", titleAr: "إلغاء الموعد", type: "form" } })); }} className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-colors">
                                  {isAr ? "إلغاء" : "Cancel"}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleOpenPatient(patient.id); }} className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                  <HeartPulse className="w-3.5 h-3.5" />
                                  {isAr ? "تسجيل العلامات الحيوية" : "Record Vitals"}
                                </button>
                              </div>
                           </div>
                        </div>
                      )
                    })}
                    {triagePatients.length === 0 && <p className="text-center text-sm text-slate-500 p-4">{isAr ? "لا يوجد مرضى في الانتظار" : "No patients in waiting queue"}</p>}
                 </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center text-slate-400 p-10 relative">
                 <Thermometer className="w-16 h-16 mb-4 opacity-50" />
                 <h2 className="text-xl font-black text-slate-700">{isAr ? "حدد مريضاً لفتح الملف الطبي" : "Select a patient to open their medical file"}</h2>
                 <p className="text-sm mt-2 text-center max-w-md">{isAr ? "يدعم الملف الطبي تسجيل العلامات الحيوية، التاريخ المرضي، وملاحظات التمريض كاملة." : "The Patient File interface supports full triage vitals entry, clinical history, and nursing notes."}</p>
              </div>
           </div>
        )}

        {activeRoleTab === "emr" && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[min(calc(100vh-200px),700px)] flex flex-col">
                 <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                       <User className="w-5 h-5 text-emerald-500" /> {isAr ? "مرضى العيادة" : "My Patients"}
                    </h3>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {doctorPatients.map((patient, idx) => (
                      <div key={patient.id} className="border rounded-xl p-3 transition bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm">
                         <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => handleOpenPatient(patient.id)}>
                            <div>
                              <span className="font-bold text-slate-800 text-sm block">{isAr ? patient.nameAr : patient.nameEn}</span>
                              <span className="font-mono text-[10px] font-bold text-slate-500"><GlobalEntityLink entityId={patient.mrn} entityName={patient.nameEn} entityType="patient" isAr={isAr}>{patient.mrn}</GlobalEntityLink></span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800`}>
                               {isAr ? "جاهز للدخول" : "Ready to see"}
                            </span>
                         </div>
                         <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                            <span className="text-xs text-slate-500 font-medium">
                              <Clock className="w-3 h-3 inline mr-1 text-slate-400" /> 10:30 AM
                            </span>
                            <div className="flex gap-2">
                              <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Cancel Appointment", titleAr: "إلغاء الموعد", type: "form" } })); }} className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-colors">
                                {isAr ? "إلغاء" : "Cancel"}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleOpenPatient(patient.id); }} className="text-xs bg-[#0a4275] hover:bg-[#0a4275]/90 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                <Stethoscope className="w-3.5 h-3.5" />
                                {isAr ? "بدء الكشف الطبي" : "Start Exam"}
                              </button>
                            </div>
                         </div>
                      </div>
                    ))}
                    {doctorPatients.length === 0 && <p className="text-center text-sm text-slate-500 p-4">{isAr ? "لا يوجد مرضى حالياً" : "No patients assigned"}</p>}
                 </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center text-slate-400 p-10 relative">
                 <Stethoscope className="w-16 h-16 mb-4 opacity-50" />
                 <h2 className="text-xl font-black text-slate-700">{isAr ? "مساحة عمل الطبيب" : "Doctor Workspace"}</h2>
                 <p className="text-sm mt-2 text-center max-w-md">{isAr ? "قم باختيار مريض من القائمة لفتح الملف الطبي وبدء الكشف وإصدار الأوامر الطبية (CPOE)." : "Select a patient to open the full EMR, review history, and issue CPOE orders (Labs, Radiology, Prescriptions)."}</p>
                 
                 {/* Quick CPOE Actions - Empty State */}
                 <div className="mt-8 flex gap-3">
                   <button onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Quick E-Prescription", titleAr: "روشتة إلكترونية سريعة", type: "form" } }))} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-800 transition font-bold text-sm flex items-center gap-2">
                     <Pill className="w-4 h-4 text-emerald-600" />
                     {isAr ? "وصفة سريعة (CPOE)" : "Quick Rx (CPOE)"}
                   </button>
                   <button onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Quick Order Labs/Imaging", titleAr: "طلب تحاليل/أشعة سريع", type: "form" } }))} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-800 transition font-bold text-sm flex items-center gap-2">
                     <TestTube className="w-4 h-4 text-indigo-600" />
                     {isAr ? "طلب فحص سريع" : "Quick Order"}
                   </button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
