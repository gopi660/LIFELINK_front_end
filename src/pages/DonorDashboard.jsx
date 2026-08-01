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
    <div className="w-full py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-200 dark:border-slate-800/80">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={donor?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                alt="Donor Avatar" 
                className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 object-cover border-2 border-rose-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg bg-rose-600 text-white font-black text-[10px] shadow">
                {donor?.blood_group || 'O+'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-black text-slate-900 dark:text-white">{user?.name}</h1>
                {donor?.verified && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Donor
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {donor?.city || 'Bangalore'} • Blood Group: <strong className="text-rose-600 dark:text-rose-400 font-black">{donor?.blood_group || 'O+'}</strong>
              </p>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="glass-card border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-5 w-full md:w-auto justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-400">Current Availability</div>
              <div className="text-xs font-black flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${availability ? 'bg-emerald-500 animate-ping' : 'bg-slate-400 dark:bg-slate-600'}`}></span>
                <span className={availability ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                  {availability ? 'ACTIVE & READY TO DONATE' : 'CURRENTLY UNAVAILABLE'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleToggle}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md cursor-pointer ${
                availability 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30' 
                  : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300'
              }`}
            >
              {availability ? 'Toggle Unavailable' : 'Set Available'}
            </button>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card glass-card-hover rounded-3xl p-6 flex items-center gap-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-heading font-black text-slate-900 dark:text-white">{donor?.total_donations || 6} Units</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Lifetime Donations</div>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-3xl p-6 flex items-center gap-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-heading font-black text-rose-600 dark:text-rose-400">18 Lives</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Estimated Impact</div>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-3xl p-6 flex items-center gap-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-heading font-black text-slate-900 dark:text-white">60 Days Ago</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Last Donation Date</div>
            </div>
          </div>
        </div>

        {/* Nearby Emergency Requests List */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-500 fill-rose-500" />
                Matching Emergency Blood Requests
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Respond immediately to patients matching your blood type.</p>
            </div>
            <span className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-full border border-rose-500/20">
              {compatibleRequests.length} Active Alerts
            </span>
          </div>

          <div className="space-y-4">
            {compatibleRequests.map((req) => (
              <div key={req.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 space-y-4 transition-all">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-base flex items-center justify-center shadow-lg shadow-rose-600/30">
                      {req.blood_group}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">{req.patient_name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          req.emergency_level === 'Critical' 
                            ? 'badge-critical' 
                            : 'badge-high'
                        }`}>
                          {req.emergency_level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> <strong>{req.hospital_name}</strong> • {req.city}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-sm font-black text-rose-600 dark:text-rose-400">{req.units} Unit(s) Needed</div>
                    <div className="text-[11px] text-slate-500 font-medium">Urgency: {req.required_before || 'Immediate'}</div>
                  </div>
                </div>

                {req.additional_notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 italic">
                    "{req.additional_notes}"
                  </p>
                )}

                {/* Donor Response Action Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 w-full">
                  <button 
                    onClick={() => handleRespond(req.id, 'Accepted')}
                    disabled={respondingId === req.id}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer truncate"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" /> Accept Request
                  </button>

                  <button 
                    onClick={() => handleRespond(req.id, 'Declined')}
                    disabled={respondingId === req.id}
                    className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer truncate"
                  >
                    <XCircle className="w-4 h-4 text-slate-400 shrink-0" /> Decline
                  </button>

                  <button 
                    onClick={() => handleRespond(req.id, 'Maybe')}
                    disabled={respondingId === req.id}
                    className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer truncate"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" /> Maybe Later
                  </button>

                  <a 
                    href={`tel:${req.contact_number}`}
                    className="w-full glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors truncate"
                  >
                    <PhoneCall className="w-4 h-4 text-rose-500 shrink-0" /> Call Hospital
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
