export default function SectionTitle({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <h2 className="font-display text-3xl sm:text-4xl text-ink">{title}</h2>
      {subtitle && <p className="mt-2 text-muted max-w-xl text-sm sm:text-base">{subtitle}</p>}
    </div>
  );
}
