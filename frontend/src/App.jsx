import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Enhancer from './pages/Enhancer';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import ArtisanCards from './pages/ArtisanCards';
import PoetryStudio from './pages/PoetryStudio';
import ShayariGenerator from './pages/ShayariGenerator';
import CreatorLab from './pages/CreatorLab';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Info from './pages/Info';
import Showcase from './pages/Showcase';
import DashboardLayout from './components/DashboardLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg">
       <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
  
  if (!isAuthenticated) return <Navigate to="/auth" />;
  return children;
};

function Scaffold() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/enhancer') || 
                           location.pathname.startsWith('/creator-lab') ||
                           location.pathname.startsWith('/artisan-cards') ||
                           location.pathname.startsWith('/poetry-studio') ||
                           location.pathname.startsWith('/shayari-generator');
  const isAuthRoute = location.pathname === '/auth';
  const isMarketingRoute = ['/', '/about', '/info', '/contact', '/showcase'].includes(location.pathname);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-textMain bg-app-bg relative selection:bg-primary/20 overflow-x-hidden">
      <div className="noise-overlay" />
      <div className="premium-blur" />
      <div 
        className="cursor-glow hidden lg:block"
        style={{ 
          left: mousePos.x, 
          top: mousePos.y 
        }}
      />
      
      {!isDashboardRoute && !isAuthRoute && !isMarketingRoute && <Navbar />}
      
      {isDashboardRoute ? (
        <Routes>
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/enhancer" element={<Enhancer />} />
            <Route path="/creator-lab" element={<CreatorLab />} />
            <Route path="/artisan-cards" element={<ArtisanCards />} />
            <Route path="/poetry-studio" element={<PoetryStudio />} />
            <Route path="/shayari-generator" element={<ShayariGenerator />} />
            <Route path="/dashboard/history" element={<History />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Route>
        </Routes>
      ) : (
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/info" element={<Info />} />
            <Route path="/showcase" element={<Showcase />} />
          </Routes>
        </main>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Scaffold />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
