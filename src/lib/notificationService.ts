import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  updateDoc,
  doc,
  limit
} from "firebase/firestore";
import { db } from "../firebase";

export interface SystemNotification {
  id: string;
  userId: string;
  role: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type: "info" | "warning" | "error" | "success" | "critical";
  timestamp: string;
  read: boolean;
  link?: string;
  metadata?: any;
}

const NOTIFICATION_COLLECTION = "hospital_system_notifications";

/**
 * Creates a new system notification
 */
export async function createNotification(notification: Omit<SystemNotification, "id" | "timestamp" | "read">) {
  const newNotif = {
    ...notification,
    timestamp: new Date().toISOString(),
    read: false
  };
  await addDoc(collection(db, NOTIFICATION_COLLECTION), newNotif);
}

/**
 * Sync notifications for a specific user or role
 */
export function syncNotifications(userId: string, role: string, onData: (notifications: SystemNotification[]) => void) {
  // Query for user-specific, role-specific, or "all" notifications
  const q = query(
    collection(db, NOTIFICATION_COLLECTION),
    where("timestamp", ">", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()), // Last 24 hours
    orderBy("timestamp", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const allNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SystemNotification));
    const filtered = allNotifs.filter(n => 
      n.userId === userId || 
      n.userId === "all" || 
      n.role === role || 
      n.role === "all"
    );
    onData(filtered);
  });
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string) {
  const notifRef = doc(db, NOTIFICATION_COLLECTION, notificationId);
  await updateDoc(notifRef, { read: true });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(notifications: SystemNotification[]) {
  const unread = notifications.filter(n => !n.read);
  const promises = unread.map(n => markAsRead(n.id));
  await Promise.all(promises);
}
