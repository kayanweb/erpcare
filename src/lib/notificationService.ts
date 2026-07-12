import { subscribeToClinicalData, saveDataPermanently } from "./realTimeService";

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
  const notifId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newNotif: SystemNotification = {
    ...notification,
    id: notifId,
    timestamp: new Date().toISOString(),
    read: false
  };
  await saveDataPermanently(NOTIFICATION_COLLECTION, newNotif);
}

/**
 * Sync notifications for a specific user or role
 */
export function syncNotifications(userId: string, role: string, onData: (notifications: SystemNotification[]) => void) {
  return subscribeToClinicalData<SystemNotification>(
    NOTIFICATION_COLLECTION,
    (allNotifs) => {
      // Sort desc by timestamp
      const sorted = [...allNotifs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      const filtered = sorted.filter(n => 
        n.userId === userId || 
        n.userId === "all" || 
        n.role === role || 
        n.role === "all"
      );
      onData(filtered.slice(0, 50));
    },
    (err) => console.error("Notification sync error:", err)
  );
}

/**
 * Mark a notification as read
 */
export async function deleteNotification(notificationId: string) {
  const { deleteDataPermanently } = require("./realTimeService");
  await deleteDataPermanently(NOTIFICATION_COLLECTION, notificationId);
}

export async function markAsRead(notificationId: string) {
  await saveDataPermanently(NOTIFICATION_COLLECTION, {
    id: notificationId,
    read: true
  } as any);
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(notifications: SystemNotification[]) {
  const unread = notifications.filter(n => !n.read);
  const promises = unread.map(n => markAsRead(n.id));
  await Promise.all(promises);
}
