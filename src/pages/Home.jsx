import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Search, 
  MapPin, 
  Users, 
  Activity, 
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Clock,
  Building2,
  Radio
} from 'lucide-react';
import { useRequestStore } from '../store/requestStore';
import { useDonorStore } from '../store/donorStore';
import BloodGroupSelector from '../components/ui/BloodGroupSelector';

export default function Home() {
  const { requests, fetchRequests } = useRequestStore();
  const { fetchNearbyDonors } = useDonorStore();
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [searchCity, setSearchCity] = useState('Bangalore');

  useEffect(() => {
    fetchRequests();
    fetchNearbyDonors({ city: 'Bangalore' });
  }, [fetchRequests, fetchNearbyDonors]);

  const activeRequests = requests.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Live Emergency Ticker */}
      {activeRequests.length > 0 && (
        <div className="bg-rose-500/10 dark:bg-rose-500/15 border-b border-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-900 dark:text-rose-200 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden max-w-7xl mx-auto w-full">
            <span className="flex items-center gap-1.5 bg-rose-600 text-white font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shrink-0 shadow-sm animate-pulse">
              <Radio className="w-3 h-3 text-white" /> Emergency Alert
            </span>
            <div className="truncate text-xs font-semibold">
              <span className="font-bold text-slate-900 dark:text-white">{activeRequests[0].blood_group} Required:</span> {activeRequests[0].patient_name} at {activeRequests[0].hospital_name} ({activeRequests[0].city})
            </div>
          </div>
          <Link to="/map" className="shrink-0 text-rose-600 dark:text-rose-400 hover:text-rose-500 font-extrabold flex items-center gap-1 text-xs">
            Live Radar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Hero Dispatch Console Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400">
                <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Autonomous GPS Donor Dispatch System</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Real-Time Emergency <br />
                <span className="text-rose-600 dark:text-rose-500">Blood Donor Matching</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-xl">
                Connecting hospital care teams directly with nearby compatible blood donors using instant GPS radius alerts and automated dispatch protocols.
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link 
                  to="/request-blood"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-heading font-extrabold text-sm px-7 py-4 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2.5 border-t border-white/20"
                >
                  <HeartPulse className="w-4 h-4 fill-white" />
                  Post Emergency Request
                </Link>
                
                <Link 
                  to="/register"
                  className="glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-sm px-7 py-4 rounded-xl border border-slate-300 dark:border-slate-800 transition-all flex items-center justify-center gap-2.5"
                >
                  <Users className="w-4 h-4 text-rose-500" />
                  Register as Donor
                </Link>
              </div>

              {/* Trust Badge Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold border-t border-slate-200 dark:border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Aadhaar Verified Donors
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-500" /> Sub-15 Min Alerts
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-sky-500" /> 450+ Hospitals Connected
                </span>
              </div>
            </div>

            {/* Right: Quick Search Finder Card */}
            <div className="lg:col-span-5">
              <div className="glass-card card-accent-top rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-base font-heading font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Search className="w-4 h-4 text-rose-500" /> Donor Radar Search
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Filter available donors by group and area</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                    Live Status
                  </span>
                </div>

                <div className="space-y-4">
                  <BloodGroupSelector 
                    value={selectedBloodGroup} 
                    onChange={setSelectedBloodGroup} 
                    label="Patient Blood Group" 
                  />
                  
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      City / Hospital Area
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Enter City (e.g. Bangalore)" 
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <Link 
                    to={`/map?blood_group=${encodeURIComponent(selectedBloodGroup)}&city=${encodeURIComponent(searchCity)}`}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs shadow-md shadow-rose-600/25"
                  >
                    <Search className="w-4 h-4" />
                    Locate Compatible Donors
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Platform Key Metrics */}
      <section className="py-12 bg-slate-100/60 dark:bg-[#0d1320] border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            
            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
              <span className="text-[11px] uppercase font-extrabold text-slate-400">Verified Donors</span>
              <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">1,250+</div>
              <p className="text-[11px] text-emerald-500 font-semibold">Active & GPS Tracked</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
              <span className="text-[11px] uppercase font-extrabold text-slate-400">Avg Alert Response</span>
              <div className="text-2xl sm:text-3xl font-heading font-black text-rose-600 dark:text-rose-500">&lt; 14 Mins</div>
              <p className="text-[11px] text-slate-500 font-semibold">Rapid Emergency Dispatch</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
              <span className="text-[11px] uppercase font-extrabold text-slate-400">Resolution Rate</span>
              <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-600 dark:text-emerald-400">98.4%</div>
              <p className="text-[11px] text-emerald-500 font-semibold">Successful ICU Matches</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
              <span className="text-[11px] uppercase font-extrabold text-slate-400">Partner Hospitals</span>
              <div className="text-2xl sm:text-3xl font-heading font-black text-sky-600 dark:text-sky-400">450+</div>
              <p className="text-[11px] text-sky-500 font-semibold">Verified Blood Banks</p>
            </div>

          </div>
        </div>
      </section>

      {/* How LifeLink Works Step Protocol */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs uppercase font-extrabold text-rose-600 dark:text-rose-400 tracking-widest">
              Emergency Matching Protocol
            </h2>
            <p className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white">
              How LifeLink Works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 font-heading font-black text-base flex items-center justify-center border border-rose-500/20">
                01
              </div>
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">Emergency Request</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit patient details, required blood group, hospital address, and urgency tier in under 30 seconds.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 font-heading font-black text-base flex items-center justify-center border border-amber-500/20">
                02
              </div>
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">GPS Matching Engine</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our Haversine GPS algorithm queries blood group compatibility tables to find nearby active donors.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 font-heading font-black text-base flex items-center justify-center border border-emerald-500/20">
                03
              </div>
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">Multi-Channel Alerts</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Matched donors receive priority SMS, Email, and App push notifications with one-click acceptance buttons.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 font-heading font-black text-base flex items-center justify-center border border-sky-500/20">
                04
              </div>
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">Hospital Dispatch</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Requester and donor connect directly for immediate coordination and ETA tracking.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Active Requests Feed */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/40 dark:bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
                Active Emergency Blood Requests
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current ICU patients searching for compatible donors
              </p>
            </div>
            
            <Link to="/map" className="text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 glass-card px-3.5 py-2 rounded-xl">
              View All on Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeRequests.map((req) => (
              <div key={req.id} className="glass-card glass-card-hover rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
                
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    req.emergency_level === 'Critical' ? 'badge-critical' : 'badge-high'
                  }`}>
                    {req.emergency_level} Urgency
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-rose-600/30">
                    {req.blood_group}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">{req.hospital_name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {req.hospital_address || req.city}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Patient:</span> 
                    <strong className="text-slate-900 dark:text-white font-bold">{req.patient_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Units Needed:</span> 
                    <strong className="text-slate-900 dark:text-white font-bold">{req.units} Unit(s)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Status:</span> 
                    <span className="text-rose-600 dark:text-rose-400 font-extrabold">{req.status}</span>
                  </div>
                </div>

                <Link 
                  to="/donor-dashboard"
                  className="w-full block text-center bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-rose-600/25"
                >
                  Respond as Donor
                </Link>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Emergency Hotline Banner */}
      <section className="py-14 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-heading font-black">24/7 Official Emergency Helplines</h3>
              <p className="text-xs text-slate-400">Direct dial to Indian national emergency response services.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a 
                href="tel:112" 
                className="bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-transform hover:scale-105"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 112 National Emergency
              </a>
              <a 
                href="tel:108" 
                className="bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs px-5 py-3 rounded-xl border border-slate-700 flex items-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" /> 108 Ambulance
              </a>
              <a 
                href="tel:1097" 
                className="bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs px-5 py-3 rounded-xl border border-slate-700 flex items-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> 1097 Blood Helpline
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
