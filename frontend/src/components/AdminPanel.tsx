import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, BookOpen, Activity, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface Stats {
  totalUsers: number;
  totalPortfolios: number;
  totalHabitLogs: number;
  totalWisdomQuotes: number;
}

interface UserItem {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [master, setMaster] = useState<string>('Charlie Munger');
  const [category, setCategory] = useState<string>('INVERSION');
  const [quote, setQuote] = useState<string>('');
  const [application, setApplication] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const loadData = async () => {
    try {
      const statsRes = await axios.get<Stats>('/api/admin/stats');
      setStats(statsRes.data);
      const usersRes = await axios.get<UserItem[]>('/api/admin/users');
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddWisdom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) return;

    try {
      await axios.post('/api/admin/wisdom', {
        master,
        category,
        quote,
        practicalApplication: application,
        referenceWork: source
      });
      setQuote('');
      setApplication('');
      setSource('');
      setSuccessMsg('Wisdom quote published successfully to live vault!');
      setTimeout(() => setSuccessMsg(''), 4000);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Administrator Command Center</h2>
            <p className="text-sm text-slate-400">Platform governance, user management, and dynamic wisdom curation.</p>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Registered Users</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-2">{stats.totalUsers}</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <Activity className="h-4 w-4 text-teal-400" />
                <span>Portfolios Created</span>
              </div>
              <div className="text-2xl font-bold font-mono text-teal-300 mt-2">{stats.totalPortfolios}</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <Activity className="h-4 w-4 text-amber-400" />
                <span>Habit Check Audits</span>
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-2">{stats.totalHabitLogs}</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <BookOpen className="h-4 w-4 text-rose-400" />
                <span>Wisdom Library Tenets</span>
              </div>
              <div className="text-2xl font-bold font-mono text-rose-300 mt-2">{stats.totalWisdomQuotes}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Wisdom Form */}
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Plus className="h-5 w-5 text-emerald-400" />
              <span>Publish New Wisdom Tenet to Live Vault</span>
            </h3>

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddWisdom} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Master / Authority</label>
                  <select
                    value={master}
                    onChange={(e) => setMaster(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                  >
                    <option value="Charlie Munger">Charlie Munger</option>
                    <option value="Warren Buffett">Warren Buffett</option>
                    <option value="Benjamin Graham">Benjamin Graham</option>
                    <option value="Parag Parikh">Parag Parikh</option>
                    <option value="InvestYadnya">InvestYadnya</option>
                    <option value="Stoic & Health">Stoic & Health</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                  >
                    <option value="INVERSION">INVERSION</option>
                    <option value="BORING_COMPOUNDING">BORING COMPOUNDING</option>
                    <option value="FRUGALITY">FRUGALITY</option>
                    <option value="BEHAVIORAL_BIAS">BEHAVIORAL BIAS</option>
                    <option value="HEALTH_LONGEVITY">HEALTH LONGEVITY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Quote</label>
                <textarea
                  rows={2}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="e.g. 'It is remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid...'"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Practical Daily Application</label>
                <textarea
                  rows={2}
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  placeholder="e.g. 'Focus on eliminating high-risk errors instead of chasing brilliant shortcuts.'"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Reference Work / Book</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Poor Charlie's Almanack"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg text-sm transition-all"
              >
                Add Wisdom to Database
              </button>
            </form>
          </div>

          {/* User Directory Table */}
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <span>Registered User Accounts ({users.length})</span>
            </h3>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 uppercase tracking-wider text-slate-400 text-[10px] sticky top-0">
                  <tr>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-medium text-slate-200">{u.fullName}</td>
                      <td className="p-2.5 text-slate-400 font-mono">{u.email}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.role === 'ROLE_ADMIN'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role.replace('ROLE_', '')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
