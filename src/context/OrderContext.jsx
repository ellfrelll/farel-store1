import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { loadJSON, saveJSON } from "../utils/storage.js";

const KEY = "dj_orders";
const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => loadJSON(KEY, []));
  useEffect(() => saveJSON(KEY, orders), [orders]);

  const value = useMemo(() => ({
    orders,
    addOrder: (order) => {
      const newOrder = { ...order, id: "ORD-" + Date.now(), createdAt: Date.now(), status: "pending" };
      setOrders(cur => [newOrder, ...cur]);
      return newOrder;
    },
    updateStatus: (id, status) => setOrders(cur => cur.map(o => o.id === id ? { ...o, status } : o)),
    getUserOrders: (uid) => orders.filter(o => o.uid === uid),
  }), [orders]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrders = () => useContext(OrderContext);
