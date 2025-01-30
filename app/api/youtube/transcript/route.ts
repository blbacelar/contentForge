import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    const videoId = extractVideoId(url);
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    return NextResponse.json({
      transcript: transcriptItems.map(item => item.text).join(' ')
    });
    
  } catch (error) {
    console.error('YouTube transcript error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}

function extractVideoId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  if (match?.[7]?.length === 11) return match[7];
  throw new Error('Invalid YouTube URL');
} 