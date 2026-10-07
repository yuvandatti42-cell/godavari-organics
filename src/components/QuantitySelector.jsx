import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ quantity = 1, onChange, className = '' }) {
  return (
    <div className={`inline-flex items-center border border-[#c8b894] rounded-lg bg-[#e6dec9] overflow-hidden text-xs ${className}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="w-7 h-7 flex items-center justify-center text-[#103b1d] hover:bg-[#d9ca9d] font-bold focus:outline-none transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3 h-3" />
      </button>

      <div className="w-8 h-7 flex items-center justify-center font-extrabold text-[#103b1d] text-xs border-x border-[#c8b894] bg-[#faf5ea]">
        {quantity}
      </div>

      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        className="w-7 h-7 flex items-center justify-center text-[#103b1d] hover:bg-[#d9ca9d] font-bold focus:outline-none transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
