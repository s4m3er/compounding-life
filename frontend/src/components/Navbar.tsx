import React from 'react';
import { HeartPulse, TrendingUp, Sparkles, BookOpen, ShieldCheck, CheckSquare, ShieldAlert, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiChat: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAiChat, openAuthModal }) => {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { id: 'sip', label: 'SIP Compounding', icon: TrendingUp },
    { id: 'emergency', label: 'Emergency Fund', icon: ShieldCheck },
    { id: 'insurance', label: 'Insurance Shield', icon: ShieldAlert },
    { id: 'habits', label: 'Boring Basics (Daily)', icon: CheckSquare },
    { id: 'wisdom', label: 'Wisdom Vault', icon: BookOpen },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Portal', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('sip')}>
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-100 tracking-tight">Compounding Life</span>
            <span className="text-xs block text-slate-400 font-mono">Health + Wealth Longevity</span>
          </div>
        </div>

        <nav className="hidden lg:flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={openAiChat}
            className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg shadow-emerald-900/20 border border-emerald-400/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Rational AI</span>
          </button>

          {user ? (
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 py-1 px-2.5 rounded-lg text-xs">
              <div className="flex items-center space-x-1.5 text-slate-200">
                <span className="font-semibold text-emerald-400">{user.fullName}</span>
                {user.role === 'ROLE_ADMIN' && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">Admin</span>
                )}
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
