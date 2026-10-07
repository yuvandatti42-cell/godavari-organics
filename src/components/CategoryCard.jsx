import React from 'react';
import { useCart } from '../context/CartContext';

export default function CategoryCard({ category }) {
  const { setCurrentPage } = useCart();

  // Soft pastel background tint matching reference screenshot (borderless squircle)
  const bgTint = category.bgTint || 'bg-[#edf4fe] hover:bg-[#e2edfd]';

  return (
    <div 
      onClick={() => setCurrentPage('shop')}
      className="flex flex-col items-center cursor-pointer group select-none transition-transform active:scale-95"
    >
      {/* Top Rounded Squircle Image Frame — Borderless matching reference screenshot */}
      <div className={`w-full aspect-square ${bgTint} rounded-[24px] xs:rounded-[26px] sm:rounded-[32px] p-2.5 xs:p-3 sm:p-4 flex items-center justify-center transition-all duration-300 group-hover:scale-[1.03]`}>
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-contain p-1 rounded-[16px] drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Centered Category Title Label Underneath Box */}
      <h4 className="font-urbanist font-black text-[12px] xs:text-xs sm:text-sm text-[#2d3748] text-center leading-snug mt-2 sm:mt-2.5 px-0.5 group-hover:text-[#103b1d] transition-colors">
        {category.name}
      </h4>
    </div>
  );
}


