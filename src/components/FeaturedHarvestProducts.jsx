import React from 'react';
import { useCart } from '../context/CartContext';
import { Bookmark, Plus, ArrowRight } from 'lucide-react';

export default function FeaturedHarvestProducts() {
  const { products, addToCart, setCurrentPage, navigateToProduct, showToast } = useCart();

  // Select 4-8 featured products from the shop
  const featuredList = products.slice(0, 4);

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Section Title Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight">
          Featured Harvest
        </h2>
        <button 
          onClick={() => setCurrentPage('shop')}
          className="inline-flex items-center space-x-1 font-urbanist font-extrabold text-xs sm:text-sm text-[#103b1d] hover:text-[#18542a] underline underline-offset-4 transition-colors cursor-pointer"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* Compact Horizontal Scroll Row matching reference screenshot layout */}
      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory py-1">
        {featuredList.map((product) => (
          <div 
            key={product.id}
            className="w-[150px] xs:w-[168px] sm:w-[190px] shrink-0 snap-start bg-[#f3e8cc] border border-[#d9ca9d] rounded-[20px] p-2 sm:p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#18542a]/60 transition-all group"
          >
            <div>
              {/* Compact Image Frame Box (Exact match to reference image styling) */}
              <div 
                onClick={() => navigateToProduct(product.id)}
                className="relative w-full aspect-square bg-[#e6dec9] border border-[#c8b894] rounded-[16px] overflow-hidden flex items-center justify-center p-1 cursor-pointer group/img"
              >
                {/* Main Product Image */}
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                />

                {/* Compact Bookmark / Wishlist Icon (Top Right) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast(`Saved ${product.shortName || product.name} to bookmarks!`);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-2xs border border-slate-200/80 z-10 transition-transform active:scale-90 cursor-pointer"
                  title="Bookmark Product"
                >
                  <Bookmark className="w-3 h-3 text-slate-700 hover:text-[#18542a]" />
                </button>

                {/* Compact Veg Symbol & Pagination Dots (Bottom Left) */}
                <div className="absolute bottom-1.5 left-1.5 flex items-center space-x-1 z-10 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded border border-green-700 bg-white/95 flex items-center justify-center shadow-2xs">
                    <div className="w-1 h-1 rounded-full bg-green-700"></div>
                  </div>
                  <div className="flex items-center space-x-0.5 bg-white/80 backdrop-blur-xs px-1 py-0.5 rounded-full shadow-2xs">
                    <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                    <div className="w-0.5 h-0.5 rounded-full bg-slate-400"></div>
                    <div className="w-0.5 h-0.5 rounded-full bg-slate-400"></div>
                  </div>
                </div>

                {/* Floating Rounded Square Plus (+) Add Button (Bottom Right) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-xl bg-white hover:bg-[#f3e8cc] text-[#18542a] border border-[#18542a]/30 shadow-md flex items-center justify-center z-20 transition-all active:scale-90 cursor-pointer"
                  title="Add to Cart"
                >
                  <Plus className="w-4 h-4 text-[#18542a] stroke-[2.5]" />
                </button>
              </div>

              {/* Weight Selector Badge Underneath */}
              <div className="mt-2 mb-1 text-left">
                <span className="inline-block px-2 py-0.5 bg-[#e6dec9] border border-[#c8b894] rounded-md text-[10px] font-bold text-[#103b1d]">
                  {product.weight || '1kg'}
                </span>
              </div>

              {/* Product Title */}
              <h3 
                onClick={() => navigateToProduct(product.id)}
                className="font-urbanist font-extrabold text-xs sm:text-sm text-[#103b1d] leading-snug line-clamp-1 hover:text-[#18542a] transition-colors cursor-pointer text-left"
              >
                {product.shortName || product.name}
              </h3>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline space-x-1.5 mt-1 text-left">
              <span className="font-urbanist font-extrabold text-xs sm:text-sm text-[#103b1d]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-slate-400 line-through font-medium">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
