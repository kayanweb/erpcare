import React, { useState, useEffect } from "react";
import { GlobalEntityLink } from "./GlobalEntityLink";
import {
  Activity,
  AlertTriangle,
  Bed,
  HeartPulse,
  Search,
  Plus,
  Filter,
  Users,
  Stethoscope,
  Droplet,
  Clock,
  ChevronRight,
  FileText,
  X,
  CheckCircle,
  TrendingUp,
  Trash2,
  Skull,
  ShieldAlert,
  List,
  User,
  Check,
  ClipboardList
} from "lucide-react";
import { syncSetting, saveSetting, getSetting, saveHISNotification } from "../lib/firestoreService";
import { toast } from "sonner";
import DepartmentTasks from "./DepartmentTasks";

interface ICUCase {
  id: string;
  mrn: string;
  name: string;
  bedId: string;
  admissionDate: string;
  diagnosis: string;
  gcsScore: number;
  ventilatorStatus: "None" | "NIV" | "Invasive" | "Weaning";
  vitals: {
    hr: number;
    bp: string;
    spo2: number;
    temp: number;
  };
  infusions: string[];
  notes: string;
  status: "Critical" | "Stable" | "Deteriorating" | "Ready for Transfer";
}

interface ICULog {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  type: ICUFormType;
  timestamp: string;
  recorder: string;
  data: any;
}

type ICUFormType =
  | "admission"
  | "vitals"
  | "orders"
  | "fluids"
  | "nursing"
  | "acuity"
  | "transfer"
  | "mortuary"
  | "code_blue";

export default function ICUDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [patients, setPatients] = useState<ICUCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<ICUCase | null>(null);
  
  // Custom states for Forms and History Logs
  const [icuLogs, setIcuLogs] = useState<ICULog[]>([]);
  const [activeForm, setActiveForm] = useState<ICUFormType | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Sync Cases from DB
  useEffect(() => {
    const unsub = syncSetting("his_icu_cases", (data) => {
      if (data && Array.isArray(data)) {
        setPatients(data);
        // Retain selection if patient still exists
        if (selectedPatient) {
          const updated = data.find(p => p.id === selectedPatient.id);
          if (updated) setSelectedPatient(updated);
        }
      } else {
        const seeded: ICUCase[] = [
          {
            id: "ICU-001",
            mrn: "MRN-10594",
            name: "Ahmed Youssef",
            bedId: "Bed 01",
            admissionDate: new Date(Date.now() - 172800000).toISOString(),
            diagnosis: "Severe Sepsis, ARDS",
            gcsScore: 9,
            ventilatorStatus: "Invasive",
            vitals: { hr: 115, bp: "90/55", spo2: 88, temp: 39.2 },
            infusions: ["Norepinephrine", "Propofol"],
            notes: "Unstable hemodynamics, titrating pressors.",
            status: "Critical",
          },
          {
            id: "ICU-002",
            mrn: "MRN-33491",
            name: "Fatma Salem",
            bedId: "Bed 04",
            admissionDate: new Date(Date.now() - 432000000).toISOString(),
            diagnosis: "Post-CABG",
            gcsScore: 14,
            ventilatorStatus: "Weaning",
            vitals: { hr: 85, bp: "120/75", spo2: 96, temp: 37.1 },
            infusions: ["Dobutamine"],
            notes: "Extubated yesterday, stable on 2L NC.",
            status: "Stable",
          },
        ];
        setPatients(seeded);
        saveSetting("his_icu_cases", seeded);
      }
    });

    // Sync Action History logs from DB
    const unsubLogs = syncSetting("his_icu_logs", (data) => {
      if (data && Array.isArray(data)) {
        setIcuLogs(data);
      } else {
        setIcuLogs([]);
      }
    });

    return () => {
      unsub();
      unsubLogs();
    };
  }, [selectedPatient?.id]);

  // Set default values when a form is opened
  useEffect(() => {
    if (activeForm && selectedPatient) {
      if (activeForm === "admission") {
        setFormData({
          bedId: selectedPatient.bedId || "",
          diagnosis: selectedPatient.diagnosis || "",
          gcs: selectedPatient.gcsScore || 15,
          ventilatorStatus: selectedPatient.ventilatorStatus || "None",
          severity: selectedPatient.status || "Critical",
          isolation: "no"
        });
      } else if (activeForm === "vitals") {
        setFormData({
          hr: selectedPatient.vitals.hr,
          bp: selectedPatient.vitals.bp,
          spo2: selectedPatient.vitals.spo2,
          temp: selectedPatient.vitals.temp,
          rr: 18,
          glucose: 120
        });
      } else if (activeForm === "orders") {
        setFormData({
          sedative: "None",
          vasopressor: "None",
          labs: "ABG, CBC",
          nursingLevel: "1:1",
          nutrition: "NPO"
        });
      } else if (activeForm === "fluids") {
        setFormData({
          fluidType: "Normal Saline",
          rate: 80,
          route: "Peripheral IV",
          volume: 500,
          additives: "None"
        });
      } else if (activeForm === "nursing") {
        setFormData({
          shift: isAr ? "صباحية (Morning)" : "Morning",
          nurseName: "Fatma Al-Harbi",
          roundFrequency: isAr ? "كل ساعتين (q2h)" : "Every 2 hours (q2h)",
          oralCare: "yes",
          suction: "PRN"
        });
      } else if (activeForm === "acuity") {
        setFormData({
          apache: 12,
          sofa: 4,
          gcs: selectedPatient.gcsScore || 15,
          organFailure: "no",
          severityClass: "High Risk"
        });
      } else if (activeForm === "transfer") {
        setFormData({
          ward: isAr ? "جناح الباطنة العام" : "General Medical Ward",
          reason: isAr ? "استقرار العلامات الحيوية وفصل التنفس" : "Stabilized vitals & successful extubation",
          receivingDoc: "Dr. Khaled Fawzy",
          equipment: "Transport Monitor & O2 Cyl"
        });
      } else if (activeForm === "mortuary") {
        setFormData({
          deathTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          physician: isAr ? "د. محمد السيد" : "Dr. Mohamed Elsayed",
          causeOfDeath: "Cardiopulmonary Arrest / Severe ARDS",
          familyNotified: "yes",
          mortuaryNotified: "yes"
        });
      } else if (activeForm === "code_blue") {
        setFormData({
          rhythm: "Asystole",
          epiDoses: 2,
          shocksCount: 0,
          duration: 15,
          leader: isAr ? "د. محمد السيد" : "Dr. Mohamed Elsayed",
          outcome: "ROSC Achieved (استعادة النبض)"
        });
      }
    }
  }, [activeForm, selectedPatient]);

  const updateVitals = async (id: string, newVitals: any) => {
    const next = (patients || []).map((p) =>
      p.id === id ? { ...p, vitals: { ...p.vitals, ...newVitals } } : p,
    );
    setPatients(next);
    await saveSetting("his_icu_cases", next);
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Vitals updated", titleAr: "تم تحديث العلامات الحيوية", type: "form" } }));
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const actionId = `ACT-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    // Create a clinical log entry
    const newLog: ICULog = {
      id: actionId,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientMrn: selectedPatient.mrn,
      type: activeForm!,
      timestamp,
      recorder: isAr ? "د. محمد السيد" : "Dr. Mohamed Elsayed",
      data: { ...formData }
    };

    const updatedLogs = [newLog, ...icuLogs];
    setIcuLogs(updatedLogs);
    await saveSetting("his_icu_logs", updatedLogs);

    // Build highly personalized descriptions for clinical Notifications
    let titleAr = "";
    let titleEn = "";
    let messageAr = "";
    let messageEn = "";
    let severity: "info" | "error" = "info";
    let alertDetails: any = {};

    if (activeForm === "admission") {
      titleAr = "قبول حالة جديدة بالعناية المركزة";
      titleEn = "ICU Patient Admission Check-In";
      messageAr = `تم تأكيد قبول المريض ${selectedPatient.name} في السرير ${formData.bedId || selectedPatient.bedId}.`;
      messageEn = `Patient ${selectedPatient.name} successfully admitted to ${formData.bedId || selectedPatient.bedId}.`;
      alertDetails = {
        "bedId": { ar: formData.bedId || selectedPatient.bedId, en: formData.bedId || selectedPatient.bedId, keyAr: "السرير", keyEn: "Bed" },
        "diagnosis": { ar: formData.diagnosis || selectedPatient.diagnosis, en: formData.diagnosis || selectedPatient.diagnosis, keyAr: "التشخيص", keyEn: "Diagnosis" },
        "gcs": { ar: formData.gcs || "15", en: formData.gcs || "15", keyAr: "مقياس غلاسكو (GCS)", keyEn: "GCS Score" },
        "vent": { ar: formData.ventilatorStatus || "None", en: formData.ventilatorStatus || "None", keyAr: "جهاز التنفس الصناعي", keyEn: "Ventilator" },
        "isolation": { ar: formData.isolation === "yes" ? "نعم (غرفة عزل)" : "لا", en: formData.isolation === "yes" ? "Yes (Isolation needed)" : "No", keyAr: "العزل", keyEn: "Isolation" }
      };

      // Update patient state
      const nextPatients = patients.map(p => p.id === selectedPatient.id ? {
        ...p,
        bedId: formData.bedId || p.bedId,
        diagnosis: formData.diagnosis || p.diagnosis,
        gcsScore: Number(formData.gcs) || p.gcsScore,
        ventilatorStatus: formData.ventilatorStatus || p.ventilatorStatus,
        status: (formData.severity || p.status) as any
      } : p);
      setPatients(nextPatients);
      await saveSetting("his_icu_cases", nextPatients);

    } else if (activeForm === "vitals") {
      titleAr = "تحديث العلامات الحيوية المستمرة";
      titleEn = "Continuous Vitals Update";
      messageAr = `تسجيل علامات حيوية جديدة للمريض ${selectedPatient.name}: نبض ${formData.hr}، ضغط ${formData.bp}، أكسجين ${formData.spo2}%.`;
      messageEn = `New continuous vitals logged for ${selectedPatient.name}: HR ${formData.hr}, BP ${formData.bp}, SpO2 ${formData.spo2}%.`;
      alertDetails = {
        "hr": { ar: `${formData.hr} نبضة/د`, en: `${formData.hr} bpm`, keyAr: "معدل النبض", keyEn: "Heart Rate" },
        "bp": { ar: formData.bp, en: formData.bp, keyAr: "ضغط الدم", keyEn: "Blood Pressure" },
        "spo2": { ar: `${formData.spo2}%`, en: `${formData.spo2}%`, keyAr: "نسبة الأكسجين SpO2", keyEn: "Oxygen Saturation" },
        "temp": { ar: `${formData.temp}°م`, en: `${formData.temp}°C`, keyAr: "درجة الحرارة", keyEn: "Temperature" },
        "rr": { ar: `${formData.rr || 18} نَفَس/د`, en: `${formData.rr || 18} rpm`, keyAr: "معدل التنفس", keyEn: "Respiratory Rate" },
        "glucose": { ar: `${formData.glucose || 120} ملغ/دسل`, en: `${formData.glucose || 120} mg/dL`, keyAr: "مستوى السكر", keyEn: "Blood Glucose" }
      };

      // Update patient vitals
      const nextPatients = patients.map(p => p.id === selectedPatient.id ? {
        ...p,
        vitals: {
          hr: Number(formData.hr) || p.vitals.hr,
          bp: formData.bp || p.vitals.bp,
          spo2: Number(formData.spo2) || p.vitals.spo2,
          temp: Number(formData.temp) || p.vitals.temp
        }
      } : p);
      setPatients(nextPatients);
      await saveSetting("his_icu_cases", nextPatients);

    } else if (activeForm === "orders") {
      titleAr = "تسجيل أوامر طبية جديدة بالعناية";
      titleEn = "New ICU Clinical Orders Registered";
      messageAr = `تم تسجيل أوامر علاجية ورعاية جديدة للمريض ${selectedPatient.name}.`;
      messageEn = `New medical & ventilation directives set for ${selectedPatient.name}.`;
      alertDetails = {
        "sedative": { ar: formData.sedative, en: formData.sedative, keyAr: "المهدئات النشطة", keyEn: "Sedatives" },
        "vasopressor": { ar: formData.vasopressor, en: formData.vasopressor, keyAr: "داعمات ضغط الدم", keyEn: "Vasopressors" },
        "labs": { ar: formData.labs, en: formData.labs, keyAr: "الفحوصات المخبرية المطلوبة", keyEn: "Labs Requested" },
        "nursing": { ar: formData.nursingLevel, en: formData.nursingLevel, keyAr: "مستوى الرعاية التمريضية", keyEn: "Nursing Level" },
        "nutrition": { ar: formData.nutrition, en: formData.nutrition, keyAr: "التغذية العلاجية", keyEn: "Nutrition Plan" }
      };
    } else if (activeForm === "fluids") {
      titleAr = "تحديث خريطة السوائل الوريدية";
      titleEn = "IV Infusion Fluid Charting";
      messageAr = `بدء تدفق محلول وريدي (${formData.fluidType}) بمعدل ${formData.rate} مل/ساعة للمريض ${selectedPatient.name}.`;
      messageEn = `Started IV fluid (${formData.fluidType}) infusion at ${formData.rate} ml/hr for ${selectedPatient.name}.`;
      alertDetails = {
        "fluid": { ar: formData.fluidType, en: formData.fluidType, keyAr: "نوع المحلول الوريدي", keyEn: "Fluid Infusion" },
        "rate": { ar: `${formData.rate} مل/ساعة`, en: `${formData.rate} ml/hr`, keyAr: "معدل التدفق", keyEn: "Infusion Rate" },
        "volume": { ar: `${formData.volume || 500} مل`, en: `${formData.volume || 500} ml`, keyAr: "الحجم المستهدف", keyEn: "Volume Target" },
        "route": { ar: formData.route, en: formData.route, keyAr: "طريق الإعطاء", keyEn: "Infusion Route" },
        "additives": { ar: formData.additives || "لا يوجد", en: formData.additives || "None", keyAr: "المواد المضافة للمحلول", keyEn: "Fluid Additives" }
      };

      // Update patient infusions list
      const nextPatients = patients.map(p => p.id === selectedPatient.id ? {
        ...p,
        infusions: Array.from(new Set([...p.infusions, formData.fluidType]))
      } : p);
      setPatients(nextPatients);
      await saveSetting("his_icu_cases", nextPatients);

    } else if (activeForm === "nursing") {
      titleAr = "اعتماد جدول المناوبات التمريضية";
      titleEn = "Nursing Care Schedule Finalized";
      messageAr = `تم تعيين الممرض(ة) ${formData.nurseName} لمتابعة المريض ${selectedPatient.name} مناوبة ${formData.shift}.`;
      messageEn = `Nurse ${formData.nurseName} assigned to patient ${selectedPatient.name} for the ${formData.shift} shift.`;
      alertDetails = {
        "nurse": { ar: formData.nurseName, en: formData.nurseName, keyAr: "الممرض المسؤول", keyEn: "Assigned Nurse" },
        "shift": { ar: formData.shift, en: formData.shift, keyAr: "الفترة الزمنية", keyEn: "Shift Time" },
        "round": { ar: formData.roundFrequency, en: formData.roundFrequency, keyAr: "معدل المرور الدوري", keyEn: "Rounding Cycle" },
        "oral": { ar: formData.oralCare === "yes" ? "نعم" : "لا", en: formData.oralCare === "yes" ? "Yes" : "No", keyAr: "العناية بالفم", keyEn: "Oral Hygiene" },
        "suction": { ar: formData.suction || "حسب الحاجة", en: formData.suction || "PRN", keyAr: "معدل التشفيط", keyEn: "Suction Level" }
      };
    } else if (activeForm === "acuity") {
      titleAr = "تحديث مؤشر الخطورة السريرية (Acuity)";
      titleEn = "Clinical Severity Index Updated";
      messageAr = `مؤشر الخطورة المحدث للمريض ${selectedPatient.name}: APACHE II = ${formData.apache}, SOFA = ${formData.sofa}.`;
      messageEn = `Severity indicators updated for ${selectedPatient.name}: APACHE II Score = ${formData.apache}, SOFA = ${formData.sofa}.`;
      alertDetails = {
        "apache": { ar: String(formData.apache), en: String(formData.apache), keyAr: "مقياس APACHE II", keyEn: "APACHE II Score" },
        "sofa": { ar: String(formData.sofa), en: String(formData.sofa), keyAr: "مقياس SOFA لحالة الأعضاء", keyEn: "SOFA Score" },
        "organ_fail": { ar: formData.organFailure === "yes" ? "نعم" : "لا", en: formData.organFailure === "yes" ? "Yes" : "No", keyAr: "فشل الأعضاء المتعدد", keyEn: "Multi-organ Failure" },
        "classification": { ar: formData.severityClass, en: formData.severityClass, keyAr: "درجة الخطورة", keyEn: "Severity Class" }
      };

      // Update patient status based on severity
      const nextPatients = patients.map(p => p.id === selectedPatient.id ? {
        ...p,
        status: (formData.severityClass === "Extreme High" || formData.severityClass === "High Risk" ? "Critical" : "Stable") as any
      } : p);
      setPatients(nextPatients);
      await saveSetting("his_icu_cases", nextPatients);

    } else if (activeForm === "transfer") {
      titleAr = "طلب نقل خارج العناية المركزة";
      titleEn = "Request to Transfer Out of ICU";
      messageAr = `طلب نقل المريض ${selectedPatient.name} إلى جناح ${formData.ward} لاستقرار الحالة.`;
      messageEn = `Transfer order issued for ${selectedPatient.name} to ${formData.ward} due to stabilized status.`;
      alertDetails = {
        "ward": { ar: formData.ward, en: formData.ward, keyAr: "جناح التنويم المستهدف", keyEn: "Target Ward" },
        "reason": { ar: formData.reason, en: formData.reason, keyAr: "سبب النقل المعتمد", keyEn: "Transfer Reason" },
        "receiving_doc": { ar: formData.receivingDoc, en: formData.receivingDoc, keyAr: "الطبيب المستلم للجناح", keyEn: "Receiving Doctor" },
        "equipment": { ar: formData.equipment || "لا يوجد", en: formData.equipment || "None", keyAr: "معدات النقل المطلوبة", keyEn: "Transport Equipment" }
      };

      const nextPatients = patients.map(p => p.id === selectedPatient.id ? {
        ...p,
        status: "Ready for Transfer" as any
      } : p);
      setPatients(nextPatients);
      await saveSetting("his_icu_cases", nextPatients);

    } else if (activeForm === "mortuary") {
      titleAr = "🚨 إعلان حالة وفاة ونقل للمشرحة";
      titleEn = "🚨 Declaration of Patient Expiry & Mortuary Transfer";
      messageAr = `إعلان وفاة المريض ${selectedPatient.name} في تمام الساعة ${formData.deathTime} بسبب ${formData.causeOfDeath}.`;
      messageEn = `Patient ${selectedPatient.name} declared expired at ${formData.deathTime} due to ${formData.causeOfDeath}.`;
      severity = "error";
      alertDetails = {
        "time": { ar: formData.deathTime, en: formData.deathTime, keyAr: "وقت الوفاة المعلن", keyEn: "Time of Death" },
        "cause": { ar: formData.causeOfDeath, en: formData.causeOfDeath, keyAr: "السبب الرئيسي للوفاة", keyEn: "Primary Cause" },
        "physician": { ar: formData.physician, en: formData.physician, keyAr: "الطبيب الاستشاري المعلن", keyEn: "Declaring Consultant" },
        "family_notified": { ar: formData.familyNotified === "yes" ? "نعم" : "لا", en: formData.familyNotified === "yes" ? "Yes" : "No", keyAr: "إخطار أقارب الدرجة الأولى", keyEn: "Family Notified" },
        "mortuary_status": { ar: formData.mortuaryNotified === "yes" ? "تم حجز السرير والمشرحة" : "معلق", en: formData.mortuaryNotified === "yes" ? "Confirmed" : "Pending", keyAr: "حالة إخطار المشرحة", keyEn: "Mortuary Request" }
      };

      const nextPatients = patients.map(p => p.id === selectedPatient.id ? {
        ...p,
        status: "Critical" as any,
        notes: `EXPIRED: ${formData.causeOfDeath}`
      } : p);
      setPatients(nextPatients);
      await saveSetting("his_icu_cases", nextPatients);

    } else if (activeForm === "code_blue") {
      titleAr = "🚨 حالة إنعاش طارئة (Code Blue)";
      titleEn = "🚨 Emergency Code Blue / CPR Activated";
      messageAr = `تنبيه حرج: تفعيل كود بلو للمريض ${selectedPatient.name} سرير ${selectedPatient.bedId}.`;
      messageEn = `Critical alert: Emergency Code Blue active for ${selectedPatient.name} at ${selectedPatient.bedId}.`;
      severity = "error";
      alertDetails = {
        "rhythm": { ar: formData.rhythm, en: formData.rhythm, keyAr: "نبض التوقف الأولي", keyEn: "Arrest Rhythm" },
        "epi": { ar: `${formData.epiDoses || 0} حقنة الأدرينالين`, en: `${formData.epiDoses || 0} dose(s)`, keyAr: "الأدرينالين المعطى", keyEn: "Epinephrine" },
        "shocks": { ar: `${formData.shocksCount || 0} صدمة كهربائية`, en: `${formData.shocksCount || 0} shock(s)`, keyAr: "الصدمات الكهربائية", keyEn: "Defib Shocks" },
        "duration": { ar: `${formData.duration || 0} دقيقة`, en: `${formData.duration || 0} min(s)`, keyAr: "مدة الإنعاش (CPR)", keyEn: "CPR Duration" },
        "leader": { ar: formData.leader, en: formData.leader, keyAr: "قائد فريق الإنعاش", keyEn: "Team Leader" },
        "outcome": { ar: formData.outcome, en: formData.outcome, keyAr: "النتيجة المباشرة للإنعاش", keyEn: "ROSC Outcome" }
      };

      const nextPatients = patients.map(p => p.id === selectedPatient.id ? {
        ...p,
        status: (formData.outcome?.includes("ROSC") ? "Critical" : "Deteriorating") as any,
        notes: `Resuscitation Drill Event: ${formData.outcome}`
      } : p);
      setPatients(nextPatients);
      await saveSetting("his_icu_cases", nextPatients);
    }

    const notifObj = {
      id: `notif-icu-${Date.now()}`,
      titleAr,
      titleEn,
      messageAr,
      messageEn,
      type: severity,
      timestamp,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      details: alertDetails
    };

    await saveHISNotification(notifObj);
    localStorage.removeItem("his_notifications_cleared");

    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Clinical data logged successfully & broadcasted to HIS", titleAr: "تم حفظ البيانات الطبية بنجاح وإرسال إشعار للنظام", type: "form" } }));
    setActiveForm(null);
    setFormData({});
  };

  const handleClearPatientLogs = async () => {
    if (!selectedPatient) return;
    const remainingLogs = icuLogs.filter(l => l.patientId !== selectedPatient.id);
    setIcuLogs(remainingLogs);
    await saveSetting("his_icu_logs", remainingLogs);
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Current patient's clinical records cleared", titleAr: "تم إخلاء سجلات المريض الحالية", type: "form" } }));
  };

  const filtered = patients.filter(
    (p) =>
      p.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      p.mrn?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      p.bedId?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  );

  const selectedPatientLogs = icuLogs.filter(l => l.patientId === selectedPatient?.id);

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-rose-600" />
            {isAr ? "مركز العناية المركزة (ICU)" : "ICU Command Center"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "مراقبة الحالات الحرجة والمؤشرات الحيوية"
              : "Critical care monitoring & vitals"}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`}
            />
            <input
              type="text"
              placeholder={
                isAr
                  ? "بحث برقم الملف، الاسم، السرير..."
                  : "Search MRN, Name, Bed..."
              }
              className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 font-bold`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              if (selectedPatient) {
                setActiveForm("admission");
              } else {
                toast.error(isAr ? "يرجى اختيار مريض أولاً لإدخال بيانات القبول" : "Please select a patient first to enter admission details");
              }
            }}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />{" "}
            {isAr ? "قبول حالة جديدة" : "Admit Patient"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bed View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(filtered || []).map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition shadow-sm ${selectedPatient?.id === patient.id ? "border-rose-500 bg-rose-50/10" : "border-slate-100 hover:border-slate-300"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-white ${patient.status === "Critical" ? "bg-rose-600" : patient.status === "Deteriorating" ? "bg-amber-500" : "bg-emerald-500"}`}
                    >
                      {patient.bedId?.replace("Bed ", "") ?? ""}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">
                        <GlobalEntityLink entityId={patient.mrn} entityName={patient.name} entityType="patient" isAr={isAr}>
                          {patient.name}
                        </GlobalEntityLink>
                      </h3>
                      <p className="text-xs font-mono text-slate-500">
                        {patient.mrn}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-slate-100 ${patient.status === "Critical" ? "text-rose-600 bg-rose-50" : patient.status === "Deteriorating" ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"}`}
                  >
                    {patient.status}
                  </span>
                </div>

                <div className="bg-slate-900 rounded-lg p-3 text-white mb-3 grid grid-cols-4 gap-2 text-center items-center">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">
                      HR
                    </p>
                    <p
                      className={`font-mono font-bold ${patient.vitals.hr > 110 || patient.vitals.hr < 60 ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}
                    >
                      {patient.vitals.hr}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">
                      BP
                    </p>
                    <p className="font-mono font-bold text-blue-300 text-xs">
                      {patient.vitals.bp}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">
                      SPO2
                    </p>
                    <p
                      className={`font-mono font-bold ${patient.vitals.spo2 < 90 ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}
                    >
                      {patient.vitals.spo2}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">
                      TEMP
                    </p>
                    <p
                      className={`font-mono font-bold ${patient.vitals.temp > 38 ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {patient.vitals.temp}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded flex items-center gap-1 border border-indigo-100">
                    <Droplet className="h-3 w-3" /> GCS: {patient.gcsScore}
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                    VENT: {patient.ventilatorStatus}
                  </span>
                  {patient.infusions.length > 0 && (
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 truncate max-w-full">
                      {patient.infusions.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mt-6">
            <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-indigo-600" />
              {isAr ? "المهام الطبية" : "Clinical Tasks"}
            </h2>
            <DepartmentTasks language={language} departmentId="icu" departmentName={isAr ? "العناية المركزة" : "Intensive Care Unit"} />
          </div>
        </div>

        {/* Selected Patient Sidebar */}
        <div className="lg:col-span-1">
          {selectedPatient ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden sticky top-4">
              <div className="bg-slate-800 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black">
                      {selectedPatient.name}
                    </h3>
                    <p className="text-slate-300 font-mono text-sm font-bold">
                      {selectedPatient.mrn} • {selectedPatient.bedId}
                    </p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Bed className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 text-xs flex justify-between">
                  <span>
                    {isAr ? "التشخيص:" : "Dx:"}{" "}
                    <span className="font-bold text-rose-300">
                      {selectedPatient.diagnosis}
                    </span>
                  </span>
                  <span>
                    {isAr ? "الدخول:" : "Admit:"}{" "}
                    {new Date(
                      selectedPatient.admissionDate,
                    ).toLocaleDateString()}
                  </span>
                </div>

                {/* Grid of the 9 ICU Core Interactive Forms */}
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-[10px] text-slate-300 font-black uppercase tracking-wider mb-2">
                    {isAr ? "الإجراءات والبيانات السريرية للرعاية" : "ICU Care Actions & Forms"}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setActiveForm("admission")}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-black px-2 py-1.5 rounded transition text-right flex items-center gap-1.5"
                    >
                      <User className="h-3 w-3 text-indigo-300" />
                      {isAr ? "تسجيل دخول الرعاية" : "Admit to ICU"}
                    </button>
                    <button
                      onClick={() => setActiveForm("vitals")}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-black px-2 py-1.5 rounded transition text-right flex items-center gap-1.5"
                    >
                      <Activity className="h-3 w-3 text-emerald-300" />
                      {isAr ? "مراقبة حيوية مستمرة" : "Monitor Vitals"}
                    </button>
                    <button
                      onClick={() => setActiveForm("orders")}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-black px-2 py-1.5 rounded transition text-right flex items-center gap-1.5"
                    >
                      <ClipboardList className="h-3 w-3 text-purple-300" />
                      {isAr ? "أوامر الرعاية (ICU)" : "ICU Orders"}
                    </button>
                    <button
                      onClick={() => setActiveForm("fluids")}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-black px-2 py-1.5 rounded transition text-right flex items-center gap-1.5"
                    >
                      <Droplet className="h-3 w-3 text-sky-300" />
                      {isAr ? "سوائل وريدية" : "IV Fluids"}
                    </button>
                    <button
                      onClick={() => setActiveForm("nursing")}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-black px-2 py-1.5 rounded transition text-right flex items-center gap-1.5"
                    >
                      <Clock className="h-3 w-3 text-amber-300" />
                      {isAr ? "جدول التمريض" : "Nursing Flow"}
                    </button>
                    <button
                      onClick={() => setActiveForm("acuity")}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-black px-2 py-1.5 rounded transition text-right flex items-center gap-1.5"
                    >
                      <TrendingUp className="h-3 w-3 text-orange-300" />
                      {isAr ? "مؤشر الخطورة" : "Acuity Level"}
                    </button>
                    <button
                      onClick={() => setActiveForm("transfer")}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-black px-2 py-1.5 rounded transition text-right flex items-center gap-1.5"
                    >
                      <ChevronRight className="h-3 w-3 text-teal-300" />
                      {isAr ? "نقل للتنويم" : "Transfer Out"}
                    </button>
                    <button
                      onClick={() => setActiveForm("mortuary")}
                      className="text-[10px] bg-slate-900 hover:bg-black text-slate-300 font-black px-2 py-1.5 rounded transition text-right flex items-center gap-1.5 border border-slate-700"
                    >
                      <Skull className="h-3 w-3 text-rose-300" />
                      {isAr ? "وفاة (Mortuary)" : "Mortuary"}
                    </button>
                    <button
                      onClick={() => setActiveForm("code_blue")}
                      className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white font-black px-2 py-1.5 rounded transition w-full mt-1.5 col-span-2 flex items-center justify-center gap-1.5 animate-pulse"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {isAr ? "إنعاش (Code Blue)" : "Code Blue"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Regular quick updates */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />{" "}
                    {isAr ? "التحديث الفوري السريع" : "Quick Vitals Update"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="HR"
                      className="border border-slate-200 p-2 rounded text-sm text-center font-mono font-bold"
                      value={selectedPatient.vitals.hr}
                      onChange={(e) => {
                        if (e.target.value)
                          updateVitals(selectedPatient.id, {
                            hr: Number(e.target.value),
                          });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="BP"
                      className="border border-slate-200 p-2 rounded text-sm text-center font-mono font-bold"
                      value={selectedPatient.vitals.bp}
                      onChange={(e) => {
                        if (e.target.value)
                          updateVitals(selectedPatient.id, {
                            bp: e.target.value,
                          });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />{" "}
                    {isAr ? "ملاحظات سريرية" : "Clinical Notes"}
                  </h4>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-bold">
                    {selectedPatient.notes}
                  </p>
                </div>

                {/* Patient History Logs Table Section */}
                <div>
                  <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-1">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <List className="h-4 w-4 text-indigo-600" />{" "}
                      {isAr ? "سجل إجراءات هذا المريض" : "Clinical History Logs"}
                    </h4>
                    {selectedPatientLogs.length > 0 && (
                      <button
                        onClick={handleClearPatientLogs}
                        className="text-[10px] text-rose-500 hover:underline font-bold"
                      >
                        {isAr ? "تصفية السجل" : "Clear Logs"}
                      </button>
                    )}
                  </div>

                  {selectedPatientLogs.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic text-center py-4 bg-slate-50 rounded">
                      {isAr ? "لا توجد إجراءات مسجلة مسبقاً لهذا المريض" : "No previous clinical logs recorded."}
                    </p>
                  ) : (
                    <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-lg overflow-hidden text-xs">
                      <table className="w-full text-right" dir={isAr ? "rtl" : "ltr"}>
                        <thead className="bg-slate-50 text-slate-500 font-black text-[10px] uppercase border-b border-slate-200">
                          <tr>
                            <th className="p-2">{isAr ? "الإجراء" : "Action"}</th>
                            <th className="p-2">{isAr ? "الوقت" : "Time"}</th>
                            <th className="p-2">{isAr ? "التفاصيل" : "Details"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                          {(selectedPatientLogs || []).map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50">
                              <td className="p-2 whitespace-nowrap">
                                <span className="px-1.5 py-0.5 rounded text-[9px] uppercase bg-slate-100 text-slate-800 font-black border border-slate-200">
                                  {log.type}
                                </span>
                              </td>
                              <td className="p-2 whitespace-nowrap text-[10px] text-slate-400 font-mono">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="p-2 text-[10px] max-w-xs truncate">
                                {log.type === "code_blue" && (isAr ? `إنعاش (${log.data.outcome})` : `CPR (${log.data.outcome})`)}
                                {log.type === "fluids" && (isAr ? `سوائل: ${log.data.fluidType} (${log.data.rate}مل/س)` : `Fluid: ${log.data.fluidType} (${log.data.rate}ml/h)`)}
                                {log.type === "vitals" && (isAr ? `نبض: ${log.data.hr}، ضغط: ${log.data.bp}` : `HR: ${log.data.hr}, BP: ${log.data.bp}`)}
                                {log.type === "orders" && (isAr ? `تحاليل: ${log.data.labs}` : `Labs: ${log.data.labs}`)}
                                {log.type === "acuity" && (isAr ? `APACHE: ${log.data.apache}، SOFA: ${log.data.sofa}` : `APACHE: ${log.data.apache}, SOFA: ${log.data.sofa}`)}
                                {log.type === "nursing" && (isAr ? `ممرض: ${log.data.nurseName}` : `Nurse: ${log.data.nurseName}`)}
                                {log.type === "transfer" && (isAr ? `نقل إلى: ${log.data.ward}` : `Transfer to: ${log.data.ward}`)}
                                {log.type === "mortuary" && (isAr ? `وفاة: ${log.data.causeOfDeath}` : `Expired: ${log.data.causeOfDeath}`)}
                                {log.type === "admission" && (isAr ? `قبول: ${log.data.diagnosis}` : `Admitted: ${log.data.diagnosis}`)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-64 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Stethoscope className="h-12 w-12 text-slate-200 mb-2" />
              <p className="font-bold text-sm">
                {isAr
                  ? "حدد مريضاً لعرض التفاصيل الكاملة والبدء في الإجراءات"
                  : "Select a patient to view full details & manage care actions"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RENDER ACTIVE MEDICAL DATA FORM MODAL */}
      {activeForm && selectedPatient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade font-sans">
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            dir={isAr ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="bg-slate-800 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  {activeForm === "code_blue" && <ShieldAlert className="h-6 w-6 text-rose-400" />}
                  {activeForm === "vitals" && <Activity className="h-6 w-6 text-emerald-400" />}
                  {activeForm === "orders" && <ClipboardList className="h-6 w-6 text-purple-400" />}
                  {activeForm === "fluids" && <Droplet className="h-6 w-6 text-sky-400" />}
                  {activeForm === "nursing" && <Clock className="h-6 w-6 text-amber-400" />}
                  {activeForm === "acuity" && <TrendingUp className="h-6 w-6 text-orange-400" />}
                  {activeForm === "transfer" && <ChevronRight className="h-6 w-6 text-teal-400" />}
                  {activeForm === "mortuary" && <Skull className="h-6 w-6 text-slate-400" />}
                  {activeForm === "admission" && <User className="h-6 w-6 text-indigo-400" />}
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {activeForm === "admission" && (isAr ? "تسجيل دخول الرعاية المركزة" : "ICU Patient Admission")}
                    {activeForm === "vitals" && (isAr ? "مراقبة وتسجيل العلامات الحيوية المستمرة" : "Continuous Vitals Monitor Form")}
                    {activeForm === "orders" && (isAr ? "تسجيل أوامر الرعاية والتهوية (ICU Orders)" : "ICU Care & Ventilation Orders")}
                    {activeForm === "fluids" && (isAr ? "تسجيل سوائل وريدية ومغذيات طارئة" : "IV Infusion & Fluids Directives")}
                    {activeForm === "nursing" && (isAr ? "إعداد جدول المناوبة التمريضية للمريض" : "Nursing Schedule & Rounding Directives")}
                    {activeForm === "acuity" && (isAr ? "مؤشر الخطورة السريرية (APACHE & SOFA)" : "Clinical Severity & Acuity Evaluation")}
                    {activeForm === "transfer" && (isAr ? "إصدار أمر نقل إلى الجناح العادي" : "Order Patient Transfer out to Ward")}
                    {activeForm === "mortuary" && (isAr ? "إعلان الوفاة ونقل لثلاجة الموتى" : "Declaration of Expiry & Mortuary Transfer")}
                    {activeForm === "code_blue" && (isAr ? "تسجيل تفاصيل عملية إنعاش الكود بلو" : "Emergency Code Blue / CPR Form")}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    {isAr ? "المريض:" : "Patient:"} {selectedPatient.name} ({selectedPatient.mrn})
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setActiveForm(null); setFormData({}); }}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Fields body */}
            <form onSubmit={handleConfirmAction} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {activeForm === "admission" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "التشخيص الدقيق للدخول" : "Admission Diagnosis"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.diagnosis || ""}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "رقم السرير" : "Bed Assignment"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold font-mono text-center"
                      value={formData.bedId || ""}
                      onChange={(e) => setFormData({ ...formData, bedId: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "مقياس غلاسكو الأولي" : "Initial GCS"}</label>
                    <input
                      type="number"
                      min="3"
                      max="15"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.gcs || ""}
                      onChange={(e) => setFormData({ ...formData, gcs: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "حالة جهاز التنفس" : "Ventilator Status"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.ventilatorStatus || "None"}
                      onChange={(e) => setFormData({ ...formData, ventilatorStatus: e.target.value })}
                    >
                      <option value="None">None</option>
                      <option value="NIV">NIV (Non-invasive)</option>
                      <option value="Invasive">Invasive (Intubated)</option>
                      <option value="Weaning">Weaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "العزل السريري" : "Isolation Room Required"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.isolation || "no"}
                      onChange={(e) => setFormData({ ...formData, isolation: e.target.value })}
                    >
                      <option value="no">{isAr ? "لا" : "No"}</option>
                      <option value="yes">{isAr ? "نعم (غرفة عزل ضغط سلبي)" : "Yes (Negative Pressure)"}</option>
                    </select>
                  </div>
                </div>
              )}

              {activeForm === "vitals" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "ضربات القلب (HR)" : "Heart Rate (bpm)"}</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center font-mono"
                      value={formData.hr || ""}
                      onChange={(e) => setFormData({ ...formData, hr: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "ضغط الدم (BP)" : "Blood Pressure (mmHg)"}</label>
                    <input
                      type="text"
                      placeholder="120/80"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center font-mono"
                      value={formData.bp || ""}
                      onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "نسبة الأكسجين (SpO2 %)" : "Oxygen Saturation (%)"}</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center font-mono"
                      value={formData.spo2 || ""}
                      onChange={(e) => setFormData({ ...formData, spo2: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "درجة الحرارة (Temp °C)" : "Temperature (°C)"}</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center font-mono"
                      value={formData.temp || ""}
                      onChange={(e) => setFormData({ ...formData, temp: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "معدل التنفس (RR)" : "Respiratory Rate"}</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.rr || 18}
                      onChange={(e) => setFormData({ ...formData, rr: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "مستوى السكر العشوائي" : "Random Blood Glucose"}</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.glucose || 120}
                      onChange={(e) => setFormData({ ...formData, glucose: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              {activeForm === "orders" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "عقاقير المهدئات الفعالة" : "Active Sedative"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.sedative || "None"}
                      onChange={(e) => setFormData({ ...formData, sedative: e.target.value })}
                    >
                      <option value="None">None</option>
                      <option value="Propofol infusion">Propofol infusion</option>
                      <option value="Midazolam">Midazolam</option>
                      <option value="Dexmedetomidine (Precedex)">Dexmedetomidine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "رافعات الضغط الفعالة" : "Active Vasopressors"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.vasopressor || "None"}
                      onChange={(e) => setFormData({ ...formData, vasopressor: e.target.value })}
                    >
                      <option value="None">None</option>
                      <option value="Norepinephrine">Norepinephrine</option>
                      <option value="Epinephrine drip">Epinephrine drip</option>
                      <option value="Vasopressin">Vasopressin</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الفحوصات الطبية والتحاليل المطلوبة" : "Labs Ordered"}</label>
                    <input
                      type="text"
                      placeholder="e.g. ABG q4h, CBC, Electrolytes"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.labs || ""}
                      onChange={(e) => setFormData({ ...formData, labs: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "مستوى التمريض المطلوب" : "Nursing Care Ratio"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.nursingLevel || "1:1"}
                      onChange={(e) => setFormData({ ...formData, nursingLevel: e.target.value })}
                    >
                      <option value="1:1">1:1 Care (Critical)</option>
                      <option value="1:2">1:2 Care (Standard)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "تغذية المريض" : "Nutrition Mode"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.nutrition || "NPO"}
                      onChange={(e) => setFormData({ ...formData, nutrition: e.target.value })}
                    >
                      <option value="NPO">NPO (Nothing by mouth)</option>
                      <option value="Enteral (NG Tube)">Enteral (NG Tube)</option>
                      <option value="TPN (Parenteral)">TPN (Parenteral)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeForm === "fluids" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "نوع السائل الوريدي" : "Fluid Type"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.fluidType || "Normal Saline"}
                      onChange={(e) => setFormData({ ...formData, fluidType: e.target.value })}
                    >
                      <option value="Normal Saline 0.9%">Normal Saline 0.9%</option>
                      <option value="Lactated Ringer's">Lactated Ringer's</option>
                      <option value="Dextrose 5%">Dextrose 5%</option>
                      <option value="Sodium Bicarbonate 8.4%">Sodium Bicarbonate 8.4%</option>
                      <option value="Potassium Chloride drip">Potassium Chloride drip</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "معدل التدفق (مل/ساعة)" : "Rate (ml/hr)"}</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center font-mono"
                      value={formData.rate || ""}
                      onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الحجم الكلي المطلوب" : "Total Volume Limit"}</label>
                    <input
                      type="number"
                      placeholder="500 ml"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.volume || ""}
                      onChange={(e) => setFormData({ ...formData, volume: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "طريق الإعطاء" : "Route"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.route || "Peripheral IV"}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    >
                      <option value="Peripheral IV">{isAr ? "وريد طرفي" : "Peripheral IV"}</option>
                      <option value="Central Line">{isAr ? "قسطرة وريد مركزي" : "Central Line"}</option>
                      <option value="Arterial Line">{isAr ? "شرياني" : "Arterial Line"}</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الإضافات للمحلول" : "Additives"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.additives || "None"}
                      onChange={(e) => setFormData({ ...formData, additives: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeForm === "nursing" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "فترة المناوبة المجدولة" : "Scheduled Shift"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.shift || "Morning"}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    >
                      <option value="Morning">{isAr ? "صباحية (Morning)" : "Morning shift"}</option>
                      <option value="Night">{isAr ? "مسائية/ليلية (Night)" : "Night shift"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم ممرض(ة) الرعاية" : "Primary Nurse Name"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.nurseName || ""}
                      onChange={(e) => setFormData({ ...formData, nurseName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "معدل المرور والجولات" : "Rounding Cycle"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.roundFrequency || "Every 2 hours"}
                      onChange={(e) => setFormData({ ...formData, roundFrequency: e.target.value })}
                    >
                      <option value="Every 2 hours">{isAr ? "كل ساعتين q2h" : "Every 2 hours (q2h)"}</option>
                      <option value="Every 4 hours">{isAr ? "كل 4 ساعات q4h" : "Every 4 hours (q4h)"}</option>
                      <option value="Continuous">{isAr ? "مراقبة مستمرة ملاصقة" : "Continuous bedside presence"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "تنظيف الفم والشفط الدوري" : "Oral Hygiene Required"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.oralCare || "yes"}
                      onChange={(e) => setFormData({ ...formData, oralCare: e.target.value })}
                    >
                      <option value="yes">{isAr ? "نعم" : "Yes"}</option>
                      <option value="no">{isAr ? "لا" : "No"}</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "ملاحظات وتوجيهات تمريضية خاصة" : "Special Nursing Instructions"}</label>
                    <input
                      type="text"
                      placeholder="e.g. Suction q1h, change position, elevate head 30 deg"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.suction || ""}
                      onChange={(e) => setFormData({ ...formData, suction: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeForm === "acuity" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "مقياس APACHE II Score" : "APACHE II Score"}</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.apache || ""}
                      onChange={(e) => setFormData({ ...formData, apache: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "مقياس SOFA لحالة الأعضاء" : "SOFA Score"}</label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.sofa || ""}
                      onChange={(e) => setFormData({ ...formData, sofa: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "فشل أعضاء متعدد؟" : "Multi-organ Failure Status"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.organFailure || "no"}
                      onChange={(e) => setFormData({ ...formData, organFailure: e.target.value })}
                    >
                      <option value="no">{isAr ? "لا" : "No"}</option>
                      <option value="yes">{isAr ? "نعم (أكثر من عضوين)" : "Yes (2+ organs)"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "تصنيف درجة خطورة المريض" : "Severity Classification"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.severityClass || "High Risk"}
                      onChange={(e) => setFormData({ ...formData, severityClass: e.target.value })}
                    >
                      <option value="Extreme High">{isAr ? "خطورة فائقة (Extreme)" : "Extreme High Risk"}</option>
                      <option value="High Risk">{isAr ? "خطورة عالية" : "High Risk"}</option>
                      <option value="Medium Risk">{isAr ? "خطورة متوسطة" : "Medium Risk"}</option>
                      <option value="Low Risk">{isAr ? "خطورة منخفضة" : "Low Risk"}</option>
                    </select>
                  </div>
                </div>
              )}

              {activeForm === "transfer" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "القسم المستلم المستهدف" : "Target Department/Ward"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.ward || ""}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "سبب النقل الطبي والملخص" : "Reason & Summary"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.reason || ""}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الطبيب المستلم للجناح" : "Receiving Doctor"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.receivingDoc || ""}
                      onChange={(e) => setFormData({ ...formData, receivingDoc: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الأجهزة الطبية المطلوبة للنقل" : "Transport Equipment"}</label>
                    <input
                      type="text"
                      placeholder="e.g. Oxygen Cylinder, Transport Vent"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.equipment || ""}
                      onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeForm === "mortuary" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "وقت إعلان الوفاة الفعلي" : "Time of Death Declared"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold font-mono text-center"
                      value={formData.deathTime || ""}
                      onChange={(e) => setFormData({ ...formData, deathTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الطبيب الاستشاري الاستقصائي" : "Declaring Consultant"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.physician || ""}
                      onChange={(e) => setFormData({ ...formData, physician: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "السبب الطبي المباشر للوفاة" : "Primary Cause of Death"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.causeOfDeath || ""}
                      onChange={(e) => setFormData({ ...formData, causeOfDeath: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "هل تم إخطار أقارب الدرجة الأولى؟" : "First Degree Kin Notified?"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.familyNotified || "yes"}
                      onChange={(e) => setFormData({ ...formData, familyNotified: e.target.value })}
                    >
                      <option value="yes">{isAr ? "نعم" : "Yes"}</option>
                      <option value="no">{isAr ? "لا" : "No"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "إخطار المشرحة وتأكيد السرير" : "Mortuary Notified"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.mortuaryNotified || "yes"}
                      onChange={(e) => setFormData({ ...formData, mortuaryNotified: e.target.value })}
                    >
                      <option value="yes">{isAr ? "نعم" : "Yes"}</option>
                      <option value="no">{isAr ? "لا" : "No"}</option>
                    </select>
                  </div>
                </div>
              )}

              {activeForm === "code_blue" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "نبض التوقف الأولي" : "Initial Arrest Rhythm"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.rhythm || "Asystole"}
                      onChange={(e) => setFormData({ ...formData, rhythm: e.target.value })}
                    >
                      <option value="Asystole">Asystole (خط مسطح)</option>
                      <option value="PEA">PEA (نشاط كهربائي بدون نبض)</option>
                      <option value="VF">VF (رجفان بطيني)</option>
                      <option value="Pulseless VT">Pulseless VT (تسارع بطيني بدون نبض)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "حقن الأدرينالين (Epinephrine)" : "Epinephrine Doses"}</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.epiDoses || ""}
                      onChange={(e) => setFormData({ ...formData, epiDoses: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الصدمات الكهربائية المصروفة" : "DC Shocks Delivered"}</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.shocksCount || ""}
                      onChange={(e) => setFormData({ ...formData, shocksCount: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "مدة الإنعاش (بالدقائق)" : "CPR Duration (mins)"}</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={formData.duration || ""}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "قائد فريق الإنعاش (Resus Leader)" : "CPR Team Leader"}</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.leader || ""}
                      onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "النتيجة النهائية الفورية للإنعاش" : "CPR Final Outcome"}</label>
                    <select
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold"
                      value={formData.outcome || "ROSC Achieved (استعادة النبض)"}
                      onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    >
                      <option value="ROSC Achieved (استعادة النبض)">ROSC Achieved (تم استعادة النبض والدورة الدموية)</option>
                      <option value="CPR Terminated - Declared Dead">CPR Terminated - Declared Dead (إعلان الوفاة وتوقف الإنعاش)</option>
                      <option value="Transferred on active CPR">Transferred on active CPR (نقل مع استمرار الإنعاص الميكانيكي)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-black py-3 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isAr ? "تأكيد وتسجيل البيانات" : "Confirm & Save Entry"}
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveForm(null); setFormData({}); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl text-sm transition"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
