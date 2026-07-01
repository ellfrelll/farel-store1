export default function Loading({ label = "Memuat..." }) {
  return (
    <div className="flex items-center justify-center py-20 text-muted text-sm">
      <span className="inline-block w-5 h-5 border-2 border-ink/20 border-t-gold rounded-full animate-spin mr-3" />
      {label}
    </div>
  );
}
