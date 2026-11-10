import React from 'react';
import { useCart } from '../context/CartContext';

export const getCategoryCleanImage = (cat) => {
  const customImg = cat?.imageUrl || cat?.image;
  if (customImg) {
    return customImg;
  }
  const name = (cat?.name || cat?.id || '').toLowerCase();
  if (name.includes('rice')) return '/categories/rice.webp';
  if (name.includes('millet')) return '/categories/millet.webp';
  if (name.includes('spice')) return '/categories/spices.webp';
  if (name.includes('ghee') || name.includes('cow')) return '/categories/desi_cow_ghee.webp';
  if (name.includes('oil')) return '/categories/oil.webp';
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
      <div className="w-full aspect-square bg-[#f3e8cc] hover:bg-[#e6dec9] border border-[#d9ca9d] hover:border-[#18542a]/60 rounded-2xl xs:rounded-[22px] sm:rounded-[30px] md:rounded-[34px] flex items-center justify-center transition-all duration-300 group-hover:shadow-md overflow-hidden relative">
        <img 
          src={imageSrc} 
          alt={category.name}
          width="400"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-500"
          style={{ imageRendering: 'high-quality' }}
        />
      </div>

      {/* Centered Category Title Label Underneath Box */}
      <div className="mt-1.5 xs:mt-2 sm:mt-2.5 text-center flex items-center justify-center px-0.5">
        <h3 className="font-urbanist font-extrabold text-[11px] xs:text-xs sm:text-base md:text-lg text-[#103b1d] group-hover:text-[#18542a] transition-colors leading-tight tracking-tight text-center">
          {category.name}
        </h3>
      </div>
    </div>
  );
}


