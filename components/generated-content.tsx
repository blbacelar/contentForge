'use client'

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ScriptScene } from "@/types/content-types";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/motion-button";

interface GeneratedContentProps {
  activeContentTab: 'captions' | 'script' | 'pdf';
  generatedItems: Array<ScriptScene>;
  onContentTabChange: (value: 'captions' | 'script' | 'pdf') => void;
}

export default function GeneratedContent(props: GeneratedContentProps) {
  return (
    <Tabs 
      value={props.activeContentTab} 
      onValueChange={(value: string) => props.onContentTabChange(value as 'captions' | 'script' | 'pdf')}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="captions">Captions</TabsTrigger>
        <TabsTrigger value="script">Video Script</TabsTrigger>
      </TabsList>

      <TabsContent value="captions" className="mt-4 space-y-4">
        {props.generatedItems.map((item, index) => (
          <Card key={index} className="p-4 border border-border bg-card text-card-foreground shadow-sm group relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-red-500">Caption #{index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => navigator.clipboard.writeText(item.narration?.text || '')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {item.narration?.text}
            </p>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="script" className="mt-4 space-y-4">
        {props.generatedItems.map((item, index) => (
          <Card key={index} className="p-4 border border-border bg-card text-card-foreground shadow-sm group relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-red-500">Scene #{index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => navigator.clipboard.writeText(
                  `${item.narration?.text}\n${item.visual?.description ? `Visual: ${item.visual.description}` : ''}`
                )}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {item.narration?.text}
              </p>
              {item.visual?.description && (
                <p className="text-xs text-muted-foreground mt-2">
                  Visual: {item.visual.description}
                </p>
              )}
            </div>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
} 