import { 
  subscribeToClinicalData, 
  saveDataPermanently, 
  deleteDataPermanently, 
  fetchDocumentById 
} from "./realTimeService";

// Stubs for legacy re-exports (now running purely on PostgreSQL)
export type WithFieldValue<T> = T;
export type DocumentData = any;

export const collection = {} as any;
export const getDocs = {} as any;
export const addDoc = {} as any;
export const doc = {} as any;
export const updateDoc = {} as any;
export const deleteDoc = {} as any;
export const query = {} as any;
export const where = {} as any;
export const orderBy = {} as any;
export const serverTimestamp = () => new Date().toISOString();
export const limit = {} as any;
export const onSnapshot = {} as any;
export const getDoc = {} as any;
export const setDoc = {} as any;

export const getLocalStore = (key: string) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const syncHospitalSettings = (callback: (data: any) => void) => {
  return subscribeToClinicalData<any>('settings', (allSettings) => {
    const settings = allSettings.find((s: any) => s.id === 'hospital_settings');
    callback(settings || null);
  }, (err) => console.error(err));
};

export const syncClinicalRecords = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('clinicalRecords', callback, (err) => console.error(err));
};

export const syncStaffRegistry = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('staff', callback, (err) => console.error(err));
};

export const syncSystemLogs = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('logs', callback, (err) => console.error(err));
};

export const syncDutyTasks = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('dutyTasks', callback, (err) => console.error(err));
};

export const syncCustomTemplates = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('customTemplates', callback, (err) => console.error(err));
};

export const syncSystemUsers = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('users', callback, (err) => console.error(err));
};

export const syncNotifications = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('notifications', callback, (err) => console.error(err));
};

// additional
export const syncResolvedGaps = (cb: any) => subscribeToClinicalData('resolvedGaps', cb, (err) => console.error(err));
export const saveResolvedGap = async (gap: any) => saveDataPermanently('resolvedGaps', gap);
export const deleteResolvedGap = async (id: string) => deleteDataPermanently('resolvedGaps', id);

export const getRolePermissions = async () => fetchDocumentById<any>('settings', 'rolePermissions');
export const saveRolePermissions = async (data: any) => saveDataPermanently('settings', { id: 'rolePermissions', ...data });

export const getRosterApprovals = async () => fetchDocumentById<any>('settings', 'rosterApprovals');
export const saveRosterApprovals = async (data: any) => saveDataPermanently('settings', { id: 'rosterApprovals', ...data });

export const getTemplateConfig = async () => fetchDocumentById<any>('settings', 'templateConfig');
export const saveTemplateConfig = async (data: any) => saveDataPermanently('settings', { id: 'templateConfig', ...data });

export const getResolvedGapsCloud = async () => fetchDocumentById<any>('settings', 'resolvedGapsCloud');
export const saveResolvedGapsCloud = async (data: any) => saveDataPermanently('settings', { id: 'resolvedGapsCloud', ...data });

export const syncRoles = (cb: any) => subscribeToClinicalData('roles', cb, (err) => console.error(err));
export const saveRole = async (role: any) => saveDataPermanently('roles', role);
export const deleteRole = async (id: string) => deleteDataPermanently('roles', id);

export const syncPermissions = (cb: any) => subscribeToClinicalData('permissions', cb, (err) => console.error(err));
export const savePermission = async (perm: any) => saveDataPermanently('permissions', perm);
export const deletePermission = async (id: string) => deleteDataPermanently('permissions', id);

export const syncAccessMatrix = (cb: any) => subscribeToClinicalData('accessMatrix', cb, (err) => console.error(err));
export const saveAccessMatrix = async (matrix: any) => saveDataPermanently('accessMatrix', matrix);

export const syncSentinelIncidents = (cb: any) => subscribeToClinicalData('sentinelIncidents', cb, (err) => console.error(err));

export const syncDailyDuties = (cb: any) => subscribeToClinicalData('dailyDuties', cb, (err) => console.error(err));
export const saveDailyDuty = async (duty: any): Promise<void> => {
  await saveDataPermanently('dailyDuties', duty);
};

export const syncEmergencyTeams = (cb: any) => subscribeToClinicalData('emergencyTeams', cb, (err) => console.error(err));
export const saveEmergencyTeam = async (team: any): Promise<void> => {
  await saveDataPermanently('emergencyTeams', team);
};

// --- RESTORED FUNCTIONS ---
export const saveSystemUser = async (user: any) => saveDataPermanently('users', user);
export const saveRosterWish = async (wish: any) => saveDataPermanently('rosterWishes', wish);
export const syncRosterWishes = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('rosterWishes', callback, (err) => console.error(err));
};
export const deleteRosterWish = async (id: string) => deleteDataPermanently('rosterWishes', id);

export const saveSystemLog = async (log: any) => {
  const logId = log.id || `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return saveDataPermanently('logs', { id: logId, ...log });
};
export const deleteSystemLog = async (id: string) => deleteDataPermanently('logs', id);

export const syncDepartmentRosters = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('departmentRosters', callback, (err) => console.error(err));
};

export const syncLeaveRequests = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('leaveRequests', callback, (err) => console.error(err));
};
export const saveLeaveRequest = async (request: any) => saveDataPermanently('leaveRequests', request);
export const deleteLeaveRequest = async (id: string) => deleteDataPermanently('leaveRequests', id);

export const syncAdminRequests = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('adminRequests', callback, (err) => console.error(err));
};
export const saveAdminRequest = async (request: any) => saveDataPermanently('adminRequests', request);
export const deleteAdminRequest = async (id: string) => deleteDataPermanently('adminRequests', id);

export const saveNotification = async (notif: any) => {
  const notifId = notif.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return saveDataPermanently('notifications', { id: notifId, ...notif });
};
export const saveDepartmentRoster = async (roster: any) => saveDataPermanently('departmentRosters', roster);

// clinical records
export const saveClinicalRecord = async (record: any) => saveDataPermanently('clinicalRecords', record);
export const deleteClinicalRecord = async (id: string) => deleteDataPermanently('clinicalRecords', id);

export const syncPatients = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('patients', callback, (err) => console.error(err));
};
export const savePatient = async (patient: any) => saveDataPermanently('patients', patient);
export const deletePatient = async (id: string) => deleteDataPermanently('patients', id);

export const syncEncounters = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('encounters', callback, (err) => console.error(err));
};
export const saveEncounter = async (encounter: any) => saveDataPermanently('encounters', encounter);
export const deleteEncounter = async (id: string) => deleteDataPermanently('encounters', id);

export const syncPrescriptions = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('prescriptions', callback, (err) => console.error(err));
};
export const savePrescription = async (pres: any) => saveDataPermanently('prescriptions', pres);

export const syncInvoices = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('invoices', callback, (err) => console.error(err));
};
export const saveInvoice = async (invoice: any) => saveDataPermanently('invoices', invoice);

// staff
export const saveStaffMember = async (staff: any) => saveDataPermanently('staff', staff);
export const deleteStaffMember = async (id: string) => deleteDataPermanently('staff', id);

// test connection
export const testConnection = async () => true;

// settings
export const syncSetting = (key: string, callback: (data: any) => void) => {
  return subscribeToClinicalData<any>('settings', (allSettings) => {
    const docSnap = allSettings.find((s: any) => s.id === key);
    if (docSnap) {
      // PostgresAdapter might inject 'key' along with 'id', plus updatedAt and savedBy from saveDataPermanently
      const { id, key: dbKey, updatedAt, savedBy, ...pureData } = docSnap;
      
      // If pureData only contains a 'value' property, it means it was wrapped (e.g. an array or primitive)
      if (pureData.value !== undefined && Object.keys(pureData).length === 1) {
        callback(pureData.value);
      } else {
        callback(pureData);
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
    await saveDataPermanently('settings', { id: key, ...payload });
  } catch (err) {
    console.warn(`Firestore saveSetting of ${key} failed, using localStorage fallback:`, err);
  }
};

export const getSetting = async (key: string) => {
  try {
    const data = await fetchDocumentById<any>('settings', key);
    if (data && data.value && Object.keys(data).length === 2 && Array.isArray(data.value)) {
      return data.value;
    }
    if (data) {
      const { id, ...pureData } = data;
      return pureData;
    }
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
    const data = await fetchDocumentById<any>('settings', 'hospital_settings');
    if (data) {
      const { id, ...pureData } = data;
      return pureData;
    }
  } catch (err) {
    console.warn("getHospitalSettings failed, using local", err);
  }
  return getLocalStore('hospital_settings');
};

export const saveHospitalSettings = async (settings: any) => {
  try {
    localStorage.setItem('setting_hospital_settings', JSON.stringify(settings));
    await saveDataPermanently('settings', { id: 'hospital_settings', ...settings });
  } catch (err) {
    console.warn("saveHospitalSettings failed", err);
  }
};

// duty task
export const saveDutyTask = async (task: any) => saveDataPermanently('dutyTasks', task);

// documents
export const syncCloudDocuments = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('cloudDocuments', callback, (err) => console.error(err));
};
export const saveCloudDocument = async (docObj: any) => saveDataPermanently('cloudDocuments', docObj);
export const deleteCloudDocument = async (id: string) => deleteDataPermanently('cloudDocuments', id);
export const saveCustomTemplate = async (template: any) => saveDataPermanently('customTemplates', template);
export const deleteCustomTemplate = async (id: string) => deleteDataPermanently('customTemplates', id);

// audits
export const syncDailyAudits = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('dailyAudits', callback, (err) => console.error(err));
};
export const saveDailyAudit = async (audit: any) => saveDataPermanently('dailyAudits', audit);

// CQI and incidents
export const syncCQIOvrs = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('cqiOvrs', callback, (err) => console.error(err));
};
export const saveCQIOvr = async (ovr: any) => saveDataPermanently('cqiOvrs', ovr);
export const deleteCQIOvr = async (id: string) => deleteDataPermanently('cqiOvrs', id);

export const syncCQIStaffEvals = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('cqiStaffEvals', callback, (err) => console.error(err));
};
export const saveCQIStaffEval = async (evalObj: any) => saveDataPermanently('cqiStaffEvals', evalObj);
export const deleteCQIStaffEval = async (id: string) => deleteDataPermanently('cqiStaffEvals', id);

export const syncCQIUnitInspections = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('cqiUnitInspections', callback, (err) => console.error(err));
};
export const saveCQIUnitInspection = async (insp: any) => saveDataPermanently('cqiUnitInspections', insp);
export const deleteCQIUnitInspection = async (id: string) => deleteDataPermanently('cqiUnitInspections', id);

export const syncCQIPolicyAcks = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('cqiPolicyAcks', callback, (err) => console.error(err));
};
export const saveCQIPolicyAck = async (ack: any) => saveDataPermanently('cqiPolicyAcks', ack);
export const deleteCQIPolicyAck = async (id: string) => deleteDataPermanently('cqiPolicyAcks', id);

export const syncCQIDecisionLogs = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('cqiDecisionLogs', callback, (err) => console.error(err));
};
export const saveCQIDecisionLog = async (log: any) => saveDataPermanently('cqiDecisionLogs', log);
export const deleteCQIDecisionLog = async (id: string) => deleteDataPermanently('cqiDecisionLogs', id);

export const syncPeriodicReports = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData('periodicReports', callback, (err) => console.error(err));
};
export const savePeriodicReport = async (report: any) => saveDataPermanently('periodicReports', report);
export const deletePeriodicReport = async (id: string) => deleteDataPermanently('periodicReports', id);

export const saveSentinelIncident = async (incident: any) => saveDataPermanently('sentinelIncidents', incident);
export const deleteSentinelIncident = async (id: string) => deleteDataPermanently('sentinelIncidents', id);

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
  return subscribeToClinicalData<any>('hisNotifications', (cloudDocs) => {
    const localDocs = getOfflineItems('his_notifications_offline');
    const mergedMap = new Map();
    localDocs.forEach(d => mergedMap.set(d.id, d));
    cloudDocs.forEach(d => mergedMap.set(d.id, d));
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
    await saveDataPermanently('hisNotifications', notif);
  } catch (err) {
    console.warn("Firestore saveHISNotification failed, using local fallback only:", err);
  }
};

export const deleteHISNotification = async (id: string) => {
  deleteOfflineItem('his_notifications_offline', id);
  try {
    await deleteDataPermanently('hisNotifications', id);
  } catch (err) {
    console.warn("Firestore deleteHISNotification failed, using local fallback only:", err);
  }
};

export const clearHISNotifications = async (ids: string[]) => {
  localStorage.setItem('his_notifications_offline', '[]');
  if (!ids || ids.length === 0) return;
  for (const id of ids) {
    try {
      await deleteDataPermanently('hisNotifications', id);
    } catch (err) {
      console.warn("Failed deleting notification:", id, err);
    }
  }
};

export const syncHISMessages = (callback: (data: any[]) => void) => {
  return subscribeToClinicalData<any>('hisMessages', (cloudDocs) => {
    const localDocs = getOfflineItems('his_messages_offline');
    const mergedMap = new Map();
    localDocs.forEach(d => mergedMap.set(d.id, d));
    cloudDocs.forEach(d => mergedMap.set(d.id, d));
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
    await saveDataPermanently('hisMessages', msg);
  } catch (err) {
    console.warn("Firestore saveHISMessage failed, using local fallback only:", err);
  }
};

export const clearHISMessages = async (ids: string[]) => {
  localStorage.setItem('his_messages_offline', '[]');
  if (!ids || ids.length === 0) return;
  for (const id of ids) {
    try {
      await deleteDataPermanently('hisMessages', id);
    } catch (err) {
      console.warn("Failed deleting message:", id, err);
    }
  }
};

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
    return new Promise((resolve, reject) => {
      const unsub = subscribeToClinicalData<T>(collectionName, (data) => {
        unsub();
        resolve(data);
      }, (err) => {
        unsub();
        reject(err);
      });
    });
  },

  async add<T>(collectionName: string, data: WithFieldValue<T>): Promise<string> {
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const payload = { id, ...(data as any), createdAt: new Date().toISOString() };
    await saveDataPermanently(collectionName, payload);
    return id;
  },

  async update(collectionName: string, id: string, data: Partial<DocumentData>): Promise<void> {
    const payload = { id, ...data, updatedAt: new Date().toISOString() };
    await saveDataPermanently(collectionName, payload);
  },

  async delete(collectionName: string, id: string): Promise<void> {
    await deleteDataPermanently(collectionName, id);
  }
};
