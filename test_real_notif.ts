import { createNotification } from "./src/lib/notificationService";

async function testNotif() {
  try {
    await createNotification({
      userId: "test-user",
      role: "admin",
      titleAr: "تجربة",
      titleEn: "Test",
      messageAr: "هذه تجربة",
      messageEn: "This is a test",
      type: "info",
      metadata: { patientMRN: "TEST" }
    });
    console.log("Notif created successfully");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testNotif();
