'use client';
import { useState, useTransition } from 'react';
import { createTestPayment } from '../../app/actions/admin';

export default function TestPaymentButton({ everypayMode }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  const onClick = () => {
    setResult(null);
    startTransition(async () => {
      const r = await createTestPayment();
      setResult(r);
    });
  };

  const isProd = everypayMode === 'production';
  return (
    <section className="admin-test-pay">
      <div className="admin-test-pay-head">
        <div>
          <div className="admin-test-pay-title">Тест EveryPay · €1</div>
          <div className="admin-test-pay-mode">
            Текущий режим:{' '}
            <strong className={`admin-test-pay-badge admin-test-pay-${isProd ? 'prod' : 'demo'}`}>
              {isProd ? 'PRODUCTION' : 'DEMO'}
            </strong>
          </div>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={onClick}
          disabled={pending}
        >
          {pending ? 'Создаём платёж…' : 'Пробить €1'}
        </button>
      </div>

      {result && (
        <div className={`admin-test-pay-result${result.ok ? '' : ' is-error'}`}>
          {result.ok ? (
            <>
              ✓ Платёж создан · ref:{' '}
              <code className="admin-mono">{result.payment_reference}</code>
              <br />
              <a
                href={result.pay_url}
                target="_blank"
                rel="noreferrer"
                className="admin-link"
              >
                Открыть форму оплаты →
              </a>
            </>
          ) : (
            <>✕ {result.error}</>
          )}
        </div>
      )}
    </section>
  );
}
