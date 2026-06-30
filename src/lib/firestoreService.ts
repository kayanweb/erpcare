import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  limit,
  DocumentData,
  WithFieldValue,
  onSnapshot,
  getDoc,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

export { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  limit,
  onSnapshot,
  getDoc,
  setDoc
};

export const getLocalStore = (key: string) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const syncHospitalSettings = (callback: (data: any) => void) => {
  return onSnapshot(doc(db, 'settings', 'hospital_settings'), (snapshot) => {
    callback(snapshot.data());
  });
};

export const syncClinicalRecords = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'clinicalRecords'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const syncStaffRegistry = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'staff'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const syncSystemLogs = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'logs'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const syncDutyTasks = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'dutyTasks'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const syncCustomTemplates = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'customTemplates'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const syncSystemUsers = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'users'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const syncNotifications = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'notifications'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// additional
export const syncResolvedGaps = (cb: any) => onSnapshot(collection(db, 'resolvedGaps'), snap => cb(snap.docs.map(d => ({id: d.id, ...d.data()}))));
export const saveResolvedGap = async (gap: any) => setDoc(doc(db, 'resolvedGaps', gap.id), gap, { merge: true });
export const deleteResolvedGap = async (id: string) => deleteDoc(doc(db, 'resolvedGaps', id));

export const getRolePermissions = async () => (await getDoc(doc(db, 'settings', 'rolePermissions'))).data();
export const saveRolePermissions = async (data: any) => setDoc(doc(db, 'settings', 'rolePermissions'), data, { merge: true });

export const getRosterApprovals = async () => (await getDoc(doc(db, 'settings', 'rosterApprovals'))).data();
export const saveRosterApprovals = async (data: any) => setDoc(doc(db, 'settings', 'rosterApprovals'), data, { merge: true });

export const getTemplateConfig = async () => (await getDoc(doc(db, 'settings', 'templateConfig'))).data();
export const saveTemplateConfig = async (data: any) => setDoc(doc(db, 'settings', 'templateConfig'), data, { merge: true });

export const getResolvedGapsCloud = async () => (await getDoc(doc(db, 'settings', 'resolvedGapsCloud'))).data();
export const saveResolvedGapsCloud = async (data: any) => setDoc(doc(db, 'settings', 'resolvedGapsCloud'), data, { merge: true });

export const syncRoles = (cb: any) => onSnapshot(collection(db, 'roles'), snap => cb(snap.docs.map(d => ({id: d.id, ...d.data()}))));
export const saveRole = async (role: any) => setDoc(doc(db, 'roles', role.id), role, { merge: true });
export const deleteRole = async (id: string) => deleteDoc(doc(db, 'roles', id));

export const syncPermissions = (cb: any) => onSnapshot(collection(db, 'permissions'), snap => cb(snap.docs.map(d => ({id: d.id, ...d.data()}))));
export const savePermission = async (perm: any) => setDoc(doc(db, 'permissions', perm.id), perm, { merge: true });
export const deletePermission = async (id: string) => deleteDoc(doc(db, 'permissions', id));

export const syncAccessMatrix = (cb: any) => onSnapshot(collection(db, 'accessMatrix'), snap => cb(snap.docs.map(d => ({id: d.id, ...d.data()}))));
export const saveAccessMatrix = async (matrix: any) => setDoc(doc(db, 'accessMatrix', matrix.id), matrix, { merge: true });

export const syncSentinelIncidents = (cb: any) => onSnapshot(collection(db, 'sentinelIncidents'), snap => cb(snap.docs.map(d => ({id: d.id, ...d.data()}))));

export const syncDailyDuties = (cb: any) => onSnapshot(collection(db, 'dailyDuties'), snap => cb(snap.docs.map(d => ({id: d.id, ...d.data()}))));
export const saveDailyDuty = async (duty: any) => setDoc(doc(db, 'dailyDuties', duty.id), duty, { merge: true });

export const syncEmergencyTeams = (cb: any) => onSnapshot(collection(db, 'emergencyTeams'), snap => cb(snap.docs.map(d => ({id: d.id, ...d.data()}))));
export const saveEmergencyTeam = async (team: any) => setDoc(doc(db, 'emergencyTeams', team.id), team, { merge: true });

// --- RESTORED FUNCTIONS ---
export const saveSystemUser = async (user: any) => await setDoc(doc(db, 'users', user.id), user, { merge: true });
export const saveRosterWish = async (wish: any) => await setDoc(doc(db, 'rosterWishes', wish.id), wish, { merge: true });
export const syncRosterWishes = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'rosterWishes'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const deleteRosterWish = async (id: string) => await deleteDoc(doc(db, 'rosterWishes', id));
export const saveSystemLog = async (log: any) => await addDoc(collection(db, 'logs'), log);
export const deleteSystemLog = async (id: string) => await deleteDoc(doc(db, 'logs', id));
export const syncDepartmentRosters = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'departmentRosters'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const syncLeaveRequests = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'leaveRequests'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveLeaveRequest = async (request: any) => await setDoc(doc(db, 'leaveRequests', request.id), request, { merge: true });
export const deleteLeaveRequest = async (id: string) => await deleteDoc(doc(db, 'leaveRequests', id));
export const syncAdminRequests = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'adminRequests'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveAdminRequest = async (request: any) => await setDoc(doc(db, 'adminRequests', request.id), request, { merge: true });
export const deleteAdminRequest = async (id: string) => await deleteDoc(doc(db, 'adminRequests', id));
export const saveNotification = async (notif: any) => await addDoc(collection(db, 'notifications'), notif);
export const saveDepartmentRoster = async (roster: any) => await setDoc(doc(db, 'departmentRosters', roster.id), roster, { merge: true });

// clinical records
export const saveClinicalRecord = async (record: any) => await setDoc(doc(db, 'clinicalRecords', record.id), record, { merge: true });
export const deleteClinicalRecord = async (id: string) => await deleteDoc(doc(db, 'clinicalRecords', id));

export const syncPatients = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'patients'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const savePatient = async (patient: any) => await setDoc(doc(db, 'patients', patient.id), patient, { merge: true });
export const deletePatient = async (id: string) => await deleteDoc(doc(db, 'patients', id));

export const syncEncounters = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'encounters'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveEncounter = async (encounter: any) => await setDoc(doc(db, 'encounters', encounter.id), encounter, { merge: true });
export const deleteEncounter = async (id: string) => await deleteDoc(doc(db, 'encounters', id));

export const syncPrescriptions = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'prescriptions'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const savePrescription = async (pres: any) => await setDoc(doc(db, 'prescriptions', pres.id), pres, { merge: true });

export const syncInvoices = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'invoices'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveInvoice = async (invoice: any) => await setDoc(doc(db, 'invoices', invoice.id), invoice, { merge: true });

// staff
export const saveStaffMember = async (staff: any) => await setDoc(doc(db, 'staff', staff.id), staff, { merge: true });
export const deleteStaffMember = async (id: string) => await deleteDoc(doc(db, 'staff', id));

// test connection
export const testConnection = async () => true;

// settings
export const syncSetting = (key: string, callback: (data: any) => void) => {
  return onSnapshot(doc(db, 'settings', key), (docSnap) => {
    const data = docSnap.data();
    if (data) {
      if (data.value !== undefined && Object.keys(data).length === 1 && Array.isArray(data.value)) {
        callback(data.value);
      } else {
        callback(data);
      }
    } else {
      const local = localStorage.getItem('setting_' + key);
      if (local) {
        const parsed = JSON.parse(local);
        callback(parsed.value !== undefined ? parsed.value : parsed);
      } else {
        callback(null);
      }
    }
  }, (err) => {
    console.warn(`Firestore syncSetting of ${key} failed, using local storage:`, err);
    const local = localStorage.getItem('setting_' + key);
    if (local) {
      const parsed = JSON.parse(local);
      callback(parsed.value !== undefined ? parsed.value : parsed);
    } else {
      callback(null);
    }
  });
};

export const saveSetting = async (key: string, data: any) => {
  const payload = (typeof data === 'object' && !Array.isArray(data)) ? data : { value: data };
  try {
    localStorage.setItem('setting_' + key, JSON.stringify(payload));
    await setDoc(doc(db, 'settings', key), payload, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveSetting of ${key} failed, using localStorage fallback:`, err);
  }
};

export const getSetting = async (key: string) => {
  try {
    const d = await getDoc(doc(db, 'settings', key));
    const data = d.data();
    if (data && data.value && Object.keys(data).length === 1 && Array.isArray(data.value)) {
      return data.value;
    }
    if (data) return data;
  } catch (err) {
    console.warn("getSetting failed, reading localStorage:", err);
  }
  const local = localStorage.getItem('setting_' + key);
  if (local) {
    const parsed = JSON.parse(local);
    return parsed.value !== undefined ? parsed.value : parsed;
  }
  return null;
};

export const getHospitalSettings = async () => {
  try {
    const d = await getDoc(doc(db, 'settings', 'hospital_settings'));
    return d.data();
  } catch (err) {
    console.warn("getHospitalSettings failed, using local", err);
  }
  return getLocalStore('hospital_settings');
};

export const saveHospitalSettings = async (settings: any) => {
  try {
    localStorage.setItem('setting_hospital_settings', JSON.stringify(settings));
    await setDoc(doc(db, 'settings', 'hospital_settings'), settings, { merge: true });
  } catch (err) {
    console.warn("saveHospitalSettings failed", err);
  }
};

// duty task
export const saveDutyTask = async (task: any) => await setDoc(doc(db, 'dutyTasks', task.id), task, { merge: true });

// documents
export const syncCloudDocuments = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'cloudDocuments'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveCloudDocument = async (docObj: any) => await setDoc(doc(db, 'cloudDocuments', docObj.id), docObj, { merge: true });
export const deleteCloudDocument = async (id: string) => await deleteDoc(doc(db, 'cloudDocuments', id));
export const saveCustomTemplate = async (template: any) => await setDoc(doc(db, 'customTemplates', template.id), template, { merge: true });
export const deleteCustomTemplate = async (id: string) => await deleteDoc(doc(db, 'customTemplates', id));

// audits
export const syncDailyAudits = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'dailyAudits'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveDailyAudit = async (audit: any) => await setDoc(doc(db, 'dailyAudits', audit.id), audit, { merge: true });

// CQI and incidents
export const syncCQIOvrs = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'cqiOvrs'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveCQIOvr = async (ovr: any) => await setDoc(doc(db, 'cqiOvrs', ovr.id), ovr, { merge: true });
export const deleteCQIOvr = async (id: string) => await deleteDoc(doc(db, 'cqiOvrs', id));

export const syncCQIStaffEvals = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'cqiStaffEvals'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveCQIStaffEval = async (evalObj: any) => await setDoc(doc(db, 'cqiStaffEvals', evalObj.id), evalObj, { merge: true });
export const deleteCQIStaffEval = async (id: string) => await deleteDoc(doc(db, 'cqiStaffEvals', id));

export const syncCQIUnitInspections = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'cqiUnitInspections'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveCQIUnitInspection = async (insp: any) => await setDoc(doc(db, 'cqiUnitInspections', insp.id), insp, { merge: true });
export const deleteCQIUnitInspection = async (id: string) => await deleteDoc(doc(db, 'cqiUnitInspections', id));

export const syncCQIPolicyAcks = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'cqiPolicyAcks'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveCQIPolicyAck = async (ack: any) => await setDoc(doc(db, 'cqiPolicyAcks', ack.id), ack, { merge: true });
export const deleteCQIPolicyAck = async (id: string) => await deleteDoc(doc(db, 'cqiPolicyAcks', id));

export const syncCQIDecisionLogs = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'cqiDecisionLogs'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const saveCQIDecisionLog = async (log: any) => await setDoc(doc(db, 'cqiDecisionLogs', log.id), log, { merge: true });
export const deleteCQIDecisionLog = async (id: string) => await deleteDoc(doc(db, 'cqiDecisionLogs', id));

export const syncPeriodicReports = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, 'periodicReports'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
export const savePeriodicReport = async (report: any) => await setDoc(doc(db, 'periodicReports', report.id), report, { merge: true });
export const deletePeriodicReport = async (id: string) => await deleteDoc(doc(db, 'periodicReports', id));

export const saveSentinelIncident = async (incident: any) => await setDoc(doc(db, 'sentinelIncidents', incident.id), incident, { merge: true });
export const deleteSentinelIncident = async (id: string) => await deleteDoc(doc(db, 'sentinelIncidents', id));

// Helper to get/set offline local fallback arrays
const getOfflineItems = (key: string): any[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveOfflineItem = (key: string, item: any) => {
  try {
    const items = getOfflineItems(key);
    const existingIdx = items.findIndex((i: any) => i.id === item.id);
    if (existingIdx > -1) {
      items[existingIdx] = item;
    } else {
      items.push(item);
    }
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to write offline fallback", e);
  }
};

const deleteOfflineItem = (key: string, id: string) => {
  try {
    const items = getOfflineItems(key);
    const next = items.filter((i: any) => i.id !== id);
    localStorage.setItem(key, JSON.stringify(next));
  } catch (e) {
    console.error("Failed to delete offline fallback", e);
  }
};

// HIS Notifications & Messages
export const syncHISNotifications = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'hisNotifications'), orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const cloudDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const localDocs = getOfflineItems('his_notifications_offline');
    const mergedMap = new Map();
    localDocs.forEach(d => mergedMap.set(d.id, d));
    cloudDocs.forEach(d => mergedMap.set(d.id, d));
    // Sort and limit merged
    const merged = Array.from(mergedMap.values()).sort((a: any, b: any) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    }).slice(0, 50);
    callback(merged);
  }, (err) => {
    console.warn("Firestore syncHISNotifications error, using offline fallback:", err);
    const localDocs = getOfflineItems('his_notifications_offline')
      .sort((a: any, b: any) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
      .slice(0, 50);
    callback(localDocs);
  });
};

export const saveHISNotification = async (notif: any) => {
  saveOfflineItem('his_notifications_offline', notif);
  try {
    await setDoc(doc(db, 'hisNotifications', notif.id), notif, { merge: true });
  } catch (err) {
    console.warn("Firestore saveHISNotification failed, using local fallback only:", err);
  }
};

export const deleteHISNotification = async (id: string) => {
  deleteOfflineItem('his_notifications_offline', id);
  try {
    await deleteDoc(doc(db, 'hisNotifications', id));
  } catch (err) {
    console.warn("Firestore deleteHISNotification failed, using local fallback only:", err);
  }
};

export const clearHISNotifications = async (ids: string[]) => {
  localStorage.setItem('his_notifications_offline', '[]');
  if (!ids || ids.length === 0) return;
  try {
    const batch = writeBatch(db);
    ids.forEach(id => {
      batch.delete(doc(db, 'hisNotifications', id));
    });
    await batch.commit();
  } catch (err) {
    console.warn("Firestore batch delete HIS notifications failed:", err);
  }
};

export const clearHISMessages = async (ids: string[]) => {
  localStorage.setItem('his_messages_offline', '[]');
  if (!ids || ids.length === 0) return;
  try {
    const batch = writeBatch(db);
    ids.forEach(id => {
      batch.delete(doc(db, 'hisMessages', id));
    });
    await batch.commit();
  } catch (err) {
    console.warn("Firestore batch delete HIS messages failed:", err);
  }
};

export const syncHISMessages = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'hisMessages'), orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const cloudDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const localDocs = getOfflineItems('his_messages_offline');
    const mergedMap = new Map();
    localDocs.forEach(d => mergedMap.set(d.id, d));
    cloudDocs.forEach(d => mergedMap.set(d.id, d));
    // Sort and limit merged
    const merged = Array.from(mergedMap.values()).sort((a: any, b: any) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    }).slice(0, 50);
    callback(merged);
  }, (err) => {
    console.warn("Firestore syncHISMessages error, using offline fallback:", err);
    const localDocs = getOfflineItems('his_messages_offline')
      .sort((a: any, b: any) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
      .slice(0, 50);
    callback(localDocs);
  });
};

export const saveHISMessage = async (msg: any) => {
  saveOfflineItem('his_messages_offline', msg);
  try {
    await setDoc(doc(db, 'hisMessages', msg.id), msg, { merge: true });
  } catch (err) {
    console.warn("Firestore saveHISMessage failed, using local fallback only:", err);
  }
};
// ------------------------------------------------

// Generic CRUD operations
export const firestoreService = {
  // Collections
  collections: {
    patients: 'patients',
    vitals: 'hospital_system_vitals',
    orders: 'orders',
    tasks: 'tasks',
    notifications: 'notifications'
  },

  async getAll<T>(collectionName: string): Promise<T[]> {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  },

  async add<T>(collectionName: string, data: WithFieldValue<T>): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), {
      ...(data as any),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(collectionName: string, id: string, data: Partial<DocumentData>): Promise<void> {
    await updateDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  async delete(collectionName: string, id: string): Promise<void> {
    await deleteDoc(doc(db, collectionName, id));
  }
};
