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
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 flex items-center justify-center px-4">
      <div className="max-w-xl w-full glass-card rounded-2xl p-7 sm:p-9 shadow-sm space-y-6 border border-slate-200">
        
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-5">
          <Shield className="w-6 h-6 text-red-600" />
          Account & Notification Settings
        </h1>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Emergency Dispatch Preferences</h3>
          
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600" /> Email Emergency Alerts
              </span>
              <p className="text-[11px] text-slate-500">Receive email alerts when blood is urgently needed nearby</p>
            </div>
            <input 
              type="checkbox" 
              checked={emailAlerts} 
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer shrink-0 ml-3"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-600" /> SMS Text Notifications
              </span>
              <p className="text-[11px] text-slate-500">Receive instant SMS text messages on your mobile number</p>
            </div>
            <input 
              type="checkbox" 
              checked={smsAlerts} 
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer shrink-0 ml-3"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-600" /> Web Push Notifications
              </span>
              <p className="text-[11px] text-slate-500">Browser push notifications during urgent requests</p>
            </div>
            <input 
              type="checkbox" 
              checked={pushAlerts} 
              onChange={(e) => setPushAlerts(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer shrink-0 ml-3"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-sm cursor-pointer mt-2"
        >
          Save Notification Preferences
        </button>

      </div>
    </div>
  );
}
