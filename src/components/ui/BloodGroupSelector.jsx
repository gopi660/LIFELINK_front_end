import React from 'react';
import { Droplet, Check } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodGroupSelector({ value, onChange, label = "Select Blood Group" }) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-800">
            {label}
          </label>
          {value && (
            <button 
              type="button" 
              onClick={() => onChange('')} 
              className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {BLOOD_GROUPS.map((bg) => {
          const isSelected = value === bg;
          return (
            <button
              key={bg}
              type="button"
              onClick={() => onChange(isSelected ? '' : bg)}
              className={`relative group flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-red-600 border-red-600 text-white shadow-sm font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </div>
              )}
              <Droplet className={`w-4 h-4 mb-1 transition-colors ${isSelected ? 'fill-white text-white' : 'text-red-500'}`} />
              <span className="text-sm font-bold">{bg}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
