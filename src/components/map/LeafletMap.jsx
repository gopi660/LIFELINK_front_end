import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useThemeStore } from '../../store/themeStore';

// Fix standard Leaflet default marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Red Marker for Donors / Requests
const createBloodIcon = (bloodGroup) => {
  return L.divIcon({
    className: 'custom-blood-marker',
    html: `
      <div style="
        background-color: #dc2626;
        color: white;
        border: 2px solid #ffffff;
        border-radius: 20px;
        padding: 4px 8px;
        font-weight: 800;
        font-size: 11px;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.6);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span>🩸</span> ${bloodGroup || 'Donor'}
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  });
};

const createHospitalIcon = () => {
  return L.divIcon({
    className: 'custom-hospital-marker',
    html: `
      <div style="
        background-color: #2563eb;
        color: white;
        border: 2px solid #ffffff;
        border-radius: 20px;
        padding: 4px 8px;
        font-weight: 800;
        font-size: 11px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.6);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span>🏥</span> Emergency
      </div>
    `,
    iconSize: [70, 30],
    iconAnchor: [35, 15]
  });
};

function FitBoundsOrCenter({ center, donors = [], requests = [] }) {
  const map = useMap();

  useEffect(() => {
    const points = [];
    donors.forEach(d => {
      if (d.latitude && d.longitude) points.push([d.latitude, d.longitude]);
    });
    requests.forEach(r => {
      if (r.latitude && r.longitude) points.push([r.latitude, r.longitude]);
    });

    if (points.length > 0) {
      if (points.length === 1) {
        map.setView(points[0], 13);
      } else {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    } else if (center) {
      map.setView(center, 12);
    }
  }, [center, donors, requests, map]);

  return null;
}

export default function LeafletMap({ 
  center = [12.9716, 77.5946], 
  zoom = 12, 
  donors = [], 
  requests = [],
  height = "500px" 
}) {
  const { theme } = useThemeStore();

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        className="custom-leaflet-map"
      >
        <FitBoundsOrCenter center={center} donors={donors} requests={requests} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />

        {/* Coverage Radius Circle */}
        <Circle 
          center={center} 
          radius={5000} 
          pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.1 }} 
        />

        {/* Donor Markers */}
        {donors.map((donor, i) => {
          const emailSubject = encodeURIComponent(`Urgent Blood Donation Request (${donor.blood_group})`);
          const emailBody = encodeURIComponent(`Hi ${donor.name},\n\nWe found your profile on LifeLink Emergency Blood Finder. We urgently need ${donor.blood_group} blood in ${donor.city}.\n\nPlease respond if you are available to donate.\n\nThank you!`);
          
          return (
            <Marker 
              key={`donor-${donor.donor_id || i}`} 
              position={[donor.latitude || center[0] + (i * 0.005), donor.longitude || center[1] + (i * 0.005)]}
              icon={createBloodIcon(donor.blood_group)}
            >
              <Popup>
                <div className="p-1 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                      {donor.blood_group}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{donor.name || 'Anonymous Donor'}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{donor.city || 'Bangalore'} • <strong className="text-red-600 dark:text-red-400">{donor.distance_km ? `${donor.distance_km} km away` : 'Nearby'}</strong></p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 py-1.5 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-slate-700 dark:text-slate-300"><strong>Status:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active Donor</span></p>
                    {donor.phone && <p className="text-slate-700 dark:text-slate-300"><strong>Phone:</strong> {donor.phone}</p>}
                    {donor.email && <p className="text-slate-700 dark:text-slate-300 truncate"><strong>Email:</strong> {donor.email}</p>}
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    {donor.phone && (
                      <a 
                        href={`tel:${donor.phone}`} 
                        className="w-full text-center bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] py-1.5 rounded-lg transition-colors"
                      >
                        📞 Call
                      </a>
                    )}
                    {donor.email && (
                      <a 
                        href={`mailto:${donor.email}?subject=${emailSubject}&body=${emailBody}`} 
                        className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] py-1.5 rounded-lg transition-colors"
                      >
                        ✉️ Email
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Blood Request Markers */}
        {requests.map((req, i) => (
          <Marker 
            key={`req-${req.id || i}`} 
            position={[req.latitude || center[0] - (i * 0.006), req.longitude || center[1] - (i * 0.006)]}
            icon={createHospitalIcon()}
          >
            <Popup>
              <div className="p-1 min-w-[220px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-md uppercase">
                    {req.emergency_level || 'Emergency'}
                  </span>
                  <span className="text-xs text-red-600 dark:text-red-400 font-extrabold">{req.blood_group} ({req.units} units)</span>
                </div>
                
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">{req.hospital_name}</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">Patient: <strong>{req.patient_name}</strong></p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{req.hospital_address || req.city}</p>

                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Status: {req.status}</span>
                  <a 
                    href={`tel:${req.contact_number}`} 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1 rounded font-bold"
                  >
                    Call Hospital
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
