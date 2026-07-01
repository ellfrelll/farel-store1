import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "../utils/storage.js";

// ─── Firebase-ready Auth Context ─────────────────────────────────────────────
// Saat ini menggunakan localStorage. Untuk connect Firebase, ganti fungsi
// login/register/logout di bawah dengan Firebase Auth calls.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "dj_auth_user";
const USERS_KEY = "dj_users";
const AuthContext = createContext(null);

const getUsers = () => loadJSON(USERS_KEY, [
  { uid: "admin-1", email: "admin@dijamin.com", password: "admin123", username: "admin",
    name: "Admin", role: "admin", balance: 0, photoURL: null, createdAt: Date.now() }
]);
const saveUsers = (u) => saveJSON(USERS_KEY, u);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadJSON(KEY, null));
  useEffect(() => saveJSON(KEY, user), [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",

    login: (email, password) => {
      const users = getUsers();
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) return { ok: false, error: "Email atau password salah." };
      const { password: _, ...safe } = found;
      setUser(safe);
      return { ok: true };
    },

    register: (email, password, username) => {
      const users = getUsers();
      if (users.find(u => u.email === email)) return { ok: false, error: "Email sudah terdaftar." };
      if (users.find(u => u.username === username)) return { ok: false, error: "Username sudah digunakan." };
      const newUser = {
        uid: "u-" + Date.now(),
        email, password, username,
        name: username,
        role: "user",
        balance: 0,
        photoURL: null,
        createdAt: Date.now(),
      };
      saveUsers([...users, newUser]);
      const { password: _, ...safe } = newUser;
      setUser(safe);
      return { ok: true };
    },

    logout: () => setUser(null),

    updateProfile: (patch) => {
      const users = getUsers();
      const updated = users.map(u => u.uid === user.uid ? { ...u, ...patch } : u);
      saveUsers(updated);
      setUser(cur => ({ ...cur, ...patch }));
    },

    addBalance: (amount) => {
      const newBalance = (user?.balance || 0) + amount;
      const users = getUsers();
      const updated = users.map(u => u.uid === user.uid ? { ...u, balance: newBalance } : u);
      saveUsers(updated);
      setUser(cur => ({ ...cur, balance: newBalance }));
      return newBalance;
    },

    deductBalance: (amount) => {
      if ((user?.balance || 0) < amount) return { ok: false, error: "Saldo tidak mencukupi." };
      const newBalance = user.balance - amount;
      const users = getUsers();
      const updated = users.map(u => u.uid === user.uid ? { ...u, balance: newBalance } : u);
      saveUsers(updated);
      setUser(cur => ({ ...cur, balance: newBalance }));
      return { ok: true, balance: newBalance };
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
