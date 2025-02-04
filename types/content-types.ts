export interface ScriptScene {
  sceneId?: string;
  narration?: {
    text?: string;
  };
  visual?: {
    description?: string;
  };
}

// Add this export to ensure the file is recognized as a module
export type { ScriptScene as _ScriptScene }; 