export const WHATSAPP_NUMBER = "62882007294047";

import { formatRupiah } from "./format.js";

export function buildCheckoutMessage(items, products) {
  const lines = items
    .map((it) => {
      const p = products.find((x) => x.id === it.id);
      if (!p) return null;
      return `- ${p.nama} x${it.qty}`;
    })
    .filter(Boolean);

  const total = items.reduce((sum, it) => {
    const p = products.find((x) => x.id === it.id);
    return sum + (p ? p.harga * it.qty : 0);
  }, 0);

  return [
    "Halo, saya ingin memesan:",
    "",
    ...lines,
    "",
    "Total:",
    formatRupiah(total),
    "",
    "Terima kasih.",
  ].join("\n");
}

export function openWhatsAppCheckout(items, products) {
  const msg = buildCheckoutMessage(items, products);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}
