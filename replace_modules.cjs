const fs = require('fs');

const newModules = `  const systemModules = [
    {
      id: "clinical_care",
      labelAr: "الرعاية السريرية",
      labelEn: "Clinical Care",
      icon: Stethoscope,
      hasChildren: true,
      subItems: [
        { id: "doctorworkspace", labelAr: "مساحة عمل الطبيب", labelEn: "Doctor Workspace" },
        { id: "nurseworkspace", labelAr: "مساحة عمل التمريض", labelEn: "Nurse Workspace" },
        { id: "er", labelAr: "مساحة عمل الطوارئ", labelEn: "Emergency Workspace" },
        { id: "clinics", labelAr: "العيادات الخارجية", labelEn: "Outpatient Clinics" },
        { id: "icu", labelAr: "العناية المركزة (ICU)", labelEn: "Intensive Care (ICU)" },
        { id: "nicu", labelAr: "العناية المركزة للأطفال (NICU)", labelEn: "Neonatal ICU (NICU)" },
        { id: "wards", labelAr: "الأقسام الداخلية", labelEn: "Inpatient Wards" },
        { id: "obs_gyn", labelAr: "النساء والولادة", labelEn: "Obstetrics & Gynecology" },
        { id: "pacu", labelAr: "الإفاقة (PACU)", labelEn: "Recovery (PACU)" },
        { id: "laboratory", labelAr: "المختبر (LIS)", labelEn: "Laboratory (LIS)" },
        { id: "radiology", labelAr: "الأشعة (RIS / PACS)", labelEn: "Radiology (RIS/PACS)" },
        { id: "pathology", labelAr: "علم الأمراض والأنسجة", labelEn: "Pathology" },
        { id: "pt", labelAr: "العلاج الطبيعي والتأهيل", labelEn: "Physical Therapy & Rehab" },
        { id: "nutrition", labelAr: "التغذية العلاجية", labelEn: "Clinical Nutrition" },
        { id: "live_consultation", labelAr: "الاستشارات المرئية", labelEn: "Live Consultations" },
        { id: "telemedicine", labelAr: "الطب الاتصالي", labelEn: "Telemedicine" },
        { id: "referral", labelAr: "الإحالات الطبية", labelEn: "Referral Management" },
        { id: "mortuary", labelAr: "شؤون الموتى (المشرحة)", labelEn: "Mortuary" },
      ]
    },
    {
      id: "hospital_operations",
      labelAr: "تشغيل المستشفى",
      labelEn: "Hospital Operations",
      icon: Layers,
      hasChildren: true,
      subItems: [
        { id: "capacitymanagement", labelAr: "إدارة الطاقة الاستيعابية", labelEn: "Capacity Management" },
        { id: "smartbedallocation", labelAr: "تخصيص الأسرة الذكي", labelEn: "Smart Bed Allocation" },
        { id: "admissioncenter", labelAr: "مركز الدخول", labelEn: "Admission Center" },
        { id: "transport", labelAr: "حركة ونقل المرضى (MOVE)", labelEn: "Patient Transport" },
        { id: "patientmovement", labelAr: "حركة ونقل المرضى (متقدم)", labelEn: "Advanced Patient Movement" },
        { id: "queuemanagement", labelAr: "إدارة طوابير الانتظار", labelEn: "Queue Management" },
        { id: "assetmanagement", labelAr: "إدارة الأصول", labelEn: "Asset Management" },
        { id: "biomedicalengineering", labelAr: "الهندسة الطبية", labelEn: "Biomedical Engineering" },
        { id: "maintenance", labelAr: "الصيانة والمرافق", labelEn: "Maintenance" },
        { id: "cssd", labelAr: "التعقيم (CSSD)", labelEn: "CSSD" },
        { id: "security", labelAr: "الأمن والسلامة", labelEn: "Security" },
        { id: "meals", labelAr: "شيت وجبات المرضى والموظفين", labelEn: "Meals & Nutrition Log" },
      ]
    },
    {
      id: "patient_safety_quality",
      labelAr: "سلامة المرضى والجودة",
      labelEn: "Patient Safety & Quality",
      icon: ShieldAlert,
      hasChildren: true,
      subItems: [
        { id: "patientsafetycenter", labelAr: "مركز سلامة المرضى", labelEn: "Patient Safety Center" },
        { id: "medicationsafety", labelAr: "أمان الدواء", labelEn: "Medication Safety" },
        { id: "clinicalalerts", labelAr: "التنبيهات السريرية", labelEn: "Clinical Alerts" },
        { id: "rrt", labelAr: "فريق التدخل السريع (RRT)", labelEn: "Rapid Response Team" },
        { id: "infectionsurveillanceai", labelAr: "مراقبة العدوى بالذكاء الاصطناعي", labelEn: "Infection Surveillance AI" },
        { id: "clinicalprotocolengine", labelAr: "محرك البروتوكولات السريرية", labelEn: "Clinical Protocol Engine" },
        { id: "smartchecklistengine", labelAr: "محرك القوائم الذكية", labelEn: "Smart Checklist Engine" },
        { id: "hospitalpolicycenter", labelAr: "مركز سياسات المستشفى", labelEn: "Hospital Policy Center" },
        { id: "accreditationcenter", labelAr: "مركز الاعتماد والجودة", labelEn: "Accreditation Center" },
      ]
    },
    {
      id: "admin_finance",
      labelAr: "الإدارة والمالية",
      labelEn: "Administration & Finance",
      icon: Users,
      hasChildren: true,
      subItems: [
        { id: "executiveportal", labelAr: "بوابة الإدارة التنفيذية", labelEn: "Executive Portal" },
        { id: "doctorportal", labelAr: "بوابة الطبيب", labelEn: "Doctor Portal" },
        { id: "medication_ledger", labelAr: "سجل الأدوية الذكي", labelEn: "Smart Medication Ledger" },
        { id: "clinicalcalendar", labelAr: "التقويم السريري", labelEn: "Clinical Calendar" },
        { id: "enterprisescheduler", labelAr: "الجدولة المؤسسية", labelEn: "Enterprise Scheduler" },
      ]
    },
    {
      id: "intelligence_ai",
      labelAr: "الذكاء والتحليلات",
      labelEn: "Intelligence & AI",
      icon: Zap,
      hasChildren: true,
      subItems: [
        { id: "missioncontrol", labelAr: "مركز التحكم والقيادة", labelEn: "Mission Control Center" },
        { id: "digitaltwin", labelAr: "المستشفى التوأم الرقمي", labelEn: "Digital Twin Hospital" },
        { id: "aiclincialbrain", labelAr: "العقل الطبي (AI)", labelEn: "AI Clinical Brain" },
        { id: "digitalpatient", labelAr: "المريض الرقمي", labelEn: "Digital Patient Twin" },
        { id: "digitaltwinhospital", labelAr: "نظام التوأم الرقمي للمستشفى", labelEn: "Digital Twin System" },
        { id: "predictiveanalytics", labelAr: "التحليلات التنبؤية", labelEn: "Predictive Analytics" },
        { id: "aimedicalscribe", labelAr: "الكاتب الطبي بالذكاء الاصطناعي", labelEn: "AI Medical Scribe" },
        { id: "hospitaldigitalassistant", labelAr: "المساعد الرقمي للمستشفى", labelEn: "Hospital Digital Assistant" },
        { id: "nurseai", labelAr: "الممرضة الذكية", labelEn: "Nurse AI Workspace" },
        { id: "smartwhiteboards", labelAr: "الشاشات البيضاء الذكية", labelEn: "Smart Whiteboards" },
      ]
    },
    {
      id: "platform_admin",
      labelAr: "المنصة والإعدادات",
      labelEn: "Platform & Administration",
      icon: Database,
      hasChildren: true,
      subItems: [
        { id: "hospitalkernel", labelAr: "نظام التشغيل والأحداث", labelEn: "Hospital OS Kernel" },
        { id: "master_data", labelAr: "حوكمة البيانات الأساسية", labelEn: "Master Data Gov" },
        { id: "report_center", labelAr: "مركز طباعة التقارير", labelEn: "Enterprise Report Center" },
        { id: "audit_center", labelAr: "مركز سجلات التدقيق (Audit)", labelEn: "Audit Center" },
        { id: "integration_center", labelAr: "مركز التكامل والربط", labelEn: "Integration Center" },
        { id: "apicenter", labelAr: "مركز الربط البرمجي", labelEn: "API Center" },
        { id: "backup_center", labelAr: "النسخ الاحتياطي والأرشفة", labelEn: "Backup & Recovery" },
        { id: "disasterrecovery", labelAr: "التعافي من الكوارث", labelEn: "Disaster Recovery" },
        { id: "permissions_matrix", labelAr: "مصفوفة الصلاحيات المتقدمة", labelEn: "Permissions Matrix" },
        { id: "empi", labelAr: "إدارة الهوية الطبية", labelEn: "Medical Identity" },
        { id: "enterprisenotificationcenter", labelAr: "مركز الإشعارات الموحد", labelEn: "Notification Center" },
        { id: "enterprisesearch", labelAr: "البحث المؤسسي الشامل", labelEn: "Enterprise Search" },
        { id: "clinicalcommunication", labelAr: "التواصل السريري", labelEn: "Clinical Communication" },
        { id: "medicalknowledgebase", labelAr: "القاعدة المعرفية الطبية", labelEn: "Medical Knowledge Base" },
        { id: "patientjourneyengine", labelAr: "تتبع مسار المريض", labelEn: "Patient Journey" },
        { id: "escalationengine", labelAr: "محرك التصعيد التلقائي", labelEn: "Escalation Engine" },
        { id: "hospitalrulesengine", labelAr: "محرك قواعد المستشفى", labelEn: "Hospital Rules Engine" },
        { id: "universaltaskengine", labelAr: "محرك المهام الشامل", labelEn: "Universal Task Engine" },
        { id: "workflow_designer", labelAr: "مصمم مسارات العمل", labelEn: "Workflow Designer" },
        { id: "wf_reception", labelAr: "مسار الاستقبال والتسجيل", labelEn: "Reception Workflow" },
        { id: "wf_er", labelAr: "مسار الطوارئ (ER)", labelEn: "ER Workflow" },
        { id: "wf_clinic", labelAr: "مسار العيادات الخارجية", labelEn: "Outpatient Workflow" },
        { id: "wf_inpatient", labelAr: "مسار الأقسام الداخلية", labelEn: "Inpatient Workflow" },
        { id: "wf_ot", labelAr: "مسار العمليات (OT)", labelEn: "OT Workflow" },
        { id: "wf_icu", labelAr: "مسار العناية المركزة (ICU)", labelEn: "ICU Workflow" },
        { id: "wf_diagnostics", labelAr: "مسار المختبر والأشعة", labelEn: "Diagnostics Hub" },
        { id: "wf_pharmacy", labelAr: "مسار الصيدلية", labelEn: "Pharmacy Hub" },
        { id: "wf_inventory", labelAr: "مسار المخازن", labelEn: "Inventory Hub" },
        { id: "wf_cpoe", labelAr: "مسار الطلبات الطبية (CPOE)", labelEn: "CPOE Flow" },
      ]
    }
  ];
  const [expandedModules, setExpandedModules] = useState<string[]>(["clinical_care", "intelligence_ai"]);`;

const fileStr = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

// Match `const systemModules = [...];\n  const [expandedModules, setExpandedModules] = useState<string[]>([...]);`
const regex = /const systemModules = \[[\s\S]*?\];\n\s*const \[expandedModules, setExpandedModules\] = useState<string\[\]>\(\[.*?\]\);/m;

if (regex.test(fileStr)) {
  const updatedStr = fileStr.replace(regex, newModules);
  fs.writeFileSync('src/components/HospitalInformationSystem.tsx', updatedStr);
  console.log("Success: Modules updated");
} else {
  console.log("Error: regex did not match");
}
