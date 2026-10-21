import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ quantity = 1, onChange, className = '' }) {
  return (
    <div className={`inline-flex items-center border border-stone-200 rounded-lg bg-stone-50/80 overflow-hidden text-xs shadow-2xs ${className}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="w-7 h-7 sm:w-8 sm:h-7.5 flex items-center justify-center text-stone-600 hover:text-[#103b1d] hover:bg-stone-200/60 font-semibold focus:outline-none transition-colors cursor-pointer active:scale-95"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3 h-3" />
      </button>

      <div className="w-8 h-7 sm:w-9 sm:h-7.5 flex items-center justify-center font-urbanist font-extrabold text-[#103b1d] text-xs sm:text-sm border-x border-stone-200 bg-white select-none">
        {quantity}
      </div>

      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        className="w-7 h-7 sm:w-8 sm:h-7.5 flex items-center justify-center text-stone-600 hover:text-[#103b1d] hover:bg-stone-200/60 font-semibold focus:outline-none transition-colors cursor-pointer active:scale-95"
        aria-label="Increase quantity"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
