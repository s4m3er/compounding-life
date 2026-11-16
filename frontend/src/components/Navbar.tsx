import React from 'react';
import { HeartPulse, TrendingUp, Sparkles, BookOpen, ShieldCheck, CheckSquare } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAiChat }) => {
  const navItems = [
    { id: 'sip', label: 'SIP Compounding', icon: TrendingUp },
    { id: 'emergency', label: 'Emergency Fund', icon: ShieldCheck },
    { id: 'insurance', label: 'Insurance Shield', icon: ShieldCheck },
    { id: 'habits', label: 'Boring Basics (Daily)', icon: CheckSquare },
    { id: 'wisdom', label: 'Wisdom Vault', icon: BookOpen },
  ];

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

        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={openAiChat}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-lg text-sm font-medium shadow-lg shadow-emerald-900/20 border border-emerald-400/20 transition-all"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>Ask Rational AI</span>
        </button>
      </div>
    </header>
  );
};
