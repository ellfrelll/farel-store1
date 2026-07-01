import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import {
  Squares2X2Icon,
  CubeIcon,
  TagIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../Toast.jsx";

const nav = [
  { to: "/admin", label: "Dashboard", icon: Squares2X2Icon, end: true },
  { to: "/admin/products", label: "Produk", icon: CubeIcon },
  { to: "/admin/categories", label: "Kategori", icon: TagIcon },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Berhasil logout");
    navigate("/admin/login");
  };

  const SidebarContent = ({ onNavigate }) => (
    <div className="flex flex-col h-full">
      <div className={`p-5 ${collapsed ? "px-3" : ""} border-b border-line/60`}>
        <Link to="/admin" className="font-display text-xl text-ink">
          <span className="text-gold">·</span>{!collapsed && "di-jam-in"}
        </Link>
        {!collapsed && <div className="text-[11px] uppercase tracking-widest text-muted mt-1">Admin Panel</div>}
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map((n) => {
          const Icon = n.icon;
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-ink text-cream"
                    : "text-ink hover:bg-cream-2"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && n.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t border-line/60">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition ${collapsed ? "justify-center" : ""}`}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-light min-h-screen bg-cream-2/40 flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-line/60 transition-all ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawer(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl fade-up">
            <SidebarContent onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-line/60 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawer(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-cream-2"
              aria-label="Buka menu"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-cream-2"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
            </button>
            <div className="text-sm text-muted hidden sm:block">Selamat datang kembali,</div>
            <div className="text-sm font-medium text-ink">{user?.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-muted hover:text-ink">Lihat toko →</Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-line/60 bg-white px-6 py-4 text-xs text-muted text-center">
          © {new Date().getFullYear()} di-jam-in Admin
        </footer>
      </div>
    </div>
  );
}
