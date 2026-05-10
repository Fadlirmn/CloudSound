import { useEffect } from 'react';
import { Home, Search, Library, PlusSquare, Music2, User as UserIcon } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useAuthStore } from '../../store/useAuthStore';

const Sidebar = () => {
  const { playlists, createPlaylist, fetchPlaylists, fetchLikedTracks } = usePlayerStore();
  const { user, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists();
      fetchLikedTracks();
    }
  }, [isAuthenticated, fetchPlaylists, fetchLikedTracks]);

  const handleCreatePlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name) {
      createPlaylist(name);
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
  ];

  return (
    <div className="w-64 bg-black flex flex-col h-full border-r border-surface-container">
      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Music2 className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-on-surface">SonicFlow</h1>
        </div>

        <nav className="space-y-8">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-4 py-3 px-4 rounded-xl transition-all hover:bg-surface-highest/20 font-medium group",
                    isActive ? "bg-primary/10 text-primary" : "text-outline hover:text-on-surface"
                  )
                }
              >
                <item.icon size={22} className={clsx("transition-transform group-hover:scale-110")} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-8 border-t border-surface-container">
            <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Playlists</h2>
              <button 
                onClick={handleCreatePlaylist}
                className="text-outline hover:text-primary transition-colors"
              >
                <PlusSquare size={18} />
              </button>
            </div>
            
            <div className="space-y-1">
              {playlists.map((playlist) => (
                <NavLink
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className={({ isActive }) =>
                    clsx(
                      "block py-2 px-4 text-sm rounded-lg transition-all hover:bg-surface-highest/20 truncate",
                      isActive ? "text-on-surface bg-surface-highest/10" : "text-outline hover:text-on-surface"
                    )
                  }
                >
                  {playlist.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-surface-highest">
        {isAuthenticated && user ? (
          <NavLink 
            to="/profile"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-surface-highest/40 group",
                isActive ? "bg-surface-highest/60 shadow-sm" : ""
              )
            }
          >
            <div className="relative shrink-0">
              {user.avatar ? (
                <img src={user.avatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-surface-container" alt={user.name} />
              ) : (
                <div className="w-9 h-9 rounded-full bg-surface-highest flex items-center justify-center ring-2 ring-surface-container">
                  <UserIcon size={18} className="text-outline" />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">{user.name}</p>
              <p className="text-[9px] text-outline font-bold uppercase tracking-[0.1em]">{user.plan}</p>
            </div>
          </NavLink>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link 
              to="/login"
              className="py-2.5 px-3 rounded-xl bg-surface-highest text-on-surface font-bold text-xs text-center border border-surface-container hover:bg-surface-highest/80 transition-all"
            >
              Log In
            </Link>
            <Link 
              to="/register"
              className="py-2.5 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs text-center shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Join
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
