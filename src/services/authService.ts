import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const authService = {
  login: async (email: string, password: string): Promise<{ user: any, token: string }> => {
    try {
      const response = await client.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      return response.data;
    } catch (error) {
      // For demonstration, if backend is not running, simulate success with mock
      if (email === 'user@example.com' && password === 'password') {
        return {
          user: {
            id: '1',
            name: 'John Doe',
            email: 'user@example.com',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
            plan: 'premium'
          },
          token: 'mock-jwt-token'
        };
      }
      throw error;
    }
  },

  register: async (name: string, email: string, password: string): Promise<{ user: any, token: string }> => {
    try {
      const response = await client.post(ENDPOINTS.AUTH.REGISTER, { name, email, password });
      return response.data;
    } catch (error) {
      // Mock fallback for registration
      return {
        user: {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          plan: 'free'
        },
        token: 'mock-jwt-token'
      };
    }
  }
};
