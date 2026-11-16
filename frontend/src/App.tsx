import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SipCalculator } from './components/SipCalculator';
import { EmergencyFundCalculator } from './components/EmergencyFundCalculator';
import { InsuranceAdvisor } from './components/InsuranceAdvisor';
import { DailyHabitTracker } from './components/DailyHabitTracker';
import { WisdomHub } from './components/WisdomHub';
import { AiAssistant } from './components/AiAssistant';
import { HeartPulse, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('sip');
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiChat={() => setIsAiOpen(true)}
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
      </main>

      {/* Floating AI Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => setIsAiOpen(true)}
          className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center justify-center border border-emerald-400/40"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      </div>

      {/* Rational AI Assistant Modal */}
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-1">
          <p>Compounding Life — Inspired by Charlie Munger, Warren Buffett, Benjamin Graham, Parag Parikh &amp; InvestYadnya.</p>
          <p className="text-slate-600 font-mono">Java 21 • Spring Boot 3.3 • React 18 • Spring AI &amp; MCP • Docker • GCP Cloud Run Ready</p>
        </div>
      </footer>
    </div>
  );
}
