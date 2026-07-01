import { createContext, useContext, useEffect, useCallback, useState, useRef } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc,
  getDocs, writeBatch, serverTimestamp,
} from "firebase/firestore";
import { db, firebaseEnabled, ensureAnonAuth } from "../firebase.js";
import { loadJSON, saveJSON } from "../utils/storage.js";
import { seedProducts } from "../data/products.js";
import { seedCategories } from "../data/categories.js";

const KEY_P = "dj_products";
const KEY_C = "dj_categories";

const DataContext = createContext(null);

// ─── Mode Firestore (realtime, lintas-user) jika Firebase sudah dikonfigurasi
// lewat .env. Kalau belum dikonfigurasi, otomatis fallback ke localStorage
// (perilaku lama, hanya sinkron antar-tab di browser yang sama) supaya app
// tetap jalan tanpa setup tambahan. ───────────────────────────────────────
export function DataProvider({ children }) {
  const [products, setProducts] = useState(() => firebaseEnabled ? [] : loadJSON(KEY_P, seedProducts));
  const [categories, setCategories] = useState(() => firebaseEnabled ? [] : loadJSON(KEY_C, seedCategories));
  const [loading, setLoading] = useState(firebaseEnabled);
  const seeded = useRef(false);

  useEffect(() => {
    if (!firebaseEnabled) return;
    let unsubProducts, unsubCategories;

    (async () => {
      await ensureAnonAuth();

      // Seed Firestore sekali saja kalau koleksinya masih kosong (mis. baru
      // pertama kali connect Firebase), supaya toko tidak tampil kosong.
      if (!seeded.current) {
        seeded.current = true;
        const [pSnap, cSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "categories")),
        ]);
        const batch = writeBatch(db);
        let needsCommit = false;
        if (pSnap.empty) {
          seedProducts.forEach((p) => {
            const { id, ...rest } = p;
            batch.set(doc(collection(db, "products")), rest);
          });
          needsCommit = true;
        }
        if (cSnap.empty) {
          seedCategories.forEach((c) => {
            const { id, ...rest } = c;
            batch.set(doc(db, "categories", id), rest);
          });
          needsCommit = true;
        }
        if (needsCommit) await batch.commit().catch(() => {});
      }

      unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
      unsubCategories = onSnapshot(collection(db, "categories"), (snap) => {
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    })();

    return () => {
      unsubProducts?.();
      unsubCategories?.();
    };
  }, []);

  // ── Fallback localStorage (dipakai hanya kalau firebaseEnabled === false) ──
  useEffect(() => { if (!firebaseEnabled) saveJSON(KEY_P, products); }, [products]);
  useEffect(() => { if (!firebaseEnabled) saveJSON(KEY_C, categories); }, [categories]);

  useEffect(() => {
    if (firebaseEnabled) return;
    const handleStorage = (e) => {
      if (e.key === KEY_P && e.newValue) {
        try { setProducts(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === KEY_C && e.newValue) {
        try { setCategories(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ─── Product CRUD ─────────────────────────────────────────────────────────
  const addProduct = useCallback(async (p) => {
    if (firebaseEnabled) {
      await ensureAnonAuth();
      await addDoc(collection(db, "products"), { ...p, createdAt: serverTimestamp() });
      return;
    }
    setProducts((list) => [{ ...p, id: "p" + Date.now() }, ...list]);
  }, []);

  const updateProduct = useCallback(async (id, patch) => {
    if (firebaseEnabled) {
      await ensureAnonAuth();
      await updateDoc(doc(db, "products", id), patch);
      return;
    }
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deleteProduct = useCallback(async (id) => {
    if (firebaseEnabled) {
      await ensureAnonAuth();
      await deleteDoc(doc(db, "products", id));
      return;
    }
    setProducts((list) => list.filter((p) => p.id !== id));
  }, []);

  // ─── Category CRUD ────────────────────────────────────────────────────────
  const addCategory = useCallback(async ({ nama }) => {
    if (firebaseEnabled) {
      await ensureAnonAuth();
      const id = nama.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
      await setDoc(doc(db, "categories", id), { nama });
      return id;
    }
    const id = nama.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
    setCategories((list) => [...list, { id, nama }]);
    return id;
  }, []);

  const updateCategory = useCallback(async (id, patch) => {
    if (firebaseEnabled) {
      await ensureAnonAuth();
      await updateDoc(doc(db, "categories", id), patch);
      return;
    }
    setCategories((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const deleteCategory = useCallback(async (id) => {
    if (firebaseEnabled) {
      await ensureAnonAuth();
      await deleteDoc(doc(db, "categories", id));
      return;
    }
    setCategories((list) => list.filter((c) => c.id !== id));
  }, []);

  const resetData = useCallback(() => {
    if (firebaseEnabled) return; // sengaja tidak diimplementasikan untuk mode Firestore
    setProducts(seedProducts);
    setCategories(seedCategories);
  }, []);

  return (
    <DataContext.Provider value={{
      products,
      categories,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      resetData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
};
