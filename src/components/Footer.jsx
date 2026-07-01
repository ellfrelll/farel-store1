import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink dark:bg-slate-950 text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl text-white mb-3">
            <span className="text-gold">·</span>di-jam-in
          </div>
          <p className="text-sm text-white/60 leading-relaxed mb-4">
            Koleksi jam tangan pilihan untuk gaya yang melampaui waktu.
          </p>
          <div className="flex gap-3">
            {[
              ["IG", "https://instagram.com"],
              ["FB", "https://facebook.com"],
              ["WA", "https://wa.me/62882007294047"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white hover:bg-gold transition"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Belanja</h4>
          <ul className="space-y-2.5 text-sm">
            {[["Semua Produk", "/products"], ["Klasik", "/products?kategori=analog"], ["Sport", "/products?kategori=digital"], ["Professional", "/products?kategori=smartwatch"]].map(([l, to]) => (
              <li key={l}><Link to={to} className="hover:text-gold transition">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Bantuan</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/cart" className="hover:text-gold transition">Keranjang</Link></li>
            <li><Link to="/orders" className="hover:text-gold transition">Pesanan</Link></li>
            <li><Link to="/wishlist" className="hover:text-gold transition">Wishlist</Link></li>
            <li><a href="https://wa.me/62882007294047" target="_blank" rel="noreferrer" className="hover:text-gold transition">Customer Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Kontak</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>📱 <a href="https://wa.me/62882007294047" className="hover:text-gold">+62 882-0072-94047</a></li>
            <li>✉️ <a href="mailto:cs@dijamin.com" className="hover:text-gold">cs@dijamin.com</a></li>
            <li>📍 Jakarta, Indonesia</li>
            <li>🕐 Senin – Sabtu, 09.00 – 18.00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-white/40 flex flex-col sm:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} di-jam-in. All rights reserved.</div>
          <div>Dibuat dengan ketelitian, untuk yang menghargai waktu.</div>
        </div>
      </div>
    </footer>
  );
}
