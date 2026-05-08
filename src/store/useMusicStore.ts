import { create } from 'zustand';
import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type { Track } from '../types';

interface MusicState {
  recommendations: Track[];
  mostPlayed: Track[];
  feed: Track[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchHomeData: () => Promise<void>;
}

export const useMusicStore = create<MusicState>((set) => ({
  recommendations: [],
  mostPlayed: [],
  feed: [],
  isLoading: false,
  error: null,

  fetchHomeData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [feedRes, recsRes, mostRes] = await Promise.all([
        client.get(ENDPOINTS.MUSIC.FEED),
        client.get(ENDPOINTS.MUSIC.RECOMMENDATIONS),
        client.get(ENDPOINTS.MUSIC.MOST_PLAYED)
      ]);

      const mapTracks = (tracks: any[]) => (tracks || []).map((t: any) => ({
        id: t.external_id || t.id,
        title: t.title,
        artist: t.artist_name || t.artist,
        album: t.album_name || t.album,
        coverUrl: t.image_url || t.coverUrl,
        audioUrl: t.audio_url || t.audioUrl,
        duration: t.duration
      }));

      set({ 
        feed: mapTracks(feedRes.data), 
        recommendations: mapTracks(recsRes.data), 
        mostPlayed: mapTracks(mostRes.data),
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Failed to fetch home data', 
        isLoading: false 
      });
      console.error('Error fetching home data:', err);
    }
  }
}));
