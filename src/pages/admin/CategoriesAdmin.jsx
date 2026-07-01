import { useState } from "react";
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, TagIcon } from "@heroicons/react/24/outline";
import { useData } from "../../context/DataContext.jsx";
import { useToast } from "../../components/Toast.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import EmptyState from "../../components/EmptyState.jsx";

export default function CategoriesAdmin() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useData();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [nama, setNama] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null);

  const openAdd = () => { setEditing(null); setNama(""); setError(""); setOpen(true); };
  const openEdit = (c) => { setEditing(c); setNama(c.nama); setError(""); setOpen(true); };

  const submit = (e) => {
    e.preventDefault();
    const v = nama.trim();
    if (!v) { setError("Nama kategori wajib diisi"); return; }
    const duplicate = categories.some((c) => c.nama.toLowerCase() === v.toLowerCase() && c.id !== editing?.id);
    if (duplicate) { setError("Kategori sudah ada"); return; }
    try {
      if (editing) {
        updateCategory(editing.id, { nama: v });
        toast.success("Kategori diperbarui");
      } else {
        addCategory({ nama: v });
        toast.success("Kategori ditambahkan");
      }
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = () => {
    deleteCategory(confirm.id);
    toast.success("Kategori dihapus");
    setConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl">Manajemen Kategori</h1>
          <p className="text-muted text-sm">Atur kategori jam tangan toko Anda.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-ink text-cream px-5 py-2.5 rounded-full hover:bg-gold transition">
          <PlusIcon className="w-5 h-5" /> Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line/60 overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8"><EmptyState icon={TagIcon} title="Belum ada kategori" description="Tambahkan kategori untuk mengelompokkan produk." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-2/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama Kategori</th>
                  <th className="px-4 py-3 font-medium">Jumlah Produk</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => {
                  const count = products.filter((p) => p.kategori === c.id).length;
                  return (
                    <tr key={c.id} className="border-t border-line/60 hover:bg-cream/40">
                      <td className="px-4 py-3 font-medium">{c.nama}</td>
                      <td className="px-4 py-3 text-muted">{count} produk</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-cream-2"><PencilSquareIcon className="w-4 h-4" /></button>
                          <button onClick={() => setConfirm(c)} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><TrashIcon className="w-4 h-4" /></button>
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md fade-up">
            <div className="flex items-center justify-between p-5 border-b border-line/60">
              <h3 className="font-display text-2xl">{editing ? "Edit Kategori" : "Tambah Kategori"}</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-cream-2"><XMarkIcon className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nama Kategori</label>
                <input value={nama} onChange={(e) => setNama(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-line focus:outline-none focus:border-ink" />
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 rounded-full border border-line hover:bg-cream-2">Batal</button>
                <button type="submit" className="px-5 py-2.5 rounded-full bg-ink text-cream hover:bg-gold transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Hapus kategori?"
        description={`Kategori "${confirm?.nama}" akan dihapus.`}
        onCancel={() => setConfirm(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
