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
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 flex items-center justify-center px-4">
      <div className="max-w-xl w-full glass-card rounded-2xl p-7 sm:p-9 shadow-sm space-y-6 border border-slate-200">
        
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <img 
            src={user?.donor_profile?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
            alt="User avatar" 
            className="w-14 h-14 rounded-xl bg-slate-100 border-2 border-red-600 object-cover shadow-xs"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email} • Role: <strong className="text-red-600 font-semibold uppercase">{user?.role}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
            />
          </div>

          <BloodGroupSelector 
            value={formData.blood_group} 
            onChange={(bg) => setFormData(prev => ({ ...prev, blood_group: bg }))} 
            label="Blood Group" 
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
              <input 
                type="number" 
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-sm cursor-pointer mt-3"
          >
            {loading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>

        </form>

      </div>
    </div>
  );
}
