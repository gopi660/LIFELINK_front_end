import React, { useState } from 'react';
import { Bell, Shield, Smartphone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  const handleSave = () => {
    toast.success('Notification & Security settings updated!');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 py-16 flex items-center justify-center px-4 transition-colors">
      <div className="max-w-xl w-full glass-card rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 border border-slate-200 dark:border-slate-800/80 relative overflow-hidden">
        
        <h1 className="text-3xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <Shield className="w-7 h-7 text-rose-500" />
          Account & Notification Settings
        </h1>

        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-widest">Emergency Dispatch Preferences</h3>
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-500" /> Email Emergency Alerts
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Receive email alerts when blood is urgently needed nearby</p>
            </div>
            <input 
              type="checkbox" 
              checked={emailAlerts} 
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 accent-rose-500 rounded cursor-pointer shrink-0"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-500" /> SMS Text Notifications
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Receive instant SMS text messages on your mobile number</p>
            </div>
            <input 
              type="checkbox" 
              checked={smsAlerts} 
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-5 h-5 accent-rose-500 rounded cursor-pointer shrink-0"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" /> Web Push Notifications
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Browser push notifications during urgent requests</p>
            </div>
            <input 
              type="checkbox" 
              checked={pushAlerts} 
              onChange={(e) => setPushAlerts(e.target.checked)}
              className="w-5 h-5 accent-rose-500 rounded cursor-pointer shrink-0"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-rose-500 via-red-600 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-heading font-black py-4 rounded-2xl shadow-xl shadow-rose-600/35 transition-all text-sm cursor-pointer border-t border-white/20 mt-4"
        >
          Save Notification Preferences
        </button>

      </div>
    </div>
  );
}
