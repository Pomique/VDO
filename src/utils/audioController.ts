import { INITIAL_SCENES, TOTAL_AUDIO_DURATION } from '../data/scenes';

export class SynchronizedAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private customAudioUrl: string | null = null;
  private isSpeechActive = false;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onPlayStateChangeCallback: ((isPlaying: boolean) => void) | null = null;
  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private simulatedCurrentTime: number = 0;
  private isSimulatedPlaying: boolean = false;
  private playbackRate: number = 1.0;

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement && this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.audioElement.currentTime);
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.pause();
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(TOTAL_AUDIO_DURATION);
      }
    });
  }

  public setCustomAudio(file: File) {
    if (this.customAudioUrl) {
      URL.revokeObjectURL(this.customAudioUrl);
    }
    this.customAudioUrl = URL.createObjectURL(file);
    if (this.audioElement) {
      this.audioElement.src = this.customAudioUrl;
      this.audioElement.load();
    }
  }

  public setOnTimeUpdate(cb: (time: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public setOnPlayStateChange(cb: (isPlaying: boolean) => void) {
    this.onPlayStateChangeCallback = cb;
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  public play(startTime?: number) {
    if (typeof startTime === 'number') {
      this.seek(startTime);
    }

    if (this.customAudioUrl && this.audioElement) {
      this.audioElement.play().catch((err) => console.warn('Audio play error:', err));
      if (this.onPlayStateChangeCallback) this.onPlayStateChangeCallback(true);
      return;
    }

    // Simulated high-precision audio clock with optional Web Speech support
    this.isSimulatedPlaying = true;
    this.lastTimestamp = performance.now();
    if (this.onPlayStateChangeCallback) this.onPlayStateChangeCallback(true);

    const step = (now: number) => {
      if (!this.isSimulatedPlaying) return;
      const deltaSec = ((now - this.lastTimestamp) / 1000) * this.playbackRate;
      this.lastTimestamp = now;
      this.simulatedCurrentTime += deltaSec;

      if (this.simulatedCurrentTime >= TOTAL_AUDIO_DURATION) {
        this.simulatedCurrentTime = TOTAL_AUDIO_DURATION;
        this.pause();
        if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(TOTAL_AUDIO_DURATION);
        return;
      }

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.simulatedCurrentTime);
      }

      this.animationFrameId = requestAnimationFrame(step);
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  public pause() {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }

    this.isSimulatedPlaying = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (this.onPlayStateChangeCallback) {
      this.onPlayStateChangeCallback(false);
    }
  }

  public seek(seconds: number) {
    const clamped = Math.max(0, Math.min(TOTAL_AUDIO_DURATION, seconds));
    if (this.audioElement && this.customAudioUrl) {
      this.audioElement.currentTime = clamped;
    }
    this.simulatedCurrentTime = clamped;
    this.lastTimestamp = performance.now();
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(clamped);
    }
  }

  public getCurrentTime(): number {
    if (this.audioElement && this.customAudioUrl) {
      return this.audioElement.currentTime;
    }
    return this.simulatedCurrentTime;
  }

  public hasCustomAudio(): boolean {
    return !!this.customAudioUrl;
  }

  public cleanup() {
    this.pause();
    if (this.customAudioUrl) {
      URL.revokeObjectURL(this.customAudioUrl);
    }
  }
}
