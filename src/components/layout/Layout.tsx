import Sidebar from './Sidebar';
import PlayerBar from './PlayerBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-surface-low to-surface">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <PlayerBar />
    </div>
  );
};

export default Layout;
