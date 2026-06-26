import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// Safe storage wrapper to prevent SecurityErrors in restricted iframes
const safeStorage = (storage: Storage | undefined) => {
  try {
    if (storage) {
      storage.getItem('test');
      return storage;
    }
  } catch (e) {
    // Ignore
  }
  // Mock storage
  let data: Record<string, string> = {};
  return {
    getItem: (key: string) => data[key] || null,
    setItem: (key: string, value: string) => { data[key] = String(value); },
    removeItem: (key: string) => { delete data[key]; },
    clear: () => { data = {}; },
    key: (index: number) => Object.keys(data)[index] || null,
    get length() { return Object.keys(data).length; }
  } as Storage;
};

try {
  const local = Object.getOwnPropertyDescriptor(window, 'localStorage') ? window.localStorage : undefined;
  Object.defineProperty(window, 'localStorage', { value: safeStorage(local), writable: true });
} catch (e) {
  Object.defineProperty(window, 'localStorage', { value: safeStorage(undefined), writable: true });
}

try {
  const session = Object.getOwnPropertyDescriptor(window, 'sessionStorage') ? window.sessionStorage : undefined;
  Object.defineProperty(window, 'sessionStorage', { value: safeStorage(session), writable: true });
} catch (e) {
  Object.defineProperty(window, 'sessionStorage', { value: safeStorage(undefined), writable: true });
}

import App from './App.tsx';
import './index.css';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { Toaster } from 'sonner';

import { testConnection } from "./lib/firestoreService";
import { auth } from "./firebase";
import { signInAnonymously } from "firebase/auth";
import { seedInitialPatients } from "./lib/patientSeeding";

// Initialize anonymous auth to ensure we have a UID for Firestore rules
signInAnonymously(auth)
  .then(() => {
    console.log("🔥 Anonymous auth successful. UID:", auth.currentUser?.uid);
    seedInitialPatients().catch(e => console.error("Seeding failed", e));
    renderApp();
  })
  .catch(err => {
    console.warn("Anonymous auth failed:", err);
    renderApp(); // Render anyway as fallback
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
