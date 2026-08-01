import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, PhoneCall, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-[#070a13] border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 text-slate-600 dark:text-slate-400 transition-colors relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-rose-500/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xl font-heading font-black text-slate-900 dark:text-white">
                Life<span className="text-rose-600 dark:text-rose-500">Link</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Connecting blood donors with emergency ICU patients in real time across India. Integrated with National Emergency Response (112) & e-RaktKosh standards.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              India Emergency Dispatch Operational 24/7
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Quick Navigation</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li>
                <Link to="/request-blood" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  Request Emergency Blood
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  Register as Blood Donor
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  Interactive Live Radar Map
                </Link>
              </li>
              <li>
                <Link to="/donor-dashboard" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  Donor Portal
                </Link>
              </li>
              <li>
                <a href="https://eraktkosh.in" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  e-RaktKosh Portal (Govt. of India) <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Real Indian Emergency Helplines */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Official Indian Emergency Helplines</h4>
            <div className="glass-card border border-rose-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <p className="text-[10px] text-rose-500 dark:text-rose-400 font-extrabold uppercase tracking-widest">National Emergency Response</p>
                  <a href="tel:112" className="text-slate-900 dark:text-white font-heading font-black text-base hover:text-rose-500 flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-rose-500" /> 112 (All Emergency Services)
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <p className="text-[10px] text-rose-500 dark:text-rose-400 font-extrabold uppercase tracking-widest">National Blood Transfusion Helpline</p>
                  <a href="tel:1097" className="text-slate-900 dark:text-white font-heading font-black text-base hover:text-rose-500 flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-emerald-500" /> 1097 (NACO / NBTC Hotline)
                  </a>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-rose-500 dark:text-rose-400 font-extrabold uppercase tracking-widest">National Ambulance Helpline</p>
                <a href="tel:108" className="text-slate-900 dark:text-white font-heading font-black text-base hover:text-rose-500 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-amber-500" /> 108 (Emergency Ambulance)
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Platform Security & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Security & Verification</h4>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Aadhaar/Phone Verified Donors
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
              <Mail className="w-4 h-4 text-sky-500" />
              Real-Time SMS & Email Alerts
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
              <MapPin className="w-4 h-4 text-rose-500" />
              Haversine GPS Radius Matcher
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4 font-medium">
          <p>© 2026 LifeLink Emergency Blood Dispatch Network. Built for real-time medical response in India.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Donor Safety Guidelines</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
