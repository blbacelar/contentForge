// import 'server-only';
// import OpenAI from 'openai';
// import { env } from '@/config/environment';
// import type { LanguageCode } from '@/types/language';
// import { prompts } from '@/config/prompts';

// type ContentType = 'summary' | 'expertise' | 'variation' | 'captions';

// export class DeepSeekService {
//   private static instance: OpenAI;

//   private static getInstance(): OpenAI {
//     if (!this.instance) {
//       this.instance = new OpenAI({
//         baseURL: 'https://api.deepseek.com/v1',
//         apiKey: env.deepseekApiKey,
//         defaultHeaders: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${env.deepseekApiKey}`
//         }
//       });
//     }
//     return this.instance;
//   }

//   public static async generateContent(
//     type: ContentType,
//     content: string,
//     language: LanguageCode = 'en-US'
//   ): Promise<string> {
//     if (typeof window !== 'undefined') {
//       throw new Error('DeepSeekService should only be used server-side');
//     }

//     try {
//       const openai = this.getInstance();
//       const { systemPrompt, userPrompt } = this.getPrompts(
//         type, 
//         language,
//         content
//       );
      
//       console.log(`Sending ${type} generation request to DeepSeek`, {
//         systemPrompt: systemPrompt.substring(0, 50) + '...',
//         userPrompt: userPrompt.substring(0, 50) + '...',
//         contentLength: content.length
//       });

//       const response = await openai.chat.completions.create({
//         model: "deepseek-chat",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userPrompt }
//         ],
//         temperature: this.getTemperature(type),
//         max_tokens: this.getMaxTokens(type),
//       });

//       const result = response.choices[0]?.message?.content?.trim() || '';
//       console.log(`Received ${type} generation result:`, result.substring(0, 100) + '...');
      
//       return result;
      
//     } catch (error) {
//       console.error(`DeepSeek API error during ${type} generation:`, {
//         error: error instanceof Error ? error.message : 'Unknown error',
//         stack: error instanceof Error ? error.stack : undefined
//       });
//       throw error;
//     }
//   }

//   private static getPrompts(
//     type: ContentType, 
//     language: LanguageCode,
//     content: string
//   ) {
//     const languageMap = {
//       'en-US': 'American English',
//       'es-ES': 'Spanish',
//       'pt-BR': 'Brazilian Portuguese'
//     };

//     const basePrompts = {
//       summary: {
//         system: `You are a professional content summarizer. Write in ${languageMap[language]}. Create a concise and engaging summary:`,
//         user: 'Summarize this content:'
//       },
//       expertise: {
//         system: `Identify 2-4 key expertise areas from this content. Use commas to separate. Example: "AI, Machine Learning". Language: ${languageMap[language]}`,
//         user: 'Extract expertise areas from:'
//       },
//       variation: {
//         system: `Generate unique variations of this content in ${languageMap[language]}. Separate with '---'`,
//         user: 'Create variations of:'
//       }
//     };

//     return {
//       systemPrompt: basePrompts[type].system,
//       userPrompt: `${basePrompts[type].user}\n\n${content}`
//     };
//   }

//   private static getTemperature(type: ContentType): number {
//     return {
//       summary: 0.7,
//       expertise: 0.5,
//       variation: 1.0,
//       captions: 0.5
//     }[type];
//   }

//   private static getMaxTokens(type: ContentType): number {
//     return {
//       summary: 500,
//       expertise: 100,
//       variation: 1000,
//       captions: 800
//     }[type];
//   }
// } 