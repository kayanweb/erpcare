import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useFirestoreSync, useFirestoreSetting } from "../hooks/useFirestoreSync";
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
  status: "registered" | "triage" | "er" | "doctor" | "ward" | "discharged" | "nicu" | "pacu" | "opd";
  insurance: string;
  departmentId?: string;
  wardId?: string;
  bedId?: string;
  consumables?: PatientConsumable[];
  [key: string]: any; // Allow dynamic clinical data
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

  // Expanded Administrative Data
  systemUsers: any[];
  dutyTasks: any[];
  clinicalRecords: any[];
  departments: string[];
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

export function HISProvider({ children, isLoggedIn, language = "ar", currentUser = null }: { children: ReactNode, isLoggedIn: boolean, language?: "ar" | "en", currentUser?: any }) {
  const [patients, setPatients] = useFirestoreSync<Patient>(syncPatients, []);
  const safePatients = Array.isArray(patients) ? patients : [];
  const [prescriptions, setPrescriptions] = useFirestoreSync<Prescription>(syncPrescriptions, []);
  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : [];
  const [invoices, setInvoices] = useFirestoreSync<Invoice>(syncInvoices, []);
  const safeInvoices = Array.isArray(invoices) ? invoices : [];
  
  const [systemUsersRaw] = useFirestoreSync<any>(syncSystemUsers, [], [], isLoggedIn);
  const [dutyTasksRaw] = useFirestoreSync<any>(syncDutyTasks, [], [], isLoggedIn);
  const [clinicalRecordsRaw] = useFirestoreSync<any>(syncClinicalRecords, [], [], isLoggedIn);
  
  const systemUsers = Array.isArray(systemUsersRaw) ? systemUsersRaw : [];
  const dutyTasks = Array.isArray(dutyTasksRaw) ? dutyTasksRaw : [];
  const clinicalRecords = Array.isArray(clinicalRecordsRaw) ? clinicalRecordsRaw : [];
  
  // Assuming departments are hardcoded or fetched elsewhere, for now, let's use a default
  const departments = ["EMERGENCY UNIT", "INTENSIVE CARE", "OPERATING ROOM", "RADIOLOGY UNIT", "PHARMACY STORE", "PEDIATRIC WARD", "QUALITY CONTROL", "LABORATORY DEPT"];
  
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  const [admissionRequestsRaw, setAdmissionRequestsRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_admission_requests', [], [], isLoggedIn);
  const [bedMapRaw, setBedMapRaw] = useFirestoreSetting<Record<string, any>>(syncSetting, 'his_bed_map', {}, [], isLoggedIn);
  const [erQueueRaw, setErQueueRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_er_queue', [], [], isLoggedIn);
  const [cpoeOrdersRaw, setCpoeOrdersRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_cpoe_orders', [], [], isLoggedIn);
  const [inventoryRaw, setInventoryRaw] = useFirestoreSetting<InventoryItem[]>(syncSetting, 'his_inventory', [], [], isLoggedIn);
  const [masterDataRaw, setMasterDataRaw] = useFirestoreSetting<MasterDataEntry[]>(syncSetting, 'his_master_data', [], [], isLoggedIn);
  const [rosterWishesRaw, setRosterWishesRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_roster_wishes', [], [], isLoggedIn);
  const [patientJourneysRaw, setPatientJourneysRaw] = useFirestoreSetting<PatientJourneyStep[]>(syncSetting, 'his_patient_journeys', [], [], isLoggedIn);

  const setAdmissionRequests = (valOrFunc: React.SetStateAction<any[]>) => {
    setAdmissionRequestsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_admission_requests', newVal).catch(console.error);
      return newVal;
    });
  };

  const setBedMap = (valOrFunc: React.SetStateAction<Record<string, any>>) => {
    setBedMapRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_bed_map', newVal).catch(console.error);
      return newVal;
    });
  };

  const setErQueue = (valOrFunc: React.SetStateAction<any[]>) => {
    setErQueueRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_er_queue', newVal).catch(console.error);
      return newVal;
    });
  };

  const setCpoeOrders = (valOrFunc: React.SetStateAction<any[]>) => {
    setCpoeOrdersRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_cpoe_orders', newVal).catch(console.error);
      return newVal;
    });
  };

  const setInventory = (valOrFunc: React.SetStateAction<InventoryItem[]>) => {
    setInventoryRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_inventory', newVal).catch(console.error);
      return newVal;
    });
  };

  const setMasterData = (valOrFunc: React.SetStateAction<MasterDataEntry[]>) => {
    setMasterDataRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_master_data', newVal).catch(console.error);
      return newVal;
    });
  };

  const setRosterWishes = (valOrFunc: React.SetStateAction<any[]>) => {
    setRosterWishesRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_roster_wishes', newVal).catch(console.error);
      return newVal;
    });
  };

  const setPatientJourneys = (valOrFunc: React.SetStateAction<PatientJourneyStep[]>) => {
    setPatientJourneysRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_patient_journeys', newVal).catch(console.error);
      return newVal;
    });
  };

  const addJourneyStep = (step: Omit<PatientJourneyStep, "id" | "startTime">) => {
    const newStep: PatientJourneyStep = {
      ...step,
      id: `jstp-${Date.now()}`,
      startTime: new Date().toISOString()
    };
    setPatientJourneys(prev => [...(Array.isArray(prev) ? prev : []), newStep]);
  };

  const addConsumableToPatient = (patientId: string, item: InventoryItem, qty: number) => {
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
  };

  const admissionRequests = Array.isArray(admissionRequestsRaw) ? admissionRequestsRaw : [];
  const erQueue = Array.isArray(erQueueRaw) ? erQueueRaw : [];
  const bedMap = bedMapRaw || {};
  const cpoeOrders = Array.isArray(cpoeOrdersRaw) ? cpoeOrdersRaw : [];
  const inventory = Array.isArray(inventoryRaw) ? inventoryRaw : [];
  const masterData = Array.isArray(masterDataRaw) ? masterDataRaw : [];
  const rosterWishes = Array.isArray(rosterWishesRaw) ? rosterWishesRaw : [];
  
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

  const addPatient = (p: Patient) => {
    setPatients(prev => [...prev, p]);
    savePatient(p).catch(err => console.error("Cloud patient save error:", err));
  };
  
  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    const patient = safePatients.find(p => p.id === id);
    if (patient) {
      // Check if something actually changed
      const hasChanged = Object.keys(updates).some(key => patient[key as keyof Patient] !== updates[key as keyof Partial<Patient>]);
      if (hasChanged) {
        savePatient({ ...patient, ...updates }).catch(err => console.error("Cloud patient save error:", err));
      }
    }
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    apiDeletePatient(id).catch(err => console.error("Cloud patient delete error:", err));
  };

  const updatePatientStatus = (id: string, status: Patient["status"]) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    const patient = safePatients.find(p => p.id === id);
    if (patient && patient.status !== status) {
      savePatient({ ...patient, status }).catch(err => console.error("Cloud patient save error:", err));

      
      // Dispatch real-time Firestore notification
      if (status === "ward") {
        saveHISNotification({
          id: `notif-status-${Date.now()}`,
          message: `تم نقل المريض ${patient.nameAr} لجناح التنويم الداخلي.`, // simplify for now, check schema
          timestamp: new Date().toISOString(),
        }).catch(err => console.error("Cloud notification save error:", err));
      }
    }
  };

  const addPrescription = (p: Prescription) => {
    savePrescription(p).catch(err => console.error("Cloud prescription save error:", err));
  };
  
  const updatePrescriptionStatus = (id: string, status: Prescription["status"], extra?: Partial<Prescription>) => {
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
  };

  const addMasterData = (entry: Omit<MasterDataEntry, "id" | "date" | "time" | "useCount" | "status" | "isOfficial">) => {
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
  };

  const updateMasterDataStatus = (id: string, status: MasterDataEntry["status"], isOfficial: boolean = false) => {
    setMasterData(prev => prev.map(m => m.id === id ? { ...m, status, isOfficial } : m));
  };

  const deleteMasterData = (id: string) => {
    setMasterData(prev => prev.filter(m => m.id !== id));
  };

  const addInvoice = (i: Invoice) => {
    saveInvoice(i).catch(err => console.error("Cloud invoice save error:", err));
  };
  
  const updateInvoiceStatus = (id: string, status: Invoice["status"]) => {
    const invoice = safeInvoices.find(inv => inv.id === id);
    if (invoice && invoice.status !== status) {
        saveInvoice({ ...invoice, status }).catch(err => console.error("Cloud invoice save error:", err));
    }
  };

  return (
    <HISContext.Provider value={{
      patients: safePatients, addPatient, updatePatient, deletePatient, updatePatientStatus,
      prescriptions: safePrescriptions, addPrescription, updatePrescriptionStatus,
      masterData, addMasterData, updateMasterDataStatus, deleteMasterData,
      invoices: safeInvoices, addInvoice, updateInvoiceStatus,
      activePatient, setActivePatient,
      admissionRequests, setAdmissionRequests,
      bedMap, setBedMap,
      erQueue, setErQueue,
      systemUsers,
      dutyTasks,
      clinicalRecords,
      departments,
      cpoeOrders,
      setCpoeOrders,
      inventory,
      setInventory,
      addConsumableToPatient,
      patientJourneys: Array.isArray(patientJourneysRaw) ? patientJourneysRaw : [],
      setPatientJourneys,
      addJourneyStep,
      rosterWishes,
      setRosterWishes,
      language,
      currentUser
    }}>
      {children}
    </HISContext.Provider>
  );
}

export function useHIS() {
  const context = useContext(HISContext);
  if (context === undefined) {
    throw new Error('useHIS must be used within a HISProvider');
  }
  return context;
}
