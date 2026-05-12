'use client';
import { useT } from '../lib/i18n.jsx';

const DEFAULT_NUMBER = '37125674959';

const PREFILL = {
  ru: 'Здравствуйте! У меня вопрос по Forest Retreat.',
  lv: 'Sveiki! Man ir jautājums par Forest Retreat.',
  en: 'Hi! I have a question about Forest Retreat.',
};

export default function WhatsappButton({ number = DEFAULT_NUMBER }) {
  const { t, locale } = useT();
  const digits = String(number).replace(/\D/g, '') || DEFAULT_NUMBER;
  const text = encodeURIComponent(PREFILL[locale] || PREFILL.en);
  const href = `https://wa.me/${digits}?text=${text}`;
  const label = t('contact.whatsapp') || 'Chat on WhatsApp';

  return (
    <a
      className="whatsapp-btn"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <path
          fill="#fff"
          d="M16.001 4C9.373 4 4 9.373 4 16c0 2.123.554 4.196 1.605 6.018L4 28l6.13-1.585A11.95 11.95 0 0 0 16 28c6.627 0 12-5.373 12-12S22.628 4 16.001 4Zm0 21.818c-1.83 0-3.624-.49-5.198-1.42l-.372-.221-3.637.94.97-3.547-.243-.366A9.79 9.79 0 0 1 6.183 16c0-5.42 4.4-9.818 9.818-9.818 5.42 0 9.818 4.4 9.818 9.818 0 5.42-4.4 9.818-9.818 9.818Zm5.387-7.34c-.295-.148-1.745-.86-2.015-.96-.27-.098-.467-.148-.664.148-.197.295-.762.96-.935 1.157-.172.197-.345.221-.64.074-.295-.148-1.246-.46-2.373-1.465-.877-.781-1.47-1.747-1.642-2.042-.172-.295-.018-.454.13-.601.133-.133.295-.345.443-.518.148-.172.197-.295.295-.492.099-.197.05-.37-.024-.518-.074-.148-.664-1.6-.91-2.19-.24-.575-.484-.497-.664-.507-.172-.008-.37-.01-.566-.01-.197 0-.516.074-.787.37-.27.295-1.032 1.008-1.032 2.46 0 1.45 1.056 2.852 1.202 3.05.148.197 2.078 3.173 5.034 4.45.703.303 1.252.485 1.68.62.706.225 1.348.193 1.856.117.566-.084 1.745-.713 1.992-1.402.246-.69.246-1.281.172-1.402-.074-.123-.27-.197-.566-.345Z"
        />
      </svg>
    </a>
  );
}
