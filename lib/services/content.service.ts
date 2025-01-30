// import type { LanguageCode } from '@/types/language';

// import { DeepSeekService } from '@/lib/services/deepseek.service';
// import { YouTubeService } from './youtube.service';
// import { PDFService } from './pdf.service';

// type ContentSource = 'youtube' | 'pdf' | 'text';

// export class ContentService {
//   public static async processContent(
//     source: ContentSource,
//     input: string | Buffer,
//     language: string = 'en-US'
//   ) {
//     console.log(`Processing ${source} content`);
//     let rawText = '';

//     console.log('Raw text:', input);

//     try {
//       switch (source) {
//         case 'youtube':
//           console.log('Fetching YouTube transcript for:', input);
//           rawText = await YouTubeService.getTranscript(input as string);
//           break;
//         case 'pdf':
//           console.log('Parsing PDF buffer of length:', (input as Buffer).length);
//           rawText = await PDFService.parsePDF(input as Buffer);
//           break;
//         case 'text':
//           rawText = input as string;
//           console.log('Processing text input of length:', rawText.length);
//           console.log('Raw text:', rawText);
//           break;
//       }
      
//       console.log('Raw text length:', rawText.length);
//       console.log('Starting AI generation...');

//       const [summary, expertise, variations] = await Promise.all([
//         DeepSeekService.generateContent('summary', rawText, language as LanguageCode),
//         DeepSeekService.generateContent('expertise', rawText, language as LanguageCode),
//         DeepSeekService.generateContent('variation', rawText, language as LanguageCode)
//       ]);

//       console.log('Generation results:', {
//         summaryLength: summary.length,
//         expertiseCount: expertise.split(',').length,
//         variationsCount: variations.split('---').length
//       });

//       return {
//         summary,
//         expertise: expertise.split(',').map(e => e.trim()),
//         variations: variations.split('---').map(v => v.trim())
//       };
      
//     } catch (error) {
//       console.error(`Content processing failed for ${source}:`, error);
//       throw error;
//     }
//   }

//   async processContent(source: string, input: string, language: string) {
//     const summary = await DeepSeekService.generateContent('summary', input, language as LanguageCode);
//     const variations = await DeepSeekService.generateContent('variation', input, language as LanguageCode);
    
//     return {
//       source,
//       summary,
//       expertise: await DeepSeekService.generateContent('expertise', input, language as LanguageCode),
//       variations: variations.split('\n').filter(Boolean)
//     };
//   }
// } 