import React, { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { Bell, Mail, Smartphone, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Bell className="w-7 h-7 text-rose-500 animate-bounce" />
              Notifications Dispatch Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Emergency alerts dispatched via Email, SMS, and Push notifications.
            </p>
          </div>

          {notifications.some(n => !n.is_read) && (
            <button 
              onClick={markAllAsRead}
              className="glass-card hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              Mark All Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center space-y-3 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white">No Notifications Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              You will receive real-time notifications here when emergency requests match your donor profile.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {notifications.map((notif) => {
              const Icon = getIcon(notif.type);
              return (
                <div 
                  key={notif.id}
                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    !notif.is_read 
                      ? 'glass-card border-rose-500/40 shadow-xl' 
                      : 'bg-white dark:bg-[#070a13] border-slate-200 dark:border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      !notif.is_read ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{new Date(notif.sent_time).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">{notif.message}</p>
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
