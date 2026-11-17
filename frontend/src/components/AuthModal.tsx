import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, loginWithGoogle } = useAuth();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '850966046813-3n5fk3j93n0ft3c6gecc8vpjjle2rhmn.apps.googleusercontent.com';

    // Initialize Google Identity Services if available
    const initGsi = () => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              if (response.credential) {
                setLoading(true);
                setError('');
                try {
                  await loginWithGoogle(response.credential);
                  onClose();
                } catch (err: any) {
                  setError(err.response?.data?.error || 'Google Sign-In failed.');
                } finally {
                  setLoading(false);
                }
              }
            }
          });

          const btnContainer = document.getElementById('googleSignInBtnDiv');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            google.accounts.id.renderButton(btnContainer, {
              theme: 'filled_black',
              size: 'large',
              width: 380,
              text: isRegister ? 'signup_with' : 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left'
            });
          }
        } catch (e) {
          console.warn('Google Identity error', e);
        }
      }
    };

    // Small delay to ensure script has loaded in DOM
    const timer = setTimeout(initGsi, 300);
    return () => clearTimeout(timer);
  }, [isOpen, isRegister]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName.trim()) {
          setError('Please provide your full name');
          setLoading(false);
          return;
        }
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@compoundinglife.com');
      setPassword('Admin@123');
      setIsRegister(false);
    } else {
      setEmail('investor@compoundinglife.com');
      setPassword('Investor@123');
      setIsRegister(false);
    }
  };

  const handleCustomGoogleClick = () => {
    const google = (window as any).google;
    if (google?.accounts?.id) {
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt was skipped or blocked, inform user
          setError('Google Sign-In prompt was closed. Please use the button below or register with email.');
        }
      });
    } else {
      setError('Google Sign-In is initializing. Please wait a moment or sign in with email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-100">
            {isRegister ? 'Create Your Account' : 'Welcome to Compounding Life'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister
              ? 'Save your custom SIP targets, emergency fund calculations, and track daily longevity habits.'
              : 'Sign in to access your saved financial targets and personal longevity audit.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Google Sign-In Container */}
        <div className="space-y-3 mb-5">
          <div id="googleSignInBtnDiv" className="flex justify-center min-h-[40px] w-full">
            {/* Fallback Custom Google Button while official button renders */}
            <button
              type="button"
              onClick={handleCustomGoogleClick}
              className="w-full flex items-center justify-center space-x-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isRegister ? 'Continue with Google' : 'Sign in with Google'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">or with email</span>
            <div className="border-t border-slate-800 w-full"></div>
          </div>
        </div>

        {/* Standard Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sameer Deshpande"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-md shadow-emerald-950/40"
          >
            {loading ? 'Processing...' : (isRegister ? 'Register Account' : 'Sign In')}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-5 pt-3.5 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 font-medium">Quick Demo One-Click Fill:</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="flex-1 text-xs py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              👑 Login as Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('user')}
              className="flex-1 text-xs py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              👤 Login as Member
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            {isRegister
              ? 'Already have an account? Sign in here'
              : "Don't have an account yet? Register free"}
          </button>
        </div>
      </div>
    </div>
  );
};
