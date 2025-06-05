
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/gemini';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, entityId, sessionId, context } = body;
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    // Generate AI response
    const response = await generateAIResponse(prompt);
    
    // Save interaction if entityId is provided
    if (entityId) {
      await prisma.aIInteraction.create({
        data: {
          entityId,
          sessionId,
          prompt,
          response,
          context,
          timestamp: new Date()
        }
      });
    }
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json({ 
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
