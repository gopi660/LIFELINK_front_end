import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestStore } from '../store/requestStore';
import { useDonorStore } from '../store/donorStore';
import BloodGroupSelector from '../components/ui/BloodGroupSelector';
import { getCityCoordinates } from '../utils/cityCoordinates';
import { HeartPulse, MapPin, Hospital, Phone, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestBlood() {
  const { createBloodRequest, loading } = useRequestStore();
  const { nearbyDonors, fetchNearbyDonors } = useDonorStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_name: '',
    blood_group: 'A+',
    units: 1,
    hospital_name: '',
    hospital_address: '',
    city: 'Bangalore',
    latitude: 12.9716,
    longitude: 77.5946,
    emergency_level: 'Critical',
    contact_number: '',
    required_before: 'Immediate (Within 4 hours)',
    additional_notes: ''
  });

  useEffect(() => {
    const coords = getCityCoordinates(formData.city);
    fetchNearbyDonors({ 
      blood_group: formData.blood_group, 
      city: formData.city,
      lat: coords ? coords[0] : formData.latitude,
      lng: coords ? coords[1] : formData.longitude
    });
  }, [formData.blood_group, formData.city, formData.latitude, formData.longitude, fetchNearbyDonors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      const coords = getCityCoordinates(value);
      setFormData(prev => ({
        ...prev,
        city: value,
        latitude: coords ? coords[0] : prev.latitude,
        longitude: coords ? coords[1] : prev.longitude
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Acquiring hospital GPS coordinates...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          toast.dismiss();
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }));
          toast.success('Hospital GPS coordinates saved!');
        },
        () => {
          toast.dismiss();
          toast.error('GPS permission denied. Defaulting to city center.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patient_name || !formData.hospital_name || !formData.contact_number) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createBloodRequest(formData);
      navigate('/my-requests');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 py-12 px-4 flex items-center justify-center transition-colors">
      <div className="max-w-2xl w-full glass-card rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 border border-slate-200 dark:border-slate-800/80 relative overflow-hidden">
        
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-600/35 border-t border-white/20">
            <HeartPulse className="w-9 h-9 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white">
            Post Emergency Blood Request
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Instantly dispatch location-aware SMS & Email alerts to compatible donors in your radius.
          </p>
        </div>

        {/* Live Compatible Donor Match Box */}
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] uppercase font-extrabold text-rose-600 dark:text-rose-400 tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-rose-500" /> Automatic Dispatch Preview
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              <strong className="text-rose-600 dark:text-rose-400 text-sm font-black">{nearbyDonors.length} Compatible Donors</strong> Ready to Alert in {formData.city}
            </div>
          </div>
          <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse shadow-md">
            GPS READY
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <BloodGroupSelector 
            value={formData.blood_group}
            onChange={(bg) => setFormData(prev => ({ ...prev, blood_group: bg }))}
            label="Required Blood Group *"
          />

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Emergency Level *</label>
            <div className="grid grid-cols-3 gap-3">
              {['Critical', 'High', 'Normal'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, emergency_level: level }))}
                  className={`py-3 px-4 rounded-2xl text-xs font-extrabold uppercase border transition-all cursor-pointer ${
                    formData.emergency_level === level
                      ? level === 'Critical' 
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 border-rose-400 text-white shadow-lg shadow-rose-600/35'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400 text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-[#070a13] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {level === 'Critical' && '🚨 '}
                  {level} Priority
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Patient Full Name *</label>
              <input 
                type="text"
                name="patient_name"
                required
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Units Needed *</label>
              <input 
                type="number"
                name="units"
                min="1"
                max="10"
                required
                value={formData.units}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Hospital Name *</label>
              <div className="relative">
                <Hospital className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  name="hospital_name"
                  required
                  value={formData.hospital_name}
                  onChange={handleChange}
                  placeholder="Apollo Hospital, Bannerghatta"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">City / Region *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleDetectLocation}
            className="w-full py-3 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200 dark:border-slate-800"
          >
            <MapPin className="w-4 h-4 text-rose-500" />
            Attach Precise Hospital GPS Pin for Donor Navigation
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Contact Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  name="contact_number"
                  required
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="Enter contact number (e.g. +91 XXXXX XXXXX)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Required Before</label>
              <input 
                type="text"
                name="required_before"
                value={formData.required_before}
                onChange={handleChange}
                placeholder="Immediate / Today 6:00 PM"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Additional Clinical Notes</label>
            <textarea 
              name="additional_notes"
              rows="2"
              value={formData.additional_notes}
              onChange={handleChange}
              placeholder="e.g. ICU admission, Platelet donation required..."
              className="w-full p-3.5 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 via-red-600 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-heading font-black py-4 rounded-2xl shadow-xl shadow-rose-600/40 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border-t border-white/20"
          >
            <HeartPulse className="w-5 h-5 fill-white animate-pulse" />
            {loading ? 'Dispatching Notifications...' : 'Broadcast Emergency Blood Alert'}
          </button>

        </form>

      </div>
    </div>
  );
}
