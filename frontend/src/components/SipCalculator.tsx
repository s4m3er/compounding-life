import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Sparkles, Zap } from 'lucide-react';
import axios from 'axios';

interface YearlyPoint {
  year: number;
  monthlyAmount: number;
  totalInvestedTillDate: number;
  totalNominalWealth: number;
  inflationAdjustedRealWealth: number;
}

interface SipData {
  totalInvestedAmount: number;
  totalWealthNominal: number;
  totalWealthRealAdjusted: number;
  estimatedReturns: number;
  wealthGainMultiplier: number;
  trajectory: YearlyPoint[];
  boringWisdomInsight: string;
}

export const SipCalculator: React.FC = () => {
  const [monthly, setMonthly] = useState<number>(20000);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [years, setYears] = useState<number>(20);
  const [stepUp, setStepUp] = useState<number>(10);
  const [inflation, setInflation] = useState<number>(6);

  // 1. Instant 60 FPS Client-Side Math Computation (0ms Latency on every slider tick)
  const calculatedData: SipData = useMemo(() => {
    let currentMonthly = monthly;
    let totalInv = 0;
    let nominal = 0;
    const monthlyRate = returnRate / 100 / 12;
    const trajectory: YearlyPoint[] = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        totalInv += currentMonthly;
        nominal = (nominal + currentMonthly) * (1 + monthlyRate);
      }
      const real = nominal / Math.pow(1 + inflation / 100, y);
      trajectory.push({
        year: y,
        monthlyAmount: Math.round(currentMonthly),
        totalInvestedTillDate: Math.round(totalInv),
        totalNominalWealth: Math.round(nominal),
        inflationAdjustedRealWealth: Math.round(real)
      });
      currentMonthly = currentMonthly * (1 + stepUp / 100);
    }

    const multiplier = totalInv > 0 ? Math.round((nominal / totalInv) * 100) / 100 : 1;

    let insight = "Compounding is mathematically back-heavy. The first 7 years feel slow, but years 15-20 create explosive wealth.";
    if (years >= 25) {
      insight = `At ${years} years, compounding is in the runaway phase: your returns surpass your total invested capital by more than ${multiplier}x!`;
    } else if (stepUp >= 10) {
      insight = `A ${stepUp}% annual step-up dramatically outpaces inflation, supercharging terminal wealth by 2x-3x over a flat SIP.`;
    }

    return {
      totalInvestedAmount: Math.round(totalInv),
      totalWealthNominal: Math.round(nominal),
      totalWealthRealAdjusted: Math.round(nominal / Math.pow(1 + inflation / 100, years)),
      estimatedReturns: Math.round(nominal - totalInv),
      wealthGainMultiplier: multiplier,
      trajectory,
      boringWisdomInsight: insight
    };
  }, [monthly, returnRate, years, stepUp, inflation]);

  // 2. Debounced asynchronous background sync with backend / Kafka analytics (does not block UI)
  useEffect(() => {
    const handler = setTimeout(() => {
      axios.post('/api/finance/sip', {
        monthlyInvestment: monthly,
        expectedAnnualReturnRate: returnRate,
        tenureYears: years,
        annualStepUpPercentage: stepUp,
        inflationRate: inflation
      }).catch(() => {
        // Silently catch background analytics sync if offline
      });
    }, 800);

    return () => clearTimeout(handler);
  }, [monthly, returnRate, years, stepUp, inflation]);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">SIP & Step-Up Compounding Engine</h2>
              <span className="flex items-center text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                <Zap className="h-2.5 w-2.5 mr-1" /> Realtime 60fps
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Watch how disciplined, boring monthly contributions compound exponentially over time.
            </p>
          </div>
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {calculatedData.wealthGainMultiplier}x Multiplier
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Controls */}
          <div className="space-y-4 sm:space-y-5 bg-slate-950/60 p-4 sm:p-5 rounded-lg border border-slate-800/80">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-300 font-medium">Monthly Investment</span>
                <span className="text-emerald-400 font-bold font-mono">{formatCurrency(monthly)}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={150000}
                step={1000}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-300 font-medium">Expected Annual Return</span>
                <span className="text-emerald-400 font-bold font-mono">{returnRate}%</span>
              </div>
              <input
                type="range"
                min={8}
                max={16}
                step={0.5}
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[11px] text-slate-500">Historical broad market Nifty 50 CAGR is ~12-13%</span>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-300 font-medium">Tenure (Years)</span>
                <span className="text-emerald-400 font-bold font-mono">{years} Years</span>
              </div>
              <input
                type="range"
                min={5}
                max={35}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-300 font-medium">Annual Step-Up</span>
                <span className="text-emerald-400 font-bold font-mono">+{stepUp}% / yr</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={stepUp}
                onChange={(e) => setStepUp(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[11px] text-slate-500">Increase SIP as salary increases to beat lifestyle inflation</span>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-300 font-medium">Expected Inflation</span>
                <span className="text-amber-400 font-bold font-mono">{inflation}%</span>
              </div>
              <input
                type="range"
                min={4}
                max={8}
                step={0.5}
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Results Summary & Chart */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-slate-950/70 border border-slate-800 p-2.5 sm:p-3.5 rounded-lg">
                <div className="text-[10px] sm:text-xs text-slate-400">Total Invested</div>
                <div className="text-xs sm:text-base font-bold font-mono text-slate-200 mt-1">
                  {formatCurrency(calculatedData.totalInvestedAmount)}
                </div>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-800/40 p-2.5 sm:p-3.5 rounded-lg">
                <div className="text-[10px] sm:text-xs text-emerald-400">Nominal Wealth</div>
                <div className="text-xs sm:text-base font-bold font-mono text-emerald-300 mt-1">
                  {formatCurrency(calculatedData.totalWealthNominal)}
                </div>
              </div>
              <div className="bg-amber-950/20 border border-amber-800/40 p-2.5 sm:p-3.5 rounded-lg">
                <div className="text-[10px] sm:text-xs text-amber-400">Real (Inflation-Adj)</div>
                <div className="text-xs sm:text-base font-bold font-mono text-amber-300 mt-1">
                  {formatCurrency(calculatedData.totalWealthRealAdjusted)}
                </div>
              </div>
            </div>

            {/* Recharts SVG Curve with zero animation lag for real-time 60fps responsiveness */}
            <div className="bg-slate-950/60 border border-slate-800 p-2 sm:p-4 rounded-lg h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calculatedData.trajectory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="nominalColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="realColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="investedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" tickFormatter={(y) => `Yr ${y}`} stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => formatCurrency(v)} stroke="#64748b" width={65} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area
                    type="monotone"
                    dataKey="totalNominalWealth"
                    name="Nominal Value"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#nominalColor)"
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="inflationAdjustedRealWealth"
                    name="Purchasing Power"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#realColor)"
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalInvestedTillDate"
                    name="Principal Invested"
                    stroke="#94a3b8"
                    fillOpacity={1}
                    fill="url(#investedColor)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Boring Wisdom Insight Box */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3 sm:p-3.5 flex items-start space-x-2.5 sm:space-x-3">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-sans">
                <span className="font-semibold text-emerald-300">The Boring Law: </span>
                {calculatedData.boringWisdomInsight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
