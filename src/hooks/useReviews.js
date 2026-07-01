import { useCallback, useEffect, useState } from "react";
import {
  collection, query, where, onSnapshot, addDoc, serverTimestamp,
} from "firebase/firestore";
import { db, firebaseEnabled, ensureAnonAuth } from "../firebase.js";
import { loadJSON, saveJSON } from "../utils/storage.js";

const LOCAL_KEY = "dj_reviews";

// Realtime ulasan pelanggan per produk.
// - Kalau Firebase dikonfigurasi: pakai koleksi Firestore "reviews" dengan
//   onSnapshot, jadi ulasan baru langsung muncul di semua device/tab tanpa
//   refresh (persis seperti realtime produk).
// - Kalau belum dikonfigurasi: fallback ke localStorage supaya fitur tetap
//   bisa dicoba di 1 browser.
export function useReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!productId) return;

    if (firebaseEnabled) {
      setLoading(true);
      const q = query(collection(db, "reviews"), where("productId", "==", productId));
      const unsub = onSnapshot(q, (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort di client (bukan pakai orderBy Firestore) supaya tidak perlu
        // bikin composite index manual di Firebase Console.
        list.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
        setReviews(list);
        setLoading(false);
      }, () => setLoading(false));
      return () => unsub();
    }

    const all = loadJSON(LOCAL_KEY, {});
    setReviews(all[productId] || []);
    setLoading(false);
    const handleStorage = (e) => {
      if (e.key === LOCAL_KEY) {
        const updated = loadJSON(LOCAL_KEY, {});
        setReviews(updated[productId] || []);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [productId]);

  const addReview = useCallback(async ({ name, rating, text }) => {
    if (firebaseEnabled) {
      await ensureAnonAuth();
      await addDoc(collection(db, "reviews"), {
        productId, name, rating, text,
        createdAt: serverTimestamp(),
      });
      return;
    }
    const all = loadJSON(LOCAL_KEY, {});
    const list = all[productId] || [];
    const entry = { id: "r" + Date.now(), name, rating, text, createdAt: Date.now() };
    const updated = { ...all, [productId]: [entry, ...list] };
    saveJSON(LOCAL_KEY, updated);
    setReviews(updated[productId]);
  }, [productId]);

  return { reviews, loading, addReview };
}
