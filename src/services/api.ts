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
  apiKey: string;
  baseUrl?: string;
}

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
    let headers: Record<string, string> = {};
    
    switch (modelConfig.provider) {
      case 'openai':
        endpoint = 'https://api.openai.com/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
        };
        break;
      case 'anthropic':
        endpoint = 'https://api.anthropic.com/v1/messages';
        headers = {
          'x-api-key': apiConfig.apiKey,
          'anthropic-version': '2023-06-01',
        };
        // Transform request format for Anthropic API
        const anthropicRequest = {
          model: request.model,
          messages: request.messages,
          max_tokens: request.max_tokens,
        };
        return sendRequest(endpoint, anthropicRequest, headers);
      case 'mistral':
      case 'meta':
      case 'other':
        // For local models, use the custom endpoint
        if (modelConfig.type === 'local' && modelConfig.endpoint) {
          endpoint = modelConfig.endpoint;
          // Local models typically don't need authentication
          return sendRequest(endpoint, request, headers);
        } else {
          throw new Error(`No endpoint defined for ${modelConfig.name}`);
        }
      default:
        throw new Error(`Unsupported provider: ${modelConfig.provider}`);
    }
    
    return sendRequest(endpoint, request, headers);
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
    let headers: Record<string, string> = {};
    
    switch (modelConfig.provider) {
      case 'openai':
        endpoint = 'https://api.openai.com/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        };
        break;
      case 'anthropic':
        endpoint = 'https://api.anthropic.com/v1/messages';
        headers = {
          'x-api-key': apiConfig.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        };
        break;
      default:
        // For local models or other providers
        if (modelConfig.type === 'local' && modelConfig.endpoint) {
          endpoint = modelConfig.endpoint;
        } else {
          throw new Error(`Streaming not supported for ${modelConfig.provider}`);
        }
    }
    
    // Use fetch for streaming
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
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
      
      for (const line of lines) {
        if (line.startsWith('data:') && !line.includes('[DONE]')) {
          try {
            const jsonData = JSON.parse(line.slice(5));
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