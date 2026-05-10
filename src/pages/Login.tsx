import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Music2, Mail, Lock, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { user, token } = await authService.login(email, password);
      login(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-surface-container p-10 rounded-[40px] border border-surface-highest shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 to-primary" />
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-primary/10 rounded-[20px] flex items-center justify-center mb-5 rotate-3 hover:rotate-0 transition-transform">
            <Music2 className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Welcome Back</h1>
          <p className="text-outline mt-2 text-xs font-medium">Please enter your details to sign in</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-4 rounded-2xl text-xs mb-8 border border-error/20 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                <Mail size={16} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-lowest border border-surface-highest rounded-[18px] py-3 pl-11 pr-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-outline/30"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                <Lock size={16} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-lowest border border-surface-highest rounded-[18px] py-3 pl-11 pr-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-outline/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer appearance-none w-4 h-4 rounded border border-surface-highest bg-surface-lowest checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                <div className="absolute inset-0 flex items-center justify-center text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5L4 7L8 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <span className="text-[11px] text-outline group-hover:text-on-surface transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-[11px] text-primary font-bold hover:underline">Forgot?</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-[18px] shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-[13px] text-outline font-medium">
          New here? {' '}
          <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
