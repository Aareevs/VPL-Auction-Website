import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuctionProvider } from './context/AuctionContext';
import { AuthProvider, useAuth } from './context/AuthProvider';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import Admin from './views/Admin';
import Teams from './views/Teams';
import Home from './views/Home';
import Onboarding from './views/Onboarding';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: ReactNode, requireAdmin?: boolean }) => {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  if (!user) return <Navigate to="/" state={{ from: location }} replace />;

  if (!profile) return <Navigate to="/onboarding" replace />;

  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  // Don't show navbar on home/onboarding or if not authenticated (handled by route protection)
  const showNavbar = location.pathname !== '/' && location.pathname !== '/onboarding';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500 selection:text-white pb-20 md:pb-0">
       {showNavbar && <Navbar />}
       <main className="fade-in">
        {children}
       </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/teams" element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <Admin />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AuctionProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuctionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
