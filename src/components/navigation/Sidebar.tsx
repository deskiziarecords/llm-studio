import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings, Database, History, Mic, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-dark-800 shadow-lg z-30 overflow-y-auto">
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-600 flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">Echo AI</h1>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          <NavItem to="/" icon={<Home size={20} />} label="Chat" />
          <NavItem to="/models" icon={<Database size={20} />} label="Models" />
          <NavItem to="/history" icon={<History size={20} />} label="History" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
        
        <div className="absolute bottom-8 left-0 w-full px-3">
          <button className="flex items-center w-full gap-3 px-4 py-2.5 text-gray-300 hover:text-white rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
          isActive 
            ? 'bg-gradient-to-r from-primary-500/20 to-secondary-600/20 text-white' 
            : 'text-gray-400 hover:text-white hover:bg-dark-700'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};