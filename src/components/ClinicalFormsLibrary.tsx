import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Stethoscope,
  Syringe,
  Microscope,
  Globe,
  Lock,
  ChevronRight,
  Printer,
  Download,
  Eye,
  Activity,
  HeartPulse,
  UserCircle,
  Ambulance,
  FolderOpen,
  BedDouble,
  Scissors,
  Pill,
  Radiation,
  Droplet,
  ShieldCheck,
  Receipt,
  HeartHandshake,
  Server
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function ClinicalFormsLibrary() {
  const [activeTab, setActiveTab] = useState("admission");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<any>(null);

  const categories = [
    { id: "admission", label: "الاستقبال والتسجيل والقبول (Admission & Registration)", icon: UserCircle },
    { id: "opd", label: "العيادات الخارجية (Outpatient - OPD)", icon: Stethoscope },
    { id: "ed", label: "الطوارئ والإصابات (Emergency - ED)", icon: Ambulance },
    { id: "him", label: "السجلات الطبية وإدارة المعلومات (HIM)", icon: FolderOpen },
    { id: "ipd", label: "الأقسام الداخلية والتنويم (Inpatient - IPD)", icon: BedDouble },
    { id: "icu", label: "العناية المركزة (ICU / Critical Care)", icon: Activity },
    { id: "or", label: "العمليات الجراحية والتخدير (OR & Anesthesia)", icon: Scissors },
    { id: "pharmacy", label: "الصيدلية وإدارة الدواء (Pharmacy)", icon: Pill },
    { id: "lab", label: "المختبرات الطبية (LIS)", icon: Microscope },
    { id: "rad", label: "الأشعة والتصوير الطبي (RIS)", icon: Radiation },
    { id: "blood", label: "بنك الدم (Blood Bank)", icon: Droplet },
    { id: "quality", label: "الجودة وسلامة المرضى ومكافحة العدوى (Quality & Infection Control)", icon: ShieldCheck },
    { id: "billing", label: "الحسابات الطبية وشؤون المرضى (Billing & Finance)", icon: Receipt },
    { id: "allied", label: "الخدمات الطبية المساعدة (Allied Health Services)", icon: HeartHandshake },
    { id: "admin", label: "إدارة وتأمين النظام (HIS Administration)", icon: Server },
  ];

  const formsData: Record<string, any[]> = {
    admission: [
      { id: "adm-1", title: "Patient Registration Form", category: "Admission", description: "نموذج تسجيل المريض الجديد", rating: 4.9 },
      { id: "adm-2", title: "Demographic Data Sheet", category: "Admission", description: "شيت البيانات الديموغرافية والاجتماعية", rating: 4.8 },
      { id: "adm-3", title: "General Consent for Treatment", category: "Admission", description: "نموذج الموافقة العامة على العلاج والتنويم", rating: 5.0 },
      { id: "adm-4", title: "Emergency Contact Update", category: "Admission", description: "شيت تحديث بيانات الاتصال والطوارئ", rating: 4.7 },
      { id: "adm-5", title: "Insurance Verification Form", category: "Admission", description: "نموذج التحقق من الهوية والتأمين الصحي", rating: 4.9 },
      { id: "adm-6", title: "Patient ID Barcode Generation", category: "Admission", description: "بطاقة تعريف المريض الرقمية / باركود المريض", rating: 4.8 },
      { id: "adm-7", title: "MRN Creation Sheet", category: "Admission", description: "شيت فتح الملف الطبي الموحد", rating: 5.0 },
      { id: "adm-8", title: "Appointment Scheduling Form", category: "Admission", description: "نموذج حجز المواعيد والجدولة", rating: 4.8 },
      { id: "adm-9", title: "Cancellation/Rescheduling Notice", category: "Admission", description: "إشعار إلغاء أو إعادة جدولة موعد", rating: 4.6 },
      { id: "adm-10", title: "Referral Request Form", category: "Admission", description: "نموذج طلب تحويل خارجي/داخلي", rating: 4.7 },
    ],
    opd: [
      { id: "opd-1", title: "OPD Triage & Vital Signs Sheet", category: "OPD", description: "شيت الفرز الأولي والعلامات الحيوية", rating: 4.9 },
      { id: "opd-2", title: "History & Physical Examination (H&P)", category: "OPD", description: "التاريخ الطبي والفحص السريري العام", rating: 5.0 },
      { id: "opd-3", title: "Chief Complaint & HPI Sheet", category: "OPD", description: "شيت الشكوى الرئيسية والتاريخ المرضي الحالي", rating: 4.8 },
      { id: "opd-4", title: "Review of Systems (ROS)", category: "OPD", description: "نموذج مراجعة الأنظمة الطبية للجسم", rating: 4.7 },
      { id: "opd-5", title: "e-Prescription Form", category: "OPD", description: "نموذج الوصفة الطبية الإلكترونية", rating: 5.0 },
      { id: "opd-6", title: "Laboratory Investigation Request", category: "OPD", description: "طلب الفحوصات المخبرية", rating: 4.9 },
      { id: "opd-7", title: "Radiology/Imaging Request", category: "OPD", description: "طلب الأشعة والفحوصات التصويرية", rating: 4.9 },
      { id: "opd-8", title: "Treatment & Follow-up Plan", category: "OPD", description: "شيت خطة العلاج والمتابعة", rating: 4.8 },
      { id: "opd-9", title: "Internal Consultation Request", category: "OPD", description: "نموذج الإحالة التخصصية الداخلية", rating: 4.7 },
      { id: "opd-10", title: "Sick Leave / Medical Report Form", category: "OPD", description: "تقرير الإجازة المرضية أو التقرير الطبي القصير", rating: 4.9 },
    ],
    ed: [
      { id: "ed-1", title: "ED Triage/ESI Scoring Sheet", category: "Emergency", description: "شيت الفرز الطبي للطوارئ - نظام الخمس مستويات", rating: 5.0 },
      { id: "ed-2", title: "Trauma Assessment Sheet", category: "Emergency", description: "نموذج تقييم حالات الحوادث والإصابات", rating: 4.9 },
      { id: "ed-3", title: "ED Observation/Monitoring Flowsheet", category: "Emergency", description: "شيت الملاحظة الطبية المستمرة بالطوارئ", rating: 4.8 },
      { id: "ed-4", title: "Emergency Procedure Consent", category: "Emergency", description: "نموذج الموافقة على الإجراءات الطارئة", rating: 4.9 },
      { id: "ed-5", title: "Nursing Quick Assessment", category: "Emergency", description: "شيت التقييم التمريضي السريع للطوارئ", rating: 4.8 },
      { id: "ed-6", title: "Emergency Stat Medication Orders", category: "Emergency", description: "أمر إعطاء الأدوية الوريدية الطارئة", rating: 5.0 },
      { id: "ed-7", title: "Medico-Legal/Police Report Form", category: "Emergency", description: "تقرير الحوادث الجنائية والإبلاغ الشرطي", rating: 4.7 },
      { id: "ed-8", title: "DAMA Form - Emergency", category: "Emergency", description: "نموذج الخروج ضد النصح الطبي من الطوارئ", rating: 4.6 },
      { id: "ed-9", title: "ED Admission/Transfer Order", category: "Emergency", description: "قرار وتوصية النقل من الطوارئ إلى التنويم أو العناية", rating: 4.9 },
    ],
    him: [
      { id: "him-1", title: "Access to Medical Records Request", category: "HIM", description: "نموذج طلب الاطلاع على الملف الطبي", rating: 4.7 },
      { id: "him-2", title: "Authorization for Release of Information", category: "HIM", description: "تفويض الإفصاح عن المعلومات الطبية", rating: 4.8 },
      { id: "him-3", title: "Quantitative Medical Record Audit", category: "HIM", description: "شيت التدقيق والمراجعة الكمية للملف الطبي", rating: 4.6 },
      { id: "him-4", title: "ICD-10/ICD-11 & CPT Coding Sheet", category: "HIM", description: "نموذج ترميز الأمراض والعمليات", rating: 4.9 },
      { id: "him-5", title: "Amendment Request Form", category: "HIM", description: "طلب تصحيح أو تعديل بيانات في الملف الطبي", rating: 4.7 },
      { id: "him-6", title: "File Archiving & Destruction Log", category: "HIM", description: "نموذج أرشفة وإتلاف الملفات الوريقية القديمة", rating: 4.5 },
      { id: "him-7", title: "File Tracking/Outguide Sheet", category: "HIM", description: "شيت تتبع حركة الملف الورقي", rating: 4.6 },
    ],
    ipd: [
      { id: "ipd-1", title: "Inpatient Admission Order & Sheet", category: "IPD", description: "شيت القبول الطبي وبدء التنويم", rating: 5.0 },
      { id: "ipd-2", title: "Initial Nursing Assessment", category: "IPD", description: "التقييم التمريضي الشامل عند الدخول", rating: 4.9 },
      { id: "ipd-3", title: "Daily Progress Notes", category: "IPD", description: "شيت الفحص الطبي اليومي والملاحظات التقدمية", rating: 5.0 },
      { id: "ipd-4", title: "Physician Orders Sheet", category: "IPD", description: "شيت أوامر الطبيب الموحدة", rating: 5.0 },
      { id: "ipd-5", title: "MAR - Medication Administration Record", category: "IPD", description: "سجل إعطاء الأدوية التمريضي", rating: 5.0 },
      { id: "ipd-6", title: "Vital Signs Flowsheet", category: "IPD", description: "شيت مراقبة العلامات الحيوية الدوري", rating: 4.9 },
      { id: "ipd-7", title: "Intake & Output Balance Sheet", category: "IPD", description: "سجل السوائل الداخلة والخارجة", rating: 4.8 },
      { id: "ipd-8", title: "Morse Fall Risk Assessment", category: "IPD", description: "نموذج تقييم مخاطر السقوط - مورس", rating: 4.8 },
      { id: "ipd-9", title: "Braden Scale for Bedsores", category: "IPD", description: "نموذج تقييم مخاطر قرح الفراش - برادن", rating: 4.8 },
      { id: "ipd-10", title: "Pain Assessment & Management Scale", category: "IPD", description: "شيت تقييم الألم وإدارته", rating: 4.9 },
      { id: "ipd-11", title: "Nursing Care Plan", category: "IPD", description: "نموذج خطة الرعاية التمريضية اليومية", rating: 4.9 },
      { id: "ipd-12", title: "Internal Consultation Request", category: "IPD", description: "طلب استشارة طبية بين الأقسام", rating: 4.7 },
      { id: "ipd-13", title: "Discharge Summary Sheet", category: "IPD", description: "نموذج ملخص الخروج الطبي", rating: 5.0 },
      { id: "ipd-14", title: "Patient Discharge Instructions", category: "IPD", description: "تعليمات الخروج وإرشادات المريض", rating: 4.9 },
      { id: "ipd-15", title: "DAMA - Discharge Against Medical Advice", category: "IPD", description: "نموذج الخروج ضد النصح الطبي", rating: 4.7 },
    ],
    icu: [
      { id: "icu-1", title: "Hourly Critical Care Flowsheet", category: "ICU", description: "شيت المراقبة المكثفة للساعة", rating: 5.0 },
      { id: "icu-2", title: "Mechanical Ventilator Parameters Log", category: "ICU", description: "سجل إعدادات جهاز التنفس الصناعي", rating: 4.9 },
      { id: "icu-3", title: "Glasgow Coma Scale - GCS", category: "ICU", description: "شيت تقييم درجة الوعي - جلاسكو", rating: 4.9 },
      { id: "icu-4", title: "CAM-ICU Assessment Sheet", category: "ICU", description: "نموذج تقييم الهذيان في العناية", rating: 4.8 },
      { id: "icu-5", title: "Infusion Pump Titration Log", category: "ICU", description: "شيت مراقبة المحاليل الوريدية ومضخات الحقن", rating: 5.0 },
      { id: "icu-6", title: "APACHE II / SOFA Scoring Sheet", category: "ICU", description: "نموذج حساب سكور الخطورة الطبي", rating: 4.7 },
      { id: "icu-7", title: "CRRT Therapy Log", category: "ICU", description: "سجل غسيل الكلى الحاد المستمر", rating: 4.8 },
      { id: "icu-8", title: "Lines, Drains, & Airway Care Sheet", category: "ICU", description: "شيت العناية التمريضية الخاصة بالقساطر والأنابيب", rating: 4.9 },
    ],
    or: [
      { id: "or-1", title: "Pre-Anesthesia Evaluation Sheet", category: "OR", description: "نموذج تقييم ما قبل التخدير", rating: 4.9 },
      { id: "or-2", title: "Surgical & Anesthesia Informed Consent", category: "OR", description: "نموذج الموافقة المستنيرة على الجراحة والتخدير", rating: 5.0 },
      { id: "or-3", title: "WHO Surgical Safety Checklist", category: "OR", description: "قائمة التحقق من سلامة الجراحة", rating: 5.0 },
      { id: "or-4", title: "Intra-Operative Anesthesia Record", category: "OR", description: "شيت المراقبة أثناء التخدير", rating: 4.9 },
      { id: "or-5", title: "Operative/Surgery Report", category: "OR", description: "تقرير الإجراء الجراحي وتفاصيل العملية", rating: 5.0 },
      { id: "or-6", title: "Surgical Count Sheet - Sponges & Instruments", category: "OR", description: "سجل العد الجراحي - الفوط والأدوات", rating: 4.9 },
      { id: "or-7", title: "PACU / Recovery Room Monitoring Sheet", category: "OR", description: "شيت الإنعاش والملاحظة في الإفاقة", rating: 4.9 },
      { id: "or-8", title: "Aldrete Scoring Sheet", category: "OR", description: "تقييم الخروج من الإفاقة إلى القسم الداخلي", rating: 4.8 },
      { id: "or-9", title: "Pathology Specimen Request", category: "OR", description: "نموذج طلب وفحص الأنسجة المستأصلة - الباثولوجي", rating: 4.7 },
    ],
    pharmacy: [
      { id: "rx-1", title: "Prescription Clinical Review", category: "Pharmacy", description: "نموذج مراجعة وتدقيق ملاءمة الوصفة الطبية", rating: 4.8 },
      { id: "rx-2", title: "Medication Reconciliation Sheet", category: "Pharmacy", description: "شيت مراجعة وتوفيق الأدوية عند الدخول/الخروج", rating: 4.9 },
      { id: "rx-3", title: "Ward Stock Requisition", category: "Pharmacy", description: "نموذج طلب الأدوية والمحاليل للأقسام - نظام الكوتا", rating: 4.7 },
      { id: "rx-4", title: "Unit Dose Dispensing Log", category: "Pharmacy", description: "شيت صرف أدوية جرعة اليوم الواحد", rating: 4.9 },
      { id: "rx-5", title: "Narcotics & Controlled Drugs Ledger", category: "Pharmacy", description: "سجل صرف ومراقبة الأدوية المخدرة والمراقبة", rating: 5.0 },
      { id: "rx-6", title: "ADR - Adverse Drug Reaction Report", category: "Pharmacy", description: "نموذج الإبلاغ عن الآثار الجانبية للأدوية", rating: 4.8 },
      { id: "rx-7", title: "Medication Error / Near Miss Report", category: "Pharmacy", description: "تقرير الأخطاء الدوائية أو وشيك الوقوع", rating: 4.9 },
      { id: "rx-8", title: "IV Admixture & Oncology Compounding Sheet", category: "Pharmacy", description: "شيت التحضير الورقي المعقم للمحاليل والكيماوي", rating: 4.8 },
      { id: "rx-9", title: "Non-Formulary Drug Request Form", category: "Pharmacy", description: "نموذج طلب توفير دواء غير مدرج بالدليل", rating: 4.6 },
    ],
    lab: [
      { id: "lab-1", title: "Phlebotomy & Patient Verification Log", category: "Laboratory", description: "شيت سحب العينات وتطابق الهوية", rating: 4.8 },
      { id: "lab-2", title: "Lab Investigation Request", category: "Laboratory", description: "طلب فحص مخبري تخصصي - كيمياء، دم، مناعة", rating: 4.9 },
      { id: "lab-3", title: "Microbiology & Culture Request Sheet", category: "Laboratory", description: "نموذج طلب فحص الميكروبيولوجيا والمزارع", rating: 4.8 },
      { id: "lab-4", title: "Critical Value Notification Log", category: "Laboratory", description: "شيت تسجيل النتائج الحرجة والإبلاغ الفوري", rating: 5.0 },
      { id: "lab-5", title: "Daily QC/Calibration Log", category: "Laboratory", description: "سجل ضبط الجودة اليومي للأجهزة", rating: 4.7 },
      { id: "lab-6", title: "Specimen Rejection Form", category: "Laboratory", description: "نموذج رفض أو إعادة سحب العينة غير المطابقة", rating: 4.6 },
    ],
    rad: [
      { id: "rad-1", title: "MRI Safety Checklist", category: "Radiology", description: "شيت فحص السلامة قبل الرنين المغناطيسي", rating: 5.0 },
      { id: "rad-2", title: "Contrast Media Informed Consent", category: "Radiology", description: "نموذج الموافقة على حقن الصبغة والتحقق من وظائف الكلى", rating: 4.9 },
      { id: "rad-3", title: "Radiology/Interventional Request", category: "Radiology", description: "طلب فحص أشعة تشخيصية/تداخلية", rating: 4.8 },
      { id: "rad-4", title: "Radiology Diagnostic Report Template", category: "Radiology", description: "تقرير طبيب الأشعة النهائي", rating: 4.9 },
      { id: "rad-5", title: "Patient Radiation Dose Tracking Log", category: "Radiology", description: "سجل مراقبة الجرعات الإشعاعية للمرضى", rating: 4.7 },
      { id: "rad-6", title: "Post-Interventional Radiology Monitoring Sheet", category: "Radiology", description: "شيت متابعة المريض بعد الأشعة التداخلية", rating: 4.8 },
    ],
    blood: [
      { id: "bld-1", title: "Blood Requisition & Crossmatch Form", category: "Blood Bank", description: "نموذج طلب وفحص توافق الدم ومشتقاته", rating: 5.0 },
      { id: "bld-2", title: "Blood Donor Screening Questionnaire", category: "Blood Bank", description: "شيت فحص واستبيان المتبرعين بالدم", rating: 4.9 },
      { id: "bld-3", title: "Blood & Blood Components Issuing Log", category: "Blood Bank", description: "سجل صرف الدم ومشتقاته للأقسام", rating: 4.9 },
      { id: "bld-4", title: "Blood Transfusion Monitoring Flowsheet", category: "Blood Bank", description: "شيت مراقبة نقل الدم والعلامات الحيوية", rating: 5.0 },
      { id: "bld-5", title: "Blood Transfusion Reaction Report", category: "Blood Bank", description: "تقرير الإبلاغ عن تفاعلات ومضاعفات نقل الدم", rating: 4.9 },
      { id: "bld-6", title: "Blood Unit Discard/Wastage Log", category: "Blood Bank", description: "سجل إتلاف وتخلص من وحدات الدم المنتهية", rating: 4.8 },
    ],
    quality: [
      { id: "qa-1", title: "OVR - Occurrence/Incident Report Form", category: "Quality", description: "تقرير الحوادث العارضة والمخاطر", rating: 5.0 },
      { id: "qa-2", title: "HAIs - Hospital Acquired Infection Surveillance", category: "Quality", description: "شيت رصد وتتبع عدوى المنشآت الصحية", rating: 4.9 },
      { id: "qa-3", title: "Infection Control Daily Audit Checklist", category: "Quality", description: "قائمة تدقيق المرور اليومي لمكافحة العدوى", rating: 4.8 },
      { id: "qa-4", title: "Communicable Disease Notification Form", category: "Quality", description: "نموذج الإبلاغ عن الأمراض المعدية للوزارة", rating: 4.9 },
      { id: "qa-5", title: "Hand Hygiene Compliance Observation Sheet", category: "Quality", description: "شيت مراقبة الالتزام بنظافة الأيدي", rating: 4.7 },
      { id: "qa-6", title: "Needlestick & Sharp Injury Report", category: "Quality", description: "تقرير تقصي حادثة وخز الإبر والآلات الحادة", rating: 4.9 },
      { id: "qa-7", title: "Patient Satisfaction Survey", category: "Quality", description: "نموذج استبيان رضا المرضى عن الخدمات الطبية", rating: 4.8 },
      { id: "qa-8", title: "IPSG Compliance Log", category: "Quality", description: "شيت متابعة المؤشرات القياسية لأهداف سلامة المرضى الدولية", rating: 4.8 },
    ],
    billing: [
      { id: "bil-1", title: "Pro-forma / Provisional Invoice", category: "Finance", description: "شيت الفاتورة المبدئية للمريض", rating: 4.7 },
      { id: "bil-2", title: "Final Detailed Medical Bill", category: "Finance", description: "شيت الفاتورة التفصيلية النهائية والخروج", rating: 4.9 },
      { id: "bil-3", title: "Insurance Invoicing & Claims Form", category: "Finance", description: "نموذج المطالبة المالية لشركات التأمين", rating: 4.8 },
      { id: "bil-4", title: "Insurance Denial Management Log", category: "Finance", description: "سجل معالجة رفض المطالبان التأمينية", rating: 4.7 },
      { id: "bil-5", title: "Patient Ledger & Payment History", category: "Finance", description: "نموذج كشف حساب المريض وحركة السداد", rating: 4.8 },
      { id: "bil-6", title: "Financial Charity/Waiver Request", category: "Finance", description: "طلب إعفاء مالي أو تحويل للجمعيات الخيرية", rating: 4.6 },
      { id: "bil-7", title: "Patient Valuables/Deposit Form", category: "Finance", description: "نموذج إيداع الأمانات النقدية أو العينية للمريض", rating: 4.7 },
    ],
    allied: [
      { id: "ah-1", title: "Physical Therapy Initial Assessment", category: "Allied Health", description: "شيت التقييم الأولي للعلاج الطبيعي", rating: 4.8 },
      { id: "ah-2", title: "Physiotherapy Session & Progress Log", category: "Allied Health", description: "سجل جلسات ومتابعة التأهيل الطبي", rating: 4.7 },
      { id: "ah-3", title: "Nutritional Assessment & Diet Order", category: "Allied Health", description: "نموذج التقييم التغذوي ووضع خطة الوجبات", rating: 4.8 },
      { id: "ah-4", title: "Medical Social Work Assessment", category: "Allied Health", description: "شيت الخدمة الاجتماعية الطبية ومتابعة الحالات", rating: 4.6 },
      { id: "ah-5", title: "Home Health Care Plan Sheet", category: "Allied Health", description: "نموذج خطة الرعاية المنزلية للمريض", rating: 4.7 },
    ],
    admin: [
      { id: "adm-sys-1", title: "User Account & Role Creation Request", category: "IT/Admin", description: "نموذج طلب إنشاء / تعديل صلاحيات مستخدم", rating: 4.7 },
      { id: "adm-sys-2", title: "User Access & Login Audit Log", category: "IT/Admin", description: "سجل مراقبة وتتبع دخول المستخدمين", rating: 4.8 },
      { id: "adm-sys-3", title: "Data Modification/Delete Audit Trail", category: "IT/Admin", description: "سجل التعديلات والحذف على البيانات الحساسة", rating: 4.9 },
      { id: "adm-sys-4", title: "Medical Record Locking Request", category: "IT/Admin", description: "نموذج طلب تجميد أو إغلاق ملف طبي", rating: 4.6 },
      { id: "adm-sys-5", title: "HIS System Bug/Issue Report", category: "IT/Admin", description: "تقرير الأخطاء التقنية والأعطال بالبرنامج", rating: 4.5 },
      { id: "adm-sys-6", title: "System Backup & Restore Log", category: "IT/Admin", description: "سجل النسخ الاحتياطي واسترجاع البيانات", rating: 4.8 },
      { id: "adm-sys-7", title: "System Update & Downtime Log", category: "IT/Admin", description: "نموذج توثيق تحديث النظام والصيانة الدورية", rating: 4.7 },
    ],
  };

  const currentForms = formsData[activeTab]?.filter(form => 
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    form.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">مكتبة النماذج الطبية والشيتات</h1>
            <p className="text-slate-500">النماذج العالمية، الخاصة، والعامة لجميع الأقسام</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="بحث في النماذج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus size={18} />
            <span>نموذج جديد</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Categories */}
        <div className="lg:col-span-1 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                activeTab === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              <cat.icon size={20} className={activeTab === cat.id ? "text-indigo-200" : "text-slate-400"} />
              <span className="font-medium text-sm">{cat.label}</span>
              {activeTab === cat.id && (
                <ChevronRight size={16} className="mr-auto" />
              )}
            </button>
          ))}
        </div>

        {/* Forms List */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {currentForms.map((form) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={form.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                      {form.category}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <span>★</span>
                      <span>{form.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {form.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">
                        <Printer size={16} />
                      </button>
                    </div>
                    <button className="text-xs font-medium text-indigo-600 flex items-center gap-1 hover:underline">
                      <span>استخدام النموذج</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {currentForms.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                <FileText size={48} className="mb-4 opacity-20" />
                <p>لا توجد نماذج مطابقة للبحث</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal Preview */}
      <AnimatePresence>
        {selectedForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-slate-800">{selectedForm.title}</h2>
                    <p className="text-xs text-slate-500">{selectedForm.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedForm(null)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                {/* Mock Form Body */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
                  <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
                    <div>
                      <h1 className="text-2xl font-black text-slate-900">{selectedForm.title}</h1>
                      <p className="text-sm text-slate-500 mt-1">Official Medical Document - {selectedForm.category}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500 space-y-1">
                      <p>Doc ID: {selectedForm.id}</p>
                      <p>Rev Date: 2026-06-25</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Patient Name</label>
                        <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg"></div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">MRN</label>
                        <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Clinical Notes / Details</label>
                      <div className="h-32 bg-slate-50 border border-slate-200 rounded-lg"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-slate-300 rounded"></div>
                          <div className="h-4 w-24 bg-slate-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                <button
                  onClick={() => setSelectedForm(null)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  إغلاق
                </button>
                <button
                  className="px-5 py-2.5 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  <span>تنزيل PDF</span>
                </button>
                <button
                  onClick={() => {
                    toast.success("تم بدء تعبئة النموذج الجديد");
                    setSelectedForm(null);
                  }}
                  className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  بدء التعبئة (Fill Form)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
