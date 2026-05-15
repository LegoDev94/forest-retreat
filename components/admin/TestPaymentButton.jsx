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
            <>
              <div>✕ {result.error}</div>
              {result.diagnostics && (
                <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85, lineHeight: 1.6 }}>
                  <div>Mode: <code>{result.diagnostics.mode}</code></div>
                  <div>API username: <code>{result.diagnostics.api_username || '(empty)'}</code></div>
                  <div>Account name: <code>{result.diagnostics.account_name}</code></div>
                  <div>API secret length: <code>{result.diagnostics.api_secret_len}</code> chars</div>
                  <div style={{ marginTop: 6, opacity: 0.7 }}>
                    401 обычно значит: креды от demo-портала прописаны при{' '}
                    <code>EVERYPAY_MODE=production</code> (или наоборот),
                    либо аккаунт ещё не активирован в боевом окружении.
                    Полное тело ответа EveryPay → Vercel → Project → Logs.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
