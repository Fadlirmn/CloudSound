import { useState } from 'react';
import { Search as SearchIcon, X, Play, Plus, Heart } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQuery } from '@tanstack/react-query';
import { musicService } from '../services/musicService';
import type { Track } from '../types';

const TrackListItem = ({ track, onPlay }: { track: Track; onPlay: () => void }) => {
  const { playlists, addTrackToPlaylist, likedTrackIds, toggleLike } = usePlayerStore();
  const [showMenu, setShowMenu] = useState(false);
  const isLiked = likedTrackIds.includes(track.id);

  return (
    <div className="relative group">
      <div 
        className="flex items-center gap-4 p-2 rounded-md hover:bg-surface-highest cursor-pointer"
        onClick={onPlay}
      >
        <div className="relative w-12 h-12 flex-shrink-0">
          <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover rounded" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={16} fill="white" className="text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-on-surface truncate">{track.title}</h4>
          <p className="text-sm text-outline truncate">{track.artist}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-outline hidden sm:block">
            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(track);
            }}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isLiked ? 'text-primary' : 'text-outline hover:text-on-surface hover:bg-surface-highest opacity-0 group-hover:opacity-100'}`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full text-outline hover:text-on-surface hover:bg-surface-highest opacity-0 group-hover:opacity-100 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {showMenu && (
        <div 
          className="absolute right-0 top-12 z-50 bg-surface-highest border border-surface-container rounded-xl shadow-2xl py-2 w-48 animate-in fade-in zoom-in duration-200"
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
    </div>
  );
};

const Search = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { setTrack, setQueue } = usePlayerStore();

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => musicService.searchTracks(debouncedQuery),
    enabled: debouncedQuery.length > 0
  });

  const handleClear = () => setQuery('');

  const handlePlayTrack = (track: Track) => {
    if (results) setQueue(results);
    setTrack(track);
  };

  return (
    <div className="space-y-8">
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md pb-4 pt-4 -mt-4">
        <div className="relative max-w-full">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-highest border-none rounded-full py-3 pl-12 pr-12 text-on-surface focus:ring-2 focus:ring-primary transition-all outline-none"
          />
          {query && (
            <button 
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      {!query ? (
        <section>
          <h3 className="text-xl font-bold text-on-surface mb-6">Browse all</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic', 'Classical', 'Lofi', 'Country'].map((genre) => (
              <div 
                key={genre}
                onClick={() => setQuery(genre)}
                className="aspect-[4/3] rounded-lg p-4 font-bold text-xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-all overflow-hidden relative group"
                style={{ backgroundColor: `hsl(${Math.random() * 360}, 60%, 40%)` }}
              >
                <span className="relative z-10">{genre}</span>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rotate-12 rounded-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h3 className="text-xl font-bold text-on-surface mb-6">
            {isLoading ? 'Searching...' : `Results for "${debouncedQuery}"`}
          </h3>
          
          <div className="space-y-2">
            {results?.map((track) => (
              <TrackListItem key={track.id} track={track} onPlay={() => handlePlayTrack(track)} />
            ))}
            
            {!isLoading && results?.length === 0 && (
              <p className="text-outline">No tracks found.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Search;

