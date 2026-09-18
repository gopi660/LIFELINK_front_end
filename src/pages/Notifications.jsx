import React, { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { Bell, Mail, Smartphone } from 'lucide-react';

export default function Notifications() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    if (type === 'email') return Mail;
    if (type === 'sms') return Smartphone;
    return Bell;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Bell className="w-6 h-6 text-red-600" />
              Notifications Dispatch Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Emergency alerts dispatched via Email, SMS, and Push notifications.
            </p>
          </div>

          {notifications.some(n => !n.is_read) && (
            <button 
              onClick={markAllAsRead}
              className="bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer border border-slate-200 shadow-xs"
            >
              Mark All Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-3 border border-slate-200 max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Notifications Yet</h3>
            <p className="text-xs text-slate-500">
              You will receive real-time notifications here when emergency requests match your donor profile.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const Icon = getIcon(notif.type);
              return (
                <div 
                  key={notif.id}
                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    !notif.is_read 
                      ? 'bg-white border-red-200 shadow-xs ring-1 ring-red-500/10' 
                      : 'bg-white border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      !notif.is_read ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs text-slate-900">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400">{new Date(notif.sent_time).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-normal">{notif.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
