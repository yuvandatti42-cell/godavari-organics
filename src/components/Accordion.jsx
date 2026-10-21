import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#faf6ee] hover:bg-[#f6efe1] border border-[#dfd5bf] rounded-2xl px-4 py-1.5 my-2.5 transition-colors shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 flex items-center justify-between text-left font-bold text-xs md:text-sm text-[#103b1d] focus:outline-none hover:text-[#18542a] font-sans transition-colors cursor-pointer"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-[#18542a]" /> : <ChevronDown className="w-4 h-4 text-[#18542a]" />}
      </button>

      {isOpen && (
        <div className="pb-3 px-1 text-xs text-[#556b54] leading-relaxed font-sans border-t border-[#dfd5bf]/70 pt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
