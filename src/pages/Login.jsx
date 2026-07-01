import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.ok) {
      toast.success("Selamat datang kembali!");
      navigate("/");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-semibold">
            <span className="text-gold">·</span><span className="text-ink dark:text-white">di-jam-in</span>
          </Link>
          <h1 className="font-display text-2xl mt-4 text-ink dark:text-white">Masuk ke Akun</h1>
          <p className="text-muted text-sm mt-1">Belum punya akun? <Link to="/register" className="text-gold hover:underline">Daftar sekarang</Link></p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-line dark:border-slate-700 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink dark:text-white mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 rounded-xl border border-line dark:border-slate-700 bg-cream dark:bg-slate-900 text-ink dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink dark:text-white mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-line dark:border-slate-700 bg-cream dark:bg-slate-900 text-ink dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink dark:bg-gold text-cream dark:text-solid-dark py-3 rounded-xl font-semibold hover:bg-gold dark:hover:bg-gold-soft transition disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
          <div className="mt-4 text-center text-xs text-muted">
            <span className="bg-cream-2 dark:bg-slate-700 px-3 py-1 rounded-full">
              Demo admin: admin@dijamin.com / admin123
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
