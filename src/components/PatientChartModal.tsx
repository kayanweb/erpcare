import React, { useState, useEffect } from "react";
import { 
  X, User, Activity, FileText, Pill, FlaskConical, Stethoscope, 
  Clock, ShieldAlert, BadgeCheck, Printer, ArrowLeft, 
  Calendar, Droplets, Thermometer, HeartPulse, FileEdit, Plus, Syringe,
  Share, CheckCircle2, QrCode
} from "lucide-react";
import { toast } from "sonner";
import ClinicalFormsLibrary from "./ClinicalFormsLibrary";
import { ClinicalDocumentation } from "./ClinicalDocumentation";
import { useHIS } from "../context/HISContext";

export function PatientChartModal({ patientId, patientName, onClose, isAr, initialTab = "summary" }: any) {
  const { patients, updatePatient } = useHIS();
  const currentPatient = patients.find(p => p.id === patientId) || { id: patientId, nameEn: patientName, nameAr: patientName };

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showDocForm, setShowDocForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [transferStatus, setTransferStatus] = useState<string | null>(null);

  // States for dedicated quick action overlays
  const [showNurseNoteForm, setShowNurseNoteForm] = useState(false);
  const [showOrderLabForm, setShowOrderLabForm] = useState(false);
  const [showOrderRadForm, setShowOrderRadForm] = useState(false);
  const [showPrescribeForm, setShowPrescribeForm] = useState(false);

  // Dedicated inputs for quick action forms
  const [quickNurseText, setQuickNurseText] = useState("");
  const [quickLabName, setQuickLabName] = useState("CBC (صورة دم كاملة)");
  const [quickRadName, setQuickRadName] = useState("Chest X-Ray Portable (أشعة صدر متنقلة)");
  const [quickDrugName, setQuickDrugName] = useState("");
  const [quickDrugDose, setQuickDrugDose] = useState("500mg PO BID");

  // States for interactive tabs
  const [noteText, setNoteText] = useState("");
  const [nurseNoteText, setNurseNoteText] = useState("");
  
  // Radiology (PACS)
  const [selectedStudyIdx, setSelectedStudyIdx] = useState(0);
  const [radSlice, setRadSlice] = useState(12);
  const [radContrast, setRadContrast] = useState(1.0);
  const [radZoom, setRadZoom] = useState(100);

  // Assessments
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  // Intake & Output
  const [ioIntakeAmt, setIoIntakeAmt] = useState("");
  const [ioOutputAmt, setIoOutputAmt] = useState("");

  const currentIntakes = currentPatient.fluidIntake || [
    { id: "in1", type: isAr ? "فموي (ماء)" : "Oral (Water)", amount: 250, date: "08:00" },
    { id: "in2", type: isAr ? "وريدي (محلول ملحي)" : "IV Fluids (Normal Saline)", amount: 500, date: "10:30" }
  ];
  const currentOutputs = currentPatient.fluidOutput || [
    { id: "out1", type: isAr ? "بول" : "Urine", amount: 350, date: "09:00" }
  ];

  const ioIntakeTotal = currentIntakes.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
  const ioOutputTotal = currentOutputs.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);

  const handleSaveProgressNote = () => {
    if (!noteText.trim()) return;
    const notes = currentPatient.progressNotes || [
      { id: "pn1", author: "Dr. Ahmed Ali (Cardiology)", text: isAr ? "حالة المريض مستقرة بعد العملية. العلامات الحيوية جيدة." : "Patient status is stable post-op. Vital signs are within normal limits.", date: "2026-06-29 09:00" },
      { id: "pn2", author: "Dr. Samir Hassan (Consultant)", text: isAr ? "يجب مراقبة مستويات السكر في الدم وضبط جرعة الأنسولين." : "Monitor blood glucose levels and adjust Insulin dosage accordingly.", date: "2026-06-29 14:30" }
    ];
    const newNote = {
      id: "pn-" + Date.now(),
      author: isAr ? "د. أحمد علي (أمراض القلب)" : "Dr. Ahmed Ali (Cardiology)",
      text: noteText,
      date: new Date().toLocaleString()
    };
    updatePatient(patientId, { progressNotes: [...notes, newNote] });
    setNoteText("");
    toast.success(isAr ? "تم تسجيل وتوقيع ملاحظة التطور بنجاح في ملف المريض" : "Progress note logged and E-signed successfully!");
  };

  const handleSaveNurseNote = () => {
    if (!nurseNoteText.trim()) return;
    const notes = currentPatient.nursingNotes || [
      { id: "nn1", author: "RN. Sarah Jones", text: isAr ? "تم إعطاء الأدوية الوريدية المقررة في موعدها. المريض لا يعاني من ألم." : "Prescribed IV medications administered on time. Patient reports no pain.", date: "2026-06-30 08:00" },
      { id: "nn2", author: "RN. Fatima Saeed", text: isAr ? "تم تغيير ضماد الجرح الجراحي. الجرح نظيف ولا توجد علامات التهاب." : "Surgical wound dressing changed. Wound is clean, no signs of infection.", date: "2026-06-30 11:30" }
    ];
    const newNote = {
      id: "nn-" + Date.now(),
      author: isAr ? "ممرض. فاطمة سعيد" : "RN. Fatima Saeed",
      text: nurseNoteText,
      date: new Date().toLocaleString()
    };
    updatePatient(patientId, { nursingNotes: [...notes, newNote] });
    setNurseNoteText("");
    toast.success(isAr ? "تم تسجيل الملاحظة التمريضية وتحديث ملف العناية بالسرير" : "Nursing observation note logged successfully!");
  };

  const handleSaveAssessment = (type: string, score: number) => {
    const assessments = currentPatient.assessments || {};
    const updated = {
      ...assessments,
      [type]: {
        score,
        date: new Date().toLocaleString()
      }
    };
    updatePatient(patientId, { assessments: updated });
    toast.success(isAr ? `تم حفظ تقييم ${type.toUpperCase()} بنجاح` : `${type.toUpperCase()} score of ${score} logged to EHR!`);
  };

  const handleAddIntake = () => {
    if (!ioIntakeAmt || isNaN(Number(ioIntakeAmt))) return;
    const item = {
      id: "in-" + Date.now(),
      type: isAr ? "فموي (ماء/عصير)" : "Oral Fluids",
      amount: Number(ioIntakeAmt),
      date: new Date().toLocaleTimeString().slice(0, 5)
    };
    updatePatient(patientId, { fluidIntake: [...currentIntakes, item] });
    setIoIntakeAmt("");
    toast.success(isAr ? "تم تسجيل الوارد المائي للمريض" : "Fluid intake logged successfully");
  };

  const handleAddOutput = () => {
    if (!ioOutputAmt || isNaN(Number(ioOutputAmt))) return;
    const item = {
      id: "out-" + Date.now(),
      type: isAr ? "بول / تصريف" : "Urine Output",
      amount: Number(ioOutputAmt),
      date: new Date().toLocaleTimeString().slice(0, 5)
    };
    updatePatient(patientId, { fluidOutput: [...currentOutputs, item] });
    setIoOutputAmt("");
    toast.success(isAr ? "تم تسجيل الصادر المائي للمريض" : "Fluid output logged successfully");
  };

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
    } else if (actionId === "add_nurse_note") {
      setShowNurseNoteForm(true);
    } else if (actionId === "order_lab") {
      setShowOrderLabForm(true);
    } else if (actionId === "order_rad") {
      setShowOrderRadForm(true);
    } else if (actionId === "prescribe") {
      setShowPrescribeForm(true);
    } else {
      toast.info(isAr ? `جاري فتح نموذج ${actionId}...` : `Opening ${actionId} form...`);
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

  if (showNurseNoteForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-400" />
              {isAr ? "إضافة ملاحظة تمريض سريعة" : "Quick Nurse Note"}
            </h2>
            <button onClick={() => setShowNurseNoteForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "نص الملاحظة التمريضية" : "Nurse Note Text"}</label>
              <textarea 
                rows={4}
                value={quickNurseText}
                onChange={(e) => setQuickNurseText(e.target.value)}
                className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 p-2 focus:border-sky-500 outline-none font-semibold text-slate-800 font-sans"
                placeholder={isAr ? "اكتب تفاصيل الملاحظة السريرية للتمريض هنا..." : "Write bedside clinical notes..."}
              />
            </div>
            <div className="text-xs text-slate-400 font-mono font-bold">
              Patient: {currentPatient.nameEn} ({currentPatient.mrn})
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button onClick={() => setShowNurseNoteForm(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                if (!quickNurseText.trim()) return;
                const notes = currentPatient.nursingNotes || [];
                const newNote = {
                  id: "nn-" + Date.now(),
                  author: isAr ? "ممرض. فاطمة سعيد" : "RN. Fatima Saeed",
                  text: quickNurseText,
                  date: new Date().toLocaleString()
                };
                updatePatient(patientId, { nursingNotes: [newNote, ...notes] });
                setQuickNurseText("");
                setShowNurseNoteForm(false);
                setActiveTab("nursing_notes");
                toast.success(isAr ? "تم تسجيل الملاحظة التمريضية بنجاح." : "Nursing note recorded successfully.");
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold shadow-md transition cursor-pointer"
            >
              {isAr ? "حفظ الملاحظة" : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showOrderLabForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-rose-400" />
              {isAr ? "إنشاء طلب فحص مخبري (Lab Order)" : "New Lab Test Order"}
            </h2>
            <button onClick={() => setShowOrderLabForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "اختر الفحص المخبري المطلوب" : "Select Lab Test"}</label>
              <select 
                value={quickLabName}
                onChange={(e) => setQuickLabName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 p-2.5 focus:border-rose-500 outline-none font-bold"
              >
                <option value="CBC (صورة دم كاملة)">CBC (صورة دم كاملة)</option>
                <option value="BMP (لوحة التمثيل الغذائي الأساسية)">BMP (لوحة التمثيل الغذائي الأساسية)</option>
                <option value="LFT (وظائف الكبد)">LFT (وظائف الكبد)</option>
                <option value="KFT / Kidney Function Test (وظائف الكلى)">KFT (وظائف الكلى)</option>
                <option value="Troponin I (تحليل تروپونين للقلب)">Troponin I (تحليل تروپونين للقلب)</option>
                <option value="PT / INR (سيولة الدم)">PT / INR (سيولة الدم)</option>
                <option value="Arterial Blood Gas (ABG) (غازات الدم الشرياني)">Arterial Blood Gas (ABG) (غازات الدم الشرياني)</option>
              </select>
            </div>
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-lg font-semibold font-sans leading-relaxed">
              {isAr ? "سيتم توقيع الطلب إلكترونياً باسم الدكتور أحمد علي وإرساله فوراً للمختبر الطبي المركزي (LIS) للمستشفى." : "This order will be digitally signed by Dr. Ahmed Ali and dispatched to the Hospital Laboratory Information System (LIS)."}
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button onClick={() => setShowOrderLabForm(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                const currentOrders = currentPatient.orders || [];
                const newOrder = {
                  id: "ord-" + Date.now(),
                  type: "LAB",
                  name: quickLabName,
                  status: "Ordered",
                  date: new Date().toLocaleDateString()
                };
                updatePatient(patientId, { orders: [newOrder, ...currentOrders] });
                setShowOrderLabForm(false);
                setActiveTab("orders");
                toast.success(isAr ? `تم إرسال طلب تحليل (${quickLabName}) بنجاح للمختبر.` : `Lab order for (${quickLabName}) sent successfully to LIS.`);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-bold shadow-md transition cursor-pointer"
            >
              {isAr ? "تأكيد وإرسال الطلب" : "Sign & Dispatch Order"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showOrderRadForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              {isAr ? "طلب فحص تصوير أشعة جديد" : "New Radiology Order"}
            </h2>
            <button onClick={() => setShowOrderRadForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "اختر نوع الأشعة المطلوب" : "Select Radiology Procedure"}</label>
              <select 
                value={quickRadName}
                onChange={(e) => setQuickRadName(e.target.value)}
                className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 p-2.5 focus:border-amber-500 outline-none font-bold"
              >
                <option value="Chest X-Ray Portable (أشعة صدر متنقلة)">Chest X-Ray Portable (أشعة صدر متنقلة)</option>
                <option value="CT Brain W/O Contrast (أشعة مقطعية للمخ بدون صبغة)">CT Brain W/O Contrast (أشعة مقطعية للمخ بدون صبغة)</option>
                <option value="CT Abdomen & Pelvis (أشعة مقطعية للبطن والحوض)">CT Abdomen & Pelvis (أشعة مقطعية للبطن والحوض)</option>
                <option value="MRI Brain W/ Contrast (رنين مغناطيسي على المخ بالصبغة)">MRI Brain W/ Contrast (رنين مغناطيسي على المخ بالصبغة)</option>
                <option value="Ultrasound Abdomen (أشعة تلفزيونية للبطن)">Ultrasound Abdomen (أشعة تلفزيونية للبطن)</option>
              </select>
            </div>
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 p-3 rounded-lg font-semibold font-sans leading-relaxed">
              {isAr ? "سيتم تسجيل الطلب في نظام إدارة قسم الأشعة (RIS) وإشعار فني الأشعة المناوب فوراً." : "This order will be filed in the Radiology Information System (RIS) and dispatch alerts sent to the on-duty imaging tech."}
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button onClick={() => setShowOrderRadForm(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                const currentOrders = currentPatient.orders || [];
                const newOrder = {
                  id: "ord-" + Date.now(),
                  type: "RAD",
                  name: quickRadName,
                  status: "Ordered",
                  date: new Date().toLocaleDateString()
                };
                updatePatient(patientId, { orders: [newOrder, ...currentOrders] });
                setShowOrderRadForm(false);
                setActiveTab("orders");
                toast.success(isAr ? `تم إرسال طلب أشعة (${quickRadName}) بنجاح.` : `Radiology order for (${quickRadName}) registered successfully in RIS.`);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold shadow-md transition cursor-pointer"
            >
              {isAr ? "تأكيد وإرسال الطلب" : "Sign & Dispatch RIS Order"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPrescribeForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-400" />
              {isAr ? "وصف علاج ووصفة دوائية جديدة" : "New Medication Prescription"}
            </h2>
            <button onClick={() => setShowPrescribeForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "اسم الدواء العلمي أو التجاري" : "Drug Name"}</label>
                <input 
                  type="text" 
                  value={quickDrugName}
                  onChange={(e) => setQuickDrugName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:border-emerald-500 p-2.5 outline-none font-bold text-slate-800 font-sans"
                  placeholder={isAr ? "مثال: Ceftriaxone 1g, Paracetamol 500mg..." : "e.g., Ceftriaxone 1g, Paracetamol 500mg..."}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "الجرعة وتكرار الاستخدام" : "Dose & Frequency"}</label>
                <input 
                  type="text" 
                  value={quickDrugDose}
                  onChange={(e) => setQuickDrugDose(e.target.value)}
                  className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 focus:border-emerald-500 p-2.5 outline-none font-bold text-slate-800 font-sans"
                  placeholder={isAr ? "مثال: 1g IV Q12H, 500mg PO TID..." : "e.g., 500mg PO BID..."}
                />
              </div>
            </div>
            <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-lg font-semibold font-sans leading-relaxed">
              {isAr ? "سيتم فحص التداخلات الدوائية تلقائياً وإدراج الوصفة فوراً في ورقة علاج المريض (MAR) لتسهيل الصرف." : "The drug interaction check will auto-run and insert the prescription into the MAR sheet for nurse administration."}
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button onClick={() => setShowPrescribeForm(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                if (!quickDrugName.trim()) {
                  toast.error(isAr ? "يرجى كتابة اسم الدواء" : "Please input drug name");
                  return;
                }
                const prescriptions = currentPatient.prescriptions || [];
                const newRx = {
                  id: "rx-" + Date.now(),
                  name: quickDrugName,
                  dosage: quickDrugDose,
                  status: "Active",
                  date: new Date().toLocaleDateString()
                };
                updatePatient(patientId, { prescriptions: [newRx, ...prescriptions] });
                setQuickDrugName("");
                setShowPrescribeForm(false);
                setActiveTab("mar");
                toast.success(isAr ? `تمت إضافة وصفة (${quickDrugName}) وإرسالها للصيدلية الإلكترونية.` : `Medication prescription for (${quickDrugName}) signed and sent to Pharmacy.`);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md transition cursor-pointer"
            >
              {isAr ? "توقيع وإرسال الوصفة" : "E-Sign & Dispatch Prescription"}
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

            {activeTab === "progress_notes" && (
              <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      <FileEdit className="w-5 h-5 text-indigo-600" />
                      {isAr ? "ملاحظات تطور الحالة الطبية" : "Physician Progress Notes"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isAr ? "توثيق التطور اليومي وخطة العلاج من قبل الأطباء الاستشاريين والأخصائيين." : "Daily progress documentation and clinical plan by attending medical staff."}
                    </p>
                  </div>
                </div>

                {/* Add Note Form */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    {isAr ? "كتابة ملاحظة طبية جديدة" : "Add New Medical Note"}
                  </h4>
                  <div className="space-y-3">
                    <textarea 
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={3}
                      placeholder={isAr ? "اكتب هنا تفاصيل الفحص السريري، تشخيص اليوم، وتعديل الخطة الطبية..." : "Type daily clinical evaluation, physical exam findings, and diagnostic plans here..."}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 font-semibold text-slate-800 font-sans"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-slate-400 font-mono">
                        Author: Dr. Ahmed Ali (Cardiology)
                      </div>
                      <button 
                        onClick={handleSaveProgressNote}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                      >
                        {isAr ? "حفظ وتوقيع الملاحظة (E-Sign)" : "Sign & Save Progress Note"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline list */}
                <div className="space-y-4">
                  {(currentPatient.progressNotes || [
                    { id: "pn1", author: "Dr. Ahmed Ali (Cardiology)", text: isAr ? "حالة المريض مستقرة بعد العملية. العلامات الحيوية جيدة وقيد المتابعة مستمرة." : "Patient status is stable post-op. Vital signs are within normal limits and being monitored.", date: "2026-06-29 09:00" },
                    { id: "pn2", author: "Dr. Samir Hassan (Consultant)", text: isAr ? "يجب مراقبة مستويات السكر في الدم وضبط جرعة الأنسولين بناءً على الفحوصات الطبية الدورية." : "Monitor blood glucose levels and adjust Insulin dosage accordingly based on tests.", date: "2026-06-29 14:30" }
                  ]).map((note: any) => (
                    <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex gap-3 items-start relative hover:border-slate-300 transition">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs border border-indigo-100 uppercase shrink-0">
                        Dr
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-bold text-xs text-slate-800">{note.author}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">{note.date}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "nursing_notes" && (
              <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-sky-600" />
                      {isAr ? "ملاحظات ودفتر التمريض" : "Nursing Observation Notes"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isAr ? "تسجيل الملاحظات التمريضية المستمرة، وإعطاء المحاليل والأدوية والعناية اليومية بالسرير." : "Continuous nursing logs, critical care nursing records, and bedside interventions."}
                    </p>
                  </div>
                </div>

                {/* Add Nurse Note Form */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-sky-600" />
                    {isAr ? "كتابة ملاحظة تمريضية جديدة" : "Add New Nursing Note"}
                  </h4>
                  <div className="space-y-3">
                    <textarea 
                      value={nurseNoteText}
                      onChange={(e) => setNurseNoteText(e.target.value)}
                      rows={3}
                      placeholder={isAr ? "اكتب هنا ملاحظات السرير، استجابة المريض، العناية بالجروح، ومستوى الوعي..." : "Type bedside observations, pain scores, wound care, patient response, and intake/output status..."}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-sky-500 font-semibold text-slate-800 font-sans"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-slate-400 font-mono">
                        Author: RN. Fatima Saeed
                      </div>
                      <button 
                        onClick={handleSaveNurseNote}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                      >
                        {isAr ? "حفظ وتوقيع الملاحظة (E-Sign)" : "Sign & Save Nursing Note"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nursing Notes List */}
                <div className="space-y-4">
                  {(currentPatient.nursingNotes || [
                    { id: "nn1", author: "RN. Sarah Jones", text: isAr ? "تم إعطاء الأدوية الوريدية المقررة في موعدها المعتمد. المريض لا يعاني من ألم حالياً." : "Prescribed IV medications administered on schedule. Patient reports no pain currently.", date: "2026-06-30 08:00" },
                    { id: "nn2", author: "RN. Fatima Saeed", text: isAr ? "تم تغيير ضماد الجرح الجراحي بنجاح. الجرح نظيف تماماً ولا توجد أي علامات للالتهاب الموضعي." : "Surgical wound dressing changed successfully. Wound is clean, no signs of infection.", date: "2026-06-30 11:30" }
                  ]).map((note: any) => (
                    <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex gap-3 items-start relative hover:border-slate-300 transition">
                      <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 font-bold flex items-center justify-center text-xs border border-sky-100 uppercase shrink-0">
                        RN
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-bold text-xs text-slate-800">{note.author}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">{note.date}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "radiology" && (
              <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-600" />
                    {isAr ? "نظام الأشعة ونتائج التصوير PACS DICOM" : "Imaging & Radiology PACS DICOM System"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "استعراض صور الرنين المغناطيسي والأشعة المقطعية والسينية مباشرة من خادم PACS السريري الموحد للسرير والتشخيص." : "Browse high-resolution CT, MRI, and X-ray imaging directly retrieved from PACS server."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left list of studies */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">{isAr ? "الدراسات الطبية المتاحة" : "Available Imaging Studies"}</h4>
                    {[
                      { id: "rad1", type: "CT Brain W/O Contrast", date: "2026-06-29", status: "Completed", size: "24 slices" },
                      { id: "rad2", type: "Chest X-Ray Portable", date: "2026-06-28", status: "Completed", size: "1 slice" }
                    ].map((study, idx) => (
                      <div 
                        key={study.id} 
                        onClick={() => setSelectedStudyIdx(idx)}
                        className={`p-3 rounded-xl border transition cursor-pointer ${selectedStudyIdx === idx ? "bg-rose-50/50 border-rose-300 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300"}`}
                      >
                        <p className="font-bold text-xs text-slate-800">{study.type}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
                          <span>{study.date}</span>
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-black">{study.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Middle interactive viewer */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="bg-slate-950 text-white rounded-2xl p-4 flex flex-col items-center justify-center relative border-4 border-slate-800 shadow-lg min-h-[320px]">
                      {/* Image frame */}
                      <div className="w-full max-w-sm aspect-square relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-90 mix-blend-screen flex items-center justify-center" style={{ transform: `scale(${radZoom / 100})` }}>
                          {selectedStudyIdx === 0 ? (
                            <svg width="100%" height="100%" viewBox="0 0 200 200">
                              {/* Brain-like MRI cross section */}
                              <circle cx="100" cy="100" r={30 + (radSlice * 0.8)} fill="none" stroke="#f43f5e" strokeWidth="1.5" opacity={0.25} />
                              <ellipse cx="100" cy="100" rx={55 + (radSlice * 0.4)} ry={65 + (radSlice * 0.2)} fill="none" stroke="#ffffff" strokeWidth="2.5" opacity={0.8} style={{ filter: `contrast(${radContrast})` }} />
                              <path d={`M 60,100 Q 100,${65 + (radSlice * 1.6)} 140,100 Q 100,${135 - (radSlice * 1.6)} 60,100`} fill="none" stroke="#ffffff" strokeWidth="1" opacity={0.5} />
                              <circle cx="85" cy="85" r="8" fill="none" stroke="#ffffff" strokeWidth="1" opacity={0.3} />
                              <circle cx="115" cy="85" r="8" fill="none" stroke="#ffffff" strokeWidth="1" opacity={0.3} />
                            </svg>
                          ) : (
                            <svg width="100%" height="100%" viewBox="0 0 200 200">
                              {/* Chest X-ray diagram */}
                              <rect x="70" y="30" width="60" height="130" rx="10" fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.8} />
                              <path d="M 100,30 L 100,160" stroke="#ffffff" strokeWidth="3" opacity={0.4} strokeDasharray="3,3" />
                              <path d="M 75,50 Q 100,75 125,50" fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.7} />
                              <path d="M 75,80 Q 100,105 125,80" fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.7} />
                              <path d="M 75,110 Q 100,135 125,110" fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.7} />
                            </svg>
                          )}
                        </div>

                        {/* Labels overlay */}
                        <div className="absolute top-2 left-2 text-[9px] font-mono text-rose-400 uppercase tracking-widest font-bold">
                          {selectedStudyIdx === 0 ? `Slice: ${radSlice}/24` : "Standard PA View"} • Zoom: {radZoom}%
                        </div>
                        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400">
                          STUDY_REF: PACS_00{selectedStudyIdx + 4}
                        </div>
                      </div>
                    </div>

                    {/* Interactive controls */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-600">
                      {selectedStudyIdx === 0 ? (
                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-500">{isAr ? "تصفح المقاطع (Slice)" : "Scroll Slice"}</label>
                          <input type="range" min="1" max="24" value={radSlice} onChange={(e) => setRadSlice(Number(e.target.value))} className="w-full accent-rose-600" />
                        </div>
                      ) : (
                        <div className="text-slate-400 flex items-center justify-center">{isAr ? "مقطع واحد متاح" : "Single slice available"}</div>
                      )}
                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-500">{isAr ? "التباين (Contrast)" : "Contrast Adjustment"}</label>
                        <input type="range" min="0.5" max="2.0" step="0.1" value={radContrast} onChange={(e) => setRadContrast(Number(e.target.value))} className="w-full accent-rose-600" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-500">{isAr ? "التكبير (Zoom)" : "Zoom Factor"}</label>
                        <input type="range" min="80" max="180" step="10" value={radZoom} onChange={(e) => setRadZoom(Number(e.target.value))} className="w-full accent-rose-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "assessments" && (
              <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    {isAr ? "التقييمات والسكورات السريرية المعتمدة" : "Clinical Assessments & Scoring Engines"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "حساب فوري للمؤشرات الحيوية ومستوى الوعي وتخمين مخاطر السقوط والاعتلال الرئوي الموحد." : "Calculate Glasgow Coma Scale (GCS), qSOFA, and Morse Fall Risk on bedside parameters."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* GCS Calculator */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <h4 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
                      <span>Glasgow Coma Scale (GCS)</span>
                      <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-slate-700">Score: {gcsEye + gcsVerbal + gcsMotor}/15</span>
                    </h4>
                    <div className="space-y-3 text-xs font-sans">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "استجابة العين" : "Eye Opening Response (E)"}</label>
                        <select value={gcsEye} onChange={(e) => setGcsEye(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white outline-none">
                          <option value={4}>4 - Spontaneous opening</option>
                          <option value={3}>3 - Response to voice</option>
                          <option value={2}>2 - Response to pain</option>
                          <option value={1}>1 - None</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "الاستجابة اللفظية" : "Verbal Response (V)"}</label>
                        <select value={gcsVerbal} onChange={(e) => setGcsVerbal(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white outline-none">
                          <option value={5}>5 - Oriented, converses normally</option>
                          <option value={4}>4 - Confused, disoriented</option>
                          <option value={3}>3 - Inappropriate words</option>
                          <option value={2}>2 - Incomprehensible sounds</option>
                          <option value={1}>1 - None</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "الاستجابة الحركية" : "Motor Response (M)"}</label>
                        <select value={gcsMotor} onChange={(e) => setGcsMotor(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white outline-none">
                          <option value={6}>6 - Obeys commands</option>
                          <option value={5}>5 - Localizes painful stimulus</option>
                          <option value={4}>4 - Withdraws from pain</option>
                          <option value={3}>3 - Abnormal flexion (decorticate)</option>
                          <option value={2}>2 - Abnormal extension (decerebrate)</option>
                          <option value={1}>1 - None</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => handleSaveAssessment("gcs", gcsEye + gcsVerbal + gcsMotor)}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                      >
                        {isAr ? "حفظ التقييم في ملف المريض" : "Save GCS Assessment"}
                      </button>
                    </div>
                  </div>

                  {/* Morse Fall Risk */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <h4 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
                      <span>{isAr ? "مقياس السقوط (Morse Fall Risk)" : "Morse Fall Risk Scale"}</span>
                      <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-lg text-xs font-mono font-black border border-rose-200">
                        {isAr ? "خطر مرتفع" : "High Risk (70)"}
                      </span>
                    </h4>
                    <div className="text-xs space-y-3 font-semibold text-slate-600 font-sans">
                      <div className="flex items-center gap-2 p-1">
                        <input type="checkbox" checked={true} readOnly className="w-4 h-4 text-amber-500 rounded border-slate-300" />
                        <span>History of Falling: Yes (+25)</span>
                      </div>
                      <div className="flex items-center gap-2 p-1">
                        <input type="checkbox" checked={true} readOnly className="w-4 h-4 text-amber-500 rounded border-slate-300" />
                        <span>Secondary Diagnosis: Yes (+15)</span>
                      </div>
                      <div className="flex items-center gap-2 p-1">
                        <input type="checkbox" checked={true} readOnly className="w-4 h-4 text-amber-500 rounded border-slate-300" />
                        <span>Intravenous Therapy/Heparin Lock: Yes (+20)</span>
                      </div>
                      <div className="flex items-center gap-2 p-1">
                        <input type="checkbox" checked={true} readOnly className="w-4 h-4 text-amber-500 rounded border-slate-300" />
                        <span>Gait: Weak (+10)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-normal italic border-t border-slate-100 pt-2">
                        {isAr ? "أي سكور أكبر من 45 يستدعي اتخاذ إجراءات الحماية ووضع العلامة الصفراء بجانب السرير لمنع السقوط." : "Any score above 45 warrants fall protection protocols and bedside yellow triangle tags."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "io" && (
              <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-indigo-500" />
                    {isAr ? "مخطط توازن السوائل الداخلة والخارجة (Intake & Output)" : "Intake & Output Fluid Balance"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "مراقبة دقيقة للحجم والجرعات والسوائل الوريدية وحساب التوازن المائي اليومي بجوار السرير." : "Bedside monitoring of oral/IV fluid intake versus urine/drainage output."}
                  </p>
                </div>

                {/* Balance Summary Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 text-white rounded-2xl p-4 font-sans">
                  <div className="text-center space-y-1 border-r border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? "إجمالي الوارد (Intake)" : "Total Intake"}</p>
                    <p className="text-xl font-black text-indigo-400">{ioIntakeTotal} mL</p>
                  </div>
                  <div className="text-center space-y-1 border-r border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? "إجمالي الصادر (Output)" : "Total Output"}</p>
                    <p className="text-xl font-black text-amber-400">{ioOutputTotal} mL</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? "الصافي (Net Balance)" : "Net Balance"}</p>
                    <p className={`text-xl font-black ${ioIntakeTotal - ioOutputTotal >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {ioIntakeTotal - ioOutputTotal >= 0 ? "+" : ""}{ioIntakeTotal - ioOutputTotal} mL
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  {/* Intake list & Form */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-800 text-xs uppercase">{isAr ? "السوائل الواردة (Intake)" : "Fluid Intake Registry"}</h4>
                      <div className="flex gap-1.5">
                        <input 
                          type="number" 
                          placeholder="mL" 
                          value={ioIntakeAmt}
                          onChange={(e) => setIoIntakeAmt(e.target.value)}
                          className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold font-mono text-center outline-none" 
                        />
                        <button 
                          onClick={handleAddIntake}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-2 py-0.5 rounded cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentIntakes.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center text-xs font-semibold p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-700">{item.type}</span>
                          <span className="font-mono text-indigo-700">{item.amount} mL <span className="text-[9px] text-slate-400 font-bold ml-1">{item.date}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Output list & Form */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-800 text-xs uppercase">{isAr ? "السوائل الصادرة (Output)" : "Fluid Output Registry"}</h4>
                      <div className="flex gap-1.5">
                        <input 
                          type="number" 
                          placeholder="mL" 
                          value={ioOutputAmt}
                          onChange={(e) => setIoOutputAmt(e.target.value)}
                          className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold font-mono text-center outline-none" 
                        />
                        <button 
                          onClick={handleAddOutput}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2 py-0.5 rounded cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentOutputs.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center text-xs font-semibold p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-700">{item.type}</span>
                          <span className="font-mono text-amber-700">{item.amount} mL <span className="text-[9px] text-slate-400 font-bold ml-1">{item.date}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs can have placeholders for now, the key is the structured layout and forms */}
            {!["summary", "forms", "timeline", "handover", "progress_notes", "nursing_notes", "radiology", "assessments", "io"].includes(activeTab) && (
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
        <div className="fixed inset-0 bg-slate-900/90 z-[999999] flex flex-col md:flex-row backdrop-blur-sm" dir={isAr ? "rtl" : "ltr"}>
          {/* Print Style Injector */}
          <style>{`
            @media print {
              /* Hide everything on screen */
              body * {
                visibility: hidden !important;
              }
              /* Reveal only the clinical report page */
              #clinical-report-page, #clinical-report-page * {
                visibility: visible !important;
              }
              #clinical-report-page {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
                color: black !important;
              }
              /* Ensure proper colors are printed */
              html, body {
                background-color: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print {
                display: none !important;
              }
              @page {
                size: A4 portrait;
                margin: 15mm;
              }
            }
          `}</style>

          {/* Interactive Print Settings Sidebar */}
          <div className="w-full md:w-96 bg-slate-800 text-white border-b md:border-b-0 md:border-r border-slate-700 p-6 flex flex-col justify-between shrink-0 no-print">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <h2 className="font-black text-lg flex items-center gap-2">
                  <Printer className="w-5 h-5 text-indigo-400" />
                  {isAr ? "مركز طباعة التقارير" : "Clinical Report Center"}
                </h2>
                <button 
                  onClick={() => setShowPrintPreview(false)}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 1: Select Report Type */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  {isAr ? "1. حدد نوع التقرير الطبي" : "1. Select Report Type"}
                </label>
                {[
                  { id: "comprehensive", icon: FileText, ar: "السجل الطبي الشامل", en: "Comprehensive Medical Chart" },
                  { id: "mar", icon: Pill, ar: "سجل إعطاء الأدوية (MAR)", en: "Medication Admin Record" },
                  { id: "labs", icon: FlaskConical, ar: "نتائج التحاليل المخبرية", en: "Laboratory Results Report" },
                  { id: "nursing", icon: ShieldAlert, ar: "ملاحظات التمريض والفرز", en: "Nursing Care & Triage" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = (showPrintPreview as any).reportType === item.id || (!(showPrintPreview as any).reportType && item.id === "comprehensive");
                  return (
                    <button
                      key={item.id}
                      onClick={() => setShowPrintPreview({ ...showPrintPreview, reportType: item.id } as any)}
                      className={`w-full text-left rtl:text-right p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        isSelected 
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/15" 
                          : "bg-slate-700/50 border-slate-700 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-indigo-500" : "bg-slate-700"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{isAr ? item.ar : item.en}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{isAr ? item.en : item.ar}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step 2: Advanced Options */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  {isAr ? "2. خيارات التخصيص والمظهر" : "2. Customization Options"}
                </label>
                
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-700/30 border border-slate-700 cursor-pointer hover:bg-slate-700/50 transition">
                  <div>
                    <p className="text-xs font-bold">{isAr ? "الختم الرسمي للمستشفى" : "Hospital Seal & Stamp"}</p>
                    <p className="text-[10px] text-slate-400">{isAr ? "إظهار ختم المستشفى المعتمد" : "Show authorized stamp"}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    id="opt-seal" 
                    className="w-4 h-4 accent-indigo-500 rounded" 
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-700/30 border border-slate-700 cursor-pointer hover:bg-slate-700/50 transition">
                  <div>
                    <p className="text-xs font-bold">{isAr ? "توقيع الطبيب والمدير الطبي" : "Attending Signatures"}</p>
                    <p className="text-[10px] text-slate-400">{isAr ? "إضافة مساحات التواقيع بالأسفل" : "Add authorization fields"}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    id="opt-signatures" 
                    className="w-4 h-4 accent-indigo-500 rounded" 
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-700/30 border border-slate-700 cursor-pointer hover:bg-slate-700/50 transition">
                  <div>
                    <p className="text-xs font-bold">{isAr ? "ثنائي اللغة (Arabic/English)" : "Bilingual Output"}</p>
                    <p className="text-[10px] text-slate-400">{isAr ? "طباعة ترويسة ومصطلحات ثنائية" : "Bilingual headings"}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    id="opt-bilingual" 
                    className="w-4 h-4 accent-indigo-500 rounded" 
                  />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700 space-y-3">
              <button 
                onClick={() => window.print()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                {isAr ? "بدء الطباعة الفورية (A4)" : "Start Printing (A4)"}
              </button>
              <button 
                onClick={() => setShowPrintPreview(false)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-xl font-bold text-xs transition"
              >
                {isAr ? "رجوع وإغلاق" : "Cancel & Close"}
              </button>
            </div>
          </div>

          {/* Live Print Paper Preview Panel */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-900 flex justify-center">
            <div 
              id="clinical-report-page" 
              className="bg-white w-full max-w-[210mm] shadow-2xl p-[15mm] md:p-[20mm] rounded-sm text-slate-900 relative flex flex-col justify-between"
              style={{ minHeight: "297mm", fontFamily: "'Inter', sans-serif" }}
            >
              {/* Institutional Watermark Background (Only visible on web preview, or subtle on print) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none opacity-[0.02]">
                <div className="border-[15px] border-indigo-900 rounded-full p-20 rotate-12">
                  <Activity className="w-96 h-96 text-indigo-900" />
                </div>
              </div>

              <div>
                {/* 1. Official State Hospital Header */}
                <div className="border-b-[3px] border-slate-800 pb-5 mb-6 flex justify-between items-center">
                  <div className="text-left text-xs space-y-1 font-bold text-slate-700">
                    <p className="text-slate-950 font-black text-sm uppercase">CloudCare Hospital Group</p>
                    <p>Clinical Information Services</p>
                    <p>License No: H-90238-A</p>
                    <p className="text-[10px] text-slate-500">Ministry of Health Certified</p>
                  </div>
                  
                  {/* Central Emblem */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center mb-1 shadow-sm">
                      <Activity className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 tracking-wider">CLOUDCARE</span>
                    <span className="text-[8px] font-bold text-slate-500">العناية السحابية</span>
                  </div>

                  <div className="text-right text-xs space-y-1 font-bold text-slate-700">
                    <p className="text-slate-950 font-black text-sm">مستشفى العناية السحابية التخصصي</p>
                    <p>إدارة السجلات والتقارير الطبية</p>
                    <p>رقم الترخيص: ٩٠٢٣٨-أ</p>
                    <p className="text-[10px] text-slate-500">معتمد من وزارة الصحة</p>
                  </div>
                </div>

                {/* Sub-Header metadata line (Document description, Date & QR code) */}
                <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      {!(showPrintPreview as any).reportType || (showPrintPreview as any).reportType === "comprehensive" ? (
                        <>
                          <span>{isAr ? "السجل الطبي السريري الشامل" : "Comprehensive Clinical Medical Record"}</span>
                        </>
                      ) : (showPrintPreview as any).reportType === "mar" ? (
                        <>
                          <span>{isAr ? "سجل إعطاء الأدوية المعتمد (MAR)" : "Certified Medication Administration Record"}</span>
                        </>
                      ) : (showPrintPreview as any).reportType === "labs" ? (
                        <>
                          <span>{isAr ? "تقرير الفحوصات المخبرية الطبية" : "Clinical Laboratory Investigation Report"}</span>
                        </>
                      ) : (
                        <>
                          <span>{isAr ? "مخطط التقييم السريري والفرز التمريضي" : "Clinical Nursing Triage & Assessment Chart"}</span>
                        </>
                      )}
                    </h1>
                    <p className="text-xs text-slate-500 font-bold mt-1">
                      <span>Doc Ref: CC-REP-{patientId}-{new Date().getFullYear()}</span>
                      <span className="mx-2">•</span>
                      <span>Date: {new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>
                    </p>
                  </div>
                  
                  {/* Security Verification Barcode & QR Code */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-1 border border-slate-200 rounded shadow-sm">
                        <QrCode className="w-10 h-10 text-slate-800" />
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">VERIFY CODE</span>
                    </div>
                  </div>
                </div>

                {/* 2. Patient Master Demographic Card */}
                <div className="border border-slate-300 rounded-xl overflow-hidden mb-6 shadow-sm">
                  <div className="bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 border-b border-slate-300 flex justify-between">
                    <span>{isAr ? "البيانات الديموغرافية والسريرية للمريض" : "PATIENT DEMOGRAPHICS & CLINICAL METADATA"}</span>
                    <span className="font-mono">MRN: {patientId}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-200 bg-white">
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "اسم المريض" : "Patient Name"}</p>
                      <p className="font-extrabold text-slate-800 text-sm">{patientName || (isAr ? "مريض عام" : "Generic Patient")}</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "رقم المريض الدولي" : "National Medical ID"}</p>
                      <p className="font-extrabold text-slate-800">MRN-{patientId.replace("MRN-", "")}</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "العمر والنوع" : "Age / Gender"}</p>
                      <p className="font-extrabold text-slate-800">45 Years • {isAr ? "ذكر" : "Male"}</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "فصيلة الدم والتحذيرات" : "Blood Group & Alerts"}</p>
                      <p className="font-extrabold text-rose-700 flex items-center gap-1">O+ <span className="bg-rose-50 text-rose-600 text-[10px] px-1 rounded border border-rose-200">Fall Risk</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 border-t border-slate-200 bg-slate-50/50">
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "الجناح / الغرفة" : "Ward / Room"}</p>
                      <p className="font-bold text-slate-800">Intensive Care (ICU) • Room 4</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "الطبيب المشرف" : "Attending Consultant"}</p>
                      <p className="font-bold text-slate-800">Dr. Ahmed Ali, MD</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "تاريخ الدخول" : "Admission Date"}</p>
                      <p className="font-bold text-slate-800">2026-06-25 14:30</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "الحالة عند التقديم" : "Acuity Status"}</p>
                      <p className="font-bold text-amber-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                        {isAr ? "حالة حرجة" : "High Acuity (ICU)"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. DYNAMIC REPORT CONTENTS BASED ON SELECT TYPE */}

                {/* TYPE A: COMPREHENSIVE MEDICAL REPORT */}
                {(!(showPrintPreview as any).reportType || (showPrintPreview as any).reportType === "comprehensive") && (
                  <div className="space-y-6">
                    {/* Clinical Summary & Diagnoses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-slate-200 rounded-lg p-4">
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-rose-500" />
                          {isAr ? "التشخيصات والمشكلات النشطة" : "Active Clinical Diagnoses"}
                        </h3>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-slate-400 font-bold text-left rtl:text-right border-b border-slate-100">
                              <th className="pb-1">{isAr ? "التشخيص" : "Diagnosis"}</th>
                              <th className="pb-1">{isAr ? "الرمز" : "ICD-10"}</th>
                              <th className="pb-1 text-right">{isAr ? "الأولوية" : "Priority"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Acute Myocardial Infarction</td>
                              <td className="py-2 text-slate-500 font-mono">I21.9</td>
                              <td className="py-2 text-right"><span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Primary</span></td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Sepsis / Septic Shock</td>
                              <td className="py-2 text-slate-500 font-mono">A41.9</td>
                              <td className="py-2 text-right"><span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Secondary</span></td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Type 2 Diabetes Mellitus</td>
                              <td className="py-2 text-slate-500 font-mono">E11.9</td>
                              <td className="py-2 text-right"><span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">Chronic</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="border border-slate-200 rounded-lg p-4">
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-emerald-500" />
                          {isAr ? "خطة العلاج والأدوية النشطة" : "Active Outpatient & Inpatient Medications"}
                        </h3>
                        <table className="w-full text-xs text-left rtl:text-right">
                          <thead>
                            <tr className="text-slate-400 font-bold border-b border-slate-100">
                              <th className="pb-1">{isAr ? "الدواء" : "Medication"}</th>
                              <th className="pb-1">{isAr ? "الجرعة والمسار" : "Dosage / Route"}</th>
                              <th className="pb-1 text-right">{isAr ? "التكرار" : "Frequency"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Aspirin EC</td>
                              <td className="py-2 text-slate-600">81 mg PO</td>
                              <td className="py-2 text-right text-slate-500">Once Daily</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Lisinopril</td>
                              <td className="py-2 text-slate-600">10 mg PO</td>
                              <td className="py-2 text-right text-slate-500">Once Daily</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Ceftriaxone IV</td>
                              <td className="py-2 text-slate-600">2 g IV Infusion</td>
                              <td className="py-2 text-right text-slate-500">Every 12 hrs</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Vitals summary block */}
                    <div className="border border-slate-200 rounded-lg p-4">
                      <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">
                        {isAr ? "آخر قراءات العلامات الحيوية الموثقة" : "Latest Documented Vital Signs (Clinical Parameters)"}
                      </h3>
                      <div className="grid grid-cols-5 gap-4 text-center">
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</p>
                          <p className="text-base font-black text-rose-700 mt-1">90/60</p>
                          <span className="text-[8px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1 rounded">Hypotension</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</p>
                          <p className="text-base font-black text-rose-700 mt-1">110 bpm</p>
                          <span className="text-[8px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1 rounded">Tachycardia</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Temperature</p>
                          <p className="text-base font-black text-amber-700 mt-1">38.5 °C</p>
                          <span className="text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1 rounded">Fever</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Oxygen Saturation</p>
                          <p className="text-base font-black text-slate-800 mt-1">94% SpO2</p>
                          <span className="text-[8px] font-bold text-slate-500">Room Air</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Respiratory Rate</p>
                          <p className="text-base font-black text-slate-800 mt-1">20 bpm</p>
                          <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 rounded">Normal</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Notes summary */}
                    <div className="border border-slate-200 rounded-lg p-4">
                      <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">
                        {isAr ? "ملاحظات وتوصيات التطور السريري" : "Latest Clinical Evolution Notes"}
                      </h3>
                      <div className="space-y-4">
                        <div className="text-xs">
                          <div className="flex justify-between font-bold text-slate-500 mb-1">
                            <span>Dr. Ahmed Ali (Cardiology) • Progress Note</span>
                            <span>2026-06-29 09:15</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            "Patient is recovering from septic shock. MAP is being maintained &gt; 65 mmHg with low-dose vasopressors. Urine output has improved to 0.5 mL/kg/hr. Cardiac enzymes are trending downwards. Will continue Ceftriaxone and monitor renal functions closely."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TYPE B: MEDICATION ADMINISTRATION RECORD (MAR) */}
                {(showPrintPreview as any).reportType === "mar" && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? "جميع الأدوية المدرجة تم التحقق منها ومطابقتها وفق الكود الدوائي الموحد." : "All medications listed have been verified and cross-checked using electronic barcode MAR system."}</span>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs text-left rtl:text-right">
                        <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                          <tr>
                            <th className="p-3">{isAr ? "الدواء الموصوف" : "Prescribed Medication"}</th>
                            <th className="p-3">{isAr ? "الجرعة والمسار" : "Dosage / Route"}</th>
                            <th className="p-3">{isAr ? "التوقيت المجدول" : "Schedule"}</th>
                            <th className="p-3">{isAr ? "آخر إعطاء للمريض" : "Last Given"}</th>
                            <th className="p-3">{isAr ? "الممرض المسؤول" : "Administered By"}</th>
                            <th className="p-3 text-right">{isAr ? "الحالة" : "Status"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {[
                            { name: "Aspirin EC", dosage: "81 mg PO", freq: "Daily 09:00", last: "Today, 09:05", nurse: "Fatima Al-Harbi, RN", status: "Given" },
                            { name: "Lisinopril 10mg", dosage: "10 mg PO", freq: "Daily 09:00", last: "Today, 09:12", nurse: "Fatima Al-Harbi, RN", status: "Given" },
                            { name: "Insulin Glargine", dosage: "10 units SC", freq: "Nightly 22:00", last: "Yesterday, 22:03", nurse: "Sarah Smith, RN", status: "Given" },
                            { name: "Ceftriaxone IV", dosage: "2 g IV", freq: "Q12h 08:00 / 20:00", last: "Today, 08:00", nurse: "Fatima Al-Harbi, RN", status: "Given" },
                            { name: "Heparin Sodium Injection", dosage: "5000 units SC", freq: "Q12h 06:00 / 18:00", last: "Today, 06:15", nurse: "Sarah Smith, RN", status: "Given" }
                          ].map((med, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="p-3 font-bold text-slate-800">{med.name}</td>
                              <td className="p-3 text-slate-600">{med.dosage}</td>
                              <td className="p-3 text-slate-500 font-mono">{med.freq}</td>
                              <td className="p-3 text-slate-600">{med.last}</td>
                              <td className="p-3 text-slate-700 font-bold">{med.nurse}</td>
                              <td className="p-3 text-right"><span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">{med.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TYPE C: LABORATORY RESULTS REPORT */}
                {(showPrintPreview as any).reportType === "labs" && (
                  <div className="space-y-6">
                    {/* Chemistry / Basic Metabolic Panel */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-black text-slate-700">
                        {isAr ? "وظائف الكلى ولوحة الأملاح الأساسية (BMP)" : "BASIC METABOLIC PANEL & RENAL FUNCTION"}
                      </div>
                      <table className="w-full text-xs text-left rtl:text-right border-collapse">
                        <thead className="bg-slate-100/50 border-b border-slate-200 font-bold text-slate-500">
                          <tr>
                            <th className="p-2.5">{isAr ? "الفحص" : "Test Analyte"}</th>
                            <th className="p-2.5">{isAr ? "النتيجة" : "Result"}</th>
                            <th className="p-2.5">{isAr ? "الرمز" : "Flag"}</th>
                            <th className="p-2.5">{isAr ? "الوحدة" : "Reference Range"}</th>
                            <th className="p-2.5 text-right">{isAr ? "تاريخ الفحص" : "Timestamp"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                          {[
                            { name: "Sodium (Na+)", val: "138", flag: "Normal", range: "135 - 145 mEq/L", time: "Today 07:15" },
                            { name: "Potassium (K+)", val: "3.2", flag: "Low", range: "3.5 - 5.0 mEq/L", time: "Today 07:15" },
                            { name: "Creatinine (Serum)", val: "1.45", flag: "High", range: "0.60 - 1.20 mg/dL", time: "Today 07:15" },
                            { name: "Blood Urea Nitrogen (BUN)", val: "28", flag: "High", range: "7 - 20 mg/dL", time: "Today 07:15" },
                            { name: "Glucose (Random)", val: "164", flag: "High", range: "70 - 140 mg/dL", time: "Today 07:15" }
                          ].map((lab, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-bold">{lab.name}</td>
                              <td className="p-2.5">{lab.val}</td>
                              <td className="p-2.5">
                                {lab.flag === "Normal" ? (
                                  <span className="text-slate-500 font-bold">Normal</span>
                                ) : (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${lab.flag === "High" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{lab.flag}</span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500 font-mono text-[10px]">{lab.range}</td>
                              <td className="p-2.5 text-right text-slate-400 font-mono text-[10px]">{lab.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* CBC Panel */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-black text-slate-700">
                        {isAr ? "صورة الدم الكاملة (CBC)" : "COMPLETE BLOOD COUNT PANEL (CBC)"}
                      </div>
                      <table className="w-full text-xs text-left rtl:text-right border-collapse">
                        <thead className="bg-slate-100/50 border-b border-slate-200 font-bold text-slate-500">
                          <tr>
                            <th className="p-2.5">{isAr ? "التحليل" : "Parameter"}</th>
                            <th className="p-2.5">{isAr ? "النتيجة" : "Result"}</th>
                            <th className="p-2.5">{isAr ? "الحالة" : "Flag"}</th>
                            <th className="p-2.5">{isAr ? "النطاق الطبيعي" : "Reference Range"}</th>
                            <th className="p-2.5 text-right">{isAr ? "التحليل" : "Timestamp"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                          {[
                            { name: "White Blood Cells (WBC)", val: "14.2", flag: "High", range: "4.5 - 11.0 x10^3/uL", time: "Today 07:15" },
                            { name: "Red Blood Cells (RBC)", val: "4.10", flag: "Normal", range: "4.30 - 5.90 x10^6/uL", time: "Today 07:15" },
                            { name: "Hemoglobin (Hgb)", val: "12.4", flag: "Low", range: "13.5 - 17.5 g/dL", time: "Today 07:15" },
                            { name: "Platelet Count (PLT)", val: "185", flag: "Normal", range: "150 - 450 x10^3/uL", time: "Today 07:15" }
                          ].map((lab, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-bold">{lab.name}</td>
                              <td className="p-2.5">{lab.val}</td>
                              <td className="p-2.5">
                                {lab.flag === "Normal" ? (
                                  <span className="text-slate-500 font-bold">Normal</span>
                                ) : (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${lab.flag === "High" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{lab.flag}</span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500 font-mono text-[10px]">{lab.range}</td>
                              <td className="p-2.5 text-right text-slate-400 font-mono text-[10px]">{lab.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TYPE D: NURSING ASSESSMENT & TRIAGE */}
                {(showPrintPreview as any).reportType === "nursing" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                        <h4 className="font-extrabold text-xs text-slate-700 uppercase mb-2 border-b border-slate-200 pb-1">{isAr ? "مقياس مورس لمخاطر السقوط" : "Morse Fall Risk Scale"}</h4>
                        <div className="text-xs space-y-1 font-bold">
                          <p><span className="text-slate-400 font-medium">History of Falling:</span> Yes (+25)</p>
                          <p><span className="text-slate-400 font-medium">Secondary Diagnosis:</span> Yes (+15)</p>
                          <p><span className="text-slate-400 font-medium">Intravenous Therapy:</span> Yes (+20)</p>
                          <p><span className="text-slate-400 font-medium">Gait / Transferring:</span> Weak (+10)</p>
                          <p className="border-t border-slate-200 pt-1.5 mt-1.5 text-rose-700 flex justify-between">
                            <span>TOTAL SCORE:</span>
                            <span className="font-black">70 (High Risk)</span>
                          </p>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                        <h4 className="font-extrabold text-xs text-slate-700 uppercase mb-2 border-b border-slate-200 pb-1">{isAr ? "التحكم في السوائل وحجم التوازن (I&O)" : "Intake & Output Balances"}</h4>
                        <div className="text-xs space-y-1 font-bold">
                          <p className="text-indigo-700"><span className="text-slate-400 font-medium">Total Fluid Intake:</span> 1,800 mL (Oral + IV Fluids)</p>
                          <p className="text-amber-700"><span className="text-slate-400 font-medium">Total Fluid Output:</span> 1,650 mL (Urine + Insensible)</p>
                          <p className="border-t border-slate-200 pt-1.5 mt-1.5 text-slate-800 flex justify-between">
                            <span>NET BALANCE (24H):</span>
                            <span className="font-black text-emerald-600">+150 mL (Balanced)</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4">
                      <h4 className="font-extrabold text-xs text-slate-700 uppercase mb-3 border-b border-slate-200 pb-2">{isAr ? "ملاحظات التمريض ومسار الرعاية اليومي" : "Nursing Intervention Logs & Handovers"}</h4>
                      <div className="space-y-4 text-xs font-semibold">
                        <div className="border-l-2 border-slate-300 pl-3">
                          <p className="text-slate-400 text-[10px] mb-0.5">Today, 07:00 - morning handover</p>
                          <p className="text-slate-700 leading-relaxed">
                            "Acuity remains high. Septic workup completed. IV site patent, monitored Q2h. Patient was educated on high fall risk. Bed rails up x3, call light placed in hand. Patient verbalized understanding."
                          </p>
                          <p className="text-indigo-600 font-extrabold mt-1">Fatima Al-Harbi, RN (E-Signed)</p>
                        </div>
                        
                        <div className="border-l-2 border-slate-300 pl-3">
                          <p className="text-slate-400 text-[10px] mb-0.5">Yesterday, 19:15 - night handover</p>
                          <p className="text-slate-700 leading-relaxed">
                            "Maintained on sterile central line dressing. Pain remains controlled around 2-3/10 after Acetaminophen administration. Vitals stabilized but BP still trending low (90s systolic). Vasopressor infusions running."
                          </p>
                          <p className="text-indigo-600 font-extrabold mt-1">Sarah Smith, RN (E-Signed)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Official Authorizations, Signature Stamp & Legal Disclaimers */}
              <div className="mt-12 pt-8 border-t border-slate-300 space-y-8">
                {/* Formal Clinical Disclaimer Text */}
                <div className="text-[9px] text-slate-400 text-center leading-relaxed font-bold">
                  <p className="uppercase">Confidentiality Notice: This document contains highly sensitive patient health information protected under Health Information Privacy regulations. Unauthorized disclosure is subject to legal action.</p>
                  <p className="mt-1">تم إصدار هذا التقرير إلكترونياً من نظام السجلات الطبية الموحد لمستشفى العناية السحابية وهو معتمد رسمياً دون الحاجة لكتابة خطية. أي كشط أو تعديل عليه يلغي الاعتماد.</p>
                </div>

                {/* Stamp & Signatures Blocks */}
                <div className="grid grid-cols-3 gap-6 pt-4 relative">
                  {/* Digital Approval Stamp Overlay (Mocked beautifully) */}
                  <div className="absolute left-[37%] top-0 pointer-events-none select-none opacity-[0.4] flex flex-col items-center">
                    <div className="w-24 h-24 border-4 border-emerald-600 rounded-full flex flex-col items-center justify-center font-black text-[10px] text-emerald-600 rotate-12 scale-90">
                      <span>CLOUDCARE</span>
                      <span className="text-[7px]">APPROVED SEAL</span>
                      <span>٢٠٢٦ معتمد</span>
                    </div>
                  </div>

                  {/* Left block */}
                  <div className="text-center text-xs space-y-4">
                    <p className="font-extrabold text-slate-400 uppercase text-[9px]">{isAr ? "الممرض المسؤول" : "Administering Nurse"}</p>
                    <div className="font-cursive text-indigo-700 italic font-bold">Fatima Al-Harbi, RN</div>
                    <div className="border-t border-slate-300 pt-1.5 text-[10px] font-bold text-slate-600">
                      <span>Fatima Al-Harbi, RN</span>
                      <p className="text-[8px] text-slate-400 font-mono">ID: 8931-RN</p>
                    </div>
                  </div>

                  {/* Center block */}
                  <div className="text-center text-xs space-y-4">
                    <p className="font-extrabold text-slate-400 uppercase text-[9px]">{isAr ? "الختم الرسمي للمؤسسة" : "Hospital Stamp Seal"}</p>
                    <div className="h-8"></div>
                    <div className="border-t border-slate-300 pt-1.5 text-[10px] font-bold text-slate-600">
                      <span>CloudCare Registry</span>
                      <p className="text-[8px] text-slate-400 font-mono">Registry: Verified 2026</p>
                    </div>
                  </div>

                  {/* Right block */}
                  <div className="text-center text-xs space-y-4">
                    <p className="font-extrabold text-slate-400 uppercase text-[9px]">{isAr ? "الاستشاري المسؤول" : "Attending Consultant"}</p>
                    <div className="font-cursive text-indigo-700 italic font-bold">Dr. Ahmed Ali, MD</div>
                    <div className="border-t border-slate-300 pt-1.5 text-[10px] font-bold text-slate-600">
                      <span>Dr. Ahmed Ali, MD</span>
                      <p className="text-[8px] text-slate-400 font-mono">MOH Reg: 10298-MD</p>
                    </div>
                  </div>
                </div>

                {/* Footer bottom bar */}
                <div className="text-center text-[9px] text-slate-400 pt-4 border-t border-slate-100 font-mono flex justify-between font-bold">
                  <span>SYSTEM SOURCE: CLOUDCARE HOSPITAL INFORMATION SYSTEM (HIS)</span>
                  <span>PAGE 1 OF 1</span>
                  <span>EN/AR OFFICIALLY CERTIFIED</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
