import { Library as LibraryIcon, Music, Disc, Mic2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

const Library = () => {
  const { likedTrackIds } = usePlayerStore();

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Your Library</h2>
        <p className="text-outline">Manage your playlists, artists, and albums.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container p-6 rounded-xl hover:bg-surface-highest transition-all cursor-pointer border border-surface-highest group">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
            <Music className="text-primary" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">Liked Songs</h3>
          <p className="text-sm text-outline">{likedTrackIds.length} songs</p>
        </div>

        <div className="bg-surface-container p-6 rounded-xl hover:bg-surface-highest transition-all cursor-pointer border border-surface-highest group">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
            <Disc className="text-secondary" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">Albums</h3>
          <p className="text-sm text-outline">0 albums</p>
        </div>

        <div className="bg-surface-container p-6 rounded-xl hover:bg-surface-highest transition-all cursor-pointer border border-surface-highest group">
          <div className="w-12 h-12 rounded-full bg-tertiary/20 flex items-center justify-center mb-4 group-hover:bg-tertiary/30 transition-colors">
            <Mic2 className="text-tertiary" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">Artists</h3>
          <p className="text-sm text-outline">0 artists</p>
        </div>

        <div className="bg-surface-container p-6 rounded-xl hover:bg-surface-highest transition-all cursor-pointer border border-surface-highest group">
          <div className="w-12 h-12 rounded-full bg-surface-highest flex items-center justify-center mb-4">
            <LibraryIcon className="text-outline" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">Playlists</h3>
          <p className="text-sm text-outline">Create your first playlist</p>
        </div>
      </div>

      <section className="bg-surface-container/30 border border-dashed border-surface-highest p-12 rounded-2xl text-center">
        <LibraryIcon size={48} className="mx-auto text-outline/20 mb-4" />
        <h3 className="text-xl font-bold mb-2">No music here yet</h3>
        <p className="text-outline mb-6">Start following artists or liking songs to build your library.</p>
        <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
          Find something to listen to
        </button>
      </section>
    </div>
  );
};

export default Library;
