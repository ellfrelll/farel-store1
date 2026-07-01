import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useData } from "../context/DataContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

const PRICE_RANGES = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "< Rp500K", min: 0, max: 500000 },
  { label: "Rp500K – 1JT", min: 500000, max: 1000000 },
  { label: "Rp1JT – 2JT", min: 1000000, max: 2000000 },
  { label: "> Rp2JT", min: 2000000, max: Infinity },
];

export default function Products() {
  const { products, categories } = useData();
  const [params, setParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceIdx, setPriceIdx] = useState(0);
  const [sortBy, setSortBy] = useState("default");

  const activeKat = params.get("kategori") || "all";
  const activeBrand = params.get("brand") || "all";
  const searchQ = (params.get("q") || "").toLowerCase();

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  const filtered = useMemo(() => {
    let list = products;
    if (activeKat !== "all") list = list.filter(p => p.kategori === activeKat);
    if (activeBrand !== "all") list = list.filter(p => p.brand === activeBrand);
    if (searchQ) list = list.filter(p =>
      p.nama.toLowerCase().includes(searchQ) || (p.brand || "").toLowerCase().includes(searchQ)
    );
    const range = PRICE_RANGES[priceIdx];
    list = list.filter(p => p.harga >= range.min && p.harga <= range.max);
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.harga - b.harga);
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.harga - a.harga);
    else if (sortBy === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "new") list = list.filter(p => p.is_new_arrival);
    return list;
  }, [products, activeKat, activeBrand, searchQ, priceIdx, sortBy]);

  const setKat = (id) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("kategori"); else next.set("kategori", id);
    setParams(next);
  };
  const setBrand = (b) => {
    const next = new URLSearchParams(params);
    if (b === "all") next.delete("brand"); else next.set("brand", b);
    setParams(next);
  };

  const activeFilters = [
    activeKat !== "all" && activeKat,
    activeBrand !== "all" && activeBrand,
    priceIdx !== 0 && PRICE_RANGES[priceIdx].label,
    searchQ && `"${searchQ}"`,
  ].filter(Boolean);

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <SectionTitle eyebrow="Koleksi" title="Semua Produk" subtitle={`${filtered.length} produk ditemukan`} />
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm border border-line dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="default">Urutkan: Default</option>
            <option value="price-asc">Harga: Terendah</option>
            <option value="price-desc">Harga: Tertinggi</option>
            <option value="rating">Rating Terbaik</option>
            <option value="new">Terbaru</option>
          </select>
          <button
            onClick={() => setFilterOpen(v => !v)}
            className="flex items-center gap-2 text-sm border border-line dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 text-ink dark:text-white hover:border-gold transition"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            Filter
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center">{activeFilters.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(f => (
            <span key={f} className="inline-flex items-center gap-1 text-xs bg-gold/10 text-brown dark:text-gold px-3 py-1 rounded-full">
              {f}
            </span>
          ))}
          <button
            onClick={() => { setParams({}); setPriceIdx(0); setSortBy("default"); }}
            className="text-xs text-muted hover:text-ink dark:hover:text-white underline"
          >
            Reset semua
          </button>
        </div>
      )}

      {/* Filter panel */}
      {filterOpen && (
        <div className="bg-white dark:bg-slate-800 border border-line dark:border-slate-700 rounded-2xl p-5 mb-6 slide-down">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm text-ink dark:text-white">Filter Produk</span>
            <button onClick={() => setFilterOpen(false)}><XMarkIcon className="w-5 h-5 text-muted" /></button>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Kategori */}
            <div>
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Kategori</div>
              <div className="flex flex-wrap gap-2">
                {[{ id: "all", nama: "Semua" }, ...categories].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setKat(c.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      activeKat === c.id
                        ? "bg-ink dark:bg-gold text-cream dark:text-solid-dark border-ink dark:border-gold"
                        : "border-line dark:border-slate-600 text-ink dark:text-slate-200 hover:border-ink dark:hover:border-gold"
                    }`}
                  >
                    {c.nama}
                  </button>
                ))}
              </div>
            </div>
            {/* Brand */}
            <div>
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Brand</div>
              <div className="flex flex-wrap gap-2">
                {["all", ...brands].map(b => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      activeBrand === b
                        ? "bg-ink dark:bg-gold text-cream dark:text-solid-dark border-ink dark:border-gold"
                        : "border-line dark:border-slate-600 text-ink dark:text-slate-200 hover:border-ink dark:hover:border-gold"
                    }`}
                  >
                    {b === "all" ? "Semua" : b}
                  </button>
                ))}
              </div>
            </div>
            {/* Harga */}
            <div>
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Rentang Harga</div>
              <div className="flex flex-col gap-1.5">
                {PRICE_RANGES.map((r, i) => (
                  <button
                    key={r.label}
                    onClick={() => setPriceIdx(i)}
                    className={`text-xs text-left px-3 py-1.5 rounded-lg transition ${
                      priceIdx === i
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-ink dark:text-slate-200 hover:bg-cream-2 dark:hover:bg-slate-700"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ id: "all", nama: "Semua" }, ...categories].map(c => (
          <button
            key={c.id}
            onClick={() => setKat(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              activeKat === c.id
                ? "bg-ink dark:bg-gold text-cream dark:text-solid-dark border-ink dark:border-gold"
                : "bg-white dark:bg-slate-800 text-ink dark:text-slate-200 border-line dark:border-slate-700 hover:border-ink dark:hover:border-gold"
            }`}
          >
            {c.nama}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingBagIcon} title="Produk tidak ditemukan" description="Coba ubah filter atau kata kunci pencarian." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
