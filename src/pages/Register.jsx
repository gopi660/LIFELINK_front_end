import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import BloodGroupSelector from '../components/ui/BloodGroupSelector';
import { HeartPulse, Lock, Mail, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'donor',
    blood_group: 'O+',
    city: 'Bangalore',
    latitude: 12.9716,
    longitude: 77.5946,
    age: 25,
    gender: 'Male',
    register_as_donor: true
  });

  const { register, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/donor-dashboard';
  const customMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Acquiring high-accuracy GPS coordinates...', { id: 'gps-loc' });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: parseFloat(pos.coords.latitude.toFixed(6)),
            longitude: parseFloat(pos.coords.longitude.toFixed(6))
          }));
          toast.success('GPS coordinates locked!', { id: 'gps-loc' });
        },
        () => {
          toast.error('Unable to fetch precise location. Defaulting to city center.', { id: 'gps-loc' });
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.register_as_donor && !formData.blood_group) {
      toast.error('Please specify your blood group.');
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.register_as_donor ? 'donor' : 'user',
      register_as_donor: formData.register_as_donor,
      blood_group: formData.blood_group,
      city: formData.city,
      latitude: formData.latitude,
      longitude: formData.longitude,
      age: parseInt(formData.age) || 25,
      gender: formData.gender,
      donor_profile: formData.register_as_donor ? {
        blood_group: formData.blood_group,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
        age: parseInt(formData.age) || 25,
        gender: formData.gender
      } : null
    };

    const success = await register(payload);
    if (success) {
      toast.success('Account created! Welcome to LifeLink Network.');
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full glass-card rounded-2xl p-8 space-y-6 border border-slate-200 shadow-sm">
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 flex items-center justify-center mx-auto text-red-600">
            <svg className="w-10 h-10 fill-red-600 text-red-600" viewBox="0 0 24 24">
              <path d="M12 2C12 2 4.5 10.5 4.5 15.5C4.5 19.64 7.86 23 12 23C16.14 23 19.5 19.64 19.5 15.5C19.5 10.5 12 2 12 2Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Join LifeLink Network</h2>
          <p className="text-xs text-slate-500">Register as a life-saving blood donor or emergency requester</p>
        </div>

        {/* Authentication Notice Banner */}
        {customMessage ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium p-3 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{customMessage}</span>
          </div>
        ) : redirectPath === '/request-blood' ? (
          <div className="bg-red-50 border border-red-200 text-red-900 text-xs font-medium p-3 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>Create your account to submit this emergency blood request.</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Rajesh Sharma"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rajesh@gmail.com"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input 
                  type="text" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-red-600" />
                Register as Emergency Blood Donor
              </span>
              <p className="text-[11px] text-slate-500">Receive real-time SMS & Email alerts when nearby ICU patients require your blood type</p>
            </div>
            <input 
              type="checkbox"
              name="register_as_donor"
              checked={formData.register_as_donor}
              onChange={handleChange}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer shrink-0 ml-3"
            />
          </div>

          {formData.register_as_donor && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              
              <BloodGroupSelector 
                value={formData.blood_group}
                onChange={(bg) => setFormData(prev => ({ ...prev, blood_group: bg }))}
                label="Your Blood Group *"
              />

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GPS Coordinates</label>
                  <button 
                    type="button"
                    onClick={handleDetectLocation}
                    className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    Detect Current GPS
                  </button>
                </div>
              </div>

            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-4"
          >
            {loading ? 'Registering Account...' : 'Complete Donor Registration'}
          </button>

        </form>

        <div className="text-center pt-1 text-xs text-slate-500 font-normal">
          Already have an account? <Link to="/login" state={{ from: location.state?.from, message: customMessage }} className="text-red-600 font-semibold hover:underline">Log In</Link>
        </div>

      </div>
    </div>
  );
}
