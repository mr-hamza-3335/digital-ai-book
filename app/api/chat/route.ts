import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage, ChatMessage } from '@/lib/deepseek';
import { getSystemPrompt, searchPochyBooks } from '@/lib/knowledge';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ChatRequestBody {
  messages: ChatMessage[];
  includeReasoning?: boolean;
}

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    // Check API key configuration
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: DeepSeek API key not configured.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: ChatRequestBody = await request.json();

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required.' },
        { status: 400 }
      );
    }

    // Validate message format
    for (const msg of body.messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          { error: 'Invalid message format: each message must have role and content.' },
          { status: 400 }
        );
      }
      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        return NextResponse.json(
          { error: 'Invalid message role: must be user, assistant, or system.' },
          { status: 400 }
        );
      }
    }

    // Get the last user message to check for Pochy books context
    const lastUserMessage = body.messages[body.messages.length - 1];
    let contextEnhancedPrompt = getSystemPrompt();

    // Search Pochy books for relevant context
    if (lastUserMessage?.role === 'user') {
      const pochyContext = searchPochyBooks(lastUserMessage.content);
      if (pochyContext) {
        contextEnhancedPrompt += `\n\n**Relevant Pochy Books Content:**\n${pochyContext}`;
      }
    }

    // Log the request (basic logging)
    console.log(`[${new Date().toISOString()}] Chat request from ${ip}: ${lastUserMessage?.content?.substring(0, 100)}...`);

    // Send message to DeepSeek
    const response = await sendChatMessage(body.messages, contextEnhancedPrompt);

    // Handle errors from DeepSeek
    if (response.error) {
      console.error(`[${new Date().toISOString()}] DeepSeek error:`, response.error);
      return NextResponse.json(
        { error: response.error },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json({
      message: response.message,
      reasoning: body.includeReasoning ? response.reasoning : undefined,
    });

  } catch (error) {
    console.error('Chat API Error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'DeepSeek Chatbot API',
    timestamp: new Date().toISOString(),
  });
}
