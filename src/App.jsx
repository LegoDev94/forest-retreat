import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Cottage from './pages/Cottage';
import Aurora from './components/Aurora';
import CursorGlow from './components/CursorGlow';
import ScrollProgress from './components/ScrollProgress';
import SmoothScroll from './components/SmoothScroll';

const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -16 },
  transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
};

export default function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <>
      <div className="bg-atmosphere" />
      <div className="bg-grain" />
      <Aurora />
      <CursorGlow />
      <ScrollProgress />
      <SmoothScroll />

      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} {...pageTransition}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/cottage/:id" element={<Cottage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
