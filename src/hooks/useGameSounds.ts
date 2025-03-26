import { useCallback, useEffect, useRef } from 'react';

interface GameSounds {
  flip: HTMLAudioElement;
  match: HTMLAudioElement;
  win: HTMLAudioElement;
  lose: HTMLAudioElement;
}

export function useGameSounds() {
  const soundsRef = useRef<GameSounds | null>(null);
  const isMutedRef = useRef<boolean>(false);

  useEffect(() => {
    soundsRef.current = {
      flip: new Audio('/sounds/flip.mp3'),
      match: new Audio('/sounds/match.mp3'),
      win: new Audio('/sounds/win.mp3'),
      lose: new Audio('/sounds/lose.mp3'),
    };

    // Précharger les sons
    Object.values(soundsRef.current).forEach(audio => {
      audio.load();
    });

    return () => {
      if (soundsRef.current) {
        Object.values(soundsRef.current).forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
        });
      }
    };
  }, []);

  const playSound = useCallback((type: keyof GameSounds) => {
    if (isMutedRef.current || !soundsRef.current) return;

    const sound = soundsRef.current[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignorer les erreurs de lecture (peut arriver si l'utilisateur n'a pas interagi avec la page)
      });
    }
  }, []);

  const toggleMute = useCallback(() => {
    isMutedRef.current = !isMutedRef.current;
    return isMutedRef.current;
  }, []);

  const isMuted = useCallback(() => {
    return isMutedRef.current;
  }, []);

  return {
    playSound,
    toggleMute,
    isMuted,
  };
} 