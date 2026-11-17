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
import { HeartPulse, Sparkles, TrendingUp, Cpu, Database, Globe } from 'lucide-react';
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
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch live backend version & database status
    axios.get<SystemInfo>('/api/system/version')
      .then(res => setSystemInfo(res.data))
      .catch(() => {
        setSystemInfo({
          backendVersion: 'v1.2.0',
          status: 'CONNECTING',
          database: 'PostgreSQL',
          databaseStatus: 'STANDBY',
          region: 'asia-south1'
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiChat={() => setIsAiOpen(true)}
        openAuthModal={() => setIsAuthOpen(true)}
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

      {/* Footer with Live Build & Version Tracking */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="text-slate-400">
            Compounding Life — Inspired by Charlie Munger, Warren Buffett, Benjamin Graham, Parag Parikh &amp; InvestYadnya.
          </p>

          <p className="text-slate-500 font-mono text-[11px]">
            Java 21 • Spring Boot 3.3 • Spring Security 6 • JWT • PostgreSQL • React 18 • Vite • Docker • GCP Cloud Run
          </p>

          {/* Live Version Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {/* Frontend Version */}
            <span className="inline-flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full text-[11px] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono">Frontend: <strong className="text-emerald-400">v1.2.0</strong></span>
            </span>

            {/* Backend Version & Health */}
            <span className="inline-flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full text-[11px] text-slate-300">
              <span className={`h-2 w-2 rounded-full ${systemInfo?.status === 'UP' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="font-mono">
                Backend: <strong className="text-emerald-400">{systemInfo?.backendVersion || 'v1.2.0'}</strong>
              </span>
            </span>

            {/* Database Engine & Status */}
            <span className="inline-flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full text-[11px] text-slate-300">
              <Database className="h-3 w-3 text-emerald-400" />
              <span className="font-mono">
                DB: <strong className="text-slate-200">{systemInfo?.database || 'PostgreSQL'}</strong>
                {systemInfo?.databaseStatus && (
                  <span className={`ml-1 text-[10px] px-1 py-0.2 rounded ${systemInfo.databaseStatus === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {systemInfo.databaseStatus}
                  </span>
                )}
              </span>
            </span>

            {/* Region */}
            <span className="inline-flex items-center space-x-1 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full text-[11px] text-slate-400 font-mono">
              <Globe className="h-3 w-3 text-slate-500" />
              <span>GCP Mumbai (asia-south1)</span>
            </span>
          </div>
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
