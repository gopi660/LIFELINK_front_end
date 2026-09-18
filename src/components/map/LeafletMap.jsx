import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix standard Leaflet default marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Clean Red Marker for Donors / Requests
const createBloodIcon = (bloodGroup, isAvailable = true) => {
  return L.divIcon({
    className: 'custom-blood-marker',
    html: `
      <div style="
        background-color: ${isAvailable ? '#dc2626' : '#64748b'};
        color: white;
        border: 2px solid #ffffff;
        border-radius: 12px;
        padding: 3px 8px;
        font-weight: 700;
        font-size: 11px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        cursor: pointer;
      ">
        <span>🩸</span> ${bloodGroup || 'Donor'}${!isAvailable ? ' (Busy)' : ''}
      </div>
    `,
    iconSize: [isAvailable ? 60 : 78, 26],
    iconAnchor: [isAvailable ? 30 : 39, 13]
  });
};

const createHospitalIcon = () => {
  return L.divIcon({
    className: 'custom-hospital-marker',
    html: `
      <div style="
        background-color: #0f172a;
        color: white;
        border: 2px solid #ffffff;
        border-radius: 12px;
        padding: 3px 8px;
        font-weight: 700;
        font-size: 11px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        cursor: pointer;
      ">
        <span>🏥</span> Hospital Req
      </div>
    `,
    iconSize: [84, 26],
    iconAnchor: [42, 13]
  });
};

const createCenterIcon = (label) => {
  return L.divIcon({
    className: 'custom-center-marker',
    html: `
      <div style="
        background-color: #dc2626;
        color: white;
        border: 2px solid #ffffff;
        border-radius: 9999px;
        padding: 2px 8px;
        font-weight: 700;
        font-size: 10px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        box-shadow: 0 2px 6px rgba(220, 38, 38, 0.4);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span style="width:6px;height:6px;border-radius:50%;background-color:#ffffff;display:inline-block;animation:pulse 1.5s infinite;"></span>
        ${label || 'Center'}
      </div>
    `,
    iconSize: [76, 22],
    iconAnchor: [38, 11]
  });
};

function FitBoundsOrCenter({ center, donors = [], requests = [] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points = [];
    if (center && center[0] && center[1]) {
      points.push(L.latLng(center[0], center[1]));
    }
    donors.forEach(d => {
      if (d.latitude && d.longitude) {
        points.push(L.latLng(d.latitude, d.longitude));
      }
    });
    requests.forEach(r => {
      if (r.latitude && r.longitude) {
        points.push(L.latLng(r.latitude, r.longitude));
      }
    });

    if (points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (points.length === 1) {
      map.setView(points[0], 12);
    }
  }, [map, center, donors, requests]);

  return null;
}

export default function LeafletMap({ 
  center = [12.9716, 77.5946], 
  zoom = 12, 
  donors = [], 
  requests = [], 
  radiusKm = 50,
  cityName = '',
  height = "500px" 
}) {
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  // Prevent exact overlapping coordinate markers
  const seenCoords = {};
  const getDistinctPosition = (lat, lng, idx) => {
    const key = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
    if (!seenCoords[key]) {
      seenCoords[key] = 1;
      return [lat, lng];
    }
    const count = seenCoords[key]++;
    const angle = (count * 2 * Math.PI) / 6;
    const offset = 0.003 * count;
    return [lat + Math.sin(angle) * offset, lng + Math.cos(angle) * offset];
  };

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
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
          radius={(radiusKm || 50) * 1000} 
          pathOptions={{ 
            color: '#dc2626', 
            fillColor: '#dc2626', 
            fillOpacity: 0.06, 
            weight: 1.5, 
            dashArray: '5, 5' 
          }} 
        />

        {/* Radar Epicenter Marker */}
        {cityName && (
          <Marker position={center} icon={createCenterIcon(cityName)}>
            <Popup>
              <div className="p-1">
                <p className="text-xs font-bold text-slate-900">{cityName} Dispatch Center</p>
                <p className="text-[11px] text-slate-500">Radar Radius: {radiusKm} km</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Donor Markers */}
        {donors.map((donor, i) => {
          const rawLat = donor.latitude || center[0];
          const rawLng = donor.longitude || center[1];
          const markerPos = getDistinctPosition(rawLat, rawLng, i);
          const isAvailable = donor.availability !== false;
          const emailSubject = encodeURIComponent(`Urgent Blood Donation Request (${donor.blood_group})`);
          const emailBody = encodeURIComponent(`Hi ${donor.name},\n\nWe found your profile on LifeLink Emergency Blood Finder. We urgently need ${donor.blood_group} blood in ${donor.city}.\n\nPlease respond if you are available to donate.\n\nThank you!`);
          
          return (
            <Marker 
              key={`donor-${donor.donor_id || i}`} 
              position={markerPos}
              icon={createBloodIcon(donor.blood_group, isAvailable)}
            >
              <Popup>
                <div className="p-1 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 ${isAvailable ? 'bg-red-600' : 'bg-slate-500'}`}>
                      {donor.blood_group}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{donor.name || 'Anonymous Donor'}</h4>
                      <p className="text-[11px] text-slate-500">{donor.city || 'Location'} • <strong className="text-red-600">{donor.distance_km != null ? `${donor.distance_km} km away` : 'Nearby'}</strong></p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 py-1.5 border-t border-slate-100">
                    <p className="text-slate-700 flex items-center justify-between">
                      <strong>Status:</strong> 
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {isAvailable ? 'Available Now' : 'Currently Busy'}
                      </span>
                    </p>
                    {donor.phone && <p className="text-slate-700"><strong>Phone:</strong> {donor.phone}</p>}
                    {donor.email && <p className="text-slate-700 truncate"><strong>Email:</strong> {donor.email}</p>}
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {donor.phone && (
                      <a 
                        href={`tel:${donor.phone}`} 
                        className="w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] py-1 rounded-md transition-colors"
                      >
                        📞 Call
                      </a>
                    )}
                    {donor.email && (
                      <a 
                        href={`mailto:${donor.email}?subject=${emailSubject}&body=${emailBody}`} 
                        className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] py-1 rounded-md transition-colors border border-slate-200"
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
        {requests.map((req, i) => {
          const rawLat = req.latitude || center[0];
          const rawLng = req.longitude || center[1];
          const markerPos = getDistinctPosition(rawLat, rawLng, i + 100);

          return (
            <Marker 
              key={`req-${req.id || i}`} 
              position={markerPos}
              icon={createHospitalIcon()}
            >
              <Popup>
                <div className="p-1 min-w-[220px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase">
                      {req.emergency_level || 'Emergency'}
                    </span>
                    <span className="text-xs text-red-600 font-bold">{req.blood_group} ({req.units} units)</span>
                  </div>
                  
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{req.hospital_name}</h4>
                  <p className="text-xs text-slate-700 mt-0.5">Patient: <strong>{req.patient_name}</strong></p>
                  <p className="text-[11px] text-slate-500">{req.hospital_address || req.city}</p>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">{req.status}</span>
                    <a 
                      href={`tel:${req.contact_number}`} 
                      className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] px-2.5 py-1 rounded-md font-semibold"
                    >
                      Call Hospital
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
