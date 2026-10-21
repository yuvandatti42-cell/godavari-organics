import React from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedHarvestProducts() {
  const { products, setCurrentPage } = useCart();

  // Select top featured products across categories from the shop
  const featuredList = products.filter(p => p.isBestseller || p.isPopular).slice(0, 8);

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Section Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-[#eaf4ec] text-[#18542a]">
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight">
            Featured Harvest
          </h2>
        </div>
        
        <button 
          onClick={() => setCurrentPage('shop')}
          className="inline-flex items-center space-x-1 font-urbanist font-extrabold text-xs sm:text-sm text-[#103b1d] hover:text-[#18542a] underline underline-offset-4 transition-colors cursor-pointer"
        >
          <span>View All ({products.length})</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* Unified Horizontal Scroll Carousel */}
      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory py-1">
        {featuredList.map((product) => (
          <div 
            key={product.id}
            className="w-[170px] xs:w-[190px] sm:w-[225px] shrink-0 snap-start flex flex-col"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
