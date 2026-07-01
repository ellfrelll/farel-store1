import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { loadJSON, saveJSON } from "../utils/storage.js";

const KEY = "dj_wishlist";
const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => loadJSON(KEY, []));
  useEffect(() => saveJSON(KEY, items), [items]);

  const value = useMemo(() => ({
    items,
    has: (id) => items.includes(id),
    toggle: (id) => setItems(cur =>
      cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]
    ),
    count: items.length,
  }), [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
