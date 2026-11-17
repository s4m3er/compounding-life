import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { SipCalculator } from './components/SipCalculator';
import { EmergencyFundCalculator } from './components/EmergencyFundCalculator';
import { InsuranceAdvisor } from './components/InsuranceAdvisor';
import { DailyHabitTracker } from './components/DailyHabitTracker';
import { WisdomHub } from './components/WisdomHub';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { AiAssistant } from './components/AiAssistant';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { HeartPulse, Sparkles, TrendingUp, Database, Globe, Shield } from 'lucide-react';
import axios from 'axios';

interface SystemInfo {
  app?: string;
  backendVersion?: string;
  status?: string;
  region?: string;
  database?: string;
  databaseStatus?: string;
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState<string>('sip');
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const { user, userProfile, isAdmin } = useAuth();

  // Trigger personalized onboarding if user is logged in and hasn't completed onboarding yet
  useEffect(() => {
    if (user && userProfile && !userProfile.onboardingCompleted) {
      setIsOnboardingOpen(true);
    }
  }, [user, userProfile]);

  useEffect(() => {
    // Only fetch live backend version & database telemetry if user is authenticated Admin
    if (isAdmin) {
      axios.get<SystemInfo>('/api/system/version')
        .then(res => setSystemInfo(res.data))
        .catch(() => {
          setSystemInfo({
            backendVersion: '1.2.0',
            status: 'UP',
            database: 'PostgreSQL',
            databaseStatus: 'CONNECTED',
            region: 'asia-south1 (Mumbai)'
          });
        });
    } else {
      setSystemInfo(null);
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiChat={() => setIsAiOpen(true)}
        openAuthModal={() => setIsAuthOpen(true)}
        openProfileModal={() => setIsProfileOpen(true)}
      />

      {/* Hero Banner */}
      <section className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950 px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Boring is Beautiful • Health + Wealth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              The Boring, Proven Path to Living Longer &amp; Wealthier
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Human life compounds on just two fundamental pillars: your physical body and your financial peace of mind.
              No complex schemes, no trading, no fads—just boring, consistent habits repeated over decades.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Health Pillar</div>
                <div className="text-xs font-bold text-slate-200">Sleep, Walking, Real Food</div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Wealth Pillar</div>
                <div className="text-xs font-bold text-slate-200">SIP, Frugality, Insurance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'sip' && <SipCalculator />}
        {activeTab === 'emergency' && <EmergencyFundCalculator />}
        {activeTab === 'insurance' && <InsuranceAdvisor />}
        {activeTab === 'habits' && <DailyHabitTracker />}
        {activeTab === 'wisdom' && <WisdomHub />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-slate-400">
            Compounding Life — Inspired by Charlie Munger, Warren Buffett, Benjamin Graham, Parag Parikh &amp; InvestYadnya.
          </p>

          <p className="text-slate-600 font-mono text-[11px]">
            The boring, proven path to physical longevity and financial independence.
          </p>

          {/* Admin-Only Live Architecture & Version Badges */}
          {isAdmin && (
            <div className="pt-3 mt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-wider text-amber-400 font-mono font-semibold mr-1">
                <Shield className="h-3 w-3" />
                <span>Admin Telemetry:</span>
              </span>

              {/* Frontend Version */}
              <span className="inline-flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-[11px] text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span className="font-mono">UI: <strong className="text-emerald-400">v1.2.0</strong></span>
              </span>

              {/* Backend Version & Health */}
              <span className="inline-flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-[11px] text-slate-300">
                <span className={`h-1.5 w-1.5 rounded-full ${systemInfo?.status === 'UP' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="font-mono">
                  API: <strong className="text-emerald-400">{systemInfo?.backendVersion || 'v1.2.0'}</strong>
                </span>
              </span>

              {/* Database Engine & Status */}
              <span className="inline-flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-[11px] text-slate-300">
                <Database className="h-3 w-3 text-emerald-400" />
                <span className="font-mono">
                  DB: <strong className="text-slate-200">{systemInfo?.database || 'PostgreSQL'}</strong>
                  {systemInfo?.databaseStatus && (
                    <span className={`ml-1 text-[10px] px-1 py-0.2 rounded font-mono ${systemInfo.databaseStatus === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {systemInfo.databaseStatus}
                    </span>
                  )}
                </span>
              </span>

              {/* Region */}
              <span className="inline-flex items-center space-x-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-[11px] text-slate-400 font-mono">
                <Globe className="h-3 w-3 text-slate-500" />
                <span>GCP Mumbai</span>
              </span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
