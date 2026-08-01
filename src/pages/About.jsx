import React from 'react';
import { ShieldCheck, HeartPulse, Droplet, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card border border-rose-500/30 rounded-full text-rose-600 dark:text-rose-400 text-xs font-extrabold uppercase">
            <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" /> About LifeLink Platform
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-black text-slate-900 dark:text-white leading-tight">
            Eliminating Critical Delays in Emergency Blood Delivery
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            During medical emergencies, finding compatible blood donors through manual phone calls and social media posts can cost valuable hours. LifeLink's real-time location-aware dispatch engine connects patients directly with verified nearby donors within minutes.
          </p>
        </div>

        {/* Blood Compatibility Guide */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 border border-slate-200 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <Droplet className="w-6 h-6 text-rose-500 fill-rose-500" />
                Medical Blood Group Compatibility Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                LifeLink's automated search engine enforces these strict clinical rules when matching donors.
              </p>
            </div>
            <span className="px-3.5 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-full border border-rose-500/20">
              Clinical Standard
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                  <th className="py-3.5 px-4">Patient Blood Group</th>
                  <th className="py-3.5 px-4">Compatible Donor Blood Groups</th>
                  <th className="py-3.5 px-4">Clinical Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {COMPATIBILITY_TABLE.map((row) => (
                  <tr key={row.recipient} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors font-medium">
                    <td className="py-4 px-4 font-heading font-black text-slate-900 dark:text-white text-sm">
                      <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md rounded-xl font-extrabold">
                        {row.recipient}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {row.donors.map((d) => (
                          <span key={d} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Safety & Verification Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card glass-card-hover rounded-3xl p-7 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">Donor Verification</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Every registered donor undergoes phone OTP and email verification. Admin moderators actively review and block fake profiles.
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-3xl p-7 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">Haversine GPS Radius</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Our geographic distance algorithm matches patients with donors located within a 50 km radius, sorted by shortest travel distance.
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-3xl p-7 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">Multi-Channel Alerts</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              When an emergency request is posted, notifications are instantly dispatched via Gmail SMTP Email, SMS text messages, and web push.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
