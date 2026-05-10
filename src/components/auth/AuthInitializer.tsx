import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import client from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { Loader2 } from 'lucide-react';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { login, logout, token } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // If we have a token but might not have user data or just want to verify
      if (token) {
        try {
          // Verify token by fetching fresh profile data
          const response = await client.get(ENDPOINTS.AUTH.ME);
          if (response.data) {
            login(response.data, token);
          }
        } catch (error: any) {
          console.error('Auth verification failed:', error);
          // If token is invalid (401), clear it
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
      setIsInitializing(false);
    };

    verifyAuth();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center animate-pulse">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-outline text-sm font-medium animate-pulse">Restoring your session...</p>
      </div>
    );
  }

  return <>{children}</>;
};
