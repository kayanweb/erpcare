const fs = require('fs');
const content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

const startIndex = content.indexOf('const systemModules = [');
if (startIndex === -1) {
  console.error('Could not find systemModules');
  process.exit(1);
}

// Simple regex or string parsing to find the end of systemModules
let bracketCount = 0;
let endIndex = -1;
let started = false;
for (let i = startIndex; i < content.length; i++) {
  if (content[i] === '[') {
    bracketCount++;
    started = true;
  } else if (content[i] === ']') {
    bracketCount--;
  }
  if (started && bracketCount === 0) {
    endIndex = i + 1;
    break;
  }
}

if (endIndex === -1) {
  console.error('Could not find end of systemModules');
  process.exit(1);
}

const newSystemModules = `const systemModules = [
    {
      id: "clinical_care",
      labelAr: "نواة الرعاية السريرية",
      labelEn: "Core Clinical EMR",
      icon: Stethoscope,
      hasChildren: true,
      subItems: [
        { id: "clinicaldesktop", labelAr: "المكتب السريري الموحد", labelEn: "Unified Clinical Workspace" },
        { id: "wf_cpoe", labelAr: "نظام الطلبات (CPOE)", labelEn: "CPOE" },
        { id: "vitals", labelAr: "العلامات الحيوية والمراقبة", labelEn: "Vitals & Monitoring" },
        { id: "patientjourneyengine", labelAr: "سجل تتبع الرحلة العلاجية للمريض", labelEn: "Patient Journey Tracker" },
        { id: "er", labelAr: "وضعية الطوارئ (ER Mode)", labelEn: "ER Mode" },
        { id: "clinics", labelAr: "العيادات الخارجية", labelEn: "Outpatient Clinics" },
        { id: "clinicslist", labelAr: "قائمة العيادات", labelEn: "Clinics List" },
        { id: "wards", labelAr: "الأقسام الداخلية", labelEn: "Inpatient Wards" },
        { id: "ipd", labelAr: "لوحة التنويم الداخلي", labelEn: "IPD Dashboard" },
        { id: "icu", labelAr: "وحدات الرعاية الحرجة", labelEn: "Critical Care Units" },
        { id: "nicu", labelAr: "العناية المركزة للأطفال (NICU)", labelEn: "Neonatal ICU (NICU)" },
        { id: "obs_gyn", labelAr: "النساء والولادة", labelEn: "Obstetrics & Gynecology" },
        { id: "operatingtheater", labelAr: "العمليات الجراحية", labelEn: "Operating Theater" },
        { id: "pacu", labelAr: "الإفاقة (PACU)", labelEn: "Recovery (PACU)" },
        { id: "nursingflowkardex", labelAr: "تدفق التمريض", labelEn: "Nursing Flow Kardex" },
        { id: "nursingdirector", labelAr: "مدير التمريض", labelEn: "Nursing Director" },
        { id: "nursingsupervisor", labelAr: "مشرف التمريض", labelEn: "Nursing Supervisor" },
        { id: "live_consultation", labelAr: "الاستشارات المرئية", labelEn: "Live Consultations" },
        { id: "telemedicine", labelAr: "الخدمات الصحية عن بُعد", labelEn: "Telehealth" },
        { id: "referral", labelAr: "الإحالات الطبية", labelEn: "Referral Management" },
        { id: "mortuary", labelAr: "شؤون الموتى (المشرحة)", labelEn: "Mortuary" },
        { id: "birthdeathrecord", labelAr: "سجلات المواليد والوفيات", labelEn: "Birth & Death Records" },
        { id: "medical_tools", labelAr: "الأدوات الطبية", labelEn: "Medical Tools" },
      ]
    },
    {
      id: "diagnostics_therapeutics",
      labelAr: "التشخيص والعلاج",
      labelEn: "Diagnostics & Therapeutics",
      icon: FlaskConical,
      hasChildren: true,
      subItems: [
        { id: "lisris", labelAr: "منصة التشخيص المخبري الموحدة", labelEn: "Unified Laboratory (LIS)" },
        { id: "radiology", labelAr: "منصة التصوير الطبي الموحدة", labelEn: "Unified Radiology (RIS/PACS)" },
        { id: "pharmacy", labelAr: "الصيدلية", labelEn: "Pharmacy" },
        { id: "bloodbank", labelAr: "بنك الدم", labelEn: "Blood Bank" },
        { id: "pathology", labelAr: "علم الأمراض والأنسجة", labelEn: "Pathology" },
        { id: "pt", labelAr: "العلاج الطبيعي والتأهيل", labelEn: "Physical Therapy & Rehab" },
        { id: "nutrition", labelAr: "التغذية العلاجية", labelEn: "Clinical Nutrition" },
        { id: "medication_ledger", labelAr: "سجل الأدوية الذكي", labelEn: "Smart Medication Ledger" },
      ]
    },
    {
      id: "operations_logistics",
      labelAr: "العمليات واللوجستيات",
      labelEn: "Operations & Logistics",
      icon: Layers,
      hasChildren: true,
      subItems: [
        { id: "admissioncenter", labelAr: "مركز الدخول", labelEn: "Admission Center" },
        { id: "smartbedallocation", labelAr: "تخصيص الأسرة الذكي", labelEn: "Smart Bed Allocation" },
        { id: "transport", labelAr: "حركة ونقل المرضى (MOVE)", labelEn: "Patient Transport" },
        { id: "ambulance", labelAr: "الإسعاف والطوابير", labelEn: "EMS & Queue Management" },
        { id: "queuemanagement", labelAr: "إدارة طوابير الانتظار", labelEn: "Queue Management" },
        { id: "cssd", labelAr: "التعقيم (CSSD)", labelEn: "CSSD" },
        { id: "enterpriseinventoryengine", labelAr: "المخزون المؤسسي والمشتريات", labelEn: "Inventory & Purchasing" },
        { id: "purchasingpo", labelAr: "المشتريات", labelEn: "Purchasing & PO" },
        { id: "distribution", labelAr: "التوزيع", labelEn: "Distribution" },
        { id: "meals", labelAr: "وجبات المرضى والموظفين", labelEn: "Patient Meals" },
        { id: "hospital_ops", labelAr: "عمليات المستشفى", labelEn: "Hospital Ops Dashboard" },
        { id: "capacitymanagement", labelAr: "إدارة الطاقة الاستيعابية", labelEn: "Capacity Management" },
        { id: "assetmanagement", labelAr: "إدارة الأصول", labelEn: "Asset Management" },
        { id: "biomedicalengineering", labelAr: "الهندسة الطبية", labelEn: "Biomedical Engineering" },
        { id: "maintenance", labelAr: "الصيانة والمرافق", labelEn: "Maintenance" },
        { id: "security", labelAr: "الأمن والسلامة", labelEn: "Security" },
        { id: "gatereception", labelAr: "استقبال البوابة", labelEn: "Gate Reception" },
        { id: "front_office", labelAr: "المكاتب الأمامية", labelEn: "Front Office" },
        { id: "billinginsurance", labelAr: "الفوترة والتأمين", labelEn: "Billing & Insurance" },
        { id: "revenuecycle", labelAr: "دورة الإيرادات", labelEn: "Revenue Cycle" },
        { id: "financeincomeexpense", labelAr: "الدخل والمصروفات", labelEn: "Finance & Expenses" },
        { id: "cashierpointofsale", labelAr: "الكاشير", labelEn: "Cashier POS" },
        { id: "insurancemaster", labelAr: "إدارة التأمين", labelEn: "Insurance Master" },
        { id: "tpa_management", labelAr: "إدارة TPA", labelEn: "TPA Management" },
        { id: "hr", labelAr: "الموارد البشرية", labelEn: "Human Resources" },
        { id: "rosterplanningpanel", labelAr: "تخطيط الجداول", labelEn: "Roster Planning Panel" },
        { id: "employeeevaluationsystem", labelAr: "تقييم الموظفين", labelEn: "Employee Evaluation" },
        { id: "organization", labelAr: "المؤسسة", labelEn: "Organization Dashboard" },
      ]
    },
    {
      id: "quality_governance",
      labelAr: "الجودة والحوكمة",
      labelEn: "Quality & Governance",
      icon: CheckCircle2,
      hasChildren: true,
      subItems: [
        { id: "patientsafety_rrt", labelAr: "سلامة المرضى و RRT", labelEn: "Patient Safety & RRT" },
        { id: "infection_control", labelAr: "نظام رصد ومكافحة العدوى الذكي", labelEn: "Smart Infection Control" },
        { id: "clinical_protocols", labelAr: "محرك البروتوكولات السريرية", labelEn: "Clinical Protocols Engine" },
        { id: "hospitalrulesengine", labelAr: "سياسات المستشفى (القوائم الذكية)", labelEn: "Hospital Policies & Smart Lists" },
        { id: "audit_center", labelAr: "التدقيق والاعتماد", labelEn: "Audits & Accreditations" },
        { id: "licensemanager", labelAr: "إدارة الرخص", labelEn: "License Manager" },
      ]
    },
    {
      id: "analytics_ai",
      labelAr: "التحليلات والذكاء",
      labelEn: "Analytics & AI",
      icon: Zap,
      hasChildren: true,
      subItems: [
        { id: "missioncontrol", labelAr: "لوحة القيادة التنفيذية ثلاثية الأبعاد", labelEn: "3D Executive Command Center" },
        { id: "predictiveanalytics", labelAr: "التحليلات التنبؤية والعقل الطبي", labelEn: "Predictive Analytics & AI Brain" },
        { id: "aimedicalscribe", labelAr: "الكاتب الطبي بالذكاء الاصطناعي", labelEn: "AI Medical Scribe" },
        { id: "nurseai", labelAr: "الممرضة الذكية", labelEn: "Smart Nurse" },
        { id: "adminchatbot", labelAr: "الروبوت المحادث للموظفين", labelEn: "Admin Chatbot" },
        { id: "digitalpatient", labelAr: "المريض الرقمي", labelEn: "Digital Patient Twin" },
        { id: "physician_command", labelAr: "شاشة الطبيب التنفيذية", labelEn: "Physician Command Center" },
        { id: "gap_manager", labelAr: "نظام إدارة الفجوات", labelEn: "Gap Manager" },
        { id: "enterprisesearch", labelAr: "البحث المؤسسي الشامل", labelEn: "Enterprise Search" },
        { id: "analytics", labelAr: "التحليلات", labelEn: "Analytics Hub" },
        { id: "analyticskpi", labelAr: "مؤشرات الأداء", labelEn: "Analytics KPI" },
      ]
    },
    {
      id: "platform_infrastructure",
      labelAr: "المنصة والبنية التحتية",
      labelEn: "Platform & Infrastructure",
      icon: Database,
      hasChildren: true,
      subItems: [
        { id: "iam", labelAr: "بوابة أمن وحوكمة المنصة", labelEn: "IAM & Platform Security Gate" },
        { id: "integration_center", labelAr: "مركز التكامل والربط", labelEn: "Integration Engine" },
        { id: "workflow_designer", labelAr: "محرك سير العمل والنماذج", labelEn: "Workflow Engine & Forms" },
        { id: "smartformbuilder", labelAr: "باني النماذج", labelEn: "Smart Form Builder" },
        { id: "backup_center", labelAr: "النسخ الاحتياطي والتعافي", labelEn: "Backup & Disaster Recovery" },
        { id: "universaltaskengine", labelAr: "محرك المهام التشغيلية", labelEn: "Operational Task Engine" },
        { id: "enterprisenotificationcenter", labelAr: "مركز الإشعارات الموحد", labelEn: "Notification Engine" },
        { id: "messaging", labelAr: "المراسلات الداخلية", labelEn: "Messaging" },
        { id: "master_data", labelAr: "حوكمة البيانات الأساسية", labelEn: "Master Data Gov" },
        { id: "report_center", labelAr: "مركز طباعة التقارير", labelEn: "Enterprise Report Center" },
        { id: "document_center", labelAr: "مركز الوثائق", labelEn: "Document Center" },
        { id: "permissions_matrix", labelAr: "مصفوفة الصلاحيات المتقدمة", labelEn: "Permissions Matrix" },
        { id: "escalationengine", labelAr: "محرك التصعيد التلقائي", labelEn: "Escalation Engine" },
        { id: "hospitalkernel", labelAr: "نظام التشغيل والأحداث", labelEn: "Hospital OS Kernel" },
        { id: "cybersecurityhub", labelAr: "الأمن السيبراني", labelEn: "Cyber Security Hub" },
      ]
    }
  ]`;

const newContent = content.slice(0, startIndex) + newSystemModules + content.slice(endIndex);
fs.writeFileSync('src/components/HospitalInformationSystem.tsx', newContent);
console.log('Successfully updated systemModules');
