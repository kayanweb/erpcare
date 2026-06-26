import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore,
  CACHE_SIZE_UNLIMITED,
  doc,
  getDocFromServer
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import defaultFirebaseConfig from "../firebase-applet-config.json";

const firebaseConfig = defaultFirebaseConfig;
console.log("🔥 Initializing Firebase with Project ID:", firebaseConfig.projectId);

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// Use standard getFirestore for the default database
export const db = getFirestore(app);
console.log("🔥 Firestore instance created via getFirestore.");

// Persistence disabled to prevent connection lockups in the AI Studio preview iframe.
console.log("Running in standard mode: Firestore persistence disabled.");

// Critical validation constraint: Test connection to Firestore on initialization
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "hospital_clinical_records", "test-connection"));
    console.log("Firestore connection test: successfully connected to the backend.");
  } catch (error) {
    if (error instanceof Error && (error.message.includes("offline") || error.message.includes("Could not reach"))) {
      console.error("Firestore offline warning - please check your Firebase configuration: ", error.message);
    } else {
      console.warn("Firestore connection check status: ", error);
    }
  }
}
// testConnection();

export const auth = getAuth(app);


