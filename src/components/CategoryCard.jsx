import React from 'react';
import { useCart } from '../context/CartContext';

export const getCategoryCleanImage = (cat) => {
  if (cat?.imageUrl) return cat.imageUrl;
  if (cat?.image) return cat.image;
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
  };

  const imageSrc = getCategoryCleanImage(category);

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col items-center cursor-pointer group select-none transition-transform active:scale-98 h-full"
    >
      {/* Full Box Category Image Frame */}
      <div className="w-full aspect-square bg-[#f3e8cc] hover:bg-[#e6dec9] border border-[#d9ca9d] hover:border-[#18542a]/60 rounded-2xl xs:rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:shadow-md overflow-hidden">
        <img 
          src={imageSrc} 
          alt={category.name}
          width="200"
          height="200"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-500"
          style={{ imageRendering: 'high-quality' }}
        />
      </div>

      {/* Centered Category Title Label Underneath Box */}
      <div className="mt-2.5 sm:mt-3.5 text-center flex items-start justify-center min-h-[40px] sm:min-h-[48px] px-1">
        <h3 className="font-urbanist font-extrabold text-[13px] xs:text-sm sm:text-base md:text-lg text-[#103b1d] text-center leading-snug group-hover:text-[#18542a] transition-colors max-w-[150px]">
          {category.name}
        </h3>
      </div>
    </div>
  );
}


