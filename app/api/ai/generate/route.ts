import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/config/environment';
import { LANGUAGE_CODES } from '@/types/language';
import { prompts } from '@/config/prompts';

const schema = z.object({
  type: z.enum(['summary', 'expertise', 'variation', 'captions']),
  content: z.string().max(5000),
  language: z.enum(LANGUAGE_CODES).optional()
});

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = schema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { content, language = 'en-US' } = validation.data;
    const apiKey = env.deepseekApiKey;

    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY environment variable is not set');
    }

    const languageMap = {
      'en-US': 'American English',
      'es-ES': 'Spanish', 
      'pt-BR': 'Brazilian Portuguese'
    };

    const { systemPrompt, userPrompt } =  {
          systemPrompt: prompts.captions.system(languageMap[language]),
          userPrompt: prompts.captions.user(null, content, null)
        }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: systemPrompt + userPrompt
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('DeepSeek API Response Structure:', {
      status: response.status,
      dataKeys: Object.keys(data),
      choicesExists: !!data.choices,
      messageContent: data.choices?.[0]?.message?.content
    });

    const result = data.choices[0]?.message?.content?.trim() || '';
    console.log('Processed Result:', result);

    return NextResponse.json({ 
      success: true, 
      captions: result.split('\n').filter(Boolean) // Convert result to captions array
    });
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: 'Content generation failed' },
      { status: 500 }
    );
  }
} 