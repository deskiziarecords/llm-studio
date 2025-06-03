import React from 'react';
import { User, Bot, Copy, Check, VolumeX, Volume2 } from 'lucide-react';
import { Message } from '../../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const isUser = message.role === 'user';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would trigger text-to-speech
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 p-4 rounded-lg ${
        isUser ? 'bg-dark-700' : 'bg-dark-800 border border-dark-700'
      }`}
    >
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary-500' : 'bg-secondary-600'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div className="font-medium">
            {isUser ? 'You' : 'Echo AI'}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
        
        <div className="text-gray-200 leading-relaxed">
          {message.content}
        </div>
        
        {!isUser && (
          <div className="flex gap-2 pt-2">
            <button 
              onClick={copyToClipboard}
              className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-dark-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            
            <button 
              onClick={toggleAudio}
              className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-dark-700 transition-colors"
              title={isPlaying ? "Stop audio" : "Read aloud"}
            >
              {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};