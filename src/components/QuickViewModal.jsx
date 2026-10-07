import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Star, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigateToProduct } = useCart();
  const [selectedSize, setSelectedSize] = useState(quickViewProduct?.weight || '1kg');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f3e8cc] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#d9ca9d] relative flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#f3e8cc] hover:bg-[#e6dec9] flex items-center justify-center text-[#18542a] transition-colors border border-[#c8b894]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Side Frame */}
        <div className="md:w-1/2 relative bg-[#e6dec9] overflow-hidden min-h-[260px] border-b md:border-b-0 md:border-r border-[#d9ca9d]">
          <img 
            src={quickViewProduct.image} 
            alt={quickViewProduct.name}
            className="w-full h-full object-cover"
          />
          {quickViewProduct.discount && (
            <span className="absolute top-4 left-4 bg-[#18542a] text-white font-bold text-xs px-3 py-1 rounded-full border border-[#103b1d] shadow-md">
              {quickViewProduct.discount}
            </span>
          )}
        </div>

        {/* Product Details Side */}
        <div className="md:w-1/2 p-6 overflow-y-auto space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-[#2d6a4f] uppercase bg-[#e8f5e9] px-2.5 py-1 rounded-full">
              {quickViewProduct.category}
            </span>

            <h2 className="text-xl font-bold font-serif text-[#163b28] mt-2 leading-snug">
              {quickViewProduct.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">{quickViewProduct.rating}</span>
              <span className="text-xs text-gray-500">({quickViewProduct.reviewsCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mt-3">
              <span className="text-2xl font-bold text-[#163b28]">₹{quickViewProduct.price}</span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-gray-400 line-through">₹{quickViewProduct.originalPrice}</span>
              )}
              <span className="text-xs text-gray-500">/ {quickViewProduct.weight}</span>
            </div>

            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Pack Size Selector */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-bold text-[#163b28]">Pack Size:</label>
              <div className="flex flex-wrap gap-2">
                {(quickViewProduct.packSizes || ['500g', '1kg', '5kg']).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedSize === size
                        ? 'bg-[#163b28] text-white border-[#163b28]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <button
              onClick={() => {
                addToCart(quickViewProduct, selectedSize, quantity);
                setQuickViewProduct(null);
              }}
              className="w-full py-3 bg-[#163b28] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart — ₹{quickViewProduct.price * quantity}</span>
            </button>

            <button
              onClick={() => {
                setQuickViewProduct(null);
                navigateToProduct(quickViewProduct.id);
              }}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#163b28] text-xs font-semibold rounded-xl transition-colors"
            >
              View Full Product Details →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
