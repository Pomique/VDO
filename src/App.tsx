import React, { useState, useEffect, useRef, useMemo } from 'react';
import { INITIAL_SCENES, TOTAL_AUDIO_DURATION } from './data/scenes';
import { VideoScene, AspectRatio } from './types';
import { THEMES, ThemeConfig } from './utils/themes';
import { SynchronizedAudioEngine } from './utils/audioController';
import { VideoCanvas } from './components/VideoCanvas';
import { TimelineControls } from './components/TimelineControls';
import { SceneEditor } from './components/SceneEditor';
import { VeoGeneratorModal } from './components/VeoGeneratorModal';
import { ExportModal } from './components/ExportModal';
import {
  Sparkles,
  ShieldCheck,
  Film,
  Music,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Maximize2,
  Tv,
} from 'lucide-react';

export default function App() {
  const [scenes, setScenes] = useState<VideoScene[]>(INITIAL_SCENES);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [theme, setTheme] = useState<ThemeConfig>(THEMES['minimal-cream']);
  const [hasCustomAudio, setHasCustomAudio] = useState<boolean>(false);

  // Modals state
  const [isVeoModalOpen, setIsVeoModalOpen] = useState<boolean>(false);
  const [targetVeoScene, setTargetVeoScene] = useState<VideoScene | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Audio Engine instance
  const audioEngineRef = useRef<SynchronizedAudioEngine | null>(null);

  useEffect(() => {
    const engine = new SynchronizedAudioEngine();
    audioEngineRef.current = engine;

    engine.setOnTimeUpdate((time) => {
      setCurrentTime(time);
    });

    engine.setOnPlayStateChange((playing) => {
      setIsPlaying(playing);
    });

    return () => {
      engine.cleanup();
    };
  }, []);

  // Compute current scene based on currentTime
  const currentScene = useMemo(() => {
    const found = scenes.find(
      (s) => currentTime >= s.startTime && currentTime < s.endTime
    );
    return found || scenes[scenes.length - 1];
  }, [scenes, currentTime]);

  const handlePlay = () => {
    audioEngineRef.current?.play();
  };

  const handlePause = () => {
    audioEngineRef.current?.pause();
  };

  const handleSeek = (time: number) => {
    audioEngineRef.current?.seek(time);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    audioEngineRef.current?.setPlaybackRate(rate);
  };

  const handleAudioUpload = (file: File) => {
    if (audioEngineRef.current) {
      audioEngineRef.current.setCustomAudio(file);
      setHasCustomAudio(true);
    }
  };

  const handleSelectScene = (scene: VideoScene) => {
    handleSeek(scene.startTime);
  };

  const handleUpdateScene = (updated: VideoScene) => {
    setScenes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleOpenVeoForScene = (scene: VideoScene) => {
    setTargetVeoScene(scene);
    setIsVeoModalOpen(true);
  };

  const handleOpenVeoGlobal = () => {
    setTargetVeoScene(null);
    setIsVeoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold tracking-tight">
                PhishGuard Video Studio
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                Format TikTok 01:05 (65s)
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Génération de vidéo explicative minimaliste synchronisée & Veo 3
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenVeoGlobal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Générer avec Veo 3</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Full-Width Video Canvas + Player Controls (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col items-center gap-4">
          {/* Canvas Wrapper */}
          <div className="w-full flex justify-center bg-stone-200/50 dark:bg-stone-900/40 p-4 md:p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800/80">
            <VideoCanvas
              currentScene={currentScene}
              currentTime={currentTime}
              aspectRatio={aspectRatio}
              theme={theme}
              showSubtitles={true}
            />
          </div>

          {/* Timeline & Controls */}
          <TimelineControls
            currentTime={currentTime}
            duration={TOTAL_AUDIO_DURATION}
            isPlaying={isPlaying}
            playbackRate={playbackRate}
            aspectRatio={aspectRatio}
            theme={theme}
            scenes={scenes}
            currentScene={currentScene}
            hasCustomAudio={hasCustomAudio}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            onPlaybackRateChange={handlePlaybackRateChange}
            onAspectRatioChange={setAspectRatio}
            onThemeChange={setTheme}
            onAudioUpload={handleAudioUpload}
            onOpenVeoModal={handleOpenVeoGlobal}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />

          {/* Audio synchronization status card */}
          <div className="w-full p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-stone-800 dark:text-stone-200">
                  {hasCustomAudio
                    ? 'Fichier audio personnalisé actif'
                    : 'Horloge audio synchronisée intégrée'}
                </div>
                <div className="text-[11px] text-stone-500">
                  {hasCustomAudio
                    ? 'La vidéo est synchronisée directement sur votre fichier.'
                    : 'Le rythme respecte scrupuleusement les 65 secondes (1min 05s) en plein écran.'}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold">
              65.0s (01:05)
            </span>
          </div>
        </div>

        {/* Right Column: Scene Breakdown, Script & Direction (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <SceneEditor
            scenes={scenes}
            activeSceneId={currentScene.id}
            onSelectScene={handleSelectScene}
            onUpdateScene={handleUpdateScene}
            onGenerateVeoForScene={handleOpenVeoForScene}
          />
        </div>
      </main>

      {/* Veo 3 Generator Modal */}
      <VeoGeneratorModal
        isOpen={isVeoModalOpen}
        onClose={() => setIsVeoModalOpen(false)}
        targetScene={targetVeoScene}
        defaultAspectRatio={aspectRatio}
      />

      {/* Export Direct Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        aspectRatio={aspectRatio}
        duration={TOTAL_AUDIO_DURATION}
      />
    </div>
  );
}
