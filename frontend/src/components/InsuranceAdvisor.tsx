import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';

interface InsuranceData {
  recommendedTermInsuranceCover: number;
  termInsuranceRationale: string;
  recommendedHealthBaseCover: number;
  recommendedHealthSuperTopupCover: number;
  healthInsuranceRationale: string;
  cardinalRulesToAvoidTraps: string[];
}

export const InsuranceAdvisor: React.FC = () => {
  const [income, setIncome] = useState<number>(1200000);
  const [debts, setDebts] = useState<number>(2500000);
  const [assets, setAssets] = useState<number>(600000);
  const [age, setAge] = useState<number>(31);
  const [city, setCity] = useState<string>('METRO');

  const [data, setData] = useState<InsuranceData | null>(null);

  const calculate = async () => {
    try {
      const res = await axios.post<InsuranceData>('/api/finance/insurance', {
        annualIncome: income,
        totalOutstandingDebts: debts,
        existingLiquidAssets: assets,
        age: age,
        cityTier: city
      });
      setData(res.data);
    } catch {
      // Local fallback
      const multiplier = age <= 35 ? 20 : 15;
      const termCover = Math.ceil((income * multiplier + debts - assets * 0.5) / 2500000) * 2500000;
      setData({
        recommendedTermInsuranceCover: termCover,
        termInsuranceRationale: `Covers ${multiplier}x of your annual income plus outstanding debts so your family never faces forced distress sales.`,
        recommendedHealthBaseCover: city === 'METRO' ? 1500000 : 1000000,
        recommendedHealthSuperTopupCover: city === 'METRO' ? 5000000 : 2500000,
        healthInsuranceRationale: "Base policy handles standard hospitalization; Super Top-up shields against major illness inflation at a fraction of the premium cost.",
        cardinalRulesToAvoidTraps: [
          "NEVER buy ULIPs or Endowment policies. Insurance is for protection; Mutual Funds are for wealth.",
          "Buy Pure Term Insurance with zero return-of-premium gimmicks.",
          "Get an individual family health policy outside of your employer health insurance.",
          "Pair a 10-15 Lakh Base with a 25-50 Lakh Super Top-up deductible."
        ]
      });
    }
  };

  useEffect(() => {
    calculate();
  }, [income, debts, assets, age, city]);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <ShieldAlert className="h-6 w-6 text-emerald-400" />
          <span>Pure Protection & Insurance Needs</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          InvestYadnya & Parag Parikh principle: Insurance is an expense to protect capital, not an investment product.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="space-y-4 bg-slate-950/60 p-5 rounded-lg border border-slate-800/80">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Annual Take-Home Income</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Total Outstanding Loans (Home/Car)</label>
            <input
              type="number"
              value={debts}
              onChange={(e) => setDebts(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Existing Liquid Savings / Investments</label>
            <input
              type="number"
              value={assets}
              onChange={(e) => setAssets(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Your Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">City Tier</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="METRO">Metro (Mumbai, Delhi-NCR, Bangalore, etc.)</option>
              <option value="TIER_1">Tier 1 City (Pune, Hyderabad, Chennai, etc.)</option>
              <option value="TIER_2_OR_3">Tier 2 or Tier 3 City</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-5">
          {data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Term Life Card */}
                <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-lg space-y-2">
                  <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Recommended Pure Term Cover</div>
                  <div className="text-3xl font-bold font-mono text-emerald-300">
                    {formatCurrency(data.recommendedTermInsuranceCover)}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {data.termInsuranceRationale}
                  </p>
                </div>

                {/* Health Cover Card */}
                <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-lg space-y-2">
                  <div className="text-xs uppercase tracking-wider text-teal-400 font-semibold">Recommended Health Umbrella</div>
                  <div className="text-2xl font-bold font-mono text-teal-300">
                    {formatCurrency(data.recommendedHealthBaseCover)} <span className="text-xs text-slate-400 font-sans font-normal">Base</span> + {formatCurrency(data.recommendedHealthSuperTopupCover)} <span className="text-xs text-slate-400 font-sans font-normal">Top-Up</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {data.healthInsuranceRationale}
                  </p>
                </div>
              </div>

              {/* Cardinal Rules */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 space-y-3">
                <div className="text-sm font-semibold text-slate-200">Boring Cardinal Rules to Avoid Financial Traps:</div>
                <div className="space-y-2">
                  {data.cardinalRulesToAvoidTraps.map((rule, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
