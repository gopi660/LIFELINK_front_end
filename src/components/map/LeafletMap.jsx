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

// Custom Clean Red Pill for Donors with Distance Included Directly
const createBloodIcon = (bloodGroup, distanceKm, isAvailable = true) => {
  const distBadge = distanceKm != null ? `${distanceKm}km` : 'Near';
  return L.divIcon({
    className: 'custom-blood-marker-pill',
    html: `
      <div style="
        background-color: ${isAvailable ? '#dc2626' : '#64748b'};
        color: #ffffff;
        border: 2px solid #ffffff;
        border-radius: 9999px;
        padding: 4px 10px;
        font-weight: 700;
        font-size: 11px;
        box-shadow: 0 4px 12px ${isAvailable ? 'rgba(220, 38, 38, 0.4)' : 'rgba(100, 116, 139, 0.3)'};
        display: inline-flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
        cursor: pointer;
        transform: translate(-50%, -50%);
      ">
        <span style="font-size: 12px;">🩸</span>
        <span>${bloodGroup || 'Donor'}</span>
        <span style="background: rgba(0,0,0,0.2); padding: 1px 5px; border-radius: 6px; font-size: 10px; font-weight: 600;">
          ${distBadge}
        </span>
        ${!isAvailable ? '<span style="background:#1e293b; padding:1px 4px; border-radius:4px; font-size:9px; font-weight:800;">BUSY</span>' : ''}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Custom Hospital Emergency Pill — Fully auto-sized with NO overflow and NO square border
const createHospitalIcon = (req) => {
  const hospitalName = req?.hospital_name ? req.hospital_name : 'Hospital';
  const bloodGroup = req?.blood_group ? req.blood_group : 'Req';
  return L.divIcon({
    className: 'custom-hospital-marker-pill',
    html: `
      <div style="
        background-color: #0f172a;
        color: #ffffff;
        border: 2px solid #ffffff;
        border-radius: 9999px;
        padding: 4px 10px;
        font-weight: 700;
        font-size: 11px;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.35);
        display: inline-flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
        cursor: pointer;
        transform: translate(-50%, -50%);
      ">
        <span style="font-size: 12px;">🏥</span>
        <span style="text-transform: capitalize;">${hospitalName}</span>
        <span style="background: #dc2626; color: #ffffff; padding: 1px 6px; border-radius: 6px; font-size: 10px; font-weight: 800;">
          ${bloodGroup}
        </span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Radar Center Anchor Pill
const createCenterIcon = (label, radiusKm) => {
  return L.divIcon({
    className: 'custom-center-marker-pill',
    html: `
      <div style="
        background-color: #ffffff;
        color: #0f172a;
        border: 2px solid #dc2626;
        border-radius: 9999px;
        padding: 3px 9px;
        font-weight: 700;
        font-size: 10.5px;
        letter-spacing: 0.02em;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        transform: translate(-50%, -50%);
      ">
        <span style="width: 7px; height: 7px; border-radius: 50%; background-color: #dc2626; display: inline-block;"></span>
        <span>${label || 'Center'}</span>
        <span style="color: #64748b; font-size: 9.5px; font-weight: 500;">(${radiusKm}km)</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Dynamic View Adjuster — Scales and pans smoothly so the coverage circle and pins fit perfectly
function FitBoundsOrCenter({ center, radiusKm = 50 }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !center || !center[0] || !center[1]) return;

    // Calculate bounding box matching the radar coverage radius
    const latLng = L.latLng(center[0], center[1]);
    const radiusMeters = (radiusKm || 50) * 1000;
    const circleBounds = latLng.toBounds(radiusMeters * 2);

    map.fitBounds(circleBounds, {
      padding: [45, 45],
      maxZoom: 13,
      animate: true
    });
  }, [map, center, radiusKm]);

  return null;
}

export default function LeafletMap({ 
  center = [12.9716, 77.5946], 
  zoom = 12, 
  donors = [], 
  requests = [], 
  radiusKm = 50,
  cityName = '',
  height = "580px" 
}) {
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  // Prevent markers with identical coordinates from stacking directly on top of each other
  const seenCoords = {};
  const getDistinctPosition = (lat, lng, idx) => {
    const key = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
    if (!seenCoords[key]) {
      seenCoords[key] = 1;
      return [lat, lng];
    }
    const count = seenCoords[key]++;
    const angle = (count * 2 * Math.PI) / 6;
    const offset = 0.0035 * count;
    return [lat + Math.sin(angle) * offset, lng + Math.cos(angle) * offset];
  };

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
      
      {/* Top Floating Radar Info Strip */}
      <div className="absolute top-3 left-14 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2.5 text-xs pointer-events-none">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
          <span>{cityName || 'Region'} Radar</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="text-slate-600 font-medium">
          Radius: <strong className="text-red-600 font-bold">{radiusKm} km</strong>
        </div>
        <span className="text-slate-300">|</span>
        <div className="text-slate-600 font-medium">
          <strong className="text-slate-900">{donors.length}</strong> Donors • <strong className="text-slate-900">{requests.length}</strong> Requests
        </div>
      </div>

      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        className="custom-leaflet-map"
      >
        <FitBoundsOrCenter center={center} radiusKm={radiusKm} />
        
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
          <Marker position={center} icon={createCenterIcon(cityName, radiusKm)}>
            <Popup>
              <div className="p-1 min-w-[180px]">
                <p className="text-xs font-bold text-slate-900">{cityName} Dispatch Center</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Coverage Radius: <strong className="text-red-600">{radiusKm} km</strong></p>
                <p className="text-[11px] text-slate-500">Center Coordinates: {center[0].toFixed(4)}, {center[1].toFixed(4)}</p>
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
              icon={createBloodIcon(donor.blood_group, donor.distance_km, isAvailable)}
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
              icon={createHospitalIcon(req)}
            >
              <Popup>
                <div className="p-1 min-w-[230px]">
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
