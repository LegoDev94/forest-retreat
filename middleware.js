import { NextResponse } from 'next/server';

const LOCALES = ['ru', 'lv', 'en'];
const DEFAULT_LOCALE = 'ru';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Already locale-prefixed → pass through
  for (const l of LOCALES) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) {
      return NextResponse.next();
    }
  }

  // Pick locale from cookie or Accept-Language
  let locale = DEFAULT_LOCALE;
  const cookie = request.cookies.get('NEXT_LOCALE');
  if (cookie && LOCALES.includes(cookie.value)) {
    locale = cookie.value;
  } else {
    const accept = request.headers.get('accept-language') || '';
    for (const part of accept.split(',')) {
      const lang = part.split(';')[0].trim().slice(0, 2).toLowerCase();
      if (LOCALES.includes(lang)) { locale = lang; break; }
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

// Run on all paths EXCEPT static files, _next, api, content, public files
export const config = {
  matcher: [
    // Skip Next internals, API, content static, and anything with file extension
    '/((?!_next/|api/|content/|robots\\.txt|sitemap\\.xml|favicon\\.ico).*)',
  ],
};
