import React from 'react';
import { useCart } from '../context/CartContext';

export default function CategoryCard({ category }) {
  const { setCurrentPage } = useCart();

  return (
    <div 
      onClick={() => setCurrentPage('shop')}
      className="flex flex-col items-center cursor-pointer group select-none transition-transform active:scale-98 h-full"
    >
      {/* Soft Light Ice-Blue Rounded Card Frame (Exact match to reference screenshot) */}
      <div className="w-full aspect-square bg-[#edf4fe] hover:bg-[#e1edfe] rounded-[24px] xs:rounded-[28px] sm:rounded-[34px] p-3 xs:p-4 sm:p-5 flex items-center justify-center transition-all duration-300 group-hover:shadow-xs">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Centered Category Title Label Underneath Box */}
      <div className="mt-2.5 sm:mt-3.5 text-center flex items-start justify-center min-h-[40px] sm:min-h-[48px] px-1">
        <h4 className="font-urbanist font-extrabold text-[13px] xs:text-sm sm:text-base md:text-lg text-[#232931] text-center leading-snug group-hover:text-[#18542a] transition-colors max-w-[150px]">
          {category.name}
        </h4>
      </div>
    </div>
  );
}


