'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '../../app/actions/account';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary account-submit" disabled={pending}>
      {pending ? 'Входим…' : 'Войти'}
    </button>
  );
}

export default function LoginForm({ locale, prefillPhone = '' }) {
  const [state, action] = useFormState(loginAction, { error: null });
  return (
    <form action={action} className="account-form">
      <input type="hidden" name="locale" value={locale} />
      <label className="account-label">
        <span>Телефон</span>
        <input
          type="tel"
          name="phone"
          autoComplete="username"
          required
          defaultValue={prefillPhone}
          className="account-input"
          placeholder="+371…"
        />
      </label>
      <label className="account-label">
        <span>Пароль</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="account-input"
        />
      </label>
      {state?.error && <div className="account-error">{state.error}</div>}
      <SubmitBtn />
    </form>
  );
}
