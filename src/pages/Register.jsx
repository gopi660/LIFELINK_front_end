import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import BloodGroupSelector from '../components/ui/BloodGroupSelector';
import { getCityCoordinates } from '../utils/cityCoordinates';
import { User, Mail, Phone, Lock, MapPin, HeartPulse, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    register_as_donor: true,
    blood_group: 'O+',
    age: '25',
    gender: 'Male',
    city: 'Bangalore',
    address: 'Indiranagar, Bangalore',
    latitude: 12.9716,
    longitude: 77.5946
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'city') {
      const coords = getCityCoordinates(value);
      setFormData(prev => ({
        ...prev,
        city: value,
        latitude: coords ? coords[0] : prev.latitude,
        longitude: coords ? coords[1] : prev.longitude
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Detecting your GPS location...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          toast.dismiss();
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }));
          toast.success(`GPS Location acquired: (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          toast.dismiss();
          toast.error('Unable to retrieve GPS. Using default Bangalore location.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await register(formData);
      navigate('/donor-dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 py-16 flex items-center justify-center px-4 transition-colors">
      <div className="max-w-xl w-full glass-card rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 border border-slate-200 dark:border-slate-800/80 relative overflow-hidden">
        
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-600/35 border-t border-white/20">
            <HeartPulse className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white">Join LifeLink Network</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Register as a life-saving blood donor or emergency requester</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Rajesh Sharma"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rajesh@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter mobile number (e.g. +91 XXXXX XXXXX)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
                Register as Emergency Blood Donor
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Receive real-time SMS & Email alerts when nearby ICU patients require your blood type</p>
            </div>
            <input 
              type="checkbox"
              name="register_as_donor"
              checked={formData.register_as_donor}
              onChange={handleChange}
              className="w-5 h-5 accent-rose-500 rounded cursor-pointer shrink-0"
            />
          </div>

          {formData.register_as_donor && (
            <div className="space-y-5 pt-3 border-t border-slate-200 dark:border-slate-800/80">
              
              <BloodGroupSelector 
                value={formData.blood_group}
                onChange={(bg) => setFormData(prev => ({ ...prev, blood_group: bg }))}
                label="Your Blood Group *"
              />

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">GPS Coordinates</label>
                  <button 
                    type="button"
                    onClick={handleDetectLocation}
                    className="w-full py-3 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Detect Current GPS
                  </button>
                </div>
              </div>

            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 via-red-600 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-heading font-black py-4 rounded-2xl shadow-xl shadow-rose-600/35 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer border-t border-white/20 mt-6"
          >
            {loading ? 'Registering Account...' : 'Complete Donor Registration'}
          </button>

        </form>

        <div className="text-center pt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          Already have an account? <Link to="/login" className="text-rose-500 font-extrabold hover:underline">Log In</Link>
        </div>

      </div>
    </div>
  );
}
