import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, PhoneCall, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-14 pb-12 text-slate-600 transition-colors relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          
          {/* Col 1: Brand */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center text-red-600 shrink-0">
                <svg className="w-7 h-7 fill-red-600 text-red-600" viewBox="0 0 24 24">
                  <path d="M12 2C12 2 4.5 10.5 4.5 15.5C4.5 19.64 7.86 23 12 23C16.14 23 19.5 19.64 19.5 15.5C19.5 10.5 12 2 12 2Z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">
                LifeLink
              </span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-slate-500">
              Connecting blood donors with emergency ICU patients in real time across India. Integrated with National Emergency Response (112) & e-RaktKosh standards.
            </p>
            <div className="flex items-center gap-2 text-[11.5px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg w-fit">
              India Emergency Dispatch Operational 24/7
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-[13.5px] font-medium">
              <li>
                <Link to="/request-blood" className="hover:text-red-600 transition-colors flex items-center gap-1.5">
                  Request Emergency Blood
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-red-600 transition-colors flex items-center gap-1.5">
                  Register as Blood Donor
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-red-600 transition-colors flex items-center gap-1.5">
                  Interactive Live Radar Map
                </Link>
              </li>
              <li>
                <Link to="/donor-dashboard" className="hover:text-red-600 transition-colors flex items-center gap-1.5">
                  Donor Portal
                </Link>
              </li>
              <li>
                <a href="https://eraktkosh.in" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors flex items-center gap-1.5">
                  e-RaktKosh Portal (Govt. of India) <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Real Indian Emergency Helplines */}
          <div>
            <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-4">Official Indian Emergency Helplines</h4>
            <div className="glass-card border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
              <div className="border-b border-slate-100 pb-2">
                <p className="text-[11px] text-red-600 font-semibold uppercase tracking-wider">National Emergency Response</p>
                <a href="tel:112" className="text-slate-900 font-bold text-[14.5px] hover:text-red-600 flex items-center gap-1.5 mt-0.5">
                  <PhoneCall className="w-3.5 h-3.5 text-red-600" /> 112 (All Emergency Services)
                </a>
              </div>

              <div className="border-b border-slate-100 pb-2">
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Blood Transfusion Helpline</p>
                <a href="tel:1097" className="text-slate-900 font-bold text-[14.5px] hover:text-red-600 flex items-center gap-1.5 mt-0.5">
                  <PhoneCall className="w-3.5 h-3.5 text-red-600" /> 1097 (NACO / NBTC Hotline)
                </a>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">National Ambulance Helpline</p>
                <a href="tel:108" className="text-slate-900 font-bold text-[14.5px] hover:text-red-600 flex items-center gap-1.5 mt-0.5">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-600" /> 108 (Emergency Ambulance)
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Platform Security & Standards */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-4">Security & Verification</h4>
            <div className="flex items-center gap-2 text-[13.5px] text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              100% Aadhaar/Phone Verified Donors
            </div>
            <div className="flex items-center gap-2 text-[13.5px] text-slate-700 font-medium">
              <Mail className="w-4 h-4 text-slate-400" />
              Real-Time SMS & Email Alerts
            </div>
            <div className="flex items-center gap-2 text-[13.5px] text-slate-700 font-medium">
              <MapPin className="w-4 h-4 text-red-600" />
              Haversine GPS Radius Matcher
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-7 flex flex-col sm:flex-row items-center justify-between text-[12.5px] text-slate-500 gap-4 font-normal">
          <p>© 2026 LifeLink Emergency Blood Dispatch Network. Built for real-time medical response in India.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Donor Safety Guidelines</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
