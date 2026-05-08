import { useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export const useAudioProgress = () => {
  const updateProgress = usePlayerStore(state => state.updateProgress);
  const isPlaying = usePlayerStore(state => state.isPlaying);

  useEffect(() => {
    let interval: number;

    if (isPlaying) {
      interval = window.setInterval(() => {
        updateProgress();
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, updateProgress]);
};
