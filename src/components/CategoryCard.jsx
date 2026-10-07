import React from 'react';
import { useCart } from '../context/CartContext';

export default function CategoryCard({ category }) {
  const { setCurrentPage } = useCart();

  // Soft light pastel ice-blue background matching reference screenshot
  const bgTint = category.bgTint || 'bg-[#edf4fe] hover:bg-[#e1edfe]';

  return (
    <div 
      onClick={() => setCurrentPage('shop')}
      className="flex flex-col items-center cursor-pointer group select-none transition-transform active:scale-95 h-full"
    >
      {/* Equal Frame Light Blue Rounded Box Container */}
      <div className={`w-full aspect-square ${bgTint} rounded-[24px] xs:rounded-[28px] sm:rounded-[32px] p-3 sm:p-5 flex items-center justify-center transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-sm`}>
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Centered Category Title Label Underneath Box - Equal Min-Height for Perfect Row Alignment */}
      <div className="mt-2 sm:mt-3 text-center flex items-start justify-center min-h-[36px] sm:min-h-[44px]">
        <h4 className="font-urbanist font-extrabold text-[12px] xs:text-xs sm:text-sm md:text-base text-[#2d3748] text-center leading-snug group-hover:text-[#18542a] transition-colors max-w-[150px]">
          {category.name}
        </h4>
      </div>
    </div>
  );
}


