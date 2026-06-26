import { doc, setDoc, collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Patient } from "../types";

export async function seedInitialPatients() {
  const q = query(collection(db, "hospital_his_patients"), limit(1));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) return; // Already seeded

  const patients: Patient[] = [
    {
      id: "p1",
      mrn: "MRN-001",
      nameAr: "أحمد محمد علي",
      nameEn: "Ahmed Mohamed Ali",
      gender: "male",
      dob: "1985-05-20",
      nationality: "Egyptian",
      nationalId: "28505200100123",
      phone: "01001234567",
      currentWorkflowStage: "registration",
      workflowId: "WF-INIT-001"
    },
    {
      id: "p2",
      mrn: "MRN-002",
      nameAr: "سارة محمود حسن",
      nameEn: "Sara Mahmoud Hassan",
      gender: "female",
      dob: "1992-11-10",
      nationality: "Egyptian",
      nationalId: "29211100100555",
      phone: "01122334455",
      currentWorkflowStage: "triage",
      workflowId: "WF-INIT-002"
    }
  ];

  for (const patient of patients) {
    await setDoc(doc(db, "hospital_his_patients", patient.id), patient);
    
    // Create initial workflows too
    await setDoc(doc(db, "hospital_workflow_instances", patient.workflowId!), {
      id: patient.workflowId,
      patientId: patient.id,
      patientMRN: patient.mrn,
      startTime: new Date().toISOString(),
      currentStage: patient.currentWorkflowStage,
      status: "active",
      history: [{
        stage: "registration",
        startTime: new Date().toISOString()
      }]
    });
  }
  
  console.log("🔥 Patient data seeded.");
}
