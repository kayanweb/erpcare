import { 
  LayoutDashboard, 
  UserPlus, 
  Stethoscope, 
  AlertTriangle, 
  Bed, 
  Scissors, 
  Pill, 
  FlaskConical, 
  Radio, 
  CreditCard, 
  Layers, 
  Building,
  Activity,
  Microscope,
  FileText,
  Truck,
  Users,
  ShieldCheck,
  Search
} from "lucide-react";

export interface HISSubModule {
  id: string;
  labelAr: string;
  labelEn: string;
  component?: string; // For dynamic loading if needed, or just for reference
}

export interface HISModule {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: any;
  subItems: HISSubModule[];
}

export const systemModules: HISModule[] = [
  { 
    id: "dashboard", 
    labelAr: "مركز القيادة", 
    labelEn: "Command Center", 
    icon: LayoutDashboard, 
    subItems: [
      { id: "missioncontrol", labelAr: "مركز القيادة السريري", labelEn: "Clinical Command Center" },
      { id: "analytics", labelAr: "لوحة مؤشرات الأداء", labelEn: "KPI Analytics" }
    ]
  },
  { 
    id: "registration", 
    labelAr: "إدارة المرضى", 
    labelEn: "Patient Flow", 
    icon: UserPlus, 
    subItems: [
      { id: "admissioncenter", labelAr: "مركز القبول والتسجيل (ADT)", labelEn: "Admission Center (ADT)" },
      { id: "empi", labelAr: "إدارة الهوية الطبية (EMPI)", labelEn: "Identity Management (EMPI)" },
      { id: "smartbedallocation", labelAr: "إدارة وتوزيع الأسرة", labelEn: "Bed Management" }
    ]
  },
  { 
    id: "outpatient", 
    labelAr: "العيادات الخارجية", 
    labelEn: "Outpatient (OPD)", 
    icon: Stethoscope, 
    subItems: [
      { id: "clinics", labelAr: "قائمة العيادات", labelEn: "Clinics List" },
      { id: "telemedicine", labelAr: "الطب الاتصالي", labelEn: "Telemedicine" }
    ]
  },
  { 
    id: "emergency", 
    labelAr: "الطوارئ", 
    labelEn: "Emergency (ER)", 
    icon: AlertTriangle, 
    subItems: [
      { id: "er", labelAr: "لوحة الطوارئ الذكية", labelEn: "ER Workspace" },
      { id: "ambulance", labelAr: "إدارة الإسعاف", labelEn: "Ambulance Dashboard" }
    ]
  },
  { 
    id: "inpatient", 
    labelAr: "التنويم", 
    labelEn: "Inpatient (IPD)", 
    icon: Bed, 
    subItems: [
      { id: "wards", labelAr: "أجنحة التنويم", labelEn: "Wards Workspace" },
      { id: "icu", labelAr: "العناية المركزة", labelEn: "ICU Dashboard" },
      { id: "nursingflowkardex", labelAr: "متابعة التمريض (Kardex)", labelEn: "Nursing Kardex" }
    ]
  },
  { 
    id: "surgery", 
    labelAr: "العمليات", 
    labelEn: "Surgery (OR)", 
    icon: Scissors, 
    subItems: [
      { id: "operatingtheater", labelAr: "لوحة العمليات الحية", labelEn: "Live OR Board" },
      { id: "cssd", labelAr: "التعقيم المركزي", labelEn: "CSSD Workspace" }
    ]
  },
  { 
    id: "pharmacy", 
    labelAr: "الصيدلية", 
    labelEn: "Pharmacy", 
    icon: Pill, 
    subItems: [
      { id: "pharmacy", labelAr: "الصيدلية المركزية", labelEn: "Central Pharmacy" }
    ]
  },
  { 
    id: "laboratory", 
    labelAr: "المختبر", 
    labelEn: "Laboratory", 
    icon: FlaskConical, 
    subItems: [
      { id: "lisris", labelAr: "نظام المختبر (LIS)", labelEn: "LIS Workspace" },
      { id: "bloodbank", labelAr: "بنك الدم", labelEn: "Blood Bank" }
    ]
  },
  { 
    id: "radiology", 
    labelAr: "الأشعة", 
    labelEn: "Radiology", 
    icon: Radio, 
    subItems: [
      { id: "radiology", labelAr: "نظام الأشعة (RIS/PACS)", labelEn: "RIS/PACS Board" }
    ]
  },
  { 
    id: "billing", 
    labelAr: "دورة الإيرادات", 
    labelEn: "Revenue Cycle", 
    icon: CreditCard, 
    subItems: [
      { id: "revenuecycle", labelAr: "الفوترة والتأمين", labelEn: "Billing & Claims" }
    ]
  },
  { 
    id: "operations", 
    labelAr: "العمليات اللوجستية", 
    labelEn: "Operations", 
    icon: Layers, 
    subItems: [
      { id: "enterpriseinventoryengine", labelAr: "إدارة المخزون", labelEn: "Inventory Control" },
      { id: "assetmanagement", labelAr: "إدارة الأصول", labelEn: "Asset Tracking" },
      { id: "transport", labelAr: "نقل المرضى", labelEn: "Patient Transport" }
    ]
  },
  { 
    id: "administration", 
    labelAr: "الإدارة والنظام", 
    labelEn: "Administration", 
    icon: Building, 
    subItems: [
      { id: "hr", labelAr: "الموارد البشرية", labelEn: "Human Resources" },
      { id: "iam", labelAr: "صلاحيات الوصول (IAM)", labelEn: "Access Control (IAM)" },
      { id: "audit_center", labelAr: "مركز التدقيق", labelEn: "Audit Center" }
    ]
  }
];
