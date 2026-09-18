import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestStore } from '../store/requestStore';
import { useDonorStore } from '../store/donorStore';
import BloodGroupSelector from '../components/ui/BloodGroupSelector';
import { HeartPulse, Hospital, MapPin, Phone, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestBlood() {
  const [formData, setFormData] = useState({
    patient_name: '',
    blood_group: '',
    units: 1,
    hospital_name: '',
    hospital_address: '',
    city: 'Bangalore',
    latitude: 12.9716,
    longitude: 77.5946,
    emergency_level: 'Critical',
    contact_number: '',
    additional_notes: '',
    required_before: ''
  });

  const { createRequest, loading } = useRequestStore();
  const { nearbyDonors, fetchNearbyDonors } = useDonorStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.blood_group) {
      fetchNearbyDonors({ blood_group: formData.blood_group, city: formData.city });
    }
  }, [formData.blood_group, formData.city, fetchNearbyDonors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Acquiring hospital GPS fix...', { id: 'gps' });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: parseFloat(pos.coords.latitude.toFixed(6)),
            longitude: parseFloat(pos.coords.longitude.toFixed(6))
          }));
          toast.success('Hospital coordinates anchored!', { id: 'gps' });
        },
        () => {
          toast.error('Unable to fetch GPS. Defaulting to Bangalore center.', { id: 'gps' });
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.blood_group) {
      toast.error('Please specify the required patient blood group.');
      return;
    }

    const res = await createRequest({
      ...formData,
      units: parseInt(formData.units) || 1
    });

    if (res) {
      toast.success('Emergency alert successfully dispatched to compatible donors!');
      navigate('/my-requests');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl w-full glass-card rounded-2xl p-7 sm:p-9 space-y-6 border border-slate-200 shadow-sm">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Post Emergency Blood Request
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Instantly dispatch location-aware SMS & Email alerts to compatible donors in your radius.
          </p>
        </div>

        {/* Live Compatible Donor Match Box */}
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] uppercase font-semibold text-red-600 tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-red-600" /> Automatic Dispatch Preview
            </div>
            <div className="text-xs font-semibold text-slate-800">
              <strong className="text-red-600 font-bold">{nearbyDonors.length} Compatible Donors</strong> Ready to Alert in {formData.city}
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-semibold rounded-md uppercase tracking-wider">
            GPS READY
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <BloodGroupSelector 
            value={formData.blood_group} 
            onChange={(bg) => setFormData(prev => ({ ...prev, blood_group: bg }))} 
            label="Required Blood Group *" 
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Emergency Level *</label>
            <div className="grid grid-cols-3 gap-2.5">
              {['Critical', 'High', 'Normal'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, emergency_level: level }))}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    formData.emergency_level === level
                      ? level === 'Critical' 
                        ? 'bg-red-600 border-red-600 text-white shadow-xs'
                        : 'bg-amber-600 border-amber-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {level} Priority
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name *</label>
              <input 
                type="text"
                name="patient_name"
                required
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Units Needed *</label>
              <input 
                type="number"
                name="units"
                min="1"
                max="10"
                required
                value={formData.units}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Name *</label>
              <div className="relative">
                <Hospital className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input 
                  type="text"
                  name="hospital_name"
                  required
                  value={formData.hospital_name}
                  onChange={handleChange}
                  placeholder="Apollo Hospital, Bannerghatta"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input 
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
                />
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleDetectLocation}
            className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200 shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            Attach Precise Hospital GPS Pin for Donor Navigation
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input 
                  type="text"
                  name="contact_number"
                  required
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Required Before</label>
              <input 
                type="text"
                name="required_before"
                value={formData.required_before}
                onChange={handleChange}
                placeholder="Immediate / Today 6:00 PM"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Clinical Notes</label>
            <textarea 
              name="additional_notes"
              rows="2"
              value={formData.additional_notes}
              onChange={handleChange}
              placeholder="e.g. ICU admission, Platelet donation required..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <HeartPulse className="w-4 h-4 fill-white" />
            {loading ? 'Dispatching Notifications...' : 'Broadcast Emergency Blood Alert'}
          </button>

        </form>

      </div>
    </div>
  );
}
