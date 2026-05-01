import { redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers';

const LOCALES = ['ru', 'lv', 'en'];
const DEFAULT_LOCALE = 'lv';

// Server component for / — detect locale and 308-redirect to /[locale].
// Replaces edge middleware (which kept hitting __dirname / runtime issues on Vercel).
export default async function RootRedirect() {
  // 1. Cookie set by LocaleProvider on prior visits
  const cookieJar = await cookies();
  const stored = cookieJar.get('NEXT_LOCALE')?.value;
  if (stored && LOCALES.includes(stored)) {
    redirect(`/${stored}`);
  }

  // 2. Accept-Language header
  const accept = (await headers()).get('accept-language') || '';
  for (const part of accept.split(',')) {
    const lang = part.split(';')[0].trim().slice(0, 2).toLowerCase();
    if (LOCALES.includes(lang)) {
      redirect(`/${lang}`);
    }
  }

  // 3. Default
  redirect(`/${DEFAULT_LOCALE}`);
}
