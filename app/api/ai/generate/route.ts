import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { type, content, language } = body;

    // For testing, let's return some mock data
    const mockCaptions = content.split('.').filter(Boolean).map(sentence => sentence.trim());

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      captions: mockCaptions,
      message: 'Content generated successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process request' 
      },
      { status: 500 }
    );
  }
} 