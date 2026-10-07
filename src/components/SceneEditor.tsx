import React, { useState } from 'react';
import { VideoScene } from '../types';
import { DYNAMIC_CAPTIONS } from '../data/captions';
import { Clock, Eye, Film, Play, Sparkles, Check, Edit2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface SceneEditorProps {
  scenes: VideoScene[];
  activeSceneId: string;
  onSelectScene: (scene: VideoScene) => void;
  onUpdateScene: (updated: VideoScene) => void;
  onGenerateVeoForScene: (scene: VideoScene) => void;
}

export const SceneEditor: React.FC<SceneEditorProps> = ({
  scenes,
  activeSceneId,
  onSelectScene,
  onUpdateScene,
  onGenerateVeoForScene,
}) => {
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [expandedSceneId, setExpandedSceneId] = useState<string | null>(activeSceneId);

  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Découpage des Scènes & Synchronisation Audio</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-semibold">
              9 scènes • 01:05 (65s)
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Synchronisation précise seconde par seconde selon l'enregistrement vocal. Cliquez sur une scène pour la prévisualiser.
          </p>
        </div>
      </div>

      {/* List of Scenes */}
      <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
        {scenes.map((scene) => {
          const isActive = scene.id === activeSceneId;
          const isExpanded = expandedSceneId === scene.id;
          const isEditing = editingSceneId === scene.id;

          return (
            <div
              key={scene.id}
              className={`rounded-xl border transition-all ${
                isActive
                  ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900'
              }`}
            >
              {/* Scene Header Row */}
              <div
                className="p-3 flex items-center justify-between cursor-pointer select-none"
                onClick={() => {
                  onSelectScene(scene);
                  setExpandedSceneId(isExpanded ? null : scene.id);
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isActive
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    0{scene.index}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {scene.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5 font-mono">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>
                        {formatTime(scene.startTime)} ➔ {formatTime(scene.endTime)} (
                        {(scene.endTime - scene.startTime).toFixed(0)}s)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectScene(scene);
                    }}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-all text-xs flex items-center gap-1"
                    title="Lire à partir de cette scène"
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateVeoForScene(scene);
                    }}
                    className="p-1.5 rounded-lg bg-violet-100 hover:bg-violet-200 dark:bg-violet-950/50 dark:hover:bg-violet-900 text-violet-700 dark:text-violet-300 transition-all text-xs flex items-center gap-1 font-semibold"
                    title="Générer cette scène avec Veo 3"
                  >
                    <Sparkles className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                    <span className="hidden sm:inline">Veo 3</span>
                  </button>

                  <div className="text-stone-400 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Scene Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-stone-100 dark:border-stone-800/80 space-y-3 text-xs">
                  {/* Voice Script */}
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] flex items-center justify-between">
                      <span>Voix Off (Audio Synchronisé)</span>
                      <button
                        onClick={() => setEditingSceneId(isEditing ? null : scene.id)}
                        className="text-rose-600 hover:underline flex items-center gap-1 font-normal lowercase"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                        {isEditing ? 'fermer' : 'modifier'}
                      </button>
                    </div>

                    {isEditing ? (
                      <textarea
                        value={scene.scriptText}
                        onChange={(e) =>
                          onUpdateScene({ ...scene, scriptText: e.target.value })
                        }
                        rows={2}
                        className="w-full p-2 text-xs border rounded-lg bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 outline-none"
                      />
                    ) : (
                      <p className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 italic leading-relaxed border border-stone-100 dark:border-stone-800">
                        « {scene.scriptText} »
                      </p>
                    )}
                  </div>

                  {/* Visual Screen Display */}
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Eye className="w-3 h-3 text-stone-400" />
                      <span>Ce qui est affiché à l'écran (Minimalisme & Pictogrammes)</span>
                    </div>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed bg-amber-500/5 p-2 rounded-lg border border-amber-500/20">
                      {scene.screenDisplay}
                    </p>
                  </div>

                  {/* Planned Animation */}
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Film className="w-3 h-3 text-stone-400" />
                      <span>Animation prévue & Transitions douces</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed bg-blue-500/5 p-2 rounded-lg border border-blue-500/20">
                      {scene.animationDesc}
                    </p>
                  </div>

                  {/* Dynamic Short Captions for TikTok (<12 words, changing every 2-3s) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-rose-500" />
                      <span>Sous-titres courts TikTok (&lt; 12 mots, dynamiques toutes les 2-3s)</span>
                    </div>
                    <div className="space-y-1">
                      {DYNAMIC_CAPTIONS.filter(
                        (c) => c.startTime >= scene.startTime && c.startTime < scene.endTime
                      ).map((cap) => (
                        <div
                          key={cap.id}
                          className="flex items-center justify-between p-1.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[11px]"
                        >
                          <span className="font-medium">
                            « {cap.shortText} »
                          </span>
                          <span className="text-[10px] font-mono opacity-60 ml-2 whitespace-nowrap">
                            {cap.startTime.toFixed(0)}s-{cap.endTime.toFixed(0)}s
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
