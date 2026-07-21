/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FormTemplate {
  id: string;
  code: string; // e.g. BHG-FR-GEN-027
  titleAr: string;
  titleEn: string;
  departmentDefault: string;
  version?: string;
  issueDate?: string;
  hasPatientDetails?: boolean;
  items?: Omit<GridRow, "days">[]; // Custom initial items
  isCloudDocument?: boolean;
  documentData?: string;
  documentType?: string;
}

export interface SavedRecord {
  id: string;
  templateId: string;
  date: string;
  time: string;
  department: string;
  staffName: string;
  staffId: string;
  notes?: string;
  createdAt?: string;
  shift?: string; // Active clinical tracking shift/period
  status?: string; // status e.g. "Pending", "Submitted by [Employee]", etc.
  // Patient / Custom Info
  patientName?: string;
  patientMRN?: string;
  diagnosis?: string;
  additionalInfo?: Record<string, any>;
  // The actual form data grid
  gridData: GridRow[];
}

export interface GridRow {
  sn?: string; // Serial number
  code?: string; // Item code/ID
  itemAr: string;
  itemEn: string;
  unit?: string;
  qty?: string;
  expiry?: string;
  batch?: string;
  days: Record<string, string>; // Map of "day" (1-31) to status ("✔", "✘", "1", "2.5", empty, etc.)
  extraType?: string; // e.g., 'select', 'text', 'checkbox'
}

export interface Role {
  id: string;
  name?: string;
  nameAr: string;
  nameEn: string;
}

export interface Permission {
  id: string;
  name?: string;
  nameAr: string;
  nameEn: string;
}

export interface AccessMatrix {
  id: string;
  roleId: string;
  permissionId: string;
  enabled: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: number;
}

export type UserRole = "admin" | "head_nurse" | "quality" | "president" | "staff" | "Staff" | "it" | "tech" | "intern" | "assistant" | "secretary" | "supervisor" | "nursing_director" | "ward_clerk";

export interface AppUser {
  id: string;
  nameAr: string;
  nameEn: string;
  role: UserRole; // This appears to be deprecated in favor of roleId? I will keep it for compatibility but add roleId
  roleId?: string; // Dynamic role
  status?: "pending" | "active" | "disabled";
  avatarInitials: string;
  avatar?: string;
  profilePictureUrl?: string;
  department: string;
  staffId: string;
  pin?: string; 
  email?: string;
  emp_id?: string;
  assigned_dept?: string;
  supervisorId?: string;
  permissions?: string[];
  moduleOverrides?: string[];
  moduleDenials?: string[];
  bloodGroup?: string;
  issueDate?: string;
  expiryDate?: string;
  idCardTermsAr?: string;
  idCardTermsEn?: string;
}


export interface DailyDutyTask {
  id: string;
  department: string;
  taskAr: string;
  taskEn: string;
  categoryAr: string;
  categoryEn: string;
  createdAt: string;
}

export interface UnitDailyChecklist {
  id: string;
  department: string;
  date: string;
  completedByStaffName: string;
  completedByStaffId: string;
  completedAt: string;
  status: "completed" | "audited";
  auditedByStaffName?: string;
  auditedByStaffId?: string;
  auditedAt?: string;
  auditNotes?: string;
  answers: Record<string, { done: boolean; note?: string }>;
}

export interface SystemLog {
  id: string;
  event: string;
  type: "info" | "warning" | "success" | "error";
  time: string;
  timestampMs: number;
}

export interface RosterRow {
  employeeId: string;
  employeeNameAr: string;
  employeeNameEn: string;
  roleTitleAr: string;
  roleTitleEn: string;
  employeeCode: string;
  shifts: Record<string, string>; // e.g. "16" -> "DN"
}

export interface DepartmentRoster {
  id: string;
  departmentName: string;
  startDate: string; // "2026-05-16"
  endDate: string;   // "2026-06-15"
  rows: RosterRow[];
}

export const EntityType = {
  PATIENT: "patient",
  CASE: "case",
  PROCEDURE: "procedure",
  NOTIFICATION: "notification",
  LAB_RESULT: "lab_result",
  MEDICATION: "medication",
  DOCTOR: "doctor",
  ROOM: "room",
  BED: "bed",
} as const;

export type EntityTypeValue = typeof EntityType[keyof typeof EntityType];

export interface EntityShape {
  type: EntityTypeValue | string;
  id: string | number;
  name?: string;
  context?: any;
}

export interface Notification {
  id: string;
  userId?: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  read: boolean;
  type?: string;
  targetDepartment?: string;
  titleAr?: string;
  titleEn?: string;
  bodyAr?: string;
  bodyEn?: string;
  targetTab?: string;
  targetSubTab?: string;
  targetUserId?: string;
  entity?: EntityShape;
}

export interface RosterWish {
  id: string;
  employeeId: string;
  employeeNameAr: string;
  employeeNameEn: string;
  departmentName: string;
  dayKey: string;
  requestedShift: "M" | "A" | "D" | "N" | "DN" | "OFF" | "AL";
  reasonAr?: string;
  reasonEn?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export type TaskStatus = "draft" | "pending" | "approved" | "in_progress" | "completed" | "cancelled" | "rejected";

export interface HospitalTask {
  id: string;
  workflowId: string;
  patientId: string;
  patientMRN: string;
  assignedToRole?: string; // e.g. "lab", "pharmacy", "nurse"
  assignedToUserId?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status: TaskStatus;
  priority: "routine" | "urgent" | "stat";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  slaMinutes?: number;
  isEscalated?: boolean;
  type: "clinical" | "administrative" | "lab" | "radiology" | "pharmacy" | "nursing" | "porter" | "housekeeping";
}

export interface PatientActivity {
  id: string;
  patientId: string;
  workflowId: string;
  type: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  staffId: string;
  staffName: string;
}

export type WorkflowStage = 
  | "appointment" 
  | "registration" 
  | "insurance_verification" 
  | "check_in" 
  | "triage" 
  | "doctor_consultation" 
  | "diagnosis" 
  | "orders" 
  | "lab_rad_execution" 
  | "medication_administration" 
  | "nursing_care" 
  | "billing" 
  | "discharge" 
  | "follow_up";

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  nameAr: string;
  nameEn: string;
  gender: "male" | "female";
  dob: string;
  nationality: string;
  nationalId: string;
  phone: string;
  bloodGroup?: string;
  allergies?: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  currentWorkflowStage: WorkflowStage;
  workflowId?: string; // ID of the current active visit/workflow
  age: number;
}

export interface RosterAuditLog {
  id: string;
  timestamp: string | number;
  whoId: string;
  whoName: string;
  what: string;
  department?: string;
}

export interface PatientVisitWorkflow {
  id: string;
  patientId: string;
  patientMRN: string;
  startTime: string;
  endTime?: string;
  currentStage: WorkflowStage;
  status: "active" | "completed" | "cancelled";
  history: {
    stage: WorkflowStage;
    startTime: string;
    endTime?: string;
    completedByStaffId?: string;
  }[];
}

export interface ClinicalNote {
  id: string;
  workflowId: string;
  patientId: string;
  patientMRN: string;
  staffId: string;
  staffName: string;
  noteType: "SOAP" | "Progress" | "Nursing" | "Consultation" | "Operation" | "Discharge" | "Procedure" | "Daily" | "WardRound" | "ICU";
  content: string; // Can be JSON string for structured notes like SOAP
  soapData?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  timestamp: string;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  staffId: string;
  timestamp: string;
  temperature: number;
  pulse: number;
  respiratoryRate: number;
  bloodPressure: string; // e.g. "120/80"
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  bmi?: number;
  painScale?: number; // 0-10
  // Compatibility with UI components
  patientName?: string;
  patientMRN?: string;
  temp?: string | number;
  bp?: string;
  hr?: string | number;
  spo2?: string | number;
  createdAt?: any;
}

export interface NursingAssessment {
  id: string;
  patientId: string;
  staffId: string;
  timestamp: string;
  assessmentType: "Braden" | "Glasgow" | "FallRisk" | "Skin" | "CarePlan" | "FluidBalance";
  data: Record<string, any>;
  score?: number;
}

export interface MARRecord { // Medication Administration Record
  id: string;
  patientId: string;
  orderId: string;
  medicationName: string;
  dosage: string;
  route: string;
  scheduledTime: string;
  administeredTime?: string;
  administeredByStaffId?: string;
  status: "scheduled" | "administered" | "skipped" | "refused";
  barcodeScanned?: boolean;
}

export interface Order {
  id: string;
  patientId: string;
  workflowId: string;
  staffId: string; // Prescribing doctor
  orderType: "lab" | "radiology" | "medication" | "procedure";
  itemName: string;
  itemCode?: string;
  status: "pending" | "collected" | "processing" | "completed" | "cancelled";
  results?: any;
  priority: "routine" | "urgent" | "stat";
  timestamp: string;
}

export interface BillingClaim {
  id: string;
  workflowId: string;
  patientId: string;
  totalAmount: number;
  insuranceAmount: number;
  patientAmount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  items: {
    description: string;
    code: string; // CPT/ICD
    quantity: number;
    unitPrice: number;
  }[];
}

export interface ICURecord {
  id: string;
  patientId: string;
  timestamp: string;
  ventilatorSettings?: any;
  abgResults?: any;
  hemodynamicData?: any;
  sofaScore?: number;
  apache2Score?: number;
}


export interface DBPatientSchema {
  id: string;
  mrn: string;
  national_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'MALE' | 'FEMALE';
  blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone_mobile: string;
  phone_home?: string;
  email?: string;
  address?: {
    city: string;
    district: string;
    street: string;
    building: string;
  };
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  insurance_company_id?: string;
  insurance_policy_number?: string;
  insurance_expiry_date?: string;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DBEncounterSchema {
  id: string;
  patient_id: string;
  encounter_type: 'OPD' | 'IPD' | 'ER';
  status: 'SCHEDULED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'ON_HOLD' | 'CLOSED' | 'CANCELLED';
  department_id?: string;
  primary_doctor_id?: string;
  bed_id?: string;
  admission_datetime?: string;
  discharge_datetime?: string;
  chief_complaint?: string;
  clinical_notes?: {
    notes: string;
    vitals: any;
    diagnosis: string;
  };
  triage_level?: number;
}



