import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoScene, AspectRatio } from '../types';
import { TOTAL_AUDIO_DURATION } from '../data/scenes';
import { ThemeConfig } from '../utils/themes';
import { DYNAMIC_CAPTIONS } from '../data/captions';
import {
  Package,
  Truck,
  CreditCard,
  Building2,
  Search,
  MousePointerClick,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock,
  Sliders,
  AlertTriangle,
  Flame,
  Check,
} from 'lucide-react';

interface VideoCanvasProps {
  currentScene: VideoScene;
  currentTime: number;
  aspectRatio: AspectRatio;
  theme: ThemeConfig;
  showSubtitles?: boolean;
}

export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  currentScene,
  currentTime,
  aspectRatio,
  theme,
  showSubtitles = true,
}) => {
  const isPortrait = aspectRatio === '9:16';

  // Find active dynamic caption for the exact current second (changes every 2-3s)
  const currentCaption = useMemo(() => {
    return (
      DYNAMIC_CAPTIONS.find(
        (c) => currentTime >= c.startTime && currentTime < c.endTime
      ) || DYNAMIC_CAPTIONS[0]
    );
  }, [currentTime]);

  return (
    <div
      id="video-canvas-container"
      className={`relative overflow-hidden select-none transition-colors duration-500 w-full ${
        isPortrait
          ? 'max-w-[400px] aspect-[9/16] rounded-3xl shadow-2xl border border-stone-800'
          : 'aspect-[16/9] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800'
      }`}
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
    >
      {/* Main Full-Width Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 md:px-10 py-5 md:py-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b pb-3 border-stone-200/40 dark:border-stone-800/60">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-sm"
              style={{
                backgroundColor: theme.accentColor,
                color: '#FFFFFF',
              }}
            >
              {currentCaption.badge || currentScene.visual.badge || 'CYBERSÉCURITÉ'}
            </span>
            <span className="text-xs md:text-sm font-mono font-bold opacity-75">
              {formatTime(currentTime)} / 01:05
            </span>
          </div>

          {/* Sound & Scene Info */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-semibold opacity-60">
              Scène {currentScene.index}/9 : {currentScene.title.split(':')[0]}
            </span>
            <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full">
              {[40, 85, 55, 100, 65].map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full animate-pulse"
                  style={{
                    height: `${h * 0.16}px`,
                    backgroundColor: theme.accentColor,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Dynamic Animated Graphic Card taking full width */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full flex flex-col items-center justify-center max-w-3xl"
            >
              {renderDynamicSceneVisual(currentScene, currentTime, theme, isPortrait)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom: Dynamic Punchy Caption Pill (< 12 words, highlighted keywords) */}
        {showSubtitles && (
          <div className="w-full max-w-2xl mx-auto space-y-2.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCaption.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div
                  className="w-full px-5 py-3 rounded-2xl border shadow-lg text-center backdrop-blur-md transition-all"
                  style={{
                    backgroundColor: `${theme.bgColor}F0`,
                    borderColor: `${theme.accentColor}50`,
                  }}
                >
                  <p className="text-sm md:text-base font-extrabold leading-snug tracking-tight">
                    {renderHighlightedCaption(
                      currentCaption.shortText,
                      currentCaption.highlightWord,
                      theme.accentColor
                    )}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Micro progress line */}
            <div className="w-full bg-stone-300/40 dark:bg-stone-700/40 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-150 ease-linear"
                style={{
                  width: `${(currentTime / TOTAL_AUDIO_DURATION) * 100}%`,
                  backgroundColor: theme.accentColor,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Highlights specific keywords with high contrast accent styling
 */
function renderHighlightedCaption(
  fullText: string,
  highlightWord: string,
  accentColor: string
) {
  if (!highlightWord || !fullText.includes(highlightWord)) {
    return <span>{fullText}</span>;
  }

  const parts = fullText.split(highlightWord);
  return (
    <>
      {parts[0]}
      <span
        className="px-1.5 py-0.5 mx-0.5 rounded-md font-black shadow-sm"
        style={{
          backgroundColor: `${accentColor}25`,
          color: accentColor,
        }}
      >
        {highlightWord}
      </span>
      {parts.slice(1).join(highlightWord)}
    </>
  );
}

/**
 * Renders the visual elements with high-impact micro-animations every 2-3 seconds
 */
function renderDynamicSceneVisual(
  scene: VideoScene,
  currentTime: number,
  theme: ThemeConfig,
  isPortrait: boolean
) {
  const type = scene.visual.type;
  const elapsedInScene = currentTime - scene.startTime;
  const pulsePhase = Math.floor(elapsedInScene / 2.5);

  switch (type) {
    case 'sms-hook': {
      return (
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
            Colis en attente ?
          </h2>

          <div
            className={`w-full max-w-lg rounded-2xl p-4 md:p-5 border shadow-md transition-all ${
              theme.cardBgClass
            }`}
            style={{ borderColor: `${theme.accentColor}50` }}
          >
            {/* Header with delivery van */}
            <div className="flex items-center justify-between border-b pb-2 mb-3 border-stone-200/50">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: `${theme.accentColor}25`,
                    color: theme.accentColor,
                  }}
                >
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black">Livreur Express</div>
                  <div className="text-xs opacity-60 font-semibold">
                    +33 6 00 00 00 00 • Inconnu
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold opacity-60">14:02</span>
            </div>

            {/* Bubble */}
            <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-3.5 text-left text-xs md:text-sm space-y-2.5">
              <p className="font-medium leading-relaxed">
                Dernier passage demain. Sans réponse, votre colis repart au dépôt.
              </p>

              {/* Pulsing Fake URL */}
              <div
                className={`p-2.5 rounded-lg flex items-center justify-between font-mono text-xs md:text-sm font-bold transition-all ${
                  pulsePhase >= 1 ? 'scale-[1.02] shadow-md' : ''
                }`}
                style={{
                  backgroundColor: `${theme.accentColor}18`,
                  color: theme.accentColor,
                  border: `2px solid ${theme.accentColor}`,
                }}
              >
                <span>https://colis-reprog.xyz</span>
                <AlertTriangle className="w-4 h-4 animate-bounce flex-shrink-0" />
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider animate-pulse shadow-sm"
            style={{
              backgroundColor: `${theme.accentColor}18`,
              color: theme.accentColor,
            }}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Fausse urgence = Arnaque au clic</span>
          </div>
        </div>
      );
    }

    case 'stat-phishing': {
      return (
        <div className="flex flex-col items-center gap-5 w-full">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {/* Person Safe */}
            <div className="flex flex-col items-center gap-2 opacity-40">
              <div className="w-16 h-16 rounded-2xl border-2 border-current flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-current" />
              </div>
              <span className="text-sm font-bold">1 Français sur 2</span>
            </div>

            {/* Giant 53% Pill */}
            <div
              className="flex flex-col items-center px-8 py-5 rounded-3xl border-2 shadow-xl"
              style={{
                backgroundColor: `${theme.accentColor}15`,
                borderColor: theme.accentColor,
              }}
            >
              <span
                className="text-6xl md:text-7xl font-black tracking-tighter"
                style={{ color: theme.accentColor }}
              >
                53 %
              </span>
              <span className="text-xs md:text-sm font-black uppercase tracking-wider mt-1">
                des Français visés
              </span>
            </div>

            {/* Person Targeted */}
            <div
              className="flex flex-col items-center gap-2"
              style={{ color: theme.accentColor }}
            >
              <div
                className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-lg animate-pulse"
                style={{ borderColor: theme.accentColor }}
              >
                <AlertTriangle className="w-8 h-8" />
              </div>
              <span className="text-sm font-black">Ciblé !</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h3
              className="text-2xl md:text-3xl font-black tracking-tight"
              style={{ color: theme.accentColor }}
            >
              L’HAMEÇONNAGE (PHISHING)
            </h3>
            <p className="text-xs md:text-sm opacity-70 font-semibold">
              Source officielle : Baromètre Ipsos pour Cybermalveillance.gouv.fr
            </p>
          </div>
        </div>
      );
    }

    case 'fraud-roles': {
      const activeIdx = Math.min(2, Math.floor(elapsedInScene / 3.3));

      const roles = [
        {
          title: 'Faux Livreur',
          desc: 'Colis soi-disant bloqué',
          icon: Truck,
        },
        {
          title: 'Fausse Banque',
          desc: 'Alerte sécurité fictive',
          icon: CreditCard,
        },
        {
          title: 'Faux Impôts',
          desc: 'Remboursement fantôme',
          icon: Building2,
        },
      ];

      return (
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">
            3 Usurpations Courantes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full">
            {roles.map((r, i) => {
              const isCurrent = i === activeIdx;
              const IconComp = r.icon;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                    isCurrent
                      ? 'scale-105 shadow-xl ring-2 ring-rose-500'
                      : 'opacity-70'
                  } ${theme.cardBgClass}`}
                  style={{
                    borderColor: isCurrent ? theme.accentColor : undefined,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: `${theme.accentColor}20`,
                      color: theme.accentColor,
                    }}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="text-base font-black">{r.title}</div>
                  <div className="text-xs opacity-70 mt-0.5">{r.desc}</div>

                  {isCurrent && (
                    <span
                      className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mt-2.5"
                      style={{
                        backgroundColor: theme.accentColor,
                        color: '#FFFFFF',
                      }}
                    >
                      En cours
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm font-black text-rose-500">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>Objectif unique : dérober vos identifiants et carte bancaire</span>
          </div>
        </div>
      );
    }

    case 'question-reflex': {
      return (
        <div className="flex flex-col items-center gap-4 py-3">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl font-black shadow-xl animate-bounce"
            style={{
              backgroundColor: theme.accentColor,
              color: '#FFFFFF',
            }}
          >
            ?
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
            Que faire ?
          </h2>
          <div className="px-5 py-2 rounded-full bg-stone-200 dark:bg-stone-800 text-xs md:text-sm font-black tracking-wider">
            3 RÈGLES IMMÉDIATES DE PROTECTION
          </div>
        </div>
      );
    }

    case 'link-inspect': {
      return (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-rose-500">
            <Search className="w-4 h-4" />
            <span>Règle 1 : Inspectez l’adresse URL</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
            {/* Real Link */}
            <div className="p-4 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-between text-left">
              <div>
                <div className="text-xs font-black text-emerald-600 uppercase">
                  Site Officiel
                </div>
                <div className="font-mono text-sm md:text-base font-black text-emerald-700 dark:text-emerald-400 mt-1">
                  https://colissimo.fr
                </div>
              </div>
              <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
            </div>

            {/* Fake Link */}
            <div
              className="p-4 rounded-2xl border-2 flex items-center justify-between text-left relative overflow-hidden shadow-lg"
              style={{
                borderColor: theme.accentColor,
                backgroundColor: `${theme.accentColor}15`,
              }}
            >
              <div>
                <div
                  className="text-xs font-black uppercase"
                  style={{ color: theme.accentColor }}
                >
                  Faux Site Piège
                </div>
                <div className="font-mono text-sm md:text-base font-black flex items-center mt-1">
                  <span>https://colissi</span>
                  <span
                    className="px-2 py-0.5 rounded-md border-2 mx-1 font-black text-white shadow-sm animate-pulse"
                    style={{
                      backgroundColor: theme.accentColor,
                      borderColor: theme.accentColor,
                    }}
                  >
                    rn
                  </span>
                  <span>o.fr</span>
                </div>
              </div>
              <XCircle className="w-7 h-7 text-rose-600 flex-shrink-0" />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-500/10 text-xs md:text-sm font-black text-rose-500 border border-rose-500/20">
            « rn » ressemble à la lettre « m » : Une seule lettre changée = Piège garanti !
          </div>
        </div>
      );
    }

    case 'no-click': {
      return (
        <div className="flex flex-col items-center gap-4 w-full">
          <div
            className="w-20 h-20 rounded-full border-4 flex items-center justify-center relative shadow-xl"
            style={{
              borderColor: theme.accentColor,
              color: theme.accentColor,
            }}
          >
            <MousePointerClick className="w-9 h-9 opacity-30" />
            <div
              className="absolute w-full h-1.5 rotate-45 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
          </div>

          <h2
            className="text-3xl md:text-4xl font-black tracking-tight uppercase"
            style={{ color: theme.accentColor }}
          >
            Ne cliquez pas
          </h2>

          <div
            className={`w-full max-w-md p-4 md:p-5 rounded-2xl border text-left space-y-2 shadow-md ${
              theme.cardBgClass
            }`}
            style={{ borderColor: `${theme.accentColor}40` }}
          >
            <div className="text-xs md:text-sm font-black uppercase text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Le bon réflexe :</span>
            </div>
            <p className="text-xs md:text-sm font-semibold leading-relaxed">
              Ouvrez votre navigateur par vous-même et entrez votre numéro sur le{' '}
              <strong className="underline">site officiel du transporteur</strong>.
            </p>
          </div>
        </div>
      );
    }

    case 'report-spam': {
      return (
        <div className="flex flex-col items-center gap-4 w-full">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl animate-pulse"
            style={{
              backgroundColor: theme.accentColor,
              color: '#FFFFFF',
            }}
          >
            <ShieldCheck className="w-9 h-9" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
            Signalez l’escroquerie
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full max-w-lg">
            <div
              className={`p-4 rounded-2xl border text-center shadow-sm ${
                theme.cardBgClass
              }`}
              style={{ borderColor: `${theme.accentColor}30` }}
            >
              <div className="text-xs font-black uppercase opacity-70">
                Site officiel
              </div>
              <div
                className="text-base font-black mt-1 font-mono"
                style={{ color: theme.accentColor }}
              >
                signal-spam.fr
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border text-center shadow-sm ${
                theme.cardBgClass
              }`}
              style={{ borderColor: `${theme.accentColor}30` }}
            >
              <div className="text-xs font-black uppercase opacity-70">
                Transfert SMS
              </div>
              <div
                className="text-base font-black mt-1 font-mono"
                style={{ color: theme.accentColor }}
              >
                33 700
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'os-settings': {
      return (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 text-xs md:text-sm font-black uppercase">
            <Sliders className="w-4 h-4" />
            <span>Action en moins de 2 minutes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* iPhone Card */}
            <div
              className={`p-4 rounded-2xl border shadow-md space-y-3 ${theme.cardBgClass}`}
              style={{ borderColor: `${theme.accentColor}40` }}
            >
              <div className="flex items-center justify-between border-b pb-2 border-stone-200/50">
                <span className="text-sm font-black">Sur iPhone (Apple)</span>
                <Smartphone className="w-4 h-4 opacity-70" />
              </div>
              <div className="text-xs font-medium text-left opacity-80">
                Réglages &gt; Messages &gt; Filtrer les expéditeurs inconnus
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800">
                <span className="text-xs font-black">Filtrer Inconnus</span>
                <div className="w-10 h-5 rounded-full bg-emerald-500 relative flex items-center px-0.5 shadow-inner">
                  <div className="w-4 h-4 rounded-full bg-white ml-auto shadow-md" />
                </div>
              </div>
            </div>

            {/* Android Card */}
            <div
              className={`p-4 rounded-2xl border shadow-md space-y-3 ${theme.cardBgClass}`}
              style={{ borderColor: `${theme.accentColor}40` }}
            >
              <div className="flex items-center justify-between border-b pb-2 border-stone-200/50">
                <span className="text-sm font-black">Sur Android (Google)</span>
                <Smartphone className="w-4 h-4 opacity-70" />
              </div>
              <div className="text-xs font-medium text-left opacity-80">
                Appli Messages &gt; Paramètres &gt; Protection spam
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800">
                <span className="text-xs font-black">Protection Anti-Spam</span>
                <div className="w-10 h-5 rounded-full bg-emerald-500 relative flex items-center px-0.5 shadow-inner">
                  <div className="w-4 h-4 rounded-full bg-white ml-auto shadow-md" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs font-bold opacity-75">
            Ces filtres isolent automatiquement les messages suspects dans un dossier à part.
          </p>
        </div>
      );
    }

    case 'final-reflex': {
      return (
        <div className="flex flex-col items-center gap-4 py-4">
          <div
            className="w-18 h-18 rounded-2xl flex items-center justify-center shadow-xl"
            style={{
              backgroundColor: theme.accentColor,
              color: '#FFFFFF',
            }}
          >
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <div className="text-xs md:text-sm font-black uppercase tracking-widest opacity-60">
              Le seul réflexe 100% efficace
            </div>
            <h2
              className="text-3xl md:text-5xl font-black tracking-tight uppercase"
              style={{ color: theme.accentColor }}
            >
              Ne jamais cliquer
            </h2>
          </div>

          <div
            className={`p-3.5 rounded-2xl border text-xs md:text-sm font-bold leading-relaxed shadow-sm max-w-md ${
              theme.cardBgClass
            }`}
            style={{ borderColor: `${theme.accentColor}30` }}
          >
            Vérifiez toujours sur l'application ou le site officiel directement.
          </div>
        </div>
      );
    }

    default:
      return <div>{scene.title}</div>;
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
