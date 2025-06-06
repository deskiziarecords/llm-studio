export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'mistral' | 'meta' | 'lmstudio' | 'ollama' | 'other'; // Added lmstudio & ollama as example local providers
  type: 'cloud' | 'local';
  endpoint?: string; // Optional custom endpoint for the model, e.g., for a self-hosted local model
}

// Note: ApiConfig is defined in src/services/api.ts.
// For consistency if it were here, it might look like:
// export interface ApiConfig {
//   apiKey?: string; // API key is optional, especially for local models
//   baseUrl?: string;
// }

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