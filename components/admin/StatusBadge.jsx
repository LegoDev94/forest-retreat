const LABELS = {
  pending:   { label: 'Ожидает',     cls: 'pending' },
  confirmed: { label: 'Подтверждена', cls: 'confirmed' },
  cancelled: { label: 'Отменена',    cls: 'cancelled' },
  completed: { label: 'Завершена',   cls: 'completed' },
};

export default function StatusBadge({ status }) {
  const meta = LABELS[status] || { label: status, cls: 'pending' };
  return <span className={`admin-status admin-status-${meta.cls}`}>{meta.label}</span>;
}
