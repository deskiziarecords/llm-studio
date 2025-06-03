import React, { useState } from 'react';
import { ChevronDown, Cloud, Server } from 'lucide-react';
import { useStore } from '../../store';
import { ModelConfig } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

export const ModelSelector: React.FC = () => {
  const { availableModels, currentModel, setCurrentModel } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelectModel = (model: ModelConfig) => {
    setCurrentModel(model);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-dark-700 hover:bg-dark-600 transition-colors text-sm"
      >
        {currentModel?.type === 'cloud' ? (
          <Cloud size={16} className="text-primary-400" />
        ) : (
          <Server size={16} className="text-green-400" />
        )}
        <span>{currentModel?.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 right-0 mt-1 w-64 rounded-md shadow-lg bg-dark-700 border border-dark-600"
          >
            <div className="py-1 max-h-64 overflow-y-auto">
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-dark-600">
                Cloud Models
              </div>
              {availableModels
                .filter(model => model.type === 'cloud')
                .map(model => (
                  <ModelOption 
                    key={model.id} 
                    model={model} 
                    isSelected={currentModel?.id === model.id}
                    onSelect={handleSelectModel}
                  />
                ))
              }
              
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-dark-600 mt-2">
                Local Models
              </div>
              {availableModels
                .filter(model => model.type === 'local')
                .map(model => (
                  <ModelOption 
                    key={model.id} 
                    model={model} 
                    isSelected={currentModel?.id === model.id}
                    onSelect={handleSelectModel}
                  />
                ))
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ModelOptionProps {
  model: ModelConfig;
  isSelected: boolean;
  onSelect: (model: ModelConfig) => void;
}

const ModelOption: React.FC<ModelOptionProps> = ({ model, isSelected, onSelect }) => {
  return (
    <button
      className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-dark-600 ${
        isSelected ? 'bg-primary-900/30 text-primary-400' : 'text-gray-200'
      }`}
      onClick={() => onSelect(model)}
    >
      {model.type === 'cloud' ? (
        <Cloud size={16} className="text-primary-400" />
      ) : (
        <Server size={16} className="text-green-400" />
      )}
      <div className="flex flex-col">
        <span>{model.name}</span>
        <span className="text-xs text-gray-400">{model.provider}</span>
      </div>
    </button>
  );
};