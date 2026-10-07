import React, { useState, useEffect } from 'react';
import { AspectRatio, VideoScene } from '../types';
import {
  X,
  Sparkles,
  Loader2,
  Download,
  AlertCircle,
  Play,
  CheckCircle2,
  RefreshCw,
  Video,
} from 'lucide-react';

interface VeoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetScene: VideoScene | null;
  defaultAspectRatio: AspectRatio;
}

const REASSURING_MESSAGES = [
  "Initialisation du modèle Veo 3 (veo-3.1-fast-generate-preview)...",
  "Composition graphique des pictogrammes épurés et du fond minimaliste...",
  "Génération de l'animation vectorielle 2D et des trajectoires fluides...",
  "Contrôle de l'harmonie des contrastes et de la lisibilité des textes...",
  "Encodage haute définition du flux vidéo MP4...",
  "Finalisation du clip...",
];

export const VeoGeneratorModal: React.FC<VeoGeneratorModalProps> = ({
  isOpen,
  onClose,
  targetScene,
  defaultAspectRatio,
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(defaultAspectRatio);
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [operationName, setOperationName] = useState<string | null>(null);
  const [progressMessageIndex, setProgressMessageIndex] = useState<number>(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAspectRatio(defaultAspectRatio);
  }, [defaultAspectRatio]);

  useEffect(() => {
    if (targetScene) {
      setPrompt(targetScene.veoPromptSuggestion);
    } else {
      setPrompt(
        "Widescreen 16:9 minimalist 2D motion graphic explainer video about SMS phishing scams, clean solid pastel background, full width composition, high contrast bold typography, sleek dark smartphone displaying an urgent parcel SMS with circled suspicious link, clean pictograms of delivery truck, bank card and shield, flat vector animation style, dynamic 2-second visual transitions, 2 to 3 colors palette."
      );
    }
  }, [targetScene]);

  // Rotate reassuring messages while polling
  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setProgressMessageIndex((prev) => (prev + 1) % REASSURING_MESSAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Clean up object url
  useEffect(() => {
    return () => {
      if (generatedVideoUrl) {
        URL.revokeObjectURL(generatedVideoUrl);
      }
    };
  }, [generatedVideoUrl]);

  if (!isOpen) return null;

  const handleStartGeneration = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedVideoUrl(null);
    setProgressMessageIndex(0);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          resolution: '720p',
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erreur lors du lancement de la génération Veo');
      }

      const opName = data.operationName;
      setOperationName(opName);

      // Poll until done
      pollOperation(opName);
    } catch (err: any) {
      console.error(err);
      setIsGenerating(false);
      setErrorMessage(err.message || 'Échec de la génération');
    }
  };

  const pollOperation = async (opName: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName }),
        });
        const statusData = await res.json();

        if (statusData.error) {
          clearInterval(pollInterval);
          setIsGenerating(false);
          setErrorMessage(statusData.error.message || 'Erreur lors du traitement vidéo');
          return;
        }

        if (statusData.done) {
          clearInterval(pollInterval);
          // Download video
          await downloadVideo(opName);
        }
      } catch (err: any) {
        console.warn('Polling error:', err);
      }
    }, 5000);
  };

  const downloadVideo = async (opName: string) => {
    try {
      const res = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName: opName }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur de téléchargement de la vidéo Veo');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedVideoUrl(url);
      setIsGenerating(false);
    } catch (err: any) {
      console.error(err);
      setIsGenerating(false);
      setErrorMessage(err.message || 'Impossible de récupérer la vidéo générée');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Génération Vidéo Veo 3</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-semibold">
                  veo-3.1-fast-generate-preview
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                {targetScene
                  ? `Générer le clip pour la Scène 0${targetScene.index} : ${targetScene.title}`
                  : 'Générer une vidéo explicative complète'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Aspect Ratio Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px]">
              Format d'exportation (Aspect Ratio)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setAspectRatio('16:9')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 font-semibold transition-all ${
                  aspectRatio === '16:9'
                    ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 ring-1 ring-violet-500'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="w-8 h-5 border-2 border-current rounded-sm flex items-center justify-center text-[9px] font-bold">
                  16:9
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">16:9 Paysage</div>
                  <div className="text-[10px] opacity-70">YouTube / Web / Présentation</div>
                </div>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setAspectRatio('9:16')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 font-semibold transition-all ${
                  aspectRatio === '9:16'
                    ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 ring-1 ring-violet-500'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="w-5 h-8 border-2 border-current rounded-sm flex items-center justify-center text-[9px] font-bold">
                  9:16
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">9:16 Vertical</div>
                  <div className="text-[10px] opacity-70">TikTok / Reels / Shorts</div>
                </div>
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px]">
                Prompt Visuel Minimaliste pour Veo 3
              </label>
              <button
                type="button"
                disabled={isGenerating}
                onClick={() =>
                  targetScene && setPrompt(targetScene.veoPromptSuggestion)
                }
                className="text-[11px] text-violet-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Réinitialiser suggestion</span>
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={4}
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 font-mono text-xs outline-none focus:border-violet-500"
              placeholder="Décrivez les animations épurées et les pictogrammes..."
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold">Erreur de génération</div>
                <div>{errorMessage}</div>
              </div>
            </div>
          )}

          {/* In-progress Loading State */}
          {isGenerating && (
            <div className="p-5 rounded-2xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/60 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
              <div className="space-y-1">
                <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Génération Veo 3 en cours...
                </div>
                <div className="text-xs text-violet-700 dark:text-violet-300 animate-pulse">
                  {REASSURING_MESSAGES[progressMessageIndex]}
                </div>
                <p className="text-[11px] text-stone-500">
                  La génération vidéo par IA prend généralement entre 30 et 90 secondes.
                </p>
              </div>
            </div>
          )}

          {/* Generated Video Player Preview */}
          {generatedVideoUrl && (
            <div className="space-y-3 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Vidéo générée avec succès !</span>
                </div>
                <a
                  href={generatedVideoUrl}
                  download={`veo-video-${aspectRatio}.mp4`}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger MP4</span>
                </a>
              </div>

              <div className="flex justify-center bg-black rounded-xl overflow-hidden shadow-inner max-h-[300px]">
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="max-h-[300px] object-contain w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-xs transition-all"
          >
            Fermer
          </button>
          <button
            onClick={handleStartGeneration}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération Veo en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Lancer la génération Veo 3</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
