import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ShoppingBagIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon,
  HeartIcon, SunIcon, MoonIcon, UserCircleIcon, ChevronDownIcon
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";

export default function Navbar() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { dark, toggle } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { products } = useData();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); setSearchOpen(false); setUserMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const searchResults = search.length >= 2
    ? products.filter(p =>
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSearchOpen(false);
    }
  };

  const lc = ({ isActive }) => `text-sm font-medium transition-colors ${isActive ? "text-gold" : "text-ink dark:text-slate-200 hover:text-gold"}`;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-cream/90 dark:bg-[#15120e]/90 backdrop-blur-md shadow-[0_1px_0_var(--color-line)]"
        : "bg-cream/80 dark:bg-[#15120e]/60 backdrop-blur"
    }`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`}>
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-semibold tracking-tight shrink-0">
          <span className="text-gold">·</span><span className="text-ink dark:text-white">di-jam-in</span>
        </Link>

        {/* Nav links - desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          <NavLink to="/" end className={lc}>Beranda</NavLink>
          <NavLink to="/products" className={lc}>Produk</NavLink>
          <NavLink to="/products?kategori=analog" className={lc}>Klasik</NavLink>
          <NavLink to="/products?kategori=digital" className={lc}>Sport</NavLink>
          <NavLink to="/products?kategori=smartwatch" className={lc}>Professional</NavLink>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => { setSearchOpen(v => !v); }}
              className="p-2 rounded-full hover:bg-ink/5 dark:hover:bg-white/10 transition"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-ink dark:text-white" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 slide-down">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    autoFocus
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari jam tangan..."
                    className="w-full bg-white dark:bg-slate-800 border border-line dark:border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                </form>
                {searchResults.length > 0 && (
                  <div className="mt-1 bg-white dark:bg-slate-800 border border-line dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    {searchResults.map(p => (
                      <Link
                        key={p.id}
                        to={`/products/${p.id}`}
                        onClick={() => { setSearch(""); setSearchOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-2 dark:hover:bg-slate-700 transition"
                      >
                        <img src={p.gambar} alt={p.nama} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <div className="text-sm font-medium text-ink dark:text-white line-clamp-1">{p.nama}</div>
                          <div className="text-xs text-muted">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.harga)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dark mode */}
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-ink/5 dark:hover:bg-white/10 transition"
            aria-label="Toggle dark mode"
          >
            {dark
              ? <SunIcon className="w-5 h-5 text-gold" />
              : <MoonIcon className="w-5 h-5 text-ink" />}
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-ink/5 dark:hover:bg-white/10 transition">
            <HeartIcon className="w-5 h-5 text-ink dark:text-white" />
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{wishCount}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-ink/5 dark:hover:bg-white/10 transition">
            <ShoppingBagIcon className="w-5 h-5 text-ink dark:text-white" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
            )}
          </Link>

          {/* User */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-1 p-2 rounded-full hover:bg-ink/5 dark:hover:bg-white/10 transition"
            >
              {user?.photoURL
                ? <img src={user.photoURL} className="w-7 h-7 rounded-full object-cover" alt="avatar" />
                : <UserCircleIcon className="w-6 h-6 text-ink dark:text-white" />}
              {user && <ChevronDownIcon className="w-3 h-3 text-muted hidden sm:block" />}
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-line dark:border-slate-700 rounded-xl shadow-xl slide-down overflow-hidden">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-line dark:border-slate-700">
                      <div className="text-sm font-semibold text-ink dark:text-white truncate">{user.name || user.username}</div>
                      <div className="text-xs text-muted truncate">{user.email}</div>
                    </div>
                    <Link to="/profile" className="block px-4 py-2.5 text-sm hover:bg-cream-2 dark:hover:bg-slate-700 transition text-ink dark:text-slate-200">Profil Saya</Link>
                    <Link to="/orders" className="block px-4 py-2.5 text-sm hover:bg-cream-2 dark:hover:bg-slate-700 transition text-ink dark:text-slate-200">Pesanan</Link>
                    <Link to="/balance" className="block px-4 py-2.5 text-sm hover:bg-cream-2 dark:hover:bg-slate-700 transition text-ink dark:text-slate-200">Saldo Saya</Link>
                    {isAdmin && <Link to="/admin" className="block px-4 py-2.5 text-sm text-gold hover:bg-cream-2 dark:hover:bg-slate-700 transition">Admin Panel</Link>}
                    <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">Keluar</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2.5 text-sm hover:bg-cream-2 dark:hover:bg-slate-700 transition text-ink dark:text-slate-200">Masuk</Link>
                    <Link to="/register" className="block px-4 py-2.5 text-sm text-gold hover:bg-cream-2 dark:hover:bg-slate-700 transition font-medium">Daftar</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(v => !v)} className="lg:hidden p-2 rounded-full hover:bg-ink/5 dark:hover:bg-white/10">
            {open ? <XMarkIcon className="w-5 h-5 text-ink dark:text-white" /> : <Bars3Icon className="w-5 h-5 text-ink dark:text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-line dark:border-slate-700 bg-white dark:bg-slate-900 slide-down">
          <div className="px-4 py-4 flex flex-col gap-1">
            {[
              ["/", "Beranda"], ["/products", "Semua Produk"],
              ["/products?kategori=analog", "Klasik"],
              ["/products?kategori=digital", "Sport"],
              ["/products?kategori=smartwatch", "Professional"],
              ["/cart", "Keranjang"],
              ["/wishlist", "Wishlist"],
            ].map(([to, label]) => (
              <Link key={to} to={to} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-ink dark:text-slate-200 hover:bg-cream-2 dark:hover:bg-slate-800 transition">
                {label}
              </Link>
            ))}
            {user
              ? <>
                  <Link to="/profile" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-ink dark:text-slate-200 hover:bg-cream-2 dark:hover:bg-slate-800 transition">Profil</Link>
                  <Link to="/orders" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-ink dark:text-slate-200 hover:bg-cream-2 dark:hover:bg-slate-800 transition">Pesanan</Link>
                  <button onClick={logout} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">Keluar</button>
                </>
              : <>
                  <Link to="/login" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gold hover:bg-cream-2 dark:hover:bg-slate-800 transition">Masuk / Daftar</Link>
                </>
            }
          </div>
        </div>
      )}
    </header>
  );
}
