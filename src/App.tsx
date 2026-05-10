import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import NowPlaying from './pages/NowPlaying';
import PlaylistDetail from './pages/PlaylistDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthInitializer } from './components/auth/AuthInitializer';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="search" element={<Search />} />
                <Route path="library" element={<Library />} />
                <Route path="now-playing" element={<NowPlaying />} />
                <Route path="playlist/:id" element={<PlaylistDetail />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </AuthInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
