import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import QuantitySelector from './QuantitySelector';
import { X, Star, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigateToProduct } = useCart();
  const [selectedSize, setSelectedSize] = useState(
    quickViewProduct?.packSizes?.[0] || quickViewProduct?.weight || '1kg'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.packSizes?.[0] || quickViewProduct.weight || '1kg');
      setQuantity(1);
      setActiveImgIdx(0);
    }
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const displayImages = (quickViewProduct.images && quickViewProduct.images.length > 0)
    ? quickViewProduct.images
    : [quickViewProduct.image];
  const activeImage = displayImages[activeImgIdx] || quickViewProduct.image;

  const currentPrice = (quickViewProduct.prices && quickViewProduct.prices[selectedSize])
    ? quickViewProduct.prices[selectedSize]
    : quickViewProduct.price;

  const currentOriginalPrice = (quickViewProduct.originalPrices && quickViewProduct.originalPrices[selectedSize])
    ? quickViewProduct.originalPrices[selectedSize]
    : quickViewProduct.originalPrice;

  const currentDiscount = (currentOriginalPrice && currentPrice < currentOriginalPrice)
    ? `${Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF`
    : quickViewProduct.discount;

  const packOptions = quickViewProduct.packSizes || [quickViewProduct.weight || '1kg'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#dfd5bf]/90 relative flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-stone-600 hover:text-black transition-colors border border-[#dfd5bf] shadow-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Side Frame */}
        <div className="md:w-1/2 relative bg-gradient-to-b from-[#faf6ee] to-[#f4ede0]/70 overflow-hidden min-h-[260px] border-b md:border-b-0 md:border-r border-[#dfd5bf] flex flex-col items-center justify-between p-4 sm:p-6">
          <div className="relative w-full flex-1 flex items-center justify-center">
            <img 
              src={activeImage} 
              alt={quickViewProduct.name}
              className="w-full h-full object-contain max-h-[250px] transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
            />
            {currentDiscount && (
              <span className="absolute top-2 left-2 bg-[#d52518] text-white font-black text-xs px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                {currentDiscount}
              </span>
            )}
          </div>

          {/* Thumbnail preview list if multiple images exist */}
          {displayImages.length > 1 && (
            <div className="flex items-center gap-2 mt-3 z-10">
              {displayImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all p-0.5 bg-white cursor-pointer ${
                    activeImgIdx === idx 
                      ? 'border-[#103b1d] ring-2 ring-[#18542a]/30' 
                      : 'border-[#dfd5bf] opacity-70 hover:opacity-100'
                  }`}
                  title={idx === 1 ? 'Extraction Difference Guide' : `Image ${idx + 1}`}
                >
                  <img src={imgSrc} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Side */}
        <div className="md:w-1/2 p-6 overflow-y-auto space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[11px] font-black tracking-wider text-[#18542a] uppercase bg-[#faf6ee] px-2.5 py-1 rounded-full border border-[#dfd5bf]">
                {quickViewProduct.category}
              </span>
              {quickViewProduct.craftTag && (
                <span className="bg-[#103b1d] text-white text-[10.5px] font-black px-2.5 py-0.5 rounded-full border border-[#18542a]/80 shadow-2xs">
                  {quickViewProduct.craftTag}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold font-urbanist text-[#103b1d] leading-snug">
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
              <span className="text-2xl font-black text-[#103b1d] font-urbanist">₹{currentPrice}</span>
              {currentOriginalPrice && (
                <span className="text-sm text-stone-400 line-through">₹{currentOriginalPrice}</span>
              )}
              <span className="text-xs text-[#556b54] font-bold">/ {selectedSize}</span>
            </div>

            <p className="text-xs text-[#556b54] mt-3 leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Pack Size Selector */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#103b1d] uppercase tracking-wider">Pack Size:</label>
                <span className="text-[11px] font-bold text-[#18542a] bg-[#faf5ea] px-2 py-0.5 rounded border border-[#dfd5bf]">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {packOptions.map(size => {
                  const szPrice = quickViewProduct.prices?.[size];
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-[#103b1d] text-white border-[#103b1d] shadow-xs'
                          : 'bg-[#faf6ee] text-[#103b1d] border-[#dfd5bf] hover:border-[#103b1d]'
                      }`}
                    >
                      <span>{size}</span>
                      {szPrice && (
                        <span className={`text-[10px] ${isSelected ? 'text-[#ffc926]' : 'text-[#18542a]'}`}>
                          • ₹{szPrice}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center space-x-3">
              <span className="text-xs font-bold text-[#103b1d] uppercase tracking-wider">Quantity:</span>
              <QuantitySelector quantity={quantity} onChange={setQuantity} className="bg-white border border-[#dfd5bf]" />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <button
              onClick={() => {
                addToCart(quickViewProduct, selectedSize, quantity);
                setQuickViewProduct(null);
              }}
              className="w-full py-3 bg-[#ffc926] hover:bg-[#eab308] text-[#103b1d] border border-[#e5b318] text-xs font-black rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Cart — ₹{currentPrice * quantity}</span>
            </button>

            <button
              onClick={() => {
                setQuickViewProduct(null);
                navigateToProduct(quickViewProduct.id);
              }}
              className="w-full py-2 bg-[#faf6ee] hover:bg-[#f6efe1] text-[#103b1d] text-xs font-bold rounded-xl transition-colors border border-[#dfd5bf] cursor-pointer"
            >
              View Full Product Details →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
