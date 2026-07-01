import { useMemo, useState } from "react";
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useData } from "../../context/DataContext.jsx";
import { useToast } from "../../components/Toast.jsx";
import { formatRupiah } from "../../utils/format.js";
import ProductForm from "../../components/admin/ProductForm.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { CubeIcon } from "@heroicons/react/24/outline";

export default function ProductsAdmin() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useData();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = filter === "all" || p.kategori === filter;
      const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, search, filter]);

  const handleSubmit = (data) => {
    try {
      if (editing) {
        updateProduct(editing.id, data);
        toast.success("Produk berhasil diperbarui");
      } else {
        addProduct(data);
        toast.success("Produk berhasil ditambahkan");
      }
      setOpen(false);
      setEditing(null);
    } catch {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = () => {
    deleteProduct(confirm.id);
    toast.success("Produk berhasil dihapus");
    setConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl">Manajemen Produk</h1>
          <p className="text-muted text-sm">Kelola katalog jam tangan toko Anda.</p>
        </div>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 bg-ink text-cream px-5 py-2.5 rounded-full hover:bg-gold transition">
          <PlusIcon className="w-5 h-5" /> Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line/60 p-4 flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk..." className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line focus:outline-none focus:border-ink" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-line bg-white focus:outline-none focus:border-ink">
          <option value="all">Semua Kategori</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-line/60 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8"><EmptyState icon={CubeIcon} title="Tidak ada produk" description="Coba ubah pencarian atau filter Anda." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-2/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Foto</th>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Harga</th>
                  <th className="px-4 py-3 font-medium">Best</th>
                  <th className="px-4 py-3 font-medium">New</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const cat = categories.find((c) => c.id === p.kategori);
                  return (
                    <tr key={p.id} className="border-t border-line/60 hover:bg-cream/40">
                      <td className="px-4 py-3"><img src={p.gambar} alt={p.nama} className="w-12 h-12 rounded-lg object-cover" /></td>
                      <td className="px-4 py-3 font-medium">{p.nama}</td>
                      <td className="px-4 py-3 text-muted">{cat?.nama || "-"}</td>
                      <td className="px-4 py-3">{formatRupiah(p.harga)}</td>
                      <td className="px-4 py-3">{p.is_best_seller ? <span className="text-gold">●</span> : <span className="text-line">○</span>}</td>
                      <td className="px-4 py-3">{p.is_new_arrival ? <span className="text-gold">●</span> : <span className="text-line">○</span>}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button onClick={() => { setEditing(p); setOpen(true); }} className="p-2 rounded-lg hover:bg-cream-2" aria-label="Edit"><PencilSquareIcon className="w-4 h-4" /></button>
                          <button onClick={() => setConfirm(p)} className="p-2 rounded-lg hover:bg-red-50 text-red-600" aria-label="Hapus"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductForm open={open} onClose={() => { setOpen(false); setEditing(null); }} onSubmit={handleSubmit} initial={editing} categories={categories} />
      <ConfirmDialog
        open={!!confirm}
        title="Hapus produk?"
        description={`"${confirm?.nama}" akan dihapus permanen.`}
        onCancel={() => setConfirm(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
