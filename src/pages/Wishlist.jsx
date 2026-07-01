import { Link } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useData } from "../context/DataContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Wishlist() {
  const { items } = useWishlist();
  const { products } = useData();
  const wished = products.filter(p => items.includes(p.id));

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink dark:text-white mb-8">Wishlist ({wished.length})</h1>
      {wished.length === 0 ? (
        <EmptyState
          icon={HeartIcon}
          title="Wishlist kosong"
          description="Tambahkan produk favorit kamu ke wishlist!"
          action={<Link to="/products" className="inline-flex items-center gap-2 bg-ink text-cream px-5 py-3 rounded-full font-medium hover:bg-gold transition">Jelajahi Produk</Link>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wished.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
