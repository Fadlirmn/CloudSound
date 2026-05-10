import { useEffect, useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useMusicStore } from '../store/useMusicStore';
import { Play, Plus, MoreVertical, Heart } from 'lucide-react';
import type { Track } from '../types';

const Skeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-10 w-64 bg-surface-highest rounded-md" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-square bg-surface-highest rounded-lg" />
      ))}
    </div>
  </div>
);

const TrackCard = ({ track, onPlay }: { track: Track; onPlay: (track: Track) => void }) => {
  const { playlists, addTrackToPlaylist, likedTrackIds, toggleLike } = usePlayerStore();
  const [showMenu, setShowMenu] = useState(false);
  const isLiked = likedTrackIds.includes(track.id);

  return (
    <div 
      className="bg-surface-container hover:bg-surface-highest transition-colors p-4 rounded-lg group cursor-pointer relative"
      onClick={() => onPlay(track)}
    >
      <div className="relative mb-4 aspect-square">
        <img 
          src={track.coverUrl} 
          alt={track.title} 
          className="w-full h-full object-cover rounded-md shadow-xl"
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          <Play size={24} fill="currentColor" />
        </button>
        
        {/* Actions Overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(track);
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all ${isLiked ? 'bg-primary text-on-primary' : 'bg-black/40 text-white hover:bg-black/60'}`}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {showMenu && (
        <div 
          className="absolute right-4 top-14 z-50 bg-surface-highest border border-surface-container rounded-xl shadow-2xl py-2 w-48 animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-4 py-1.5 text-[10px] font-bold text-outline uppercase tracking-wider">Add to Playlist</p>
          <div className="max-h-48 overflow-y-auto no-scrollbar">
            {playlists.length > 0 ? (
              playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    addTrackToPlaylist(p.id, track);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-primary/10 hover:text-primary transition-colors truncate"
                >
                  {p.name}
                </button>
              ))
            ) : (
              <p className="px-4 py-2 text-xs text-outline italic">No playlists found</p>
            )}
          </div>
        </div>
      )}

      <h4 className="font-bold text-on-surface truncate">{track.title}</h4>
      <p className="text-sm text-outline truncate">{track.artist}</p>
    </div>
  );
};

const Home = () => {
  const { setTrack, setQueue } = usePlayerStore();
  const { 
    feed = [], 
    recommendations = [], 
    mostPlayed = [], 
    isLoading, 
    fetchHomeData 
  } = useMusicStore();

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const handlePlayTrack = (track: Track, tracks: Track[]) => {
    setQueue(tracks);
    setTrack(track);
  };

  if (isLoading && !feed?.length) {
    return <Skeleton />;
  }

  return (
    <div className="space-y-12 pb-24">
      <header>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
        <p className="text-outline">Discover music tailored for you.</p>
      </header>

      {/* Section: New Feed / Discover */}
      {feed?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-on-surface tracking-tight">New Discoveries</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.slice(0, 3).map((track) => (
              <div 
                key={track.id}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => handlePlayTrack(track, feed)}
              >
                <img src={track.coverUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <h4 className="text-white text-xl font-bold mb-1">{track.title}</h4>
                  <p className="text-white/70 text-sm">{track.artist}</p>
                  <button className="absolute right-6 bottom-6 w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    <Play size={24} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section: Most Played (Top Mix) */}
      {mostPlayed?.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-on-surface mb-6">Your Top Mix</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {mostPlayed.map((track) => (
              <TrackCard key={track.id} track={track} onPlay={(t) => handlePlayTrack(t, mostPlayed)} />
            ))}
          </div>
        </section>
      )}

      {/* Section: Recommendations for You */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-on-surface font-serif tracking-tight">Recommended for You</h3>
            <p className="text-xs text-outline">Based on your recent activity</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {(recommendations?.length > 0 ? recommendations : mostPlayed.length > 0 ? mostPlayed : feed).map((track) => (
            <TrackCard key={track.id} track={track} onPlay={(t) => handlePlayTrack(t, recommendations)} />
          ))}
        </div>
      </section>

      {/* Hero-like Promo Sections (from original design) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group relative bg-gradient-to-br from-[#489abd] to-surface-container p-1 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="bg-surface-lowest/40 backdrop-blur-sm p-8 rounded-[14px] h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-on-primary-container text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                <span className="w-8 h-[1px] bg-on-primary-container" />
                Special
              </div>
              <h4 className="text-4xl font-bold mb-3 text-on-surface leading-tight">Weekly Discovery</h4>
              <p className="text-outline/80 max-w-xs text-sm leading-relaxed">
                A carefully curated selection of ambient, electronic, and lo-fi tracks.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-xs font-bold text-outline">50 songs • 3 hr 15 min</span>
              <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_0_20px_rgba(130,208,246,0.4)] group-hover:scale-110 transition-transform">
                <Play size={28} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-[#d5c4ab] to-surface-container p-1 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="bg-surface-lowest/40 backdrop-blur-sm p-8 rounded-[14px] h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-on-tertiary-container text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                <span className="w-8 h-[1px] bg-on-tertiary-container" />
                Mood
              </div>
              <h4 className="text-4xl font-bold mb-3 text-on-surface leading-tight">Chill Vibes</h4>
              <p className="text-outline/80 max-w-xs text-sm leading-relaxed">
                Perfect background music for deep focus, relaxation, or just unwinding.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-xs font-bold text-outline">24 songs • 1 hr 45 min</span>
              <button className="w-14 h-14 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shadow-[0_0_20px_rgba(213,196,171,0.4)] group-hover:scale-110 transition-transform">
                <Play size={28} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

