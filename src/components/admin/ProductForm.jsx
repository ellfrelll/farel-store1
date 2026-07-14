import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const empty = { nama: "", harga: "", deskripsi: "", gambar: "", kategori: "", stok: 1, is_best_seller: false, is_new_arrival: false };

export default function ProductForm({ open, onClose, onSubmit, initial, categories }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { 
        ...empty, 
        ...initial, 
        harga: String(initial.harga ?? ""),
        stok: initial.stok ?? 1 
      } : empty);
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => change("gambar", reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.harga || isNaN(Number(form.harga))) e.harga = "Harga harus berupa angka";
    if (!form.deskripsi.trim()) e.deskripsi = "Deskripsi wajib diisi";
    if (!form.kategori) e.kategori = "Kategori wajib dipilih";
    if (!form.gambar) e.gambar = "Foto wajib dipilih";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, harga: Number(form.harga), stok: Number(form.stok) || 1 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto fade-up">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-line/60">
          <h3 className="font-display text-2xl">{initial ? "Edit Produk" : "Tambah Produk"}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-cream-2"><XMarkIcon className="w-5 h-5" /></button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nama Produk</label>
            <input value={form.nama} onChange={(e) => change("nama", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-line focus:outline-none focus:border-ink" />
            {errors.nama && <p className="text-xs text-red-600 mt-1">{errors.nama}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Harga (Rp)</label>
              <input type="number" value={form.harga} onChange={(e) => change("harga", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-line focus:outline-none focus:border-ink" />
              {errors.harga && <p className="text-xs text-red-600 mt-1">{errors.harga}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Stok</label>
              <input type="number" min="0" value={form.stok} onChange={(e) => change("stok", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-line focus:outline-none focus:border-ink" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Kategori</label>
            <select value={form.kategori} onChange={(e) => change("kategori", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-line focus:outline-none focus:border-ink bg-white">
              <option value="">Pilih kategori</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
            </select>
            {errors.kategori && <p className="text-xs text-red-600 mt-1">{errors.kategori}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={(e) => change("deskripsi", e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-line focus:outline-none focus:border-ink" />
            {errors.deskripsi && <p className="text-xs text-red-600 mt-1">{errors.deskripsi}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Foto Produk</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-cream-2 overflow-hidden shrink-0">
                {form.gambar && <img src={form.gambar} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
                <div className="text-xs text-muted mt-1">Atau tempel URL gambar:</div>
                <input value={form.gambar.startsWith("data:") ? "" : form.gambar} onChange={(e) => change("gambar", e.target.value)} placeholder="https://..." className="mt-1 w-full px-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-ink" />
              </div>
            </div>
            {errors.gambar && <p className="text-xs text-red-600 mt-1">{errors.gambar}</p>}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_best_seller} onChange={(e) => change("is_best_seller", e.target.checked)} />
              Best Seller
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_new_arrival} onChange={(e) => change("is_new_arrival", e.target.checked)} />
              New Arrival
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-line hover:bg-cream-2">Batal</button>
            <button type="submit" className="px-5 py-2.5 rounded-full bg-ink text-cream hover:bg-gold transition">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
