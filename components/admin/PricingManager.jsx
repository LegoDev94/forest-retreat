'use client';
import { useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
  updateCottagePrice,
  addPriceOverride,
  removePriceOverride,
} from '../../app/actions/admin';

const fmtDate = (s) => new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
const today = () => new Date().toISOString().slice(0, 10);

function PriceUpdateForm({ cottage }) {
  const [state, action] = useFormState(updateCottagePrice, null);
  const { pending } = useFormStatus();
  return (
    <form action={action} className="pricing-row">
      <input type="hidden" name="id" value={cottage.id} />
      <div className="pricing-row-name">
        <span className="admin-pill">{cottage.id}</span>
        <span>{cottage.name_ru}</span>
      </div>
      <div className="pricing-row-price">
        <input
          type="number"
          name="price"
          min={1}
          max={9999}
          defaultValue={cottage.price_per_night}
          className="admin-input pricing-input"
          required
        />
        <span>€ / ночь</span>
        <SaveBtn />
      </div>
      {state?.error && <span className="admin-error pricing-msg">{state.error}</span>}
      {state?.ok && <span className="admin-ok pricing-msg">Сохранено</span>}
    </form>
  );
}
function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn admin-btn-sm admin-btn-primary" disabled={pending}>
      {pending ? '…' : 'Сохранить'}
    </button>
  );
}

function OverrideForm({ cottages }) {
  const [state, action] = useFormState(addPriceOverride, null);
  return (
    <form action={action} className="admin-form-inline">
      <label className="admin-label">
        <span>Дом</span>
        <select name="cottage_id" required className="admin-input">
          {cottages.map((c) => <option key={c.id} value={c.id}>{c.name_ru}</option>)}
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
      <label className="admin-label">
        <span>Цена € / ночь</span>
        <input type="number" name="price" required min={1} max={9999} className="admin-input" placeholder="например 200" />
      </label>
      <label className="admin-label admin-label-grow">
        <span>Заметка</span>
        <input type="text" name="note" className="admin-input" placeholder="высокий сезон / праздники" />
      </label>
      <OverrideSubmit />
      {state?.error && <div className="admin-error" style={{ width: '100%' }}>{state.error}</div>}
      {state?.ok && <div className="admin-ok" style={{ width: '100%' }}>Применено к {state.count} {state.count === 1 ? 'дню' : 'дням'}.</div>}
    </form>
  );
}
function OverrideSubmit() {
  const { pending } = useFormStatus();
  return <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>{pending ? 'Сохраняем…' : 'Применить'}</button>;
}

export default function PricingManager({ cottages, overrides }) {
  const [pending, startTransition] = useTransition();

  const remove = (id) => {
    if (!confirm('Снять надбавку?')) return;
    startTransition(() => removePriceOverride(id));
  };

  // Group overrides by cottage
  const grouped = overrides.reduce((acc, o) => {
    (acc[o.cottage_id] ||= []).push(o);
    return acc;
  }, {});

  return (
    <>
      <section className="admin-section">
        <h2>Базовые цены</h2>
        <div className="pricing-list">
          {cottages.map((c) => <PriceUpdateForm key={c.id} cottage={c} />)}
        </div>
      </section>

      <section className="admin-section">
        <h2>Сезонная надбавка</h2>
        <p className="admin-sub" style={{ margin: '0 0 14px' }}>
          Установи альтернативную цену на диапазон дат — например на праздники или высокий сезон. Применяется автоматически при бронировании.
        </p>
        <OverrideForm cottages={cottages} />
      </section>

      <section className="admin-section">
        <h2>Активные надбавки</h2>
        {Object.keys(grouped).length === 0 ? (
          <div className="admin-empty">Нет активных надбавок — все даты по базовой цене.</div>
        ) : (
          Object.entries(grouped).map(([cottage, items]) => (
            <div key={cottage} className="admin-block-group">
              <h3 className="admin-block-cottage">
                <span className="admin-pill">{cottage}</span>
                <span className="admin-count">· {items.length} {items.length === 1 ? 'день' : 'дней'}</span>
              </h3>
              <ul className="admin-block-list">
                {items.map((o) => (
                  <li key={o.id}>
                    <span className="admin-block-date">{fmtDate(o.date)}</span>
                    <span className="pricing-override-amount">{o.price_override} € / ночь</span>
                    {o.note && <span className="admin-block-note">{o.note}</span>}
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      disabled={pending}
                      onClick={() => remove(o.id)}
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
