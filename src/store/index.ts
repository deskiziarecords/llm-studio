import { create } from 'zustand';
import { Message, ModelConfig, AppSettings } from '../types';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  
  // Voice
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  
  // Models
  availableModels: ModelConfig[];
  currentModel: ModelConfig | null;
  setCurrentModel: (model: ModelConfig) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useStore = create<AppState>((set) => ({
  // UI State
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Messages
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  
  // Voice
  isListening: false,
  setIsListening: (value) => set({ isListening: value }),
  
  // Models
  availableModels: [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', type: 'cloud' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'openai', type: 'cloud' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic', type: 'cloud' },
    { id: 'llama-3-70b', name: 'Llama 3 (70B)', provider: 'meta', type: 'local' },
    { id: 'mistral-7b', name: 'Mistral (7B)', provider: 'mistral', type: 'local' },
  ],
  currentModel: { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', type: 'cloud' },
  setCurrentModel: (model) => set({ currentModel: model }),
  
  // Settings
  settings: {
    apiKeys: {},
    voice: {
      enabled: true,
      autoPlayResponses: true,
      voice: 'default',
    },
    appearance: {
      theme: 'dark',
      fontSize: 'medium',
    },
    advanced: {
      temperature: 0.7,
      maxTokens: 2000,
      streamResponses: true,
    },
  },
  updateSettings: (newSettings) => 
    set((state) => ({ 
      settings: { ...state.settings, ...newSettings } 
    })),
}));