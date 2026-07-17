import { createNotification } from "./src/lib/notificationService";

async function testNotif() {
  await createNotification({
    userId: "all",
    role: "all",
    titleAr: "تجربة",
    titleEn: "Test",
    messageAr: "هذه تجربة",
    messageEn: "This is a test",
    type: "info",
    metadata: { patientMRN: "TEST" }
  });
  console.log("Notif created");
}

testNotif();
