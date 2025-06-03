export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'mistral' | 'meta' | 'other';
  type: 'cloud' | 'local';
  endpoint?: string;
}

export interface AppSettings {
  apiKeys: {
    [provider: string]: string;
  };
  voice: {
    enabled: boolean;
    autoPlayResponses: boolean;
    voice: string;
  };
  appearance: {
    theme: 'light' | 'dark';
    fontSize: 'small' | 'medium' | 'large';
  };
  advanced: {
    temperature: number;
    maxTokens: number;
    streamResponses: boolean;
  };
}