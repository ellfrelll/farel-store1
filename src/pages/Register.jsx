import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Password tidak cocok."); return; }
    if (form.password.length < 6) { toast.error("Password minimal 6 karakter."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = register(form.email, form.password, form.username);
    setLoading(false);
    if (result.ok) {
      toast.success("Akun berhasil dibuat!");
      navigate("/");
    } else {
      toast.error(result.error);
    }
  };

  const field = (key, label, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-ink dark:text-white mb-1.5">{label}</label>
      <input
        type={type}
        required
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-line dark:border-slate-700 bg-cream dark:bg-slate-900 text-ink dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
      />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-semibold">
            <span className="text-gold">·</span><span className="text-ink dark:text-white">di-jam-in</span>
          </Link>
          <h1 className="font-display text-2xl mt-4 text-ink dark:text-white">Buat Akun Baru</h1>
          <p className="text-muted text-sm mt-1">Sudah punya akun? <Link to="/login" className="text-gold hover:underline">Masuk</Link></p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-line dark:border-slate-700 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {field("username", "Username", "text", "username_kamu")}
            {field("email", "Email", "email", "email@contoh.com")}
            {field("password", "Password", "password", "Min. 6 karakter")}
            {field("confirm", "Konfirmasi Password", "password", "Ulangi password")}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink dark:bg-gold text-cream dark:text-solid-dark py-3 rounded-xl font-semibold hover:bg-gold dark:hover:bg-gold-soft transition disabled:opacity-60"
            >
              {loading ? "Membuat akun..." : "Daftar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
