'use client';
import { useEffect } from 'react';

export default function AccountError({ error, reset }) {
  useEffect(() => {
    console.error('[account/error.jsx]', error);
  }, [error]);

  return (
    <div style={{ maxWidth: 720, margin: '120px auto', padding: '0 20px', color: '#eee' }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Личный кабинет временно недоступен</h1>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        Произошла ошибка при загрузке страницы. Попробуй обновить, или напиши нам — пришлём ссылку
        на твои брони вручную.
      </p>
      <pre
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: 12,
          borderRadius: 8,
          fontSize: 12,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          marginBottom: 16,
        }}
      >
        {error?.message || 'Unknown error'}
        {error?.digest ? `\n\ndigest: ${error.digest}` : ''}
      </pre>
      <button
        onClick={() => reset()}
        style={{
          padding: '10px 18px',
          background: '#c9a96e',
          color: '#1a1a1a',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Попробовать снова
      </button>
    </div>
  );
}
