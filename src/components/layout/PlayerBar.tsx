import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, VolumeX, Mic2, ListMusic, MonitorSpeaker, Heart 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useAudioProgress } from '../../hooks/useAudioProgress';

const PlayerBar = () => {
  useAudioProgress();
  const navigate = useNavigate();
  const { 
    currentTrack, isPlaying, togglePlay, progress, duration, 
    setProgress, volume, setVolume, playNext, playPrevious,
    isShuffle, toggleShuffle, repeatMode, toggleRepeat,
    likedTrackIds, toggleLike
  } = usePlayerStore();

  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.id) : false;

  const [localProgress, setLocalProgress] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalProgress(value);
  };

  const handleSeekCommit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setProgress(value);
    setIsDragging(false);
  };

  if (!currentTrack) return null;

  const handleOpenNowPlaying = () => {
    navigate('/now-playing');
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-24 bg-surface-container/80 border-t border-surface-highest player-bar-blur px-4 flex items-center justify-between gap-4 transition-all animate-in slide-in-from-bottom duration-500">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-[30%]">
        <div 
          onClick={handleOpenNowPlaying}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-14 h-14 rounded-md shadow-lg group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-on-surface truncate max-w-[200px] group-hover:text-primary transition-colors">
              {currentTrack.title}
            </span>
            <span className="text-xs text-outline hover:underline">
              {currentTrack.artist}
            </span>
          </div>
        </div>
        <button 
          onClick={() => toggleLike(currentTrack)}
          className={`transition-colors ml-2 ${isLiked ? 'text-primary' : 'text-outline hover:text-primary'}`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Controls & Progress */}
      <div className="flex flex-col items-center gap-3 flex-1 max-w-2xl px-8">
        <div className="flex items-center gap-8">
          <button 
            onClick={toggleShuffle}
            className={isShuffle ? "text-primary" : "text-outline hover:text-on-surface transition-colors"}
          >
            <Shuffle size={20} />
          </button>
          <button 
            onClick={playPrevious}
            className="text-outline hover:text-on-surface transition-colors"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-on-primary shadow-[0_0_20px_rgba(130,208,246,0.3)] hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={playNext}
            className="text-outline hover:text-on-surface transition-colors"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
          <button 
            onClick={toggleRepeat}
            className={repeatMode !== 'none' ? "text-primary relative" : "text-outline hover:text-on-surface transition-colors"}
          >
            <Repeat size={20} />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">1</span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 w-full">
          <span className="text-[10px] font-bold text-outline tabular-nums min-w-[32px] text-right">{formatTime(localProgress)}</span>
          <div className="relative flex-1 group h-6 flex items-center">
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={localProgress}
              onMouseDown={() => setIsDragging(true)}
              onChange={handleSeekChange}
              onMouseUp={handleSeekCommit}
              onTouchEnd={handleSeekCommit}
              className="w-full h-1.5 bg-surface-highest rounded-full appearance-none cursor-pointer accent-primary"
              style={{
                backgroundImage: `linear-gradient(to right, var(--color-primary) ${(localProgress / (duration || 100)) * 100}%, var(--color-surface-highest) ${(localProgress / (duration || 100)) * 100}%)`
              }}
            />
          </div>
          <span className="text-[10px] font-bold text-outline tabular-nums min-w-[32px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex items-center gap-4 justify-end w-[25%]">
        <button className="text-outline hover:text-on-surface transition-colors">
          <Mic2 size={18} />
        </button>
        <button className="text-outline hover:text-on-surface transition-colors">
          <ListMusic size={18} />
        </button>
        <button className="text-outline hover:text-on-surface transition-colors">
          <MonitorSpeaker size={18} />
        </button>
        <div className="flex items-center gap-3 w-32 group">
          {volume === 0 ? <VolumeX size={18} className="text-outline" /> : <Volume2 size={18} className="text-outline group-hover:text-on-surface" />}
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 bg-surface-highest rounded-full appearance-none cursor-pointer accent-primary"
            style={{
              backgroundImage: `linear-gradient(to right, var(--color-primary) ${volume * 100}%, var(--color-surface-highest) ${volume * 100}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
