import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../firebase";

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string; // e.g. "VIEW_PATIENT", "UPDATE_VITALS", "TRANSITION_STAGE"
  module: string; // e.g. "CLINICAL", "NURSING", "IT"
  detailsAr: string;
  detailsEn: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

const AUDIT_COLLECTION = "hospital_audit_trail";

/**
 * Logs a new audit entry
 */
export async function logAudit(entry: Omit<AuditEntry, "id" | "timestamp" | "ipAddress" | "userAgent">) {
  const newEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
    // These would ideally come from the server in a real app
    ipAddress: "127.0.0.1", 
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Node.js"
  };
  await addDoc(collection(db, AUDIT_COLLECTION), newEntry);
}

/**
 * Sync audit trail for admin view
 */
export function syncAuditTrail(onData: (entries: AuditEntry[]) => void) {
  const q = query(
    collection(db, AUDIT_COLLECTION),
    orderBy("timestamp", "desc"),
    limit(200)
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditEntry));
    onData(data);
  });
}
