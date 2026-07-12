import { db } from "./index";
import { patients, prescriptions, invoices, staff, logs, dutyTasks, notifications, messages, settings, collectionsStore } from "./schema";
import { eq, and } from "drizzle-orm";
import { IDatabaseAdapter } from "./adapter";
import fs from "fs";
import path from "path";

const LOCAL_DB_PATH = path.join(process.cwd(), "local_database.json");

// Dynamic file-backed local storage helpers
function readLocalDb(): Record<string, any[]> {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const content = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      return JSON.parse(content) || {};
    }
  } catch (err) {
    console.error("⚠️ Error reading local JSON db fallback:", err);
  }
  return {};
}

function writeLocalDb(dbData: Record<string, any[]>) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.error("⚠️ Error writing local JSON db fallback:", err);
  }
}

function getLocalCollection(collectionName: string): any[] {
  const dbData = readLocalDb();
  return dbData[collectionName] || [];
}

function saveLocalItem(collectionName: string, item: any) {
  const dbData = readLocalDb();
  if (!dbData[collectionName]) {
    dbData[collectionName] = [];
  }
  const collection = dbData[collectionName];
  
  // Find index depending on if it is settings (key-based) or ordinary (id-based)
  const idx = collection.findIndex((x: any) => {
    if (collectionName === "settings") {
      return (x.key === item.key || x.id === item.id || x.key === item.id || x.id === item.key);
    }
    return x.id === item.id;
  });

  if (idx !== -1) {
    collection[idx] = { ...collection[idx], ...item };
  } else {
    collection.push(item);
  }
  writeLocalDb(dbData);
}

function deleteLocalItem(collectionName: string, id: string) {
  const dbData = readLocalDb();
  if (dbData[collectionName]) {
    dbData[collectionName] = dbData[collectionName].filter((x: any) => {
      if (collectionName === "settings") {
        return x.key !== id && x.id !== id;
      }
      return x.id !== id;
    });
    writeLocalDb(dbData);
  }
}

// Check if PostgreSQL is available and configured
function usePostgres(): boolean {
  const url = process.env.DATABASE_URL;
  return !!url && (url.startsWith("postgres://") || url.startsWith("postgresql://"));
}

export class PostgresAdapter implements IDatabaseAdapter {
  async fetchCollection(collectionName: string): Promise<any[]> {
    if (!usePostgres()) {
      return getLocalCollection(collectionName);
    }

    try {
      if (collectionName === "patients") {
        const rows = await db.select().from(patients);
        return rows.map(r => ({ ...((r.clinicalData as any) || {}), ...r }));
      } else if (collectionName === "prescriptions") {
        return await db.select().from(prescriptions);
      } else if (collectionName === "invoices") {
        return await db.select().from(invoices);
      } else if (collectionName === "staff") {
        return await db.select().from(staff);
      } else if (collectionName === "logs" || collectionName === "systemLogs") {
        return await db.select().from(logs);
      } else if (collectionName === "dutyTasks") {
        return await db.select().from(dutyTasks);
      } else if (collectionName === "notifications") {
        return await db.select().from(notifications);
      } else if (collectionName === "messages") {
        return await db.select().from(messages);
      } else if (collectionName === "settings") {
        const rows = await db.select().from(settings);
        return rows.map(r => ({ id: r.key, key: r.key, ...((r.value as any) || {}) }));
      } else {
        const rows = await db.select().from(collectionsStore).where(eq(collectionsStore.collectionName, collectionName));
        return rows.map(r => ({ ...((r.data as any) || {}), id: r.id }));
      }
    } catch (err: any) {
      console.warn(`⚠️ PostgreSQL connection error during fetch for '${collectionName}'. Falling back to local JSON database. Error:`, err.message);
      return getLocalCollection(collectionName);
    }
  }

  async saveItem(collectionName: string, item: any): Promise<boolean> {
    // Optimistically write to local fallback first to ensure local durability
    saveLocalItem(collectionName, item);

    if (!usePostgres()) {
      return true;
    }

    try {
      if (collectionName === "patients") {
        const patientVal = {
          id: item.id,
          mrn: item.mrn || "",
          nameEn: item.nameEn || "",
          nameAr: item.nameAr || "",
          age: Number(item.age) || 0,
          gender: item.gender || "",
          phone: item.phone || "",
          status: item.status || "",
          insurance: item.insurance || "",
          clinicalData: item,
        };
        await db.insert(patients).values(patientVal).onConflictDoUpdate({
          target: patients.id,
          set: patientVal
        });
      } else if (collectionName === "prescriptions") {
        const pVal = {
          id: item.id,
          patientId: item.patientId || "",
          medication: item.medication || "",
          dose: item.dose || "",
          qty: Number(item.qty) || 0,
          status: item.status || "",
          date: item.date || "",
        };
        await db.insert(prescriptions).values(pVal).onConflictDoUpdate({
          target: prescriptions.id,
          set: pVal
        });
      } else if (collectionName === "invoices") {
        const iVal = {
          id: item.id,
          patientId: item.patientId || "",
          amount: String(item.amount || "0"),
          status: item.status || "",
          date: item.date || "",
        };
        await db.insert(invoices).values(iVal).onConflictDoUpdate({
          target: invoices.id,
          set: iVal
        });
      } else if (collectionName === "staff") {
        const sVal = {
          id: item.id,
          name: item.name || "",
          role: item.role || "",
          department: item.department || "",
        };
        await db.insert(staff).values(sVal).onConflictDoUpdate({
          target: staff.id,
          set: sVal
        });
      } else if (collectionName === "logs" || collectionName === "systemLogs") {
        const lVal = {
          id: item.id,
          message: item.message || "",
          timestamp: item.timestamp || new Date().toISOString(),
        };
        await db.insert(logs).values(lVal).onConflictDoUpdate({
          target: logs.id,
          set: lVal
        });
      } else if (collectionName === "dutyTasks") {
        const tVal = {
          id: item.id,
          title: item.title || "",
          status: item.status || "",
        };
        await db.insert(dutyTasks).values(tVal).onConflictDoUpdate({
          target: dutyTasks.id,
          set: tVal
        });
      } else if (collectionName === "notifications") {
        const nVal = {
          id: item.id,
          message: item.message || "",
          timestamp: item.timestamp || new Date().toISOString(),
        };
        await db.insert(notifications).values(nVal).onConflictDoUpdate({
          target: notifications.id,
          set: nVal
        });
      } else if (collectionName === "messages") {
        const mVal = {
          id: item.id,
          senderNameAr: item.senderNameAr || item.sender_name_ar || "",
          senderNameEn: item.senderNameEn || item.sender_name_en || "",
          content: item.content || "",
          timestamp: item.timestamp || new Date().toISOString(),
        };
        await db.insert(messages).values(mVal).onConflictDoUpdate({
          target: messages.id,
          set: mVal
        });
      } else if (collectionName === "settings") {
        const setKey = item.key || item.id;
        const sVal = {
          key: setKey,
          value: item,
        };
        await db.insert(settings).values(sVal).onConflictDoUpdate({
          target: settings.key,
          set: sVal
        });
      } else {
        const cVal = {
          id: item.id,
          collectionName,
          data: item,
          updatedAt: new Date().toISOString(),
        };
        await db.insert(collectionsStore).values({
          ...cVal,
          createdAt: new Date().toISOString(),
        }).onConflictDoUpdate({
          target: collectionsStore.id,
          set: cVal
        });
      }
      return true;
    } catch (err: any) {
      console.warn(`⚠️ PostgreSQL connection error during save for '${collectionName}'. Offline file storage maintained save. Error:`, err.message);
      return true; // We return true since it's saved locally
    }
  }

  async deleteItem(collectionName: string, id: string): Promise<boolean> {
    deleteLocalItem(collectionName, id);

    if (!usePostgres()) {
      return true;
    }

    try {
      if (collectionName === "patients") {
        await db.delete(patients).where(eq(patients.id, id));
      } else if (collectionName === "prescriptions") {
        await db.delete(prescriptions).where(eq(prescriptions.id, id));
      } else if (collectionName === "invoices") {
        await db.delete(invoices).where(eq(invoices.id, id));
      } else if (collectionName === "staff") {
        await db.delete(staff).where(eq(staff.id, id));
      } else if (collectionName === "logs" || collectionName === "systemLogs") {
        await db.delete(logs).where(eq(logs.id, id));
      } else if (collectionName === "dutyTasks") {
        await db.delete(dutyTasks).where(eq(dutyTasks.id, id));
      } else if (collectionName === "notifications") {
        await db.delete(notifications).where(eq(notifications.id, id));
      } else if (collectionName === "messages") {
        await db.delete(messages).where(eq(messages.id, id));
      } else if (collectionName === "settings") {
        await db.delete(settings).where(eq(settings.key, id));
      } else {
        await db.delete(collectionsStore).where(
          and(
            eq(collectionsStore.id, id),
            eq(collectionsStore.collectionName, collectionName)
          )
        );
      }
      return true;
    } catch (err: any) {
      console.warn(`⚠️ PostgreSQL connection error during delete for '${collectionName}'. Offline file storage maintained deletion. Error:`, err.message);
      return true;
    }
  }
}
