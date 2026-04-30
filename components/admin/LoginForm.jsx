'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '../../app/actions/admin';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>
      {pending ? 'Входим…' : 'Войти'}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, { error: null });
  return (
    <form action={formAction} className="admin-login-form">
      <label className="admin-label">
        <span>Пароль</span>
        <input
          type="password"
          name="password"
          autoFocus
          autoComplete="current-password"
          required
          className="admin-input"
        />
      </label>
      {state?.error && <div className="admin-error">{state.error}</div>}
      <SubmitButton />
    </form>
  );
}
