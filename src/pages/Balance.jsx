import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";
import { formatRupiah } from "../utils/format.js";
import { loadJSON, saveJSON } from "../utils/storage.js";

const TOPUPS = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];

export default function Balance() {
  const { user, isAuthenticated, addBalance } = useAuth();
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  const txKey = `dj_tx_${user?.uid}`;
  const [txs, setTxs] = useState(() => loadJSON(txKey, []));

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleTopUp = async () => {
    const amount = selected || parseInt(custom, 10);
    if (!amount || amount < 10000) { toast.error("Nominal minimal Rp10.000"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const newBal = addBalance(amount);
    const tx = { id: Date.now(), type: "topup", amount, balance: newBal, desc: "Top Up Saldo", date: new Date().toLocaleDateString("id-ID") };
    const updated = [tx, ...txs];
    setTxs(updated);
    saveJSON(txKey, updated);
    setSelected(null);
    setCustom("");
    setLoading(false);
    toast.success(`Top up ${formatRupiah(amount)} berhasil!`);
  };

  return (
    <div className="pt-24 pb-16 max-w-2xl mx-auto px-4">
      <h1 className="font-display text-3xl text-ink dark:text-white mb-8">Saldo Saya</h1>
      {/* Balance card */}
      <div className="bg-gradient-to-br from-ink to-brown dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 text-white mb-8">
        <div className="text-sm opacity-70 mb-2">Saldo tersedia</div>
        <div className="font-display text-4xl font-semibold">{formatRupiah(user?.balance || 0)}</div>
        <div className="mt-4 text-xs opacity-50">{user?.name || user?.username} · {user?.email}</div>
      </div>

      {/* Top Up */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-line dark:border-slate-700 p-6 mb-6">
        <h2 className="font-semibold text-ink dark:text-white mb-4">Top Up Saldo</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
          {TOPUPS.map(n => (
            <button
              key={n}
              onClick={() => { setSelected(n); setCustom(""); }}
              className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                selected === n
                  ? "bg-gold border-gold text-white"
                  : "border-line dark:border-slate-700 text-ink dark:text-white hover:border-gold"
              }`}
            >
              {n >= 1000000 ? `${n/1000000}JT` : `${n/1000}K`}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Nominal custom (min. 10.000)"
            value={custom}
            onChange={e => { setCustom(e.target.value); setSelected(null); }}
            className="flex-1 px-4 py-3 rounded-xl border border-line dark:border-slate-700 bg-cream dark:bg-slate-900 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button
          onClick={handleTopUp}
          disabled={loading || (!selected && !custom)}
          className="mt-4 w-full bg-gold text-white py-3 rounded-xl font-semibold hover:bg-gold-soft transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : `Top Up ${selected || custom ? formatRupiah(selected || parseInt(custom || 0)) : ""}`}
        </button>
        <p className="text-xs text-muted mt-2 text-center">Simulasi top up – siap connect ke Midtrans/Xendit</p>
      </div>

      {/* Transaction history */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-line dark:border-slate-700 p-6">
        <h2 className="font-semibold text-ink dark:text-white mb-4">Riwayat Transaksi</h2>
        {txs.length === 0 ? (
          <p className="text-sm text-muted text-center py-6">Belum ada transaksi</p>
        ) : (
          <div className="space-y-3">
            {txs.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-line dark:border-slate-700 last:border-0">
                <div>
                  <div className="text-sm font-medium text-ink dark:text-white">{tx.desc}</div>
                  <div className="text-xs text-muted">{tx.date}</div>
                </div>
                <div className={`text-sm font-semibold ${tx.type === "topup" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {tx.type === "topup" ? "+" : "-"}{formatRupiah(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
