import { useParams } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import { Play, Clock, MoreHorizontal, Music } from 'lucide-react';

const PlaylistDetail = () => {
  const { id } = useParams();
  const { playlists, setTrack, setQueue } = usePlayerStore();
  const playlist = playlists.find(p => p.id === id);

  if (!playlist) return <div className="p-8">Playlist not found</div>;

  const handlePlayPlaylist = () => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks);
      setTrack(playlist.tracks[0]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row items-end gap-6">
        <div className="w-52 h-52 bg-surface-highest flex items-center justify-center rounded-xl shadow-2xl border border-surface-container">
          <Music size={80} className="text-outline" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-outline">Playlist</span>
          <h1 className="text-6xl font-bold text-on-surface">{playlist.name}</h1>
          <div className="flex items-center gap-2 text-sm text-outline">
            <span className="font-bold text-on-surface">You</span>
            <span>•</span>
            <span>{playlist.tracks.length} songs</span>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-6">
        <button 
          onClick={handlePlayPlaylist}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg hover:scale-105 transition-transform"
        >
          <Play size={28} fill="currentColor" />
        </button>
        <button className="text-outline hover:text-on-surface">
          <MoreHorizontal size={24} />
        </button>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-[16px_1fr_1fr_48px] gap-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-outline border-b border-surface-highest">
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <div className="flex justify-end"><Clock size={16} /></div>
        </div>

        {playlist.tracks.length === 0 ? (
          <div className="p-12 text-center text-outline italic">
            This playlist is empty. Search for songs to add them!
          </div>
        ) : (
          playlist.tracks.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => {
                setQueue(playlist.tracks);
                setTrack(track);
              }}
              className="grid grid-cols-[16px_1fr_1fr_48px] gap-4 px-4 py-3 text-sm text-outline hover:bg-surface-highest/50 rounded-md cursor-pointer group transition-colors"
            >
              <span className="group-hover:text-primary">{index + 1}</span>
              <div className="flex items-center gap-3">
                <img src={track.coverUrl} className="w-10 h-10 rounded" alt={track.title} />
                <div className="flex flex-col">
                  <span className="text-on-surface font-medium truncate">{track.title}</span>
                  <span className="text-xs truncate">{track.artist}</span>
                </div>
              </div>
              <span className="truncate flex items-center">{track.album}</span>
              <span className="flex items-center justify-end">
                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
