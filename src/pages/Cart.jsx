import { Link, useNavigate } from "react-router-dom";
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext.jsx";
import { useData } from "../context/DataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../components/Toast.jsx";
import { formatRupiah } from "../utils/format.js";
import { openWhatsAppCheckout } from "../utils/whatsapp.js";
import EmptyState from "../components/EmptyState.jsx";
import { loadJSON, saveJSON } from "../utils/storage.js";

export default function Cart() {
  const { items, inc, dec, remove, clear } = useCart();
  const { products, updateProduct } = useData();
  const { user, isAuthenticated, deductBalance } = useAuth();
  const { addOrder } = useOrders();
  const { remove: removeFromWishlist } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();

  const detailed = items
    .map(it => { const p = products.find(x => x.id === it.id); return p ? { ...it, product: p, subtotal: p.harga * it.qty } : null; })
    .filter(Boolean);

  const total = detailed.reduce((s, it) => s + it.subtotal, 0);
  const shipping = total >= 200000 ? 0 : 15000;

  const handlePayWithBalance = () => {
    if (!isAuthenticated) { toast.error("Silakan login terlebih dahulu."); navigate("/login"); return; }
    const grandTotal = total + shipping;
    const result = deductBalance(grandTotal);
    if (!result.ok) { toast.error(result.error); navigate("/balance"); return; }
    
    // Kurangi stok produk dan hapus dari wishlist
    detailed.forEach(item => {
      const currentProduct = products.find(p => p.id === item.product.id);
      if (currentProduct) {
        const newStok = (currentProduct.stok || 0) - item.qty;
        updateProduct(item.product.id, { stok: Math.max(0, newStok) });
      }
      // Hapus dari wishlist kalau ada
      removeFromWishlist(item.product.id);
    });
    
    const order = addOrder({ uid: user.uid, items: detailed.map(i => ({ id: i.product.id, nama: i.product.nama, qty: i.qty, harga: i.product.harga })), total: grandTotal });
    const txKey = `dj_tx_${user.uid}`;
    const txs = loadJSON(txKey, []);
    saveJSON(txKey, [{ id: Date.now(), type: "payment", amount: grandTotal, desc: `Pesanan ${order.id}`, date: new Date().toLocaleDateString("id-ID") }, ...txs]);
    clear();
    toast.success(`Pembayaran berhasil! Pesanan ${order.id} sedang diproses.`);
    navigate("/orders");
  };

  if (detailed.length === 0) {
    return (
      <div className="pt-24 max-w-3xl mx-auto px-4">
        <EmptyState
          icon={ShoppingBagIcon}
          title="Keranjang Anda kosong"
          description="Yuk pilih jam tangan favorit dan kembali ke sini untuk checkout."
          action={<Link to="/products" className="inline-flex items-center gap-2 bg-ink text-cream px-5 py-3 rounded-full font-medium hover:bg-gold transition">Mulai Belanja</Link>}
        />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl mb-8 text-ink dark:text-white">Keranjang</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {detailed.map(({ product, qty, subtotal }) => (
            <div key={product.id} className="flex gap-4 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-line dark:border-slate-700">
              <Link to={`/products/${product.id}`} className="w-20 h-20 rounded-xl overflow-hidden bg-cream-2 dark:bg-slate-700 shrink-0">
                <img src={product.gambar} alt={product.nama} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product.id}`} className="font-display text-base hover:text-gold transition block truncate text-ink dark:text-white">{product.nama}</Link>
                <div className="text-xs text-muted">{product.brand}</div>
                <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                  <div className="inline-flex items-center border border-line dark:border-slate-700 rounded-full">
                    <button onClick={() => dec(product.id)} className="p-1.5 hover:bg-cream-2 dark:hover:bg-slate-700 rounded-l-full"><MinusIcon className="w-3.5 h-3.5" /></button>
                    <span className="px-3 text-sm font-medium text-ink dark:text-white w-7 text-center">{qty}</span>
                    <button onClick={() => inc(product.id)} className="p-1.5 hover:bg-cream-2 dark:hover:bg-slate-700 rounded-r-full"><PlusIcon className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink dark:text-white">{formatRupiah(subtotal)}</span>
                    <button onClick={() => remove(product.id)} className="text-muted hover:text-red-600 p-1.5"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-line dark:border-slate-700 h-fit sticky top-20">
          <h2 className="font-display text-2xl mb-4 text-ink dark:text-white">Ringkasan</h2>
          <div className="space-y-2 text-sm text-muted mb-4">
            <div className="flex justify-between"><span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} item)</span><span>{formatRupiah(total)}</span></div>
            <div className="flex justify-between"><span>Pengiriman</span><span>{shipping === 0 ? <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span> : formatRupiah(shipping)}</span></div>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-line dark:border-slate-700 pt-3 mb-5 text-ink dark:text-white">
            <span>Total</span>
            <span>{formatRupiah(total + shipping)}</span>
          </div>
          {user && (
            <div className="mb-3 text-xs text-center text-muted">
              Saldo: <span className="font-semibold text-ink dark:text-white">{formatRupiah(user.balance || 0)}</span>
            </div>
          )}
          <button
            onClick={handlePayWithBalance}
            className="w-full bg-gold text-white py-3 rounded-full font-semibold hover:bg-gold-soft transition mb-2"
          >
            Bayar dengan Saldo
          </button>
          <button
            onClick={() => openWhatsAppCheckout(items, products)}
            className="w-full bg-ink dark:bg-slate-700 text-white py-3 rounded-full font-medium hover:bg-gold transition"
          >
            Checkout via WhatsApp
          </button>
          <Link to="/products" className="block mt-3 text-center text-xs text-muted hover:text-ink dark:hover:text-white">Lanjut belanja</Link>
        </aside>
      </div>
    </div>
  );
}
