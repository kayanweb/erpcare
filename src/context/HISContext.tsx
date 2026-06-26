import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useFirestoreSync } from "../hooks/useFirestoreSync";
import { 
  syncPatients, 
  savePatient as firestoreSavePatient, 
  deletePatient as firestoreDeletePatient, 
  syncPrescriptions, 
  savePrescription as firestoreSavePrescription, 
  syncInvoices, 
  saveInvoice as firestoreSaveInvoice,
  saveHISNotification
} from "../lib/firestoreService";

export type Patient = {
  id: string;
  mrn: string;
  nameEn: string;
  nameAr: string;
  age: number;
  gender: string;
  phone: string;
  status: "registered" | "triage" | "doctor" | "ward" | "discharged";
  insurance: string;
};

export type Prescription = {
  id: string;
  patientId: string;
  medication: string;
  dose: string;
  qty: number;
  status: "pending" | "dispensed";
  date: string;
};

export type Invoice = {
  id: string;
  patientId: string;
  amount: number;
  status: "unpaid" | "paid";
  date: string;
};

interface HISState {
  patients: Patient[];
  addPatient: (p: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  updatePatientStatus: (id: string, status: Patient["status"]) => void;

  prescriptions: Prescription[];
  addPrescription: (p: Prescription) => void;
  updatePrescriptionStatus: (id: string, status: Prescription["status"]) => void;

  invoices: Invoice[];
  addInvoice: (i: Invoice) => void;
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void;
}

const HISContext = createContext<HISState | undefined>(undefined);

export function HISProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useFirestoreSync<Patient>(syncPatients, []);
  const [prescriptions, setPrescriptions] = useFirestoreSync<Prescription>(syncPrescriptions, []);
  const [invoices, setInvoices] = useFirestoreSync<Invoice>(syncInvoices, []);
  
  // Seed initial mock data if empty (useful for fresh DB)
  const [hasSeeded, setHasSeeded] = useState(false);
  useEffect(() => {
    if (patients.length === 0 && !hasSeeded) {
      setHasSeeded(true);
      // Wait a moment for sync to settle, then add default data only if it is actually empty
      setTimeout(() => {
        if (patients.length === 0) {
          firestoreSavePatient({ id: "p1", mrn: "MRN-2026-0041", nameEn: "Samir Abdullah Hafez", nameAr: "سمير عبدالله حافظ", age: 45, gender: "male", phone: "0100000000", status: "doctor", insurance: "Cash" }).catch(e => console.warn(e.message));
          firestoreSavePatient({ id: "p2", mrn: "MRN-2026-0042", nameEn: "Fatma Ahmed Ali", nameAr: "فاطمة أحمد علي", age: 30, gender: "female", phone: "0111111111", status: "triage", insurance: "Bupa" }).catch(e => console.warn(e.message));
        }
      }, 5000);
    }
  }, [patients.length, hasSeeded]);

  const addPatient = (p: Patient) => {
    firestoreSavePatient(p).catch(err => console.error("Cloud patient save error:", err));
  };
  
  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      firestoreSavePatient({ ...patient, ...updates }).catch(err => console.error("Cloud patient save error:", err));
    }
  };

  const deletePatient = (id: string) => {
    firestoreDeletePatient(id).catch(err => console.error("Cloud patient delete error:", err));
  };

  const updatePatientStatus = (id: string, status: Patient["status"]) => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      firestoreSavePatient({ ...patient, status }).catch(err => console.error("Cloud patient save error:", err));
      
      // Dispatch real-time Firestore notification
      if (status === "ward") {
        saveHISNotification({
          id: `notif-status-${Date.now()}`,
          titleAr: "طلب نقل لجناح التنويم",
          titleEn: "Ward Admission Requested",
          messageAr: `تم نقل المريض ${patient.nameAr} لجناح التنويم الداخلي. بانتظار استلام سرير الكاردكس.`,
          messageEn: `Patient ${patient.nameEn} has been transferred to Inpatient Ward. Pending Bed assignment.`,
          type: "info",
          timestamp: new Date().toISOString()
        }).catch(err => console.error("Cloud notification save error:", err));
      } else if (status === "discharged") {
        saveHISNotification({
          id: `notif-status-${Date.now()}`,
          titleAr: "خروج مريض من المستشفى",
          titleEn: "Patient Discharged",
          messageAr: `المريض: ${patient.nameAr} - تم إكمال إجراءات الخروج الطبية بنجاح.`,
          messageEn: `Patient: ${patient.nameEn} - Medical discharge completed successfully.`,
          type: "success",
          timestamp: new Date().toISOString()
        }).catch(err => console.error("Cloud notification save error:", err));
      }
    }
  };

  const addPrescription = (p: Prescription) => {
    firestoreSavePrescription(p).catch(err => console.error("Cloud prescription save error:", err));
  };
  
  const updatePrescriptionStatus = (id: string, status: Prescription["status"]) => {
    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
      firestoreSavePrescription({ ...prescription, status }).catch(err => console.error("Cloud prescription save error:", err));
    }
  };

  const addInvoice = (i: Invoice) => {
    firestoreSaveInvoice(i).catch(err => console.error("Cloud invoice save error:", err));
  };
  
  const updateInvoiceStatus = (id: string, status: Invoice["status"]) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
        firestoreSaveInvoice({ ...invoice, status }).catch(err => console.error("Cloud invoice save error:", err));
    }
  };

  return (
    <HISContext.Provider value={{
      patients, addPatient, updatePatient, deletePatient, updatePatientStatus,
      prescriptions, addPrescription, updatePrescriptionStatus,
      invoices, addInvoice, updateInvoiceStatus
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
