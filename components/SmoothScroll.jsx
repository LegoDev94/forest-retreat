'use client';
// SmoothScroll — Lenis init wrapper. Disabled on touch (native scroll feels
// better on iOS) and on prefers-reduced-motion.
// Also resets scroll to top on every route change — without this, Lenis keeps
// the previous page's scroll position when the user navigates.
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll() {
  const lenisRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia('(hover: none)').matches) return;        // touch devices use native
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    let raf = 0;
    function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    // Hand-off anchor links to lenis so they animate smoothly
    const onAnchorClick = (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#') && !href.startsWith('/#')) return;
      const id = href.split('#')[1];
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      document.removeEventListener('click', onAnchorClick);
    };
  }, []);

  // Reset scroll on every route change
  useEffect(() => {
    // Don't fight a hash-anchor jump that the click handler started
    if (typeof window !== 'undefined' && window.location.hash) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
