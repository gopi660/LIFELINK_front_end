import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import BloodGroupSelector from '../components/ui/BloodGroupSelector';

export default function Profile() {
  const { user, updateProfile, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    blood_group: user?.donor_profile?.blood_group || 'O+',
    city: user?.donor_profile?.city || 'Bangalore',
    address: user?.donor_profile?.address || '',
    age: user?.donor_profile?.age || 25,
    gender: user?.donor_profile?.gender || 'Male'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 py-16 flex items-center justify-center px-4 transition-colors">
      <div className="max-w-xl w-full glass-card rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 border border-slate-200 dark:border-slate-800/80 relative overflow-hidden">
        
        <div className="flex items-center gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <img 
            src={user?.donor_profile?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
            alt="User avatar" 
            className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-rose-500 object-cover shadow-md"
          />
          <div>
            <h1 className="text-2xl font-heading font-black text-slate-900 dark:text-white">{user?.name}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email} • Role: <strong className="text-rose-500 font-extrabold uppercase">{user?.role}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Phone Number</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
            />
          </div>

          <BloodGroupSelector 
            value={formData.blood_group}
            onChange={(bg) => setFormData(prev => ({ ...prev, blood_group: bg }))}
            label="Blood Group"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">City</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Age</label>
              <input 
                type="number" 
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 via-red-600 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-heading font-black py-4 rounded-2xl shadow-xl shadow-rose-600/35 transition-all text-sm cursor-pointer border-t border-white/20 mt-4"
          >
            {loading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>

        </form>

      </div>
    </div>
  );
}
