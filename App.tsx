import React, { useState } from 'react';
import { AuctionProvider } from './context/AuctionContext';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import Admin from './views/Admin';
import Teams from './views/Teams';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <Admin />;
      case 'teams':
        return <Teams />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuctionProvider>
      <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500 selection:text-white">
        <Navbar currentView={currentView} setView={setCurrentView} />
        <main className="fade-in">
          {renderView()}
        </main>
      </div>
    </AuctionProvider>
  );
};

export default App;
