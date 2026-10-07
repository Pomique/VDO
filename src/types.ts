export type AspectRatio = '16:9' | '9:16';

export type ThemePreset = 'slate-cream' | 'dark-cyber' | 'minimal-light' | 'navy-amber';

export interface DynamicCaption {
  id: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  shortText: string; // 10-12 words max
  highlightWord: string;
  badge?: string;
}

export interface SceneVisualConfig {
  type:
    | 'sms-hook'
    | 'stat-phishing'
    | 'fraud-roles'
    | 'question-reflex'
    | 'link-inspect'
    | 'no-click'
    | 'report-spam'
    | 'os-settings'
    | 'final-reflex';
  badge?: string;
  headline: string;
  subtext?: string;
  keywords: string[];
  primaryIconName: string;
  comparison?: {
    real: string;
    fake: string;
    fakeHighlight: string;
  };
  statValue?: string;
  statLabel?: string;
  steps?: { title: string; desc: string; icon: string }[];
}

export interface VideoScene {
  id: string;
  index: number;
  title: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  scriptText: string;
  screenDisplay: string;
  animationDesc: string;
  visual: SceneVisualConfig;
  veoPromptSuggestion: string;
}

export interface VeoGenerationStatus {
  status: 'idle' | 'starting' | 'polling' | 'completed' | 'error';
  operationName?: string;
  progressMessage?: string;
  videoBlobUrl?: string;
  errorMessage?: string;
}
