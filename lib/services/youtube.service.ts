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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}${process.env.NEXT_PUBLIC_API_BASE_URL}/youtube/transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: youtubeUrl,
          language: 'pt-BR'
        })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Unable to process YouTube response. Please try again.');
      }

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 429) {
          throw new Error('YouTube is temporarily unavailable due to high traffic. Please try again in a few minutes.');
        }
        
        if (data?.code === 'CAPTCHA_REQUIRED') {
          throw new Error('YouTube requires verification. Please try watching a video on YouTube first.');
        }

        const errorMessage = this.getReadableErrorMessage(data);
        throw new Error(errorMessage);
      }

      if (!data || !data.transcript) {
        throw new Error('No transcript was found for this video. Please try another video.');
      }

      const { transcript } = data;
      if (Array.isArray(transcript)) {
        return transcript
          .map(item => item.text)
          .join(' ');
      }
      
      throw new Error('The transcript format is invalid. Please try another video.');
    } catch (error) {
      console.error('YouTube transcript error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Rethrow with user-friendly message
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Unable to get video transcript. Please try again later.'
      );
    }
  }

  private static getReadableErrorMessage(data: Record<string, unknown>): string {
    // Handle API error structure

    console.log(`data: ${JSON.stringify(data, null, 2)}`);
    
    if (data.error && typeof data.error === 'object') {
      const apiError = data.error as Record<string, unknown>;
      if (apiError.message) {
        return apiError.message as string;
      }
    }

    // Handle direct message field
    if (data.message) {
      return data.message as string;
    }

    // Existing fallback logic
    const defaultMessage = 'Failed to fetch transcript. Please try again.';
    const errorMessages: Record<string, string> = {
      429: 'YouTube is temporarily unavailable due to high traffic. Please try again in a few minutes.',
      'CAPTCHA_REQUIRED': 'YouTube requires verification. Please try watching a video on YouTube first.',
      'INVALID_URL': 'Please enter a valid YouTube URL.',
      'NO_TRANSCRIPT': 'This video doesn\'t have a transcript available.',
      'LANGUAGE_NOT_FOUND': 'Transcript is not available in the requested language.'
    };

    const code = String(data.code || '');
    return errorMessages[code] || defaultMessage;
  }
} 