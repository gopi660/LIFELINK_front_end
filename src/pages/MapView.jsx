import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDonorStore } from '../store/donorStore';
import { useRequestStore } from '../store/requestStore';
import LeafletMap from '../components/map/LeafletMap';
import BloodGroupSelector from '../components/ui/BloodGroupSelector';
import { MapPin, Filter, Phone, Compass, Users, Activity, CheckCircle2 } from 'lucide-react';
import { getCityCoordinates } from '../utils/cityCoordinates';

export default function MapView() {
  const [searchParams] = useSearchParams();
  const { nearbyDonors, fetchNearbyDonors } = useDonorStore();
  const { requests, fetchRequests } = useRequestStore();

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('blood_group') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'Bangalore');
  const [distance, setDistance] = useState(50);
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const cityCoords = getCityCoordinates(city);

  useEffect(() => {
    const coords = getCityCoordinates(city);
    fetchNearbyDonors({
      blood_group: bloodGroup,
      city,
      distance,
      availability: onlyAvailable,
      lat: coords ? coords[0] : 12.9716,
      lng: coords ? coords[1] : 77.5946
    });
    fetchRequests({ city });
  }, [bloodGroup, city, distance, onlyAvailable, fetchNearbyDonors, fetchRequests]);

  return (
    <div className="w-full py-8 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-extrabold uppercase tracking-widest mb-1">
              <Compass className="w-4 h-4 animate-spin" /> Live Dispatch Radar
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-3">
              Emergency Donor Radar Map
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Locate registered blood donors, hospital locations, and real-time emergency requests within your radius.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            GPS Radius Engine Active
          </div>
        </div>

        {/* Filter Controls HUD Panel */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-widest">
              <Filter className="w-4 h-4 text-rose-500" /> Dispatch Radar Filters
            </div>
            {(bloodGroup || city !== 'Bangalore') && (
              <span className="text-[11px] font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                Filtered View
              </span>
            )}
          </div>

          <BloodGroupSelector value={bloodGroup} onChange={setBloodGroup} label="Filter Target Blood Group" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                City / Metropolitan Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input 
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bangalore"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Search Radius Range
                </label>
                <span className="text-xs font-black text-rose-500">{distance} km</span>
              </div>
              <input 
                type="range"
                min="5"
                max="100"
                step="5"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input 
                type="checkbox"
                id="avail"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
              <label htmlFor="avail" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Only Show Active & Available Donors
              </label>
            </div>
          </div>
        </div>

        {/* Map & Sidebar Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map Section */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-2 border border-slate-200 dark:border-slate-800/80 shadow-2xl overflow-hidden min-h-[600px]">
            <LeafletMap 
              center={cityCoords} 
              zoom={12} 
              donors={nearbyDonors} 
              requests={requests}
              height="600px" 
            />
          </div>

          {/* Sidebar Section */}
          <div className="glass-card rounded-3xl p-6 shadow-2xl space-y-4 max-h-[616px] overflow-y-auto border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
              <h3 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-500" /> Matched Nearby Donors
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                {nearbyDonors.length}
              </span>
            </div>

            {nearbyDonors.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold italic">No matching donors found in this radius.</p>
                <p className="text-[11px] text-slate-400">Try expanding the search distance or clearing blood group filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {nearbyDonors.map((d, i) => {
                  const subject = encodeURIComponent(`Emergency Blood Donation Request (${d.blood_group})`);
                  const body = encodeURIComponent(`Hi ${d.name},\n\nWe saw your profile on LifeLink Emergency Blood Finder. We urgently need ${d.blood_group} blood in ${d.city}.\n\nPlease let us know if you can donate.\n\nThank you!`);
                  
                  return (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-3 hover:border-rose-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-rose-600/25">
                            {d.blood_group}
                          </div>
                          <div>
                            <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">{d.name}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{d.city} • <span className="text-rose-500 font-extrabold">{d.distance_km} km away</span></p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-md border border-emerald-500/20">
                          Active
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                        {d.phone ? (
                          <a 
                            href={`tel:${d.phone}`}
                            className="w-full text-center bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold py-1.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </a>
                        ) : <div />}

                        {d.phone ? (
                          <a 
                            href={`sms:${d.phone}?body=${body}`}
                            className="w-full text-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1"
                          >
                            💬 SMS
                          </a>
                        ) : <div />}

                        {d.email ? (
                          <a 
                            href={`mailto:${d.email}?subject=${subject}&body=${body}`}
                            className="w-full text-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1"
                          >
                            ✉️ Email
                          </a>
                        ) : <div />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
