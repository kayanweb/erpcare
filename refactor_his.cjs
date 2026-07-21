const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalInformationSystem.tsx', 'utf8');

const newModules = `const systemModules = [
  { id: "dashboard", labelAr: "لوحة القيادة", labelEn: "Dashboard", icon: LayoutDashboard, subItems: [
    { id: "missioncontrol", labelAr: "مركز القيادة", labelEn: "Command Center" },
    { id: "analytics", labelAr: "التحليلات", labelEn: "Analytics" }
  ]},
  { id: "registration", labelAr: "إدارة المرضى", labelEn: "Patient Management", icon: UserPlus, subItems: [
    { id: "admissioncenter", labelAr: "الدخول والخروج", labelEn: "ADT (Admission, Discharge, Transfer)" },
    { id: "empi", labelAr: "السجل الموحد", labelEn: "EMPI" },
    { id: "smartbedallocation", labelAr: "إدارة الأسرة", labelEn: "Bed Management" }
  ]},
  { id: "outpatient", labelAr: "العيادات الخارجية", labelEn: "Outpatient (OPD)", icon: Stethoscope, subItems: [
    { id: "clinics", labelAr: "قائمة العيادات", labelEn: "Clinics List" },
    { id: "telemedicine", labelAr: "الطب الاتصالي", labelEn: "Telemedicine" }
  ]},
  { id: "emergency", labelAr: "الطوارئ", labelEn: "Emergency (ER)", icon: AlertTriangle, subItems: [
    { id: "er", labelAr: "لوحة الطوارئ", labelEn: "ER Dashboard" },
    { id: "ambulance", labelAr: "الإسعاف", labelEn: "Ambulance" }
  ]},
  { id: "inpatient", labelAr: "التنويم", labelEn: "Inpatient (IPD)", icon: Bed, subItems: [
    { id: "wards", labelAr: "الأقسام الداخلية", labelEn: "Wards Dashboard" },
    { id: "icu", labelAr: "العناية المركزة", labelEn: "ICU Dashboard" },
    { id: "nursingflowkardex", labelAr: "التمريض", labelEn: "Nursing Kardex" }
  ]},
  { id: "surgery", labelAr: "العمليات", labelEn: "Surgery (OR)", icon: Scissors, subItems: [
    { id: "operatingtheater", labelAr: "لوحة العمليات", labelEn: "OR Dashboard" },
    { id: "cssd", labelAr: "التعقيم المركزي", labelEn: "CSSD" }
  ]},
  { id: "pharmacy", labelAr: "الصيدلية", labelEn: "Pharmacy", icon: Pill, subItems: [
    { id: "pharmacy", labelAr: "الصيدلية المركزية", labelEn: "Central Pharmacy" }
  ]},
  { id: "laboratory", labelAr: "المختبر", labelEn: "Laboratory", icon: FlaskConical, subItems: [
    { id: "lisris", labelAr: "نظام المختبر (LIS)", labelEn: "LIS" },
    { id: "bloodbank", labelAr: "بنك الدم", labelEn: "Blood Bank" }
  ]},
  { id: "radiology", labelAr: "الأشعة", labelEn: "Radiology", icon: Radio, subItems: [
    { id: "radiology", labelAr: "نظام الأشعة (RIS/PACS)", labelEn: "RIS/PACS" }
  ]},
  { id: "billing", labelAr: "دورة الإيرادات", labelEn: "Revenue Cycle", icon: CreditCard, subItems: [
    { id: "revenuecycle", labelAr: "الفوترة والتأمين", labelEn: "Billing & Insurance" }
  ]},
  { id: "operations", labelAr: "العمليات", labelEn: "Operations", icon: Layers, subItems: [
    { id: "enterpriseinventoryengine", labelAr: "المخزون", labelEn: "Inventory" },
    { id: "assetmanagement", labelAr: "الأصول", labelEn: "Assets" },
    { id: "transport", labelAr: "النقل", labelEn: "Transport" }
  ]},
  { id: "administration", labelAr: "الإدارة", labelEn: "Administration", icon: Building, subItems: [
    { id: "hr", labelAr: "الموارد البشرية", labelEn: "HR" },
    { id: "iam", labelAr: "الصلاحيات", labelEn: "IAM" },
    { id: "audit_center", labelAr: "التدقيق", labelEn: "Audit" }
  ]}
];`;

content = content.replace(/const systemModules = \[[\s\S]*?^\];/m, newModules);

fs.writeFileSync('src/components/HospitalInformationSystem.tsx', content);
