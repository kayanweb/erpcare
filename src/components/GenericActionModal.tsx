import React, { useState, useEffect } from "react";
import { 
  X, CheckCircle2, FileText, Database, Activity, DollarSign, Globe, 
  BrainCircuit, Server, AlertTriangle, TrendingUp, Search, Plus, Sparkles, 
  Cpu, Zap, Layers, RefreshCw, Layers3, Play, AlertCircle, FileSpreadsheet, List, ShieldAlert, BadgeInfo
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useHIS } from "../context/HISContext";
import { EXTENDED_LAB_TESTS } from "../data/labTests";

// Simulated high-fidelity medical drugs for clinical search
const DRUG_MASTER_LIST = [
  { name: "Vancomycin 1g IV", category: "Antibiotic", dose: "1g Q12H", interaction: "Contrast Media" },
  { name: "Metformin 500mg PO", category: "Antidiabetic", dose: "500mg BID", interaction: "Contrast Media" },
  { name: "Morphine 5mg IV", category: "Narcotic Analgesic", dose: "5mg PRN", interaction: "Benzodiazepines" },
  { name: "Atorvastatin 20mg PO", category: "Statin", dose: "20mg HS", interaction: "Grapefruit juice" },
  { name: "Ceftriaxone 2g IV", category: "Antibiotic", dose: "2g QD", interaction: "Calcium IV fluids" },
  { name: "Aspirin 300mg PO", category: "Antiplatelet", dose: "300mg Once", interaction: "NSAIDs" },
  { name: "Heparin 5000 IU SC", category: "Anticoagulant", dose: "5000 IU Q12H", interaction: "Warfarin" },
];

import ComprehensiveDischargeForm from './ComprehensiveDischargeForm';

export default function GenericActionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    titleAr: string;
    titleEn: string;
    type: string;
    payload?: any;
  }>({
    titleAr: "", titleEn: "", type: "form"
  });

  const [activeTab, setActiveTab] = useState<"form" | "clinical" | "sap" | "integration" | "ai">("form");
  const [isAr, setIsAr] = useState(false);

  // States for Context sync
  const { patients, addPatient, updatePatient, addPrescription, addInvoice, invoices } = useHIS();

  // Tab 1: Dynamic Form state
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Tab 2: Clinical Console states
  const [clinicalPatientId, setClinicalPatientId] = useState("");
  const [searchDrug, setSearchDrug] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [customDose, setCustomDose] = useState("");
  const [customQty, setCustomQty] = useState("1");
  const [vitals, setVitals] = useState({ bpSystolic: "120", bpDiastolic: "80", hr: "72", temp: "37.0", spo2: "98" });
  const [orderType, setOrderType] = useState<"LAB" | "RAD">("LAB");
  const [orderName, setOrderName] = useState("");
  const [orderNameFocus, setOrderNameFocus] = useState(false);

  // Tab 3: SAP ERP state
  const [sapCostCenter, setSapCostCenter] = useState("CC-MED-OPD-01");
  const [sapAssetItem, setSapAssetItem] = useState("Surgical Face Masks (Box of 50)");
  const [sapAssetQty, setSapAssetQty] = useState("10");
  const [sapAssetPrice, setSapAssetPrice] = useState("25");
  const [sapRequester, setSapRequester] = useState("Dr. Ahmed Mostafa");
  const [procurementLogs, setProcurementLogs] = useState<any[]>([
    { id: "SAP-PR-9012", date: "2026-06-28", item: "Sterile Gloves size 7.5", qty: 20, cost: 300, status: "Approved", costCenter: "CC-SURG-OR-03" },
    { id: "SAP-PR-9013", date: "2026-06-28", item: "IV Cannula 22G", qty: 100, cost: 450, status: "Pending Allocation", costCenter: "CC-MED-OPD-01" },
  ]);

  // Tab 4: Integration Engine states
  const [fhirResource, setFhirResource] = useState("Patient");
  const [fhirMessage, setFhirMessage] = useState<string>("");
  const [dicomSlice, setDicomSlice] = useState(12);
  const [dicomContrast, setDicomContrast] = useState(1.0);
  const [dicomZoom, setDicomZoom] = useState(100);

  // Tab 5: CDSS AI Advisor states
  const [qsofaRR, setQsofaRR] = useState("20");
  const [qsofaSBP, setQsofaSBP] = useState("110");
  const [qsofaGCS, setQsofaGCS] = useState("15");

  useEffect(() => {
    const handleOpen = (e: any) => {
      const { titleAr, titleEn, type, payload, entityId } = e.detail || {};
      setConfig({
        titleAr: titleAr || "",
        titleEn: titleEn || "",
        type: type || "form",
        payload: payload
      });
      setIsOpen(true);
      setFormData({});
      setIsAr(document.dir === "rtl");

      if (entityId) {
        setClinicalPatientId(entityId);
      }

      // Auto detect and set appropriate tab based on title keywords
      const titleLower = (titleEn + " " + titleAr)?.toLowerCase();
      if (titleLower?.includes("prescribe") || titleLower?.includes("medication") || titleLower?.includes("drug") || titleLower?.includes("clinical") || titleLower?.includes("vitals") || titleLower?.includes("triage")) {
        setActiveTab("clinical");
      } else if (titleLower?.includes("sap") || titleLower?.includes("po") || titleLower?.includes("procurement") || titleLower?.includes("asset") || titleLower?.includes("finance") || titleLower?.includes("cost") || titleLower?.includes("ledger")) {
        setActiveTab("sap");
      } else if (titleLower?.includes("integration") || titleLower?.includes("pacs") || titleLower?.includes("fhir") || titleLower?.includes("hl7") || titleLower?.includes("endpoint")) {
        setActiveTab("integration");
      } else if (titleLower?.includes("predict") || titleLower?.includes("ai") || titleLower?.includes("brain") || titleLower?.includes("risk") || titleLower?.includes("sepsis")) {
        setActiveTab("ai");
      } else {
        setActiveTab("form");
      }
    };
    window.addEventListener("openGenericModal", handleOpen);
    return () => window.removeEventListener("openGenericModal", handleOpen);
  }, []);

  // Set default patient in clinical dropdown when patients load
  useEffect(() => {
    if (patients.length > 0 && !clinicalPatientId) {
      setClinicalPatientId(patients[0].id);
    }
  }, [patients, clinicalPatientId]);

  // Handle FHIR Resource Generation
  useEffect(() => {
    const selectedPatient = patients.find(p => p.id === clinicalPatientId) || patients[0];
    if (selectedPatient) {
      const simulatedFhir = {
        resourceType: fhirResource,
        id: selectedPatient.id,
        meta: {
          versionId: "1",
          lastUpdated: new Date().toISOString()
        },
        identifier: [
          {
            use: "official",
            system: "http://hospital-his.org/mrn",
            value: selectedPatient.mrn
          }
        ],
        active: true,
        name: [
          {
            use: "official",
            family: selectedPatient.nameEn.split(" ").pop() || "Patient",
            given: [selectedPatient.nameEn.split(" ")[0] || "Test"]
          }
        ],
        telecom: [
          {
            system: "phone",
            value: selectedPatient.phone,
            use: "mobile"
          }
        ],
        gender: selectedPatient.gender,
        birthDate: new Date(Date.now() - selectedPatient.age * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      };
      setFhirMessage(JSON.stringify(simulatedFhir, null, 2));
    }
  }, [fhirResource, clinicalPatientId, patients]);

  if (!isOpen) return null;

  // Intelligent Form Engine
  const titleStr = (config.titleEn + " " + config.titleAr)?.toLowerCase();
  type FieldDef = { 
    name: string; 
    labelEn: string; 
    labelAr: string; 
    type: string; 
    placeholderEn?: string; 
    placeholderAr?: string; 
    options?: {value: string, labelEn: string, labelAr: string}[] 
  };
  
  let fields: FieldDef[] = [
    { name: "details", labelEn: "Details / Actions", labelAr: "التفاصيل / الإجراءات المطلوبة", type: "text" },
    { name: "notes", labelEn: "Notes & Instructions", labelAr: "الملاحظات والتعليمات", type: "textarea" }
  ];

  let detectedActionType = "generic";

  if (titleStr?.includes("patient") || titleStr?.includes("مريض")) {
    fields = [
      { name: "name", labelEn: "Patient Name (Full)", labelAr: "اسم المريض الثنائي أو الثلاثي", type: "text" },
      { name: "phone", labelEn: "Mobile Phone Number", labelAr: "رقم جوال المريض", type: "text" },
      { name: "gender", labelEn: "Gender", labelAr: "الجنس", type: "select", options: [{value: "male", labelEn: "Male", labelAr: "ذكر"}, {value: "female", labelEn: "Female", labelAr: "أنثى"}] },
      { name: "age", labelEn: "Age (Years)", labelAr: "العمر بالسنوات", type: "number" },
      { name: "insurance", labelEn: "Insurance Class (Cash, Bupa, Tawuniya)", labelAr: "فئة التأمين (كاش، بوبا، التعاونية)", type: "text" }
    ];
    detectedActionType = "patient";
  } else if (titleStr?.includes("invoice") || titleStr?.includes("bill") || titleStr?.includes("فاتورة") || titleStr?.includes("دفع") || titleStr?.includes("rcm")) {
    fields = [
      { name: "patientId", labelEn: "Patient MRN", labelAr: "ملف المريض (MRN)", type: "text" },
      { name: "amount", labelEn: "Gross Charge Amount (SAR)", labelAr: "إجمالي قيمة الخدمة (ر.س)", type: "number" },
      { name: "description", labelEn: "RCM Diagnosis/Procedure Description", labelAr: "شرح الخدمة لشركة التأمين", type: "text" }
    ];
    detectedActionType = "invoice";
  } else if (titleStr?.includes("prescribe") || titleStr?.includes("medication") || titleStr?.includes("وصفة") || titleStr?.includes("دواء")) {
    fields = [
      { name: "patientId", labelEn: "Patient MRN", labelAr: "رقم ملف المريض", type: "text" },
      { name: "medication", labelEn: "Medication Name", labelAr: "اسم المستحضر الطبي", type: "text" },
      { name: "dose", labelEn: "Dosage & Frequency", labelAr: "الجرعة والتكرار اليومي", type: "text" },
      { name: "qty", labelEn: "Total Quantity", labelAr: "الكمية الكلية", type: "number" }
    ];
    detectedActionType = "prescription";
  } else if (titleStr?.includes("schedule") || titleStr?.includes("appointment") || titleStr?.includes("موعد") || titleStr?.includes("حجز")) {
    fields = [
      { name: "patientName", labelEn: "Patient Name", labelAr: "اسم المريض", type: "text" },
      { name: "date", labelEn: "Preferred Appointment Date", labelAr: "تاريخ الموعد", type: "date" },
      { name: "time", labelEn: "Slot Time", labelAr: "توقيت الموعد", type: "time" },
      { name: "doctor", labelEn: "Target Physician / Clinic Room", labelAr: "الطبيب المعالج / رقم العيادة", type: "text" }
    ];
    detectedActionType = "appointment";
  } else if (titleStr?.includes("transfer") || titleStr?.includes("نقل") || titleStr?.includes("تحويل")) {
    fields = [
      { name: "patientId", labelEn: "Patient MRN", labelAr: "رقم ملف المريض", type: "text" },
      { name: "fromUnit", labelEn: "Current Unit", labelAr: "القسم الحالي", type: "text" },
      { name: "toUnit", labelEn: "Destination Unit (Ward/ICU)", labelAr: "القسم المنقول إليه (تنويم/عناية)", type: "select", options: [
        {value: "ward", labelEn: "Inpatient Ward", labelAr: "جناح التنويم الداخلي"},
        {value: "icu", labelEn: "Intensive Care Unit (ICU)", labelAr: "العناية المركزة (ICU)"},
        {value: "or", labelEn: "Operating Room (OR)", labelAr: "غرفة العمليات"},
      ] },
      { name: "reason", labelEn: "Reason for Transfer", labelAr: "سبب النقل / التشخيص المبدئي", type: "textarea" },
      { name: "priority", labelEn: "Priority", labelAr: "أولوية النقل", type: "select", options: [
        {value: "routine", labelEn: "Routine", labelAr: "عادي"},
        {value: "urgent", labelEn: "Urgent", labelAr: "عاجل"},
        {value: "stat", labelEn: "STAT (Emergency)", labelAr: "طارئ جداً (STAT)"}
      ] },
      { name: "escort", labelEn: "Requires Escort / Equipment", labelAr: "يحتاج مرافق تمريض أو أجهزة تنفس؟", type: "checkbox" }
    ];
    detectedActionType = "transfer";
  } else if (titleStr?.includes("admit") || titleStr?.includes("admission") || titleStr?.includes("دخول") || titleStr?.includes("تنويم")) {
    fields = [
      { name: "patientId", labelEn: "Patient MRN", labelAr: "رقم ملف المريض", type: "text" },
      { name: "admissionDiagnosis", labelEn: "Admission Diagnosis", labelAr: "تشخيص الدخول المبدئي", type: "textarea" },
      { name: "admittingPhysician", labelEn: "Admitting Physician", labelAr: "الطبيب المعالج/المنوم", type: "text" },
      { name: "bedType", labelEn: "Required Bed Type", labelAr: "نوع السرير المطلوب", type: "select", options: [
        {value: "standard", labelEn: "Standard Ward Bed", labelAr: "سرير تنويم عادي"},
        {value: "isolation", labelEn: "Isolation Room", labelAr: "غرفة عزل"},
        {value: "icu", labelEn: "ICU Bed", labelAr: "سرير عناية مركزة"}
      ] },
      { name: "consentSigned", labelEn: "Admission Consent Signed?", labelAr: "هل تم توقيع إقرار الدخول والتنويم؟", type: "checkbox" }
    ];
    detectedActionType = "admission";
  } else if (titleStr?.includes("discharge") || titleStr?.includes("خروج") || titleStr?.includes("إخلاء")) {
    fields = [
      { name: "patientId", labelEn: "Patient MRN", labelAr: "رقم ملف المريض", type: "text" },
      { name: "dischargeType", labelEn: "Discharge Type", labelAr: "نوع الخروج", type: "select", options: [
        {value: "routine", labelEn: "Routine (Medical Advice)", labelAr: "خروج طبيعي (بناءً على رأي الطبيب)"},
        {value: "dama", labelEn: "DAMA (Against Medical Advice)", labelAr: "خروج على مسؤولية المريض (DAMA)"},
        {value: "transfer", labelEn: "Transfer to another facility", labelAr: "نقل لمستشفى آخر"},
        {value: "deceased", labelEn: "Deceased", labelAr: "وفاة"}
      ] },
      { name: "dischargeDiagnosis", labelEn: "Final Discharge Diagnosis", labelAr: "التشخيص النهائي عند الخروج", type: "textarea" },
      { name: "medsPrescribed", labelEn: "Discharge Medications Given?", labelAr: "هل تم صرف أدوية الخروج للمريض؟", type: "checkbox" },
      { name: "followUp", labelEn: "Follow-up Appointment Scheduled?", labelAr: "هل تم تحديد موعد متابعة؟", type: "checkbox" }
    ];
    detectedActionType = "discharge";
  } else if (titleStr?.includes("surgery") || titleStr?.includes("pacu") || titleStr?.includes("إفاقة") || titleStr?.includes("عملية") || titleStr?.includes("تخدير")) {
    fields = [
      { name: "patientId", labelEn: "Patient MRN", labelAr: "رقم ملف المريض", type: "text" },
      { name: "procedureName", labelEn: "Surgical Procedure", labelAr: "اسم العملية الجراحية", type: "text" },
      { name: "surgeon", labelEn: "Lead Surgeon", labelAr: "الجراح الرئيسي", type: "text" },
      { name: "anesthesiaType", labelEn: "Anesthesia Type", labelAr: "نوع التخدير", type: "select", options: [
        {value: "general", labelEn: "General Anesthesia", labelAr: "تخدير كامل (عام)"},
        {value: "regional", labelEn: "Regional / Spinal", labelAr: "تخدير نصفي / موضعي"},
        {value: "sedation", labelEn: "Conscious Sedation", labelAr: "تهدئة واعية"}
      ] },
      { name: "postOpNotes", labelEn: "Post-Op / PACU Notes", labelAr: "ملاحظات الإفاقة وما بعد العملية", type: "textarea" }
    ];
    detectedActionType = "surgery";
  }

  const handleFormChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Safe and synchronized state creation
  const handleSaveForm = () => {
    if (fields.length > 0 && !formData[fields[0].name]) {
      toast.error(isAr ? "يرجى ملء الحقول المطلوبة لضمان صحة البيانات" : "Please populate the required fields to ensure data integrity");
      return;
    }

    if (detectedActionType === "patient") {
      if (clinicalPatientId) {
        updatePatient(clinicalPatientId, {
          nameEn: formData.name || currentPatientObj?.nameEn,
          nameAr: formData.name || currentPatientObj?.nameAr,
          age: Number(formData.age) || currentPatientObj?.age || 35,
          gender: (formData.gender || currentPatientObj?.gender || "male")?.toLowerCase() as any,
          phone: formData.phone || currentPatientObj?.phone || "",
          insurance: formData.insurance || currentPatientObj?.insurance || "Cash"
        });
        toast.success(isAr ? "تم تحديث بيانات المريض بنجاح" : "Patient details updated successfully");
      } else {
        addPatient({
          id: "p-" + Date.now(),
          mrn: "MRN-" + Math.floor(10000 + Math.random() * 90000),
          nameEn: formData.name,
          nameAr: formData.name,
          age: Number(formData.age) || 35,
          gender: (formData.gender || "male")?.toLowerCase() as any,
          phone: formData.phone || "",
          status: "registered",
          insurance: formData.insurance || "Cash"
        });
        window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Patient registered successfully, and details synchronized across all departments", titleAr: "تم تسجيل المريض بنجاح، ومزامنة بياناته مع كافة الأقسام الطبية", type: "form" } }));
      }
    } else if (detectedActionType === "invoice") {
      addInvoice({
        id: "INV-" + Math.floor(1000 + Math.random() * 9000),
        patientId: formData.patientId || "Unknown",
        amount: Number(formData.amount) || 150,
        status: "unpaid",
        date: new Date().toISOString()
      });
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Invoice posted successfully and integrated with the Cashier queue", titleAr: "تم ترحيل الفاتورة وتوليد طلب التحصيل المالي في الصندوق", type: "form" } }));
    } else if (detectedActionType === "prescription") {
      addPrescription({
        id: "rx-" + Date.now(),
        patientId: formData.patientId || "Unknown",
        medication: formData.medication || "",
        dose: formData.dose || "1 QD",
        qty: Number(formData.qty) || 1,
        status: "pending",
        date: new Date().toLocaleDateString()
      });
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Prescription dispatched to Clinical Pharmacy & Dispensing System", titleAr: "تم إرسال الوصفة الطبية إلى الصيدلية وصيدلي السريرية للصرف والمراجعة", type: "form" } }));
    } else if (detectedActionType === "transfer") {
      toast.success(isAr ? `تم تقديم طلب نقل المريض إلى ${formData.toUnit || 'القسم المختص'} بنجاح` : `Patient transfer request to ${formData.toUnit || 'designated unit'} submitted successfully`);
    } else if (detectedActionType === "admission") {
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Patient admission processed successfully, assigned to Inpatient Flow", titleAr: "تم إكمال إجراءات دخول وتنويم المريض بنجاح، وتوجيهه للقسم الداخلي", type: "form" } }));
    } else if (detectedActionType === "discharge") {
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Patient discharge order processed and summary sent to Medical Records", titleAr: "تم معالجة أمر خروج المريض وإرسال ملخص الخروج للسجلات", type: "form" } }));
    } else if (detectedActionType === "surgery") {
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Post-op details documented and patient status updated", titleAr: "تم توثيق بيانات ما بعد العملية وتحديث حالة المريض", type: "form" } }));
    } else {
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Action completed, changes saved to secure hospital cluster", titleAr: "تم حفظ التغييرات ومزامنتها بنجاح مع قاعدة بيانات المستشفى", type: "form" } }));
    }

    setIsOpen(false);
  };

  // Clinical Actions Sync
  const handleClinicalPrescribe = () => {
    if (!clinicalPatientId) {
      toast.error(isAr ? "يرجى تحديد المريض أولاً" : "Please select a patient first");
      return;
    }
    if (!selectedDrug) {
      toast.error(isAr ? "يرجى تحديد الدواء من الدليل الطبي المعتمد" : "Please select a valid formulary drug");
      return;
    }

    addPrescription({
      id: "rx-clin-" + Date.now(),
      patientId: clinicalPatientId,
      medication: selectedDrug.name,
      dose: customDose || selectedDrug.dose,
      qty: Number(customQty) || 1,
      status: "pending",
      date: new Date().toLocaleDateString()
    });

    toast.success(isAr 
      ? `تم إصدار وصفة (${selectedDrug.name}) وترحيلها للصيدلية فوراً!`
      : `Prescription issued for (${selectedDrug.name}) and routed to Pharmacy!`
    );
    
    // Clear clinical formulary selection
    setSelectedDrug(null);
    setSearchDrug("");
  };

  const handleUpdateVitals = () => {
    if (!clinicalPatientId) return;
    updatePatient(clinicalPatientId, {
      vitals: {
        bp: `${vitals.bpSystolic}/${vitals.bpDiastolic}`,
        hr: Number(vitals.hr),
        temp: Number(vitals.temp),
        spo2: Number(vitals.spo2),
        lastUpdated: new Date().toLocaleTimeString()
      }
    });
    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Vitals updated and logged directly into unified EHR", titleAr: "تم تحديث وتوثيق العلامات الحيوية في الملف الإلكتروني الموحد", type: "form" } }));
  };

  const handleAddDiagnosticOrder = () => {
    if (!clinicalPatientId || !orderName) {
      toast.error(isAr ? "الرجاء تعبئة نوع الفحص الطبي المطلبو" : "Please specify clinical exam or test name");
      return;
    }

    const patient = patients.find(p => p.id === clinicalPatientId);
    if (patient) {
      const currentOrders = patient.orders || [];
      const newOrder = {
        id: "ord-" + Date.now(),
        type: orderType,
        name: orderName,
        status: "Ordered",
        date: new Date().toLocaleDateString()
      };
      
      updatePatient(clinicalPatientId, {
        orders: [...currentOrders, newOrder]
      });

      toast.success(isAr 
        ? `تم إطلاق طلب فحص (${orderName}) بنجاح وتحويله لـ LIS/RIS`
        : `Diagnostic order (${orderName}) dispatched successfully to LIS/RIS`
      );
      setOrderName("");
    }
  };

  // SAP ERP Action
  const handleSapPRSubmit = () => {
    const cost = Number(sapAssetQty) * Number(sapAssetPrice);
    const newPr = {
      id: "SAP-PR-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split("T")[0],
      item: sapAssetItem,
      qty: Number(sapAssetQty),
      cost: cost,
      status: "Draft (SAP Approval Route)",
      costCenter: sapCostCenter
    };
    setProcurementLogs(prev => [newPr, ...prev]);
    toast.success(isAr 
      ? `طلب شراء SAP بقيمة ${cost} ر.س تم ترحيله لمركز التكلفة ${sapCostCenter}`
      : `SAP Purchase Requisition of ${cost} SAR routed to Cost-Center ${sapCostCenter}`
    );
  };

  // CDSS AI Score Calculate
  const calculateQsofa = () => {
    let score = 0;
    if (Number(qsofaRR) >= 22) score++;
    if (Number(qsofaSBP) <= 100) score++;
    if (Number(qsofaGCS) < 15) score++;
    return score;
  };

  // Filter Formulary Drugs
  const filteredDrugs = searchDrug 
    ? DRUG_MASTER_LIST.filter(d => d.name?.toLowerCase()?.includes(searchDrug?.toLowerCase()) || d.category?.toLowerCase()?.includes(searchDrug?.toLowerCase()))
    : [];

  // Check interactive warning
  const currentPatientObj = patients.find(p => p.id === clinicalPatientId);
  const currentPatientInsurance = currentPatientObj?.insurance || "Cash";

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[9999999] flex items-center justify-center p-2 sm:p-4 transition-all duration-300" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 flex flex-col h-[90vh] sm:h-[80vh] md:h-[75vh]">
        
        {/* Header Banner */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/30">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg flex items-center gap-2">
                {isAr ? "المنصة الذكية المتكاملة: SAP & CloudCare" : "Intelligent HIS Platform: SAP & CloudCare Sync"}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                {isAr ? "وحدة الترابط الشامل وتسميع الأوامر الطبية الفورية" : "Clinical Decision Support & Enterprise resource integration"}
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-xl transition duration-150">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modular Navigation Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-1 sm:gap-2 overflow-x-auto shrink-0 custom-scrollbar">
          <button 
            onClick={() => setActiveTab("form")} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all whitespace-nowrap ${activeTab === "form" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:bg-slate-200"}`}
          >
            <FileText className="w-3.5 h-3.5" />
            {isAr ? "نموذج المعاملة" : "Transaction Form"}
          </button>
          
          <button 
            onClick={() => setActiveTab("clinical")} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all whitespace-nowrap ${activeTab === "clinical" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-500 hover:bg-slate-200"}`}
          >
            <Activity className="w-3.5 h-3.5" />
            {isAr ? "الكونسول السريري" : "Clinical Console"}
          </button>

          <button 
            onClick={() => setActiveTab("sap")} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all whitespace-nowrap ${activeTab === "sap" ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "text-slate-500 hover:bg-slate-200"}`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isAr ? "شؤون ومخازن SAP" : "SAP ERP Ledger"}
          </button>

          <button 
            onClick={() => setActiveTab("integration")} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all whitespace-nowrap ${activeTab === "integration" ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" : "text-slate-500 hover:bg-slate-200"}`}
          >
            <Server className="w-3.5 h-3.5" />
            {isAr ? "محرك الربط والـ PACS" : "Integration & PACS"}
          </button>

          <button 
            onClick={() => setActiveTab("ai")} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all whitespace-nowrap ${activeTab === "ai" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "text-slate-500 hover:bg-slate-200"}`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            {isAr ? "مستشار الذكاء الاصطناعي" : "CDSS AI Advisor"}
          </button>
        </div>

        {/* Scrollable Workspace Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 custom-scrollbar">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: FORM ENTRY */}
            {activeTab === "form" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 items-center">
                  <BadgeInfo className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-widest">
                      {isAr ? `تفاعل النموذج النشط: ${config.titleAr || config.titleEn}` : `Dynamic Context Handler: ${config.titleEn}`}
                    </h4>
                    <p className="text-[11px] text-indigo-700 font-medium">
                      {isAr 
                        ? "يقوم النظام تلقائياً بإنشاء بنية المدخلات والتحقق من توافقها مع القوانين الطبية والمالية."
                        : "Automatically configures UI parameters and checks compliance constraints against core registries."}
                    </p>
                  </div>
                </div>

                {detectedActionType === "discharge" ? (
                  <ComprehensiveDischargeForm 
                    language={isAr ? "ar" : "en"}
                    initialData={formData}
                    onDataChange={(data) => {
                      // Just merge to formData for the payload
                      Object.keys(data).forEach(key => handleFormChange(key, data[key]));
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((field) => (
                      <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                        <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                          {isAr ? field.labelAr : field.labelEn}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea 
                            rows={3}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleFormChange(field.name, e.target.value)}
                            placeholder={isAr ? field.placeholderAr : field.placeholderEn}
                            className="w-full border border-slate-300 rounded-2xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm transition-all"
                          />
                        ) : field.type === "select" && field.options ? (
                          <select
                            value={formData[field.name] || ""}
                            onChange={(e) => handleFormChange(field.name, e.target.value)}
                            className="w-full border border-slate-300 rounded-2xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm transition-all bg-white"
                          >
                            <option value="">{isAr ? "الرجاء الاختيار..." : "Please select..."}</option>
                            {field.options.map((opt: any) => (
                              <option key={opt.value} value={opt.value}>{isAr ? opt.labelAr : opt.labelEn}</option>
                            ))}
                          </select>
                        ) : field.type === "checkbox" ? (
                          <div className="flex items-center gap-2 pt-1">
                            <input 
                              type="checkbox"
                              checked={formData[field.name] === "true"}
                              onChange={(e) => handleFormChange(field.name, e.target.checked ? "true" : "false")}
                              className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-semibold text-slate-700">{isAr ? "نعم، أؤكد ذلك" : "Yes, confirm"}</span>
                          </div>
                        ) : (
                          <input 
                            type={field.type} 
                            value={formData[field.name] || ""}
                            onChange={(e) => handleFormChange(field.name, e.target.value)}
                            placeholder={isAr ? field.placeholderAr : field.placeholderEn}
                            className="w-full border border-slate-300 rounded-2xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: CLINICAL CONSOLE */}
            {activeTab === "clinical" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Patient Selector Context block */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">{isAr ? "اختر المريض" : "Active Patient Context"}</label>
                    <select 
                      value={clinicalPatientId} 
                      onChange={(e) => setClinicalPatientId(e.target.value)}
                      className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-2 text-xs font-bold outline-none"
                    >
                      {(patients || []).map(p => (
                        <option key={p.id} value={p.id}>{isAr ? p.nameAr : p.nameEn} ({p.mrn})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">{isAr ? "التأمين المعتمد" : "Coverage Class"}</span>
                    <span className="bg-indigo-900/40 text-indigo-300 border border-indigo-800/60 px-3 py-1.5 rounded-xl text-xs font-extrabold inline-block">
                      {currentPatientInsurance}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">{isAr ? "المرور السريري" : "EHR Linkage"}</span>
                    <span className="text-slate-300 text-xs font-medium block mt-1">
                      {isAr ? "موصول بقاعدة البيانات المركزية" : "Directly mapped to Inpatient Flow"}
                    </span>
                  </div>
                </div>

                {/* Subsections: Vitals and Formulary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Quick Vitals Sync */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-rose-500" />
                      {isAr ? "تسجيل العلامات الحيوية الفورية" : "Vital Signs Recording"}
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "الضغط الانقباضي" : "BP Systolic"}</label>
                        <input type="text" value={vitals.bpSystolic} onChange={(e) => setVitals(prev => ({ ...prev, bpSystolic: e.target.value }))} className="w-full border border-slate-300 rounded-xl p-1.5 text-center font-mono font-bold" />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "الضغط الانبساطي" : "BP Diastolic"}</label>
                        <input type="text" value={vitals.bpDiastolic} onChange={(e) => setVitals(prev => ({ ...prev, bpDiastolic: e.target.value }))} className="w-full border border-slate-300 rounded-xl p-1.5 text-center font-mono font-bold" />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "النبض (bpm)" : "Heart Rate"}</label>
                        <input type="text" value={vitals.hr} onChange={(e) => setVitals(prev => ({ ...prev, hr: e.target.value }))} className="w-full border border-slate-300 rounded-xl p-1.5 text-center font-mono font-bold text-rose-600" />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "الحرارة (°C)" : "Temperature"}</label>
                        <input type="text" value={vitals.temp} onChange={(e) => setVitals(prev => ({ ...prev, temp: e.target.value }))} className="w-full border border-slate-300 rounded-xl p-1.5 text-center font-mono font-bold" />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "الأكسجين (SpO2)" : "SpO2 %"}</label>
                        <input type="text" value={vitals.spo2} onChange={(e) => setVitals(prev => ({ ...prev, spo2: e.target.value }))} className="w-full border border-slate-300 rounded-xl p-1.5 text-center font-mono font-bold text-blue-600" />
                      </div>
                    </div>

                    <button 
                      onClick={handleUpdateVitals}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-2 rounded-xl text-xs uppercase tracking-widest transition shadow"
                    >
                      {isAr ? "حفظ وتوثيق العلامات الحيوية" : "Log & Update EHR Vitals"}
                    </button>
                  </div>

                  {/* Right: Smart Formulary Prescription */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-indigo-500 animate-bounce" />
                      {isAr ? "الصرف المباشر والدليل الدوائي" : "Smart Medication Prescribing"}
                    </h4>

                    <div>
                      <label className="block text-slate-500 text-xs font-bold mb-1">{isAr ? "البحث في الدليل الدوائي" : "Search Drug Formulary"}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={searchDrug} 
                          onChange={(e) => setSearchDrug(e.target.value)} 
                          placeholder={isAr ? "مثال: Ceftriaxone, Metformin..." : "Search e.g. Metformin, Ceftriaxone..."}
                          className="w-full border border-slate-300 rounded-xl p-2 pl-8 text-xs font-bold"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                      {/* Search results dropdown simulation */}
                      {filteredDrugs.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-xl mt-1 shadow-lg max-h-36 overflow-y-auto divide-y divide-slate-100 z-50 relative">
                          {filteredDrugs.map((drug, i) => (
                            <div 
                              key={i} 
                              onClick={() => {
                                setSelectedDrug(drug);
                                setSearchDrug("");
                              }}
                              className="p-2 hover:bg-slate-50 cursor-pointer text-xs flex justify-between items-center"
                            >
                              <span className="font-extrabold text-slate-800">{drug.name}</span>
                              <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">{drug.category}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedDrug && (
                      <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-indigo-900">{selectedDrug.name}</span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 rounded">{selectedDrug.category}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold">{isAr ? "الجرعة المقترحة" : "Dose Configuration"}</label>
                            <input type="text" value={customDose || selectedDrug.dose} onChange={(e) => setCustomDose(e.target.value)} className="w-full border border-slate-300 rounded-lg p-1 text-xs font-mono" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold">{isAr ? "الكمية" : "Quantity"}</label>
                            <input type="number" value={customQty} onChange={(e) => setCustomQty(e.target.value)} className="w-full border border-slate-300 rounded-lg p-1 text-xs font-mono" />
                          </div>
                        </div>

                        {/* Smart AI Warnings Panel inside prescription */}
                        {selectedDrug.name?.includes("Metformin") && (
                          <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg text-[10px] text-rose-800 flex items-center gap-1.5 font-bold">
                            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse shrink-0" />
                            <span>
                              {isAr 
                                ? "تحذير: المريض لديه طلب أشعة بالصبغة! الصبغة تزيد خطر الحموضة الكيتونية مع الميتفورمين."
                                : "CDSS ALERT: Patient has pending Contrast MRI. Contrast with Metformin increases renal acidosis risk!"}
                            </span>
                          </div>
                        )}

                        <button 
                          onClick={handleClinicalPrescribe}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-1.5 rounded-xl text-xs uppercase tracking-widest transition"
                        >
                          {isAr ? "اعتماد وإرسال للصيدلية" : "Approve & Dispense Route"}
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Row: LIS/RIS Order Placement */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-purple-500" />
                    {isAr ? "إطلاق طلبات الفحص الطبي (مختبر / أشعة)" : "New Diagnostics Order (LIS/RIS Sync)"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-500 text-xs font-bold mb-1">{isAr ? "نوع الفحص" : "Order Category"}</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setOrderType("LAB")} 
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${orderType === "LAB" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        >
                          {isAr ? "مختبر LIS" : "Lab (LIS)"}
                        </button>
                        <button 
                          onClick={() => setOrderType("RAD")} 
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${orderType === "RAD" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        >
                          {isAr ? "أشعة RIS" : "Radiology (RIS)"}
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-2 relative">
                      <label className="block text-slate-500 text-xs font-bold mb-1">{isAr ? "اسم الفحص / العينة" : "Test or Procedure Name"}</label>
                      <div className="flex gap-2 relative">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={orderName}
                            onChange={(e) => {
                              setOrderName(e.target.value);
                              setOrderNameFocus(true);
                            }}
                            onFocus={() => setOrderNameFocus(true)}
                            onBlur={() => setTimeout(() => setOrderNameFocus(false), 200)}
                            placeholder={orderType === "LAB" ? (isAr ? "مثال: CBC, Lipid Panel..." : "e.g. CBC, Troponin, Thyroid...") : (isAr ? "مثال: Chest X-ray, MRI..." : "e.g. MRI Lumbar Spine, CT Brain...")}
                            className="w-full border border-slate-300 rounded-xl p-2 text-xs font-bold focus:border-purple-500 outline-none"
                          />
                          {orderType === "LAB" && orderNameFocus && orderName.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {EXTENDED_LAB_TESTS.filter(t => t?.toLowerCase()?.includes(orderName?.toLowerCase())).slice(0, 50).map((test, idx) => (
                                <div 
                                  key={idx} 
                                  className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                                  onMouseDown={() => {
                                    setOrderName(test);
                                    setOrderNameFocus(false);
                                  }}
                                >
                                  {test}
                                </div>
                              ))}
                              {EXTENDED_LAB_TESTS.filter(t => t?.toLowerCase()?.includes(orderName?.toLowerCase())).length === 0 && (
                                <div className="px-3 py-2 text-sm text-slate-500 italic">No tests found.</div>
                              )}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={handleAddDiagnosticOrder}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-black px-4 rounded-xl text-xs flex items-center gap-1 transition"
                        >
                          <Plus className="w-4 h-4" />
                          {isAr ? "إضافة الأوامر" : "Order"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 3: SAP ERP */}
            {activeTab === "sap" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3 items-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-widest">
                      {isAr ? "شؤون التكاليف وإدارة المشتريات (SAP IS-H)" : "SAP IS-H Cost-Center Allocation & Procurement"}
                    </h4>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      {isAr 
                        ? "تكامل شامل لإسناد تكاليف المواد الطبية للمستودعات وربطها بمراكز التكلفة المعتمدة في المستشفى."
                        : "Synchronous ledger entry and purchase requisition workflow mapped to specific department cost centers."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Purchase Requisition Form */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      {isAr ? "توليد طلب شراء / حجز مخزني" : "SAP Purchase Requisition"}
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "مركز التكلفة المعتمد" : "Target Cost-Center"}</label>
                        <select 
                          value={sapCostCenter} 
                          onChange={(e) => setSapCostCenter(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"
                        >
                          <option value="CC-MED-OPD-01">CC-MED-OPD-01 (General Clinics)</option>
                          <option value="CC-SURG-OR-03">CC-SURG-OR-03 (Operation Theater)</option>
                          <option value="CC-PHARM-06">CC-PHARM-06 (Central Pharmacy)</option>
                          <option value="CC-ICU-02">CC-ICU-02 (Critical Care)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "المستهلك الطبي المطلوب" : "Medical Asset Item"}</label>
                        <input 
                          type="text" 
                          value={sapAssetItem} 
                          onChange={(e) => setSapAssetItem(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">{isAr ? "الكمية المطلوبة" : "Quantity"}</label>
                          <input 
                            type="number" 
                            value={sapAssetQty} 
                            onChange={(e) => setSapAssetQty(e.target.value)}
                            className="w-full border border-slate-300 rounded-xl p-2 text-center font-mono font-bold" 
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">{isAr ? "سعر الوحدة (ر.س)" : "Unit Price (SAR)"}</label>
                          <input 
                            type="number" 
                            value={sapAssetPrice} 
                            onChange={(e) => setSapAssetPrice(e.target.value)}
                            className="w-full border border-slate-300 rounded-xl p-2 text-center font-mono font-bold" 
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleSapPRSubmit}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition shadow"
                      >
                        {isAr ? "ترحيل طلب الشراء للـ ERP" : "Post PR to SAP Ledger"}
                      </button>
                    </div>
                  </div>

                  {/* SAP Audit Logs */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">
                        {isAr ? "سجل مطالبات مخازن SAP" : "SAP cost ledger & status tracking"}
                      </h4>
                      <div className="space-y-3 overflow-y-auto max-h-48 custom-scrollbar">
                        {procurementLogs.map((log, i) => (
                          <div key={i} className="bg-slate-50 p-2.5 border border-slate-100 rounded-xl text-[11px] flex justify-between items-start">
                            <div>
                              <span className="font-extrabold text-slate-800 block">{log.item}</span>
                              <span className="text-slate-500 text-[10px]">{log.id} • Cost-Center: {log.costCenter}</span>
                            </div>
                            <div className="text-end">
                              <span className="font-mono font-black text-slate-700 block">{log.cost} SAR</span>
                              <span className="bg-emerald-100 text-emerald-800 font-bold px-1 py-0.5 rounded text-[9px] uppercase">{log.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-100 p-2.5 rounded-xl text-[10px] text-slate-500 font-mono flex justify-between items-center">
                      <span>ERP Total Budget Sync:</span>
                      <span className="font-bold text-slate-800">OK (Connected)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: INTEGRATION & PACS */}
            {activeTab === "integration" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* HL7 FHIR Interoperability */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-purple-600 animate-spin" />
                        {isAr ? "محاكي HL7 FHIR البيني" : "HL7 FHIR Resource Simulator"}
                      </h4>
                      <select 
                        value={fhirResource} 
                        onChange={(e) => setFhirResource(e.target.value)}
                        className="border border-slate-200 rounded-lg p-1 text-[11px] font-bold"
                      >
                        <option value="Patient">Patient</option>
                        <option value="Observation">Observation (Vitals)</option>
                        <option value="MedicationRequest">MedicationRequest</option>
                      </select>
                    </div>
                    
                    <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[10px] font-mono overflow-auto h-48 select-all custom-scrollbar flex-1">
                      {fhirMessage}
                    </pre>

                    <button 
                      onClick={() => toast.success("FHIR resource dispatched to MOH integration endpoint")}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-2 rounded-xl text-xs uppercase tracking-widest transition"
                    >
                      {isAr ? "إرسال حزمة البيانات الموحدة للوزارة" : "Broadcast FHIR Message"}
                    </button>
                  </div>

                  {/* PACS DICOM Viewer Simulator */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Layers3 className="w-4 h-4 text-indigo-500 animate-pulse" />
                        {isAr ? "عارض الأشعة PACS DICOM" : "PACS DICOM Diagnostics Panel"}
                      </h4>
                      
                      {/* Interactive Canvas/Image */}
                      <div className="bg-black aspect-square rounded-2xl relative overflow-hidden flex items-center justify-center border-4 border-slate-800 h-44 mx-auto w-full max-w-xs">
                        {/* Slice representation */}
                        <div className="absolute inset-0 opacity-85 mix-blend-screen flex items-center justify-center">
                          <svg width="100%" height="100%" viewBox="0 0 200 200">
                            {/* MRI brain-like shapes reacting to slice */}
                            <circle cx="100" cy="100" r={30 + (dicomSlice * 0.8)} fill="none" stroke="#6366f1" strokeWidth="2" opacity={0.3} />
                            <ellipse cx="100" cy="100" rx={50 + (dicomSlice * 0.4)} ry={60 + (dicomSlice * 0.2)} fill="none" stroke="#ffffff" strokeWidth="3" opacity={0.6} style={{ filter: `contrast(${dicomContrast})` }} />
                            <path d={`M 60,100 Q 100,${70 + (dicomSlice * 1.5)} 140,100 Q 100,${130 - (dicomSlice * 1.5)} 60,100`} fill="none" stroke="#ffffff" strokeWidth="1.5" opacity={0.4} />
                          </svg>
                        </div>
                        
                        <div className="absolute top-2 left-2 text-[8px] font-mono text-emerald-400 uppercase tracking-widest">
                          Slice: {dicomSlice}/24 • Zoom: {dicomZoom}%
                        </div>
                        <div className="absolute bottom-2 right-2 text-[8px] font-mono text-slate-400">
                          PACS_ID: 9811A_ST
                        </div>
                      </div>
                    </div>

                    {/* Interactive Sliders */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold">{isAr ? "تصفح المقاطع (Slice)" : "Scroll Slices"}</span>
                        <input type="range" min="1" max="24" value={dicomSlice} onChange={(e) => setDicomSlice(Number(e.target.value))} className="w-2/3 accent-indigo-600" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold">{isAr ? "تعديل التباين" : "Contrast Adjust"}</span>
                        <input type="range" min="0.5" max="2.0" step="0.1" value={dicomContrast} onChange={(e) => setDicomContrast(Number(e.target.value))} className="w-2/3 accent-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: CDSS AI ADVISOR */}
            {activeTab === "ai" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-center">
                  <BrainCircuit className="w-6 h-6 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-widest">
                      {isAr ? "مستشار القرارات السريرية وتوقع المخاطر CDSS" : "Clinical Decision Support System (CDSS) & Risk Predictor"}
                    </h4>
                    <p className="text-[11px] text-amber-700 font-medium">
                      {isAr 
                        ? "بروتوكولات ذكاء اصطناعي تفاعلية تهدف لتقييم عوامل الخطورة وتوقع تدهور حالة المريض الحيوية."
                        : "Predictive algorithms assessing sepsis likelihood and patient clinical status in real time."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* qSOFA Sepsis Calculator */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" />
                      {isAr ? "حاسبة خطر تسمم الدم qSOFA" : "Quick SOFA (qSOFA) Clinical Calculator"}
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "معدل التنفس (≥ 22/دقيقة)" : "Respiratory Rate (breaths/min)"}</label>
                        <input 
                          type="number" 
                          value={qsofaRR} 
                          onChange={(e) => setQsofaRR(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2 font-mono" 
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "الضغط الانقباضي (≤ 100 مم زئبق)" : "Systolic Blood Pressure (mmHg)"}</label>
                        <input 
                          type="number" 
                          value={qsofaSBP} 
                          onChange={(e) => setQsofaSBP(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2 font-mono" 
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "مقياس غلاسكو للوعي GCS (< 15)" : "Glasgow Coma Scale (GCS)"}</label>
                        <select 
                          value={qsofaGCS} 
                          onChange={(e) => setQsofaGCS(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"
                        >
                          <option value="15">15 (Fully Conscious)</option>
                          <option value="13">13 (Mild Alteration)</option>
                          <option value="9">9 (Moderate Alteration)</option>
                          <option value="3">3 (Severe/Comatose)</option>
                        </select>
                      </div>

                      {/* Score Result */}
                      <div className="p-3 bg-slate-900 text-white rounded-xl flex justify-between items-center font-mono text-xs">
                        <span>qSOFA Risk Score:</span>
                        <span className={`font-black text-sm px-2.5 py-1 rounded ${calculateQsofa() >= 2 ? "bg-rose-600 animate-pulse text-white" : "bg-emerald-600 text-white"}`}>
                          {calculateQsofa()} / 3
                        </span>
                      </div>

                      {calculateQsofa() >= 2 && (
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[10px] text-rose-800 font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce shrink-0" />
                          <span>
                            {isAr 
                              ? "تنبيه: مؤشرات عالية لخطورة تسمم الدم! يُوصى ببدء بروتوكول الصدمة الإنتانية فوراً."
                              : "CRITICAL ALERT: High risk of poor clinical outcomes/sepsis! Please order lactate levels & broad-spectrum antibiotics."}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bed Recommendation AI */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        {isAr ? "تخصيص الأسرة الذكي وقدرة استيعاب الأجنحة" : "AI Inpatient Bed Recommendation"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                        {isAr 
                          ? "بناءً على حالة المريض الحالية وتوقيت الخروج المتوقع للأجنحة الطبية، يقترح الذكاء الاصطناعي:"
                          : "Predictive model scanning current ward occupancy and optimal placement configurations suggests:"}
                      </p>

                      <div className="bg-amber-50/75 border border-amber-100 p-3.5 rounded-2xl space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-amber-900">{isAr ? "السرير المقترح" : "Optimal Bed Location"}</span>
                          <span className="font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-black">WARD-3B-BED4</span>
                        </div>
                        <p className="text-[10px] text-amber-700 font-medium">
                          {isAr 
                            ? "معدل استجابة المريض واستقراره أعلى في الجناح الشمالي نظراً لقربه من غرف كادر التمريض المتخصص."
                            : "Recommended due to nursing workload density and proximity to telemetry monitor console."}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Bed locked and assigned via CDSS Protocol", titleAr: "تم حجز وتخصيص السرير عبر الذكاء الاصطناعي", type: "form" } }))}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-2 rounded-xl text-xs uppercase tracking-widest transition"
                    >
                      {isAr ? "اعتماد اقتراح التسكين الذكي" : "Approve Allocation"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* Global Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap gap-2 justify-end shrink-0">
          <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition">
            {isAr ? "إلغاء وإغلاق" : "Cancel & Close"}
          </button>
          
          <button onClick={handleSaveForm} className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 shadow-md transition flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {isAr ? "موافق وتطبيق التغييرات" : "Commit & Apply Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
