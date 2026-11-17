import React, { useState } from 'react';
import { X, Send, Sparkles, Shield, Compass, Newspaper } from 'lucide-react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Greetings. I am your Rational Compounding Companion, guided by the timeless principles of Charlie Munger, Warren Buffett, Benjamin Graham, Parag Parikh, and longevity health science. How can I help you stay calm and focused on the boring fundamentals today?"
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'news'>('chat');
  const [newsInput, setNewsInput] = useState<string>('');

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post<{ reply: string }>('/api/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "Munger reminds us: The big money is not in trading, but in waiting. Stick to your emergency buffer, sleep 7-8 hours, and let your automated SIP do the work. (AI fallback response)"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainNews = async () => {
    if (!newsInput.trim() || loading) return;

    const headline = newsInput.trim();
    setNewsInput('');
    setActiveMode('chat');
    setMessages(prev => [...prev, { role: 'user', text: `Explain this alarming news for a long-term investor: "${headline}"` }]);
    setLoading(true);

    try {
      const res = await axios.post<{ explanation: string }>('/api/ai/explain-news', { news: headline });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.explanation }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "Throughout human history—from the Cold War to global pandemics—the world has continuously faced acute crises. Great businesses adapt and continue compounding. Never sell your assets during broad panic."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                <span>Rational AI Companion</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Gemini Flash Pro
                </span>
              </div>
              <div className="text-xs text-slate-400">Munger & Buffett Mindset • Anti-Noise • Longevity</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex space-x-2 text-xs">
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeMode === 'chat'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Conversational Advisor
          </button>
          <button
            onClick={() => setActiveMode('news')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-colors ${
              activeMode === 'news'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" />
            <span>Geopolitics & News De-escalator</span>
          </button>
        </div>

        {/* Body Content */}
        {activeMode === 'news' ? (
          <div className="p-6 flex-1 flex flex-col justify-center space-y-4 max-w-lg mx-auto">
            <div className="text-center space-y-1">
              <Compass className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-100">Feeling Anxious About Market or World News?</h3>
              <p className="text-xs text-slate-400">
                Paste any dramatic geopolitical headline or rumor. Our AI evaluates it with 100 years of market history to help you stay calm.
              </p>
            </div>
            <textarea
              rows={3}
              value={newsInput}
              onChange={(e) => setNewsInput(e.target.value)}
              placeholder="e.g. 'War escalation, interest rate shocks, crash incoming...'"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleExplainNews}
              disabled={loading || !newsInput.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-all"
            >
              {loading ? 'Analyzing with Graham/Buffett Mindset...' : 'De-escalate & Rationalize'}
            </button>
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-950/80 border border-slate-800 text-slate-400 rounded-xl p-3 text-xs flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Thinking rationally...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Bar */}
        {activeMode === 'chat' && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about SIP, frugality, emergency fund, or emotional discipline..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
