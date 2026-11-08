import React from 'react';
import { useCart } from '../context/CartContext';

export const getCategoryCleanImage = (cat) => {
  const name = (cat?.name || cat?.id || '').toLowerCase();
  if (name.includes('rice')) return '/categories/rice.webp';
  if (name.includes('millet')) return '/categories/millet.webp';
  if (name.includes('spice')) return '/categories/spices.webp';
  if (name.includes('ghee') || name.includes('cow')) return '/categories/desi_cow_ghee.webp';
  if (name.includes('oil')) return '/categories/oil.webp';
  if (cat?.imageUrl && !cat.imageUrl.includes('unsplash.com')) return cat.imageUrl;
  if (cat?.image && !cat.image.includes('unsplash.com')) return cat.image;
  return '/categories/oil.webp';
};

export default function CategoryCard({ category }) {
  const { setCurrentPage, setSelectedCategoryFilter } = useCart();

  const handleClick = () => {
    if (setSelectedCategoryFilter) {
      setSelectedCategoryFilter(category.name);
    }
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const imageSrc = getCategoryCleanImage(category);

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col items-center cursor-pointer group select-none transition-transform active:scale-98 h-full"
    >
      {/* Soft Organic Warm Beige Rounded Card Frame (Godavari Brand Color Palette) */}
      <div className="w-full aspect-square bg-[#f3e8cc] hover:bg-[#e6dec9] border border-[#d9ca9d] hover:border-[#18542a]/60 rounded-[24px] xs:rounded-[28px] sm:rounded-[34px] p-2 xs:p-2.5 sm:p-3 flex items-center justify-center transition-all duration-300 group-hover:shadow-md overflow-hidden">
        <img 
          src={imageSrc} 
          alt={category.name}
          width="200"
          height="200"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain transform-gpu group-hover:scale-105 transition-transform duration-500"
          style={{ imageRendering: 'high-quality' }}
        />
      </div>

      {/* Centered Category Title Label Underneath Box */}
      <div className="mt-2.5 sm:mt-3 text-center flex flex-col items-center justify-start min-h-[38px] sm:min-h-[46px] px-1">
        <h3 className="font-urbanist font-extrabold text-xs xs:text-sm sm:text-base md:text-lg text-[#103b1d] group-hover:text-[#18542a] transition-colors leading-snug tracking-tight">
          {category.name}
        </h3>
        {category.subtext && (
          <p className="text-[10px] xs:text-[11px] sm:text-xs text-[#556b54] font-medium leading-tight mt-0.5 max-w-[170px] line-clamp-2">
            {category.subtext}
          </p>
        )}
      </div>
    </div>
  );
}


