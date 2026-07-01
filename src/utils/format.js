export const formatRupiah = (n) =>
  "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(Number(n) || 0));
