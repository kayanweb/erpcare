import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { Toaster } from 'sonner';

import { testConnection } from "./lib/firestoreService";
import { auth } from "./firebase";
import { signInAnonymously } from "firebase/auth";
import { seedInitialPatients, seedSystemUsers } from "./lib/patientSeeding";

// Initialize anonymous auth to ensure we have a UID for Firestore rules
// If it fails, we continue anyway (firestore.rules allow read/write if true)
signInAnonymously(auth)
  .then(() => {
    console.log("🔥 Anonymous auth successful. UID:", auth.currentUser?.uid);
  })
  .catch(err => {
    console.warn("Anonymous auth failed (ignore if rules allow public access):", err);
  })
  .finally(() => {
    Promise.all([
      seedInitialPatients(),
      seedSystemUsers()
    ]).catch(e => console.error("Seeding failed", e))
    .finally(() => {
      renderApp();
    });
  });

function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <SettingsProvider>
        <Toaster position="top-center" richColors />
        <App />
      </SettingsProvider>
    </StrictMode>,
  );
}
