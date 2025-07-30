import { Howl } from "howler";

// Sound configurations
const SOUND_CONFIG = {
  timerComplete: {
    src: ["/sounds/timer-complete.mp3"],
    volume: 0.5,
    html5: true,
  },
  timerStart: {
    src: ["/sounds/timer-start.mp3"],
    volume: 0.4,
    html5: true,
  },
  timerPause: {
    src: ["/sounds/timer-pause.mp3"],
    volume: 0.3,
    html5: true,
  },
  timerReset: {
    src: ["/sounds/timer-reset.mp3"],
    volume: 0.3,
    html5: true,
  },
  phaseChange: {
    src: ["/sounds/phase-change.mp3"],
    volume: 0.4,
    html5: true,
  },
  tick: {
    src: ["/sounds/tick.mp3"],
    volume: 0.05,
    html5: true,
  },
};

// Fallback sounds using Web Audio API for browsers that don't support audio files
const createFallbackSound = (
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
) => {
  if (typeof window === "undefined") return null;

  const audioContext = new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration,
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);

  return { oscillator, gainNode };
};

// Sound manager class
export class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private isEnabled: boolean = false;
  private fallbackMode: boolean = false;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    try {
      // Try to load Howler sounds
      Object.entries(SOUND_CONFIG).forEach(([key, config]) => {
        const sound = new Howl({
          ...config,
          onloaderror: () => {
            console.warn(`Failed to load sound: ${key}, using fallback`);
            this.fallbackMode = true;
          },
        });
        this.sounds.set(key, sound);
      });
    } catch {
      console.warn("Howler not available, using fallback sounds");
      this.fallbackMode = true;
    }
  }

  public enable() {
    this.isEnabled = true;
  }

  public disable() {
    this.isEnabled = false;
  }

  public isSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public playTimerComplete() {
    if (!this.isEnabled) return;

    if (this.fallbackMode) {
      createFallbackSound(523.25, 0.5); // C5 note
    } else {
      const sound = this.sounds.get("timerComplete");
      if (sound) {
        sound.play();
      }
    }
  }

  public playTimerStart() {
    if (!this.isEnabled) return;

    if (this.fallbackMode) {
      createFallbackSound(659.25, 0.3); // E5 note
    } else {
      const sound = this.sounds.get("timerStart");
      if (sound) {
        sound.play();
      }
    }
  }

  public playTimerPause() {
    if (!this.isEnabled) return;

    if (this.fallbackMode) {
      createFallbackSound(440, 0.2); // A4 note
    } else {
      const sound = this.sounds.get("timerPause");
      if (sound) {
        sound.play();
      }
    }
  }

  public playTimerReset() {
    if (!this.isEnabled) return;

    if (this.fallbackMode) {
      createFallbackSound(349.23, 0.3); // F4 note
    } else {
      const sound = this.sounds.get("timerReset");
      if (sound) {
        sound.play();
      }
    }
  }

  public playPhaseChange() {
    if (!this.isEnabled) return;

    if (this.fallbackMode) {
      createFallbackSound(587.33, 0.4); // D5 note
    } else {
      const sound = this.sounds.get("phaseChange");
      if (sound) {
        sound.play();
      }
    }
  }

  public playTick() {
    if (!this.isEnabled) return;

    if (this.fallbackMode) {
      createFallbackSound(600, 0.03, "sine"); // Subtle tick sound
    } else {
      const sound = this.sounds.get("tick");
      if (sound) {
        sound.play();
      }
    }
  }

  public cleanup() {
    this.sounds.forEach((sound) => {
      sound.unload();
    });
    this.sounds.clear();
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();
