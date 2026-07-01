import { CubeIcon, TagIcon, StarIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useData } from "../../context/DataContext.jsx";

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-line/60 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
          <div className="text-3xl font-display mt-2">{value}</div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { products, categories } = useData();
  const bestCount = products.filter((p) => p.is_best_seller).length;
  const newCount = products.filter((p) => p.is_new_arrival).length;

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Dashboard</h1>
      <p className="text-muted text-sm mb-6">Ringkasan singkat toko Anda.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CubeIcon} label="Total Produk" value={products.length} accent="bg-cream-2 text-brown" />
        <StatCard icon={TagIcon} label="Total Kategori" value={categories.length} accent="bg-gold/15 text-gold" />
        <StatCard icon={StarIcon} label="Best Seller" value={bestCount} accent="bg-ink text-cream" />
        <StatCard icon={SparklesIcon} label="New Arrival" value={newCount} accent="bg-brown text-cream" />
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-line/60 overflow-hidden">
        <div className="p-5 border-b border-line/60">
          <h2 className="font-display text-xl">Produk per Kategori</h2>
        </div>
        <div className="p-5 space-y-4">
          {categories.map((c) => {
            const count = products.filter((p) => p.kategori === c.id).length;
            const pct = products.length ? (count / products.length) * 100 : 0;
            return (
              <div key={c.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{c.nama}</span>
                  <span className="text-muted">{count} produk</span>
                </div>
                <div className="h-2 bg-cream-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
