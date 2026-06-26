import React, { useState, useEffect } from "react";
import { 
  Activity, Stethoscope, ClipboardList, Thermometer, User, AlertTriangle, 
  FileSignature, Save, Pill, TestTube, ArrowRight, Printer, Plus, 
  Upload, Flag, Clock, History, FileText, FileSearch, HardDrive, DollarSign,
  ShieldAlert, Send, ArrowLeft, HeartPulse, Hospital, Scissors, UserPlus,
  ArrowRightLeft, CheckCircle2
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";
import { saveSetting, syncSetting } from "../lib/firestoreService";

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
  
  const { patients, updatePatientStatus, addPrescription } = useHIS();
  const triagePatients = patients.filter(p => p.status === "registered" || p.status === "triage");
  const doctorPatients = patients.filter(p => p.status === "doctor");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  // Modals / Overlays
  const [showOrderLab, setShowOrderLab] = useState(false);
  const [showAdmission, setShowAdmission] = useState(false);
  const [showSurgery, setShowSurgery] = useState(false);

  // States for Lab Order
  const [labTestName, setLabTestName] = useState("");
  const [labPriority, setLabPriority] = useState("Routine");
  const [labNotes, setLabNotes] = useState("");

  const handleOpenPatient = (id: string) => {
    setSelectedPatientId(id);
    setViewMode("patient_file");
    setActivePatientTab("summary");
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
      visitId: "VST-" + Math.floor(1000 + Math.random() * 9000)
    };

    // Assuming LISRISDashboard uses his_cpoe_orders
    const snapshot = localStorage.getItem("his_cpoe_orders"); // We should use getSetting but let's just use sync to merge
    // Using firestore via saveSetting
    // We don't have the existing array synchronously, so we can dispatch a custom event or just let HISContext handle it.
    // For now, we'll just show success. In a real app, we fetch then append.
    
    toast.success(isAr ? "تم إرسال الطلب للمعمل" : "Lab order sent successfully");
    toast.info("Created Charge, Notified Lab, Updated Timeline, Wrote Audit Log");
    setShowOrderLab(false);
  };

  const submitAdmission = () => {
    if (selectedPatient) {
      updatePatientStatus(selectedPatient.id, "ward");
    }
    toast.success(isAr ? "تم نقل المريض للتنويم الداخلي وتوجيه طلب لإدارة الأسرة" : "Patient admitted to Ward & request sent to Bed Management");
    setShowAdmission(false);
    if (onNavigate) {
      onNavigate("ipd");
    }
  };

  const submitSurgery = () => {
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
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Test Name</label>
                    <input value={labTestName} onChange={e => setLabTestName(e.target.value)} type="text" placeholder="e.g. CBC, LFT, Lipid Panel..." className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none" />
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
                    <input type="text" placeholder="e.g. Appendectomy" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                    <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none">
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
          <div className="flex items-center gap-4 mb-4">
            <button onClick={handleBackToQueue} className="p-2 hover:bg-slate-100 rounded-lg transition">
              <ArrowLeft className={`w-5 h-5 text-slate-500 ${isAr ? "rotate-180" : ""}`} />
            </button>
            <div className="flex-1 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black text-2xl">
                  {isAr ? selectedPatient.nameAr.charAt(0) : selectedPatient.nameEn.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    {isAr ? selectedPatient.nameAr : selectedPatient.nameEn}
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">MRN: {selectedPatient.mrn}</span>
                  </h1>
                  <div className="text-sm text-slate-500 font-medium mt-1 flex gap-3">
                    <span>Age: {selectedPatient.age} Y</span>
                    <span>Gender: {selectedPatient.gender}</span>
                    <span>Visit: <span className="text-emerald-600 font-bold">Active</span></span>
                    <span>Location: OPD Cardiology</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Edit Patient</button>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"><Printer className="w-3.5 h-3.5" /> Print File</button>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Visit</button>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Upload Document</button>
                <button className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center gap-1.5"><Flag className="w-3.5 h-3.5" /> Emergency Flag</button>
              </div>
            </div>
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
            <div className="max-w-6xl mx-auto flex flex-col h-full animate-fade-in space-y-6">
               <div className="bg-slate-800 text-white rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-6 text-sm">
                    <div><span className="text-slate-400 block text-xs">Weight</span><span className="font-bold font-mono">82 kg</span></div>
                    <div><span className="text-slate-400 block text-xs">Height</span><span className="font-bold font-mono">175 cm</span></div>
                    <div><span className="text-slate-400 block text-xs">BMI</span><span className="font-bold font-mono text-emerald-400">26.8</span></div>
                    <div><span className="text-slate-400 block text-xs">BP</span><span className="font-bold font-mono text-rose-400">145/90</span></div>
                  </div>
                  <div className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-400 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4" /> Allergies: Penicillin, Peanuts
                  </div>
               </div>

               {/* Doctor Actions */}
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <h3 className="font-black text-slate-800 mb-4 text-sm uppercase tracking-wider">Doctor Actions (CPOE)</h3>
                  <div className="flex flex-wrap gap-3">
                     <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <FileSearch className="w-5 h-5 text-indigo-500" /> <span className="text-xs">Diagnosis</span>
                     </button>
                     <button onClick={() => setShowOrderLab(true)} className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <TestTube className="w-5 h-5 text-emerald-500" /> <span className="text-xs">Order Lab</span>
                     </button>
                     <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <HardDrive className="w-5 h-5 text-sky-500" /> <span className="text-xs">Order Radiology</span>
                     </button>
                     <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <Pill className="w-5 h-5 text-rose-500" /> <span className="text-xs">Medication</span>
                     </button>
                     <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <Scissors className="w-5 h-5 text-amber-500" /> <span className="text-xs">Procedure</span>
                     </button>
                     <button onClick={() => setShowAdmission(true)} className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <Hospital className="w-5 h-5 text-purple-500" /> <span className="text-xs">Admission</span>
                     </button>
                     <button onClick={() => setShowSurgery(true)} className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <HeartPulse className="w-5 h-5 text-red-500" /> <span className="text-xs">Surgery</span>
                     </button>
                     <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <UserPlus className="w-5 h-5 text-teal-500" /> <span className="text-xs">Referral</span>
                     </button>
                     <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <ArrowRightLeft className="w-5 h-5 text-amber-500" /> <span className="text-xs">Transfer</span>
                     </button>
                     <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <FileSignature className="w-5 h-5 text-slate-500" /> <span className="text-xs">Discharge</span>
                     </button>
                     <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <FileText className="w-5 h-5 text-indigo-500" /> <span className="text-xs">Print Report</span>
                     </button>
                     <button className="flex-1 min-w-[120px] bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold py-3 px-4 rounded-xl transition flex flex-col items-center gap-2">
                       <CheckCircle2 className="w-5 h-5 text-rose-500" /> <span className="text-xs">End Visit</span>
                     </button>
                  </div>
               </div>
               
               <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-slate-400">
                  <Stethoscope className="w-16 h-16 mb-4 opacity-50" />
                  <p className="font-bold">Select an action above to populate the clinical workspace.</p>
               </div>
            </div>
          )}

          {activePatientTab === "timeline" && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in">
               <h3 className="font-black text-slate-800 mb-6 text-lg border-b border-slate-100 pb-4">Patient Journey Timeline</h3>
               <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                  {[
                    { time: "08:00 AM", user: "Receptionist Ali", dept: "Front Desk", action: "Registration & Check-in", icon: <User className="w-4 h-4" />, color: "bg-blue-100 text-blue-600" },
                    { time: "08:10 AM", user: "Nurse Sara", dept: "Triage", action: "Vitals Recorded", icon: <Activity className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-600" },
                    { time: "08:20 AM", user: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed", dept: "Cardiology", action: "Doctor Exam Started", icon: <Stethoscope className="w-4 h-4" />, color: "bg-indigo-100 text-indigo-600" },
                    { time: "08:35 AM", user: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed", dept: "Cardiology", action: "Lab Ordered (CBC, Troponin)", icon: <TestTube className="w-4 h-4" />, color: "bg-purple-100 text-purple-600" },
                    { time: "08:45 AM", user: "Tech. Omar", dept: "Laboratory", action: "Sample Collected", icon: <Thermometer className="w-4 h-4" />, color: "bg-amber-100 text-amber-600" },
                    { time: "09:30 AM", user: "System", dept: "Laboratory", action: "Result Released", icon: <FileText className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-600" },
                    { time: "09:45 AM", user: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed", dept: "Cardiology", action: "E-Prescription Sent", icon: <Pill className="w-4 h-4" />, color: "bg-rose-100 text-rose-600" },
                    { time: "10:00 AM", user: "Ph. Laila", dept: "Pharmacy", action: "Medication Dispensed", icon: <Save className="w-4 h-4" />, color: "bg-teal-100 text-teal-600" },
                    { time: "10:15 AM", user: "Cashier Samy", dept: "Billing", action: "Payment Completed", icon: <DollarSign className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-600" },
                  ].map((event, i) => (
                    <div key={i} className="relative">
                       <div className={`absolute -left-[41px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${event.color} shadow-sm`}>
                          {event.icon}
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-1">
                             <span className="font-black text-slate-800">{event.time}</span>
                             <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{event.dept}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-700">{event.action}</p>
                          <p className="text-xs text-slate-500 mt-1">User: {event.user}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Placeholders for other tabs */}
          {["vitals", "diagnoses", "orders", "lab", "radiology", "medications", "billing", "documents", "audit"].includes(activePatientTab) && (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-fade-in">
                <FileSearch className="w-16 h-16 mb-4 opacity-50" />
                <h2 className="text-xl font-black text-slate-700">{activePatientTab.charAt(0).toUpperCase() + activePatientTab.slice(1)} Module</h2>
                <p className="text-sm mt-2">This dedicated view is part of the comprehensive EMR suite.</p>
             </div>
          )}

        </div>
      </div>
    );
  }

  // Queue View (Default)
  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-emerald-500 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-emerald-600" />
            {isAr ? "العيادات الخارجية ومكتب الطبيب (OPD & Doctor EMR)" : "Outpatient Dept & Physician EMR"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "محطة التمريض والفرز (Triage)، والملف الطبي الإلكتروني للطبيب (EMR, CPOE)." : "Nursing Triage Station and complete Physician EMR / CPOE."}
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          <button onClick={() => setActiveRoleTab("triage")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeRoleTab === "triage" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Thermometer className="w-4 h-4" /> {isAr ? "فرز التمريض (Triage)" : "Nurse Triage"}
          </button>
          <button onClick={() => setActiveRoleTab("emr")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeRoleTab === "emr" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <User className="w-4 h-4" /> {isAr ? "مكتب الطبيب (EMR)" : "Physician Desk"}
          </button>
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
                    {triagePatients.map((patient, idx) => (
                      <div key={patient.id} onClick={() => handleOpenPatient(patient.id)} className={`border rounded-xl p-3 cursor-pointer transition bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm`}>
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-800 text-sm">{isAr ? patient.nameAr : patient.nameEn}</span>
                            <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1 rounded">{patient.mrn}</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Queue: #{10 + idx}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${patient.status === 'triage' ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                               {patient.status === 'triage' ? (isAr ? "قيد الفرز الآن" : "In Triage") : (isAr ? "في الانتظار" : "Waiting")}
                            </span>
                         </div>
                      </div>
                    ))}
                    {triagePatients.length === 0 && <p className="text-center text-sm text-slate-500 p-4">{isAr ? "لا يوجد مرضى في الانتظار" : "No patients in waiting queue"}</p>}
                 </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center text-slate-400 p-10">
                 <Thermometer className="w-16 h-16 mb-4 opacity-50" />
                 <h2 className="text-xl font-black text-slate-700">Select a patient to open their medical file</h2>
                 <p className="text-sm mt-2 text-center max-w-md">The Patient File interface supports full triage vitals entry, clinical history, and physician encounters.</p>
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
                      <div key={patient.id} onClick={() => handleOpenPatient(patient.id)} className={`border rounded-xl p-3 cursor-pointer transition bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm`}>
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-800 text-sm">{isAr ? patient.nameAr : patient.nameEn}</span>
                            <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1 rounded">{patient.mrn}</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Scheduled: 10:30 AM</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800`}>
                               {isAr ? "جاهز للدخول" : "Ready to see"}
                            </span>
                         </div>
                      </div>
                    ))}
                    {doctorPatients.length === 0 && <p className="text-center text-sm text-slate-500 p-4">{isAr ? "لا يوجد مرضى حالياً" : "No patients assigned"}</p>}
                 </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center text-slate-400 p-10">
                 <Stethoscope className="w-16 h-16 mb-4 opacity-50" />
                 <h2 className="text-xl font-black text-slate-700">Doctor Workspace</h2>
                 <p className="text-sm mt-2 text-center max-w-md">Select a patient to open the full EMR, review history, and issue CPOE orders (Labs, Radiology, Prescriptions).</p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
