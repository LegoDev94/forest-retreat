import { NextResponse } from 'next/server';

const LOCALES = ['ru', 'lv', 'en'];
const DEFAULT_LOCALE = 'ru';

function pickLocale(request) {
  // 1. cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale)) return cookieLocale;
  // 2. Accept-Language
  const accept = request.headers.get('accept-language') ?? '';
  const preferred = accept.split(',').map(s => s.split(';')[0].trim().slice(0, 2));
  for (const lang of preferred) {
    if (LOCALES.includes(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip Next internals + assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/content') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico' ||
    /\.[a-zA-Z0-9]+$/.test(pathname) // any file extension
  ) {
    return NextResponse.next();
  }

  // Already has locale prefix?
  const hasLocale = LOCALES.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  // Redirect / and unprefixed paths to detected locale
  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|content|.*\\..*).*)'],
};
