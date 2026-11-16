import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';
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

  const [data, setData] = useState<SipData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await axios.post<SipData>('/api/finance/sip', {
        monthlyInvestment: monthly,
        expectedAnnualReturnRate: returnRate,
        tenureYears: years,
        annualStepUpPercentage: stepUp,
        inflationRate: inflation
      });
      setData(res.data);
    } catch {
      // Local fallback calculation if backend isn't running yet
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

      setData({
        totalInvestedAmount: Math.round(totalInv),
        totalWealthNominal: Math.round(nominal),
        totalWealthRealAdjusted: Math.round(nominal / Math.pow(1 + inflation / 100, years)),
        estimatedReturns: Math.round(nominal - totalInv),
        wealthGainMultiplier: Math.round((nominal / totalInv) * 100) / 100,
        trajectory,
        boringWisdomInsight: "Compounding is mathematically back-heavy. The first 7 years feel slow, but years 15-20 create explosive wealth."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [monthly, returnRate, years, stepUp, inflation]);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">SIP & Step-Up Compounding Engine</h2>
            <p className="text-sm text-slate-400">
              Watch how disciplined, boring monthly contributions compound exponentially over time.
            </p>
          </div>
          {data && (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {data.wealthGainMultiplier}x Multiplier
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-5 bg-slate-950/60 p-5 rounded-lg border border-slate-800/80">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
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
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
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
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-xs text-slate-500">Historical broad market Nifty/Sensex index CAGR is ~12-13%</span>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
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
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
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
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-xs text-slate-500">Increase SIP as salary increases to beat lifestyle inflation</span>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
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
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Results Summary & Chart */}
          <div className="lg:col-span-2 space-y-5">
            {data && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-lg">
                  <div className="text-xs text-slate-400">Total Invested</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-200 mt-1">
                    {formatCurrency(data.totalInvestedAmount)}
                  </div>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-800/40 p-3.5 rounded-lg">
                  <div className="text-xs text-emerald-400">Nominal Wealth</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-emerald-300 mt-1">
                    {formatCurrency(data.totalWealthNominal)}
                  </div>
                </div>
                <div className="bg-amber-950/20 border border-amber-800/40 p-3.5 rounded-lg">
                  <div className="text-xs text-amber-400">Real (Inflation-Adjusted)</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-1">
                    {formatCurrency(data.totalWealthRealAdjusted)}
                  </div>
                </div>
              </div>
            )}

            {/* Recharts Curve */}
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.trajectory || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                  <XAxis dataKey="year" tickFormatter={(y) => `Yr ${y}`} stroke="#64748b" textAnchor="end" />
                  <YAxis tickFormatter={(v) => formatCurrency(v)} stroke="#64748b" width={75} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="totalNominalWealth" name="Nominal Value" stroke="#10b981" fillOpacity={1} fill="url(#nominalColor)" strokeWidth={2} />
                  <Area type="monotone" dataKey="inflationAdjustedRealWealth" name="Purchasing Power" stroke="#f59e0b" fillOpacity={1} fill="url(#realColor)" strokeWidth={2} />
                  <Area type="monotone" dataKey="totalInvestedTillDate" name="Principal Invested" stroke="#94a3b8" fillOpacity={1} fill="url(#investedColor)" strokeWidth={2} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Boring Wisdom Insight Box */}
            {data && (
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3.5 flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-sans">
                  <span className="font-semibold text-emerald-300">The Boring Law: </span>
                  {data.boringWisdomInsight}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
