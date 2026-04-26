import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 60, scale: 0.97, filter: 'blur(8px)' },
  show:   { opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)' },
};

export default function Reveal({ children, delay = 0, amount = 0.15, className = '', as = 'div', ...rest }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}
