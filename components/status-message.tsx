'use client'

import { Loader2 } from "lucide-react";
import type { ScriptScene } from "@/types/content-types";

interface StatusMessageProps {
  isGenerating: boolean;
  generatedItems: ScriptScene[];
}

export default function StatusMessage(props: StatusMessageProps) {
  if (props.isGenerating) {
    return (
      <div className="flex items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Generating content...
      </div>
    );
  }

  if (props.generatedItems.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Your generated content will appear here
      </div>
    );
  }

  return null;
} 