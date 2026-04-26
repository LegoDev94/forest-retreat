// motion-extras.js — premium animations powered by Motion One
// (vanilla JS counterpart to framer-motion, by the same team)
// Skill rules applied: Liquid Glass + slow parallax + premium reveals (400-600ms)
// + count-up stats + 3D tilt + scroll progress + cursor glow

import { animate, scroll, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.18.2/+esm";

(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* === Scroll progress bar === */
  const sp = document.querySelector('.scroll-progress');
  if (sp) {
    scroll(animate(sp, { scaleX: [0, 1] }, { ease: 'linear' }));
  }

  /* === Cursor glow === */
  const glow = document.querySelector('.cursor-glow');
  if (glow && !matchMedia('(hover: none)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    function tick() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* === Count-up stat animations === */
  document.querySelectorAll('.counter[data-to]').forEach((el) => {
    const target = parseFloat(el.dataset.to);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    inView(el, () => {
      animate(0, target, {
        duration: 1.8,
        ease: [0.2, 0.8, 0.2, 1],
        onUpdate: (v) => { el.textContent = v.toFixed(decimals) + suffix; }
      });
    }, { amount: 0.3 });
  });

  /* === Premium reveals (cinematic 600-900ms with stagger) === */
  if (!reduceMotion) {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      inView(el, () => {
        animate(el, {
          opacity: [0, 1],
          y: [60, 0],
          scale: [0.97, 1],
          filter: ['blur(8px)', 'blur(0px)']
        }, {
          duration: 0.9,
          ease: [0.2, 0.8, 0.2, 1],
          delay: parseFloat(el.dataset.delay || '0')
        });
      }, { amount: 0.15 });
    });
  }

  /* === Stagger children === */
  document.querySelectorAll('[data-stagger]').forEach((parent) => {
    const children = Array.from(parent.children);
    inView(parent, () => {
      animate(children, {
        opacity: [0, 1], y: [40, 0]
      }, {
        delay: stagger(0.08, { startDelay: 0.1 }),
        duration: 0.7,
        ease: [0.2, 0.8, 0.2, 1]
      });
    }, { amount: 0.1 });
  });

  /* === 3D Tilt on cards === */
  if (!reduceMotion && !matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.tilt').forEach((card) => {
      let rect = null;
      const inner = card.querySelector('.tilt-inner') || card;
      const maxTilt = 8;

      function onMove(e) {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * maxTilt;
        const ry = (x - 0.5) * maxTilt;
        animate(card, { rotateX: rx, rotateY: ry }, { type: 'spring', stiffness: 220, damping: 25 });
      }
      function onLeave() {
        rect = null;
        animate(card, { rotateX: 0, rotateY: 0 }, { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] });
      }
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  /* === Parallax hero background === */
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  if (hero && heroBg && !reduceMotion) {
    scroll(
      animate(heroBg, { y: [0, 200], scale: [1, 1.15] }),
      { target: hero, offset: ['start start', 'end start'] }
    );
  }

  /* === Hero content fade on scroll === */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && hero && !reduceMotion) {
    scroll(
      animate(heroContent, { opacity: [1, 0.2], y: [0, -80] }),
      { target: hero, offset: ['start start', 'end start'] }
    );
  }
})();
