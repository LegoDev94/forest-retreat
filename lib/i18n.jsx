'use client';
// i18n React layer — provider, hook, locale-aware Link.
// Pure dictionary lives in ./dict.js so server components can import it too.
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { LOCALES, LANGUAGES, DICT, pick } from './dict.js';

export { LOCALES, LANGUAGES, DICT, pick };

const LocaleContext = createContext({ locale: 'ru', setLocale: () => {} });

export function LocaleProvider({ locale, children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
    }
  }, [locale]);

  const setLocale = (next) => {
    if (!LOCALES.includes(next) || next === locale) return;
    const segments = pathname.split('/');
    if (segments[1] && LOCALES.includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const newPath = segments.join('/') || `/${next}`;
    router.push(newPath);
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale, pathname]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

// LocaleLink — auto-prepend current locale to internal absolute paths
export function LocaleLink({ href, ...props }) {
  const { locale } = useLocale();
  let finalHref = href;
  if (typeof href === 'string' && href.startsWith('/')) {
    const alreadyPrefixed = LOCALES.some(
      (l) => href === `/${l}` || href.startsWith(`/${l}/`)
    );
    if (!alreadyPrefixed) {
      if (href === '/')              finalHref = `/${locale}`;
      else if (href.startsWith('/#')) finalHref = `/${locale}${href.slice(1)}`;
      else                            finalHref = `/${locale}${href}`;
    }
  }
  return <NextLink href={finalHref} {...props} />;
}

// useT returns a function `t` that pulls from DICT
export function useT() {
  const { locale } = useLocale();
  const t = (path) => {
    const parts = Array.isArray(path) ? path : path.split('.');
    let node = DICT;
    for (const p of parts) {
      if (node == null) return '';
      node = node[p];
    }
    return pick(node, locale);
  };
  return { t, locale, pick: (obj) => pick(obj, locale) };
}
