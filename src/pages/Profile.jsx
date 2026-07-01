import { useState } from "react";
import { Navigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";

export default function Profile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
  });
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateProfile(form);
    setSaving(false);
    toast.success("Profil berhasil disimpan!");
  };

  return (
    <div className="pt-24 pb-16 max-w-2xl mx-auto px-4">
      <h1 className="font-display text-3xl text-ink dark:text-white mb-8">Profil Saya</h1>
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-line dark:border-slate-700 p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-line dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
            {user?.photoURL
              ? <img src={user.photoURL} className="w-16 h-16 rounded-full object-cover" alt="avatar" />
              : <UserCircleIcon className="w-10 h-10 text-gold" />}
          </div>
          <div>
            <div className="font-semibold text-ink dark:text-white">{user?.name || user?.username}</div>
            <div className="text-sm text-muted">{user?.email}</div>
            <div className="text-xs mt-1">
              <span className={`px-2 py-0.5 rounded-full ${user?.role === "admin" ? "bg-gold/20 text-gold" : "bg-cream-2 dark:bg-slate-700 text-muted"}`}>
                {user?.role === "admin" ? "Admin" : "Member"}
              </span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-5">
          {[
            ["name", "Nama Lengkap", "text"],
            ["username", "Username", "text"],
            ["phone", "Nomor HP", "tel"],
            ["address", "Alamat", "text"],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-ink dark:text-white mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-line dark:border-slate-700 bg-cream dark:bg-slate-900 text-ink dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-ink dark:text-white mb-1.5">Bio</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-line dark:border-slate-700 bg-cream dark:bg-slate-900 text-ink dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-ink dark:bg-gold text-cream dark:text-solid-dark py-3 rounded-xl font-semibold hover:bg-gold dark:hover:bg-gold-soft transition disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
