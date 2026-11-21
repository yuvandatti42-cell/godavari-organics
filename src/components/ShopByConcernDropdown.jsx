import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { HEALTH_CONCERNS } from '../data/concerns';

export default function ShopByConcernDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const { 
    setCurrentPage, 
    setSelectedCategoryFilter, 
    selectedConcernFilter, 
    setSelectedConcernFilter 
  } = useCart();

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleSelectConcern = (concern) => {
    if (setSelectedCategoryFilter) setSelectedCategoryFilter('');
    if (setSelectedConcernFilter) setSelectedConcernFilter(concern.name);
    setCurrentPage('shop');
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      ref={dropdownRef} 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button in Header Navigation */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`group transition-all duration-200 cursor-pointer flex items-center gap-1.5 py-1 px-1.5 text-xs font-extrabold uppercase tracking-wider ${
          isOpen || selectedConcernFilter
            ? 'text-[#18542a] underline underline-offset-4 decoration-[#9abc05] decoration-2'
            : 'text-[#18542a] hover:text-[#9abc05]'
        }`}
      >
        <span>Shop By Concern</span>
        <ChevronDown 
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#9abc05]' : 'text-[#18542a] group-hover:text-[#9abc05]'}`} 
        />
      </button>

      {/* Dropdown Card - Styled exactly as Two Brothers reference */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 sm:left-auto sm:-translate-x-4 mt-2 w-[290px] sm:w-[310px] bg-[#FAF5EA] border border-[#d9ca9d] rounded-3xl shadow-2xl overflow-hidden z-50 animate-fadeIn"
          style={{
            backgroundImage: 'radial-gradient(ellipse at top left, rgba(255, 255, 255, 0.6) 0%, rgba(250, 245, 234, 0.95) 100%)'
          }}
        >
          {/* Card Top Label */}
          <div className="px-5 pt-4 pb-2 border-b border-[#e5d8b8]/60 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8c7355] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#9abc05]" />
              Health & Wellness
            </span>
            <span className="text-[9px] font-bold text-[#18542a] bg-[#e8dec5] px-2 py-0.5 rounded-full">
              4 Concerns
            </span>
          </div>

          {/* List of Concerns */}
          <div className="p-2.5 space-y-1">
            {HEALTH_CONCERNS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedConcernFilter === item.name;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectConcern(item)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center gap-3.5 transition-all duration-150 cursor-pointer group ${
                    isSelected 
                      ? 'bg-[#18542a] text-white shadow-sm' 
                      : 'hover:bg-[#efe3c8]/80 text-[#103b1d]'
                  }`}
                >
                  {/* Left Icon matching reference screenshot */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isSelected ? 'bg-white/15 text-white' : 'bg-transparent text-[#18542a]'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Concern Details */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-urbanist font-extrabold text-sm tracking-tight ${isSelected ? 'text-white' : 'text-[#103b1d] group-hover:text-[#18542a]'}`}>
                      {item.name}
                    </div>
                    <div className={`text-[11px] font-medium leading-tight truncate ${isSelected ? 'text-[#f3e8cc]' : 'text-[#556b54]'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Accent with Subtle Organic Green Wave Silhouette */}
          <div className="relative pt-4 pb-3 px-5 bg-gradient-to-t from-[#c5dbb0]/35 via-[#FAF5EA]/50 to-transparent border-t border-[#e5d8b8]/40">
            <svg 
              className="absolute bottom-0 left-0 right-0 w-full h-6 pointer-events-none opacity-40 text-[#89af6e]" 
              viewBox="0 0 300 24" 
              fill="currentColor" 
              preserveAspectRatio="none"
            >
              <path d="M0,16 C60,4 120,22 180,10 C240,-2 270,18 300,12 L300,24 L0,24 Z" />
            </svg>
            <div className="relative z-10 flex items-center justify-between text-[11px]">
              <span className="text-[#556b54] font-medium">Certified Organic Farm</span>
              <button
                type="button"
                onClick={() => {
                  if (setSelectedConcernFilter) setSelectedConcernFilter('');
                  if (setSelectedCategoryFilter) setSelectedCategoryFilter('');
                  setCurrentPage('shop');
                  setIsOpen(false);
                }}
                className="font-extrabold text-[#18542a] hover:text-[#9abc05] hover:underline cursor-pointer"
              >
                All Harvest →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
