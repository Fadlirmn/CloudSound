import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type { Track } from '../types';

const MOCK_TRACKS: Track[] = [
  {
    id: 'm1',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372
  },
  {
    id: 'm2',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425
  },
  {
    id: 'm3',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://images.unsplash.com/photo-1514525253361-bee8718a300c?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 315
  }
];

const mapTrack = (t: any): Track => ({
  id: t.external_id || t.id,
  title: t.title,
  artist: t.artist_name || t.artist,
  album: t.album_name || t.album,
  coverUrl: t.image_url || t.coverUrl,
  audioUrl: t.audio_url || t.audioUrl,
  duration: t.duration
});

export const musicService = {
  getHomeData: async (): Promise<{ feed: Track[], recommendations: Track[], mostPlayed: Track[] }> => {
    try {
      const [feedRes, recsRes, mostRes] = await Promise.all([
        client.get(ENDPOINTS.MUSIC.FEED),
        client.get(ENDPOINTS.MUSIC.RECOMMENDATIONS),
        client.get(ENDPOINTS.MUSIC.MOST_PLAYED)
      ]);
      return {
        feed: (feedRes.data || []).map(mapTrack),
        recommendations: (recsRes.data || []).map(mapTrack),
        mostPlayed: (mostRes.data || []).map(mapTrack)
      };
    } catch (error) {
      console.warn('Home data API error, using fallback:', error);
      return {
        feed: MOCK_TRACKS,
        recommendations: MOCK_TRACKS,
        mostPlayed: MOCK_TRACKS
      };
    }
  },

  searchTracks: async (query: string): Promise<Track[]> => {
    try {
      const response = await client.get(ENDPOINTS.MUSIC.SEARCH, {
        params: { q: query }
      });
      return (response.data || []).map(mapTrack);
    } catch (error) {
      console.warn('Search API error, using fallback:', error);
      return MOCK_TRACKS.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) || 
        t.artist.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  getTrackDetail: async (id: string): Promise<Track> => {
    try {
      const response = await client.get(ENDPOINTS.MUSIC.TRACK_DETAIL(id));
      return mapTrack(response.data);
    } catch (error) {
      const mock = MOCK_TRACKS.find(t => t.id === id);
      if (mock) return mock;
      throw error;
    }
  },

  getPlaylists: async (): Promise<any[]> => {
    try {
      const response = await client.get(ENDPOINTS.USER.PLAYLISTS);
      return response.data;
    } catch (error) {
      return JSON.parse(localStorage.getItem('playlists') || '[]');
    }
  },

  createPlaylist: async (name: string): Promise<any> => {
    try {
      const response = await client.post(ENDPOINTS.USER.PLAYLISTS, { 
        title: name,
        description: "",
        is_public: false 
      });
      return response.data;
    } catch (error) {
      const newPlaylist = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        tracks: []
      };
      return newPlaylist;
    }
  },

  addTrackToPlaylist: async (playlistId: string, track: Track): Promise<void> => {
    try {
      // Map back to models.Track format for Go backend
      const backendTrack = {
        external_id: track.id,
        title: track.title,
        artist_name: track.artist,
        album_name: track.album || "",
        duration: track.duration,
        audio_url: track.audioUrl,
        image_url: track.coverUrl
      };
      await client.post(ENDPOINTS.USER.ADD_TO_PLAYLIST(playlistId), backendTrack);
    } catch (error) {
      console.warn('Failed to add track to playlist on server');
    }
  }
};
