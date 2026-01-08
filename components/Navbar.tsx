import React from 'react';
import { LayoutDashboard, Users, Gavel, Settings } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'teams', label: 'Teams & Squads', icon: Users },
    { id: 'admin', label: 'Admin Panel', icon: Gavel },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl leading-none">V</span>
        </div>
        <span className="text-2xl font-bold tracking-tight text-white display-font pt-1">VPL 2026</span>
      </div>

      <div className="flex items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="w-8">
        {/* Spacer or User Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
      </div>
    </nav>
  );
};

export default Navbar;