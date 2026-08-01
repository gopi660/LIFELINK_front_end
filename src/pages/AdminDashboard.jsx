import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { Shield, Users, Trash2, Download, CheckCircle, Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getUsers()
      ]);
      setAnalytics(analyticsRes.data);
      setUsersList(usersRes.data.users);
    } catch {
      toast.error('Failed to load admin analytics. Ensure you are logged in as Admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (userId) => {
    try {
      await adminApi.verifyDonor(userId);
      toast.success('Donor verified successfully');
      loadData();
    } catch {
      toast.error('Failed to verify');
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await adminApi.toggleBlockUser(userId);
      toast.success(res.data.message);
      loadData();
    } catch {
      toast.error('Failed to update block status');
    }
  };

  const handleRemove = async (userId) => {
    if (window.confirm('Are you sure you want to remove this account?')) {
      try {
        await adminApi.removeUser(userId);
        toast.success('Account deleted');
        loadData();
      } catch {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleExportCSV = async (type) => {
    try {
      const res = await adminApi.exportData(type);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `lifelink_${type}_export.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success(`Exported ${type} dataset to CSV`);
    } catch {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#070a13] py-20 text-center text-slate-500 font-bold">Loading Platform Administration...</div>;
  }

  const overview = analytics?.overview || {};
  const bgStats = analytics?.blood_group_distribution || {};

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-extrabold uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4" /> Operations HUD
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white">
              Platform Administration
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Monitor real-time system analytics, verify donors, manage user permissions, and export platform data.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleExportCSV('donors')}
              className="glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-extrabold text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              <Download className="w-4 h-4 text-emerald-500" /> Export Donors CSV
            </button>
            <button 
              onClick={() => handleExportCSV('requests')}
              className="glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-extrabold text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              <Download className="w-4 h-4 text-sky-500" /> Export Requests CSV
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Total Users</div>
            <div className="text-3xl font-heading font-black text-slate-900 dark:text-white">{overview.total_users || 0}</div>
            <div className="text-xs text-slate-500 font-medium">{overview.total_donors || 0} Registered Donors</div>
          </div>

          <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Available Donors</div>
            <div className="text-3xl font-heading font-black text-emerald-600 dark:text-emerald-400">{overview.available_donors || 0}</div>
            <div className="text-xs text-slate-500 font-medium">{overview.verified_donors || 0} Verified Profiles</div>
          </div>

          <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Blood Requests</div>
            <div className="text-3xl font-heading font-black text-rose-600 dark:text-rose-500">{overview.total_requests || 0}</div>
            <div className="text-xs text-slate-500 font-medium">{overview.active_requests || 0} Currently Active</div>
          </div>

          <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Resolution Rate</div>
            <div className="text-3xl font-heading font-black text-sky-600 dark:text-sky-400">{overview.success_rate_percent || 100}%</div>
            <div className="text-xs text-slate-500 font-medium">{overview.completed_requests || 0} Completed Dispatch</div>
          </div>
        </div>

        {/* Blood Group Stats */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800/80">
          <h3 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-widest">
            Donor Inventory Breakdown by Blood Group
          </h3>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 text-center">
            {Object.entries(bgStats).map(([bg, count]) => (
              <div key={bg} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800/80 hover:border-rose-500/30 transition-all">
                <span className="text-xs font-black text-rose-600 dark:text-rose-400 block">{bg}</span>
                <span className="text-xl font-heading font-black text-slate-900 dark:text-white mt-1 block">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Moderation Table */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 dark:border-slate-800/80">
          <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            User Account Moderation & Verification
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-extrabold tracking-widest">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Role / Group</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-medium">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      {u.name}
                      {u.donor_profile?.verified && (
                        <span className="ml-2 text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-black">
                          VERIFIED
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-slate-400">{u.phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-extrabold rounded-lg text-[10px] uppercase">
                        {u.role}
                      </span>
                      {u.donor_profile && (
                        <span className="ml-2 px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black rounded-lg text-[10px]">
                          {u.donor_profile.blood_group}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-extrabold">
                      {u.is_blocked ? (
                        <span className="text-rose-600 dark:text-rose-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> BLOCKED
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Unlock className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      {!u.donor_profile?.verified && u.role === 'donor' && (
                        <button
                          onClick={() => handleVerify(u.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold rounded-xl shadow-md cursor-pointer"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleBlock(u.id)}
                        className={`px-3 py-1.5 text-[11px] font-extrabold rounded-xl transition-all cursor-pointer ${
                          u.is_blocked 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {u.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        onClick={() => handleRemove(u.id)}
                        className="px-2.5 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-[11px] font-extrabold rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
