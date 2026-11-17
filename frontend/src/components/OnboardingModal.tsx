import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, TrendingUp, ShieldCheck, HeartPulse, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateProfile } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Form state
  const [fullName, setFullName] = useState<string>(userProfile?.fullName || '');
  const [age, setAge] = useState<number>(userProfile?.age || 28);
  const [gender, setGender] = useState<string>(userProfile?.gender || 'Male');
  const [primaryGoal, setPrimaryGoal] = useState<string>(userProfile?.primaryGoal || 'Financial Independence (Early Freedom)');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(userProfile?.monthlyIncome || 75000);
  const [currentInvestments, setCurrentInvestments] = useState<number>(userProfile?.currentInvestments || 300000);
  const [emergencyFundMonths, setEmergencyFundMonths] = useState<number>(userProfile?.emergencyFundMonths || 3);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateProfile({
        fullName,
        age: Number(age),
        gender,
        primaryGoal,
        monthlyIncome: Number(monthlyIncome),
        currentInvestments: Number(currentInvestments),
        emergencyFundMonths: Number(emergencyFundMonths)
      });
      onClose();
    } catch (e) {
      console.error('Failed to save profile during onboarding', e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Preview Calculations for Step 3
  const ageMultiplier = age < 25 ? 0.5 : age <= 30 ? 1.5 : age <= 35 ? 3.0 : age <= 40 ? 5.0 : 8.0;
  const targetNetWorth = Math.round(monthlyIncome * 12 * ageMultiplier);
  const recommendedEquity = Math.max(40, Math.min(85, 110 - age));
  const recommendedDebt = 100 - recommendedEquity;
  const recommendedSip = Math.round(monthlyIncome * 0.35);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative">
        {/* Progress Dots */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Personalize Your Compounding Blueprint</h3>
              <p className="text-xs text-slate-400">Step {step} of 3 • Tailored for your exact age &amp; milestones</p>
            </div>
          </div>
          <div className="flex space-x-1.5">
            <span className={`h-2 w-6 rounded-full transition-all ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
            <span className={`h-2 w-6 rounded-full transition-all ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
            <span className={`h-2 w-6 rounded-full transition-all ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
          </div>
        </div>

        {/* Step 1: Basic Profile */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Your Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sameer Deshpande"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Current Age</label>
                <input
                  type="number"
                  min={18}
                  max={80}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Compounds exponentially with time</span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Primary Life &amp; Wealth Goal</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Financial Independence (Early Freedom)">Financial Independence (Early Freedom)</option>
                <option value="Exponential Wealth Creation">Exponential Wealth Creation</option>
                <option value="Peace of Mind & Family Health Shield">Peace of Mind & Family Health Shield</option>
                <option value="Home Ownership with Low Debt">Home Ownership with Low Debt</option>
                <option value="Child Higher Education Fund">Child Higher Education Fund</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Financial Foundation */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Monthly In-Hand Income</span>
                <span className="text-emerald-400 font-bold font-mono">{formatCurrency(monthlyIncome)}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={500000}
                step={5000}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500">Determines your safe SIP capacity and insurance multiplier</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Current Net Worth / Invested Capital</span>
                <span className="text-emerald-400 font-bold font-mono">{formatCurrency(currentInvestments)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5000000}
                step={25000}
                value={currentInvestments}
                onChange={(e) => setCurrentInvestments(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500">Includes Mutual Funds, Stocks, EPF/PPF, FDs, and Gold</span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Emergency Fund Coverage (Liquid Months)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { m: 2, label: '0 to 2 Months', sub: 'High Vulnerability' },
                  { m: 6, label: '6 Months', sub: 'Standard Shield' },
                  { m: 12, label: '12 Months', sub: 'Ironclad Fortress' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.m}
                    onClick={() => setEmergencyFundMonths(opt.m)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      emergencyFundMonths === opt.m
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] text-slate-500">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-slate-200 py-2.5 px-4"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-all"
              >
                <span>Generate Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Instant Age-Based Financial Assessment */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Target Net Worth Benchmark */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Target for Age {age}</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-1">{formatCurrency(targetNetWorth)}</div>
                <div className="text-[10px] text-slate-500">Benchmark based on income multiplier</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Recommended Monthly SIP</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-1">{formatCurrency(recommendedSip)} / mo</div>
                <div className="text-[10px] text-slate-500">~35% savings rate for rapid freedom</div>
              </div>
            </div>

            {/* Recommended Asset Allocation */}
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-slate-300">Recommended Allocation for Age {age}</div>
              <div className="flex h-3 rounded-full overflow-hidden">
                <div style={{ width: `${recommendedEquity}%` }} className="bg-emerald-500" title={`Equity: ${recommendedEquity}%`}></div>
                <div style={{ width: `${recommendedDebt}%` }} className="bg-amber-500" title={`Liquid/Debt: ${recommendedDebt}%`}></div>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-emerald-400">Equity SIPs: {recommendedEquity}%</span>
                <span className="text-amber-400">Liquid / Emergency Buffer: {recommendedDebt}%</span>
              </div>
            </div>

            {/* Munger Law Quote */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-200 leading-relaxed">
              <span className="font-semibold text-emerald-400">The Compounding Law: </span>
              At age {age}, time is your greatest asset. Maintain your emergency buffer so you never sell in panic, and step up your SIP by 10% each year as your career progresses.
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-slate-200 py-2.5 px-4"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-all shadow-lg shadow-emerald-950/50"
              >
                <UserCheck className="h-4 w-4" />
                <span>{loading ? 'Saving Blueprint...' : 'Unlock My Dashboard'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
