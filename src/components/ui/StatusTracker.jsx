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
    <div className="w-full glass-card rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all border border-slate-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
            Live Emergency Pipeline
          </h4>
          <p className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-2">
            Status: <span className="text-red-600 font-bold">{status || 'Searching'}</span>
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-md">
          Real-Time Pipeline
        </span>
      </div>

      <div className="relative flex items-center justify-between mt-6 px-2">
        {/* Track Line Background */}
        <div className="absolute top-4.5 left-8 right-8 h-1 bg-slate-200 -z-0 rounded-full"></div>
        
        {/* Track Line Active Fill */}
        <div 
          className="absolute top-4.5 left-8 h-1 bg-red-600 transition-all duration-500 -z-0 rounded-full"
          style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 32px)` }}
        ></div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border ${
                  isDone 
                    ? 'bg-red-600 border-red-600 text-white shadow-xs' 
                    : 'bg-white border-slate-300 text-slate-400'
                } ${isCurrent ? 'ring-2 ring-red-600/30' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span className={`text-[11px] font-medium mt-2 text-center max-w-[80px] leading-tight ${
                isCurrent 
                  ? 'text-red-600 font-bold' 
                  : isDone 
                    ? 'text-slate-900 font-semibold' 
                    : 'text-slate-400'
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
