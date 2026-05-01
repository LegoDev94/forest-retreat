// Quick contact buttons. Renders only what's configured server-side.
export default function QuickContact({ whatsapp, phone, email, ref }) {
  if (!whatsapp && !phone && !email) return null;

  const refSuffix = ref ? ` ${ref}` : '';
  const waText = encodeURIComponent(`Здравствуйте, я по бронированию${refSuffix}`);
  const waNumber = whatsapp?.replace(/\D/g, '');
  const mailSubject = encodeURIComponent(`Бронирование${refSuffix}`);

  return (
    <div className="quick-contact">
      <span className="quick-contact-title">Связаться с менеджером</span>
      <div className="quick-contact-row">
        {waNumber && (
          <a className="quick-btn quick-btn-wa" href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        )}
        {phone && (
          <a className="quick-btn quick-btn-phone" href={`tel:${phone.replace(/\s/g, '')}`}>
            {phone}
          </a>
        )}
        {email && (
          <a className="quick-btn quick-btn-mail" href={`mailto:${email}?subject=${mailSubject}`}>
            {email}
          </a>
        )}
      </div>
    </div>
  );
}
