import axios from 'axios';
import { ModelConfig } from '../types';

// Create axios instance with defaults
const api = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ChatCompletionRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
}

export interface ApiConfig {
  apiKey: string; // Used for cloud providers
  baseUrl?: string; // Can be used to override base URLs for any provider if needed
}

const LOCAL_MODEL_DEFAULT_BASE_URL = 'http://localhost:1234/v1';

/**
 * Send a chat completion request to the selected model
 */
export async function sendChatCompletion(
  request: ChatCompletionRequest,
  modelConfig: ModelConfig,
  apiConfig: ApiConfig
): Promise<string> {
  try {
    // Determine the API endpoint based on model provider
    let endpoint: string;
    let headers: Record<string, string> = { 'Content-Type': 'application/json' }; // Default content type
    let requestBody = request;

    if (modelConfig.type === 'local') {
      const baseUrl = modelConfig.endpoint || apiConfig.baseUrl || LOCAL_MODEL_DEFAULT_BASE_URL;
      endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
      // No specific auth headers for local models by default
    } else {
      switch (modelConfig.provider) {
        case 'openai':
          endpoint = apiConfig.baseUrl || 'https://api.openai.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
          break;
        case 'anthropic':
          endpoint = apiConfig.baseUrl || 'https://api.anthropic.com/v1/messages';
          headers['x-api-key'] = apiConfig.apiKey;
          headers['anthropic-version'] = '2023-06-01';
          // Transform request format for Anthropic API
          requestBody = {
            model: request.model,
            messages: request.messages,
            max_tokens: request.max_tokens,
            // stream: false, // Anthropic uses Accept header for streaming, not body property
          } as any; // Cast to any to avoid type conflict, proper type would be better
          break;
        default:
          // This case handles 'mistral', 'meta', 'other' if they are not type 'local'
          // It assumes they behave like OpenAI or require a specific 'baseUrl' in ApiConfig
          if (apiConfig.baseUrl) {
            endpoint = `${apiConfig.baseUrl.replace(/\/$/, '')}/chat/completions`;
            if (apiConfig.apiKey) { // Add auth if API key is provided
              headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
            }
          } else {
            throw new Error(`Unsupported cloud provider or missing baseUrl: ${modelConfig.provider}`);
          }
      }
    }
    
    return sendRequest(endpoint, requestBody, headers);
  } catch (error) {
    console.error('Error sending chat completion:', error);
    throw error;
  }
}

async function sendRequest(
  endpoint: string,
  data: any,
  headers: Record<string, string>
): Promise<string> {
  const response = await api.post(endpoint, data, { headers });
  const result = response.data as ChatCompletionResponse;
  return result.choices[0]?.message.content || '';
}

/**
 * Stream chat completion responses
 */
export async function streamChatCompletion(
  request: ChatCompletionRequest,
  modelConfig: ModelConfig,
  apiConfig: ApiConfig,
  onChunk: (chunk: string) => void,
  onComplete: (fullResponse: string) => void
): Promise<void> {
  try {
    // Ensure stream is set to true
    request.stream = true;
    
    // Determine the API endpoint based on model provider
    let endpoint: string;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    };
    let requestBody = { ...request, stream: true }; // Ensure stream is true for all providers if not set

    if (modelConfig.type === 'local') {
      const baseUrl = modelConfig.endpoint || apiConfig.baseUrl || LOCAL_MODEL_DEFAULT_BASE_URL;
      endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
      // No specific auth headers for local models by default for streaming
    } else {
      switch (modelConfig.provider) {
        case 'openai':
          endpoint = apiConfig.baseUrl || 'https://api.openai.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
          break;
        case 'anthropic':
          endpoint = apiConfig.baseUrl || 'https://api.anthropic.com/v1/messages';
          headers['x-api-key'] = apiConfig.apiKey;
          headers['anthropic-version'] = '2023-06-01';
          // Anthropic specific: stream parameter might be in the body or handled by Accept header
          // For this example, keeping requestBody similar to OpenAI for stream=true
          requestBody = {
            ...request,
            stream: true,
            // Anthropic specific body for streaming if different from non-streaming
            // messages: request.messages, model: request.model, max_tokens: request.max_tokens etc.
          } as any;
          break;
        default:
          // This case handles 'mistral', 'meta', 'other' if they are not type 'local'
          if (apiConfig.baseUrl) {
            endpoint = `${apiConfig.baseUrl.replace(/\/$/, '')}/chat/completions`;
             if (apiConfig.apiKey) { // Add auth if API key is provided
              headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
            }
          } else {
            throw new Error(`Streaming not supported or missing baseUrl for cloud provider: ${modelConfig.provider}`);
          }
      }
    }
    
    // Use fetch for streaming
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      // This SSE parsing logic is designed for OpenAI-compatible streams.
      // It assumes:
      // 1. Data messages start with "data: ".
      // 2. The payload is a JSON object.
      // 3. Text content is found in `choices[0].delta.content`.
      // 4. Stream termination is signaled by a `data: [DONE]` message.
      // Services like LM Studio are expected to adhere to this format for compatibility.
      for (const line of lines) {
        // Skip empty lines and non-data lines
        if (!line.trim() || !line.startsWith('data:')) {
          continue;
        }

        // Handle the [DONE] signal from OpenAI-compatible streams
        if (line.includes('[DONE]')) {
          // The loop will break naturally when reader.read() returns done: true.
          // This check is mostly to prevent trying to parse "[DONE]" as JSON.
          continue;
        }

        try {
          const jsonData = JSON.parse(line.slice(5)); // Remove "data: " prefix
            const content = jsonData.choices[0]?.delta?.content || '';
            if (content) {
              onChunk(content);
              fullResponse += content;
            }
          } catch (e) {
            console.error('Error parsing JSON from stream:', e);
          }
        }
      }
    }
    
    onComplete(fullResponse);
  } catch (error) {
    console.error('Error streaming chat completion:', error);
    throw error;
  }
}