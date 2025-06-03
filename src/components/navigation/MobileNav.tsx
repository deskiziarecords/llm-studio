import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings, Database, History } from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-dark-800 border-t border-dark-700 flex items-center justify-around z-30 px-2">
      <MobileNavItem to="/" icon={<Home size={20} />} label="Chat" />
      <MobileNavItem to="/models" icon={<Database size={20} />} label="Models" />
      <MobileNavItem to="/history" icon={<History size={20} />} label="History" />
      <MobileNavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
    </nav>
  );
};

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `flex flex-col items-center justify-center gap-1 w-20 h-full rounded-lg ${
          isActive 
            ? 'text-primary-400' 
            : 'text-gray-400 hover:text-gray-300'
        }`
      }
    >
      {icon}
      <span className="text-xs">{label}</span>
    </NavLink>
  );
};