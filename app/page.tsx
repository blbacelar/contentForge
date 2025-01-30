'use client'

import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/motion-button";
import { Card } from "@/components/ui/card";
import { Wand, Link2, FileText, Copy, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react"
import { YouTubeService } from '@/lib/services/youtube.service';
import { toast } from 'sonner'

export default function ContentForge() {
  const [activeOutputTab, setActiveOutputTab] = React.useState<string>("captions")
  const [generatedItems, setGeneratedItems] = React.useState<Array<{id: number; content: string; type: 'caption' | 'hook'}>>([])
  const [youtubeUrl, setYoutubeUrl] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false);
  const [textInput, setTextInput] = React.useState('');
  const [activeInputTab, setActiveInputTab] = React.useState('text');

  async function handleGenerate() {
    try {
      setIsLoading(true);
      setGeneratedItems([]);
      console.log('Starting generation with input type:', activeInputTab);

      if (activeInputTab === 'text' && textInput.trim()) {
        console.log('Processing text input:', textInput.substring(0, 50) + '...');
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          body: JSON.stringify({
            type: 'variation',
            content: textInput,
            language: 'en-US'
          })
        });
        
        console.log('API response status:', response.status);
        if (!response.ok) {
          const errorBody = await response.text();
          console.error('API error response:', errorBody);
          throw new Error(`Generation failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('API Response Structure:', {
          status: response.status,
          keys: Object.keys(result),
          captionsExists: Array.isArray(result.captions),
          rawResult: result
        });
        
        if (!result?.captions) {
          console.error('Missing captions in response:', result);
          toast.error(result?.error?.message || result?.message || 'Malformed API response');
          throw new Error(result?.error || 'Malformed API response');
        }
        
        setGeneratedItems(result.captions.map((c: string, i: number) => 
          ({id: i, content: c, type: 'caption' as const})));
        toast.success('Captions generated successfully!');
      }

      // For YouTube URLs
      if (activeInputTab === 'url' && youtubeUrl) {
        const transcript = await YouTubeService.getTranscript(youtubeUrl);
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'youtube',
            input: transcript,
            language: 'en-US',
            userId: 'current-user-id'
          })
        });
        
        const result = await response.json();
        console.log('YouTube API Response Structure:', {
          status: response.status,
          keys: Object.keys(result),
          captionsExists: Array.isArray(result.captions)
        });
        
        if (!result?.captions) {
          console.error('YouTube response missing captions:', result);
          toast.error(result?.error || 'Failed to generate from YouTube video');
          throw new Error('YouTube processing failed');
        }
        
        setGeneratedItems(result.captions.map((c: string, i: number) => 
          ({id: i, content: c, type: 'caption' as const})));
        toast.success('YouTube captions generated!');
      }

      // For PDFs is handled separately in handlePDFUpload
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate captions');
    } finally {
      setIsLoading(false);
    }
  }

  // Update handlePDFUpload function
  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/process-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to process PDF');
        
        const { text } = await response.json();
        const hooksResponse = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'pdf',
            input: text,
            language: 'en-US',
            userId: 'current-user-id'
          })
        });

        if (!hooksResponse.ok) {
          const errorData = await hooksResponse.json();
          throw new Error(errorData.error || 'Failed to generate from PDF');
        }

        const result = await hooksResponse.json();
        console.log('PDF API Response Structure:', {
          status: hooksResponse.status,
          keys: Object.keys(result),
          captionsExists: Array.isArray(result.captions)
        });

        if (!result?.captions) {
          console.error('PDF response missing captions:', result);
          toast.error('No captions found in PDF response');
          return;
        }

        setGeneratedItems(prev => [
          ...prev,
          ...result.captions.map((c: string, i: number) => ({
            id: i + prev.length,
            content: c,
            type: 'hook' as const
          }))
        ]);
      } catch (error) {
        console.error('PDF upload error:', error);
        toast.error(error instanceof Error ? error.message : 'PDF processing failed');
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <motion.div 
        className="w-full max-w-4xl relative z-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-background/90 backdrop-blur-lg p-8 space-y-6 shadow-xl relative z-10">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 5, scale: 1.1 }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 3 }}
            >
              <Sparkles className="h-16 w-16 mx-auto text-red-500" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              ContentForge
            </h1>
            <p className="text-muted-foreground text-lg">
              Transform any input into viral content pieces
            </p>
          </div>

          <Tabs 
            defaultValue="text" 
            className="w-full"
            onValueChange={setActiveInputTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text"><FileText className="w-4 h-4 mr-2" />Text</TabsTrigger>
              <TabsTrigger value="url"><Link2 className="w-4 h-4 mr-2" />URL</TabsTrigger>
              <TabsTrigger value="pdf"><FileText className="w-4 h-4 mr-2" />PDF</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <Textarea 
                className="min-h-[150px] text-lg bg-background/80"
                placeholder="Paste your text or article..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="url">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Enter YouTube URL or webpage link"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="pdf">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag & drop PDF or click to upload</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="application/pdf" 
                    onChange={handlePDFUpload}
                  />
                </label>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 justify-end">
            <Button 
              variant="gradient"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg group"
              size="lg"
              onClick={handleGenerate}
              disabled={isLoading || (
                (activeInputTab === 'text' && !textInput.trim()) ||
                (activeInputTab === 'url' && !youtubeUrl) ||
                (activeInputTab === 'pdf' && generatedItems.length === 0)
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Wand className="h-5 w-5" />
                  </motion.div>
                  Generating...
                </div>
              ) : (
                <>
                  <Wand className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeOutputTab} onValueChange={setActiveOutputTab}>
            <TabsList className="w-full">
              <TabsTrigger value="captions" className="w-1/3">Captions (30)</TabsTrigger>
              <TabsTrigger value="scripts" className="w-1/3">Scripts</TabsTrigger>
              <TabsTrigger value="hooks" className="w-1/3">Hooks</TabsTrigger>
            </TabsList>

            <TabsContent value="captions" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {generatedItems
                .filter(item => item.type === 'caption')
                .map((item) => (
                  <Card key={item.id} className="p-4 group relative">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-primary">Caption #{item.id + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => navigator.clipboard.writeText(item.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.content}
                    </p>
                  </Card>
                ))}
            </TabsContent>

            {/* Similar structure for scripts and hooks tabs */}
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
