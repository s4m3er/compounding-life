import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Heart, DollarSign, Award, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface HabitItem {
  id: string;
  pillar: string;
  title: string;
  description: string;
  completed: boolean;
  impactScore: number;
}

interface ScoreData {
  totalScore: number;
  status: string;
  primaryRecommendations: string[];
  dailyMantra: string;
}

export const DailyHabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: 'h-sleep',
      pillar: 'HEALTH',
      title: '7+ Hours Restorative Sleep',
      description: 'No screens 45 mins before bed. Cellular repair and brain detoxification.',
      completed: true,
      impactScore: 10
    },
    {
      id: 'h-steps',
      pillar: 'HEALTH',
      title: '8,000–10,000 Daily Steps',
      description: 'Brisk walking compounds cardiovascular health and metabolic baseline.',
      completed: true,
      impactScore: 8
    },
    {
      id: 'h-food',
      pillar: 'HEALTH',
      title: 'Real Home-Cooked Food',
      description: 'Zero ultra-processed sugar, adequate hydration and protein.',
      completed: false,
      impactScore: 9
    },
    {
      id: 'h-inversion',
      pillar: 'HEALTH',
      title: 'Health Inversion: Avoid Poison',
      description: 'Zero smoking, no binge alcohol, mindful breathwork during daytime stress.',
      completed: true,
      impactScore: 10
    },
    {
      id: 'w-frugal',
      pillar: 'WEALTH',
      title: 'Mindful Frugality (No Impulse Buys)',
      description: 'Applied 24-hour waiting rule for non-essentials today.',
      completed: true,
      impactScore: 8
    },
    {
      id: 'w-sip',
      pillar: 'WEALTH',
      title: 'Automated Compounding (SIP Active)',
      description: 'Automated monthly savings intact. Zero attempt to time or gamble on market dips.',
      completed: true,
      impactScore: 10
    },
    {
      id: 'w-noise',
      pillar: 'WEALTH',
      title: 'Ignored Financial & Geopolitics Noise',
      description: 'Did not check ticker prices or panic over media doom-and-gloom.',
      completed: true,
      impactScore: 9
    },
    {
      id: 'w-inversion',
      pillar: 'WEALTH',
      title: 'Wealth Inversion: Avoid Ruin',
      description: 'Zero F&O trading, zero credit card balance carried, zero hot stock tips.',
      completed: true,
      impactScore: 10
    }
  ]);

  const [score, setScore] = useState<ScoreData | null>(null);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const evaluate = async () => {
    try {
      const res = await axios.post<ScoreData>('/api/habits/evaluate', habits);
      setScore(res.data);
    } catch {
      // Local fallback calculation
      const max = habits.reduce((acc, h) => acc + h.impactScore, 0);
      const earned = habits.filter(h => h.completed).reduce((acc, h) => acc + h.impactScore, 0);
      const pct = Math.round((earned / max) * 100);
      setScore({
        totalScore: pct,
        status: pct >= 80 ? 'Bulletproof Compounding' : (pct >= 50 ? 'Steadily Building' : 'Vulnerable to Shocks'),
        primaryRecommendations: [
          pct >= 80
            ? 'You are practicing the boring habits that guarantee longevity and wealth.'
            : 'Focus on 7h sleep and consistent automated savings first.',
          'Munger rule: Avoiding stupidity yields better lifetime results than seeking genius.'
        ],
        dailyMantra: 'Health + Wealth = Freedom to live life on your terms.'
      });
    }
  };

  useEffect(() => {
    evaluate();
  }, [habits]);

  const healthHabits = habits.filter(h => h.pillar === 'HEALTH');
  const wealthHabits = habits.filter(h => h.pillar === 'WEALTH');

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
              <CheckSquare className="h-6 w-6 text-emerald-400" />
              <span>Daily Boring Basics: Longevity & Wealth Audit</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              No fancy fads. Just the small, boring habits that compound into exceptional health and financial peace.
            </p>
          </div>

          {score && (
            <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <Award className="h-6 w-6 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400">Compounding Score</div>
                <div className="text-lg font-bold font-mono text-emerald-300">
                  {score.totalScore}% — {score.status}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Pillar */}
          <div className="space-y-3 bg-slate-950/60 p-5 rounded-lg border border-slate-800/80">
            <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm border-b border-slate-800 pb-2">
              <Heart className="h-4 w-4" />
              <span>Physical Longevity (Health Basics)</span>
            </div>
            <div className="space-y-2.5 pt-1">
              {healthHabits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    habit.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    {habit.completed ? (
                      <CheckSquare className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${habit.completed ? 'text-slate-100 line-through opacity-80' : 'text-slate-200'}`}>
                      {habit.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{habit.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wealth Pillar */}
          <div className="space-y-3 bg-slate-950/60 p-5 rounded-lg border border-slate-800/80">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm border-b border-slate-800 pb-2">
              <DollarSign className="h-4 w-4" />
              <span>Financial Longevity (Wealth Basics)</span>
            </div>
            <div className="space-y-2.5 pt-1">
              {wealthHabits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    habit.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    {habit.completed ? (
                      <CheckSquare className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${habit.completed ? 'text-slate-100 line-through opacity-80' : 'text-slate-200'}`}>
                      {habit.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{habit.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {score && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 mt-6">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Daily Longevity Mantra</div>
            <p className="text-sm text-emerald-300 font-medium italic">"{score.dailyMantra}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
