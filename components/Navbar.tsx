import React from 'react';
import { LayoutDashboard, Users, Gavel, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();
  const currentPath = location.pathname;

  const navItems = [
    { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/teams', label: 'Teams & Squads', icon: Users },
  ];

  if (isAdmin) {
    navItems.push({ id: '/admin', label: 'Admin Panel', icon: Gavel });
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl leading-none">V</span>
        </div>
        <span className="text-2xl font-bold tracking-tight text-white display-font pt-1">VPL 2026</span>
      </div>

      <div className="flex items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
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
      
      <div className="flex items-center gap-4">
        {user && (
           <div className="flex items-center gap-3 bg-slate-800 rounded-full px-4 py-1.5 border border-slate-700">
             <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                <UserIcon size={14} className="text-slate-400" />
             </div>
             <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium max-w-[100px] truncate">{user.email}</span>
                <span className="text-[10px] text-slate-500 uppercase leading-none">{profile?.role || 'Guest'}</span>
             </div>
           </div>
        )}
        <button 
           onClick={handleSignOut}
           className="text-slate-400 hover:text-red-400 transition-colors p-2"
           title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;