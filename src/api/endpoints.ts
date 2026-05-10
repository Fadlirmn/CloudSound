export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/me/profile',
  },
  MUSIC: {
    FEED: '/music/feed',
    RECOMMENDATIONS: '/music/recommendations',
    MOST_PLAYED: '/music/most-played',
    SEARCH: '/music/search',
    TRACK_DETAIL: (id: string) => `/music/tracks/${id}`,
  },
  USER: {
    PLAYLISTS: '/me/playlists',
    ADD_TO_PLAYLIST: (playlistId: string) => `/me/playlists/${playlistId}/tracks`,
    RECENT: '/me/recent',
    LIKE: '/me/like',
    LIKED: '/me/liked',
  },
};
