import { YoutubeTranscript } from 'youtube-transcript';

export class YouTubeService {
  private static extractVideoId(url: string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[7].length === 11) {
      return match[7];
    }
    throw new Error('Invalid YouTube URL');
  }

  public static async getTranscript(youtubeUrl: string): Promise<string> {
    try {
      const videoId = this.extractVideoId(youtubeUrl);
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
      
      return transcriptItems
        .map(item => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    } catch (error) {
      console.error('Error extracting transcript:', error);
      throw new Error('Failed to extract transcript from video');
    }
  }
} 