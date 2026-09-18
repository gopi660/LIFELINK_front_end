import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDonorStore } from '../store/donorStore';
import { useRequestStore } from '../store/requestStore';
import LeafletMap from '../components/map/LeafletMap';
import BloodGroupSelector from '../components/ui/BloodGroupSelector';
import { MapPin, Filter, Phone, Compass, Users } from 'lucide-react';
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
    <div className="w-full py-8 text-slate-900 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" /> Live Dispatch Radar
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
              Emergency Donor Radar Map
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Locate registered blood donors, hospital locations, and real-time emergency requests within your radius.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg">
            GPS Radius Engine Active
          </div>
        </div>

        {/* Filter Controls HUD Panel */}
        <div className="glass-card rounded-2xl p-6 shadow-xs space-y-5 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-red-600" /> Dispatch Radar Filters
            </div>
            {(bloodGroup || city !== 'Bangalore') && (
              <span className="text-[11px] font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Filtered View
              </span>
            )}
          </div>

          <BloodGroupSelector value={bloodGroup} onChange={setBloodGroup} label="Filter Target Blood Group" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                City / Metropolitan Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                <input 
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bangalore"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Hyderabad'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                      city.toLowerCase() === c.toLowerCase()
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-700">
                  Search Radius Range
                </label>
                <span className="text-xs font-bold text-red-600">{distance} km</span>
              </div>
              <input 
                type="range"
                min="5"
                max="100"
                step="5"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full accent-red-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>5 km</span>
                <span>25 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-4 sm:pt-6">
              <input 
                type="checkbox"
                id="avail"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
              <label htmlFor="avail" className="text-xs font-medium text-slate-700 cursor-pointer">
                Only Show Active & Available Donors
              </label>
            </div>
          </div>
        </div>

        {/* Map & Sidebar Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Map Section */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-2 border border-slate-200 shadow-xs overflow-hidden min-h-[580px]">
            <LeafletMap 
              center={cityCoords} 
              zoom={12} 
              donors={nearbyDonors} 
              requests={requests}
              radiusKm={distance}
              cityName={city}
              height="580px" 
            />
          </div>

          {/* Sidebar Section */}
          <div className="glass-card rounded-2xl p-5 shadow-xs space-y-4 max-h-[596px] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" /> Matched Nearby Donors
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-semibold text-xs border border-red-200">
                {nearbyDonors.length}
              </span>
            </div>

            {nearbyDonors.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">No matching donors found in this radius.</p>
                <p className="text-[11px] text-slate-400">Try expanding the search distance, switching city, or unchecking 'Only Show Active & Available Donors'.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {nearbyDonors.map((d, i) => {
                  const subject = encodeURIComponent(`Emergency Blood Donation Request (${d.blood_group})`);
                  const body = encodeURIComponent(`Hi ${d.name},\n\nWe saw your profile on LifeLink Emergency Blood Finder. We urgently need ${d.blood_group} blood in ${d.city}.\n\nPlease let us know if you can donate.\n\nThank you!`);
                  const isAvailable = d.availability !== false;
                  
                  return (
                    <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 hover:border-slate-300 transition-all shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-xs ${isAvailable ? 'bg-red-600' : 'bg-slate-500'}`}>
                            {d.blood_group}
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs text-slate-900">{d.name}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{d.city} • <span className="text-red-600 font-medium">{d.distance_km != null ? `${d.distance_km} km away` : 'Nearby'}</span></p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
                          isAvailable 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                        {d.phone ? (
                          <a 
                            href={`tel:${d.phone}`}
                            className="w-full text-center bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold py-1 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </a>
                        ) : <div />}

                        {d.phone ? (
                          <a 
                            href={`sms:${d.phone}?body=${body}`}
                            className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium py-1 rounded-lg transition-colors flex items-center justify-center gap-1 border border-slate-200"
                          >
                            💬 SMS
                          </a>
                        ) : <div />}

                        {d.email ? (
                          <a 
                            href={`mailto:${d.email}?subject=${subject}&body=${body}`}
                            className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium py-1 rounded-lg transition-colors flex items-center justify-center gap-1 border border-slate-200"
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
