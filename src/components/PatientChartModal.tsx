import React, { useState, useEffect } from "react";
import { 
  X, User, Activity, FileText, Pill, FlaskConical, Stethoscope, 
  Clock, ShieldAlert, BadgeCheck, Printer, ArrowLeft, 
  Calendar, Droplets, Thermometer, HeartPulse, FileEdit, Plus, Syringe,
  Share, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import ClinicalFormsLibrary from "./ClinicalFormsLibrary";
import { ClinicalDocumentation } from "./ClinicalDocumentation";

export function PatientChartModal({ patientId, patientName, onClose, isAr, initialTab = "summary" }: any) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showDocForm, setShowDocForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [transferStatus, setTransferStatus] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const tabs = [
    { id: "summary", ar: "الملخص", en: "Summary", icon: User },
    { id: "timeline", ar: "التسلسل الزمني", en: "Timeline", icon: Clock },
    { id: "vitals", ar: "العلامات الحيوية", en: "Vital Signs", icon: HeartPulse },
    { id: "mar", ar: "إعطاء الأدوية (MAR)", en: "MAR", icon: Pill },
    { id: "orders", ar: "أوامر الطبيب", en: "Orders", icon: Stethoscope },
    { id: "labs", ar: "التحاليل (Labs)", en: "Labs", icon: FlaskConical },
    { id: "radiology", ar: "الأشعة", en: "Radiology", icon: Activity },
    { id: "progress_notes", ar: "ملاحظات الأطباء", en: "Progress Notes", icon: FileEdit },
    { id: "nursing_notes", ar: "ملاحظات التمريض", en: "Nursing Notes", icon: FileText },
    { id: "assessments", ar: "التقييمات السريرية", en: "Assessments", icon: ShieldAlert },
    { id: "io", ar: "السوائل (I & O)", en: "Intake & Output", icon: Droplets },
    { id: "forms", ar: "النماذج الطبية", en: "Clinical Forms", icon: FileText },
    { id: "handover", ar: "تسليم الشيفت", en: "Shift Handover", icon: Share },
  ];

  const quickActions = [
    { id: "add_doc", ar: "توثيق طبيب", en: "Doc Note", icon: FileEdit, color: "bg-indigo-100 text-indigo-700" },
    { id: "add_nurse_note", ar: "ملاحظة تمريض", en: "Nurse Note", icon: FileText, color: "bg-sky-100 text-sky-700" },
    { id: "order_lab", ar: "طلب تحليل", en: "Order Lab", icon: FlaskConical, color: "bg-rose-100 text-rose-700" },
    { id: "order_rad", ar: "طلب أشعة", en: "Order Rad", icon: Activity, color: "bg-amber-100 text-amber-700" },
    { id: "prescribe", ar: "وصف دواء", en: "Prescribe", icon: Pill, color: "bg-emerald-100 text-emerald-700" },
    { id: "transfer", ar: "نقل مريض", en: "Transfer", icon: User, color: "bg-purple-100 text-purple-700" },
  ];

  const handleQuickAction = (actionId: string) => {
    if (actionId === "add_doc") {
      setShowDocForm(true);
    } else if (actionId === "transfer") {
      setShowTransferForm(true);
    } else {
      toast.info(isAr ? `جاري فتح نموذج ${actionId}...` : `Opening ${actionId} form...`);
      // Fallback for other actions, can open GenericActionModal
      window.dispatchEvent(new CustomEvent("openGenericModal", {
        detail: {
          titleAr: `إجراء سريع: ${actionId}`,
          titleEn: `Quick Action: ${actionId}`,
          type: actionId,
          entityId: patientId,
        }
      }));
    }
  };

  const handleDocSave = (docData: any) => {
    toast.success(isAr ? "تم حفظ التوثيق الطبي بنجاح وإرسال الأوامر للأقسام" : "Documentation saved and orders dispatched");
    setShowDocForm(false);
    setActiveTab("progress_notes");
  };

  if (showDocForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-slate-800 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowDocForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition">
                <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
              </button>
              <h2 className="font-bold text-lg">{isAr ? "توثيق طبيب (Doctor Documentation)" : "Doctor Documentation"}</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             <ClinicalDocumentation patientId={patientId} patientName={patientName} isAr={isAr} onSave={handleDocSave} />
          </div>
        </div>
      </div>
    );
  }

  if (showTransferForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-fade-in">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              {isAr ? "طلب نقل المريض (Transfer Request)" : "Transfer Request"}
            </h2>
            <button onClick={() => setShowTransferForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm mb-4">
              {isAr ? "هذا الطلب سيتم إرساله إلى إدارة الأسرة (Bed Management) لتخصيص السرير المناسب حسب سياسة المستشفى. لن يتم النقل فعلياً إلا بعد التخصيص والموافقة." : "This request will be sent to Bed Management for appropriate assignment per hospital policy. Actual transfer happens only after bed allocation."}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{isAr ? "مستوى الرعاية المطلوب" : "Level of Care"}</label>
                <select className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-indigo-500">
                  <option>Ward (جناح عادي)</option>
                  <option>HDU (عناية متوسطة)</option>
                  <option>ICU (عناية مركزة)</option>
                  <option>CCU (عناية قلب)</option>
                  <option>NICU (عناية حديثي الولادة)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{isAr ? "الأولوية" : "Priority"}</label>
                <select className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-indigo-500">
                  <option value="normal">{isAr ? "عادي" : "Normal"}</option>
                  <option value="high">{isAr ? "عاجل" : "Urgent"}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{isAr ? "التشخيص المبدئي وسبب النقل" : "Initial Diagnosis & Reason"}</label>
              <input type="text" className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-indigo-500" placeholder={isAr ? "أدخل التشخيص..." : "Enter diagnosis..."} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{isAr ? "اشتراطات العزل" : "Isolation Requirements"}</label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer w-full sm:w-auto">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "عزل تلامس (Contact)" : "Contact Isolation"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer w-full sm:w-auto">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "عزل رذاذ (Droplet)" : "Droplet Isolation"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer w-full sm:w-auto">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "عزل هوائي (Airborne)" : "Airborne Isolation"}</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{isAr ? "الاشتراطات السريرية (متعدد)" : "Clinical Requirements (Multiple)"}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "يحتاج أكسجين" : "Needs Oxygen"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "جهاز تنفس صناعي" : "Ventilator"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "مراقبة قلب مستمرة" : "Continuous Cardiac Monitoring"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "سرير حروق" : "Burns Bed"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "غرفة خاصة" : "Private Room"}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{isAr ? "جنس المريض (لفصل الأقسام)" : "Patient Gender (For Ward Separation)"}</label>
                <select className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-indigo-500">
                  <option>{isAr ? "ذكر" : "Male"}</option>
                  <option>{isAr ? "أنثى" : "Female"}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button onClick={() => setShowTransferForm(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                toast.success(isAr ? "تم إرسال طلب النقل إلى إدارة الأسرة بنجاح." : "Transfer request sent to Bed Management successfully.");
                setTransferStatus('pending_bed');
                setShowTransferForm(false);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition"
            >
              {isAr ? "إرسال طلب النقل" : "Submit Transfer Request"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-2 sm:p-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header - Command Center Style */}
        <div className="bg-slate-900 text-white p-4 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-indigo-500">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="hover:bg-slate-800 p-2 rounded-lg transition shrink-0 border border-slate-700">
              <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-xl">{patientName || "Unknown Patient"}</h2>
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono mt-1">
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">MRN: {patientId || "10293847"}</span>
                <span>•</span>
                <span>{isAr ? "العمر: 45 سنة" : "Age: 45"}</span>
                <span>•</span>
                <span>{isAr ? "النوع: ذكر" : "Gender: Male"}</span>
                <span>•</span>
                <span className="text-rose-400 font-bold">{isAr ? "حساسية: بنسيلين" : "Allergies: Penicillin"}</span>
              </div>
            </div>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {quickActions.map(action => (
              <button 
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-80 shadow-sm ${action.color}`}
              >
                <action.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? action.ar : action.en}</span>
              </button>
            ))}
            <button 
              onClick={() => {
                toast.success(isAr ? "جاري تحضير التقرير للطباعة..." : "Preparing report for printing...");
                setTimeout(() => {
                  setShowPrintPreview(true);
                }, 500);
              }} 
              className="bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 px-3 py-1.5 rounded-lg transition ml-auto sm:ml-2 flex items-center gap-2 text-xs font-bold shadow-sm border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? "طباعة التقرير" : "Print Record"}</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg transition bg-slate-800 hover:bg-slate-700 border border-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {transferStatus === 'pending_bed' && (
          <div 
            onClick={() => setTransferStatus('assigned')}
            className="bg-amber-100 text-amber-800 p-3 flex items-center justify-between border-b border-amber-200 text-sm font-bold shrink-0 cursor-pointer hover:bg-amber-200 transition"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-pulse" />
              {isAr ? "تم طلب نقل المريض - بانتظار تخصيص سرير من قسم (Bed Management)." : "Patient transfer requested - pending bed assignment from Bed Management."}
            </div>
            <span className="text-xs bg-amber-50 px-2 py-1 rounded opacity-50">{isAr ? "(محاكاة: اضغط هنا لمحاكاة تخصيص السرير)" : "(Simulate: Click to assign)"}</span>
          </div>
        )}

        {transferStatus === 'assigned' && (
          <div className="bg-indigo-100 text-indigo-800 p-3 flex flex-col sm:flex-row items-center justify-between border-b border-indigo-200 text-sm font-bold shrink-0 gap-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              {isAr ? "تم تخصيص السرير (ICU-02) بقسم العناية المركزة. يُرجى تجهيز المريض للنقل." : "Bed ICU-02 assigned in Intensive Care Unit. Please prepare patient."}
            </div>
            <button 
              onClick={() => {
                toast.success(isAr ? "تم تأكيد وصول المريض للقسم الجديد بنجاح، وتم إشعار الخدمات الفندقية لتنظيف السرير القديم." : "Patient arrival confirmed. Housekeeping notified to clean old bed.");
                setTransferStatus('transferred');
              }}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isAr ? "تأكيد وصول المريض (Patient Arrived)" : "Patient Arrived"}
            </button>
          </div>
        )}

        {transferStatus === 'transferred' && (
          <div className="bg-emerald-100 text-emerald-800 p-3 flex items-center justify-between border-b border-emerald-200 text-sm font-bold shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {isAr ? "تم نقل المريض بنجاح، السرير الحالي: العناية المركزة (ICU-02)." : "Patient transferred successfully. Current Bed: ICU-02."}
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Vertical Sidebar Tabs */}
          <div className="w-48 sm:w-56 bg-slate-50 border-l border-slate-200 overflow-y-auto shrink-0 hide-scrollbar">
            <div className="p-2 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-right ${
                    activeTab === tab.id 
                      ? "bg-indigo-600 text-white shadow-md" 
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-200' : 'text-slate-400'}`} />
                  {isAr ? tab.ar : tab.en}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-6">
            
            {activeTab === "summary" && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{isAr ? "حالة الدخول" : "Admission Status"}</h3>
                     <p className="text-sm font-bold text-slate-800">Inpatient - ICU (Bed 04)</p>
                     <p className="text-xs text-slate-500 mt-1">Admitted: 2026-06-25</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{isAr ? "الطبيب المعالج" : "Attending Physician"}</h3>
                     <p className="text-sm font-bold text-slate-800">Dr. Ahmed Ali (Cardiology)</p>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                     <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">{isAr ? "تحذيرات هامة" : "Critical Alerts"}</h3>
                     <p className="text-sm font-bold text-rose-700 flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Fall Risk: High</p>
                     <p className="text-sm font-bold text-rose-700 flex items-center gap-1 mt-1"><Droplets className="w-4 h-4"/> Blood Type: O+</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Diagnoses */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 font-bold text-slate-700 flex items-center justify-between">
                      {isAr ? "التشخيصات الحالية (Active Problems)" : "Active Problems"}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-slate-800">Acute Myocardial Infarction</p>
                          <p className="text-xs text-slate-500 font-mono">ICD-10: I21.9</p>
                        </div>
                        <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold">Primary</span>
                      </div>
                      <div className="flex justify-between items-start pt-3 border-t border-slate-100">
                        <div>
                          <p className="font-bold text-sm text-slate-800">Type 2 Diabetes Mellitus</p>
                          <p className="text-xs text-slate-500 font-mono">ICD-10: E11.9</p>
                        </div>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">Chronic</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Medications Summary */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 font-bold text-slate-700">
                      {isAr ? "الأدوية الحالية" : "Current Medications"}
                    </div>
                    <div className="p-0">
                      <table className="w-full text-sm text-left rtl:text-right">
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-bold text-slate-800">Aspirin 81mg</td>
                            <td className="px-4 py-3 text-slate-600 text-xs">1 tab PO Daily</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-bold text-slate-800">Lisinopril 10mg</td>
                            <td className="px-4 py-3 text-slate-600 text-xs">1 tab PO Daily</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-bold text-slate-800">Insulin Glargine</td>
                            <td className="px-4 py-3 text-slate-600 text-xs">10 units SC at bedtime</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "forms" && (
              <ClinicalFormsLibrary isAr={isAr} patientId={patientId} patientName={patientName} />
            )}

            {activeTab === "timeline" && (
               <div className="space-y-6 animate-fade-in pb-10">
                 <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-6">
                   <Clock className="w-5 h-5 text-indigo-600" />
                   {isAr ? "التسلسل الزمني للمريض" : "Patient Clinical Timeline"}
                 </h3>
                 <div className="relative border-l-2 border-indigo-100 ml-4 pl-6 space-y-8" dir={isAr ? "rtl" : "ltr"} style={{ borderLeftWidth: isAr ? 0 : '2px', borderRightWidth: isAr ? '2px' : 0, marginLeft: isAr ? 0 : '1rem', marginRight: isAr ? '1rem' : 0, paddingLeft: isAr ? 0 : '1.5rem', paddingRight: isAr ? '1.5rem' : 0 }}>
                   <div className="relative">
                     <div className={`absolute top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white ${isAr ? '-right-[1.95rem]' : '-left-[1.95rem]'}`}></div>
                     <p className="text-xs font-bold text-indigo-600 mb-1">Today, 10:45 AM</p>
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <p className="font-bold text-slate-800">{isAr ? "تم إعطاء الأدوية" : "Medication Administered"}</p>
                       <p className="text-sm text-slate-500 mt-1">{isAr ? "Aspirin 81mg بواسطة الممرضة سارة" : "Aspirin 81mg administered by Nurse Sarah"}</p>
                     </div>
                   </div>
                   <div className="relative">
                     <div className={`absolute top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white ${isAr ? '-right-[1.95rem]' : '-left-[1.95rem]'}`}></div>
                     <p className="text-xs font-bold text-emerald-600 mb-1">Today, 08:30 AM</p>
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <p className="font-bold text-slate-800">{isAr ? "نتائج المختبر متاحة" : "Lab Results Available"}</p>
                       <p className="text-sm text-slate-500 mt-1">{isAr ? "نتائج تحليل الدم الشامل ضمن النطاق الطبيعي" : "CBC results are within normal ranges"}</p>
                     </div>
                   </div>
                   <div className="relative">
                     <div className={`absolute top-0 w-4 h-4 rounded-full bg-sky-500 ring-4 ring-white ${isAr ? '-right-[1.95rem]' : '-left-[1.95rem]'}`}></div>
                     <p className="text-xs font-bold text-sky-600 mb-1">Yesterday, 11:15 PM</p>
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <p className="font-bold text-slate-800">{isAr ? "ملاحظة الطبيب" : "Physician Note Added"}</p>
                       <p className="text-sm text-slate-500 mt-1">{isAr ? "حالة المريض مستقرة، مستمر على نفس الخطة العلاجية" : "Patient stable, continuing current care plan"}</p>
                     </div>
                   </div>
                 </div>
               </div>
            )}

            {activeTab === "handover" && (
               <div className="space-y-6 animate-fade-in">
                 <div className="flex items-center justify-between">
                   <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                     <Share className="w-5 h-5 text-indigo-600" />
                     {isAr ? "تسليم الشيفت (Patient-Specific Handover)" : "Patient-Specific Handover"}
                   </h3>
                   <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition">
                     {isAr ? "+ إضافة تسليم جديد" : "+ Add Handover Note"}
                   </button>
                 </div>
                 
                 <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-4">
                   <div className="flex-1 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "المهام المعلقة" : "Pending Tasks"}</label>
                         <textarea className="w-full mt-2 text-sm border-none bg-slate-50 p-2 rounded-lg focus:ring-0" rows={3} placeholder={isAr ? "مثال: متبقي تحليل CBC الساعة 4..." : "e.g., CBC pending at 16:00"}></textarea>
                       </div>
                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "تعليمات الطبيب الهامة" : "Important Doctor Orders"}</label>
                         <textarea className="w-full mt-2 text-sm border-none bg-slate-50 p-2 rounded-lg focus:ring-0" rows={3} placeholder={isAr ? "أهم التحديثات الطبية..." : "Key medical updates..."}></textarea>
                       </div>
                     </div>
                     <div className="bg-white p-3 rounded-xl border border-slate-200">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "المخاطر والملاحظات التمريضية" : "Risks & Nursing Observations"}</label>
                         <textarea className="w-full mt-2 text-sm border-none bg-slate-50 p-2 rounded-lg focus:ring-0" rows={3} placeholder={isAr ? "ملاحظات حول التنفس، الألم، الجروح..." : "Notes on breathing, pain, wounds..."}></textarea>
                     </div>
                     <button className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition">
                       {isAr ? "حفظ التسليم إلكترونياً (E-Sign)" : "Sign & Save Handover"}
                     </button>
                   </div>
                 </div>

                 <div className="mt-8">
                   <h4 className="font-bold text-slate-700 mb-4">{isAr ? "سجل التسليمات السابقة" : "Previous Handover Log"}</h4>
                   <div className="space-y-4">
                     <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col md:flex-row gap-4">
                       <div className="w-32 shrink-0 border-r border-slate-100 pr-4">
                         <p className="font-bold text-sm text-slate-800">Shift: Morning</p>
                         <p className="text-xs text-slate-500">Today, 07:00 AM</p>
                         <p className="text-xs font-bold text-indigo-600 mt-2">By: RN. Fatima</p>
                       </div>
                       <div className="flex-1 space-y-2">
                         <div>
                           <span className="text-[10px] font-bold uppercase text-slate-400">Pending Tasks</span>
                           <p className="text-sm font-medium">Follow up on morning lab results (K+ was slightly low yesterday).</p>
                         </div>
                         <div>
                           <span className="text-[10px] font-bold uppercase text-slate-400">Risks & Observations</span>
                           <p className="text-sm font-medium">Patient complained of mild pain at incision site. Administered Paracetamol at 06:00.</p>
                         </div>
                       </div>
                       <div className="flex items-center">
                         <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                           <CheckCircle2 className="w-3 h-3" /> {isAr ? "تم الاستلام" : "Acknowledged"}
                         </span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            )}

            {/* Other tabs can have placeholders for now, the key is the structured layout and forms */}
            {!["summary", "forms", "timeline", "handover"].includes(activeTab) && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                 <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                   <FileText className="w-8 h-8 text-slate-400" />
                 </div>
                 <p className="font-bold text-lg text-slate-500 mb-2">
                   {tabs.find(t => t.id === activeTab)?.ar || activeTab}
                 </p>
                 <p className="text-sm">
                   {isAr 
                    ? "هذه الوحدة متصلة بقاعدة البيانات المركزية ويتم تحديثها بالمعلومات فور إدخالها." 
                    : "Module is connected to central DB and will render data once recorded."}
                 </p>
                 <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition">
                   {isAr ? "إضافة سجل جديد" : "Add New Record"}
                 </button>
               </div>
            )}

          </div>
        </div>
      </div>
      
      {showPrintPreview && (
        <div className="fixed inset-0 bg-slate-900/80 z-[60] flex flex-col backdrop-blur-sm">
          <div className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-lg z-10">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Printer className="w-5 h-5" />
              {isAr ? "معاينة الطباعة" : "Print Preview"} - {patientId}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition">
                {isAr ? "تأكيد الطباعة" : "Confirm Print"}
              </button>
              <button onClick={() => setShowPrintPreview(false)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-bold text-sm transition">
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100 flex justify-center">
             <div className="bg-white w-full max-w-4xl shadow-2xl p-10 min-h-full print:shadow-none print:p-0 border border-slate-200">
               <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-start">
                 <div>
                   <h1 className="text-3xl font-black text-slate-900 mb-1">
                     {isAr ? "السجل الطبي الشامل" : "Comprehensive Medical Record"}
                   </h1>
                   <p className="text-slate-500 font-bold">
                     {isAr ? "مستشفى العناية السحابية" : "CloudCare Hospital"} • {new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-lg text-slate-800">{patientName || (isAr ? "مريض عام" : "Generic Patient")}</p>
                   <p className="text-sm font-bold text-slate-500">MRN: {patientId}</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
                    <h3 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-2">{isAr ? "البيانات الديموغرافية" : "Demographics"}</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-slate-500">{isAr ? "العمر:" : "Age:"}</span> <span className="font-bold">45</span></p>
                      <p><span className="text-slate-500">{isAr ? "النوع:" : "Gender:"}</span> <span className="font-bold">{isAr ? "ذكر" : "Male"}</span></p>
                      <p><span className="text-slate-500">{isAr ? "فصيلة الدم:" : "Blood Type:"}</span> <span className="font-bold text-rose-600">O+</span></p>
                    </div>
                 </div>
                 <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
                    <h3 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-2">{isAr ? "معلومات الدخول" : "Admission Info"}</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-slate-500">{isAr ? "القسم:" : "Ward:"}</span> <span className="font-bold">ICU</span></p>
                      <p><span className="text-slate-500">{isAr ? "الطبيب المعالج:" : "Attending:"}</span> <span className="font-bold">Dr. Ahmed</span></p>
                      <p><span className="text-slate-500">{isAr ? "حالة الدخول:" : "Status:"}</span> <span className="font-bold">Critical</span></p>
                    </div>
                 </div>
               </div>

               <div className="mb-8">
                 <h3 className="font-bold text-slate-800 text-lg mb-3 border-b-2 border-slate-200 pb-2">{isAr ? "التشخيصات والمشكلات النشطة" : "Active Problems & Diagnoses"}</h3>
                 <ul className="list-disc list-inside space-y-2 text-slate-700">
                   <li>Septic Shock</li>
                   <li>Acute Kidney Injury</li>
                   <li>Hypertension</li>
                 </ul>
               </div>

               <div className="mb-8">
                 <h3 className="font-bold text-slate-800 text-lg mb-3 border-b-2 border-slate-200 pb-2">{isAr ? "أحدث العلامات الحيوية" : "Latest Vitals"}</h3>
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-100">
                       <th className="p-2 border border-slate-300 font-bold text-slate-600">BP</th>
                       <th className="p-2 border border-slate-300 font-bold text-slate-600">HR</th>
                       <th className="p-2 border border-slate-300 font-bold text-slate-600">Temp</th>
                       <th className="p-2 border border-slate-300 font-bold text-slate-600">SpO2</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <td className="p-2 border border-slate-300">90/60 mmHg</td>
                       <td className="p-2 border border-slate-300">110 bpm</td>
                       <td className="p-2 border border-slate-300">38.5 °C</td>
                       <td className="p-2 border border-slate-300">94%</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
               
               <div className="text-center text-slate-400 text-sm mt-12 pt-8 border-t border-slate-200">
                 <p>{isAr ? "نهاية التقرير - تم إنشاؤه بواسطة نظام CloudCare" : "End of Report - Generated by CloudCare System"}</p>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
