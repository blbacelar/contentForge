export class YouTubeService {
  private static extractVideoId(url: string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[7]?.length === 11) {
      return match[7];
    }
    throw new Error('Invalid YouTube URL');
  }

  public static async getVideoTitle(videoId: string): Promise<string> {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`);
      if (!response.ok) throw new Error('Failed to fetch video title');
      const data = await response.json() as { title: string };
      return data.title;
    } catch (error) {
      console.error('Error fetching video title:', error);
      throw new Error('Failed to retrieve video title - Please check the URL');
    }
  }

  public static async getTranscript(youtubeUrl: string): Promise<string> {
    try {
      const response = await fetch('/api/youtube/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch transcript');
      }

      const { transcript } = await response.json();
      return transcript;
      
    } catch (error) {
      console.error('YouTube transcript error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to extract transcript'
      );
    }
  }
} 