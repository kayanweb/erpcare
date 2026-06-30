import React, { useState, useEffect } from "react";
import { 
  Printer, Share2, MoreHorizontal, AlertTriangle, UserPlus, FileText, Beaker, Zap, Pill, 
  Calendar, CheckCircle2, ChevronRight, Download, Activity, HeartPulse, Droplets, Thermometer,
  Wind, Scale, Search, Clock, Plus, ArrowRight, Trash2, Save, X, Check, Eye, History
} from "lucide-react";
import { motion } from "motion/react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";
import SearchableCombobox from "./SearchableCombobox";
import { LAB_CATALOG, RAD_CATALOG, PROC_CATALOG, MED_CATALOG } from "../data/medicalCatalog";

interface Props {
  language: "ar" | "en";
  currentUser?: any;
  systemUsers?: any[];
  departments?: string[];
  onNavigate?: (tab: string) => void;
}

export interface ClinicalNote {
  id: string;
  recordedAt: string;
  author: string;
  role: string;
  type: string; // "Regular" | "Emergency" | "Consultation"
  status: string; // "Co-Signed" | "Draft"
  pmh: string;
  oncologyHistory: string;
  presentation: string;
  examination: string;
  investigations: string;
  plan: string;
}

const clinicalTabs = [
  { id: "Overview", ar: "نظرة عامة", en: "Overview" },
  { id: "Timeline", ar: "فيلم الأحداث (الزمني)", en: "Event Timeline" },
  { id: "Complaints", ar: "الشكاوى", en: "Complaints" },
  { id: "Allergies", ar: "الحساسية والأمراض", en: "Allergies" },
  { id: "Vitals", ar: "المؤشرات الحيوية", en: "Vitals" },
  { id: "Diagnosis", ar: "التشخيص (ICD-10)", en: "Diagnosis" },
  { id: "Orders", ar: "الطلبات والفحوصات", en: "Orders" },
  { id: "Prescription", ar: "الوصفة الدوائية", en: "Prescription" },
  { id: "Clinical Notes", ar: "الملاحظات السريرية", en: "Clinical Notes" },
];

const getInitialNotesForPatient = (patientId: string, isAr: boolean): ClinicalNote[] => {
  if (patientId === "p1") {
    return [
      {
        id: "note-p1-1",
        recordedAt: "25-Jun-2026 06:45 PM",
        author: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid",
        role: isAr ? "طبيب مقيم طوارئ" : "ER Resident",
        type: "Emergency",
        status: "Co-Signed",
        pmh: isAr ? "ارتفاع ضغط الدم المزمن والسكري النوع الثاني." : "Chronic essential hypertension and Type 2 Diabetes Mellitus.",
        oncologyHistory: isAr ? "لا يوجد تاريخ معروف للإصابة بالأورام." : "No significant oncology or metastatic history.",
        presentation: isAr ? "حضر المريض إلى الطوارئ يعاني من ألم صدري ضاغط خلف القص يمتد للكتف الأيسر ومصحوباً بتعرق غزير." : "Presented to the ER with severe retrosternal squeezing chest pain radiating to the left shoulder and accompanied by diaphoresis.",
        examination: isAr ? "الوعي كامل، يعاني من القلق والتعرق. المؤشرات الحيوية: الضغط 150/95، النبض 105، الحرارة 36.8، الأكسجين 94%." : "Conscious, anxious, and diaphoretic. Vitals: BP 150/95, HR 105 bpm, Temp 36.8°C, SpO2 94% on room air.",
        investigations: isAr ? "رسم القلب الكهربائي يظهر تغيرات في التروية وانقلاب موجة T في اتجاه V1-V4. فحص إنزيمات القلب Troponin قيد الانتظار." : "ECG shows ischemic T-wave inversions in V1-V4. Troponin test ordered and pending.",
        plan: isAr ? "إعطاء أسبرين 300 ملغ مضغاً، وإيبوبروفين لتسكين الألم. بدء التنقيط الوريدي والمراقبة القلبية المستمرة." : "Administered Aspirin 300 mg chewing load. Keep on continuous cardiac monitor and establish patency of IV access."
      },
      {
        id: "note-p1-2",
        recordedAt: "25-Jun-2026 09:15 PM",
        author: isAr ? "د. هيثم المنصور" : "Dr. Haitham Al-Mansour",
        role: isAr ? "استشاري أمراض القلب" : "Cardiology Consultant",
        type: "Consultation",
        status: "Co-Signed",
        pmh: isAr ? "ارتفاع ضغط الدم المزمن والسكري النوع الثاني." : "Chronic essential hypertension and Type 2 Diabetes Mellitus.",
        oncologyHistory: isAr ? "لا يوجد تاريخ معروف للإصابة بالأورام." : "No significant oncology or metastatic history.",
        presentation: isAr ? "تم استدعاء استشاري القلب لتقييم ألم الصدر المستمر. تلاشى الألم جزئياً بعد إعطاء النتروجليسرين تحت اللسان." : "Called to evaluate ongoing chest pain. Pain partially resolved following sublingual nitroglycerin administration.",
        examination: isAr ? "الحالة مستقرة ديناميكياً. المؤشرات الحيوية: الضغط 125/82، النبض 80، الحرارة 36.6، الأكسجين 97% على 2 لتر أكسجين." : "Patient is hemodynamically stable. Vitals: BP 125/82, HR 80 bpm, Temp 36.6°C, SpO2 97% on 2L nasal cannula.",
        investigations: isAr ? "تحليل Troponin I إيجابي خفيف (0.12). إعادة فحص الإنزيمات بعد 3 ساعات. رسم القلب مستقر." : "Troponin I is mildly elevated (0.12 ng/mL). Ordered repeat troponin in 3 hours. ECG remains stable.",
        plan: isAr ? "التنويم في وحدة الرعاية المركزة للقلب (CCU). بدء حقن هيبارين تحت الجلد. جدولة قسطرة قلبية استكشافية." : "Admit to Coronary Care Unit (CCU). Initiate low molecular weight heparin (Enoxaparin) 80 mg SC Q12H. Schedule cardiac catheterization."
      }
    ];
  } else if (patientId === "p2") {
    return [
      {
        id: "note-p2-1",
        recordedAt: "24-Jun-2026 10:30 AM",
        author: isAr ? "د. ياسمين ممدوح" : "Dr. Yasmin Mamdouh",
        role: isAr ? "أخصائي باطنة" : "Internal Medicine Specialist",
        type: "Regular",
        status: "Co-Signed",
        pmh: isAr ? "حساسية ربو خفيفة." : "Mild bronchial asthma.",
        oncologyHistory: isAr ? "تاريخ إصابة بسرطان الثدي منتشر للعظام منذ عامين ومستقر على العلاج الهرموني." : "Known case of metastatic breast cancer to bones since 2 years, currently stable on hormonal therapy.",
        presentation: isAr ? "حضرت المريض للمراجعة الدورية تشكو من آلام عظمية عامة خفيفة وإرهاق مستمر مع ضيق بسيط في التنفس." : "Presented for scheduled follow-up, complaining of generalized mild bony aches, ongoing fatigue, and slight dyspnea.",
        examination: isAr ? "العلامات الحيوية مستقرة تماماً. الضغط 120/80، النبض 75، الحرارة 36.5، الصدر: بعض الأزيز البسيط." : "Hemodynamically stable. Vitals: BP 120/80, HR 75 bpm, Temp 36.5°C, Chest shows mild wheeze.",
        investigations: isAr ? "تحليل الدم يظهر أنيميا خفيفة (الهيموجلوبين 10.2). وظائف الكبد والكلى طبيعية." : "Complete blood count shows mild anemia (Hb 10.2 g/dL). Liver and kidney function tests are normal.",
        plan: isAr ? "صرف مسكنات آلام عظمية ومكملات الحديد والكالسيوم. الاستمرار على بخاخ الربو عند اللزوم ومراجعة عيادة الأورام." : "Prescribe bone pain analgesics, iron, and calcium supplements. Continue asthma inhaler as needed and refer to Oncology clinic."
      }
    ];
  } else {
    return [
      {
        id: "note-gen-1",
        recordedAt: "24-Jun-2026 09:00 AM",
        author: isAr ? "د. أحمد يوسف" : "Dr. Ahmed Youssef",
        role: isAr ? "طبيب العيادة" : "Clinic Physician",
        type: "Regular",
        status: "Co-Signed",
        pmh: isAr ? "لا توجد أمراض مزمنة هامة." : "No significant past medical history.",
        oncologyHistory: isAr ? "لا يوجد." : "None.",
        presentation: isAr ? "زيارة دورية للفحص العام واستشارة روتينية." : "Routine clinical visit for general health assessment.",
        examination: isAr ? "المؤشرات الحيوية طبيعية والنبض مستقر." : "Normal vitals, chest clear, heart sounds normal.",
        investigations: isAr ? "نتائج الفحوصات الدورية سليمة بالكامل." : "All routine checkup results within normal limits.",
        plan: isAr ? "الاستمرار على نمط الحياة الصحي والمتابعة بعد 6 أشهر." : "Maintain active lifestyle and repeat checkup in 6 months."
      }
    ];
  }
};

export default function DoctorConsultationDesk({ language, currentUser, systemUsers, departments, onNavigate }: Props) {
  const isAr = language === "ar";
  
  const { patients, updatePatientStatus, updatePatient, prescriptions, addPrescription } = useHIS();
  const queuePatients = patients.filter(p => p.status !== "discharged");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Set first active patient if none selected
  useEffect(() => {
    if (!selectedPatientId && patients.length > 0) {
      const firstActive = patients.find(p => p.status !== "discharged");
      if (firstActive) {
        setSelectedPatientId(firstActive.id);
      }
    }
  }, [patients.length, selectedPatientId]);

  const activePatient = patients.find(p => p.id === selectedPatientId) || queuePatients[0] || null;

  // Active Main Tab
  const [activeTab, setActiveTab] = useState("Overview");
  // Active Notes Tab (SOAP)
  const [noteTab, setNoteTab] = useState("Subjective");

  // States for sequential Clinical Progress Notes & Archive
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState<boolean>(false);
  const [noteSearchQuery, setNoteSearchQuery] = useState("");
  const [noteTypeFilter, setNoteTypeFilter] = useState("All");

  const [newNoteFields, setNewNoteFields] = useState({
    type: "Regular",
    author: "",
    role: "",
    pmh: "",
    oncologyHistory: "",
    presentation: "",
    examination: "",
    investigations: "",
    plan: ""
  });

  // Local state for clinical inputs (synchronized with activePatient)
  const [notesSOAP, setNotesSOAP] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });

  const [vitals, setVitals] = useState({
    bp: "120/80",
    pulse: "78",
    temp: "36.6",
    resp: "18",
    spo2: "98",
    weight: "82",
    height: "175"
  });

  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [chronicDiseases, setChronicDiseases] = useState<string[]>([]);
  const [complaints, setComplaints] = useState({
    chiefComplaint: "",
    presentIllness: ""
  });

  const [complaintsHistory, setComplaintsHistory] = useState<any[]>([]);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [notesSOAPHistory, setNotesSOAPHistory] = useState<any[]>([]);

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    title: string;
    type: "complaint" | "vital" | "soap" | "diagnosis" | "order" | "prescription" | "generic";
    data: any;
  }>({
    isOpen: false,
    title: "",
    type: "generic",
    data: null
  });

  // UI State toggles for adding elements
  const [isAddDiagOpen, setIsAddDiagOpen] = useState(false);
  const [newDiagCode, setNewDiagCode] = useState("");
  const [newDiagDesc, setNewDiagDesc] = useState("");
  const [newDiagType, setNewDiagType] = useState<"primary" | "comorbidity">("primary");

  const [isAddDrugOpen, setIsAddDrugOpen] = useState(false);
  const [newDrugName, setNewDrugName] = useState("");
  const [newDrugDose, setNewDrugDose] = useState("");
  const [newDrugSig, setNewDrugSig] = useState("");
  const [newDrugQty, setNewDrugQty] = useState(1);

  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [newOrderType, setNewOrderType] = useState<"LAB" | "RAD" | "PROC">("LAB");
  const [newOrderName, setNewOrderName] = useState("");

  const [isAddAllergyOpen, setIsAddAllergyOpen] = useState(false);
  const [newAllergyName, setNewAllergyName] = useState("");

  const [isAddChronicOpen, setIsAddChronicOpen] = useState(false);
  const [newChronicName, setNewChronicName] = useState("");

  const [isEditVitalsOpen, setIsEditVitalsOpen] = useState(false);

  // Memoized Timeline Events Assembler (Chronological Event Reel)
  const timelineEvents = React.useMemo(() => {
    const events: any[] = [];

    // 1. Clinical Progress Notes (clinicalNotes)
    if (Array.isArray(clinicalNotes)) {
      clinicalNotes.forEach((n, idx) => {
        events.push({
          id: `timeline-note-${n.id || idx}`,
          type: "clinical-note",
          titleAr: `ملاحظة سريرية - ${n.type || "دورية"}`,
          titleEn: `Clinical Progress Note - ${n.type || "Regular"}`,
          descAr: n.presentation || "",
          descEn: n.presentation || "",
          timestamp: n.recordedAt,
          author: n.author || (isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid"),
          role: n.role || (isAr ? "طبيب مقيم" : "Resident"),
          color: n.type === "Emergency" ? "rose" : n.type === "Consultation" ? "purple" : "emerald",
          icon: "FileText",
          originalType: "soap",
          data: {
            subjective: n.presentation,
            objective: n.examination || (isAr ? "الفحص السريري العام مستقر" : "General physical exam stable"),
            assessment: n.pmh || (isAr ? "التاريخ الطبي وتاريخ السوابق" : "Prior history and symptoms"),
            plan: n.plan,
            author: n.author,
            role: n.role,
            recordedAt: n.recordedAt
          }
        });
      });
    }

    // 2. SOAP Notes History (notesSOAPHistory)
    if (Array.isArray(notesSOAPHistory)) {
      notesSOAPHistory.forEach((n, idx) => {
        events.push({
          id: `timeline-soap-hist-${n.id || idx}`,
          type: "soap-note",
          titleAr: "تقرير طبي (SOAP)",
          titleEn: "SOAP Progress Note",
          descAr: n.subjective || "",
          descEn: n.subjective || "",
          timestamp: n.recordedAt || "25-Jun-2026 10:00 AM",
          author: n.author || (isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid"),
          role: n.role || (isAr ? "طبيب مقيم" : "Resident"),
          color: "indigo",
          icon: "FileText",
          originalType: "soap",
          data: {
            subjective: n.subjective,
            objective: n.objective,
            assessment: n.assessment,
            plan: n.plan,
            author: n.author || (isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid"),
            role: n.role || (isAr ? "طبيب مقيم" : "Resident"),
            recordedAt: n.recordedAt || "25-Jun-2026 10:00 AM"
          }
        });
      });
    }

    // 3. Vitals Records (vitalsHistory)
    if (Array.isArray(vitalsHistory)) {
      vitalsHistory.forEach((v, idx) => {
        events.push({
          id: `timeline-vital-${v.id || idx}`,
          type: "vitals",
          titleAr: "تسجيل المؤشرات الحيوية والوزن",
          titleEn: "Vitals & BMI Recorded",
          descAr: `الضغط: ${v.bp} mmHg • النبض: ${v.pulse} bpm • الحرارة: ${v.temp} °C • الأكسجين: ${v.spo2}%`,
          descEn: `BP: ${v.bp} mmHg • PR: ${v.pulse} bpm • Temp: ${v.temp} °C • SpO2: ${v.spo2}%`,
          timestamp: v.recordedAt,
          author: v.author || (isAr ? "سارة أحمد" : "Sarah Ahmed"),
          role: isAr ? "تمريض الطوارئ" : "ER Nurse",
          color: "amber",
          icon: "Activity",
          originalType: "vital",
          data: v
        });
      });
    }

    // 4. Current Vitals (as live active session)
    if (vitals && vitals.bp) {
      events.push({
        id: "timeline-vital-current",
        type: "vitals",
        titleAr: "العلامات الحيوية النشطة للجلسة الحالية",
        titleEn: "Active Session Vitals Monitor",
        descAr: `الضغط: ${vitals.bp} mmHg • النبض: ${vitals.pulse} bpm • الحرارة: ${vitals.temp} °C • الأكسجين: ${vitals.spo2}%`,
        descEn: `BP: ${vitals.bp} mmHg • PR: ${vitals.pulse} bpm • Temp: ${vitals.temp} °C • SpO2: ${vitals.spo2}%`,
        timestamp: "Today (Live)",
        author: isAr ? "نظام رصد المريض" : "Live Monitor Node",
        role: isAr ? "تحديث مستمر" : "Auto telemetry",
        color: "rose",
        icon: "Zap",
        originalType: "vital",
        data: {
          ...vitals,
          recordedAt: "Today (Live)",
          author: isAr ? "نظام رصد المريض" : "Live Monitor Node"
        }
      });
    }

    // 5. Diagnoses (diagnoses)
    if (Array.isArray(diagnoses)) {
      diagnoses.forEach((d, idx) => {
        events.push({
          id: `timeline-diag-${idx}`,
          type: "diagnosis",
          titleAr: `تشخيص معتمد: ${d.code}`,
          titleEn: `Confirmed Diagnosis: ${d.code}`,
          descAr: `${d.desc} (${d.type === "primary" ? "رئيسي" : "مرافق"})`,
          descEn: `${d.desc} (${d.type === "primary" ? "Primary" : "Secondary"})`,
          timestamp: d.recordedAt || "25-Jun-2026",
          author: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid",
          role: isAr ? "طبيب معالج" : "Attending Physician",
          color: "emerald",
          icon: "Activity",
          originalType: "diagnosis",
          data: {
            ...d,
            recordedAt: d.recordedAt || "25-Jun-2026"
          }
        });
      });
    }

    // 6. Orders (orders)
    if (Array.isArray(orders)) {
      orders.forEach((o, idx) => {
        events.push({
          id: `timeline-order-${o.id || idx}`,
          type: "order",
          titleAr: `طلب استقصاء: ${o.type === "LAB" ? "مختبر" : o.type === "RAD" ? "أشعة" : "إجراء"}`,
          titleEn: `Investigation Requested: ${o.type === "LAB" ? "Lab" : o.type === "RAD" ? "Radiology" : "Procedure"}`,
          descAr: `${o.name} • الحالة: ${o.status}`,
          descEn: `${o.name} • Status: ${o.status}`,
          timestamp: o.date || "25-Jun-2026",
          author: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid",
          role: isAr ? "طبيب معالج" : "Attending Physician",
          color: "blue",
          icon: "Beaker",
          originalType: "order",
          data: {
            ...o,
            clinician: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid",
            priority: "Routine",
            instructions: isAr ? "تحليل صائم أو فحص سريع بالتنسيق مع قسم الاستقبال." : "Fasting sample or rapid screen with radiology reception desk."
          }
        });
      });
    }

    // 7. Prescriptions (derived locally from prescriptions state)
    const localPatientPrescriptions = Array.isArray(prescriptions)
      ? prescriptions.filter((p) => p.patientId === (activePatient?.id || ""))
      : [];

    localPatientPrescriptions.forEach((p, idx) => {
      events.push({
        id: `timeline-rx-${p.id || idx}`,
        type: "prescription",
        titleAr: `صرف دواء: ${p.medication}`,
        titleEn: `Rx Prescribed: ${p.medication}`,
        descAr: `الجرعة: ${p.dose} • الكمية: ${p.qty} عبوة • الحالة: ${p.status}`,
        descEn: `Dosage: ${p.dose} • Qty: ${p.qty} • Status: ${p.status}`,
        timestamp: p.date || "25-Jun-2026",
        author: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid",
        role: isAr ? "طبيب معالج" : "Attending Physician",
        color: "indigo",
        icon: "Pill",
        originalType: "prescription",
        data: {
          ...p,
          sig: isAr ? "قرص واحد يومياً بعد الطعام" : "1 tablet daily after meal",
          refills: 0,
          warning: isAr ? "يرجى مراقبة وظائف الكلى عند الاستخدام الطويل." : "Monitor renal function on prolonged use."
        }
      });
    });

    // 8. Complaints History (complaintsHistory)
    if (Array.isArray(complaintsHistory)) {
      complaintsHistory.forEach((c, idx) => {
        events.push({
          id: `timeline-comp-${c.id || idx}`,
          type: "complaint",
          titleAr: "توثيق شكوى رئيسية سابقة",
          titleEn: "Chief Complaint Documented",
          descAr: c.chiefComplaint || "",
          descEn: c.chiefComplaint || "",
          timestamp: c.recordedAt,
          author: c.author || (isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid"),
          role: isAr ? "طبيب طوارئ" : "ER Physician",
          color: "teal",
          icon: "HeartPulse",
          originalType: "complaint",
          data: c
        });
      });
    }

    // Sort them chronological: latest events first
    const parseDate = (dStr: string) => {
      if (!dStr || dStr.includes("Live") || dStr.includes("Today")) return Infinity; // Put live first
      const cleaned = dStr.replace(/-/g, ' ');
      return new Date(cleaned).getTime() || 0;
    };

    return events.sort((a, b) => parseDate(b.timestamp) - parseDate(a.timestamp));
  }, [clinicalNotes, notesSOAPHistory, vitalsHistory, vitals, diagnoses, orders, prescriptions, activePatient, complaintsHistory, isAr]);

  // Sync state when active patient changes
  useEffect(() => {
    if (activePatient) {
      // 1. SOAP Notes
      setNotesSOAP({
        subjective: activePatient.notesSOAP?.subjective || (isAr ? "ألم شديد في الصدر وضيق في التنفس عند بذل مجهود منذ يومين." : "Severe chest pain and shortness of breath on exertion since 2 days."),
        objective: activePatient.notesSOAP?.objective || (isAr ? "الضغط: 120/80، النبض: 78، الحرارة: 36.6، الأكسجين: 98%" : "BP: 120/80, Pulse: 78, Temp: 36.6 °C, SpO2: 98%"),
        assessment: activePatient.notesSOAP?.assessment || (isAr ? "ذبحة صدرية غير محددة. ارتفاع ضغط الدم الأساسي." : "Angina pectoris, unspecified. Essential hypertension."),
        plan: activePatient.notesSOAP?.plan || (isAr ? "أسبرين 81 ملغ يومياً، أتورفاستاتين 20 ملغ يومياً. طلب تخطيط قلب وفحص دم شامل." : "Aspirin 81 mg daily, Atorvastatin 20 mg daily. Order ECG and CBC.")
      });

      // 2. Vitals
      setVitals({
        bp: activePatient.vitals?.bp || "120/80",
        pulse: activePatient.vitals?.pulse || "78",
        temp: activePatient.vitals?.temp || "36.6",
        resp: activePatient.vitals?.resp || "18",
        spo2: activePatient.vitals?.spo2 || "98",
        weight: activePatient.vitals?.weight || "82",
        height: activePatient.vitals?.height || "175"
      });

      // 3. Diagnoses
      setDiagnoses(activePatient.diagnoses || [
        { code: "I20.9", desc: isAr ? "ذبحة صدرية، غير محددة" : "Angina pectoris, unspecified", type: "primary" },
        { code: "I10", desc: isAr ? "ارتفاع ضغط الدم الأساسي" : "Essential (primary) hypertension", type: "comorbidity" }
      ]);

      // 4. Orders
      setOrders(activePatient.orders || [
        { id: "o1", type: "LAB", name: isAr ? "صورة دم كاملة (CBC)" : "Complete Blood Count (CBC)", status: "Ordered", date: "20 May 2024 09:20 AM" },
        { id: "o2", type: "RAD", name: isAr ? "أشعة سينية على الصدر" : "Chest X-Ray", status: "Scheduled", date: "20 May 2024 09:25 AM" }
      ]);

      // 5. Complaints
      setComplaints({
        chiefComplaint: activePatient.complaints?.chiefComplaint || (isAr ? "ألم صدري مستمر" : "Persistent chest pain"),
        presentIllness: activePatient.complaints?.presentIllness || (isAr ? "بدأ الألم منذ يومين بشكل ضاغط يزداد مع الحركة ويتحسن بالراحة." : "The pain started 2 days ago as a heavy pressure radiating to the left arm, exacerbated by exertion.")
      });

      // 6. Allergies
      setAllergies(activePatient.allergies || ["Penicillin", "Aspirin"]);

      // 7. Chronic Diseases
      setChronicDiseases(activePatient.chronicDiseases || ["Hypertension", "Diabetes Mellitus Type 2"]);

      // 8. Sequential Clinical Notes Sync
      const initialNotes = activePatient.clinicalNotes || getInitialNotesForPatient(activePatient.id, isAr);
      setClinicalNotes(initialNotes);
      
      if (initialNotes.length > 0) {
        if (!selectedNoteId || !initialNotes.some((n: any) => n.id === selectedNoteId)) {
          setSelectedNoteId(initialNotes[0].id);
          setIsCreatingNote(false);
        }
      } else {
        setSelectedNoteId(null);
        setIsCreatingNote(true);
      }

      // 9. Histories
      const defaultCompHist = [
        {
          id: "comp-default",
          chiefComplaint: isAr ? "ألم صدري مستمر" : "Persistent chest pain",
          presentIllness: isAr ? "بدأ الألم منذ يومين بشكل ضاغط يزداد مع الحركة ويتحسن بالراحة." : "The pain started 2 days ago as a heavy pressure radiating to the left arm, exacerbated by exertion.",
          recordedAt: isAr ? "٢٠ مايو ٢٠٢٤، ١٠:٠٠ ص" : "20 May 2024, 10:00 AM",
          author: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid"
        }
      ];
      setComplaintsHistory(activePatient.complaintsHistory || defaultCompHist);

      const defaultVitHist = [
        {
          id: "vit-default",
          bp: activePatient.vitals?.bp || "120/80",
          pulse: activePatient.vitals?.pulse || "78",
          temp: activePatient.vitals?.temp || "36.6",
          resp: activePatient.vitals?.resp || "18",
          spo2: activePatient.vitals?.spo2 || "98",
          weight: activePatient.vitals?.weight || "82",
          height: activePatient.vitals?.height || "175",
          recordedAt: isAr ? "٢٠ مايو ٢٠٢٤، ١٠:٠٠ ص" : "20 May 2024, 10:00 AM",
          author: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid"
        }
      ];
      setVitalsHistory(activePatient.vitalsHistory || defaultVitHist);

      const defaultSoapHist = [
        {
          id: "soap-default",
          subjective: activePatient.notesSOAP?.subjective || (isAr ? "ألم شديد في الصدر وضيق في التنفس عند بذل مجهود منذ يومين." : "Severe chest pain and shortness of breath on exertion since 2 days."),
          objective: activePatient.notesSOAP?.objective || (isAr ? "الضغط: 120/80، النبض: 78، الحرارة: 36.6، الأكسجين: 98%" : "BP: 120/80, Pulse: 78, Temp: 36.6 °C, SpO2: 98%"),
          assessment: activePatient.notesSOAP?.assessment || (isAr ? "ذبحة صدرية غير محددة. ارتفاع ضغط الدم الأساسي." : "Angina pectoris, unspecified. Essential hypertension."),
          plan: activePatient.notesSOAP?.plan || (isAr ? "أسبرين 81 ملغ يومياً، أتورفاستاتين 20 ملغ يومياً. طلب تخطيط قلب وفحص دم شامل." : "Aspirin 81 mg daily, Atorvastatin 20 mg daily. Order ECG and CBC."),
          recordedAt: isAr ? "٢٠ مايو ٢٠٢٤، ١٠:٠٠ ص" : "20 May 2024, 10:00 AM",
          author: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid"
        }
      ];
      setNotesSOAPHistory(activePatient.notesSOAPHistory || defaultSoapHist);
    }
  }, [selectedPatientId, activePatient, isAr]);

  // Pre-populate author/role info based on currently logged in user
  useEffect(() => {
    if (currentUser) {
      setNewNoteFields(prev => ({
        ...prev,
        author: isAr ? (currentUser.nameAr || currentUser.nameEn) : (currentUser.nameEn || currentUser.nameAr),
        role: isAr ? (currentUser.role === "admin" ? "طبيب استشاري" : "طبيب معالج") : (currentUser.role === "admin" ? "Consultant" : "Specialist")
      }));
    } else {
      setNewNoteFields(prev => ({
        ...prev,
        author: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid",
        role: isAr ? "طبيب مقيم طوارئ" : "ER Resident"
      }));
    }
  }, [currentUser, isAr]);

  // Save specific section helper
  const handleSavePatientSection = async (sectionKey: string, sectionData: any, successMessage: string) => {
    if (!activePatient) return;
    try {
      await updatePatient(activePatient.id, {
        [sectionKey]: sectionData
      });
      toast.success(successMessage);
    } catch (e: any) {
      toast.error(isAr ? "فشل حفظ البيانات" : "Failed to save data: " + e.message);
    }
  };

  // 1. Save SOAP Notes
  const handleSaveSOAP = async () => {
    if (!activePatient) return;
    try {
      const author = currentUser 
        ? (isAr ? (currentUser.nameAr || currentUser.nameEn) : (currentUser.nameEn || currentUser.nameAr))
        : (isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid");
      
      const newHistoryEntry = {
        id: "soap-" + Date.now(),
        ...notesSOAP,
        recordedAt: new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        author: author
      };

      const updatedHistory = [newHistoryEntry, ...(activePatient.notesSOAPHistory || [])];

      await updatePatient(activePatient.id, {
        notesSOAP: notesSOAP,
        notesSOAPHistory: updatedHistory
      });

      toast.success(isAr ? "تم حفظ الملاحظات الطبية (SOAP) وأرشفتها في السجل السريري" : "SOAP notes saved and archived in clinical history successfully");
    } catch (e: any) {
      toast.error(isAr ? "فشل حفظ الملاحظات" : "Failed to save SOAP notes: " + e.message);
    }
  };

  const handleSaveNewProgressNote = async () => {
    if (!newNoteFields.presentation.trim() && !newNoteFields.plan.trim()) {
      return toast.error(isAr ? "يرجى كتابة تفاصيل الحالة أو الخطة العلاجية قبل الحفظ" : "Please fill in Presentation or Treatment Plan details before saving");
    }

    const newNote: ClinicalNote = {
      id: "note-" + Date.now(),
      recordedAt: new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      author: newNoteFields.author.trim() || (isAr ? "طبيب مجهول" : "Unknown Doctor"),
      role: newNoteFields.role.trim() || (isAr ? "طبيب العيادة" : "Clinic Doctor"),
      type: newNoteFields.type,
      status: "Co-Signed",
      pmh: newNoteFields.pmh.trim() || (isAr ? "لا يوجد تاريخ طبي سابق هام" : "No significant past medical history"),
      oncologyHistory: newNoteFields.oncologyHistory.trim() || (isAr ? "لا يوجد تاريخ أورام معروف" : "No oncology history"),
      presentation: newNoteFields.presentation.trim(),
      examination: newNoteFields.examination.trim() || (isAr ? "المؤشرات الحيوية مستقرة" : "Vital signs stable"),
      investigations: newNoteFields.investigations.trim() || (isAr ? "لم تطلب فحوصات إضافية" : "No pending investigations requested"),
      plan: newNoteFields.plan.trim()
    };

    const updatedNotes = [newNote, ...clinicalNotes];
    setClinicalNotes(updatedNotes);

    // Also synchronise the legacy SOAP notes so that the overview tab stays perfectly in-sync!
    const legacySOAP = {
      subjective: newNote.presentation,
      objective: newNote.examination,
      assessment: `${isAr ? "التاريخ المرضي:" : "PMH:"} ${newNote.pmh} | ${isAr ? "الأورام:" : "Oncology:"} ${newNote.oncologyHistory}`,
      plan: newNote.plan
    };
    setNotesSOAP(legacySOAP);

    if (activePatient) {
      try {
        await updatePatient(activePatient.id, {
          clinicalNotes: updatedNotes,
          notesSOAP: legacySOAP
        });
        toast.success(isAr ? "تم حفظ وأرشفة الملاحظة السريرية بنجاح" : "Clinical progress note saved & archived successfully");
        
        // Reset form except author/role
        setNewNoteFields(prev => ({
          ...prev,
          pmh: "",
          oncologyHistory: "",
          presentation: "",
          examination: "",
          investigations: "",
          plan: ""
        }));
        setSelectedNoteId(newNote.id);
        setIsCreatingNote(false);
      } catch (e: any) {
        toast.error(isAr ? "فشل حفظ الملاحظة السريرية" : "Failed to save progress note: " + e.message);
      }
    }
  };

  const handleDeleteProgressNote = async (noteId: string) => {
    const updatedNotes = clinicalNotes.filter(n => n.id !== noteId);
    setClinicalNotes(updatedNotes);
    if (activePatient) {
      try {
        await updatePatient(activePatient.id, {
          clinicalNotes: updatedNotes
        });
        toast.success(isAr ? "تم حذف الملاحظة السريرية بنجاح" : "Clinical note deleted successfully");
        if (updatedNotes.length > 0) {
          setSelectedNoteId(updatedNotes[0].id);
        } else {
          setSelectedNoteId(null);
          setIsCreatingNote(true);
        }
      } catch (e: any) {
        toast.error(isAr ? "فشل حذف الملاحظة" : "Failed to delete note: " + e.message);
      }
    }
  };

  const handleToggleArchiveProgressNote = async (noteId: string) => {
    const updatedNotes = clinicalNotes.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          status: n.status === "Archived" ? "Co-Signed" : "Archived"
        };
      }
      return n;
    });
    setClinicalNotes(updatedNotes);
    if (activePatient) {
      try {
        await updatePatient(activePatient.id, {
          clinicalNotes: updatedNotes
        });
        const note = updatedNotes.find(n => n.id === noteId);
        const isArchivedNow = note?.status === "Archived";
        toast.success(isAr 
          ? (isArchivedNow ? "تم نقل الملاحظة إلى الأرشيف بنجاح" : "تم استعادة الملاحظة من الأرشيف") 
          : (isArchivedNow ? "Note moved to archive successfully" : "Note restored from archive successfully")
        );
      } catch (e: any) {
        toast.error(isAr ? "فشل تعديل حالة الأرشفة" : "Failed to toggle archive status: " + e.message);
      }
    }
  };

  // 2. Save Vitals
  const handleSaveVitals = async () => {
    if (!activePatient) return;
    try {
      const author = currentUser 
        ? (isAr ? (currentUser.nameAr || currentUser.nameEn) : (currentUser.nameEn || currentUser.nameAr))
        : (isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid");
      
      const newHistoryEntry = {
        id: "vit-" + Date.now(),
        ...vitals,
        recordedAt: new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        author: author
      };

      const updatedHistory = [newHistoryEntry, ...(activePatient.vitalsHistory || [])];

      await updatePatient(activePatient.id, {
        vitals: vitals,
        vitalsHistory: updatedHistory
      });

      toast.success(isAr ? "تم تحديث المؤشرات الحيوية وأرشفتها بنجاح" : "Vitals updated and archived in history successfully");
      setIsEditVitalsOpen(false);
    } catch (e: any) {
      toast.error(isAr ? "فشل تحديث المؤشرات الحيوية" : "Failed to update vitals: " + e.message);
    }
  };

  // 3. Add & Delete Diagnosis
  const handleAddDiagnosis = () => {
    if (!newDiagCode || !newDiagDesc) {
      return toast.error(isAr ? "يرجى تعبئة رمز وتفاصيل التشخيص" : "Please fill Diagnosis Code and Description");
    }
    const updated = [...diagnoses, { code: newDiagCode, desc: newDiagDesc, type: newDiagType }];
    setDiagnoses(updated);
    handleSavePatientSection("diagnoses", updated, isAr ? "تم إضافة التشخيص" : "Diagnosis added successfully");
    setNewDiagCode("");
    setNewDiagDesc("");
    setIsAddDiagOpen(false);
  };

  const handleDeleteDiagnosis = (index: number) => {
    const updated = diagnoses.filter((_, i) => i !== index);
    setDiagnoses(updated);
    handleSavePatientSection("diagnoses", updated, isAr ? "تم حذف التشخيص" : "Diagnosis deleted successfully");
  };

  // 4. Add & Delete Order
  const handleAddOrder = () => {
    if (!newOrderName) {
      return toast.error(isAr ? "يرجى كتابة اسم الفحص أو الإجراء" : "Please enter Order/Investigation Name");
    }
    const newOrder = {
      id: "o-" + Date.now(),
      type: newOrderType,
      name: newOrderName,
      status: "Ordered",
      date: new Date().toLocaleString()
    };
    const updated = [...orders, newOrder];
    setOrders(updated);
    handleSavePatientSection("orders", updated, isAr ? "تم إرسال طلب الفحص بنجاح" : "Order requested successfully");
    setNewOrderName("");
    setIsAddOrderOpen(false);
  };

  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    handleSavePatientSection("orders", updated, isAr ? "تم إلغاء الفحص" : "Order canceled successfully");
  };

  // 5. Prescriptions (linked with actual useHIS Context!)
  const patientPrescriptions = prescriptions.filter(p => p.patientId === (activePatient?.id || ""));

  const handleAddPrescription = async () => {
    if (!newDrugName || !newDrugDose) {
      return toast.error(isAr ? "يرجى تعبئة اسم الدواء والجرعة" : "Please enter Medication Name and Dosage");
    }
    const rx = {
      id: "rx-" + Date.now(),
      patientId: activePatient.id,
      medication: newDrugName,
      dose: newDrugDose,
      qty: newDrugQty,
      status: "pending" as const,
      date: new Date().toLocaleDateString()
    };
    try {
      await addPrescription(rx);
      toast.success(isAr ? "تم إضافة الدواء للوصفة الإلكترونية" : "Medication added to eRx successfully");
      setNewDrugName("");
      setNewDrugDose("");
      setNewDrugSig("");
      setNewDrugQty(1);
      setIsAddDrugOpen(false);
    } catch (e: any) {
      toast.error(isAr ? "فشل إضافة الدواء" : "Failed to add medication: " + e.message);
    }
  };

  // 6. Complaints & History
  const handleSaveComplaints = async () => {
    if (!activePatient) return;
    try {
      const author = currentUser 
        ? (isAr ? (currentUser.nameAr || currentUser.nameEn) : (currentUser.nameEn || currentUser.nameAr))
        : (isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid");
      
      const newHistoryEntry = {
        id: "comp-" + Date.now(),
        chiefComplaint: complaints.chiefComplaint,
        presentIllness: complaints.presentIllness,
        recordedAt: new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        author: author
      };

      const updatedHistory = [newHistoryEntry, ...(activePatient.complaintsHistory || [])];
      
      await updatePatient(activePatient.id, {
        complaints: complaints,
        complaintsHistory: updatedHistory
      });
      
      toast.success(isAr ? "تم حفظ الشكاوى وتوثيقها بالكامل في السجل التاريخي" : "Chief complaints saved and logged in history successfully");
    } catch (e: any) {
      toast.error(isAr ? "فشل حفظ البيانات" : "Failed to save complaints: " + e.message);
    }
  };

  // 7. Allergies & Chronic
  const handleAddAllergy = () => {
    if (!newAllergyName) return;
    const updated = [...allergies, newAllergyName];
    setAllergies(updated);
    handleSavePatientSection("allergies", updated, isAr ? "تم إضافة الحساسية" : "Allergy added");
    setNewAllergyName("");
    setIsAddAllergyOpen(false);
  };

  const handleAddChronic = () => {
    if (!newChronicName) return;
    const updated = [...chronicDiseases, newChronicName];
    setChronicDiseases(updated);
    handleSavePatientSection("chronicDiseases", updated, isAr ? "تم إضافة المرض المزمن" : "Chronic disease added");
    setNewChronicName("");
    setIsAddChronicOpen(false);
  };

  const bmi = vitals.weight && vitals.height ? (Number(vitals.weight) / ((Number(vitals.height) / 100) ** 2)).toFixed(1) : "--";

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Top Banner - Patient Context */}
      <div className="bg-white p-4 sm:p-6 border-b border-slate-200 shrink-0">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-slate-100 shrink-0 shadow-sm">
              <img src={`https://i.pravatar.cc/150?u=${activePatient?.id || "default"}`} alt="Patient Avatar" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="text-xs font-bold text-blue-600 mb-0.5">{activePatient?.mrn || "N/A"}</div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{activePatient ? (isAr ? activePatient.nameAr : activePatient.nameEn) : (isAr ? "لا يوجد مريض محدد" : "No Patient Selected")}</h1>
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <span className="text-xs">{activePatient?.gender === 'female' ? '♀' : '♂'}</span>
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-700 mb-2">
                {activePatient?.age || 0} {isAr ? "سنة" : "Y"} , {activePatient?.gender === 'female' ? (isAr ? "أنثى" : "Female") : (isAr ? "ذكر" : "Male")}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  {isAr ? "السن والولادة" : "DOB Unknown"} ({activePatient?.age || 0} {isAr ? "عاماً" : "YO"})
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-teal-500" />
                  {activePatient?.phone || "N/A"} <span className="bg-rose-100 text-rose-700 px-1 rounded text-[10px] font-bold ml-1">B+</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex gap-6 xl:gap-10">
            <div className="flex flex-col justify-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{isAr ? "الرقم القومي" : "National ID"}</div>
              <div className="text-sm font-bold text-slate-800 mb-2">28705152203551</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{isAr ? "رقم وثيقة التأمين" : "Policy No."}</div>
              <div className="text-sm font-bold text-slate-800">AXA-987654321</div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{isAr ? "جهة الدفع" : "Insurance"}</div>
              <div className="text-sm font-bold text-slate-800">{activePatient?.insurance || "Cash"}</div>
            </div>
          </div>
 
          <div className="hidden xl:flex gap-4">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 w-40 flex flex-col justify-center">
              <div className="text-xs font-bold text-rose-600 mb-2 flex justify-between items-center">
                <span>{isAr ? "الحساسية" : "Allergies"}</span>
                <button onClick={() => setIsAddAllergyOpen(true)} className="text-[10px] bg-rose-200 text-rose-800 font-bold px-1 rounded hover:bg-rose-300">+</button>
              </div>
              <div className="space-y-1 max-h-16 overflow-y-auto">
                {allergies.map((alg, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" /> {alg}
                  </div>
                ))}
              </div>
            </div>
 
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 w-48 flex flex-col justify-center">
              <div className="text-xs font-bold text-blue-600 mb-2 flex justify-between items-center">
                <span>{isAr ? "الأمراض المزمنة" : "Chronic Diseases"}</span>
                <button onClick={() => setIsAddChronicOpen(true)} className="text-[10px] bg-blue-200 text-blue-800 font-bold px-1 rounded hover:bg-blue-300">+</button>
              </div>
              <div className="space-y-1 max-h-16 overflow-y-auto">
                {chronicDiseases.map((chr, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-1 shrink-0"></div> {chr}
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          <div className="flex lg:flex-col justify-end gap-2 shrink-0">
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                <Printer className="w-3.5 h-3.5 text-teal-600" /> {isAr ? "طباعة" : "Print"}
              </button>
              <button onClick={() => toast.success(isAr ? "تم مشاركة الملف" : "Medical file shared")} className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                <Share2 className="w-3.5 h-3.5 text-teal-600" /> {isAr ? "مشاركة" : "Share"}
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 flex items-center gap-6 overflow-x-auto custom-scrollbar border-b border-slate-200">
          {clinicalTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }
                }}
                className={`relative pb-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 focus:outline-none focus:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm
                  ${isActive ? "text-blue-600 font-extrabold border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800"}
                `}
              >
                {isAr ? tab.ar : tab.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column 1: Patient Summary & Active Vitals */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-blue-800 mb-4">{isAr ? "ملخص الحالة الاجتماعية والاتصال" : "Patient Summary"}</h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-xs text-slate-500 col-span-1">{isAr ? "العنوان" : "Address"}</div>
                  <div className="text-xs font-semibold text-slate-800 col-span-2">23 El Nozha St. Nasr City,<br/>Cairo, Egypt</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-xs text-slate-500 col-span-1">{isAr ? "الحالة الاجتماعية" : "Marital Status"}</div>
                  <div className="text-xs font-semibold text-slate-800 col-span-2">{isAr ? "متزوج" : "Married"}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-xs text-slate-500 col-span-1">{isAr ? "المهنة" : "Occupation"}</div>
                  <div className="text-xs font-semibold text-slate-800 col-span-2">{isAr ? "متقاعد" : "Retired"}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-xs text-slate-500 col-span-1">{isAr ? "البريد الإلكتروني" : "Email"}</div>
                  <div className="text-xs font-semibold text-slate-800 col-span-2">ahmed.mali@email.com</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-xs text-slate-500 col-span-1">{isAr ? "جهة الاتصال" : "Primary Contact"}</div>
                  <div className="text-xs font-semibold text-slate-800 col-span-2">Amal Ahmed (Wife)<br/><span className="text-slate-500">+20100 987 6543</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-blue-800 flex items-center gap-1.5">
                  {isAr ? "المؤشرات الحيوية" : "Vitals"} <span className="text-slate-400 text-xs font-normal">(Today 09:15 AM)</span>
                </h3>
                <button onClick={() => setIsEditVitalsOpen(true)} className="text-blue-600 text-xs font-bold border border-blue-200 px-2 py-0.5 rounded hover:bg-blue-50 transition-colors">
                  {isAr ? "تعديل" : "Edit"}
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <HeartPulse className="w-4 h-4 text-rose-500" /> {isAr ? "ضغط الدم" : "Blood Pressure"}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{vitals.bp} <span className="text-xs text-slate-500 font-normal">mmHg</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Activity className="w-4 h-4 text-blue-400" /> {isAr ? "نبض القلب" : "Heart Rate"}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{vitals.pulse} <span className="text-xs text-slate-500 font-normal">bpm</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Wind className="w-4 h-4 text-teal-400" /> {isAr ? "معدل التنفس" : "Respiratory Rate"}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{vitals.resp} <span className="text-xs text-slate-500 font-normal">/min</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Thermometer className="w-4 h-4 text-amber-500" /> {isAr ? "حرارة الجسم" : "Temperature"}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{vitals.temp} <span className="text-xs text-slate-500 font-normal">°C</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Droplets className="w-4 h-4 text-blue-500" /> {isAr ? "الأكسجين" : "Oxygen Saturation"}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{vitals.spo2} <span className="text-xs text-slate-500 font-normal">%</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Scale className="w-4 h-4 text-slate-400" /> {isAr ? "الوزن" : "Weight"}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{vitals.weight} <span className="text-xs text-slate-500 font-normal">Kg</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Scale className="w-4 h-4 text-slate-400" /> {isAr ? "الطول" : "Height"}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{vitals.height} <span className="text-xs text-slate-500 font-normal">cm</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Scale className="w-4 h-4 text-slate-400" /> {isAr ? "مؤشر الكتلة" : "BMI"}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{bmi}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Clinical Details Tabs */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            
            {/* Overview / Clinical Notes / SOAP Notes tab rendering */}
            {activeTab === "Clinical Notes" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 min-h-[500px] flex flex-col flex-1 shadow-sm">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-blue-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    {isAr ? "الملاحظات السريرية المتسلسلة" : "Sequential Clinical Notes"}
                  </h3>
                  
                  <button 
                    onClick={() => setIsCreatingNote(!isCreatingNote)}
                    className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1 transition shadow-sm"
                  >
                    {isCreatingNote ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        {isAr ? "عرض السجل" : "View History"}
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        {isAr ? "إضافة ملاحظة" : "Add Note"}
                      </>
                    )}
                  </button>
                </div>

                {isCreatingNote ? (
                  /* Create New Note Form */
                  <div className="space-y-3 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "الطبيب الكاتب" : "Author"}</label>
                        <input 
                          type="text"
                          value={newNoteFields.author}
                          onChange={(e) => setNewNoteFields(prev => ({ ...prev, author: e.target.value }))}
                          className="w-full p-1.5 border border-slate-250 bg-slate-50 rounded-lg text-xs font-bold focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "نوع الملاحظة" : "Class"}</label>
                        <select 
                          value={newNoteFields.type}
                          onChange={(e) => setNewNoteFields(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full p-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                        >
                          <option value="Regular">{isAr ? "دورية (Regular)" : "Regular"}</option>
                          <option value="Emergency">{isAr ? "طوارئ (Emergency)" : "Emergency"}</option>
                          <option value="Consultation">{isAr ? "استشارة (Consult)" : "Consultation"}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "القصة والشكوى المرضية *" : "Presentation / Complaint *"}</label>
                        <textarea 
                          rows={2}
                          value={newNoteFields.presentation}
                          onChange={(e) => setNewNoteFields(prev => ({ ...prev, presentation: e.target.value }))}
                          placeholder={isAr ? "شكوى المريض الحالية..." : "Active clinical complaints..."}
                          className="w-full p-2 border border-slate-250 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:bg-white bg-slate-50/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "الخطة العلاجية *" : "Treatment Plan *"}</label>
                        <textarea 
                          rows={2}
                          value={newNoteFields.plan}
                          onChange={(e) => setNewNoteFields(prev => ({ ...prev, plan: e.target.value }))}
                          placeholder={isAr ? "التوصيات والأدوية المقررة..." : "Medication and recommendation plan..."}
                          className="w-full p-2 border border-slate-250 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:bg-white bg-slate-50/50 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "التاريخ الطبي" : "PMH"}</label>
                        <textarea 
                          rows={1}
                          value={newNoteFields.pmh}
                          onChange={(e) => setNewNoteFields(prev => ({ ...prev, pmh: e.target.value }))}
                          className="w-full p-1.5 border border-slate-250 rounded-lg text-[10px] outline-none"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "الفحص السريري" : "Physical Exam"}</label>
                        <textarea 
                          rows={1}
                          value={newNoteFields.examination}
                          onChange={(e) => setNewNoteFields(prev => ({ ...prev, examination: e.target.value }))}
                          className="w-full p-1.5 border border-slate-250 rounded-lg text-[10px] outline-none"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "الفحوصات" : "Investigations"}</label>
                        <textarea 
                          rows={1}
                          value={newNoteFields.investigations}
                          onChange={(e) => setNewNoteFields(prev => ({ ...prev, investigations: e.target.value }))}
                          className="w-full p-1.5 border border-slate-250 rounded-lg text-[10px] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                      <button 
                        onClick={() => setIsCreatingNote(false)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                      >
                        {isAr ? "إلغاء" : "Cancel"}
                      </button>
                      <button 
                        onClick={handleSaveNewProgressNote}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-1 shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {isAr ? "حفظ الملاحظة" : "Save Note"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Timeline View Mode with Filters and Search */
                  <div className="space-y-3 flex-1 flex flex-col">
                    
                    {/* Search & Filters */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="text"
                          value={noteSearchQuery}
                          onChange={(e) => setNoteSearchQuery(e.target.value)}
                          placeholder={isAr ? "بحث في الملاحظات..." : "Search notes..."}
                          className="w-full pl-7 pr-2 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <select
                        value={noteTypeFilter}
                        onChange={(e) => setNoteTypeFilter(e.target.value)}
                        className="p-1.5 border border-slate-200 bg-white rounded-lg text-[11px] font-bold outline-none"
                      >
                        <option value="All">{isAr ? "الكل (نشط)" : "All (Active)"}</option>
                        <option value="Regular">{isAr ? "دورية" : "Regular"}</option>
                        <option value="Emergency">{isAr ? "طوارئ" : "Emergency"}</option>
                        <option value="Consultation">{isAr ? "استشارة" : "Consultation"}</option>
                        <option value="Archived">{isAr ? "الأرشيف" : "Archived"}</option>
                      </select>
                    </div>

                    {/* Timeline List */}
                    <div className="flex-1 overflow-y-auto max-h-[380px] custom-scrollbar space-y-3 pr-1 relative">
                      <div className="absolute top-2 bottom-2 left-3 w-0.5 bg-slate-100 -z-10" />

                      {(() => {
                        const filtered = clinicalNotes.filter((note) => {
                          const matchesSearch = 
                            note.author.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
                            note.presentation.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
                            (note.plan && note.plan.toLowerCase().includes(noteSearchQuery.toLowerCase()));

                          if (noteTypeFilter === "All") {
                            return matchesSearch && note.status !== "Archived";
                          }
                          if (noteTypeFilter === "Archived") {
                            return matchesSearch && note.status === "Archived";
                          }
                          return matchesSearch && note.type === noteTypeFilter && note.status !== "Archived";
                        });

                        // Chronological sorting: newest first (sequential order indicator)
                        const sorted = [...filtered].sort((a, b) => {
                          const dateA = new Date(a.recordedAt?.replace(/-/g, ' ') || '').getTime() || 0;
                          const dateB = new Date(b.recordedAt?.replace(/-/g, ' ') || '').getTime() || 0;
                          return dateB - dateA;
                        });

                        if (sorted.length === 0) {
                          return (
                            <div className="text-center py-8 text-xs text-slate-400 italic">
                              {isAr ? "لا توجد ملاحظات سريرية مطابقة" : "No clinical progress notes found."}
                            </div>
                          );
                        }

                        return sorted.map((note) => {
                          const isExpanded = selectedNoteId === note.id;
                          const isNoteArchived = note.status === "Archived";
                          return (
                            <div 
                              key={note.id}
                              className={`p-3 border rounded-xl transition-all relative bg-white text-right ${
                                isExpanded ? 'border-blue-300 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {/* Header */}
                              <div 
                                className="flex justify-between items-start mb-1 cursor-pointer outline-none focus:ring-2 focus:ring-blue-300 rounded p-1 transition-all" 
                                onClick={() => setSelectedNoteId(isExpanded ? null : note.id)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedNoteId(isExpanded ? null : note.id);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                                    note.type === "Emergency" ? "bg-rose-500 animate-pulse" :
                                    note.type === "Consultation" ? "bg-purple-500" : "bg-emerald-500"
                                  }`} />
                                  <div className="text-right">
                                    <div className="text-xs font-black text-slate-800">{note.author}</div>
                                    <div className="text-[10px] text-slate-400 font-semibold">{note.role} • {note.recordedAt}</div>
                                  </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                                    note.type === "Emergency" ? "bg-rose-100 text-rose-800" :
                                    note.type === "Consultation" ? "bg-purple-100 text-purple-800" :
                                    "bg-emerald-100 text-emerald-800"
                                  }`}>
                                    {note.type}
                                  </span>
                                  {isNoteArchived && (
                                    <span className="text-[8px] font-black bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                                      {isAr ? "مؤرشف" : "Archived"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Minimal or Expanded Content */}
                              <div className="mt-2 text-xs text-slate-600 space-y-1.5 pl-4 text-right">
                                <p className={`font-medium leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                                  <strong className="text-slate-700">{isAr ? "شكوى وتفاصيل الحالة: " : "Presentation: "}</strong>
                                  {note.presentation}
                                </p>

                                {isExpanded && (
                                  <>
                                    {note.pmh && (
                                      <p className="border-t border-slate-50 pt-1">
                                        <strong className="text-slate-700">{isAr ? "التاريخ المرضي (PMH): " : "PMH: "}</strong>
                                        {note.pmh}
                                      </p>
                                    )}
                                    {note.examination && (
                                      <p>
                                        <strong className="text-slate-700">{isAr ? "الفحص السريري: " : "Physical Exam: "}</strong>
                                        {note.examination}
                                      </p>
                                    )}
                                    {note.investigations && (
                                      <p>
                                        <strong className="text-slate-700">{isAr ? "الاستقصاءات والنتائج: " : "Investigations: "}</strong>
                                        {note.investigations}
                                      </p>
                                    )}
                                    <p className="border-t border-slate-100 pt-1.5 font-bold text-emerald-700 bg-emerald-50/30 p-2 rounded-lg">
                                      <strong className="text-emerald-800">{isAr ? "الخطة والتعليمات: " : "Treatment Plan: "}</strong>
                                      {note.plan}
                                    </p>

                                    {/* Actions Row */}
                                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-50 text-[10px]">
                                      <button 
                                        onClick={() => {
                                          setDetailModal({
                                            isOpen: true,
                                            title: isAr ? "تفاصيل التقرير الطبي والتشخيص السريري الكامل" : "Detailed Clinical Report View",
                                            type: "soap",
                                            data: {
                                              subjective: note.presentation,
                                              objective: note.examination || (isAr ? "الفحص السريري العام مستقر" : "General physical exam stable"),
                                              assessment: note.pmh || (isAr ? "التاريخ الطبي وتاريخ السوابق" : "Prior history and symptoms"),
                                              plan: note.plan,
                                              author: note.author,
                                              role: note.role,
                                              recordedAt: note.recordedAt
                                            }
                                          });
                                        }}
                                        className="text-blue-600 hover:text-blue-800 border border-blue-100 px-2 py-1 rounded bg-blue-50 flex items-center gap-0.5"
                                      >
                                        <Eye className="w-3 h-3" />
                                        {isAr ? "تفاصيل التقرير" : "Full Report"}
                                      </button>
                                      <button 
                                        onClick={() => handleToggleArchiveProgressNote(note.id)}
                                        className="text-slate-500 hover:text-slate-700 border border-slate-200 px-2 py-1 rounded bg-slate-50 flex items-center gap-0.5"
                                      >
                                        <Download className="w-3 h-3" />
                                        {isNoteArchived ? (isAr ? "إلغاء الأرشفة" : "Unarchive") : (isAr ? "أرشفة" : "Archive")}
                                      </button>
                                      <button 
                                        onClick={() => {
                                          if (confirm(isAr ? "حذف هذه الملاحظة نهائياً؟" : "Confirm delete note?")) {
                                            handleDeleteProgressNote(note.id);
                                          }
                                        }}
                                        className="text-rose-600 hover:text-rose-800 border border-rose-100 px-2 py-1 rounded bg-rose-50"
                                      >
                                        {isAr ? "حذف" : "Delete"}
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Timeline" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm flex-1 flex flex-col">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2" dir={isAr ? "rtl" : "ltr"}>
                  <div>
                    <h3 className="text-sm font-extrabold text-blue-800 flex items-center gap-1.5">
                      <History className="w-4 h-4 text-blue-600 animate-pulse" />
                      {isAr ? "فيلم الأحداث والزمن السريري المتكامل (Event Stream)" : "Comprehensive Clinical Event Timeline (Event Stream)"}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {isAr ? "تسجيل تيار الأحداث والتدخلات السريرية بالثانية والمسؤول دون مسح للأرشيف" : "Chronological ledger of clinical interactions with timestamps & responsible clinician"}
                    </p>
                  </div>
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black px-2.5 py-1 rounded-full shrink-0">
                    {timelineEvents.length} {isAr ? "أحداث مسجلة" : "Events Logged"}
                  </span>
                </div>

                {/* Event Category count badges */}
                <div className="flex flex-wrap gap-1.5 py-1" dir={isAr ? "rtl" : "ltr"}>
                  {[
                    { label: isAr ? "ملاحظات طبية" : "SOAP", count: timelineEvents.filter(e => e.type === "clinical-note" || e.type === "soap-note").length, color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                    { label: isAr ? "علامات حيوية" : "Vitals", count: timelineEvents.filter(e => e.type === "vitals").length, color: "bg-amber-50 text-amber-700 border-amber-100" },
                    { label: isAr ? "تشخيصات" : "Diagnoses", count: timelineEvents.filter(e => e.type === "diagnosis").length, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                    { label: isAr ? "فحوصات وطلبات" : "Orders", count: timelineEvents.filter(e => e.type === "order").length, color: "bg-blue-50 text-blue-700 border-blue-100" },
                    { label: isAr ? "وصفات" : "Prescriptions", count: timelineEvents.filter(e => e.type === "prescription").length, color: "bg-violet-50 text-violet-700 border-violet-100" },
                  ].map((cat, idx) => (
                    <div key={idx} className={`text-[10px] font-black px-2 py-0.5 rounded-md border flex items-center gap-1 ${cat.color}`}>
                      <span>{cat.label}</span>
                      <span className="opacity-70">({cat.count})</span>
                    </div>
                  ))}
                </div>

                {/* The Timeline Stream Reel */}
                <div className="flex-1 overflow-y-auto max-h-[500px] pr-1 pl-2 custom-scrollbar relative space-y-4 pt-2">
                  <div className={`absolute top-2 bottom-4 w-0.5 bg-slate-100 -z-10 ${isAr ? "right-6" : "left-6"}`} />

                  {timelineEvents.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-400 italic">
                      {isAr ? "لا توجد أحداث مسجلة لهذا المريض بعد." : "No clinical timeline events recorded yet."}
                    </div>
                  ) : (
                    timelineEvents.map((event, idx) => {
                      const IconComponent = 
                        event.icon === "FileText" ? FileText :
                        event.icon === "Activity" ? Activity :
                        event.icon === "Beaker" ? Beaker :
                        event.icon === "Pill" ? Pill :
                        event.icon === "Zap" ? Zap :
                        event.icon === "HeartPulse" ? HeartPulse : FileText;

                      return (
                        <div 
                          key={event.id || idx}
                          onClick={() => {
                            setDetailModal({
                              isOpen: true,
                              title: isAr ? `تفاصيل الحدث: ${event.titleAr}` : `Event Details: ${event.titleEn}`,
                              type: event.originalType,
                              data: event.data
                            });
                          }}
                          className={`group flex items-start gap-4 transition-all relative cursor-pointer ${isAr ? "flex-row-reverse text-right" : "flex-row text-left"}`}
                        >
                          {/* Timeline Dot & Icon */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs border transition-all duration-300 group-hover:scale-110 z-10 ${
                            event.color === "rose" ? "bg-rose-50 border-rose-200 text-rose-600 group-hover:bg-rose-100" :
                            event.color === "purple" ? "bg-purple-50 border-purple-200 text-purple-600 group-hover:bg-purple-100" :
                            event.color === "emerald" ? "bg-emerald-50 border-emerald-200 text-emerald-600 group-hover:bg-emerald-100" :
                            event.color === "indigo" ? "bg-indigo-50 border-indigo-200 text-indigo-600 group-hover:bg-indigo-100" :
                            event.color === "amber" ? "bg-amber-50 border-amber-200 text-amber-600 group-hover:bg-amber-100" :
                            event.color === "red" ? "bg-red-50 border-red-200 text-red-600 group-hover:bg-red-100 animate-pulse" :
                            event.color === "blue" ? "bg-blue-50 border-blue-200 text-blue-600 group-hover:bg-blue-100" :
                            "bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-slate-100"
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>

                          {/* Event Card content */}
                          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 shadow-xs group-hover:border-indigo-400 group-hover:shadow-md transition relative overflow-hidden">
                            {/* Color Tag Strip on Left/Right */}
                            <div className={`absolute top-0 bottom-0 w-1 ${isAr ? "right-0" : "left-0"} ${
                              event.color === "rose" ? "bg-rose-500" :
                              event.color === "purple" ? "bg-purple-500" :
                              event.color === "emerald" ? "bg-emerald-500" :
                              event.color === "indigo" ? "bg-indigo-500" :
                              event.color === "amber" ? "bg-amber-500" :
                              event.color === "red" ? "bg-red-500" :
                              event.color === "blue" ? "bg-blue-500" : "bg-slate-300"
                            }`} />

                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <div>
                                <h4 className="text-xs font-black text-slate-850 leading-tight">
                                  {isAr ? event.titleAr : event.titleEn}
                                </h4>
                                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                                  {event.timestamp}
                                </span>
                              </div>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${
                                event.color === "rose" ? "bg-rose-50 text-rose-700 border-rose-100" :
                                event.color === "purple" ? "bg-purple-50 text-purple-700 border-purple-100" :
                                event.color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                event.color === "indigo" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                                event.color === "amber" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                event.color === "red" ? "bg-red-50 text-red-700 border-red-100" :
                                event.color === "blue" ? "bg-blue-50 text-blue-700 border-blue-100" :
                                "bg-slate-100 text-slate-700 border-slate-200"
                              }`}>
                                {event.type}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 font-semibold line-clamp-2 leading-relaxed mb-2">
                              {isAr ? event.descAr : event.descEn}
                            </p>

                            <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-slate-50 text-slate-400 font-medium">
                              <span>
                                {isAr ? "بواسطة: " : "By: "} 
                                <strong className="text-slate-600 font-bold">{event.author}</strong> ({event.role})
                              </span>
                              <span className="text-indigo-600 group-hover:underline">
                                {isAr ? "تفاصيل الحدث السريري ←" : "View clinical details ←"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === "Overview" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm flex-1">
                <h3 className="text-sm font-bold text-blue-800">{isAr ? "ملخص الجلسة العلاجية الحالية" : "Current Consultation Overview"}</h3>
                
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-blue-700 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> {isAr ? "الشكوى الرئيسية للمريض (Subjective)" : "Chief Complaint (Subjective)"}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notesSOAP.subjective}</p>
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> {isAr ? "التشخيص الطبي الأخير" : "Recent Diagnoses"}
                  </div>
                  <div className="space-y-1">
                    {diagnoses.slice(0, 2).map((d, i) => (
                      <div key={i} className="text-xs text-slate-600 flex justify-between">
                        <span className="font-semibold">{d.code} - {d.desc}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">{d.type}</span>
                      </div>
                    ))}
                    {diagnoses.length === 0 && <p className="text-xs text-slate-400 italic">No diagnoses entered yet.</p>}
                  </div>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5" /> {isAr ? "الوصفات والأدوية النشطة" : "Active Rx Medications"}
                  </div>
                  <div className="space-y-1">
                    {patientPrescriptions.length > 0 ? (
                      patientPrescriptions.slice(0, 2).map((p) => (
                        <div key={p.id} className="text-xs text-slate-600 flex justify-between">
                          <span className="font-semibold">{p.medication} ({p.dose})</span>
                          <span className="text-[10px] text-indigo-600">{p.status}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No prescription added in this session. Go to "Prescription" tab to add.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Complaints" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1 space-y-6">
                {/* Form to enter active Complaint */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-blue-800">{isAr ? "الشكوى والقصة المرضية الحالية" : "Active Chief Complaint & HPI"}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">{isAr ? "قم بتعديل أو كتابة الشكوى الحالية، ثم اضغط حفظ لتسجيلها وأرشفتها." : "Edit or write the current complaint, then click Save to archive it in history."}</p>
                    </div>
                    <button onClick={handleSaveComplaints} className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-sm">
                      <Save className="w-3.5 h-3.5" /> {isAr ? "تسجيل وحفظ" : "Record & Save"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "الشكوى الرئيسية الحالية (Chief Complaint)" : "Current Chief Complaint"}</label>
                      <input 
                        type="text" 
                        value={complaints.chiefComplaint}
                        onChange={e => setComplaints(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                        className="w-full p-2.5 border border-slate-250 rounded-lg text-xs sm:text-sm font-medium outline-none focus:border-blue-500 shadow-2xs text-right" 
                        placeholder={isAr ? "مثال: ألم صدري حاد ينتشر للكتف الأيسر" : "e.g. Sharp chest pain radiating to left shoulder"}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "القصة المرضية الحالية وتطورها (History of Present Illness)" : "Current History of Present Illness (HPI)"}</label>
                      <textarea 
                        value={complaints.presentIllness}
                        onChange={e => setComplaints(prev => ({ ...prev, presentIllness: e.target.value }))}
                        className="w-full h-32 p-2.5 border border-slate-250 rounded-lg text-xs sm:text-sm font-medium outline-none focus:border-blue-500 shadow-2xs text-right" 
                        placeholder={isAr ? "اكتب هنا بالتفصيل مدة الألم، شدته، المسببات، والتاريخ الطبي ذو الصلة..." : "Describe detailed onset, duration, severity, palliative/provocative factors..."}
                      />
                    </div>
                  </div>
                </div>

                {/* Historical Timeline of previous entries */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-slate-500" />
                    <h4 className="text-xs font-bold text-slate-700">{isAr ? "السجل التاريخي للشكاوى السابقة" : "Historical Timeline of Past Complaints"}</h4>
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{complaintsHistory.length}</span>
                  </div>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {complaintsHistory.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 italic bg-slate-50 rounded-lg">
                        {isAr ? "لا يوجد سجل تاريخي محفوظ بعد" : "No complaints history saved yet"}
                      </div>
                    ) : (
                      complaintsHistory.map((item, idx) => (
                        <div 
                          key={item.id || idx}
                          onClick={() => setDetailModal({
                            isOpen: true,
                            title: isAr ? "تفاصيل الشكوى والقصة المرضية التاريخية" : "Historical Complaint & HPI Details",
                            type: "complaint",
                            data: item
                          })}
                          className="group border border-slate-150 hover:border-blue-400 hover:bg-blue-50/20 bg-white rounded-xl p-3 text-right cursor-pointer transition shadow-2xs relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex justify-between items-start gap-2 mb-1.5" dir={isAr ? "rtl" : "ltr"}>
                            <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-[180px] sm:max-w-xs block">
                              {item.chiefComplaint}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 whitespace-nowrap">
                              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{item.author}</span>
                              <span>{item.recordedAt}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed text-right">
                            {item.presentIllness}
                          </p>
                          <div className="mt-2 text-[10px] text-blue-600 group-hover:underline flex items-center gap-1 justify-end">
                            <span>{isAr ? "انقر لعرض كامل التفاصيل الموثقة والمراجعة ←" : "Click to view full archived record ←"}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Allergies" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                  <h3 className="text-sm font-bold text-blue-800">{isAr ? "إدارة الحساسية والأمراض المزمنة" : "Allergies & Chronic Diseases"}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Allergies list */}
                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-rose-700">{isAr ? "أنواع الحساسية" : "Allergies"}</span>
                      <button onClick={() => setIsAddAllergyOpen(true)} className="text-[10px] bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-1.5 py-0.5 rounded">+</button>
                    </div>
                    <div className="space-y-1.5">
                      {allergies.map((alg, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200 text-xs">
                          <span className="font-semibold text-slate-700">{alg}</span>
                          <button 
                            onClick={() => {
                              const updated = allergies.filter((_, i) => i !== idx);
                              setAllergies(updated);
                              handleSavePatientSection("allergies", updated, "Allergies updated");
                            }}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chronic list */}
                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-blue-700">{isAr ? "الأمراض المزمنة" : "Chronic Conditions"}</span>
                      <button onClick={() => setIsAddChronicOpen(true)} className="text-[10px] bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-1.5 py-0.5 rounded">+</button>
                    </div>
                    <div className="space-y-1.5">
                      {chronicDiseases.map((chr, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200 text-xs">
                          <span className="font-semibold text-slate-700">{chr}</span>
                          <button 
                            onClick={() => {
                              const updated = chronicDiseases.filter((_, i) => i !== idx);
                              setChronicDiseases(updated);
                              handleSavePatientSection("chronicDiseases", updated, "Chronic diseases updated");
                            }}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Vitals" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1 space-y-5">
                <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                  <h3 className="text-sm font-bold text-blue-800">{isAr ? "رصد العلامات الحيوية والوزن" : "Vitals Monitoring"}</h3>
                  <button onClick={() => setIsEditVitalsOpen(true)} className="bg-blue-600 text-white px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-sm">
                    {isAr ? "تعديل المؤشرات الحيوية" : "Update Vitals"}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: isAr ? "ضغط الدم" : "Blood Pressure", val: vitals.bp, unit: "mmHg", color: "rose" },
                    { label: isAr ? "النبض" : "Pulse Rate", val: vitals.pulse, unit: "bpm", color: "blue" },
                    { label: isAr ? "الحرارة" : "Body Temp", val: vitals.temp, unit: "°C", color: "amber" },
                    { label: isAr ? "الأكسجين" : "SpO2 %", val: vitals.spo2, unit: "%", color: "teal" }
                  ].map((vit, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center shadow-2xs">
                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">{vit.label}</div>
                      <div className={`text-base font-black text-${vit.color}-600`}>{vit.val}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{vit.unit}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-150 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-blue-800">{isAr ? "مخطط المؤشرات البيانية" : "Vitals Graph Tracker"}</h4>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Active Session</span>
                  </div>
                  {/* Visual Chart */}
                  <div className="h-28 w-full flex items-end justify-between relative pt-6 border-b border-slate-100 pb-2">
                    <div className="absolute inset-0 flex flex-col justify-between z-0">
                      <div className="w-full border-t border-slate-100 h-0"></div>
                      <div className="w-full border-t border-slate-100 h-0"></div>
                      <div className="w-full border-t border-slate-100 h-0"></div>
                    </div>
                    <div className="w-full flex justify-between px-4 z-10">
                      {[1,2,3,4,5].map(idx => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <div className="relative w-2 h-16 flex items-end justify-center">
                            <div className="w-2.5 h-10 bg-indigo-500 rounded-t" style={{ height: `${20 + idx * 12}%` }}></div>
                          </div>
                          <div className="text-[9px] text-slate-400">Point {idx}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Historical Vitals Log Timeline */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-slate-500" />
                    <h4 className="text-xs font-bold text-slate-700">{isAr ? "السجل التاريخي للمؤشرات الحيوية" : "Historical Vitals Records"}</h4>
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{vitalsHistory.length}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {vitalsHistory.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 italic bg-slate-50 rounded-lg col-span-2">
                        {isAr ? "لا توجد مؤشرات مسجلة مسبقاً" : "No vitals history records found"}
                      </div>
                    ) : (
                      vitalsHistory.map((item, idx) => (
                        <div 
                          key={item.id || idx}
                          onClick={() => setDetailModal({
                            isOpen: true,
                            title: isAr ? "تفاصيل العلامات الحيوية المؤرشفة" : "Archived Vitals Record Details",
                            type: "vital",
                            data: item
                          })}
                          className="group border border-slate-150 hover:border-indigo-400 hover:bg-indigo-50/10 bg-white rounded-xl p-3 cursor-pointer transition shadow-2xs relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex justify-between items-center mb-2" dir={isAr ? "rtl" : "ltr"}>
                            <span className="text-[10px] font-bold text-slate-400">{item.recordedAt}</span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold">{item.author}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            <div className="bg-rose-50/40 p-1.5 rounded-md">
                              <div className="text-[8px] text-slate-400 font-bold">{isAr ? "ضغط" : "BP"}</div>
                              <div className="text-[11px] font-black text-rose-600">{item.bp || "--"}</div>
                            </div>
                            <div className="bg-blue-50/40 p-1.5 rounded-md">
                              <div className="text-[8px] text-slate-400 font-bold">{isAr ? "نبض" : "PR"}</div>
                              <div className="text-[11px] font-black text-blue-600">{item.pulse || "--"}</div>
                            </div>
                            <div className="bg-amber-50/40 p-1.5 rounded-md">
                              <div className="text-[8px] text-slate-400 font-bold">{isAr ? "حرارة" : "Temp"}</div>
                              <div className="text-[11px] font-black text-amber-600">{item.temp || "--"}</div>
                            </div>
                            <div className="bg-teal-50/40 p-1.5 rounded-md">
                              <div className="text-[8px] text-slate-400 font-bold">{isAr ? "أكسجين" : "SpO2"}</div>
                              <div className="text-[11px] font-black text-teal-600">{item.spo2 || "--"}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-[9px] text-indigo-600 text-center group-hover:underline">
                            {isAr ? "انقر لمعرض باقي التفاصيل والوزن/الكتلة ←" : "Click to view full records & BMI ←"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Diagnosis" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex-1 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-blue-800">{isAr ? "تحديد التشخيص الطبي (ICD-10)" : "Diagnosis (ICD-10)"}</h3>
                  <button 
                    onClick={() => setIsAddDiagOpen(!isAddDiagOpen)} 
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {isAddDiagOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {isAr ? "تشخيص جديد" : "Add Diagnosis"}
                  </button>
                </div>

                {/* Inline Add Form */}
                {isAddDiagOpen && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 space-y-3">
                    <div className="text-xs font-bold text-slate-700">{isAr ? "إدخال تشخيص جديد" : "Add Diagnosis Details"}</div>
                    <div className="grid grid-cols-3 gap-2">
                      <input 
                        type="text" 
                        value={newDiagCode}
                        onChange={e => setNewDiagCode(e.target.value)}
                        placeholder="ICD-10 Code (e.g. I25.1)" 
                        className="p-2 border border-slate-250 bg-white rounded-lg text-xs outline-none col-span-1"
                      />
                      <input 
                        type="text" 
                        value={newDiagDesc}
                        onChange={e => setNewDiagDesc(e.target.value)}
                        placeholder="Description" 
                        className="p-2 border border-slate-250 bg-white rounded-lg text-xs outline-none col-span-2"
                      />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1 text-xs font-medium">
                          <input type="radio" checked={newDiagType === "primary"} onChange={() => setNewDiagType("primary")} />
                          {isAr ? "تشخيص رئيسي" : "Primary"}
                        </label>
                        <label className="flex items-center gap-1 text-xs font-medium">
                          <input type="radio" checked={newDiagType === "comorbidity"} onChange={() => setNewDiagType("comorbidity")} />
                          {isAr ? "تشخيص مرافق" : "Comorbidity"}
                        </label>
                      </div>
                      <button onClick={handleAddDiagnosis} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 transition">
                        {isAr ? "إضافة" : "Add"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {diagnoses.map((d, index) => (
                    <div 
                      key={index} 
                      onClick={() => setDetailModal({
                        isOpen: true,
                        title: isAr ? "تفاصيل التشخيص الطبي المعتمد" : "Confirmed Diagnosis Details",
                        type: "diagnosis",
                        data: {
                          ...d,
                          recordedAt: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')
                        }
                      })}
                      className="border border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 cursor-pointer transition rounded-lg p-3 flex justify-between items-center bg-white shadow-xs w-full"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">{d.code} - {d.desc}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">
                          {d.type === "primary" ? (isAr ? "رئيسي • نشط" : "Primary Diagnosis") : (isAr ? "مرافق • مزمن" : "Comorbidity")}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteDiagnosis(index)}
                        className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded"
                        title="Delete Diagnosis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {diagnoses.length === 0 && (
                    <div className="text-xs text-slate-400 italic text-center py-6">{isAr ? "لا توجد تشخيصات مدخلة" : "No diagnoses placed yet."}</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Orders" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex-1 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-blue-800">{isAr ? "طلب الفحوصات والتحاليل الطبية" : "Order Management"}</h3>
                  <button 
                    onClick={() => {
                      const nextOpen = !isAddOrderOpen;
                      setIsAddOrderOpen(nextOpen);
                      if (nextOpen) {
                        const defaults = LAB_CATALOG;
                        setNewOrderName(isAr ? defaults[0].ar : defaults[0].en);
                      }
                    }} 
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1 transition"
                  >
                    {isAddOrderOpen ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    {isAr ? "طلب فحص" : "Create Order"}
                  </button>
                </div>

                {isAddOrderOpen && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="text-xs font-bold text-slate-700">{isAr ? "اختيار نوع واسم الفحص" : "Order Details"}</div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select 
                        value={newOrderType} 
                        onChange={e => {
                          const type = e.target.value as any;
                          setNewOrderType(type);
                          const defaults = type === "LAB" ? LAB_CATALOG : type === "RAD" ? RAD_CATALOG : PROC_CATALOG;
                          const defaultVal = defaults[0] ? (isAr ? defaults[0].ar : defaults[0].en) : "";
                          setNewOrderName(defaultVal);
                        }}
                        className="p-2 border border-slate-250 bg-white rounded-lg text-xs outline-none"
                      >
                        <option value="LAB">{isAr ? "مختبر / تحاليل" : "Laboratory"}</option>
                        <option value="RAD">{isAr ? "أشعة ورنين" : "Radiology"}</option>
                        <option value="PROC">{isAr ? "إجراء / عمليات" : "Procedure"}</option>
                      </select>
                      
                      <div className="flex-1 min-w-[240px]">
                        <SearchableCombobox 
                          options={newOrderType === "LAB" ? LAB_CATALOG : newOrderType === "RAD" ? RAD_CATALOG : PROC_CATALOG}
                          value={newOrderName}
                          onChange={(val) => setNewOrderName(val)}
                          placeholder={isAr ? "ابحث عن فحص..." : "Search for investigation..."}
                          isAr={isAr}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <button onClick={handleAddOrder} className="bg-blue-600 text-white px-4 py-1 rounded text-xs font-bold hover:bg-blue-700 transition">
                        {isAr ? "إرسال الطلب" : "Place Order"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {orders.map((o) => (
                    <div key={o.id} onClick={() => setDetailModal({
                         isOpen: true,
                         title: isAr ? "تفاصيل طلب الفحص المخبري أو الإشعاعي" : "Investigation Order Details",
                         type: "order",
                         data: {
                           ...o,
                           clinician: isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid",
                           priority: "Routine",
                           instructions: isAr ? "تحليل صائم أو فحص سريع بالتنسيق مع قسم الاستقبال." : "Fasting sample or rapid screen with radiology reception desk."
                         }
                       })} className="border border-slate-100 hover:border-blue-400 hover:bg-blue-50/10 cursor-pointer transition rounded-xl p-3 flex gap-3 relative bg-white shadow-xs">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                        o.type === "LAB" ? "bg-blue-50 border-blue-100 text-blue-500" :
                        o.type === "RAD" ? "bg-emerald-50 border-emerald-100 text-emerald-500" :
                        "bg-purple-50 border-purple-100 text-purple-500"
                      }`}>
                        {o.type === "LAB" ? <Beaker className="w-5 h-5" /> :
                         o.type === "RAD" ? <Zap className="w-5 h-5" /> :
                         <Activity className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{o.type}</div>
                        <div className="text-xs font-bold text-slate-800">{o.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1">Requested: {o.date}</div>
                      </div>
                      <div className="text-right flex flex-col justify-between items-end">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          o.status === "Ordered" ? "text-teal-600 bg-teal-50" : "text-blue-600 bg-blue-50"
                        }`}>{o.status}</span>
                        <button 
                          onClick={() => handleDeleteOrder(o.id)}
                          className="text-rose-500 hover:text-rose-700 text-xs mt-1"
                          title="Cancel Order"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-xs text-slate-400 italic text-center py-6">No investigations ordered yet.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Prescription" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex-1 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-blue-800">{isAr ? "الوصفة الدوائية الإلكترونية (eRx)" : "Prescription (eRx)"}</h3>
                  <button 
                    onClick={() => {
                      const nextOpen = !isAddDrugOpen;
                      setIsAddDrugOpen(nextOpen);
                      if (nextOpen && MED_CATALOG.length > 0) {
                        const d = MED_CATALOG[0];
                        setNewDrugName(isAr ? d.ar : d.en);
                        setNewDrugDose(d.defaultDose || "");
                        setNewDrugSig(isAr ? (d.defaultSigAr || "") : (d.defaultSig || ""));
                        setNewDrugQty(d.defaultQty || 1);
                      }
                    }} 
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {isAddDrugOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {isAr ? "إضافة دواء" : "Add Medication"}
                  </button>
                </div>

                {isAddDrugOpen && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-right">
                    <div className="text-xs font-bold text-slate-700">{isAr ? "بيانات الدواء الجديد" : "Medication Prescription Details"}</div>
                    
                    <div className="mb-2">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? "البحث عن دواء واختياره" : "Search & Select Medication"}</label>
                      <SearchableCombobox 
                        options={MED_CATALOG}
                        value={newDrugName}
                        onChange={(val, opt) => {
                          setNewDrugName(val);
                          if (opt) {
                            setNewDrugDose(opt.defaultDose || "");
                            setNewDrugSig(isAr ? (opt.defaultSigAr || "") : (opt.defaultSig || ""));
                            setNewDrugQty(opt.defaultQty || 1);
                          }
                        }}
                        placeholder={isAr ? "ابحث عن دواء بالاسم التجاري أو المادة..." : "Search for medication by name..."}
                        isAr={isAr}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? "الجرعة" : "Dosage"}</label>
                        <input 
                          type="text" 
                          value={newDrugDose}
                          onChange={e => setNewDrugDose(e.target.value)}
                          placeholder="Dosage (e.g. 81 mg)" 
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? "الكمية" : "Qty"}</label>
                        <input 
                          type="number" 
                          value={newDrugQty}
                          onChange={e => setNewDrugQty(Number(e.target.value))}
                          placeholder="Qty" 
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? "طريقة الاستعمال والجرعة اليومية" : "Directions (Sig)"}</label>
                      <input 
                        type="text" 
                        value={newDrugSig}
                        onChange={e => setNewDrugSig(e.target.value)}
                        placeholder="Directions (e.g. Once daily after breakfast)" 
                        className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs outline-none"
                      />
                    </div>
                    <div className="text-right pt-2">
                      <button onClick={handleAddPrescription} className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-blue-700 transition">
                        {isAr ? "إدراج في الوصفة" : "Prescribe Drug"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {patientPrescriptions.map((p) => (
                    <div key={p.id} onClick={() => setDetailModal({
                      isOpen: true,
                      title: isAr ? "تفاصيل الوصفة الطبية والعلاج الموصوف" : "Medication Prescription Details",
                      type: "prescription",
                      data: {
                        ...p,
                        sig: isAr ? "قرص واحد يومياً بعد الطعام" : "1 tablet daily after meal",
                        refills: 0,
                        warning: isAr ? "يرجى مراقبة وظائف الكلى عند الاستخدام الطويل." : "Monitor renal function on prolonged use."
                      }
                    })} className="border border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 cursor-pointer transition rounded-lg p-3 bg-white shadow-xs">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {p.medication} {p.dose}
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-bold">Safe</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">Qty: {p.qty} • Issued {p.date}</div>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {patientPrescriptions.length === 0 && (
                    <div className="border border-dashed border-slate-250 p-6 rounded-lg text-center text-xs text-slate-400 italic">
                      {isAr ? "لا توجد أدوية مضافة حالياً. انقر على 'إضافة دواء' في الأعلى لوصف دواء." : "No medications added yet. Click 'Add Medication' above to prescribe."}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Patient Queue Sidebar & Immediate Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-blue-800 mb-4">{isAr ? "الإجراءات السريعة" : "Actions"}</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    if (activePatient) {
                      updatePatientStatus(activePatient.id, "ward");
                      toast.success(isAr ? "تم نقل المريض للتنويم الداخلي" : "Patient admitted to Ward");
                      if (onNavigate) {
                        onNavigate("ipd");
                      }
                    }
                  }} 
                  className="flex flex-col items-center gap-2 group p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center bg-rose-50 group-hover:scale-105 transition">
                    <UserPlus className="w-5 h-5 text-rose-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
                    {isAr ? "تنويم داخلي" : "Admit Ward"}
                  </span>
                </button>

                <button 
                  onClick={() => {
                    if (activePatient) {
                      updatePatientStatus(activePatient.id, "discharged");
                      toast.success(isAr ? "تم خروج المريض بنجاح" : "Patient discharged successfully");
                    }
                  }} 
                  className="flex flex-col items-center gap-2 group p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center bg-emerald-50 group-hover:scale-105 transition">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
                    {isAr ? "خروج المريض" : "Discharge"}
                  </span>
                </button>

                <button 
                  onClick={() => toast.success(isAr ? "تم إرسال طلب استشارة خارجية" : "Referral requested")} 
                  className="flex flex-col items-center gap-2 group p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center bg-indigo-50 group-hover:scale-105 transition">
                    <Share2 className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
                    {isAr ? "إحالة طبية" : "Refer Doctor"}
                  </span>
                </button>

                <button 
                  onClick={() => toast.success(isAr ? "تم جدولة مراجعة المريض" : "Follow-up scheduled")} 
                  className="flex flex-col items-center gap-2 group p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center bg-blue-50 group-hover:scale-105 transition">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
                    {isAr ? "مراجعة لاحقة" : "Follow Up"}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Medications Checklist */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-blue-800">{isAr ? "الأدوية النشطة المسجلة" : "Chronic Medications"}</h3>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Standard</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Amlodipine 5 mg", sig: isAr ? "قرص واحد يومياً بعد الفطور" : "1 Tab - Once Daily - After Breakfast" },
                  { name: "Atorvastatin 20 mg", sig: isAr ? "قرص واحد مساءً قبل النوم" : "1 Tab - Once Daily - At Bedtime" },
                  { name: "Metformin 500 mg", sig: isAr ? "قرص مرتين يومياً بعد الأكل" : "1 Tab - Twice Daily - After Meals" }
                ].map((med, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{med.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{med.sig}</div>
                    </div>
                    <span className="text-[9px] font-bold text-teal-600 border border-teal-200 bg-teal-50 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Patient Queue Bottom Bar */}
      <div className="bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-blue-800 shrink-0">{isAr ? "قائمة انتظار العيادة" : "Patient Queue"}</h3>
          <div className="flex gap-4 overflow-x-auto custom-scrollbar">
            {["All", "Waiting", "With Doctor", "Completed"].map((q, i) => (
              <button key={i} className={`text-xs font-bold whitespace-nowrap ${i === 0 ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-slate-500 pb-1"}`}>
                {isAr ? (
                  q === "All" ? "الكل" :
                  q === "Waiting" ? "في الانتظار" :
                  q === "With Doctor" ? "عند الطبيب" : "مكتمل"
                ) : q} {i === 0 ? `(${queuePatients.length})` : ""}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => {
              if (queuePatients.length > 0) {
                const currentIndex = queuePatients.findIndex(p => p.id === selectedPatientId);
                const nextIndex = (currentIndex + 1) % queuePatients.length;
                setSelectedPatientId(queuePatients[nextIndex].id);
                toast.info(isAr ? "تم الانتقال للمريض التالي" : "Switched to next patient");
              }
            }} 
            className="ml-auto bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 hover:bg-blue-700"
          >
            {isAr ? "المريض التالي" : "Next Patient"} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="flex gap-4 p-3 overflow-x-auto custom-scrollbar bg-slate-50/50">
          {queuePatients.length === 0 ? (
            <div className="text-xs text-slate-500 p-2">{isAr ? "لا يوجد مرضى في الانتظار" : "No patients in queue."}</div>
          ) : (
            queuePatients.map((p, idx) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedPatientId(p.id)}
                className={`bg-white rounded-xl p-2 w-64 shrink-0 transition-colors cursor-pointer relative ${selectedPatientId === p.id ? 'border-2 border-amber-300 shadow-sm' : 'border border-slate-200 hover:border-blue-300'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold text-slate-500">{isAr ? `دور #${idx + 1}` : `Queue #${idx + 1}`}</div>
                  <div className="text-[10px] font-bold text-amber-600 font-mono">{p.mrn}</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <img src={`https://i.pravatar.cc/150?u=${p.id}`} className="w-8 h-8 rounded-full shadow-xs" alt="pic" referrerPolicy="no-referrer" />
                  <div className="text-xs font-bold text-slate-800 truncate flex-1">{isAr ? p.nameAr : p.nameEn}</div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${p.status === 'doctor' ? 'text-amber-700 bg-amber-100' : 'text-emerald-700 bg-emerald-100'}`}>
                    {p.status === 'doctor' ? (isAr ? "عند الطبيب" : "With Doctor") : (isAr ? "مسجل" : "Registered")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 1. Modal: Edit Vitals */}
      {isEditVitalsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade" dir={isAr ? "rtl" : "ltr"}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-right">
            <h3 className="text-sm font-bold text-blue-800 border-b pb-2">{isAr ? "تعديل العلامات الحيوية للمريض" : "Edit Patient Vitals"}</h3>
            
            <div className="space-y-2 text-right">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "ضغط الدم (BP)" : "Blood Pressure"}</label>
                <input type="text" value={vitals.bp} onChange={e => setVitals(prev => ({ ...prev, bp: e.target.value }))} className="w-full p-2 border border-slate-250 rounded text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "النبض (Pulse)" : "Pulse (bpm)"}</label>
                  <input type="text" value={vitals.pulse} onChange={e => setVitals(prev => ({ ...prev, pulse: e.target.value }))} className="w-full p-2 border border-slate-250 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "الحرارة (°C)" : "Temp (°C)"}</label>
                  <input type="text" value={vitals.temp} onChange={e => setVitals(prev => ({ ...prev, temp: e.target.value }))} className="w-full p-2 border border-slate-250 rounded text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "الوزن (كجم)" : "Weight (kg)"}</label>
                  <input type="text" value={vitals.weight} onChange={e => setVitals(prev => ({ ...prev, weight: e.target.value }))} className="w-full p-2 border border-slate-250 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? "الطول (سم)" : "Height (cm)"}</label>
                  <input type="text" value={vitals.height} onChange={e => setVitals(prev => ({ ...prev, height: e.target.value }))} className="w-full p-2 border border-slate-250 rounded text-xs" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => setIsEditVitalsOpen(false)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition">{isAr ? "إلغاء" : "Cancel"}</button>
              <button onClick={handleSaveVitals} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">{isAr ? "تحديث" : "Update"}</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Add Allergy */}
      {isAddAllergyOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade" dir={isAr ? "rtl" : "ltr"}>
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 space-y-3 shadow-2xl">
            <h3 className="text-xs font-bold text-blue-800 border-b pb-1.5">{isAr ? "إضافة حساسية جديدة" : "Add Allergy"}</h3>
            <input 
              type="text" 
              value={newAllergyName} 
              onChange={e => setNewAllergyName(e.target.value)} 
              placeholder={isAr ? "مثال: البنسلين" : "e.g. Sulfa drugs"}
              className="w-full p-2 border border-slate-250 rounded text-xs outline-none"
            />
            <div className="flex justify-end gap-1.5 pt-2">
              <button onClick={() => setIsAddAllergyOpen(false)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded">{isAr ? "إلغاء" : "Cancel"}</button>
              <button onClick={handleAddAllergy} className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">{isAr ? "إضافة" : "Add"}</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Add Chronic Disease */}
      {isAddChronicOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade" dir={isAr ? "rtl" : "ltr"}>
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 space-y-3 shadow-2xl">
            <h3 className="text-xs font-bold text-blue-800 border-b pb-1.5">{isAr ? "إضافة مرض مزمن" : "Add Chronic Disease"}</h3>
            <input 
              type="text" 
              value={newChronicName} 
              onChange={e => setNewChronicName(e.target.value)} 
              placeholder={isAr ? "مثال: السكري النوع الثاني" : "e.g. Asthma"}
              className="w-full p-2 border border-slate-250 rounded text-xs outline-none"
            />
            <div className="flex justify-end gap-1.5 pt-2">
              <button onClick={() => setIsAddChronicOpen(false)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded">{isAr ? "إلغاء" : "Cancel"}</button>
              <button onClick={handleAddChronic} className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">{isAr ? "إضافة" : "Add"}</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Universal Detailed Viewer Modal */}
      {detailModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[99999] animate-fade" dir={isAr ? "rtl" : "ltr"}>
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-200" />
                <h3 className="text-sm sm:text-base font-black text-white">{detailModal.title}</h3>
              </div>
              <button 
                onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))} 
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              
              {/* COMPLAINT */}
              {detailModal.type === "complaint" && (
                <div className="space-y-4">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-right">
                    <h4 className="text-xs font-bold text-slate-500 mb-1">{isAr ? "الشكوى الرئيسية السابقة" : "Archived Chief Complaint"}</h4>
                    <p className="text-sm font-extrabold text-blue-900 leading-relaxed">{detailModal.data?.chiefComplaint}</p>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-right space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 border-b border-slate-150 pb-1.5">{isAr ? "القصة وتطور الحالة بالتفصيل" : "HPI Detailed Chronology"}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{detailModal.data?.presentIllness}</p>
                  </div>

                  <div className="flex justify-between items-center text-[11px] bg-slate-100/50 p-2.5 rounded-lg border border-slate-150">
                    <span className="text-slate-500 font-medium">{isAr ? "تم التوثيق بواسطة:" : "Logged By:"} <strong className="text-slate-800 font-bold">{detailModal.data?.author}</strong></span>
                    <span className="text-slate-500 font-medium">{isAr ? "التاريخ:" : "Date:"} <strong className="text-slate-800 font-bold">{detailModal.data?.recordedAt}</strong></span>
                  </div>
                </div>
              )}

              {/* VITALS */}
              {detailModal.type === "vital" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] font-bold text-rose-500 uppercase mb-0.5">{isAr ? "ضغط الدم" : "Blood Pressure"}</div>
                      <div className="text-base font-black text-rose-700">{detailModal.data?.bp} <span className="text-[10px] text-rose-500">mmHg</span></div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] font-bold text-blue-500 uppercase mb-0.5">{isAr ? "النبض" : "Pulse Rate"}</div>
                      <div className="text-base font-black text-blue-700">{detailModal.data?.pulse} <span className="text-[10px] text-blue-500">bpm</span></div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] font-bold text-amber-500 uppercase mb-0.5">{isAr ? "درجة الحرارة" : "Body Temperature"}</div>
                      <div className="text-base font-black text-amber-700">{detailModal.data?.temp} <span className="text-[10px] text-amber-500">°C</span></div>
                    </div>
                    <div className="bg-teal-50 border border-teal-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] font-bold text-teal-500 uppercase mb-0.5">{isAr ? "الأكسجين" : "Oxygen SpO2"}</div>
                      <div className="text-base font-black text-teal-700">{detailModal.data?.spo2} <span className="text-[10px] text-teal-500">%</span></div>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] font-bold text-purple-500 uppercase mb-0.5">{isAr ? "معدل التنفس" : "Respiratory Rate"}</div>
                      <div className="text-base font-black text-purple-700">{detailModal.data?.resp || "18"} <span className="text-[10px] text-purple-500">/min</span></div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">{isAr ? "الوزن والارتفاع" : "Weight / Height"}</div>
                      <div className="text-xs font-black text-slate-800">
                        {detailModal.data?.weight || "--"} kg / {detailModal.data?.height || "--"} cm
                      </div>
                    </div>
                  </div>

                  {/* BMI Widget */}
                  {detailModal.data?.weight && detailModal.data?.height && (
                    <div className="bg-indigo-50/60 border border-indigo-100 p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <h5 className="text-xs font-black text-indigo-900">{isAr ? "مؤشر كتلة الجسم (BMI)" : "Body Mass Index (BMI)"}</h5>
                        <p className="text-[10px] text-indigo-500 mt-0.5">
                          {(() => {
                            const val = (Number(detailModal.data.weight) / ((Number(detailModal.data.height) / 100) ** 2));
                            if (val < 18.5) return isAr ? "نقص في الوزن (Underweight)" : "Underweight";
                            if (val < 25) return isAr ? "وزن مثالي طبيعي (Normal Weight)" : "Normal Weight";
                            if (val < 30) return isAr ? "وزن زائد (Overweight)" : "Overweight";
                            return isAr ? "سمنة مفرطة (Obese)" : "Obese";
                          })()}
                        </p>
                      </div>
                      <div className="text-lg font-black text-indigo-700 bg-indigo-100/50 px-3 py-1.5 rounded-lg border border-indigo-200">
                        {(Number(detailModal.data.weight) / ((Number(detailModal.data.height) / 100) ** 2)).toFixed(1)}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span>{isAr ? "سجل بواسطة:" : "Registered By:"} <strong className="text-slate-700 font-bold">{detailModal.data?.author}</strong></span>
                    <span>{isAr ? "الوقت والتاريخ:" : "Timestamp:"} <strong className="text-slate-700 font-bold">{detailModal.data?.recordedAt}</strong></span>
                  </div>
                </div>
              )}

              {/* DIAGNOSIS */}
              {detailModal.type === "diagnosis" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 border border-emerald-100 text-emerald-600 font-black text-sm">
                      ICD
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? "رمز التصنيف الدولي للأمراض" : "ICD-10 Clinical Coding"}</div>
                      <div className="text-base font-black text-slate-800">{detailModal.data?.code}</div>
                      <div className="text-xs font-medium text-slate-600 mt-1">{detailModal.data?.desc}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="block text-[10px] text-slate-400 font-bold mb-0.5">{isAr ? "نوع الحالة" : "Clinical Type"}</span>
                      <span className="text-xs font-black text-slate-700">
                        {detailModal.data?.type === "primary" ? (isAr ? "رئيسي (Primary)" : "Primary") : (isAr ? "مرافق (Comorbidity)" : "Comorbidity")}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="block text-[10px] text-slate-400 font-bold mb-0.5">{isAr ? "حالة المرض" : "Clinical Status"}</span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {isAr ? "نشط ومؤكد" : "Active & Confirmed"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-xl space-y-1 text-right">
                    <h5 className="text-[10px] font-bold text-amber-800 uppercase">{isAr ? "ملاحظة تدقيق السجل السريري" : "Clinical Audit Notes"}</h5>
                    <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                      {isAr ? "هذا التشخيص متوافق مع معايير الفوترة الطبية وتصنيفات وزارة الصحة المعتمدة." : "This diagnostic code is audited and compatible with standard MOH diagnostic frameworks."}
                    </p>
                  </div>
                </div>
              )}

              {/* ORDER */}
              {detailModal.type === "order" && (
                <div className="space-y-4 text-right">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold mb-0.5">{isAr ? "فئة طلب الاستقصاء" : "Order Category"}</span>
                      <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 uppercase">
                        {detailModal.data?.type}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold mb-0.5">{isAr ? "حالة الإرسال" : "Workflow Status"}</span>
                      <span className="text-xs font-black bg-teal-50 text-teal-700 px-2 py-1 rounded border border-teal-100">
                        {detailModal.data?.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/30 border border-blue-100 rounded-xl">
                    <span className="block text-[10px] text-blue-500 font-bold mb-1">{isAr ? "اسم الفحص المطلوبة" : "Investigation Ordered"}</span>
                    <p className="text-xs sm:text-sm font-black text-slate-800">{detailModal.data?.name}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">{isAr ? "الأولوية السريرية" : "Clinical Priority"}</span>
                      <span className="font-bold text-slate-700">{detailModal.data?.priority}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2">
                      <span className="text-slate-400 font-medium">{isAr ? "تعليمات الفحص" : "Preparation instructions"}</span>
                      <span className="font-bold text-slate-700">{detailModal.data?.instructions}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span>{isAr ? "المرسل:" : "Ordered By:"} <strong className="text-slate-700 font-bold">{detailModal.data?.clinician}</strong></span>
                    <span>{isAr ? "تاريخ الطلب:" : "Requested Date:"} <strong className="text-slate-700 font-bold">{detailModal.data?.date}</strong></span>
                  </div>
                </div>
              )}

              {/* PRESCRIPTION */}
              {detailModal.type === "prescription" && (
                <div className="space-y-4 text-right">
                  <div className="border border-indigo-100 rounded-xl p-4 bg-indigo-50/20 space-y-2">
                    <span className="text-[10px] text-indigo-500 font-black tracking-wider block uppercase">{isAr ? "العلاج الموصوف والجرعة" : "Prescribed Medication"}</span>
                    <h4 className="text-sm sm:text-base font-black text-slate-800">{detailModal.data?.medication} {detailModal.data?.dose}</h4>
                    <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black mt-1">
                      {isAr ? "آمن ولا يوجد تعارض" : "No Drug-Drug Interaction Detected"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="block text-[10px] text-slate-400 font-bold mb-0.5">{isAr ? "الكمية المصروفة" : "Quantity Issued"}</span>
                      <span className="text-xs font-black text-slate-700">
                        {detailModal.data?.qty} {isAr ? "عبوات" : "Packs"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="block text-[10px] text-slate-400 font-bold mb-0.5">{isAr ? "التكرار ومراجعة المريض" : "Refills Allowed"}</span>
                      <span className="text-xs font-black text-slate-700">
                        {detailModal.data?.refills || "0"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="block text-[10px] text-slate-400 font-bold">{isAr ? "طريقة الاستخدام والجرعات (Sig)" : "Directions for Use (Sig)"}</span>
                    <p className="text-xs font-bold text-indigo-700">{detailModal.data?.sig}</p>
                  </div>

                  {detailModal.data?.warning && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
                      <span className="block text-[10px] text-rose-500 font-bold">{isAr ? "تنبيهات الصيدلي والمريض" : "Safety Warning"}</span>
                      <p className="text-xs text-rose-700 leading-relaxed font-semibold">{detailModal.data.warning}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span>{isAr ? "الطبيب المعالج:" : "Prescribed By:"} <strong className="text-slate-700 font-bold">{isAr ? "د. جابر أحمد مرشد" : "Dr. Jaber Ahmed Murshid"}</strong></span>
                    <span>{isAr ? "التاريخ:" : "Date:"} <strong className="text-slate-700 font-bold">{detailModal.data?.date}</strong></span>
                  </div>
                </div>
              )}

              {/* SOAP NOTE DETAIL */}
              {detailModal.type === "soap" && (
                <div className="space-y-4 text-right">
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-blue-700 flex items-center gap-1 justify-end font-black">
                      {isAr ? "الشكوى وعرض الحالة (S - Subjective)" : "Subjective (S)"} <FileText className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">{detailModal.data?.subjective}</p>
                  </div>

                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 justify-end font-black">
                      {isAr ? "الفحص السريري (O - Objective)" : "Objective (O)"} <Activity className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">{detailModal.data?.objective}</p>
                  </div>

                  <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-purple-700 flex items-center gap-1 justify-end font-black">
                      {isAr ? "التقييم (A - Assessment)" : "Assessment (A)"} <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">{detailModal.data?.assessment}</p>
                  </div>

                  <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-amber-700 flex items-center gap-1 justify-end font-black">
                      {isAr ? "الخطة علاجية الموصوفة (P - Plan)" : "Plan (P)"} <Pill className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">{detailModal.data?.plan}</p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span>{isAr ? "محرر التقرير:" : "Documented By:"} <strong className="text-slate-700 font-bold">{detailModal.data?.author} ({detailModal.data?.role})</strong></span>
                    <span>{isAr ? "تاريخ التوثيق:" : "Timestamp:"} <strong className="text-slate-700 font-bold">{detailModal.data?.recordedAt}</strong></span>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))} 
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black px-4 py-2 rounded-lg transition shadow-2xs"
              >
                {isAr ? "إغلاق النافذة" : "Close Details"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
