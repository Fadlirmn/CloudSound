import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Settings, CreditCard, Bell, Shield, LogOut, ChevronRight, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const menuItems = [
    { icon: User, label: 'Personal Information', sub: 'Edit your name and avatar' },
    { icon: CreditCard, label: 'Subscription', sub: `Currently on ${user.plan} plan`, action: 'Upgrade' },
    { icon: Bell, label: 'Notifications', sub: 'Manage your alerts' },
    { icon: Shield, label: 'Security', sub: 'Password and authentication' },
    { icon: Settings, label: 'Preferences', sub: 'App theme and language' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-10 pb-32">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-surface-container/50 p-8 rounded-[40px] border border-surface-highest">
        <div className="relative group">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-32 h-32 rounded-full border-4 border-primary/20 object-cover"
          />
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg border-4 border-surface group-hover:scale-110 transition-transform">
            <Camera size={18} />
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-bold text-on-surface">{user.name}</h1>
            <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full self-center md:self-auto">
              {user.plan}
            </span>
          </div>
          <p className="text-outline">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <div className="text-center px-4 border-r border-surface-highest">
              <p className="text-xl font-bold text-on-surface">124</p>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Playlists</p>
            </div>
            <div className="text-center px-4 border-r border-surface-highest">
              <p className="text-xl font-bold text-on-surface">1.2k</p>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Followers</p>
            </div>
            <div className="text-center px-4">
              <p className="text-xl font-bold text-on-surface">482</p>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Following</p>
            </div>
          </div>
        </div>
        
        <button className="px-6 py-3 bg-surface-highest text-on-surface font-bold rounded-2xl hover:bg-surface-highest/80 transition-colors">
          Edit Profile
        </button>
      </div>

      {/* Profile Menu */}
      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            className="group flex items-center gap-6 p-6 bg-surface-container rounded-3xl border border-surface-highest hover:bg-surface-container/80 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-surface-lowest rounded-2xl flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
              <item.icon size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-on-surface">{item.label}</h3>
              <p className="text-xs text-outline">{item.sub}</p>
            </div>
            {item.action ? (
              <button className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors">
                {item.action}
              </button>
            ) : (
              <ChevronRight size={20} className="text-outline group-hover:translate-x-1 transition-transform" />
            )}
          </div>
        ))}

        <button 
          onClick={handleLogout}
          className="group flex items-center gap-6 p-5 text-error font-bold hover:bg-error/5 rounded-3xl transition-all mt-4 border border-transparent hover:border-error/10 w-fit pr-10"
        >
          <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <LogOut size={20} />
          </div>
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
