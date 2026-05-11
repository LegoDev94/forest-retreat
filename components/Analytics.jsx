import Script from 'next/script';

const GA_ID  = process.env.NEXT_PUBLIC_GA_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export default function Analytics() {
  if (!GA_ID && !ADS_ID) return null;

  const configs = [];
  if (GA_ID)  configs.push(`gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: true });`);
  if (ADS_ID) configs.push(`gtag('config', '${ADS_ID}');`);

  return (
    <>
      <Script
        id="ga-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });
            gtag('set', 'url_passthrough', true);
            gtag('set', 'ads_data_redaction', true);
          `,
        }}
      />
      <Script
        id="ga-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID || ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('js', new Date());
            ${configs.join('\n            ')}
          `,
        }}
      />
    </>
  );
}
