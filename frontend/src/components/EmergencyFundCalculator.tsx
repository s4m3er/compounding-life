import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Layers } from 'lucide-react';
import axios from 'axios';

interface Tier {
  bucketName: string;
  amount: number;
  instrument: string;
  rationale: string;
}

interface FundData {
  recommendedMonths: number;
  totalFundRequired: number;
  allocationPlan: Tier[];
  inversionRule: string;
}

export const EmergencyFundCalculator: React.FC = () => {
  const [expenses, setExpenses] = useState<number>(60000);
  const [dependents, setDependents] = useState<number>(2);
  const [employment, setEmployment] = useState<string>('STABLE_SALARY');
  const [hasMedical, setHasMedical] = useState<boolean>(false);

  const [data, setData] = useState<FundData | null>(null);

  const calculate = async () => {
    try {
      const res = await axios.post<FundData>('/api/finance/emergency-fund', {
        monthlyLivingExpenses: expenses,
        dependentCount: dependents,
        employmentType: employment,
        hasDependentsMedicalConditions: hasMedical
      });
      setData(res.data);
    } catch {
      // Local fallback
      let months = employment === 'BUSINESS_OWNER' ? 12 : (employment === 'FREELANCER' ? 9 : 6);
      if (dependents >= 2) months += 2;
      if (hasMedical) months += 2;
      months = Math.min(months, 15);

      const total = expenses * months;
      setData({
        recommendedMonths: months,
        totalFundRequired: total,
        allocationPlan: [
          {
            bucketName: "Tier 1: Instant Cash (0 - 24 hrs)",
            amount: total * 0.25,
            instrument: "Savings Account with Auto-Sweep",
            rationale: "Immediate liquidity for urgent emergency room admission or home repairs."
          },
          {
            bucketName: "Tier 2: Ultra-Safe Liquid Reserves (1 - 2 business days)",
            amount: total * 0.45,
            instrument: "Overnight / Liquid Debt Mutual Fund",
            rationale: "Zero credit risk, earns repo-linked interest, accessible in 24 hours."
          },
          {
            bucketName: "Tier 3: Short-Term Contingency",
            amount: total * 0.30,
            instrument: "Short-Term Bank FDs with premature break option",
            rationale: "Guaranteed psychological peace of mind. Prevents selling equity in panic."
          }
        ],
        inversionRule: "Never seek high returns on your emergency fund. Capital preservation is 100x more important than returns."
      });
    }
  };

  useEffect(() => {
    calculate();
  }, [expenses, dependents, employment, hasMedical]);

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
          <span>Emergency Fund: The Inversion Shield</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Charlie Munger Rule: Before you aim to become wealthy, ensure you cannot be wiped out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="space-y-4 bg-slate-950/60 p-5 rounded-lg border border-slate-800/80">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">
              Monthly Living Expenses (Rent, Food, EMIs, Utilities)
            </label>
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Employment Stability</label>
            <select
              value={employment}
              onChange={(e) => setEmployment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="STABLE_SALARY">Salaried (Stable Corporate / Govt)</option>
              <option value="COMMISSION_BASED">Salaried (Incentive / Commission Based)</option>
              <option value="FREELANCER">Freelancer / Contract Worker</option>
              <option value="BUSINESS_OWNER">Business Owner / Entrepreneur</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Number of Dependents</label>
            <input
              type="number"
              min={0}
              max={10}
              value={dependents}
              onChange={(e) => setDependents(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasMedical}
                onChange={(e) => setHasMedical(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Dependent with chronic medical condition (+2 months buffer)</span>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-5">
          {data && (
            <>
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Recommended Buffer</div>
                  <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                    {data.recommendedMonths} Months of Expenses
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Liquid Target</div>
                  <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
                    {formatCurrency(data.totalFundRequired)}
                  </div>
                </div>
              </div>

              {/* 3 Tiers */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-emerald-400" />
                  <span>The 3 Liquid Tiers (Never put emergency cash in Stocks/Crypto)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {data.allocationPlan.map((tier, idx) => (
                    <div key={idx} className="bg-slate-950/70 border border-slate-800 p-4 rounded-lg space-y-2">
                      <div className="text-xs font-bold text-emerald-400">{tier.bucketName}</div>
                      <div className="text-lg font-bold font-mono text-slate-100">{formatCurrency(tier.amount)}</div>
                      <div className="text-xs font-semibold text-slate-300 bg-slate-900 px-2 py-1 rounded inline-block">
                        {tier.instrument}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{tier.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-amber-300">The Survival Inversion: </span>
                  {data.inversionRule}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
