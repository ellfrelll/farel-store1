import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ShoppingBagIcon, ChevronLeftIcon, ShieldCheckIcon, TruckIcon,
  HeartIcon, StarIcon, MinusIcon, PlusIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useData } from "../context/DataContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useReviews } from "../hooks/useReviews.js";
import { useToast } from "../components/Toast.jsx";
import { formatRupiah } from "../utils/format.js";
import ProductCard from "../components/ProductCard.jsx";

const FAQ = [
  { q: "Apakah produk ini original?", a: "Ya, semua produk di di-jam-in 100% original dengan garansi resmi." },
  { q: "Berapa lama pengiriman?", a: "Pengiriman reguler 2-5 hari kerja. Ekspres tersedia untuk kota tertentu." },
  { q: "Apakah bisa dikembalikan?", a: "Ya, dalam 7 hari setelah penerimaan jika terdapat cacat produk." },
];

function formatReviewDate(createdAt) {
  const ms = createdAt?.toMillis ? createdAt.toMillis() : createdAt;
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function ReviewForm({ productId }) {
  const { user } = useAuth();
  const { addReview } = useReviews(productId);
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-line dark:border-slate-700 text-sm text-muted">
        <Link to="/login" className="text-gold font-medium hover:underline">Masuk</Link> terlebih dahulu untuk memberi ulasan.
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) { toast.error("Tulis ulasan kamu dulu ya"); return; }
    setSubmitting(true);
    try {
      await addReview({ name: user.name || user.username, rating, text: text.trim() });
      setText("");
      setRating(5);
      toast.success("Ulasan berhasil dikirim");
    } catch {
      toast.error("Gagal mengirim ulasan, coba lagi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-line dark:border-slate-700">
      <div className="text-sm font-semibold text-ink dark:text-white mb-2">Tulis Ulasan</div>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} bintang`}
          >
            <StarSolid className={`w-6 h-6 transition-colors ${n <= (hoverRating || rating) ? "text-gold" : "text-muted/30"}`} />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Bagaimana pengalaman kamu dengan produk ini?"
        className="w-full px-3 py-2.5 rounded-xl border border-line dark:border-slate-700 bg-cream dark:bg-slate-900 text-ink dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="mt-3 bg-ink dark:bg-gold text-cream dark:text-solid-dark px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gold dark:hover:bg-gold-soft transition disabled:opacity-60"
      >
        {submitting ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { products, categories } = useData();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const { reviews, loading: reviewsLoading } = useReviews(id);
  const [qty, setQty] = useState(1);
  const [faqOpen, setFaqOpen] = useState(null);

  const product = products.find(p => p.id === id);
  if (!product) return <Navigate to="/products" replace />;

  const cat = categories.find(c => c.id === product.kategori);
  const related = products.filter(p => p.kategori === product.kategori && p.id !== product.id).slice(0, 4);
  const wished = has(product.id);
  const discount = product.harga_asli > product.harga
    ? Math.round((1 - product.harga / product.harga_asli) * 100) : 0;

  const reviewCount = reviews.length || product.reviews || 0;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : (product.rating || 0);

  const handleAdd = () => {
    add(product.id, qty);
    toast.success(`${product.nama} (×${qty}) ditambahkan ke keranjang`);
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link to="/" className="hover:text-ink dark:hover:text-white transition">Beranda</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-ink dark:hover:text-white transition">Produk</Link>
        <span>/</span>
        <span className="text-ink dark:text-white truncate">{product.nama}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="space-y-3">
          <div className="rounded-3xl overflow-hidden bg-cream-2 dark:bg-slate-800 aspect-square">
            <img src={product.gambar} alt={product.nama} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {cat && <span className="text-xs uppercase tracking-wider bg-cream-2 dark:bg-slate-700 text-brown dark:text-slate-300 px-3 py-1 rounded-full">{cat.nama}</span>}
            {product.is_best_seller && <span className="text-xs uppercase tracking-wider bg-gold/15 text-brown dark:text-gold px-3 py-1 rounded-full">🏆 Best Seller</span>}
            {product.is_new_arrival && <span className="text-xs uppercase tracking-wider bg-ink dark:bg-slate-700 text-cream px-3 py-1 rounded-full">✨ New</span>}
            {discount > 0 && <span className="text-xs uppercase tracking-wider bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-bold">Hemat {discount}%</span>}
          </div>

          <div className="text-sm text-muted mb-1">{product.brand}</div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink dark:text-white leading-tight">{product.nama}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarSolid key={i} className={`w-4 h-4 ${i < Math.round(avgRating || 0) ? "text-gold" : "text-muted/30"}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-ink dark:text-white">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-muted">({reviewCount} ulasan)</span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink dark:text-white">{formatRupiah(product.harga)}</span>
            {discount > 0 && (
              <span className="text-lg text-muted line-through">{formatRupiah(product.harga_asli)}</span>
            )}
          </div>

          {/* Stock */}
          <div className={`mt-2 text-sm ${(product.stock || 0) <= 10 ? "text-orange-500" : "text-green-600 dark:text-green-400"}`}>
            {(product.stock || 0) > 0 ? `Stok: ${product.stock} tersedia` : "Stok habis"}
          </div>

          <p className="mt-5 text-muted dark:text-slate-400 leading-relaxed">{product.deskripsi}</p>

          {/* Qty */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-line dark:border-slate-700 rounded-full">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2.5 hover:bg-cream-2 dark:hover:bg-slate-700 rounded-l-full transition">
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-semibold text-ink dark:text-white w-10 text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))} className="p-2.5 hover:bg-cream-2 dark:hover:bg-slate-700 rounded-r-full transition">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-muted">Total: {formatRupiah(product.harga * qty)}</span>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-ink dark:bg-gold text-cream dark:text-solid-dark px-6 py-3 rounded-full font-medium hover:bg-gold dark:hover:bg-gold-soft transition"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              Tambah ke Keranjang
            </button>
            <button
              onClick={() => { toggle(product.id); toast.success(wished ? "Dihapus dari wishlist" : "Ditambahkan ke wishlist"); }}
              className="p-3 border border-line dark:border-slate-700 rounded-full hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              {wished ? <HeartSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5 text-muted" />}
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-muted">
            <div className="flex items-center gap-2"><TruckIcon className="w-5 h-5 text-gold" /> Gratis ongkir ≥ Rp200K</div>
            <div className="flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5 text-gold" /> Garansi resmi 1 tahun</div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink dark:text-white">Ulasan Pelanggan</h2>
          <span className="text-xs text-muted">Update realtime</span>
        </div>

        <div className="mb-4">
          <ReviewForm productId={id} />
        </div>

        {reviewsLoading ? (
          <div className="text-sm text-muted">Memuat ulasan...</div>
        ) : reviews.length === 0 ? (
          <div className="text-sm text-muted">Belum ada ulasan. Jadilah yang pertama memberi ulasan!</div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-line dark:border-slate-700">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(r.rating)].map((_, i) => <StarSolid key={i} className="w-4 h-4 text-gold" />)}
                </div>
                <p className="text-sm text-muted italic">"{r.text}"</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-semibold text-ink dark:text-white">{r.name}</span>
                  <span className="text-xs text-muted">{formatReviewDate(r.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="font-display text-2xl text-ink dark:text-white mb-6">FAQ</h2>
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-line dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full text-left px-5 py-4 font-medium text-ink dark:text-white flex items-center justify-between text-sm"
              >
                {f.q}
                <span className={`text-muted transition-transform ${faqOpen === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {faqOpen === i && (
                <div className="px-5 pb-4 text-sm text-muted slide-down">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-ink dark:text-white mb-6">Produk Serupa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
