'use client'

import { Button } from "@/components/ui/motion-button";
import { Wand, Link2, FileText, FileDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface TranscriptFormProps {
  activeTab: string;
  youtubeUrl: string;
  textInput: string;
  onTabChange: (value: string) => void;
  onYoutubeUrlChange: (value: string) => void;
  onTextInputChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function TranscriptForm(props: TranscriptFormProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // Handle PDF file
      console.log('PDF file selected:', file);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={props.activeTab} onValueChange={props.onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-background/80">
          <TabsTrigger 
            value="youtube" 
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            <Link2 className="mr-2 h-4 w-4" />
            YouTube URL
          </TabsTrigger>
          <TabsTrigger 
            value="text"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            Text Input
          </TabsTrigger>
          <TabsTrigger 
            value="pdf"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            <FileDown className="mr-2 h-4 w-4" />
            PDF
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {props.activeTab === 'youtube' ? (
        <div className="space-y-2">
          <input
            className="w-full p-2 border rounded-lg bg-background/80 border-border hover:border-red-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            placeholder="Enter YouTube URL"
            value={props.youtubeUrl}
            onChange={(e) => props.onYoutubeUrlChange(e.target.value)}
          />
        </div>
      ) : props.activeTab === 'text' ? (
        <div className="space-y-2">
          <textarea
            className="w-full p-2 border rounded-lg min-h-[100px] bg-background/80 border-border hover:border-red-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            placeholder="Paste your text here"
            value={props.textInput}
            onChange={(e) => props.onTextInputChange(e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>
      )}

      <Button 
        onClick={props.onGenerate}
        disabled={props.isGenerating}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
      >
        <Wand className="mr-2 h-4 w-4" />
        {props.isGenerating ? 'Generating...' : 'Generate Content'}
      </Button>
    </div>
  );
} 