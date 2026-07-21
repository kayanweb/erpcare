import React, { useState } from "react";
import { 
  UserPlus, Activity, Stethoscope, TestTube, Syringe, 
  CheckCircle2, ArrowRight, FileText, Bell, Send, ArrowLeft, Printer, ShieldAlert, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useHIS } from "../context/HISContext";
import { saveHISNotification } from "../lib/firestoreService";

interface Props {
  language: "en" | "ar";
}

export default function PatientJourneySimulator({ language }: Props) {
  const isAr = language === "ar";
  const { addPatient, updatePatientStatus, updatePatient, addPrescription, addInvoice, updatePrescriptionStatus } = useHIS();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [patientId] = useState(`MRN-${Math.floor(100000 + Math.random() * 900000)}`);
  
  // Simulated Shared State
  const [state, setState] = useState({
    registration: { done: false, data: null as any },
    triage: { done: false, acuity: "", vitals: null as any },
    doctor: { done: false, notes: "", ordersSent: false },
    lab: { acknowledged: false, resultsEntered: false, data: null as any },
    nursing: { done: false, notes: "" }
  });

  const steps = [
    { id: 1, key: "registration", icon: UserPlus, labelAr: "الاستقبال والتسجيل", labelEn: "Registration", roleAr: "موظف الاستقبال", roleEn: "Ward Clerk" },
    { id: 2, key: "triage", icon: Activity, labelAr: "الفرز والعلامات الحيوية", labelEn: "Triage & Vitals", roleAr: "ممرض الفرز", roleEn: "Triage Nurse" },
    { id: 3, key: "doctor", icon: Stethoscope, labelAr: "الكشف والطلبات (CPOE)", labelEn: "Physician & Orders", roleAr: "طبيب الطوارئ", roleEn: "ER Doctor" },
    { id: 4, key: "lab", icon: TestTube, labelAr: "المعمل والنتائج", labelEn: "Laboratory", roleAr: "فني المعمل", roleEn: "Lab Technician" },
    { id: 5, key: "nursing", icon: Syringe, labelAr: "تنفيذ التمريض والشيتات", labelEn: "Nursing Execution", roleAr: "ممرض القسم", roleEn: "Ward Nurse" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setState({
      registration: { done: false, data: null },
      triage: { done: false, acuity: "", vitals: null },
      doctor: { done: false, notes: "", ordersSent: false },
      lab: { acknowledged: false, resultsEntered: false, data: null },
      nursing: { done: false, notes: "" }
    });
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Patient journey reset", titleAr: "تم إعادة تعيين دورة المريض", type: "form" } }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-indigo-300 text-sm font-medium mb-4">
            <Activity size={16} />
            <span>{isAr ? "محاكي دورة المريض (End-to-End Workflow)" : "Patient Journey Simulator"}</span>
          </div>
          <h1 className="text-3xl font-black mb-2">
            {isAr ? "تتبع رحلة المريض المتكاملة" : "Integrated Patient Flow"}
          </h1>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            {isAr 
              ? "يعرض هذا المحاكي كيف تنتقل البيانات بسلاسة بين الأقسام المختلفة (استقبال، تمريض، طبيب، معمل) مع تحديث الملف الطبي الموحد (EMR) لحظياً."
              : "This simulator demonstrates how data flows seamlessly between departments while updating the centralized EMR in real-time."}
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center relative z-10 backdrop-blur-sm min-w-[200px]">
          <div className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Patient MRN</div>
          <div className="text-2xl font-mono font-bold text-white">{patientId}</div>
          <button onClick={handleReset} className="mt-3 text-xs bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg transition-colors w-full">
            {isAr ? "مريض جديد" : "New Patient"}
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[800px]">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex-1 flex items-center relative">
                <div 
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex flex-col items-center gap-2 relative z-10 cursor-pointer group w-full`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" :
                    isCompleted ? "bg-emerald-500 text-white" :
                    "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  }`}>
                    {isCompleted ? <CheckCircle2 size={24} /> : <step.icon size={24} />}
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-bold mt-1 ${isActive ? "text-indigo-600" : isCompleted ? "text-emerald-600" : "text-slate-500"}`}>
                      {isAr ? step.labelAr : step.labelEn}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 font-medium">
                      {isAr ? step.roleAr : step.roleEn}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute top-7 left-[50%] right-[-50%] h-1 rounded-full -z-0 transition-colors duration-500 ${
                    isCompleted ? "bg-emerald-500" : "bg-slate-100"
                  }`} style={{ width: "100%" }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Panels */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Registration */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><UserPlus /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{isAr ? "تسجيل مريض طوارئ" : "ER Patient Registration"}</h2>
                  <p className="text-sm text-slate-500">{isAr ? "موظف الاستقبال يقوم بإنشاء أو تحديث ملف المريض" : "Ward clerk creates or updates patient file"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الاسم الرباعي" : "Full Name"}</label>
                    <input type="text" defaultValue="أحمد محمد محمود" disabled={state.registration.done} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "رقم الهوية" : "National ID"}</label>
                      <input type="text" defaultValue="29001011234567" disabled={state.registration.done} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "تاريخ الميلاد" : "DOB"}</label>
                      <input type="date" defaultValue="1990-01-01" disabled={state.registration.done} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "سبب الزيارة (Chief Complaint)" : "Chief Complaint"}</label>
                    <input type="text" defaultValue="ألم شديد في الصدر مع ضيق تنفس" disabled={state.registration.done} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50" />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-400">
                    <Printer size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700">{isAr ? "طباعة الأساور والملصقات" : "Print Wristbands & Labels"}</h3>
                    <p className="text-xs text-slate-500 mt-1">{isAr ? "تجهيز الباركود الخاص بالمريض" : "Generate patient barcode"}</p>
                  </div>
                  
                  {!state.registration.done ? (
                    <button 
                      onClick={() => {
                        // Register patient in Firestore
                        addPatient({
                          id: patientId,
                          mrn: patientId,
                          nameEn: "Ahmad Mohamed Mahmoud",
                          nameAr: "أحمد محمد محمود",
                          age: 45,
                          gender: "male",
                          phone: "+966 50 123 4567",
                          status: "triage",
                          insurance: "Cash"
                        });
                        
                        // Register reception fee invoice
                        addInvoice({
                          id: `inv-reg-${patientId}`,
                          patientId: patientId,
                          amount: 50,
                          status: "unpaid",
                          date: new Date().toISOString()
                        });

                        // Notify triage
                        saveHISNotification({
                          id: `notif-reg-${Date.now()}`,
                          titleAr: "مريض جديد في قائمة الانتظار",
                          titleEn: "New Patient Registered",
                          messageAr: `المريض أحمد محمد محمود تم تسجيله برقم ${patientId} ومحول لقسم الفرز.`,
                          messageEn: `Patient Ahmad Mohamed Mahmoud registered with MRN ${patientId} and routed to Triage.`,
                          type: "info",
                          timestamp: new Date().toISOString(),
                          patientId: patientId,
                          patientName: isAr ? "أحمد محمد محمود" : "Ahmad Mohamed Mahmoud",
                          details: {
                            mrn: { ar: patientId, en: patientId, keyAr: "الرقم الطبي", keyEn: "MRN" },
                            visitType: { ar: "طوارئ", en: "Emergency", keyAr: "نوع الزيارة", keyEn: "Visit Type" },
                            priority: { ar: "قيد الفرز", en: "Pending Triage", keyAr: "الأولوية", keyEn: "Priority" },
                            chiefComplaint: { ar: "ألم بالصدر", en: "Chest Pain", keyAr: "الشكوى الرئيسية", keyEn: "Chief Complaint" }
                          }
                        }).catch(e => console.error(e));

                        setState(s => ({ ...s, registration: { done: true, data: {} } }));
                        window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Registered and sent to Triage", titleAr: "تم التسجيل وتم إرسال المريض للفرز", type: "form" } }));
                        setTimeout(handleNext, 1000);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      {isAr ? "تأكيد التسجيل وإرسال للفرز" : "Confirm & Send to Triage"}
                    </button>
                  ) : (
                    <div className="w-full bg-emerald-50 text-emerald-600 font-bold py-3 rounded-xl border border-emerald-200 flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} />
                      <span>{isAr ? "تم التسجيل بنجاح" : "Registration Complete"}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Triage */}
          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Activity /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{isAr ? "فرز الطوارئ (Triage)" : "ER Triage"}</h2>
                  <p className="text-sm text-slate-500">{isAr ? "ممرض الفرز يقوم بأخذ العلامات الحيوية وتحديد الأولوية" : "Triage nurse takes vitals and assigns acuity"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Blood Pressure</label>
                    <input type="text" defaultValue="150/95" disabled={state.triage.done} className="w-full border border-slate-200 rounded-lg p-2.5 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Heart Rate</label>
                    <input type="number" defaultValue={110} disabled={state.triage.done} className="w-full border border-slate-200 rounded-lg p-2.5 font-mono text-red-600 font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Temperature (°C)</label>
                    <input type="number" defaultValue={37.2} disabled={state.triage.done} className="w-full border border-slate-200 rounded-lg p-2.5 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">SpO2 (%)</label>
                    <input type="number" defaultValue={94} disabled={state.triage.done} className="w-full border border-slate-200 rounded-lg p-2.5 font-mono" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "ملاحظات الفرز" : "Triage Notes"}</label>
                    <textarea disabled={state.triage.done} defaultValue="المريض يعاني من تعرق وألم ضاغط في منتصف الصدر يمتد للكتف الأيسر." className="w-full border border-slate-200 rounded-lg p-2.5 h-20" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-700 mb-3">{isAr ? "مستوى الخطورة (Acuity Level)" : "Acuity Level"}</h3>
                  {['Resuscitation (Level 1)', 'Emergent (Level 2)', 'Urgent (Level 3)', 'Less Urgent (Level 4)'].map((level, i) => (
                    <button 
                      key={level}
                      disabled={state.triage.done}
                      onClick={() => setState(s => ({ ...s, triage: { ...s.triage, acuity: level } }))}
                      className={`w-full text-left px-4 py-3 rounded-xl border font-bold text-sm transition-all ${
                        state.triage.acuity === level 
                          ? i === 0 ? "bg-red-600 text-white border-red-600" : i === 1 ? "bg-orange-500 text-white border-orange-500" : "bg-amber-400 text-white border-amber-400"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                  
                  {!state.triage.done && state.triage.acuity && (
                    <button 
                      onClick={() => {
                        // Update patient status in Firestore
                        updatePatientStatus(patientId, "doctor");

                        // Add Triage Invoice
                        addInvoice({
                          id: `inv-triage-${patientId}`,
                          patientId: patientId,
                          amount: 100,
                          status: "unpaid",
                          date: new Date().toISOString()
                        });

                        // Notify ER Doctor
                        saveHISNotification({
                          id: `notif-triage-${Date.now()}`,
                          titleAr: "حالة عاجلة محولة للطبيب",
                          titleEn: "Emergent Patient Triaged (Level 2)",
                          messageAr: `المريض أحمد محمد محمود تم فرزه بمستوى خطورة عالي (Level 2 - Emergent) ومحول للطبيب فوراً.`,
                          messageEn: `Patient Ahmad Mohamed Mahmoud triaged as Level 2 (Emergent) and assigned to ER Physician immediately.`,
                          type: "warning",
                          timestamp: new Date().toISOString(),
                          patientId: patientId,
                          patientName: isAr ? "أحمد محمد محمود" : "Ahmad Mohamed Mahmoud",
                          details: {
                            mrn: { ar: patientId, en: patientId, keyAr: "الرقم الطبي", keyEn: "MRN" },
                            vitals: { ar: "ضغط 160/95، نبض 110", en: "BP 160/95, HR 110", keyAr: "العلامات الحيوية", keyEn: "Vitals" },
                            priority: { ar: "المستوى الثاني", en: "Level 2 - Emergent", keyAr: "الفرز", keyEn: "Triage" }
                          }
                        }).catch(e => console.error(e));

                        setState(s => ({ ...s, triage: { ...s.triage, done: true } }));
                        window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Triage saved, physician notified", titleAr: "تم حفظ الفرز وإشعار الطبيب", type: "form" } }));
                        setTimeout(handleNext, 1000);
                      }}
                      className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Bell size={18} />
                      <span>{isAr ? "حفظ وإشعار الطبيب" : "Save & Notify Doctor"}</span>
                    </button>
                  )}
                  {state.triage.done && (
                    <div className="w-full mt-4 bg-emerald-50 text-emerald-600 font-bold py-3 rounded-xl border border-emerald-200 flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} />
                      <span>{isAr ? "اكتمل الفرز" : "Triage Complete"}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Doctor */}
          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Stethoscope /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{isAr ? "تقييم الطبيب وإدخال الطلبات (CPOE)" : "Physician Assessment & CPOE"}</h2>
                  <p className="text-sm text-slate-500">{isAr ? "الطبيب يراجع الملف، يكتب الملاحظات ويطلب التحاليل" : "Doctor reviews file, writes notes and orders labs"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                    <ShieldAlert className="shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm mb-1">{isAr ? "تنبيه من الفرز: مستوى 2 (عاجل جداً)" : "Triage Alert: Level 2 (Emergent)"}</div>
                      <div className="text-xs">HR: 110 | BP: 150/95 | SpO2: 94%</div>
                      <div className="text-xs font-semibold mt-1">Complaint: Chest pain radiating to left arm.</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? "الملاحظات السريرية (Clinical Notes)" : "Clinical Notes"}</label>
                    <textarea 
                      disabled={state.doctor.done}
                      defaultValue="Patient presents with acute chest pain. Suspecting ACS. Needs immediate ECG, Cardiac Enzymes, and Chest X-Ray."
                      className="w-full border border-slate-200 rounded-xl p-4 min-h-[120px] bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Send size={18} className="text-indigo-600" />
                    {isAr ? "إدخال الطلبات (CPOE)" : "Order Entry (CPOE)"}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-indigo-600 rounded" />
                        <span className="font-bold text-sm">ECG 12-Lead</span>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">STAT</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm ring-1 ring-indigo-500">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-indigo-600 rounded" />
                        <span className="font-bold text-sm">Troponin I (Cardiac Enzyme)</span>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">STAT</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-indigo-600 rounded" />
                        <span className="font-bold text-sm">Chest X-Ray (Portable)</span>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">STAT</span>
                    </div>
                  </div>

                  {!state.doctor.done ? (
                    <button 
                      onClick={() => {
                        // Create prescriptions in Firestore
                        addPrescription({
                          id: `rx-aspirin-${patientId}`,
                          patientId: patientId,
                          medication: "Aspirin 300mg PO",
                          dose: "STAT",
                          qty: 1,
                          status: "pending",
                          date: new Date().toISOString()
                        });

                        addPrescription({
                          id: `rx-nitro-${patientId}`,
                          patientId: patientId,
                          medication: "Nitroglycerin 0.4mg SL",
                          dose: "STAT",
                          qty: 1,
                          status: "pending",
                          date: new Date().toISOString()
                        });

                        // Add Orders Invoices
                        addInvoice({
                          id: `inv-ecg-${patientId}`,
                          patientId: patientId,
                          amount: 150,
                          status: "unpaid",
                          date: new Date().toISOString()
                        });

                        addInvoice({
                          id: `inv-enz-${patientId}`,
                          patientId: patientId,
                          amount: 250,
                          status: "unpaid",
                          date: new Date().toISOString()
                        });

                        addInvoice({
                          id: `inv-rad-${patientId}`,
                          patientId: patientId,
                          amount: 200,
                          status: "unpaid",
                          date: new Date().toISOString()
                        });

                        // Notify Lab and Pharmacy
                        saveHISNotification({
                          id: `notif-doc-${Date.now()}`,
                          titleAr: "طلبات STAT عاجلة جديدة",
                          titleEn: "New STAT Orders Signed",
                          messageAr: `الطبيب وقع بروتوكول الذبحة الصدرية (Troponin, ECG, Aspirin, NTG) للمريض أحمد محمد محمود.`,
                          messageEn: `ER Physician signed ACS STAT orders (Troponin, ECG, Aspirin, NTG) for patient Ahmad Mohamed Mahmoud.`,
                          type: "info",
                          timestamp: new Date().toISOString(),
                          patientId: patientId,
                          patientName: isAr ? "أحمد محمد محمود" : "Ahmad Mohamed Mahmoud",
                          details: {
                            mrn: { ar: patientId, en: patientId, keyAr: "الرقم الطبي", keyEn: "MRN" },
                            orders: { ar: "Troponin, ECG, Aspirin, NTG", en: "Troponin, ECG, Aspirin, NTG", keyAr: "الطلبات", keyEn: "Orders" },
                            priority: { ar: "عاجل جداً", en: "STAT", keyAr: "الأولوية", keyEn: "Priority" }
                          }
                        }).catch(e => console.error(e));

                        setState(s => ({ ...s, doctor: { ...s.doctor, done: true, ordersSent: true } }));
                        window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Orders routed to Lab & Rad", titleAr: "تم إرسال الطلبات للأقسام المعنية", type: "form" } }));
                        setTimeout(handleNext, 1500);
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      {isAr ? "توقيع وإرسال الطلبات للمعمل والصيدلية" : "Sign & Send Orders"}
                    </button>
                  ) : (
                    <div className="w-full bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl border border-indigo-200 flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} />
                      <span>{isAr ? "تم إرسال الطلبات بنجاح" : "Orders Sent Successfully"}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Laboratory */}
          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><TestTube /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{isAr ? "استلام المعمل والنتائج (LIS)" : "Laboratory Information System"}</h2>
                  <p className="text-sm text-slate-500">{isAr ? "المعمل يستلم الطلب والعينة، ثم يدخل النتائج لتظهر للطبيب فوراً" : "Lab receives order, processes sample, and inputs results"}</p>
                </div>
              </div>

              <div className="bg-slate-800 text-white rounded-2xl p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-20 blur-3xl rounded-full"></div>
                
                <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                  <div>
                    <div className="text-emerald-400 font-bold text-sm mb-1">INCOMING STAT ORDER</div>
                    <h3 className="text-xl font-bold">Troponin I</h3>
                    <div className="text-slate-400 text-xs">Patient: {patientId} | Loc: ER Bed 4</div>
                  </div>
                  
                  {!state.lab.acknowledged ? (
                    <button 
                      onClick={() => {
                        setState(s => ({ ...s, lab: { ...s.lab, acknowledged: true } }));
                        window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Sample Acknowledged", titleAr: "تم تأكيد استلام العينة", type: "form" } }));
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                      {isAr ? "تأكيد استلام العينة (Acknowledge)" : "Acknowledge Sample"}
                    </button>
                  ) : (
                    <div className="text-emerald-400 flex items-center gap-2 font-bold text-sm bg-emerald-900/50 px-4 py-2 rounded-lg">
                      <CheckCircle2 size={16} /> Sample Received
                    </div>
                  )}
                </div>

                <div className={`transition-all duration-500 ${state.lab.acknowledged ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                  <h4 className="font-bold text-slate-300 mb-3">{isAr ? "إدخال النتائج (Result Entry)" : "Result Entry"}</h4>
                  <div className="flex items-end gap-4">
                    <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-700">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Parameter</span>
                        <span className="text-slate-400">Ref Range</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold w-1/3">Troponin I</span>
                        <input 
                          type="number" 
                          defaultValue="1.45"
                          disabled={state.lab.resultsEntered}
                          className="w-1/3 bg-slate-800 border border-slate-600 rounded p-2 text-red-400 font-bold text-center outline-none focus:border-emerald-500"
                        />
                        <span className="text-xs text-slate-500 w-1/3 text-right">&lt; 0.04 ng/mL</span>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-red-400 text-xs font-bold bg-red-900/20 p-2 rounded">
                        <AlertTriangle size={14} /> CRITICAL HIGH VALUE
                      </div>
                    </div>
                    
                    {!state.lab.resultsEntered ? (
                      <button 
                        onClick={() => {
                          // Save critical laboratory result notification to Firestore
                          saveHISNotification({
                            id: `notif-lab-${Date.now()}`,
                            titleAr: "قيمة حرجة للمريض أحمد محمد محمود",
                            titleEn: "CRITICAL HIGH: Troponin I",
                            messageAr: `تحذير: قيمة التروبونين مرتفعة جداً (1.45 ng/mL) للمريض أحمد محمود. احتمال ذبحة صدرية حادة.`,
                            messageEn: `Warning: Troponin I is critically high (1.45 ng/mL) for patient Ahmad Mahmoud. Immediate ACS protocol recommended.`,
                            type: "error",
                            timestamp: new Date().toISOString(),
                            patientId: patientId,
                            patientName: isAr ? "أحمد محمد محمود" : "Ahmad Mohamed Mahmoud",
                            details: {
                              mrn: { ar: patientId, en: patientId, keyAr: "الرقم الطبي", keyEn: "MRN" },
                              test: { ar: "تروبونين آي", en: "Troponin I", keyAr: "التحليل", keyEn: "Test" },
                              result: { ar: "1.45 ng/mL", en: "1.45 ng/mL", keyAr: "النتيجة", keyEn: "Result" },
                              status: { ar: "مرتفع جداً", en: "CRITICAL HIGH", keyAr: "الحالة", keyEn: "Status" }
                            }
                          }).catch(e => console.error(e));

                          setState(s => ({ ...s, lab: { ...s.lab, resultsEntered: true } }));
                          window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Results uploaded, doctor notified!", titleAr: "تم رفع النتائج وإشعار الطبيب فوراً", type: "form" } }));
                          setTimeout(handleNext, 1500);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-xl font-bold h-[116px] flex flex-col items-center justify-center gap-2 transition-colors"
                      >
                        <Send size={20} />
                        <span>{isAr ? "اعتماد وإرسال" : "Verify & Release"}</span>
                      </button>
                    ) : (
                      <div className="bg-emerald-900/40 text-emerald-400 border border-emerald-800 px-6 py-4 rounded-xl font-bold h-[116px] flex flex-col items-center justify-center gap-2">
                        <CheckCircle2 size={24} />
                        <span>Released</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Nursing */}
          {currentStep === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center"><Syringe /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{isAr ? "تنفيذ التمريض والشيتات" : "Nursing Flowsheets & Execution"}</h2>
                  <p className="text-sm text-slate-500">{isAr ? "الممرضة تستلم الأوردرات وتوثق الإجراءات (Medications, I/O, Assessments)" : "Nurse receives orders and documents administration and assessments"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Bell className="text-red-500" size={18} />
                      {isAr ? "تحديثات للمريض" : "Patient Updates"}
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded-lg border-l-4 border-l-red-500 shadow-sm text-sm">
                        <span className="font-bold text-red-600">CRITICAL LAB RESULT:</span> Troponin I is 1.45 ng/mL. Doctor notified.
                      </div>
                      <div className="bg-white p-3 rounded-lg border-l-4 border-l-indigo-500 shadow-sm text-sm">
                        <span className="font-bold text-indigo-600">NEW ORDER:</span> Administer Aspirin 300mg PO STAT.
                      </div>
                      <div className="bg-white p-3 rounded-lg border-l-4 border-l-indigo-500 shadow-sm text-sm">
                        <span className="font-bold text-indigo-600">NEW ORDER:</span> Administer Nitroglycerin 0.4mg SL STAT.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">{isAr ? "توثيق التمريض (Nursing Documentation)" : "Nursing Documentation"}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="font-bold text-sm">Aspirin 300mg PO</div>
                        <div className="text-xs text-slate-500">Ordered by Dr. Ahmed at 10:45 AM</div>
                      </div>
                      <button 
                        disabled={state.nursing.done}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${state.nursing.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {state.nursing.done ? "Given" : "Mark Given"}
                      </button>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="font-bold text-sm">Nitroglycerin 0.4mg SL</div>
                        <div className="text-xs text-slate-500">Ordered by Dr. Ahmed at 10:45 AM</div>
                      </div>
                      <button 
                        disabled={state.nursing.done}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${state.nursing.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {state.nursing.done ? "Given" : "Mark Given"}
                      </button>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "ملاحظات التمريض (Nursing Notes)" : "Nursing Notes"}</label>
                      <textarea 
                        disabled={state.nursing.done}
                        defaultValue="Medications administered as ordered. Patient states chest pain decreased from 8/10 to 4/10. Continuing to monitor vitals every 15 mins."
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm h-20 bg-slate-50"
                      />
                    </div>

                    {!state.nursing.done ? (
                      <button 
                        onClick={() => {
                          // Update prescription statuses to dispensed in Firestore
                          updatePrescriptionStatus(`rx-aspirin-${patientId}`, "dispensed");
                          updatePrescriptionStatus(`rx-nitro-${patientId}`, "dispensed");

                          // Add nursing service invoice line
                          addInvoice({
                            id: `inv-nurse-${patientId}`,
                            patientId: patientId,
                            amount: 75,
                            status: "unpaid",
                            date: new Date().toISOString()
                          });

                          // Update patient status to ward (admitted to inpatient bed)
                          updatePatientStatus(patientId, "ward");

                          // Save nursing execution and admit notification to Firestore
                          saveHISNotification({
                            id: `notif-nurse-${Date.now()}`,
                            titleAr: "إعطاء الأدوية ونقل المريض لجناح التنويم",
                            titleEn: "STAT Meds Given & Ward Transfer Requested",
                            messageAr: `تم إعطاء الأسبرين والنيتروجليسرين للمريض أحمد محمد محمود. حالته مستقرة الآن وتم نقله لجناح التنويم الداخلي.`,
                            messageEn: `STAT Aspirin and Nitroglycerin successfully administered. Patient Ahmad Mohamed Mahmoud stabilized and transferred to Inpatient Ward.`,
                            type: "success",
                            timestamp: new Date().toISOString(),
                            patientId: patientId,
                            patientName: isAr ? "أحمد محمد محمود" : "Ahmad Mohamed Mahmoud",
                            details: {
                              mrn: { ar: patientId, en: patientId, keyAr: "الرقم الطبي", keyEn: "MRN" },
                              meds: { ar: "Aspirin, Nitroglycerin", en: "Aspirin, Nitroglycerin", keyAr: "الأدوية المعطاة", keyEn: "Administered Meds" },
                              status: { ar: "مستقر - محول للتنويم", en: "Stable - Admitted to Ward", keyAr: "الحالة", keyEn: "Status" }
                            }
                          }).catch(e => console.error(e));

                          setState(s => ({ ...s, nursing: { ...s.nursing, done: true } }));
                          window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Nursing documentation saved to EMR", titleAr: "تم حفظ توثيق التمريض في الملف", type: "form" } }));
                        }}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 rounded-xl transition-all"
                      >
                        {isAr ? "توقيع وحفظ الشيت" : "Sign & Save Flowsheet"}
                      </button>
                    ) : (
                      <div className="w-full bg-emerald-50 text-emerald-700 font-bold py-2.5 rounded-xl border border-emerald-200 flex items-center justify-center gap-2">
                        <CheckCircle2 size={18} />
                        <span>{isAr ? "مكتمل وموثق في EMR" : "Completed & Documented in EMR"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {state.nursing.done && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-indigo-600">
                      <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">{isAr ? "دورة المريض اكتملت بنجاح" : "Patient Workflow Completed"}</h3>
                    <p className="text-slate-600 max-w-lg mx-auto mb-6">
                      {isAr 
                        ? "لقد رأيت كيف يتم ربط جميع الأقسام (الاستقبال، التمريض، الأطباء، المعمل) من خلال ملف طبي واحد يحدث بشكل فوري."
                        : "You've seen how all departments connect through a single, real-time updated Electronic Medical Record."}
                    </p>
                    <button onClick={handleReset} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                      {isAr ? "بدء محاكاة مريض جديد" : "Start New Patient Simulation"}
                    </button>
                 </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
