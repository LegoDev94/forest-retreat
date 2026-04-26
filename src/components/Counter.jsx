import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

export default function Counter({ to, decimals = 0, suffix = '', duration = 1.8, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: setV,
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={`counter ${className}`}>
      {v.toFixed(decimals)}{suffix}
    </span>
  );
}
