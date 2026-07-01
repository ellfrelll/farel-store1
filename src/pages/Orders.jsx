import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";
import { formatRupiah } from "../utils/format.js";
import EmptyState from "../components/EmptyState.jsx";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

const STATUS_LABELS = {
  pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  processing: { label: "Diproses", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  shipped: { label: "Dikirim", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  done: { label: "Selesai", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const { getUserOrders } = useOrders();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const orders = getUserOrders(user.uid);

  return (
    <div className="pt-24 pb-16 max-w-3xl mx-auto px-4">
      <h1 className="font-display text-3xl text-ink dark:text-white mb-8">Riwayat Pesanan</h1>
      {orders.length === 0 ? (
        <EmptyState icon={ClipboardDocumentListIcon} title="Belum ada pesanan" description="Pesanan Anda akan muncul di sini setelah checkout." />
      ) : (
        <div className="space-y-4">
          {orders.map(o => {
            const s = STATUS_LABELS[o.status] || STATUS_LABELS.pending;
            return (
              <div key={o.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-line dark:border-slate-700 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-ink dark:text-white">{o.id}</span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.color}`}>{s.label}</span>
                </div>
                <div className="text-sm text-muted">{new Date(o.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })}</div>
                <div className="mt-3 font-semibold text-ink dark:text-white">{formatRupiah(o.total)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
