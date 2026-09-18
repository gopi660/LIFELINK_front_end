import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDonorStore } from '../store/donorStore';
import { useRequestStore } from '../store/requestStore';
import { 
  HeartPulse, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Award,
  PhoneCall,
  Zap
} from 'lucide-react';

export default function DonorDashboard() {
  const { user, fetchMe } = useAuthStore();
  const { toggleAvailability, respondToRequest } = useDonorStore();
  const { requests, fetchRequests } = useRequestStore();

  const [availability, setAvailability] = useState(user?.donor_profile?.availability ?? true);
  const [respondingId, setRespondingId] = useState(null);

  useEffect(() => {
    fetchMe();
    fetchRequests();
  }, [fetchMe, fetchRequests]);

  useEffect(() => {
    if (user?.donor_profile) {
      setAvailability(user.donor_profile.availability);
    }
  }, [user]);

  const handleToggle = async () => {
    const newStatus = await toggleAvailability(availability);
    if (newStatus !== undefined) {
      setAvailability(newStatus);
    }
  };

  const handleRespond = async (requestId, responseType) => {
    setRespondingId(requestId);
    await respondToRequest(requestId, responseType, `Responded from Donor Portal`);
    setRespondingId(null);
    fetchRequests();
  };

  const donor = user?.donor_profile;
  const compatibleRequests = requests.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled');

  return (
    <div className="w-full py-8 text-slate-900 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Bar */}
        <div className="glass-card rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-200">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={donor?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                alt="Donor Avatar" 
                className="w-14 h-14 rounded-xl bg-slate-100 object-cover border-2 border-red-600 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                {donor?.blood_group || 'O+'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name}</h1>
                {donor?.verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" /> Verified Donor
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-normal">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> {donor?.city || 'Bangalore'} • Blood Group: <strong className="text-red-600 font-bold">{donor?.blood_group || 'O+'}</strong>
              </p>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="glass-card border border-slate-200 p-4 rounded-xl flex items-center gap-5 w-full md:w-auto justify-between shadow-xs">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">Current Availability</div>
              <div className="text-xs font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${availability ? 'bg-red-600' : 'bg-slate-400'}`}></span>
                <span className={availability ? 'text-slate-900' : 'text-slate-500'}>
                  {availability ? 'ACTIVE & READY TO DONATE' : 'CURRENTLY UNAVAILABLE'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleToggle}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-xs cursor-pointer ${
                availability 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {availability ? 'Toggle Unavailable' : 'Set Available'}
            </button>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-5 flex items-center gap-4 border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {donor?.total_donations ?? 0} Unit{(donor?.total_donations ?? 0) === 1 ? '' : 's'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Lifetime Blood Donations</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 flex items-center gap-4 border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {(donor?.total_donations ?? 0) * 3} Lives
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Estimated Patient Impact (3x)</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 flex items-center gap-4 border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {donor?.last_donation_date ? (() => {
                  try {
                    const days = Math.floor((new Date() - new Date(donor.last_donation_date)) / (1000 * 60 * 60 * 24));
                    return days <= 0 ? 'Today' : `${days} Days Ago`;
                  } catch {
                    return 'Recorded';
                  }
                })() : 'No Prior Record'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {donor?.last_donation_date ? 'Last Donation Recorded' : 'Ready for 1st Donation'}
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Emergency Requests List */}
        <div className="glass-card rounded-2xl p-6 shadow-xs space-y-5 border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-600 fill-red-600" />
                Matching Emergency Blood Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Respond immediately to patients matching your blood type.</p>
            </div>
            <span className="px-2.5 py-0.5 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
              {compatibleRequests.length} Active Alerts
            </span>
          </div>

          <div className="space-y-3">
            {compatibleRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No active emergency requests for your blood group at this time.
              </div>
            ) : (
              compatibleRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 space-y-3 transition-all shadow-xs">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {req.blood_group}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base text-slate-900">{req.patient_name}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                            req.emergency_level === 'Critical' 
                              ? 'badge-critical' 
                              : 'badge-high'
                          }`}>
                            {req.emergency_level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-normal">
                          <MapPin className="w-3 h-3 text-red-600" /> <strong>{req.hospital_name}</strong> • {req.city}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-sm font-bold text-red-600">{req.units} Unit(s) Needed</div>
                      <div className="text-[11px] text-slate-500 font-normal">Urgency: {req.required_before || 'Immediate'}</div>
                    </div>
                  </div>

                  {req.additional_notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "{req.additional_notes}"
                    </p>
                  )}

                  {/* Donor Response Action Buttons Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 w-full">
                    <button 
                      onClick={() => handleRespond(req.id, 'Accepted')}
                      disabled={respondingId === req.id}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer truncate"
                    >
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Accept Request
                    </button>

                    <button 
                      onClick={() => handleRespond(req.id, 'Declined')}
                      disabled={respondingId === req.id}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer truncate border border-slate-200"
                    >
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Decline
                    </button>

                    <button 
                      onClick={() => handleRespond(req.id, 'Maybe')}
                      disabled={respondingId === req.id}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer truncate border border-slate-200"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Maybe Later
                    </button>

                    <a 
                      href={`tel:${req.contact_number}`}
                      className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors truncate shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" /> Call Hospital
                    </a>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
