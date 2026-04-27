'use client';
import { useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addDateBlock, removeDateBlock } from '../../app/actions/admin';

const fmt = (s) => new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
const today = () => new Date().toISOString().slice(0, 10);

function SubmitBtn() {
  const { pending } = useFormStatus();
  return <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>{pending ? 'Сохраняем…' : 'Заблокировать'}</button>;
}

export default function BlocksManager({ cottages, initialBlocks }) {
  const [state, formAction] = useFormState(addDateBlock, null);
  const [pending, startTransition] = useTransition();

  const remove = (id) => {
    if (!confirm('Снять блокировку?')) return;
    startTransition(() => removeDateBlock(id));
  };

  // Group by cottage for display
  const grouped = initialBlocks.reduce((acc, b) => {
    (acc[b.cottage_id] ||= []).push(b);
    return acc;
  }, {});

  return (
    <>
      <section className="admin-section">
        <h2>Добавить блокировку</h2>
        <form action={formAction} className="admin-form-inline">
          <label className="admin-label">
            <span>Дом</span>
            <select name="cottage_id" required className="admin-input">
              {cottages.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="admin-label">
            <span>С</span>
            <input type="date" name="from_date" required min={today()} className="admin-input" />
          </label>
          <label className="admin-label">
            <span>По (включительно)</span>
            <input type="date" name="to_date" required min={today()} className="admin-input" />
          </label>
          <label className="admin-label admin-label-grow">
            <span>Заметка</span>
            <input type="text" name="note" placeholder="ремонт / личное / семья" className="admin-input" />
          </label>
          <SubmitBtn />
        </form>
        {state?.error && <div className="admin-error" style={{ marginTop: 8 }}>{state.error}</div>}
        {state?.ok && <div className="admin-ok" style={{ marginTop: 8 }}>Заблокировано {state.count} {state.count === 1 ? 'день' : 'дней'}.</div>}
      </section>

      <section className="admin-section">
        <h2>Активные блокировки</h2>
        {Object.keys(grouped).length === 0 ? (
          <div className="admin-empty">Нет активных блокировок.</div>
        ) : (
          Object.entries(grouped).map(([cottage, items]) => (
            <div key={cottage} className="admin-block-group">
              <h3 className="admin-block-cottage">
                <span className="admin-pill">{cottage}</span>
                <span className="admin-count">· {items.length} {items.length === 1 ? 'день' : 'дней'}</span>
              </h3>
              <ul className="admin-block-list">
                {items.map((b) => (
                  <li key={b.id}>
                    <span className="admin-block-date">{fmt(b.date)}</span>
                    {b.note && <span className="admin-block-note">{b.note}</span>}
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      disabled={pending}
                      onClick={() => remove(b.id)}
                    >×</button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </>
  );
}
