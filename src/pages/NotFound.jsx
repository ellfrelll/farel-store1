import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-32 pb-20 min-h-[70vh] flex items-center">
      <div className="max-w-xl mx-auto text-center px-4">
        <div className="eyebrow text-gold mb-4">404</div>
        <h1 className="font-display text-6xl sm:text-7xl text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-4 text-muted">
          Sepertinya jam Anda kehilangan satu detik. Mari kembali ke beranda dan lanjut menjelajah.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link to="/" className="bg-ink text-cream px-6 py-3 rounded-full font-medium hover:bg-gold transition">
            Kembali ke Beranda
          </Link>
          <Link to="/products" className="border border-ink/20 px-6 py-3 rounded-full font-medium hover:bg-ink hover:text-cream transition">
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
