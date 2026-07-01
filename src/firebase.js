import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

// Isi nilai-nilai berikut lewat file .env (lihat .env.example).
// Semua variabel HARUS diawali "VITE_" agar terbaca oleh Vite.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = firebaseEnabled ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

// Kita pakai Firebase Anonymous Auth hanya supaya Firestore Security Rules bisa
// mewajibkan `request.auth != null` untuk operasi tulis (read/write realtime),
// TANPA mengubah sistem login username/password kustom yang sudah ada di
// AuthContext.jsx. Jadi ada dua identitas yang berjalan berdampingan:
//  - AuthContext (localStorage)  -> identitas "siapa nama yang tampil di UI"
//  - Firebase Anonymous Auth     -> identitas teknis untuk lolos security rules
let anonPromise = null;
export function ensureAnonAuth() {
  if (!auth) return Promise.resolve(null);
  if (!anonPromise) {
    anonPromise = new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
          unsub();
          resolve(u);
        } else {
          signInAnonymously(auth).catch(() => resolve(null));
        }
      });
    });
  }
  return anonPromise;
}
