import { create } from 'zustand';
import { Howl } from 'howler';
import type { Track } from '../types';
import { musicService } from '../services/musicService';

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  howl: Howl | null;
  playlists: { id: string; name: string; tracks: Track[] }[];
  isShuffle: boolean;
  repeatMode: 'none' | 'all' | 'one';
  likedTrackIds: string[];
  likedTracks: Track[];
  
  // Actions
  setTrack: (track: Track) => void;
  setQueue: (queue: Track[]) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (track: Track) => void;
  playNext: () => void;
  playPrevious: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  updateProgress: () => void;
  fetchPlaylists: () => Promise<void>;
  fetchLikedTracks: () => Promise<void>;
  createPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: Number(localStorage.getItem('volume')) || 0.5,
  progress: 0,
  duration: 0,
  howl: null,
  playlists: [],
  isShuffle: false,
  repeatMode: 'none',
  likedTrackIds: JSON.parse(localStorage.getItem('likedTrackIds') || '[]'),
  likedTracks: [],
  
  // Actions
  toggleLike: async (track: Track) => {
    const isLiked = get().likedTrackIds.includes(track.id);
    const newLikedIds = isLiked 
      ? get().likedTrackIds.filter(id => id !== track.id)
      : [...get().likedTrackIds, track.id];
    
    set({ likedTrackIds: newLikedIds });
    localStorage.setItem('likedTrackIds', JSON.stringify(newLikedIds));

    try {
      const serverIsLiked = await musicService.toggleLike(track);
      if (serverIsLiked !== !isLiked) {
         // Sync if needed
      }
    } catch (error) {
      console.error('Failed to sync like with server');
    }
  },
  fetchLikedTracks: async () => {
    try {
      const tracks = await musicService.getLikedTracks();
      if (tracks) {
        const ids = tracks.map(t => t.id);
        set({ likedTracks: tracks, likedTrackIds: ids });
        localStorage.setItem('likedTrackIds', JSON.stringify(ids));
      }
    } catch (error) {
      console.error('Failed to fetch liked tracks');
    }
  },
  fetchPlaylists: async () => {
    try {
      const response = await musicService.getPlaylists();
      // Map backend fields (id, title) to frontend (id, name)
      const mappedPlaylists = (response || []).map((p: any) => ({
        id: String(p.id),
        name: p.title || p.name,
        tracks: (p.tracks || []).map((t: any) => ({
          // Use title as ID for consistency
          id: t.title || t.external_id || String(t.id),
          title: t.title,
          artist: t.artist_name || t.artist,
          album: t.album_name || t.album,
          coverUrl: t.image_url || t.coverUrl,
          audioUrl: t.audio_url || t.audioUrl,
          duration: t.duration
        }))
      }));
      set({ playlists: mappedPlaylists });
    } catch (error) {
      console.error('Failed to fetch playlists');
    }
  },
  setTrack: (track) => {
    const { howl } = get();
    if (howl) {
      howl.stop();
      howl.unload();
    }

    const newHowl = new Howl({
      src: [track.audioUrl],
      html5: true,
      volume: get().volume,
      onplay: () => set({ isPlaying: true }),
      onpause: () => set({ isPlaying: false }),
      onstop: () => set({ isPlaying: false, progress: 0 }),
      onend: () => {
        const { repeatMode } = get();
        if (repeatMode === 'one') {
          newHowl.play();
        } else {
          get().playNext();
        }
      },
      onload: () => {
        set({ duration: newHowl.duration() });
      }
    });

    set({ currentTrack: track, howl: newHowl, progress: 0 });
    newHowl.play();
    
    // Save recently played to server
    musicService.saveRecentlyPlayed(track);
  },

  setQueue: (queue) => set({ queue }),

  togglePlay: () => {
    const { howl, isPlaying } = get();
    if (!howl) return;

    if (isPlaying) {
      howl.pause();
    } else {
      howl.play();
    }
    set({ isPlaying: !isPlaying });
  },

  toggleShuffle: () => set(state => ({ isShuffle: !state.isShuffle })),

  toggleRepeat: () => set(state => {
    const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
    const nextMode = modes[(modes.indexOf(state.repeatMode) + 1) % modes.length];
    return { repeatMode: nextMode };
  }),

  playNext: () => {
    const { queue, currentTrack, isShuffle, repeatMode } = get();
    if (queue.length === 0) return;

    let nextIndex: number;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
      // Try to avoid playing the same track if shuffle picks current index
      if (nextIndex === currentIndex && queue.length > 1) {
        nextIndex = (nextIndex + 1) % queue.length;
      }
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return; // End of queue
        }
      }
    }

    get().setTrack(queue[nextIndex]);
  },

  playPrevious: () => {
    const { queue, currentTrack, progress } = get();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart the track
    if (progress > 3) {
      get().setProgress(0);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    get().setTrack(queue[prevIndex]);
  },

  setVolume: (volume) => {
    const { howl } = get();
    if (howl) howl.volume(volume);
    localStorage.setItem('volume', String(volume));
    set({ volume });
  },

  setProgress: (progress) => {
    const { howl } = get();
    if (howl) {
      howl.seek(progress);
    }
    set({ progress });
  },

  updateProgress: () => {
    const { howl, isPlaying } = get();
    if (howl && isPlaying) {
      set({ progress: howl.seek() as number });
    }
  },

  createPlaylist: async (name: string) => {
    const { playlists } = get();
    // Optimistic ID
    const tempId = Math.random().toString(36).substr(2, 9);
    const newPlaylist = { id: tempId, name, tracks: [] };
    
    // Optimistic Update
    const updatedPlaylists = [...playlists, newPlaylist];
    set({ playlists: updatedPlaylists });

    try {
      const serverPlaylist = await musicService.createPlaylist(name);
      // Update with real server data
      set(state => ({
        playlists: state.playlists.map(p => p.id === tempId ? serverPlaylist : p)
      }));
    } catch (error) {
      console.error('Failed to sync playlist with server');
    }
  },

  addTrackToPlaylist: async (playlistId, track) => {
    const { playlists } = get();
    
    // Optimistic Update
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        if (p.tracks.find(t => t.id === track.id)) return p;
        return { ...p, tracks: [...p.tracks, track] };
      }
      return p;
    });
    
    set({ playlists: updatedPlaylists });

    try {
      await musicService.addTrackToPlaylist(playlistId, track);
    } catch (error) {
      console.error('Failed to sync track addition with server');
    }
  }
}));
