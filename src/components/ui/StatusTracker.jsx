import React from 'react';
import { Search, Bell, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export default function StatusTracker({ status }) {
  const steps = [
    { key: 'Searching', label: 'Searching Donors', icon: Search },
    { key: 'Notified', label: 'Donors Notified', icon: Bell },
    { key: 'Accepted', label: 'Donors Accepted', icon: CheckCircle2 },
    { key: 'Arranged', label: 'Blood Arranged', icon: ShieldCheck },
    { key: 'Completed', label: 'Completed', icon: Heart }
  ];

  const getStepIndex = (currentStatus) => {
    if (!currentStatus) return 0;
    const lower = currentStatus.toLowerCase();
    if (lower.includes('completed')) return 4;
    if (lower.includes('arranged')) return 3;
    if (lower.includes('accepted')) return 2;
    if (lower.includes('notified')) return 1;
    return 0;
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full glass-card rounded-3xl p-6 shadow-2xl relative overflow-hidden transition-all border border-slate-200 dark:border-slate-800/80">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-[11px] uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-widest">
            Live Emergency Pipeline
          </h4>
          <p className="text-xl font-heading font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
            Status: <span className="text-rose-600 dark:text-rose-400 font-extrabold">{status || 'Searching'}</span>
          </p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-full">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          Real-Time Response
        </span>
      </div>

      <div className="relative flex items-center justify-between mt-8 px-2">
        {/* Track Line Background */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800/80 -z-0 rounded-full"></div>
        
        {/* Track Line Active Fill */}
        <div 
          className="absolute top-5 left-8 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-emerald-500 transition-all duration-700 -z-0 rounded-full shadow-[0_0_12px_rgba(225,29,72,0.6)]"
          style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 32px)` }}
        ></div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                  isDone 
                    ? 'bg-gradient-to-br from-rose-500 to-red-600 border-rose-400 text-white shadow-lg shadow-rose-600/35' 
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                } ${isCurrent ? 'scale-110 ring-4 ring-rose-500/30 animate-pulse' : ''}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span className={`text-[11px] font-bold mt-2.5 text-center max-w-[84px] leading-tight ${
                isCurrent 
                  ? 'text-rose-600 dark:text-rose-400 font-extrabold' 
                  : isDone 
                    ? 'text-slate-800 dark:text-slate-200' 
                    : 'text-slate-400 dark:text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
