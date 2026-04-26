import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Cottage from './pages/Cottage';
import Aurora from './components/Aurora';
import CursorGlow from './components/CursorGlow';
import ScrollProgress from './components/ScrollProgress';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <div className="bg-atmosphere" />
      <div className="bg-grain" />
      <Aurora />
      <CursorGlow />
      <ScrollProgress />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cottage/:id" element={<Cottage />} />
      </Routes>
    </>
  );
}
