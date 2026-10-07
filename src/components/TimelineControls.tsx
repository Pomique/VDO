import React, { useRef } from 'react';
import { VideoScene, AspectRatio } from '../types';
import { THEMES, ThemeConfig } from '../utils/themes';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  UploadCloud,
  Layers,
  Monitor,
  Smartphone,
  Sparkles,
  Download,
} from 'lucide-react';

interface TimelineControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  aspectRatio: AspectRatio;
  theme: ThemeConfig;
  scenes: VideoScene[];
  currentScene: VideoScene;
  hasCustomAudio: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onThemeChange: (theme: ThemeConfig) => void;
  onAudioUpload: (file: File) => void;
  onOpenVeoModal: () => void;
  onOpenExportModal: () => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  playbackRate,
  aspectRatio,
  theme,
  scenes,
  currentScene,
  hasCustomAudio,
  onPlay,
  onPause,
  onSeek,
  onPlaybackRateChange,
  onAspectRatioChange,
  onThemeChange,
  onAudioUpload,
  onOpenVeoModal,
  onOpenExportModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAudioUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm space-y-3.5">
      {/* Top Bar: Ratio, Themes, Audio & Veo 3 */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-stone-100 dark:border-stone-800 pb-3">
        {/* Left: Aspect Ratio & Theme */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ratio Buttons */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onAspectRatioChange('16:9')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                aspectRatio === '16:9'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9 Pleine Largeur</span>
            </button>
            <button
              onClick={() => onAspectRatioChange('9:16')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                aspectRatio === '9:16'
                  ? 'bg-stone-800 text-white dark:bg-stone-700'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16 Vertical</span>
            </button>
          </div>

          {/* Theme Dropdown */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2.5 py-1.5 rounded-xl text-xs">
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={theme.id}
              onChange={(e) => onThemeChange(THEMES[e.target.value])}
              className="bg-transparent font-semibold text-stone-700 dark:text-stone-300 outline-none text-xs cursor-pointer"
            >
              {Object.values(THEMES).map((t) => (
                <option key={t.id} value={t.id} className="dark:bg-stone-900">
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Audio upload, Veo Generator & Export */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              hasCustomAudio
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 font-bold'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{hasCustomAudio ? 'Voix chargée' : 'Audio off'}</span>
          </button>

          {/* Veo 3 */}
          <button
            onClick={onOpenVeoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Veo 3</span>
          </button>

          {/* Export */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Scrubber Timeline */}
      <div className="space-y-1.5">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={handleSliderChange}
          className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-rose-600 focus:outline-none"
        />

        {/* Scene Segments Bar */}
        <div className="w-full flex gap-1 h-3.5">
          {scenes.map((sc) => {
            const widthPct = ((sc.endTime - sc.startTime) / duration) * 100;
            const isCurrent = sc.id === currentScene.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSeek(sc.startTime)}
                className={`h-full rounded text-[9px] font-bold px-1 overflow-hidden truncate transition-all text-left flex items-center ${
                  isCurrent
                    ? 'bg-rose-500 text-white shadow-sm ring-1 ring-rose-400'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
                style={{ width: `${widthPct}%` }}
                title={`${sc.title} (${formatTime(sc.startTime)} - ${formatTime(sc.endTime)})`}
              >
                {sc.index}. {sc.title.split(':')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Main Transport Controls */}
      <div className="flex items-center justify-between">
        {/* Left: Timecode */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
            {formatTime(currentTime)}
          </span>
          <span className="text-xs text-stone-400">/</span>
          <span className="font-mono text-xs text-stone-500">
            {formatTime(duration)}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 ml-2">
            Scène {currentScene.index}/{scenes.length}
          </span>
        </div>

        {/* Center: Playback Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSeek(0)}
            className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
            title="Revenir au début"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSeek(Math.max(0, currentTime - 5))}
            className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
            title="-5 secondes"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-11 h-11 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-md transition-all active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause' : 'Lecture'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onSeek(Math.min(duration, currentTime + 5))}
            className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
            title="+5 secondes"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Playback Speed */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
          <span>Vitesse :</span>
          {[0.75, 1, 1.25].map((rate) => (
            <button
              key={rate}
              onClick={() => onPlaybackRateChange(rate)}
              className={`px-2 py-0.5 rounded transition-all ${
                playbackRate === rate
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
