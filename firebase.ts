import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as firebaseAuth from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD8Q3IrR73rpaE695YI3maGtUuJSPV33j8",
  authDomain: "udangandigital-c0c76.firebaseapp.com",
  projectId: "udangandigital-c0c76",
  storageBucket: "udangandigital-c0c76.firebasestorage.app",
  messagingSenderId: "885328796440",
  appId: "1:885328796440:web:8007f9ee605987c2509c6d",
  measurementId: "G-JEZ6YQM20P"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = firebaseAuth.getAuth(app);

// Helper function dengan error handling yang lebih baik
export const signIn = async () => {
  try {
    await firebaseAuth.signInAnonymously(auth);
    console.log("Berhasil terhubung ke Firebase (Anonymous Auth).");
  } catch (error: any) {
    console.error("Gagal terhubung ke Firebase Auth:", error.message);
    
    if (error.code === 'auth/configuration-not-found') {
      console.warn(`
        ⚠️ PERHATIAN: Fitur 'Anonymous Sign-in' belum aktif di Firebase Console!
        CARA FIX:
        1. Buka Firebase Console > Authentication > Sign-in method.
        2. Aktifkan provider 'Anonymous'.
        3. Simpan perubahan.
      `);
    } else if (error.code === 'auth/api-key-not-valid') {
       console.warn("⚠️ API Key tidak valid. Cek kembali firebaseConfig di file firebase.ts.");
    }
  }
};