import React, { useState, useEffect } from 'react';
import { BookOpen, Quote, Filter, Sparkles } from 'lucide-react';
import axios from 'axios';

interface WisdomQuote {
  id: string;
  master: string;
  category: string;
  quote: string;
  practicalApplication: string;
  referenceWork: string;
}

export const WisdomHub: React.FC = () => {
  const [quotes, setQuotes] = useState<WisdomQuote[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<string>('ALL');

  const masters = ['ALL', 'Charlie Munger', 'Warren Buffett', 'Benjamin Graham', 'Parag Parikh', 'InvestYadnya', 'Stoic & Health'];

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await axios.get<WisdomQuote[]>('/api/wisdom/all');
        setQuotes(res.data);
      } catch {
        // Fallback quotes
        setQuotes([
          {
            id: 'm1',
            master: 'Charlie Munger',
            category: 'INVERSION',
            quote: 'Invert, always invert: Turn a situation or problem upside down. What happens if we do the exact opposite? What do we want to avoid?',
            practicalApplication: 'To become wealthy, avoid debt, F&O trading, and foolish speculation. To become healthy, avoid smoking, bad sleep, and refined sugar.',
            referenceWork: "Poor Charlie's Almanack"
          },
          {
            id: 'm2',
            master: 'Charlie Munger',
            category: 'BORING_COMPOUNDING',
            quote: 'The big money is not in the buying and the selling, but in the waiting.',
            practicalApplication: 'Do not fiddle with your investments. Check portfolio twice a year, not five times a day.',
            referenceWork: 'Wesco Financial Annual Meeting'
          },
          {
            id: 'b1',
            master: 'Warren Buffett',
            category: 'FRUGALITY',
            quote: 'Do not save what is left after spending, but spend what is left after saving.',
            practicalApplication: 'Automate your SIP deduction on salary day. If you don’t see it in your checking account, you won’t spend it.',
            referenceWork: 'Berkshire Hathaway Shareholder Letters'
          },
          {
            id: 'g1',
            master: 'Benjamin Graham',
            category: 'BEHAVIORAL_BIAS',
            quote: 'The investor’s chief problem—and even his worst enemy—is likely to be himself.',
            practicalApplication: 'Mr. Market’s manic depression is an opportunity, not a threat. Never sell quality assets during broad panic.',
            referenceWork: 'The Intelligent Investor'
          },
          {
            id: 'p1',
            master: 'Parag Parikh',
            category: 'BEHAVIORAL_BIAS',
            quote: 'Loss aversion is the strongest human emotion. The pain of losing $100 is twice as intense as the joy of making $100.',
            practicalApplication: 'Recognize your biological urge to panic sell during crashes and resist it with an automated SIP.',
            referenceWork: 'Stocks to Riches'
          },
          {
            id: 'y1',
            master: 'InvestYadnya',
            category: 'INVERSION',
            quote: 'Before you invest your first rupee in the stock market, you must have an adequate emergency fund and pure term insurance.',
            practicalApplication: 'Investing without health and term insurance is like racing a car without brakes or seatbelts.',
            referenceWork: 'Financial Planning 101'
          },
          {
            id: 'h1',
            master: 'Stoic & Health',
            category: 'HEALTH_LONGEVITY',
            quote: 'A healthy person wants a thousand things; a sick person wants only one.',
            practicalApplication: 'Sleep 7-8 hours, walk 10,000 steps daily, drink clean water. Health is the multiplier of all wealth.',
            referenceWork: 'Timeless Health Principles'
          }
        ]);
      }
    };
    fetchQuotes();
  }, []);

  const filtered = selectedMaster === 'ALL'
    ? quotes
    : quotes.filter(q => q.master.toLowerCase() === selectedMaster.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-emerald-400" />
              <span>Timeless Wisdom Vault</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Battle-tested principles on rational thinking, emotional resilience, and longevity.
            </p>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="h-4 w-4 text-slate-500 flex-shrink-0" />
            {masters.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMaster(m)}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  selectedMaster === m
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-emerald-400 border border-slate-800">
                    {item.master}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>

                <div className="relative pl-6">
                  <Quote className="h-4 w-4 text-emerald-500/60 absolute left-0 top-0.5" />
                  <p className="text-sm text-slate-200 font-serif italic leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800/60 space-y-1">
                <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Practical Daily Application</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.practicalApplication}
                </p>
                <div className="text-[10px] text-slate-500 pt-1">
                  Source: {item.referenceWork}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
