import React from 'react';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, navigateToProduct, setQuickViewProduct, showToast } = useCart();

  return (
    <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-3.5 flex flex-col justify-between group relative overflow-hidden shadow-xs hover:shadow-md transition-all text-left">
      
      <div>
        {/* Clear Image Box */}
        <div 
          onClick={() => navigateToProduct(product.id)}
          className="relative h-36 xs:h-40 sm:h-44 rounded-xl overflow-hidden mb-3 bg-[#e6dec9] flex items-center justify-center border border-[#c8b894] cursor-pointer group/img"
        >
          {/* Clear Product Image */}
          {product.image && (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
            />
          )}

          {/* Discount Badge if present */}
          {product.discount && (
            <span className="absolute top-2.5 left-2.5 bg-[#d52518] text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-2xs z-10 uppercase tracking-wider">
              {product.discount}
            </span>
          )}

          {/* Wishlist Icon in Top-Right Corner */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showToast(`Added ${product.shortName || product.name} to wishlist!`);
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#103b1d] flex items-center justify-center shadow-xs border border-gray-200 z-20 transition-transform active:scale-90 cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-3.5 h-3.5 text-slate-700 hover:text-red-500 hover:fill-red-500" />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => navigateToProduct(product.id)}
          className="font-urbanist font-extrabold text-sm text-[#103b1d] line-clamp-1 cursor-pointer hover:text-[#9abc05] transition-colors leading-snug"
        >
          {product.shortName || product.name}
        </h3>

        {/* Subtitle / Short Description (Matching screenshot) */}
        <p className="text-[11px] text-[#556b54] font-medium line-clamp-1 mt-0.5">
          {product.description}
        </p>

        {/* Rating Row (5 Stars + Numeric Rating Score) */}
        <div className="flex items-center space-x-1.5 mt-2 mb-2.5 text-xs">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-[#c8b894] fill-[#d9ca9d]'}`} 
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-900 ml-0.5">
            {product.rating}
          </span>
        </div>
      </div>

      <div>
        {/* Pricing Row */}
        <div className="flex items-baseline space-x-2 mb-3">
          <span className="font-urbanist font-extrabold text-base text-[#103b1d]">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-medium">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button (Matching screenshot) */}
        <button
          onClick={() => addToCart(product)}
          className="w-full py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 active:scale-98 cursor-pointer"
        >
          <span>Add to Cart</span>
        </button>
      </div>

    </div>
  );
}
