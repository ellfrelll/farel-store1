import { Link } from "react-router-dom";
import { ShoppingBagIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon } from "@heroicons/react/24/solid";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "./Toast.jsx";
import { formatRupiah } from "../utils/format.js";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const wished = has(product.id);

  const discount = product.harga_asli > product.harga
    ? Math.round((1 - product.harga / product.harga_asli) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if ((product.stok ?? 0) === 0) {
      toast.error("Produk ini sedang habis stok");
      return;
    }
    add(product.id, 1);
    toast.success(`${product.nama} ditambahkan ke keranjang`);
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast.success(wished ? "Dihapus dari wishlist" : "Ditambahkan ke wishlist");
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="product-card group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-line/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-2">
        <img
          src={product.gambar}
          alt={product.nama}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.is_best_seller && (
            <span className="text-[10px] font-semibold bg-gold text-white px-2 py-0.5 rounded-full">
              🏆 Best Seller
            </span>
          )}
          {product.is_new_arrival && (
            <span className="text-[10px] font-semibold bg-ink text-cream px-2 py-0.5 rounded-full">
              ✨ New
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleWish}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          aria-label="Wishlist"
        >
          {wished
            ? <HeartSolid className="w-4 h-4 text-red-500" />
            : <HeartIcon className="w-4 h-4 text-muted" />}
        </button>
        {/* Quick Add */}
        <div className="card-actions absolute bottom-2 left-2 right-2">
          <button
            onClick={handleAdd}
            disabled={(product.stok ?? 0) === 0}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-medium bg-ink text-cream py-2 rounded-xl hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBagIcon className="w-4 h-4" />
            {(product.stok ?? 0) === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
          </button>
        </div>
      </div>
      <div className="p-3">
        <div className="text-[11px] text-muted mb-0.5">{product.brand}</div>
        <h3 className="font-display text-base leading-tight line-clamp-1 text-ink dark:text-slate-100">{product.nama}</h3>
        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <StarIcon className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs text-muted">{product.rating} ({product.reviews})</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <span className="text-ink dark:text-white font-semibold text-sm">{formatRupiah(product.harga)}</span>
          {discount > 0 && (
            <span className="text-xs text-muted line-through">{formatRupiah(product.harga_asli)}</span>
          )}
        </div>
        {(product.stok ?? 0) <= 10 && (product.stok ?? 0) > 0 && (
          <div className="text-[10px] text-orange-500 mt-1">Stok tersisa {product.stok}</div>
        )}
        {(product.stok ?? 0) === 0 && (
          <div className="text-[10px] text-red-500 mt-1 font-semibold">Stok habis</div>
        )}
      </div>
    </Link>
  );
}
