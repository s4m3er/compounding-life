import React, { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { X, User, HeartPulse, TrendingUp, ShieldCheck, Award, Save, RefreshCw } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateProfile, fetchProfile } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Edit fields
  const [fullName, setFullName] = useState<string>('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>('Male');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(75000);
  const [currentInvestments, setCurrentInvestments] = useState<number>(300000);
  const [emergencyFundMonths, setEmergencyFundMonths] = useState<number>(6);
  const [primaryGoal, setPrimaryGoal] = useState<string>('Financial Independence (Early Freedom)');

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setAge(userProfile.age || 30);
      setGender(userProfile.gender || 'Male');
      setMonthlyIncome(userProfile.monthlyIncome || 75000);
      setCurrentInvestments(userProfile.currentInvestments || 300000);
      setEmergencyFundMonths(userProfile.emergencyFundMonths || 6);
      setPrimaryGoal(userProfile.primaryGoal || 'Financial Independence (Early Freedom)');
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await updateProfile({
        fullName,
        age: Number(age),
        gender,
        monthlyIncome: Number(monthlyIncome),
        currentInvestments: Number(currentInvestments),
        emergencyFundMonths: Number(emergencyFundMonths),
        primaryGoal
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to update profile', e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const assessment = userProfile?.assessment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            {userProfile?.picture ? (
              <img src={userProfile.picture} alt={userProfile.fullName} className="h-10 w-10 rounded-full border border-emerald-500/30 object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <User className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-100">{userProfile?.fullName || 'Investor Profile'}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {userProfile?.provider === 'GOOGLE' ? 'Google Account' : 'Standard Account'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{userProfile?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Assessment Score Card */}
          {assessment && (
            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Longevity &amp; Wealth Score</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">{assessment.rating}</div>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">{assessment.mungerInsight}</p>
                </div>
                <div className="text-center sm:text-right bg-slate-900/80 border border-slate-800 py-3 px-5 rounded-xl self-start sm:self-auto">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">{assessment.overallScore}<span className="text-sm text-slate-500">/100</span></div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Health Score</div>
                </div>
              </div>

              {/* Benchmarks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-800/80">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Target for Age {age}</div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-slate-200 mt-0.5">{formatCurrency(assessment.targetNetWorthForAge)}</div>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Recommended SIP</div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-emerald-400 mt-0.5">{formatCurrency(assessment.recommendedMonthlySip)}/mo</div>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Equity Split</div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-emerald-300 mt-0.5">{assessment.recommendedEquityPercent}% Equity</div>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Term Insurance</div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-slate-200 mt-0.5">{formatCurrency(assessment.recommendedTermInsurance)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Edit Your Financial &amp; Life Parameters</h4>

            {success && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                Profile and financial benchmarks updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Age</label>
                <input
                  type="number"
                  min={18}
                  max={90}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Emergency Fund Months</label>
                <select
                  value={emergencyFundMonths}
                  onChange={(e) => setEmergencyFundMonths(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value={2}>0 to 2 Months (Vulnerable)</option>
                  <option value={6}>6 Months (Standard Shield)</option>
                  <option value={9}>9 Months (High Security)</option>
                  <option value={12}>12 Months (Ironclad Fortress)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Monthly In-Hand Income</span>
                  <span className="text-emerald-400 font-mono font-bold">{formatCurrency(monthlyIncome)}</span>
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
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Current Net Worth / Invested</span>
                  <span className="text-emerald-400 font-mono font-bold">{formatCurrency(currentInvestments)}</span>
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
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Primary Compounding Goal</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Financial Independence (Early Freedom)">Financial Independence (Early Freedom)</option>
                <option value="Exponential Wealth Creation">Exponential Wealth Creation</option>
                <option value="Peace of Mind & Family Health Shield">Peace of Mind & Family Health Shield</option>
                <option value="Home Ownership with Low Debt">Home Ownership with Low Debt</option>
                <option value="Child Higher Education Fund">Child Higher Education Fund</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-all shadow-md shadow-emerald-950/40"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
