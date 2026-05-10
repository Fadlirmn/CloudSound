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
      const results = await Promise.allSettled([
        client.get(ENDPOINTS.MUSIC.FEED),
        client.get(ENDPOINTS.MUSIC.RECOMMENDATIONS),
        client.get(ENDPOINTS.MUSIC.MOST_PLAYED)
      ]);

      const mapTracks = (tracks: any[]) => (tracks || []).map((t: any) => ({
        id: t.title || t.external_id || t.id,
        title: t.title,
        artist: t.artist_name || t.artist,
        album: t.album_name || t.album,
        coverUrl: t.image_url || t.coverUrl,
        audioUrl: t.audio_url || t.audioUrl,
        duration: t.duration
      }));

      const feed = results[0].status === 'fulfilled' ? mapTracks(results[0].value.data) : [];
      const recommendations = results[1].status === 'fulfilled' ? mapTracks(results[1].value.data) : [];
      const mostPlayed = results[2].status === 'fulfilled' ? mapTracks(results[2].value.data) : [];

      set({ 
        feed, 
        recommendations,
        mostPlayed,
        isLoading: false 
      });
      
      if (results.every(r => r.status === 'rejected')) {
        throw new Error('All data fetches failed');
      }
    } catch (err: any) {
      set({ 
        error: err.message || 'Failed to fetch home data', 
        isLoading: false 
      });
      console.error('Error fetching home data:', err);
    }
  }
}));
