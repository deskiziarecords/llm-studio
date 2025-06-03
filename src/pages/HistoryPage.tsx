import React, { useState } from 'react';
import { Search, Filter, Trash2, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample history data
const historyData = [
  {
    id: '1',
    title: 'Help with React hooks',
    preview: 'Can you explain how useEffect works?',
    date: '2025-06-10T14:30:00',
    model: 'GPT-4',
    messages: 8
  },
  {
    id: '2',
    title: 'Translation assistance',
    preview: 'Translate this paragraph to Spanish',
    date: '2025-06-09T10:15:00',
    model: 'Claude 3',
    messages: 5
  },
  {
    id: '3',
    title: 'Code review',
    preview: 'Can you review this JavaScript function?',
    date: '2025-06-08T16:45:00',
    model: 'Llama 3',
    messages: 12
  },
  {
    id: '4',
    title: 'Research on machine learning',
    preview: 'What are the latest developments in ML?',
    date: '2025-06-07T09:20:00',
    model: 'GPT-4',
    messages: 15
  },
  {
    id: '5',
    title: 'Email draft',
    preview: 'Help me write a professional email',
    date: '2025-06-06T13:10:00',
    model: 'Claude 3',
    messages: 6
  }
];

export const HistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  
  const filteredHistory = historyData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Conversation History</h1>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
        
        <button className="p-2.5 bg-dark-800 border border-dark-700 rounded-lg hover:bg-dark-700 transition-colors">
          <Filter size={18} className="text-gray-400" />
        </button>
      </div>
      
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center">
            <Search size={24} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">No conversations found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map(conversation => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                selectedConversation === conversation.id
                  ? 'bg-primary-900/30 border-primary-600/50'
                  : 'bg-dark-800 border-dark-700 hover:border-dark-600'
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{conversation.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {new Date(conversation.date).toLocaleDateString()}
                  </span>
                  <button className="p-1 text-gray-500 hover:text-gray-300 rounded-md hover:bg-dark-700 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 line-clamp-1 mb-3">{conversation.preview}</p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-dark-700 text-gray-300">
                    {conversation.model}
                  </span>
                  <span className="text-gray-500">
                    {conversation.messages} messages
                  </span>
                </div>
                
                <button className="flex items-center gap-1 text-primary-400 hover:text-primary-300">
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="mt-8 border-t border-dark-700 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={16} />
            <span>History is stored locally on your device</span>
          </div>
          
          <button className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg hover:bg-dark-700 text-gray-300 text-sm transition-colors">
            Export History
          </button>
        </div>
      </div>
    </div>
  );
};