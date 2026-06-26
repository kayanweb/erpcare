import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  getDoc,
  serverTimestamp,
  arrayUnion,
  addDoc,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import { 
  Patient, 
  PatientVisitWorkflow, 
  WorkflowStage, 
  HospitalTask, 
  PatientActivity,
  TaskStatus 
} from "../types";
import { createNotification } from "./notificationService";
import { logAudit } from "./auditService";

const WORKFLOW_COLLECTION = "hospital_workflow_instances";
const PATIENT_COLLECTION = "hospital_his_patients";
const TASK_COLLECTION = "hospital_tasks";
const ACTIVITY_COLLECTION = "hospital_patient_activity";

/**
 * Logs a patient activity event
 */
export async function logPatientActivity(
  patientId: string, 
  workflowId: string, 
  type: string, 
  messageAr: string, 
  messageEn: string, 
  staffId: string, 
  staffName: string
) {
  const activity: Omit<PatientActivity, "id"> = {
    patientId,
    workflowId,
    type,
    messageAr,
    messageEn,
    timestamp: new Date().toISOString(),
    staffId,
    staffName
  };
  await addDoc(collection(db, ACTIVITY_COLLECTION), activity);
}

/**
 * Creates a new task in the system
 */
export async function createHospitalTask(task: Omit<HospitalTask, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const taskRef = doc(collection(db, TASK_COLLECTION));
  const newTask: HospitalTask = {
    ...task,
    id: taskRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await setDoc(taskRef, newTask);
  return taskRef.id;
}

/**
 * Updates a task status
 */
export async function updateTaskStatus(taskId: string, status: TaskStatus, staffId: string): Promise<void> {
  const taskRef = doc(db, TASK_COLLECTION, taskId);
  await updateDoc(taskRef, {
    status,
    updatedAt: new Date().toISOString(),
    completedAt: (status === "completed" || status === "cancelled" || status === "rejected") ? new Date().toISOString() : null,
    assignedToUserId: staffId // Auto-assign to the person who takes action
  });
}

/**
 * Starts a new clinical visit workflow for a patient
 */
export async function startPatientVisit(patient: Patient, staffId: string, staffName: string): Promise<string> {
  const workflowId = `WF-${Date.now()}`;
  const now = new Date().toISOString();

  const newWorkflow: PatientVisitWorkflow = {
    id: workflowId,
    patientId: patient.id,
    patientMRN: patient.mrn,
    startTime: now,
    currentStage: "registration",
    status: "active",
    history: [
      {
        stage: "registration",
        startTime: now,
        completedByStaffId: staffId
      }
    ]
  };

  await setDoc(doc(db, WORKFLOW_COLLECTION, workflowId), newWorkflow);
  
  // Update patient's current active workflow
  await updateDoc(doc(db, PATIENT_COLLECTION, patient.id), {
    currentWorkflowStage: "registration",
    workflowId: workflowId
  });

  // Log activity
  await logPatientActivity(
    patient.id, 
    workflowId, 
    "REGISTRATION", 
    "تم تسجيل المريض وبدء الزيارة", 
    "Patient registered and visit started", 
    staffId, 
    staffName
  );

  return workflowId;
}

/**
 * Transitions a patient to the next stage in the workflow
 */
export async function transitionStage(
  workflowId: string, 
  nextStage: WorkflowStage, 
  staffId: string,
  staffName: string,
  staffRole: string = "staff"
): Promise<void> {
  const workflowRef = doc(db, WORKFLOW_COLLECTION, workflowId);
  const workflowSnap = await getDoc(workflowRef);
  
  if (!workflowSnap.exists()) throw new Error("Workflow not found");
  
  const workflow = workflowSnap.data() as PatientVisitWorkflow;
  const oldStage = workflow.currentStage;
  const now = new Date().toISOString();

  // Close previous stage in history
  const updatedHistory = [...workflow.history];
  if (updatedHistory.length > 0) {
    updatedHistory[updatedHistory.length - 1].endTime = now;
  }

  // Add new stage
  updatedHistory.push({
    stage: nextStage,
    startTime: now,
    completedByStaffId: staffId
  });

  await updateDoc(workflowRef, {
    currentStage: nextStage,
    history: updatedHistory
  });

  // Also update patient record for quick lookup
  await updateDoc(doc(db, PATIENT_COLLECTION, workflow.patientId), {
    currentWorkflowStage: nextStage
  });

  // Log activity
  await logPatientActivity(
    workflow.patientId, 
    workflowId, 
    "TRANSITION", 
    `انتقال المريض إلى مرحلة: ${nextStage}`, 
    `Patient transitioned to stage: ${nextStage}`, 
    staffId, 
    staffName
  );

  // Log Audit
  await logAudit({
    userId: staffId,
    userName: staffName,
    userRole: staffRole,
    action: "TRANSITION_STAGE",
    module: "WORKFLOW",
    detailsAr: `تغيير حالة سير العمل للمريض من ${oldStage} إلى ${nextStage}`,
    detailsEn: `Changed patient workflow stage from ${oldStage} to ${nextStage}`,
    oldValue: oldStage,
    newValue: nextStage
  });

  // Automated transitions logic (trigger follow-up actions)
  handleAutomatedTriggers(nextStage, workflow, staffId, staffName);
}

/**
 * Internal logic for automated triggers based on workflow state
 */
async function handleAutomatedTriggers(stage: WorkflowStage, workflow: PatientVisitWorkflow, staffId: string, staffName: string) {
  switch (stage) {
    case "triage":
      // Create a task for the doctor
      await createHospitalTask({
        workflowId: workflow.id,
        patientId: workflow.patientId,
        patientMRN: workflow.patientMRN,
        assignedToRole: "doctor",
        titleAr: "استشارة طبيب",
        titleEn: "Doctor Consultation",
        status: "pending",
        priority: "routine",
        type: "clinical"
      });

      // Notify Nurses that a patient is in Triage
      await createNotification({
        userId: "all",
        role: "nurse",
        titleAr: "مريض جديد في الفرز",
        titleEn: "New Patient in Triage",
        messageAr: `المريض ${workflow.patientMRN} جاهز للفرز السريري.`,
        messageEn: `Patient ${workflow.patientMRN} is ready for clinical triage.`,
        type: "info"
      });
      break;
      
    case "diagnosis":
      // Example: Automatically trigger billing preparation when diagnosis is confirmed
      console.log("Automated Trigger: Preparing billing for", workflow.patientMRN);
      
      // Notify Doctor
      await createNotification({
        userId: "all",
        role: "doctor",
        titleAr: "جاهز للتشخيص",
        titleEn: "Ready for Diagnosis",
        messageAr: `المريض ${workflow.patientMRN} أكمل الفرز وجاهز للتشخيص.`,
        messageEn: `Patient ${workflow.patientMRN} completed triage and is ready for diagnosis.`,
        type: "success"
      });
      break;

    case "orders":
       // Orders stage usually involves multiple tasks (Lab, Rad, etc.)
       break;

    case "discharge":
      // Mark workflow as completed
      await updateDoc(doc(db, WORKFLOW_COLLECTION, workflow.id), {
        status: "completed",
        endTime: new Date().toISOString()
      });

      // Notify Reception/Billing
      await createNotification({
        userId: "all",
        role: "admin",
        titleAr: "خروج مريض",
        titleEn: "Patient Discharge",
        messageAr: `المريض ${workflow.patientMRN} جاهز لإجراءات الخروج.`,
        messageEn: `Patient ${workflow.patientMRN} is ready for discharge procedures.`,
        type: "info"
      });
      break;
  }
}

/**
 * Sync active patient workflows
 */
export function syncActiveWorkflows(onData: (workflows: PatientVisitWorkflow[]) => void) {
  const q = query(collection(db, WORKFLOW_COLLECTION), where("status", "==", "active"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PatientVisitWorkflow));
    onData(data);
  });
}

/**
 * Sync all patients
 */
export function syncPatients(onData: (patients: Patient[]) => void) {
  return onSnapshot(collection(db, PATIENT_COLLECTION), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
    onData(data);
  });
}

/**
 * Sync tasks for a specific role or user
 */
export function syncTasks(role: string, userId: string, onData: (tasks: HospitalTask[]) => void) {
  const q = query(
    collection(db, TASK_COLLECTION), 
    where("status", "in", ["pending", "in_progress"]),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HospitalTask));
    // Client-side filtering for simplicity in the prototype, but could be server-side too
    const filtered = allTasks.filter(t => t.assignedToRole === role || t.assignedToUserId === userId);
    onData(filtered);
  });
}

/**
 * Sync patient timeline
 */
export function syncPatientTimeline(workflowId: string, onData: (activities: PatientActivity[]) => void) {
  const q = query(
    collection(db, ACTIVITY_COLLECTION), 
    where("workflowId", "==", workflowId),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PatientActivity));
    onData(data);
  });
}
