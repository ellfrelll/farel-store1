import { createContext, useContext, useEffect, useCallback, useRef, useState } from "react";
import { loadJSON, saveJSON } from "../utils/storage.js";

const KEY = "dj_cart";
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadJSON(KEY, []));

  // Persist to localStorage on every change
  useEffect(() => {
    saveJSON(KEY, items);
  }, [items]);

  const add = useCallback((id, qty = 1) => {
    setItems((cur) => {
      const ex = cur.find((it) => it.id === id);
      if (ex) return cur.map((it) => (it.id === id ? { ...it, qty: it.qty + qty } : it));
      return [...cur, { id, qty }];
    });
  }, []);

  const inc = useCallback((id) => {
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)));
  }, []);

  const dec = useCallback((id) => {
    setItems((cur) =>
      cur
        .map((it) => (it.id === id ? { ...it, qty: it.qty - 1 } : it))
        .filter((it) => it.qty > 0)
    );
  }, []);

  const remove = useCallback((id) => {
    setItems((cur) => cur.filter((it) => it.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, it) => s + it.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, add, inc, dec, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
