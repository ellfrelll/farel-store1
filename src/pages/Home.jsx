import { Link } from "react-router-dom";
import { ArrowRightIcon, TruckIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useData } from "../context/DataContext.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import ProductCard from "../components/ProductCard.jsx";

const BRANDS = ["Rolex Submariner", "Rolex Daytona", "Rolex Datejust", "Rolex GMT-Master II", "Rolex Oyster Perpetual", "Rolex Sky-Dweller", "Rolex Day-Date", "Rolex Explorer"];

const TESTIMONIALS = [
  { name: "Budi S.", rating: 5, text: "Kualitasnya luar biasa, packaging juga sangat rapi. Recommended banget!", avatar: "B" },
  { name: "Rina M.", rating: 5, text: "Rolex Datejust-nya persis seperti foto, bahkan lebih bagus. Cepat sampai!", avatar: "R" },
  { name: "Dani P.", rating: 5, text: "Rolex Submariner-nya keren banget, finishing halus dan harga reasonable.", avatar: "D" },
];

export default function Home() {
  const { products, categories } = useData();

  const bestSellers = products.filter(p => p.is_best_seller).slice(0, 4);
  const newArrivals = products.filter(p => p.is_new_arrival).slice(0, 4);

  const catImgs = {
    analog: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
    digital: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
    smartwatch: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80",
  };

  return (
    <div className="pt-16">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-up">
            <div className="eyebrow mb-4">Koleksi Premium 2026</div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-ink dark:text-white">
              Waktu yang <span className="text-gold italic">elegan</span>,<br />
              di pergelangan Anda.
            </h1>
            <p className="mt-6 text-muted text-base sm:text-lg max-w-md leading-relaxed">
              Koleksi Rolex pilihan — ikonik, presisi, dan abadi — dikurasi
              dengan rasa, dikirim dengan cepat ke seluruh Indonesia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-ink dark:bg-gold text-cream dark:text-solid-dark px-6 py-3 rounded-full font-medium hover:bg-gold transition-colors"
              >
                Belanja Sekarang <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/products?kategori=digital"
                className="inline-flex items-center gap-2 border border-ink/20 dark:border-white/20 text-ink dark:text-white px-6 py-3 rounded-full font-medium hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-solid-dark transition-colors"
              >
                Lihat Koleksi Sport
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gold/10 rounded-[2.5rem] -rotate-3" />
            <img
              src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900&q=80"
              alt="Koleksi jam tangan Rolex premium di-jam-in"
              className="relative w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── Brand Logos ── */}
      <section className="bg-white dark:bg-slate-900 border-y border-line dark:border-slate-800 py-6 overflow-hidden">
        <div className="flex gap-8 items-center animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <Link key={i} to={`/products?q=${encodeURIComponent(b)}`} className="text-sm font-semibold tracking-widest uppercase text-muted hover:text-gold transition shrink-0 px-4">
              {b}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Best Seller ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <SectionTitle eyebrow="Terlaris" title="Best Seller" subtitle="Pilihan paling dicari pelanggan kami." />
          <Link to="/products" className="text-sm font-medium text-ink dark:text-slate-200 hover:text-gold flex items-center gap-1">
            Semua produk <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Kategori ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SectionTitle eyebrow="Jelajahi" title="Kategori" align="center" />
        <div className="grid sm:grid-cols-3 gap-5 mt-8">
          {categories.map(c => (
            <Link
              key={c.id}
              to={`/products?kategori=${c.id}`}
              className="relative group overflow-hidden rounded-3xl aspect-[4/3]"
            >
              <img
                src={catImgs[c.id] || "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80"}
                alt={c.nama}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="eyebrow text-gold mb-1">Koleksi</div>
                <h3 className="font-display text-2xl">{c.nama}</h3>
                <span className="mt-2 inline-flex items-center text-xs text-white/70 group-hover:text-white transition gap-1">
                  Lihat Semua <ArrowRightIcon className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-ink dark:bg-slate-800 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-gold/20 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-5 relative">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <TruckIcon className="w-7 h-7 text-gold" />
            </div>
            <div>
              <div className="eyebrow text-gold mb-1">Promo Aktif</div>
              <h3 className="font-display text-2xl sm:text-3xl text-white">Gratis Ongkir Belanja ≥ Rp200.000</h3>
              <p className="text-white/60 text-sm mt-1">Berlaku ke seluruh Indonesia, tanpa minimum kuantitas.</p>
            </div>
          </div>
          <Link to="/products" className="relative bg-gold text-white px-7 py-3 rounded-full font-semibold hover:bg-gold-soft transition shrink-0">
            Belanja Sekarang
          </Link>
        </div>
      </section>

      {/* ── New Arrival ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <SectionTitle eyebrow="Baru Tiba" title="New Arrival" subtitle="Koleksi terbaru untuk gaya terkini." />
          <Link to="/products" className="text-sm font-medium text-ink dark:text-slate-200 hover:text-gold flex items-center gap-1">
            Lihat semua <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Mengapa Kami ── */}
      <section className="bg-cream-2 dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Keunggulan" title="Mengapa Memilih Kami?" align="center" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[
              { icon: ShieldCheckIcon, title: "Original 100%", desc: "Semua produk bergaransi resmi dan terjamin keasliannya." },
              { icon: TruckIcon, title: "Gratis Ongkir", desc: "Ongkos kirim gratis untuk pembelian di atas Rp200.000." },
              { icon: StarSolid, title: "Kualitas Premium", desc: "Dikurasi dari brand ternama dengan kualitas terjamin." },
              { icon: ChatBubbleLeftRightIcon, title: "CS 24 Jam", desc: "Tim kami siap membantu kapan pun Anda butuhkan." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-semibold text-ink dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimoni ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionTitle eyebrow="Ulasan" title="Kata Pelanggan" align="center" />
        <div className="grid sm:grid-cols-3 gap-6 mt-10">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-line dark:border-slate-700">
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => <StarSolid key={i} className="w-4 h-4 text-gold" />)}
              </div>
              <p className="text-sm text-muted leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">
                  {t.avatar}
                </div>
                <div className="text-sm font-semibold text-ink dark:text-white">{t.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-ink dark:bg-slate-900 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="eyebrow text-gold mb-3">Newsletter</div>
          <h2 className="font-display text-3xl text-white mb-4">Dapatkan Penawaran Eksklusif</h2>
          <p className="text-white/60 text-sm mb-6">Daftar sekarang dan dapatkan diskon 10% untuk pembelian pertama.</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Email kamu..."
              className="flex-1 px-4 py-3 rounded-full text-sm bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold"
            />
            <button className="bg-gold text-white px-5 py-3 rounded-full font-medium hover:bg-gold-soft transition text-sm whitespace-nowrap">
              Daftar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
