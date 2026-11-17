import React, { useState } from 'react';
import { HeartPulse, TrendingUp, Sparkles, BookOpen, ShieldCheck, CheckSquare, ShieldAlert, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiChat: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAiChat, openAuthModal }) => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick('sip')}>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg text-slate-100 tracking-tight">Compounding Life</span>
              <span className="text-[10px] sm:text-xs block text-slate-400 font-mono">Health + Wealth</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
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

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={openAiChat}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium shadow-md shadow-emerald-900/20 border border-emerald-400/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="hidden sm:inline">Rational AI</span>
              <span className="sm:hidden">AI</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 py-1 px-2.5 rounded-lg text-xs">
                {user.picture ? (
                  <img src={user.picture} alt={user.fullName} className="h-4 w-4 rounded-full object-cover" />
                ) : null}
                <span className="font-semibold text-emerald-400 max-w-[90px] truncate">{user.fullName}</span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="text-slate-400 hover:text-rose-400 p-0.5 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scrollable Tab Bar (Always Visible on Mobile/Tablet) */}
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950 px-2 py-2 overflow-x-auto no-scrollbar">
          <div className="flex space-x-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 bg-slate-900/60 border border-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Drawer (When Hamburger is Clicked) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-30 bg-slate-950/95 p-6 backdrop-blur space-y-3">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Navigation Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 bg-slate-900/60 border border-slate-800'
                }`}
              >
                <Icon className="h-5 w-5 text-emerald-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};
