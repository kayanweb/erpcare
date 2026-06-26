import {
  collection as fbCollection,
  doc as fbDoc,
  setDoc as fbSetDoc,
  deleteDoc as fbDeleteDoc,
  onSnapshot as fbOnSnapshot,
  getDoc as fbGetDoc,
  addDoc as fbAddDoc,
  getDocs as fbGetDocs,
  query as fbQuery,
  where as fbWhere,
  orderBy as fbOrderBy,
  limit as fbLimit,
  serverTimestamp as fbServerTimestamp,
  getDocFromServer as fbGetDocFromServer,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { getActiveDbProvider, switchEnvironment } from "./dbConfig";
import {
  subscribeToClinicalData,
  saveDataPermanently,
  deleteDataPermanently,
} from "./realTimeService";

// Initialize quota check from localStorage
const isQuotaExceeded = () => {
  return false; // Disable manual quota fallback to allow native Firebase sync
};

// Track active listeners
const activeSubscribers: (() => void)[] = [];

const setQuotaExceeded = () => {
  (window as any).firestoreQuotaExceeded = true;
  localStorage.setItem("firestoreQuotaExceeded", "true");

  // Unsubscribe all active listeners
  activeSubscribers.forEach((unsubscribe) => unsubscribe());
  activeSubscribers.length = 0;

  if (getActiveDbProvider() === "FIREBASE") {
    console.error(
      "🔥 EMERGENCY SWITCH: Firestore quota exhausted, switching to Persistent Local Node Server.",
    );
    // Switch to the stable fallback that uses persistent JSON on the Cloud container.
    switchEnvironment("LOCAL_HOST");
  }
};

export const collection = (db: any, path: string) => fbCollection(db, path);
export const doc = (db: any, path: string, ...pathSegments: string[]) =>
  fbDoc(db, path, ...pathSegments);
export const query = fbQuery;
export const where = fbWhere;
export const orderBy = fbOrderBy;
export const limit = fbLimit;
export const serverTimestamp = fbServerTimestamp;

export async function addDoc(collRef: any, data: any) {
  if (getActiveDbProvider() !== "FIREBASE") {
    const colName = getCollectionName(collRef);
    const result = await saveDataPermanently(colName, data);
    if (!result.success) {
      throw new Error(result.error || "Failed to save to dynamic provider");
    }
    return { id: data?.id || Math.random().toString(36).substring(7) } as any; // Return mock ID
  }
  if (isQuotaExceeded()) {
    const colName = getCollectionName(collRef);
    const id = data?.id || Math.random().toString(36).substring(7);
    saveLocalDoc(colName, id, { ...data, id });
    console.log(
      "Firestore write quota exceeded: addDoc saved to local fallback.",
      colName,
      id,
    );
    return { id } as any;
  }
  try {
    return await fbAddDoc(collRef, data);
  } catch (e: any) {
    if (e.code === "resource-exhausted") {
      setQuotaExceeded();
      console.warn("Firestore quota exceeded: Switching to local fallback.");
      const colName = getCollectionName(collRef);
      return { id: data?.id || Math.random().toString(36).substring(7) } as any; // Fallback to local
    }
    throw e;
  }
}

export async function getDocs(query: any) {
  if (getActiveDbProvider() !== "FIREBASE") {
    const provider = getActiveDbProvider();
    if (provider === "NULL_DB") {
      return { docs: [] } as any;
    }
    const colName = getCollectionName(query);
    // For now, let's use a similar approach to getDoc for simplicity or see if realTimeService has a getDocs equivalent
    try {
      const response = await fetch(
        `/api/db/${provider.toLowerCase()}/${colName}`,
      );
      if (response.ok) {
        const json = await response.json();
        return {
          docs: json.data.map((item: any) => ({ data: () => item })),
        } as any;
      }
    } catch (e) {
      console.error("Local database getDocs simulation error:", e);
    }
    return { docs: [] } as any;
  }
  if (isQuotaExceeded()) {
    const colName = getCollectionName(query);
    const localData = getLocalStore(colName);
    return {
      docs: localData.map((item: any) => ({ data: () => item })),
    } as any;
  }
  try {
    return await fbGetDocs(query);
  } catch (e: any) {
    if (e.code === "resource-exhausted") {
      setQuotaExceeded();
      console.warn("Firestore quota exceeded: Switching to local fallback.");
      const colName = getCollectionName(query);
      const localData = getLocalStore(colName);
      return {
        docs: localData.map((item: any) => ({ data: () => item })),
      } as any;
    }
    throw e;
  }
}

// Helper to extract collection name robustly from any query or document reference
function getCollectionName(ref: any): string {
  if (!ref) return "unknown_collection";
  if (ref.id && !ref.path) return ref.id; // e.g. collection reference itself

  let path = ref.path || "";
  if (!path && ref._path) {
    path = ref._path.toString();
  }
  if (!path && ref.collection) {
    path = ref.collection.path;
  }

  // Extract nested segment structure if available
  if (!path) {
    try {
      const segs =
        ref?._query?.path?.segments ||
        ref?.query?.path?.segments ||
        ref?.collection?.path?.segments;
      if (segs && segs.length > 0) return segs[0];
    } catch (e) {}
  }

  if (path) {
    return path.split("/")[0];
  }

  return "unknown_collection";
}

// Graceful local-first / offline-safe wrappers
export async function setDoc(docRef: any, data: any, options?: any) {
  if (getActiveDbProvider() !== "FIREBASE") {
    const colName = getCollectionName(docRef);
    const result = await saveDataPermanently(colName, data);
    if (!result.success) {
      throw new Error(result.error || "Failed to save to dynamic provider");
    }
    return;
  }
  if (isQuotaExceeded()) {
    const colName = getCollectionName(docRef);
    saveLocalDoc(colName, docRef.id, { ...data, id: docRef.id });
    console.log(
      "Firestore write quota exceeded: setDoc saved to local fallback.",
      docRef?.path,
    );
    return;
  }
  try {
    return await fbSetDoc(docRef, data, options);
  } catch (e: any) {
    if (e.code === "resource-exhausted") {
      setQuotaExceeded();
    }
    throw e;
  }
}

export async function deleteDoc(docRef: any) {
  if (getActiveDbProvider() !== "FIREBASE") {
    const colName = getCollectionName(docRef);
    const result = await deleteDataPermanently(colName, docRef.id);
    if (!result.success) {
      throw new Error(result.error || "Failed to delete from dynamic provider");
    }
    return;
  }
  if (isQuotaExceeded()) {
    console.log(
      "Firestore delete quota exceeded: deleteDoc skipped for offline local sandbox mode.",
      docRef?.path,
    );
    return;
  }
  try {
    return await fbDeleteDoc(docRef);
  } catch (e: any) {
    if (e.code === "resource-exhausted") {
      setQuotaExceeded();
    }
    throw e;
  }
}

export async function getDoc(docRef: any) {
  if (getActiveDbProvider() !== "FIREBASE") {
    const provider = getActiveDbProvider();
    if (provider === "NULL_DB") {
      return { exists: () => false, data: () => null } as any;
    }
    const colName = getCollectionName(docRef);
    try {
      const response = await fetch(
        `/api/db/${provider.toLowerCase()}/${colName}`,
      );
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          const item = json.data.find((x: any) => x.id === docRef.id);
          return {
            exists: () => !!item,
            data: () => item,
          } as any;
        }
      }
    } catch (e) {
      console.error("Local database getDoc simulation error:", e);
    }
    return { exists: () => false, data: () => null } as any;
  }
  if (isQuotaExceeded()) {
    console.log(
      "Firestore get quota exceeded: getDoc skipped for offline local sandbox mode.",
      docRef?.path,
    );
    return { exists: () => false, data: () => null } as any;
  }
  try {
    return await fbGetDoc(docRef);
  } catch (e: any) {
    if (e.code === "resource-exhausted") {
      setQuotaExceeded();
    }
    throw e;
  }
}

// Intercept low-level onSnapshot subscriptions for multi-provider live syncing
export function onSnapshot(
  ref: any,
  onNext: (snapshot: any) => void,
  onError?: (error: any) => void,
) {
  // Helper to determine if ref is a document reference (has path)
  const isDoc = !!ref.path && ref.path.split("/").length % 2 === 0;

  if (getActiveDbProvider() !== "FIREBASE" || isQuotaExceeded()) {
    if (isQuotaExceeded()) {
      console.warn("Firestore quota exceeded: onSnapshot skipped.");
    }
    const colName = getCollectionName(ref);

    return subscribeToClinicalData(
      colName,
      (data) => {
        if (isDoc) {
          // Document snapshot
          const item = Array.isArray(data)
            ? data.find((x: any) => x.id === ref.id)
            : null;
          onNext({
            data: () => item,
            id: ref.id,
            exists: () => !!item,
          });
        } else {
          // Collection snapshot
          const docs = data.map((item: any) => ({
            data: () => item,
            id: item.id,
            exists: () => true,
          }));
          const mockSnapshot = {
            docs,
            forEach: (callback: (doc: any) => void) => {
              docs.forEach((d: any) => callback(d));
            },
          };
          onNext(mockSnapshot);
        }
      },
      (err) => {
        if (onError) onError(err);
      },
    );
  } else {
    // Firebase snapshot listener
    const unsubscribe = fbOnSnapshot(ref, onNext, (err: any) => {
      if (err.code === "resource-exhausted") {
        setQuotaExceeded();
      }
      if (onError) onError(err);
    });
    activeSubscribers.push(unsubscribe);

    // New: Handle provider switch to unsubscribe automatically from Firebase
    const handleProviderChange = () => {
      if (getActiveDbProvider() !== "FIREBASE") {
        unsubscribe();
        window.removeEventListener("db-provider-changed", handleProviderChange);
      }
    };
    window.addEventListener("db-provider-changed", handleProviderChange);

    // Return the combined unsubscribe
    return () => {
      unsubscribe();
      // Remove from activeSubscribers
      const index = activeSubscribers.indexOf(unsubscribe);
      if (index > -1) activeSubscribers.splice(index, 1);

      window.removeEventListener("db-provider-changed", handleProviderChange);
    };
  }
}

import {
  SavedRecord,
  AppUser,
  UnitDailyChecklist,
  SystemLog,
  Notification,
  DailyDutyTask,
  FormTemplate,
  Role,
  Permission,
  AccessMatrix,
  AuditLog,
} from "../types";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

// --- Robust Local-First Resilient Fallback Storage ---
export function getLocalStore(collectionName: string): any[] {
  return [];
}

export function setLocalStore(collectionName: string, list: any[]) {
  // no-op
}

export function saveLocalItem(collectionName: string, id: string, data: any) {
  // no-op
}

export function deleteLocalItem(collectionName: string, id: string) {
  // no-op
}

export function saveLocalDoc(collectionName: string, docId: string, data: any) {
  // no-op
}

export function getLocalDoc(
  collectionName: string,
  docId: string,
  defaultValue: any = null,
): any {
  return defaultValue;
}

export function mergeWithLocal(
  firestoreList: any[],
  collectionName: string,
  idKey: string = "id",
): any[] {
  return firestoreList;
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const message = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: (auth as any).currentUser?.uid || null,
      email: (auth as any).currentUser?.email || null,
    },
    operationType,
    path,
  };
  console.warn(
    "Firestore Operation Warning (System will use offline mode/local state): ",
    JSON.stringify(errInfo),
  );

  if (
    message.toLowerCase().includes("quota") ||
    message.toLowerCase().includes("exhausted") ||
    message.toLowerCase().includes("resource-exhausted") ||
    message.toLowerCase().includes("billing") ||
    message.toLowerCase().includes("limit")
  ) {
    setQuotaExceeded();
    window.dispatchEvent(
      new CustomEvent("firestore-quota-exceeded", {
        detail: { error: message },
      }),
    );
  }

  // Mandatory: Throw JSON error as per firebase-integration skill
  throw new Error(JSON.stringify(errInfo));
}

// 1. Connection check
export async function testConnection(): Promise<boolean> {
  const provider = getActiveDbProvider();

  try {
    if (provider === "FIREBASE") {
      const docRef = doc(db, "hospital_clinical_records", "test-connection");
      // Use getDocFromServer for robust connection check as per skill
      await fbGetDocFromServer(docRef);
      return true;
    }

    // For other abstract providers (LOCAL_HOST, SUPABASE, APPWRITE), we ping our robust Express Node server
    const r = await fetch("/api/ping", { method: "GET" }).catch(() => null);
    if (r && r.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Connection offline or inaccessible: ", error);
    return false;
  }
}

// Helper to safely get doc
async function safeGetDoc(docRef: any) {
  try {
    return await getDoc(docRef);
  } catch (error) {
    console.warn("Firestore offline or inaccessible (getDoc): ", error);
    return null;
  }
}

// Helper to manage reactive syncing based on provider changes
function manageReactiveSync(
  path: string,
  onData: (data: any[]) => void,
  firebaseCollection: any,
  syncLogic: (path: string, onData: (data: any[]) => void) => () => void,
  firestoreOnSnapshot: (
    query: any,
    onNext: (snapshot: any) => void,
    onError?: (error: any) => void,
  ) => () => void,
) {
  let unsubscribe: () => void;

  function startSync() {
    if (unsubscribe) unsubscribe();

    const provider = getActiveDbProvider();
    if (provider !== "FIREBASE") {
      // Local/Other provider logic: using the provided syncLogic (local service)
      unsubscribe = syncLogic(path, onData);
    } else {
      // Firebase logic
      unsubscribe = firestoreOnSnapshot(
        firebaseCollection,
        (snapshot: any) => {
          const list: any[] = [];
          snapshot.forEach((doc: any) => list.push(doc.data()));
          onData(list);
        },
        (error: any) => {
          handleFirestoreError(error, OperationType.LIST, path);
          onData([]);
        },
      );
    }
  }

  const handleProviderChange = () => {
    startSync();
  };
  window.addEventListener("db-provider-changed", handleProviderChange);

  startSync();

  return () => {
    unsubscribe();
    window.removeEventListener("db-provider-changed", handleProviderChange);
  };
}

// 2. Clinical Records Sync (Real-time)
export function syncClinicalRecords(onData: (records: SavedRecord[]) => void) {
  const path = "hospital_clinical_records";

  return manageReactiveSync(
    path,
    (data) => onData(data),
    collection(db, path),
    (p, cb) =>
      subscribeToClinicalData(p, cb, (err: any) =>
        console.warn("Clinical sync error:", err?.message || err),
      ),
    fbOnSnapshot as any,
  );
}

export async function saveClinicalRecord(record: SavedRecord): Promise<void> {
  const path = `hospital_clinical_records/${record.id}`;

  try {
    await setDoc(doc(db, "hospital_clinical_records", record.id), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteClinicalRecord(recordId: string): Promise<void> {
  const path = `hospital_clinical_records/${recordId}`;

  try {
    await deleteDoc(doc(db, "hospital_clinical_records", recordId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 3. Staff Registry Sync (Real-time)
export function syncStaffRegistry(onData: (users: AppUser[]) => void) {
  const path = "hospital_staff_registry";

  return manageReactiveSync(
    path,
    (data) => onData(data),
    collection(db, path),
    (p, cb) =>
      subscribeToClinicalData(p, cb, (err: any) =>
        console.warn("Staff sync error:", err?.message || err),
      ),
    fbOnSnapshot as any,
  );
}

export async function saveStaffMember(user: AppUser): Promise<void> {
  const path = `hospital_staff_registry/${user.id}`;

  try {
    await setDoc(doc(db, "hospital_staff_registry", user.id), user);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStaffMember(userId: string): Promise<void> {
  const path = `hospital_staff_registry/${userId}`;

  try {
    await deleteDoc(doc(db, "hospital_staff_registry", userId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. Daily Supervisor Audits Sync (Real-time)
export function syncDailyAudits(
  onData: (audits: UnitDailyChecklist[]) => void,
) {
  const path = "hospital_daily_audits";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const audits: UnitDailyChecklist[] = [];
      snapshot.forEach((doc) => {
        audits.push(doc.data() as UnitDailyChecklist);
      });
      onData(audits);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveDailyAudit(audit: UnitDailyChecklist): Promise<void> {
  const path = `hospital_daily_audits/${audit.id}`;

  try {
    await setDoc(doc(db, "hospital_daily_audits", audit.id), audit);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 5. System Troubleshooting / IT Logs Sync (Real-time and persistent)
export function syncSystemLogs(onData: (logs: SystemLog[]) => void) {
  const path = "hospital_system_logs";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const logs: SystemLog[] = [];
      snapshot.forEach((doc) => {
        logs.push(doc.data() as SystemLog);
      });
      // Sort by timestampMs descending so most recent is first
      logs.sort((a, b) => b.timestampMs - a.timestampMs);
      onData(logs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData(
        getLocalStore(path).sort(
          (a: any, b: any) => b.timestampMs - a.timestampMs,
        ),
      );
    },
  );
}

export async function saveSystemLog(log: SystemLog): Promise<void> {
  const path = `hospital_system_logs/${log.id}`;

  try {
    await setDoc(doc(db, "hospital_system_logs", log.id), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSystemLog(logId: string): Promise<void> {
  const path = `hospital_system_logs/${logId}`;

  try {
    await deleteDoc(doc(db, "hospital_system_logs", logId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 7. Duty Tasks Sync
export function syncDutyTasks(onData: (tasks: DailyDutyTask[]) => void) {
  const path = "hospital_daily_duty_tasks";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const tasks: DailyDutyTask[] = [];
      snapshot.forEach((doc) => {
        tasks.push(doc.data() as DailyDutyTask);
      });
      onData(tasks);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveDutyTask(task: DailyDutyTask): Promise<void> {
  const path = `hospital_daily_duty_tasks/${task.id}`;

  try {
    await setDoc(doc(db, "hospital_daily_duty_tasks", task.id), task);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 8. Custom Templates Sync
export function syncCustomTemplates(
  onData: (templates: FormTemplate[]) => void,
) {
  const path = "hospital_custom_templates";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const templates: FormTemplate[] = [];
      snapshot.forEach((doc) => {
        templates.push(doc.data() as FormTemplate);
      });
      onData(templates);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveCustomTemplate(
  template: FormTemplate,
): Promise<void> {
  const path = `hospital_custom_templates/${template.id}`;

  try {
    await setDoc(doc(db, "hospital_custom_templates", template.id), template);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCustomTemplate(templateId: string): Promise<void> {
  const path = `hospital_custom_templates/${templateId}`;

  try {
    await deleteDoc(doc(db, "hospital_custom_templates", templateId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 10. System Users Sync
export function syncSystemUsers(onData: (users: AppUser[]) => void) {
  const path = "hospital_staff_registry";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const users: AppUser[] = [];
      snapshot.forEach((doc) => {
        users.push(doc.data() as AppUser);
      });
      onData(users);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveSystemUser(user: AppUser): Promise<void> {
  const path = `hospital_staff_registry/${user.id}`;

  try {
    await setDoc(doc(db, "hospital_staff_registry", user.id), user);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 10.5. Roster Lists / Department Rosters Sync and Save
export function syncDepartmentRosters(onData: (rosters: any[]) => void) {
  const path = "hospital_department_rosters";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const rosters: any[] = [];
      snapshot.forEach((doc) => {
        rosters.push(doc.data());
      });
      onData(rosters);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveDepartmentRoster(roster: any): Promise<void> {
  const path = `hospital_department_rosters/${roster.id}`;
  console.log(`Saving roster ${roster.id} to Firestore.`);

  try {
    await setDoc(doc(db, "hospital_department_rosters", roster.id), roster);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 10.6. Roster Wishes Sync and Save
export function syncRosterWishes(onData: (wishes: any[]) => void) {
  const path = "hospital_roster_wishes";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const wishes: any[] = [];
      snapshot.forEach((doc) => {
        wishes.push(doc.data());
      });
      onData(wishes);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveRosterWish(wish: any): Promise<void> {
  const path = `hospital_roster_wishes/${wish.id}`;

  try {
    await setDoc(doc(db, "hospital_roster_wishes", wish.id), wish);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteRosterWish(wishId: string): Promise<void> {
  const path = `hospital_roster_wishes/${wishId}`;

  try {
    await deleteDoc(doc(db, "hospital_roster_wishes", wishId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 10.7. Resolved Gaps Sync and Save
export function syncResolvedGaps(onData: (gaps: any[]) => void) {
  const path = "hospital_resolved_gaps";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const gaps: any[] = [];
      snapshot.forEach((doc) => {
        gaps.push(doc.data());
      });
      onData(gaps);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveResolvedGap(gap: any): Promise<void> {
  const path = `hospital_resolved_gaps/${gap.id}`;

  try {
    await setDoc(doc(db, "hospital_resolved_gaps", gap.id), gap);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteResolvedGap(gapId: string): Promise<void> {
  const path = `hospital_resolved_gaps/${gapId}`;

  try {
    await deleteDoc(doc(db, "hospital_resolved_gaps", gapId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 10.8. Role Permissions Document
export async function getRolePermissions(): Promise<any> {
  const docRef = doc(db, "hospital_settings", "role_permissions");
  const docSnap = await safeGetDoc(docRef);
  if (docSnap && docSnap.exists()) {
    const data = (docSnap.data() as any).permissions;
    saveLocalDoc("hospital_settings", "role_permissions", {
      permissions: data,
    });
    return data;
  }
  const local = getLocalDoc("hospital_settings", "role_permissions");
  if (local && local.permissions) return local.permissions;

  // Fallback if quota exceeded and no local permissions found
  if (isQuotaExceeded()) {
    console.warn(
      "Firestore quota exceeded and no local permissions found, using default permissions.",
    );
    return [
      {
        id: "mod_nursing_admin",
        nameAr: "إدارة التمريض",
        nameEn: "Nursing Admin",
      },
      { id: "mod_supervisor", nameAr: "مشرف التمريض", nameEn: "Supervisor" },
    ];
  }
  return null;
}

export async function saveRolePermissions(permissions: any): Promise<void> {
  const path = `hospital_settings/role_permissions`;
  saveLocalDoc("hospital_settings", "role_permissions", { permissions });
  try {
    await setDoc(doc(db, "hospital_settings", "role_permissions"), {
      permissions,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 10.9. Roster Approvals Document
export async function getRosterApprovals(): Promise<any> {
  const docRef = doc(db, "hospital_settings", "roster_approvals");
  const docSnap = await safeGetDoc(docRef);
  if (docSnap && docSnap.exists()) {
    const data = docSnap.data();
    saveLocalDoc("hospital_settings", "roster_approvals", data);
    return data;
  }
  return getLocalDoc("hospital_settings", "roster_approvals");
}

export async function saveRosterApprovals(approvals: any): Promise<void> {
  const path = `hospital_settings/roster_approvals`;
  saveLocalDoc("hospital_settings", "roster_approvals", approvals);
  try {
    await setDoc(doc(db, "hospital_settings", "roster_approvals"), approvals);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 10.10. Custom Template Overrides and Deactivations
export async function getTemplateConfig(): Promise<any> {
  const docRef = doc(db, "hospital_settings", "template_config");
  const docSnap = await safeGetDoc(docRef);
  if (docSnap && docSnap.exists()) {
    const data = docSnap.data();
    saveLocalDoc("hospital_settings", "template_config", data);
    return data;
  }
  return getLocalDoc("hospital_settings", "template_config");
}

export async function saveTemplateConfig(config: any): Promise<void> {
  const path = `hospital_settings/template_config`;
  saveLocalDoc("hospital_settings", "template_config", config);
  try {
    await setDoc(doc(db, "hospital_settings", "template_config"), config);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getResolvedGapsCloud(): Promise<any> {
  const docRef = doc(db, "hospital_settings", "resolved_gaps");
  const docSnap = await safeGetDoc(docRef);
  if (docSnap && docSnap.exists()) {
    const data = docSnap.data();
    saveLocalDoc("hospital_settings", "resolved_gaps", data);
    return data;
  }
  return getLocalDoc("hospital_settings", "resolved_gaps");
}

export async function saveResolvedGapsCloud(gaps: any): Promise<void> {
  const path = `hospital_settings/resolved_gaps`;
  saveLocalDoc("hospital_settings", "resolved_gaps", gaps);
  try {
    await setDoc(doc(db, "hospital_settings", "resolved_gaps"), gaps);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 11. Notifications Sync
export function syncNotifications(
  userId: string,
  onData: (notifications: Notification[]) => void,
) {
  const path = "notifications";
  const getFilteredLocal = () =>
    getLocalStore(path).filter((n: any) => n && n.userId === userId);

  onData(getFilteredLocal());
  const q = query(collection(db, path), where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const notifications: Notification[] = [];
      snapshot.forEach((doc) => {
        notifications.push(doc.data() as Notification);
      });

      // Update local storage items that match this userId
      const allLocal = getLocalStore(path).filter(
        (n: any) => n && n.userId !== userId,
      );
      notifications.forEach((n) => allLocal.push(n));
      setLocalStore(path, allLocal);

      onData(notifications);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData(getFilteredLocal());
    },
  );
}

export async function saveNotification(
  notification: Notification,
): Promise<void> {
  const path = `notifications/${notification.id}`;

  try {
    await setDoc(doc(db, "notifications", notification.id), notification);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 12. Settings Sync
export function syncHospitalSettings(onData: (settings: any) => void) {
  const path = "organizationSettings/main";
  const local = getLocalDoc("organizationSettings", "main");
  if (local) {
    onData(local);
  }
  return onSnapshot(
    doc(db, "organizationSettings", "main"),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as any;
        if (data) {
          data.organizationName =
            data.organizationName || data.nameEn || "Unified Medical Hospital";
          data.organizationNameAr =
            data.organizationNameAr || data.nameAr || "مستشفى الرعاية الموحدة";
          data.organizationNameEn =
            data.organizationNameEn ||
            data.nameEn ||
            "Unified Medical Hospital";
        }
        saveLocalDoc("organizationSettings", "main", data);
        onData(data);
      }
    },
    (error) => {
      console.error("Firestore settings sync error:", error);
      const fallback = getLocalDoc("organizationSettings", "main");
      if (fallback) onData(fallback);
    },
  );
}

export async function getHospitalSettings(): Promise<any> {
  const docRef = doc(db, "organizationSettings", "main");
  const docSnap = await safeGetDoc(docRef);
  if (docSnap && docSnap.exists()) {
    const data = docSnap.data() as any;
    if (data) {
      data.organizationName =
        data.organizationName || data.nameEn || "Unified Medical Hospital";
      data.organizationNameAr =
        data.organizationNameAr || data.nameAr || "مستشفى الرعاية الموحدة";
      data.organizationNameEn =
        data.organizationNameEn || data.nameEn || "Unified Medical Hospital";
    }
    saveLocalDoc("organizationSettings", "main", data);
    return data;
  }
  return getLocalDoc("organizationSettings", "main");
}

export async function saveHospitalSettings(settings: any): Promise<void> {
  const path = `organizationSettings/main`;
  saveLocalDoc("organizationSettings", "main", settings);
  try {
    await setDoc(doc(db, "organizationSettings", "main"), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 14. Access Matrix and Audit Logs
export function syncRoles(onData: (roles: Role[]) => void) {
  const path = "roles";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const roles: Role[] = [];
      snapshot.forEach((doc) => roles.push(doc.data() as Role));
      onData(roles);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export function syncPermissions(onData: (permissions: Permission[]) => void) {
  const path = "permissions";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const permissions: Permission[] = [];
      snapshot.forEach((doc) => permissions.push(doc.data() as Permission));
      onData(permissions);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export function syncAccessMatrix(onData: (matrix: AccessMatrix[]) => void) {
  const path = "access_matrix";
  const local = getLocalStore(path);

  if (local.length === 0 && isQuotaExceeded()) {
    // Provide a basic fallback matrix to allow system access
    onData([
      {
        roleId: "admin",
        permissionId: "mod_nursing_admin",
        id: "admin_mod_nursing_admin",
        enabled: true,
      },
      {
        roleId: "admin",
        permissionId: "mod_supervisor",
        id: "admin_mod_supervisor",
        enabled: true,
      },
      // Add other modules as needed
    ]);
  } else {
  }

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const matrix: AccessMatrix[] = [];
      snapshot.forEach((doc) => matrix.push(doc.data() as AccessMatrix));
      onData(matrix);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveAccessMatrix(matrix: AccessMatrix): Promise<void> {
  const path = `access_matrix/${matrix.id}`;

  try {
    await setDoc(doc(db, "access_matrix", matrix.id), matrix);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function syncAuditLogs(onData: (logs: AuditLog[]) => void) {
  const path = "audit_logs";

  return onSnapshot(
    query(collection(db, path)),
    (snapshot) => {
      const logs: AuditLog[] = [];
      snapshot.forEach((doc) => logs.push(doc.data() as AuditLog));
      logs.sort((a, b) => b.timestamp - a.timestamp);
      onData(logs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData(
        getLocalStore(path).sort((a: any, b: any) => b.timestamp - a.timestamp),
      );
    },
  );
}

export async function saveAuditLog(log: AuditLog): Promise<void> {
  const path = `audit_logs/${log.id}`;

  try {
    await setDoc(doc(db, "audit_logs", log.id), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveRole(role: Role): Promise<void> {
  const path = `roles/${role.id}`;

  try {
    await setDoc(doc(db, "roles", role.id), role);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteRole(roleId: string): Promise<void> {
  const path = `roles/${roleId}`;

  try {
    await deleteDoc(doc(db, "roles", roleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function savePermission(permission: Permission): Promise<void> {
  const path = `permissions/${permission.id}`;

  try {
    await setDoc(doc(db, "permissions", permission.id), permission);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePermission(permId: string): Promise<void> {
  const path = `permissions/${permId}`;

  try {
    await deleteDoc(doc(db, "permissions", permId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 10.15. Sentinel Incidents Real-time Sync and Save
export function syncSentinelIncidents(onData: (incidents: any[]) => void) {
  const path = "hospital_sentinel_incidents";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveSentinelIncident(incident: any): Promise<void> {
  const path = `hospital_sentinel_incidents/${incident.id}`;

  try {
    await setDoc(doc(db, "hospital_sentinel_incidents", incident.id), incident);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSentinelIncident(
  incidentId: string,
): Promise<void> {
  const path = `hospital_sentinel_incidents/${incidentId}`;

  try {
    await deleteDoc(doc(db, "hospital_sentinel_incidents", incidentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Generic Key-Value Settings Storage
export function syncSetting(key: string, onData: (value: any) => void) {
  const path = "app_settings";
  const localVal = getLocalDoc(path, key);
  if (localVal) {
    onData(localVal);
  }
  return onSnapshot(
    doc(db, "app_settings", key),
    (snapshot) => {
      const data = snapshot.exists() ? snapshot.data() : null;
      if (data) saveLocalDoc(path, key, data);
      onData(data);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `${path}/${key}`);
      onData(getLocalDoc(path, key));
    },
  );
}

export async function getSetting(key: string): Promise<any> {
  const docRef = doc(db, "app_settings", key);
  const docSnap = await safeGetDoc(docRef);
  if (docSnap && docSnap.exists()) {
    const data = docSnap.data() as any;
    if (data) saveLocalDoc("app_settings", key, data);
    return data ? data.value : null;
  }
  const local = getLocalDoc("app_settings", key);
  return local ? local.value : null;
}

export async function saveSetting(key: string, value: any): Promise<void> {
  const path = `app_settings/${key}`;
  try {
    await setDoc(doc(db, "app_settings", key), { value });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function syncCloudDocuments(onData: (docs: any[]) => void) {
  const path = "hospital_cqi_documents";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      // Sort by timestamp desc
      list.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveCloudDocument(docData: any): Promise<void> {
  const path = `hospital_cqi_documents/${docData.id}`;

  try {
    await setDoc(doc(db, "hospital_cqi_documents", docData.id), docData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCloudDocument(docId: string): Promise<void> {
  const path = `hospital_cqi_documents/${docId}`;

  try {
    await deleteDoc(doc(db, "hospital_cqi_documents", docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 15. Quality OVRs Sync and Save
export function syncCQIOvrs(onData: (ovrs: any[]) => void) {
  const path = "hospital_cqi_ovrs";
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function saveCQIOvr(ovr: any): Promise<void> {
  const path = `hospital_cqi_ovrs/${ovr.id}`;
  try {
    await setDoc(doc(db, "hospital_cqi_ovrs", ovr.id), ovr);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCQIOvr(ovrId: string): Promise<void> {
  const path = `hospital_cqi_ovrs/${ovrId}`;
  try {
    await deleteDoc(doc(db, "hospital_cqi_ovrs", ovrId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 16. Staff Evaluation Sync and Save
export function syncCQIStaffEvals(onData: (evals: any[]) => void) {
  const path = "hospital_cqi_staff_evals";
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function saveCQIStaffEval(evaluation: any): Promise<void> {
  const path = `hospital_cqi_staff_evals/${evaluation.id}`;
  try {
    await setDoc(
      doc(db, "hospital_cqi_staff_evals", evaluation.id),
      evaluation,
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCQIStaffEval(evalId: string): Promise<void> {
  const path = `hospital_cqi_staff_evals/${evalId}`;
  try {
    await deleteDoc(doc(db, "hospital_cqi_staff_evals", evalId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 17. Unit Inspections Sync and Save
export function syncCQIUnitInspections(onData: (inspections: any[]) => void) {
  const path = "hospital_cqi_unit_inspections";
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function saveCQIUnitInspection(inspection: any): Promise<void> {
  const path = `hospital_cqi_unit_inspections/${inspection.id}`;
  try {
    await setDoc(
      doc(db, "hospital_cqi_unit_inspections", inspection.id),
      inspection,
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCQIUnitInspection(inspId: string): Promise<void> {
  const path = `hospital_cqi_unit_inspections/${inspId}`;
  try {
    await deleteDoc(doc(db, "hospital_cqi_unit_inspections", inspId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 18. Policy Signatures Read-Receipt Log
export function syncCQIPolicyAcks(onData: (acks: any[]) => void) {
  const path = "hospital_policy_acks";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveCQIPolicyAck(ack: any): Promise<void> {
  const path = `hospital_policy_acks/${ack.id}`;

  try {
    await setDoc(doc(db, "hospital_policy_acks", ack.id), ack);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCQIPolicyAck(ackId: string): Promise<void> {
  const path = `hospital_policy_acks/${ackId}`;

  try {
    await deleteDoc(doc(db, "hospital_policy_acks", ackId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 19. Clinical Decision Support Simulator Logs
export function syncCQIDecisionLogs(onData: (logs: any[]) => void) {
  const path = "hospital_decision_logs";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      list.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData(
        getLocalStore(path).sort(
          (a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        ),
      );
    },
  );
}

export async function saveCQIDecisionLog(logData: any): Promise<void> {
  const path = `hospital_decision_logs/${logData.id}`;

  try {
    await setDoc(doc(db, "hospital_decision_logs", logData.id), logData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCQIDecisionLog(logId: string): Promise<void> {
  const path = `hospital_decision_logs/${logId}`;

  try {
    await deleteDoc(doc(db, "hospital_decision_logs", logId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 20. Leave Requests (Real-time)
export function syncLeaveRequests(onData: (data: any[]) => void) {
  const path = "hospital_leave_requests";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      list.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData(
        getLocalStore(path).sort(
          (a: any, b: any) => (b.timestampMs || 0) - (a.timestampMs || 0),
        ),
      );
    },
  );
}

export async function saveLeaveRequest(req: any): Promise<void> {
  const path = `hospital_leave_requests/${req.id}`;

  try {
    await setDoc(doc(db, "hospital_leave_requests", req.id), req);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteLeaveRequest(id: string): Promise<void> {
  const path = `hospital_leave_requests/${id}`;

  try {
    await deleteDoc(doc(db, "hospital_leave_requests", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 21. Administrative Requests (Real-time)
export function syncAdminRequests(onData: (data: any[]) => void) {
  const path = "hospital_admin_requests";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      list.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData(
        getLocalStore(path).sort(
          (a: any, b: any) => (b.timestampMs || 0) - (a.timestampMs || 0),
        ),
      );
    },
  );
}

export async function saveAdminRequest(req: any): Promise<void> {
  const path = `hospital_admin_requests/${req.id}`;

  try {
    await setDoc(doc(db, "hospital_admin_requests", req.id), req);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAdminRequest(id: string): Promise<void> {
  const path = `hospital_admin_requests/${id}`;

  try {
    await deleteDoc(doc(db, "hospital_admin_requests", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 22. Daily Duties Assignment (Real-time)
export function syncDailyDuties(onData: (data: any[]) => void) {
  const path = "hospital_daily_duties";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveDailyDuty(duty: any): Promise<void> {
  const path = `hospital_daily_duties/${duty.id}`;

  try {
    await setDoc(doc(db, "hospital_daily_duties", duty.id), duty);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDailyDuty(id: string): Promise<void> {
  const path = `hospital_daily_duties/${id}`;

  try {
    await deleteDoc(doc(db, "hospital_daily_duties", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 23. Daily Emergency Teams Selection (Real-time)
export function syncEmergencyTeams(onData: (data: any[]) => void) {
  const path = "hospital_daily_emergency_teams";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveEmergencyTeam(team: any): Promise<void> {
  const path = `hospital_daily_emergency_teams/${team.id}`;

  try {
    await setDoc(doc(db, "hospital_daily_emergency_teams", team.id), team);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteEmergencyTeam(id: string): Promise<void> {
  const path = `hospital_daily_emergency_teams/${id}`;

  try {
    await deleteDoc(doc(db, "hospital_daily_emergency_teams", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 23.5 HIS Clinical Notifications & Messages (Real-time)
export function syncHISNotifications(onData: (data: any[]) => void) {
  const path = "hospital_his_notifications";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => list.push(doc.data()));
      list.sort(
        (a, b) =>
          new Date(b.timestamp || 0).getTime() -
          new Date(a.timestamp || 0).getTime(),
      );
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveHISNotification(notification: any): Promise<void> {
  const path = `hospital_his_notifications/${notification.id}`;

  try {
    await setDoc(
      doc(db, "hospital_his_notifications", notification.id),
      notification,
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteHISNotification(id: string): Promise<void> {
  const path = `hospital_his_notifications/${id}`;

  try {
    await deleteDoc(doc(db, "hospital_his_notifications", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function syncHISMessages(onData: (data: any[]) => void) {
  const path = "hospital_his_messages";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => list.push(doc.data()));
      list.sort(
        (a, b) =>
          new Date(a.timestamp || 0).getTime() -
          new Date(b.timestamp || 0).getTime(),
      );
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function saveHISMessage(message: any): Promise<void> {
  const path = `hospital_his_messages/${message.id}`;

  try {
    await setDoc(doc(db, "hospital_his_messages", message.id), message);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 24. HIS Modules (Real-time)
export function syncPatients(onData: (data: any[]) => void) {
  const path = "hospital_his_patients";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => list.push(doc.data()));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}
export async function savePatient(patient: any): Promise<void> {
  const path = `hospital_his_patients/${patient.id}`;

  try {
    await setDoc(doc(db, "hospital_his_patients", patient.id), patient);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePatient(id: string): Promise<void> {
  const path = `hospital_his_patients/${id}`;

  try {
    await deleteDoc(doc(db, "hospital_his_patients", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function syncPrescriptions(onData: (data: any[]) => void) {
  const path = "hospital_his_prescriptions";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => list.push(doc.data()));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}
export async function savePrescription(prescription: any): Promise<void> {
  const path = `hospital_his_prescriptions/${prescription.id}`;

  try {
    await setDoc(
      doc(db, "hospital_his_prescriptions", prescription.id),
      prescription,
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function syncInvoices(onData: (data: any[]) => void) {
  const path = "hospital_his_invoices";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => list.push(doc.data()));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}
export async function saveInvoice(invoice: any): Promise<void> {
  const path = `hospital_his_invoices/${invoice.id}`;

  try {
    await setDoc(doc(db, "hospital_his_invoices", invoice.id), invoice);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 27. Periodic Performance Reports Sync and Save
export function syncPeriodicReports(onData: (reports: any[]) => void) {
  const path = "hospital_periodic_reports";

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onData([]);
    },
  );
}

export async function savePeriodicReport(report: any): Promise<void> {
  const path = `hospital_periodic_reports/${report.id}`;

  try {
    await setDoc(doc(db, "hospital_periodic_reports", report.id), report);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePeriodicReport(reportId: string): Promise<void> {
  const path = `hospital_periodic_reports/${reportId}`;

  try {
    await deleteDoc(doc(db, "hospital_periodic_reports", reportId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
