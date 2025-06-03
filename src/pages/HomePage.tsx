import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { VoiceVisualizer } from '../components/voice/VoiceVisualizer';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ModelSelector } from '../components/models/ModelSelector';

export const HomePage: React.FC = () => {
  const { messages, addMessage, isListening, setIsListening, currentModel } = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    });
    
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm an AI assistant designed to help with your queries. How can I assist you today?",
        timestamp: Date.now(),
      });
    }, 1000);
  };
  
  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    
    // In a real app, we would use the Web Speech API here
    if (!isListening) {
      // Start listening
      console.log('Started listening...');
    } else {
      // Stop listening and process voice input
      console.log('Stopped listening, processing input...');
    }
  };
  
  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Chat Assistant</h1>
        <div className="flex items-center space-x-2">
          <ModelSelector />
          <button className="p-2 rounded-full hover:bg-dark-700 transition-colors">
            <Settings size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="relative">
        {isListening && (
          <div className="absolute -top-24 left-0 right-0 h-20 bg-dark-800/80 backdrop-blur rounded-lg flex items-center justify-center">
            <VoiceVisualizer />
          </div>
        )}
        
        <div className="flex items-center space-x-2 bg-dark-800 rounded-lg p-3 border border-dark-700">
          <button 
            onClick={toggleVoiceInput}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-accent-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : "Type a message..."}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500"
            disabled={isListening}
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() && !isListening}
            className={`p-2 rounded-full ${
              input.trim() || isListening
                ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white'
                : 'bg-dark-700 text-gray-500'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 flex justify-between px-2">
          <div>Model: <span className="text-primary-400">{currentModel?.name}</span></div>
          <div>Voice: <span className="text-green-500">Enabled</span></div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-600 flex items-center justify-center"
      >
        <Mic size={32} className="text-white" />
      </motion.div>
      
      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
        Echo AI Assistant
      </h2>
      
      <p className="text-gray-400 max-w-md mb-6">
        Ask me anything using voice commands or text input. I'm here to help with information, tasks, and conversations.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
        {[
          "What's the weather today?",
          "Summarize the latest tech news",
          "Help me draft an email",
          "Tell me a joke"
        ].map((suggestion, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            className="p-3 border border-dark-700 rounded-lg bg-dark-800/50 hover:bg-dark-700/50 cursor-pointer text-gray-300 text-sm text-left"
          >
            {suggestion}
          </motion.div>
        ))}
      </div>
    </div>
  );
};