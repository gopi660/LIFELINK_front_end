import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { Shield, Users, Trash2, Download, Lock, Unlock } from 'lucide-react';
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
    return <div className="min-h-screen bg-slate-50 py-20 text-center text-slate-500 font-semibold">Loading Platform Administration...</div>;
  }

  const overview = analytics?.overview || {};
  const bgStats = analytics?.blood_group_distribution || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" /> Operations HUD
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Platform Administration
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor real-time system analytics, verify donors, manage user permissions, and export platform data.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => handleExportCSV('donors')}
              className="bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" /> Export Donors CSV
            </button>
            <button 
              onClick={() => handleExportCSV('requests')}
              className="bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" /> Export Requests CSV
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5 space-y-1 border border-slate-200 shadow-xs">
            <div className="text-xs font-medium text-slate-500">Total Users</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{overview.total_users || 0}</div>
            <div className="text-xs text-slate-500">{overview.total_donors || 0} Registered Donors</div>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-1 border border-slate-200 shadow-xs">
            <div className="text-xs font-medium text-slate-500">Available Donors</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{overview.available_donors || 0}</div>
            <div className="text-xs text-slate-500">{overview.verified_donors || 0} Verified Profiles</div>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-1 border border-slate-200 shadow-xs">
            <div className="text-xs font-medium text-slate-500">Blood Requests</div>
            <div className="text-2xl sm:text-3xl font-bold text-red-600">{overview.total_requests || 0}</div>
            <div className="text-xs text-slate-500">{overview.active_requests || 0} Currently Active</div>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-1 border border-slate-200 shadow-xs">
            <div className="text-xs font-medium text-slate-500">Resolution Rate</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{overview.success_rate_percent || 100}%</div>
            <div className="text-xs text-slate-500">{overview.completed_requests || 0} Completed Dispatch</div>
          </div>
        </div>

        {/* Blood Group Stats */}
        <div className="glass-card rounded-2xl p-6 shadow-xs space-y-3.5 border border-slate-200">
          <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            Donor Inventory Breakdown by Blood Group
          </h3>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 text-center">
            {Object.entries(bgStats).map(([bg, count]) => (
              <div key={bg} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-red-600 block">{bg}</span>
                <span className="text-lg font-bold text-slate-900 mt-0.5 block">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Moderation Table */}
        <div className="glass-card rounded-2xl p-6 shadow-xs space-y-4 border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-red-600" />
            User Account Moderation & Verification
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role / Group</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {u.name}
                      {u.donor_profile?.verified && (
                        <span className="ml-2 text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 font-semibold">
                          VERIFIED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-slate-400">{u.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-semibold rounded text-[10px] uppercase">
                        {u.role}
                      </span>
                      {u.donor_profile && (
                        <span className="ml-1.5 px-2 py-0.5 bg-red-50 text-red-700 font-bold rounded text-[10px] border border-red-200">
                          {u.donor_profile.blood_group}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {u.is_blocked ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> BLOCKED
                        </span>
                      ) : (
                        <span className="text-slate-700 flex items-center gap-1">
                          <Unlock className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {!u.donor_profile?.verified && u.role === 'donor' && (
                        <button
                          onClick={() => handleVerify(u.id)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-lg shadow-xs cursor-pointer"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleBlock(u.id)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                          u.is_blocked 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {u.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        onClick={() => handleRemove(u.id)}
                        className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center"
                      >
                        <Trash2 className="w-3 h-3" />
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
