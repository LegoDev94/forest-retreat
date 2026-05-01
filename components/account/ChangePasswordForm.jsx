'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { changePasswordAction } from '../../app/actions/account';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary account-submit" disabled={pending}>
      {pending ? 'Сохраняем…' : 'Сменить пароль'}
    </button>
  );
}

export default function ChangePasswordForm() {
  const [state, action] = useFormState(changePasswordAction, null);
  return (
    <form action={action} className="account-form">
      <label className="account-label">
        <span>Новый пароль</span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="account-input"
          placeholder="Минимум 6 символов"
        />
      </label>
      {state?.error && <div className="account-error">{state.error}</div>}
      {state?.ok && <div className="account-ok">Пароль обновлён.</div>}
      <SubmitBtn />
    </form>
  );
}
