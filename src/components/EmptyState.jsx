export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-20 px-4">
      {Icon && (
        <div className="mx-auto w-14 h-14 rounded-full bg-cream-2 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-brown-2" />
        </div>
      )}
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      {description && <p className="text-muted mt-2 max-w-md mx-auto text-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
