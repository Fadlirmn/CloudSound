import { ChevronDown, Share2, MoreHorizontal, Maximize2, Heart } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useNavigate } from 'react-router-dom';

const NowPlaying = () => {
  const { currentTrack, queue, setTrack } = usePlayerStore();
  const navigate = useNavigate();

  if (!currentTrack) {
    navigate('/');
    return null;
  }

  const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
  const nextTracks = queue.slice(currentIndex + 1, currentIndex + 5);

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Header */}
      <header className="p-6 flex items-center justify-between shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-highest text-on-surface hover:scale-105 transition-transform"
        >
          <ChevronDown size={24} />
        </button>
        <span className="text-xs font-bold tracking-widest uppercase text-outline">Now Playing</span>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-highest text-on-surface hover:scale-105 transition-transform">
          <MoreHorizontal size={24} />
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row gap-12 px-8 py-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Left Section: Info & Lyrics */}
        <div className="flex-[2] flex flex-col gap-10 overflow-y-auto no-scrollbar pb-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Album Art */}
            <div className="w-full max-w-[320px] aspect-square shrink-0 relative group">
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-surface-highest"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </div>

            <div className="flex-1 flex flex-col gap-6 w-full">
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
                  <div className="w-4 h-0.5 bg-primary animate-pulse" />
                  Playing from library
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-on-surface leading-tight tracking-tight">
                  {currentTrack.title}
                </h1>
                <p className="text-xl text-outline font-medium">
                  {currentTrack.artist} <span className="mx-2 text-surface-highest">•</span> {currentTrack.album || 'Single'}
                </p>
              </div>
              <div className="flex justify-center md:justify-start gap-4">
                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-lg hover:scale-110 transition-all">
                  <Heart size={28} fill="currentColor" />
                </button>
                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-surface-highest text-on-surface hover:scale-110 transition-all border border-surface-container">
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Lyrics Section */}
          <div className="bg-surface-container/30 rounded-[32px] p-10 border border-surface-highest/50 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-outline">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Synchronized Lyrics
              </div>
              <button className="text-outline hover:text-on-surface transition-colors">
                <Maximize2 size={18} />
              </button>
            </div>
            
            <div className="space-y-8 text-3xl md:text-4xl font-bold leading-relaxed">
              <p className="text-outline/20 hover:text-outline/40 transition-colors cursor-pointer">Walking through the electric rain</p>
              <p className="text-outline/20 hover:text-outline/40 transition-colors cursor-pointer">Neon reflections hide the pain</p>
              <p className="text-primary scale-105 origin-left transition-all cursor-pointer">Lost within the digital stream,</p>
              <p className="text-on-surface hover:text-primary transition-colors cursor-pointer">Waking up from a silicon dream</p>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Section: Next Up Sidebar */}
        <div className="flex-1 max-w-[400px] hidden lg:flex flex-col gap-6">
          <div className="flex items-center justify-between shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-outline">Next Up</h3>
            <button className="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 no-scrollbar">
            {nextTracks.length > 0 ? (
              nextTracks.map((track) => (
                <div 
                  key={track.id}
                  onClick={() => setTrack(track)}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-highest/50 cursor-pointer group transition-all border border-transparent hover:border-surface-highest"
                >
                  <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl">
                    <img src={track.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={track.title} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{track.title}</h4>
                    <p className="text-xs text-outline truncate">{track.artist}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-surface-highest rounded-2xl text-outline text-sm">
                Queue is empty
              </div>
            )}
          </div>

          {/* Mini Album Teaser */}
          <div className="mt-auto bg-gradient-to-br from-primary/10 to-surface-container rounded-[24px] p-6 border border-primary/20">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Featured Album</p>
            <h4 className="font-bold text-on-surface mb-4">Midnight City Classics</h4>
            <button className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs hover:scale-105 transition-transform">
              Browse Collection
            </button>
          </div>
        </div>
      </div>

      {/* Spacing for PlayerBar */}
      <div className="h-24 shrink-0" /> 
    </div>
  );
};

export default NowPlaying;
