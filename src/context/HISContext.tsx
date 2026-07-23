import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo, useCallback } from "react";
import { useFirestoreSync, useFirestoreSetting } from "../hooks/useFirestoreSync";
import { 
  FormTemplate,
  SavedRecord,
  HospitalBed,
  ClinicalFormInstance
} from "../types";
import { 
  syncPatients, 
  savePatient, 
  deletePatient as apiDeletePatient, 
  syncPrescriptions, 
  savePrescription, 
  syncInvoices, 
  saveInvoice,
  saveHISNotification,
  syncSystemUsers,
  syncDutyTasks,
  syncClinicalRecords,
  syncSetting,
  saveSetting
} from "../lib/storage";

// Internal HIS types
export type PatientJourneyStep = {
  id: string;
  patientId: string;
  department: string;
  status: string;
  startTime: string;
  endTime?: string;
  actionBy: string;
  notesEn?: string;
  notesAr?: string;
};

export type Patient = {
  id: string;
  mrn: string;
  nameEn: string;
  nameAr: string;
  age: number;
  gender: string;
  phone: string;
  status: "registered" | "triage" | "er" | "doctor" | "ward" | "discharged" | "nicu" | "pacu" | "opd" | "waiting" | "pharmacy" | "completed" | "billing" | "lab" | "radiology";
  insurance: string;
  departmentId?: string;
  wardId?: string;
  bedId?: string;
  roomId?: string;
  building?: string;
  floor?: string;
  currentClinicalLocation?: string; // Standard location string
  consumables?: PatientConsumable[];
  [key: string]: any;
};

export type HISDepartment = {
  id: string;
  nameEn: string;
  nameAr: string;
  type: 'clinical' | 'administrative' | 'support';
  building?: string;
  floor?: string;
  manager?: string;
};

export type HISAuditLog = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  device?: string;
  department?: string;
  reason?: string;
};

export type HISClinic = {
  id: string;
  nameEn: string;
  nameAr: string;
  departmentId: string;
  location?: string;
};

export type InventoryItem = {
  id: string;
  nameEn: string;
  nameAr: string;
  type: "medication" | "consumable";
  stockMain: number;
  stockSub: number;
  unit: string;
  price: number;
};

export type PatientConsumable = {
  id: string;
  patientId: string;
  itemId: string;
  itemNameEn: string;
  itemNameAr: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  date: string;
  status: "pending" | "billed";
};

export type Prescription = {
  id: string;
  patientId: string;
  medication: string;
  dose: string;
  qty: number;
  status: "pending" | "dispensed" | "active" | "not_given" | "discontinued" | "administered";
  date: string;
  // Extended fields for structured data and exceptions
  doseNum?: string;
  doseUnit?: string;
  route?: string;
  frequency?: string;
  orderType?: string;
  prnReason?: string;
  durationDays?: number;
  startDate?: string;
  startTime?: string;
  specialInstructions?: string;
  holdReason?: string;
  discontinueReason?: string;
};

export type Invoice = {
  id: string;
  patientId: string;
  amount: number;
  status: "unpaid" | "paid";
  date: string;
};

export type MasterDataEntry = {
  id: string;
  category: string;
  valueEn: string;
  valueAr: string;
  isOfficial: boolean;
  status: "pending" | "approved" | "rejected";
  createdBy: string;
  department?: string;
  module?: string;
  screen?: string;
  fieldName?: string;
  date: string;
  time: string;
  useCount: number;
  hospital?: string;
  branch?: string;
};

interface HISState {
  patients: Patient[];
  addPatient: (p: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  updatePatientStatus: (id: string, status: Patient["status"]) => void;

  masterData: MasterDataEntry[];
  addMasterData: (entry: Omit<MasterDataEntry, "id" | "date" | "time" | "useCount" | "status" | "isOfficial">) => void;
  updateMasterDataStatus: (id: string, status: MasterDataEntry["status"], isOfficial?: boolean) => void;
  deleteMasterData: (id: string) => void;

  prescriptions: Prescription[];
  addPrescription: (p: Prescription) => void;
  updatePrescriptionStatus: (id: string, status: Prescription["status"], extra?: Partial<Prescription>) => void;

  invoices: Invoice[];
  addInvoice: (i: Invoice) => void;
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void;

  activePatient: Patient | null;
  setActivePatient: (p: Patient | null) => void;
  
  admissionRequests: any[];
  setAdmissionRequests: React.Dispatch<React.SetStateAction<any[]>>;
  
  bedMap: Record<string, any>;
  setBedMap: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  
  erQueue: any[];
  setErQueue: React.Dispatch<React.SetStateAction<any[]>>;

  // Infrastructure Data
  beds: HospitalBed[];
  setBeds: React.Dispatch<React.SetStateAction<HospitalBed[]>>;
  departments: HISDepartment[];
  setDepartments: React.Dispatch<React.SetStateAction<HISDepartment[]>>;
  clinics: HISClinic[];
  setClinics: React.Dispatch<React.SetStateAction<HISClinic[]>>;
  auditLogs: HISAuditLog[];
  logAudit: (log: Omit<HISAuditLog, "id" | "timestamp" | "userId" | "userName">) => void;

  // Expanded Administrative Data
  systemUsers: any[];
  dutyTasks: any[];
  clinicalRecords: any[];
  cpoeOrders: any[];
  setCpoeOrders: React.Dispatch<React.SetStateAction<any[]>>;

  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  addConsumableToPatient: (patientId: string, item: InventoryItem, qty: number) => void;
  rosterWishes: any[];
  setRosterWishes: React.Dispatch<React.SetStateAction<any[]>>;
  patientJourneys: PatientJourneyStep[];
  setPatientJourneys: React.Dispatch<React.SetStateAction<PatientJourneyStep[]>>;
  addJourneyStep: (step: Omit<PatientJourneyStep, "id" | "startTime">) => void;
  
  language: "ar" | "en";
  currentUser: any;
}

const HISContext = createContext<HISState | undefined>(undefined);

const EMPTY_ARRAY: any[] = [];
const EMPTY_OBJECT: any = {};

export function HISProvider({ children, isLoggedIn, language = "ar", currentUser = null }: { children: ReactNode, isLoggedIn: boolean, language?: "ar" | "en", currentUser?: any }) {
  const [patients, setPatients] = useFirestoreSync<Patient>(syncPatients, EMPTY_ARRAY);
  const safePatients = Array.isArray(patients) ? patients : EMPTY_ARRAY;
  const [prescriptions, setPrescriptions] = useFirestoreSync<Prescription>(syncPrescriptions, EMPTY_ARRAY);
  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : EMPTY_ARRAY;
  const [invoices, setInvoices] = useFirestoreSync<Invoice>(syncInvoices, EMPTY_ARRAY);
  const safeInvoices = Array.isArray(invoices) ? invoices : EMPTY_ARRAY;
  
  const [systemUsersRaw] = useFirestoreSync<any>(syncSystemUsers, EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [dutyTasksRaw] = useFirestoreSync<any>(syncDutyTasks, EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [clinicalRecordsRaw] = useFirestoreSync<any>(syncClinicalRecords, EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  const [admissionRequestsRaw, setAdmissionRequestsRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_admission_requests', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [bedMapRaw, setBedMapRaw] = useFirestoreSetting<Record<string, any>>(syncSetting, 'his_bed_map', EMPTY_OBJECT, EMPTY_ARRAY, isLoggedIn);
  const [bedsRaw, setBedsRaw] = useFirestoreSetting<HospitalBed[]>(syncSetting, 'his_beds', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [departmentsRaw, setDepartmentsRaw] = useFirestoreSetting<HISDepartment[]>(syncSetting, 'his_departments', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [clinicsRaw, setClinicsRaw] = useFirestoreSetting<HISClinic[]>(syncSetting, 'his_clinics', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [erQueueRaw, setErQueueRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_er_queue', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [cpoeOrdersRaw, setCpoeOrdersRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_cpoe_orders', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [inventoryRaw, setInventoryRaw] = useFirestoreSetting<InventoryItem[]>(syncSetting, 'his_inventory', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [masterDataRaw, setMasterDataRaw] = useFirestoreSetting<MasterDataEntry[]>(syncSetting, 'his_master_data', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [rosterWishesRaw, setRosterWishesRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_roster_wishes', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [patientJourneysRaw, setPatientJourneysRaw] = useFirestoreSetting<PatientJourneyStep[]>(syncSetting, 'his_patient_journeys', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [auditLogsRaw, setAuditLogsRaw] = useFirestoreSetting<HISAuditLog[]>(syncSetting, 'his_audit_logs', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);

  const logAudit = useCallback((log: Omit<HISAuditLog, "id" | "timestamp" | "userId" | "userName">) => {
    const newLog: HISAuditLog = {
      ...log,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || "unknown",
      userName: currentUser?.name || "System"
    };
    setAuditLogsRaw(prev => {
      const newVal = [...(Array.isArray(prev) ? prev : []), newLog];
      saveSetting('his_audit_logs', newVal).catch(console.error);
      return newVal;
    });
  }, [setAuditLogsRaw, currentUser]);

  const setAdmissionRequests = useCallback((valOrFunc: React.SetStateAction<any[]>) => {
    setAdmissionRequestsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_admission_requests', newVal).catch(console.error);
      return newVal;
    });
  }, [setAdmissionRequestsRaw]);

  const setBedMap = useCallback((valOrFunc: React.SetStateAction<Record<string, any>>) => {
    setBedMapRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_bed_map', newVal).catch(console.error);
      return newVal;
    });
  }, [setBedMapRaw]);

  const setBeds = useCallback((valOrFunc: React.SetStateAction<HospitalBed[]>) => {
    setBedsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_beds', newVal).catch(console.error);
      return newVal;
    });
  }, [setBedsRaw]);

  const setDepartments = useCallback((valOrFunc: React.SetStateAction<HISDepartment[]>) => {
    setDepartmentsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_departments', newVal).catch(console.error);
      return newVal;
    });
  }, [setDepartmentsRaw]);

  const setClinics = useCallback((valOrFunc: React.SetStateAction<HISClinic[]>) => {
    setClinicsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_clinics', newVal).catch(console.error);
      return newVal;
    });
  }, [setClinicsRaw]);

  const setErQueue = useCallback((valOrFunc: React.SetStateAction<any[]>) => {
    setErQueueRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_er_queue', newVal).catch(console.error);
      return newVal;
    });
  }, [setErQueueRaw]);

  const setCpoeOrders = useCallback((valOrFunc: React.SetStateAction<any[]>) => {
    setCpoeOrdersRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_cpoe_orders', newVal).catch(console.error);
      return newVal;
    });
  }, [setCpoeOrdersRaw]);

  const setInventory = useCallback((valOrFunc: React.SetStateAction<InventoryItem[]>) => {
    setInventoryRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_inventory', newVal).catch(console.error);
      return newVal;
    });
  }, [setInventoryRaw]);

  const setMasterData = useCallback((valOrFunc: React.SetStateAction<MasterDataEntry[]>) => {
    setMasterDataRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_master_data', newVal).catch(console.error);
      return newVal;
    });
  }, [setMasterDataRaw]);

  const setRosterWishes = useCallback((valOrFunc: React.SetStateAction<any[]>) => {
    setRosterWishesRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_roster_wishes', newVal).catch(console.error);
      return newVal;
    });
  }, [setRosterWishesRaw]);

  const setPatientJourneys = useCallback((valOrFunc: React.SetStateAction<PatientJourneyStep[]>) => {
    setPatientJourneysRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_patient_journeys', newVal).catch(console.error);
      return newVal;
    });
  }, [setPatientJourneysRaw]);

  const addJourneyStep = useCallback((step: Omit<PatientJourneyStep, "id" | "startTime">) => {
    const newStep: PatientJourneyStep = {
      ...step,
      id: `jstp-${Date.now()}`,
      startTime: new Date().toISOString()
    };
    setPatientJourneys(prev => [...(Array.isArray(prev) ? prev : []), newStep]);
  }, [setPatientJourneys]);

  const addPatient = useCallback((p: Patient) => {
    setPatients(prev => [...prev, p]);
    savePatient(p).catch(err => console.error("Cloud patient save error:", err));
  }, [setPatients]);
  
  const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
    let oldVal: any = null;
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        oldVal = { ...p };
        return { ...p, ...updates };
      }
      return p;
    }));
    
    const patient = safePatients.find(p => p.id === id);
    if (patient) {
      const hasChanged = Object.keys(updates).some(key => patient[key as keyof Patient] !== updates[key as keyof Partial<Patient>]);
      if (hasChanged) {
        savePatient({ ...patient, ...updates }).catch(err => console.error("Cloud patient save error:", err));
        logAudit({
          action: 'UPDATE',
          entityType: 'PATIENT',
          entityId: id,
          oldValue: oldVal,
          newValue: { ...oldVal, ...updates }
        });
      }
    }
  }, [setPatients, safePatients, logAudit]);

  const deletePatient = useCallback((id: string) => {
    const patient = safePatients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    apiDeletePatient(id).catch(err => console.error("Cloud patient delete error:", err));
    if (patient) {
      logAudit({
        action: 'DELETE',
        entityType: 'PATIENT',
        entityId: id,
        oldValue: patient
      });
    }
  }, [setPatients, safePatients, logAudit]);

  const updatePatientStatus = useCallback((id: string, status: Patient["status"]) => {
    let oldVal: any = null;
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        oldVal = { ...p };
        return { ...p, status };
      }
      return p;
    }));
    
    const patient = safePatients.find(p => p.id === id);
    if (patient && patient.status !== status) {
      savePatient({ ...patient, status }).catch(err => console.error("Cloud patient save error:", err));
      logAudit({
        action: 'UPDATE_STATUS',
        entityType: 'PATIENT',
        entityId: id,
        oldValue: oldVal,
        newValue: { ...oldVal, status }
      });
      
      // Dispatch real-time Firestore notification
      if (status === "ward") {
        saveHISNotification({
          id: `notif-status-${Date.now()}`,
          message: `تم نقل المريض ${patient.nameAr} لجناح التنويم الداخلي.`, 
          timestamp: new Date().toISOString(),
        }).catch(err => console.error("Cloud notification save error:", err));
      }
    }
  }, [setPatients, safePatients, logAudit]);

  const addConsumableToPatient = useCallback((patientId: string, item: InventoryItem, qty: number) => {
    const patient = safePatients.find(p => p.id === patientId);
    if (!patient) return;

    const newConsumable: PatientConsumable = {
      id: `cons-${Date.now()}`,
      patientId,
      itemId: item.id,
      itemNameEn: item.nameEn,
      itemNameAr: item.nameAr,
      qty,
      unitPrice: item.price,
      totalPrice: item.price * qty,
      date: new Date().toISOString(),
      status: "pending"
    };

    const updatedConsumables = [...(patient.consumables || []), newConsumable];
    updatePatient(patientId, { consumables: updatedConsumables });

    // Deduct from inventory
    setInventory(prev => prev.map(inv => {
      if (inv.id === item.id) {
        // Simple logic: deduct from sub-store first, then main-store
        let newSub = inv.stockSub - qty;
        let newMain = inv.stockMain;
        if (newSub < 0) {
          newMain += newSub; // newSub is negative, so this subtracts
          newSub = 0;
        }
        return { ...inv, stockSub: Math.max(0, newSub), stockMain: Math.max(0, newMain) };
      }
      return inv;
    }));
  }, [safePatients, updatePatient, setInventory]);

  const admissionRequests = useMemo(() => Array.isArray(admissionRequestsRaw) ? admissionRequestsRaw : EMPTY_ARRAY, [admissionRequestsRaw]);
  const erQueue = useMemo(() => Array.isArray(erQueueRaw) ? erQueueRaw : EMPTY_ARRAY, [erQueueRaw]);
  const bedMap = useMemo(() => bedMapRaw || {}, [bedMapRaw]);
  const beds = useMemo(() => Array.isArray(bedsRaw) ? bedsRaw : EMPTY_ARRAY as HospitalBed[], [bedsRaw]);
  const departments = useMemo(() => Array.isArray(departmentsRaw) ? departmentsRaw : EMPTY_ARRAY, [departmentsRaw]);
  const clinics = useMemo(() => Array.isArray(clinicsRaw) ? clinicsRaw : EMPTY_ARRAY, [clinicsRaw]);
  const cpoeOrders = useMemo(() => Array.isArray(cpoeOrdersRaw) ? cpoeOrdersRaw : EMPTY_ARRAY, [cpoeOrdersRaw]);
  const inventory = useMemo(() => Array.isArray(inventoryRaw) ? inventoryRaw : EMPTY_ARRAY, [inventoryRaw]);
  const masterData = useMemo(() => Array.isArray(masterDataRaw) ? masterDataRaw : EMPTY_ARRAY, [masterDataRaw]);
  const rosterWishes = useMemo(() => Array.isArray(rosterWishesRaw) ? rosterWishesRaw : EMPTY_ARRAY, [rosterWishesRaw]);
  const auditLogs = useMemo(() => Array.isArray(auditLogsRaw) ? auditLogsRaw : EMPTY_ARRAY, [auditLogsRaw]);
  const patientJourneys = useMemo(() => Array.isArray(patientJourneysRaw) ? patientJourneysRaw : EMPTY_ARRAY, [patientJourneysRaw]);
  const systemUsers = useMemo(() => Array.isArray(systemUsersRaw) ? systemUsersRaw : EMPTY_ARRAY, [systemUsersRaw]);
  const dutyTasks = useMemo(() => Array.isArray(dutyTasksRaw) ? dutyTasksRaw : EMPTY_ARRAY, [dutyTasksRaw]);
  const clinicalRecords = useMemo(() => Array.isArray(clinicalRecordsRaw) ? clinicalRecordsRaw : EMPTY_ARRAY, [clinicalRecordsRaw]);
  
  // Seed initial mock data if empty (useful for fresh DB)
  const [hasSeeded, setHasSeeded] = useState(false);
  useEffect(() => {
    if (safePatients.length === 0 && !hasSeeded) {
      setTimeout(() => {
        setHasSeeded(true);
      }, 0);
      // Wait a moment for sync to settle, then add default data only if it is actually empty
      setTimeout(() => {
        if (safePatients.length === 0) {
          // ... (existing savePatient calls)
        }
        
        // Seed inventory if empty
        if (inventory.length === 0) {
          setInventory([
            { id: "inv-1", nameEn: "Syringe 5ml", nameAr: "سرنجة 5 مل", type: "consumable", stockMain: 1000, stockSub: 200, unit: "pc", price: 5 },
            { id: "inv-2", nameEn: "Syringe 10ml", nameAr: "سرنجة 10 مل", type: "consumable", stockMain: 800, stockSub: 150, unit: "pc", price: 8 },
            { id: "inv-3", nameEn: "Gauze Pad", nameAr: "شاش طبي", type: "consumable", stockMain: 500, stockSub: 100, unit: "pack", price: 15 },
            { id: "inv-4", nameEn: "Paracetamol 500mg", nameAr: "باراسيتامول 500 ملجم", type: "medication", stockMain: 2000, stockSub: 500, unit: "tablet", price: 2 }
          ]);
        }

        // Seed Master Data if empty
        if (masterData.length === 0) {
          setMasterData([
            { id: "md-ins-1", category: "insurance", valueEn: "Cash", valueAr: "كاش", isOfficial: true, status: "approved", useCount: 0, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
            { id: "md-ins-2", category: "insurance", valueEn: "Bupa", valueAr: "بوبا", isOfficial: true, status: "approved", useCount: 0, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
            { id: "md-ins-3", category: "insurance", valueEn: "Tawuniya", valueAr: "التعاونية", isOfficial: true, status: "approved", useCount: 0, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
            { id: "md-ins-4", category: "insurance", valueEn: "MedNet", valueAr: "ميد نت", isOfficial: true, status: "approved", useCount: 0, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
            { id: "md-city-1", category: "city", valueEn: "Cairo", valueAr: "القاهرة", isOfficial: true, status: "approved", useCount: 0, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
            { id: "md-city-2", category: "city", valueEn: "Giza", valueAr: "الجيزة", isOfficial: true, status: "approved", useCount: 0, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
            { id: "md-city-3", category: "city", valueEn: "Alexandria", valueAr: "الإسكندرية", isOfficial: true, status: "approved", useCount: 0, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
            { id: "md-nat-1", category: "nationality", valueEn: "Egyptian", valueAr: "مصري", isOfficial: true, status: "approved", useCount: 0, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
            { id: "md-nat-2", category: "nationality", valueEn: "Saudi", valueAr: "سعودي", isOfficial: true, status: "approved", useCount: 0, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
          ]);
        }
      }, 5000);
    }
  }, [safePatients.length, hasSeeded, inventory.length]);

  const addPrescription = useCallback((p: Prescription) => {
    savePrescription(p).catch(err => console.error("Cloud prescription save error:", err));
  }, []);
  
  const updatePrescriptionStatus = useCallback((id: string, status: Prescription["status"], extra?: Partial<Prescription>) => {
    const prescription = safePrescriptions.find(p => p.id === id);
    if (prescription) {
      savePrescription({ ...prescription, status, ...extra }).catch(err => console.error("Cloud prescription save error:", err));
    }
    // Also sync nested prescriptions in the patient record
    const patient = safePatients.find(p => p.prescriptions?.some((rx: any) => rx.id === id) || p.id === prescription?.patientId);
    if (patient && patient.prescriptions) {
      const updatedPrescriptions = patient.prescriptions.map((rx: any) => {
        if (rx.id === id) {
          return { ...rx, status, ...extra };
        }
        return rx;
      });
      savePatient({ ...patient, prescriptions: updatedPrescriptions }).catch(err => console.error("Cloud patient save error:", err));
    }
  }, [safePrescriptions, safePatients]);

  const addMasterData = useCallback((entry: Omit<MasterDataEntry, "id" | "date" | "time" | "useCount" | "status" | "isOfficial">) => {
    const existing = masterData.find(m => 
      m.category === entry.category && 
      (m.valueEn.toLowerCase() === entry.valueEn.toLowerCase() || 
       m.valueAr === entry.valueAr)
    );

    if (existing) {
      setMasterData(prev => prev.map(m => m.id === existing.id ? { ...m, useCount: m.useCount + 1 } : m));
      return;
    }

    const now = new Date();
    const newEntry: MasterDataEntry = {
      ...entry,
      id: `md-${Math.random().toString(36).substr(2, 9)}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      useCount: 1,
      status: "pending",
      isOfficial: false
    };

    setMasterData(prev => [...prev, newEntry]);
  }, [masterData, setMasterData]);

  const updateMasterDataStatus = useCallback((id: string, status: MasterDataEntry["status"], isOfficial: boolean = false) => {
    setMasterData(prev => prev.map(m => m.id === id ? { ...m, status, isOfficial } : m));
  }, [setMasterData]);

  const deleteMasterData = useCallback((id: string) => {
    setMasterData(prev => prev.filter(m => m.id !== id));
  }, [setMasterData]);

  const addInvoice = useCallback((i: Invoice) => {
    saveInvoice(i).catch(err => console.error("Cloud invoice save error:", err));
  }, []);
  
  const updateInvoiceStatus = useCallback((id: string, status: Invoice["status"]) => {
    const invoice = safeInvoices.find(inv => inv.id === id);
    if (invoice && invoice.status !== status) {
        saveInvoice({ ...invoice, status }).catch(err => console.error("Cloud invoice save error:", err));
    }
  }, [safeInvoices]);

  const contextValue = useMemo(() => ({
    patients: safePatients, addPatient, updatePatient, deletePatient, updatePatientStatus,
    prescriptions: safePrescriptions, addPrescription, updatePrescriptionStatus,
    masterData, addMasterData, updateMasterDataStatus, deleteMasterData,
    invoices: safeInvoices, addInvoice, updateInvoiceStatus,
    activePatient, setActivePatient,
    admissionRequests, setAdmissionRequests,
    bedMap, setBedMap,
    beds, setBeds,
    erQueue, setErQueue,
    systemUsers,
    dutyTasks,
    clinicalRecords,
    departments,
    setDepartments,
    clinics,
    setClinics,
    auditLogs,
    logAudit,
    cpoeOrders,
    setCpoeOrders,
    inventory,
    setInventory,
    addConsumableToPatient,
    patientJourneys,
    setPatientJourneys,
    addJourneyStep,
    rosterWishes,
    setRosterWishes,
    language,
    currentUser
  }), [
    safePatients, addPatient, updatePatient, deletePatient, updatePatientStatus,
    safePrescriptions, addPrescription, updatePrescriptionStatus,
    masterData, addMasterData, updateMasterDataStatus, deleteMasterData,
    safeInvoices, addInvoice, updateInvoiceStatus,
    activePatient, setActivePatient,
    admissionRequests, setAdmissionRequests,
    bedMap, setBedMap,
    beds, setBeds,
    erQueue, setErQueue,
    systemUsers,
    dutyTasks,
    clinicalRecords,
    departments,
    setDepartments,
    clinics,
    setClinics,
    auditLogs,
    logAudit,
    cpoeOrders,
    setCpoeOrders,
    inventory,
    setInventory,
    addConsumableToPatient,
    patientJourneys,
    setPatientJourneys,
    addJourneyStep,
    rosterWishes,
    setRosterWishes,
    language,
    currentUser
  ]);

  return (
    <HISContext.Provider value={contextValue}>
      {children}
    </HISContext.Provider>
  );
}

export default HISProvider;

export function useHIS() {
  const context = useContext(HISContext);
  if (context === undefined) {
    throw new Error('useHIS must be used within a HISProvider');
  }
  return context;
}
