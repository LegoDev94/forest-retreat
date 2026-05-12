'use client';
import { useState, useTransition } from 'react';
import { triggerLodgifySync } from '../../app/actions/admin';

export default function SyncLodgifyButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  const onClick = () => {
    setResult(null);
    startTransition(async () => {
      const r = await triggerLodgifySync();
      setResult(r);
    });
  };

  const summary = (() => {
    if (!result) return null;
    if (!result.ok) return `Ошибка: ${result.error || 'неизвестно'}`;
    const parts = [];
    if (result.inserted != null) parts.push(`новых: ${result.inserted}`);
    if (result.updated != null)  parts.push(`обновлено: ${result.updated}`);
    if (result.errors?.length)   parts.push(`сбоев: ${result.errors.length}`);
    if (result.ms != null)       parts.push(`${result.ms} мс`);
    return parts.join(' · ') || 'готово';
  })();

  return (
    <div className="admin-sync-row">
      <button
        type="button"
        className="admin-btn admin-btn-sm admin-btn-primary"
        onClick={onClick}
        disabled={pending}
      >
        {pending ? 'Синхронизация…' : 'Sync now (Lodgify)'}
      </button>
      {summary && (
        <span className={`admin-sync-result${result?.ok ? '' : ' is-error'}`}>{summary}</span>
      )}
    </div>
  );
}
