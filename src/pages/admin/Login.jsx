import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../components/Toast.jsx";
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && isAdmin) navigate("/admin", { replace: true });
  }, [isAuthenticated, isAdmin, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    const res = login(email, password);
    if (!res.ok) { setError(res.error); return; }
    if (!isAdmin) { setError("Akun ini tidak memiliki akses admin."); return; }
    toast.success("Login berhasil");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-line dark:border-slate-700 p-8 fade-up">
        <Link to="/" className="font-display text-2xl text-ink dark:text-white">
          <span className="text-gold">·</span>di-jam-in
        </Link>
        <h1 className="font-display text-3xl mt-4 text-ink dark:text-white">Login Admin</h1>
        <p className="text-muted text-sm mt-1">Masuk untuk mengelola katalog toko.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink dark:text-white">Email</label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line dark:border-slate-700 bg-cream dark:bg-slate-900 text-ink dark:text-white focus:outline-none focus:border-gold"
                placeholder="admin@dijamin.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink dark:text-white">Password</label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line dark:border-slate-700 bg-cream dark:bg-slate-900 text-ink dark:text-white focus:outline-none focus:border-gold"
                placeholder="••••••••" />
            </div>
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</div>}
          <button type="submit" className="w-full bg-ink text-cream py-3 rounded-full font-medium hover:bg-gold transition">Masuk</button>
        </form>
        <div className="mt-4 text-xs text-muted text-center">
          Default: <code className="bg-cream-2 dark:bg-slate-700 px-1.5 py-0.5 rounded">admin@dijamin.com</code> / <code className="bg-cream-2 dark:bg-slate-700 px-1.5 py-0.5 rounded">admin123</code>
        </div>
      </div>
    </div>
  );
}
