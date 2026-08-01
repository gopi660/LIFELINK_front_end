import React from 'react';
import { Droplet, Check } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodGroupSelector({ value, onChange, label = "Select Blood Group" }) {
  return (
    <div className="space-y-2.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {label}
          </label>
          {value && (
            <button 
              type="button" 
              onClick={() => onChange('')} 
              className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-400 underline tracking-wide"
            >
              Clear Selection
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
        {BLOOD_GROUPS.map((bg) => {
          const isSelected = value === bg;
          return (
            <button
              key={bg}
              type="button"
              onClick={() => onChange(isSelected ? '' : bg)}
              className={`relative group flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-rose-500 to-red-600 border-rose-400 text-white shadow-lg shadow-rose-600/35 scale-[1.04] z-10 font-bold'
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-rose-400/50 hover:bg-rose-500/5 dark:hover:bg-rose-500/10'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </div>
              )}
              <Droplet className={`w-4 h-4 mb-1 transition-transform group-hover:scale-110 ${isSelected ? 'fill-white text-white' : 'text-rose-500'}`} />
              <span className="text-sm font-black tracking-tight">{bg}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
