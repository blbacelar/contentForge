import { prisma } from './prisma.service';
import { ContentResult } from '../../types';

export class DatabaseService {
  public static async saveContentResult(
    userId: string,
    result: ContentResult
  ): Promise<void> {
    await prisma.contentResult.create({
      data: {
        userId,
        summary: result.summary,
        expertiseAreas: result.expertise,
        variations: result.variations,
        captions: result.captions
      }
    });
  }

  public static async getHistory(userId: string): Promise<ContentResult[]> {
    const results = await prisma.contentResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return results.map(result => ({
      ...result,
      expertise: result.expertiseAreas
    }));
  }
} 