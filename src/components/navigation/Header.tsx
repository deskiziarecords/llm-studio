import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useStore } from '../../store';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const toggleSidebar = useStore(state => state.toggleSidebar);
  
  return (
    <header className="h-16 border-b border-dark-700 flex items-center justify-between px-4 md:px-8 bg-dark-800/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="md:hidden mr-4 p-2 rounded-lg hover:bg-dark-700 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-medium">Echo AI Assistant</h2>
      </div>
      
      <div className="flex items-center gap-3">
        <StatusIndicator />
        
        <button className="p-2 rounded-lg hover:bg-dark-700 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      </div>
    </header>
  );
};

const StatusIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-full text-sm">
      <motion.div 
        className="w-2 h-2 rounded-full bg-green-400"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-gray-300">Ready</span>
    </div>
  );
};