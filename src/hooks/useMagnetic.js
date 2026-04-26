// Magnetic hover — element pulls slightly toward cursor on hover.
// Disabled on touch and prefers-reduced-motion.
import { useEffect, useRef } from 'react';

export default function useMagnetic({ strength = 0.35, radius = 110 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(hover: none)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius + Math.max(r.width, r.height) / 2) {
        target.x = dx * strength;
        target.y = dy * strength;
      } else {
        target.x = 0;
        target.y = 0;
      }
    };
    const onLeave = () => { target.x = 0; target.y = 0; };

    function tick() {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (el) el.style.transform = '';
    };
  }, [strength, radius]);

  return ref;
}
