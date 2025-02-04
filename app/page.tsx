'use client'

import { motion } from "framer-motion";
import { useState } from "react";
import { YouTubeService } from '@/lib/services/youtube.service';
import { toast } from 'sonner'
// import { checkAPIHealth } from '@/config/api';
import TranscriptForm from '@/components/transcript-form';
import GeneratedContent from '@/components/generated-content';
import StatusMessage from '@/components/status-message';
import type { ScriptScene } from '@/types/content-types';

interface APIScriptScene {
  sceneId: string;
  narration: { text: string; keyPoints: string[]; steps: string[] };
  visual: { description: string; elements: string[] };
  type: string;
  duration: number;
  platform: Record<string, unknown>;
}

export default function ContentForge() {
  const [activeTab, setActiveTab] = useState('youtube');
  const [activeContentTab, setActiveContentTab] = useState<'captions' | 'script' | 'pdf'>('captions');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [textInput, setTextInput] = useState('');
  const [generatedItems, setGeneratedItems] = useState<ScriptScene[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      if (activeTab === 'youtube' || activeTab === 'text') {
        let content;
        
        if (activeTab === 'youtube') {
          try {
            content = await YouTubeService.getTranscript(youtubeUrl);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to get YouTube transcript');
            setIsGenerating(false);
            return;
          }
        } else {
          content = textInput;
        }

        try {
          const [captionsResponse, scriptsResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BE_URL}${process.env.NEXT_PUBLIC_API_BASE_URL}/text/captions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: content,
                language: 'en-US'
              })
            }),
            fetch(`${process.env.NEXT_PUBLIC_BE_URL}${process.env.NEXT_PUBLIC_API_BASE_URL}/text/script`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: content,
                language: 'en-US'
              })
            })
          ]);

          const [, scriptsResult] = await Promise.all([        
            captionsResponse.json(),
            scriptsResponse.json()
          ]);

          if (!captionsResponse.ok || !scriptsResponse.ok) {
            throw new Error('Failed to generate content. Please try again.');
          }

          if (!scriptsResult?.script?.scenes) {
            throw new Error('Invalid response format. Please try again.');
          }

          const items = scriptsResult.script.scenes.map((scene: APIScriptScene) => ({
            sceneId: scene.sceneId,
            narration: { text: scene.narration.text },
            visual: { description: scene.visual.description }
          }));

          setGeneratedItems(items);
          toast.success('Content generated successfully!');
        } catch (error) {
          console.error('Generation error:', error);
          toast.error(`${error instanceof Error ? error.message : 'Failed to generate content'}`);
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <h1 className="text-3xl font-bold text-center">Content Generator</h1>
        
        <TranscriptForm
          activeTab={activeTab}
          youtubeUrl={youtubeUrl}
          textInput={textInput}
          onTabChange={setActiveTab}
          onYoutubeUrlChange={setYoutubeUrl}
          onTextInputChange={setTextInput}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border rounded-lg p-6"
        >
          <StatusMessage 
            isGenerating={isGenerating}
            generatedItems={generatedItems.filter(item => typeof item !== 'string')}
          />
          
          {!isGenerating && generatedItems.length > 0 && (
            <GeneratedContent
              activeContentTab={activeContentTab}
              generatedItems={generatedItems}
              onContentTabChange={setActiveContentTab}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
