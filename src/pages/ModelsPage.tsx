import React from 'react';
import { Cloud, Server, PlusCircle, Download, ExternalLink, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export const ModelsPage: React.FC = () => {
  const { availableModels, currentModel, setCurrentModel } = useStore();
  
  const cloudModels = availableModels.filter(model => model.type === 'cloud');
  const localModels = availableModels.filter(model => model.type === 'local');
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Models</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cloud Models */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700">
            <div className="flex items-center gap-3">
              <Cloud className="text-primary-400" />
              <h2 className="text-lg font-medium">Cloud Models</h2>
            </div>
            <button className="p-2 rounded-full hover:bg-dark-700 transition-colors">
              <Settings size={18} className="text-gray-400" />
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            {cloudModels.map(model => (
              <ModelCard 
                key={model.id}
                model={model}
                isSelected={currentModel?.id === model.id}
                onSelect={() => setCurrentModel(model)}
              />
            ))}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-dark-600 rounded-lg text-gray-400 hover:text-gray-300 hover:border-dark-500 transition-colors"
            >
              <PlusCircle size={18} />
              <span>Add Custom API Connection</span>
            </motion.button>
          </div>
        </div>
        
        {/* Local Models */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700">
            <div className="flex items-center gap-3">
              <Server className="text-green-400" />
              <h2 className="text-lg font-medium">Local Models</h2>
            </div>
            <button className="p-2 rounded-full hover:bg-dark-700 transition-colors">
              <Settings size={18} className="text-gray-400" />
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            {localModels.map(model => (
              <ModelCard 
                key={model.id}
                model={model}
                isSelected={currentModel?.id === model.id}
                onSelect={() => setCurrentModel(model)}
              />
            ))}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-dark-600 rounded-lg text-gray-400 hover:text-gray-300 hover:border-dark-500 transition-colors"
            >
              <Download size={18} />
              <span>Download New Model</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Featured Models */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Featured Models</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredModels.map((model, index) => (
            <FeaturedModelCard key={index} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    provider: string;
    type: 'cloud' | 'local';
  };
  isSelected: boolean;
  onSelect: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, isSelected, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-primary-900/30 border-primary-600/50' 
          : 'bg-dark-700 border-dark-600 hover:border-dark-500'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {model.type === 'cloud' ? (
            <Cloud size={18} className="text-primary-400" />
          ) : (
            <Server size={18} className="text-green-400" />
          )}
          <div>
            <h3 className="font-medium">{model.name}</h3>
            <p className="text-xs text-gray-400">{model.provider}</p>
          </div>
        </div>
        
        {isSelected && (
          <div className="h-2 w-2 rounded-full bg-primary-500"></div>
        )}
      </div>
    </motion.div>
  );
};

interface FeaturedModel {
  name: string;
  description: string;
  type: 'cloud' | 'local';
  provider: string;
  size?: string;
  link: string;
}

const featuredModels: FeaturedModel[] = [
  {
    name: "Llama 3 8B",
    description: "Meta's efficient open model, great for personal use on consumer hardware",
    type: "local",
    provider: "meta",
    size: "4.7 GB",
    link: "#"
  },
  {
    name: "Mistral 7B Instruct",
    description: "Powerful instruction-following model with great performance for its size",
    type: "local",
    provider: "mistral",
    size: "4.1 GB",
    link: "#"
  },
  {
    name: "Claude 3 Sonnet",
    description: "Anthropic's balanced model with strong reasoning and coding capabilities",
    type: "cloud",
    provider: "anthropic",
    link: "#"
  }
];

const FeaturedModelCard: React.FC<{ model: FeaturedModel }> = ({ model }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {model.type === 'cloud' ? (
            <Cloud size={18} className="text-primary-400" />
          ) : (
            <Server size={18} className="text-green-400" />
          )}
          <span className="text-xs uppercase tracking-wider text-gray-400">{model.provider}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{model.name}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{model.description}</p>
        
        {model.size && (
          <div className="text-xs text-gray-500 mb-4">Size: {model.size}</div>
        )}
        
        <a 
          href={model.link}
          className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          {model.type === 'local' ? (
            <>
              <Download size={16} />
              <span>Download</span>
            </>
          ) : (
            <>
              <ExternalLink size={16} />
              <span>Learn More</span>
            </>
          )}
        </a>
      </div>
    </motion.div>
  );
};