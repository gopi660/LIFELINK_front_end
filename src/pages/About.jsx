import React from 'react';
import { ShieldCheck, HeartPulse, Droplet, Activity } from 'lucide-react';

const COMPATIBILITY_TABLE = [
  { recipient: 'A+', donors: ['A+', 'A-', 'O+', 'O-'], notes: 'Universal recipient for A and O types' },
  { recipient: 'A-', donors: ['A-', 'O-'], notes: 'Can only receive negative blood types' },
  { recipient: 'B+', donors: ['B+', 'B-', 'O+', 'O-'], notes: 'Universal recipient for B and O types' },
  { recipient: 'B-', donors: ['B-', 'O-'], notes: 'Can only receive negative blood types' },
  { recipient: 'AB+', donors: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], notes: 'UNIVERSAL RECIPIENT (Can receive all blood groups)' },
  { recipient: 'AB-', donors: ['AB-', 'A-', 'B-', 'O-'], notes: 'Rare blood type' },
  { recipient: 'O+', donors: ['O+', 'O-'], notes: 'Very common, can receive O+ and O-' },
  { recipient: 'O-', donors: ['O-'], notes: 'UNIVERSAL DONOR (Can donate to all, receive only O-)' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-red-600 text-xs font-semibold uppercase tracking-wider">
            <HeartPulse className="w-4 h-4 text-red-600" /> About LifeLink Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Eliminating Critical Delays in Emergency Blood Delivery
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            During medical emergencies, finding compatible blood donors through manual phone calls and social media posts can cost valuable hours. LifeLink's real-time location-aware dispatch engine connects patients directly with verified nearby donors within minutes.
          </p>
        </div>

        {/* Blood Compatibility Guide */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-red-600 fill-red-600" />
                Medical Blood Group Compatibility Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                LifeLink's automated search engine enforces these strict clinical rules when matching donors.
              </p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">
              Clinical Standard
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Blood Group</th>
                  <th className="py-3 px-4">Compatible Donor Blood Groups</th>
                  <th className="py-3 px-4">Clinical Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPATIBILITY_TABLE.map((row) => (
                  <tr key={row.recipient} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-bold text-xs">
                        {row.recipient}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {row.donors.map((d) => (
                          <span key={d} className="px-2 py-0.5 bg-white text-slate-800 text-xs font-semibold rounded-md border border-slate-200 shadow-xs">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Safety & Verification Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-6 space-y-3 border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Donor Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every registered donor undergoes phone and email verification. Admin moderators actively review and maintain system integrity.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-3 border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Haversine GPS Radius</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our geographic distance algorithm matches patients with donors located within a 50 km radius, sorted by shortest travel distance.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-3 border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Multi-Channel Alerts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When an emergency request is posted, notifications are instantly dispatched via Gmail SMTP Email, SMS text messages, and web push.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
