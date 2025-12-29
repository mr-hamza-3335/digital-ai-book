import OpenAI from 'openai';

// DeepSeek API configuration
const DEEPSEEK_API_BASE = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-reasoner';

// Create OpenAI-compatible client for DeepSeek (or OpenRouter)
export function createDeepSeekClient(): OpenAI {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is not set');
  }

  // Check if using OpenRouter
  const isOpenRouter = DEEPSEEK_API_BASE.includes('openrouter.ai');

  return new OpenAI({
    apiKey,
    baseURL: DEEPSEEK_API_BASE,
    defaultHeaders: isOpenRouter ? {
      'HTTP-Referer': 'https://deepseek-chatbot.vercel.app',
      'X-Title': 'DeepSeek Chatbot',
    } : undefined,
  });
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string;
  reasoning?: string;
  error?: string;
}

// Send chat completion request to DeepSeek
export async function sendChatMessage(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<ChatResponse> {
  try {
    const client = createDeepSeekClient();

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    const response = await client.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: fullMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: 4096,
      temperature: 0.7,
      stream: false,
    });

    const assistantMessage = response.choices[0]?.message;

    if (!assistantMessage) {
      throw new Error('No response from DeepSeek API');
    }

    // Handle reasoning content if available (DeepSeek R1 specific)
    let reasoning: string | undefined;
    if ('reasoning_content' in assistantMessage && assistantMessage.reasoning_content) {
      reasoning = assistantMessage.reasoning_content as string;
    }

    return {
      message: assistantMessage.content || '',
      reasoning,
    };
  } catch (error: unknown) {
    console.error('DeepSeek API Error:', error);

    // Handle specific error types
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return {
          message: '',
          error: 'Invalid API key. Please check your DEEPSEEK_API_KEY configuration.',
        };
      }
      if (error.status === 429) {
        return {
          message: '',
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
        };
      }
      if (error.status === 503) {
        return {
          message: '',
          error: 'DeepSeek service is temporarily unavailable. Please try again later.',
        };
      }
      return {
        message: '',
        error: `API Error: ${error.message}`,
      };
    }

    if (error instanceof Error) {
      return {
        message: '',
        error: error.message,
      };
    }

    return {
      message: '',
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

// Validate API key
export async function validateApiKey(): Promise<boolean> {
  try {
    const client = createDeepSeekClient();

    // Simple validation request
    await client.models.list();
    return true;
  } catch {
    return false;
  }
}
