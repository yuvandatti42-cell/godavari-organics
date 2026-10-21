import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Star, Plus, Minus, Heart, Eye, Sparkles } from 'lucide-react';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart, updateQuantity, cartItems, navigateToProduct, setQuickViewProduct, showToast } = useCart();
  
  const [selectedCardSize, setSelectedCardSize] = useState(
    product.weight || product.packSizes?.[0] || '1kg'
  );

  const packOptions = product.packSizes || [product.weight || '1kg'];

  // Current price for selected pack size
  const activePrice = (product.prices && product.prices[selectedCardSize]) 
    ? product.prices[selectedCardSize] 
    : product.price;

  const activeOriginalPrice = (product.originalPrices && product.originalPrices[selectedCardSize]) 
    ? product.originalPrices[selectedCardSize] 
    : product.originalPrice;

  const activeDiscount = (activeOriginalPrice && activePrice < activeOriginalPrice)
    ? `${Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)}% OFF`
    : product.discount;

  const savingsAmount = (activeOriginalPrice && activePrice < activeOriginalPrice)
    ? activeOriginalPrice - activePrice
    : 0;

  // Track if this product with this pack size is already in cart
  const cartItem = cartItems.find(
    item => item.id === product.id && item.selectedSize === selectedCardSize
  );
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, selectedCardSize, 1);
  };

  // Typographic helper for compact pack labels
  const formatPackLabel = (sz) => {
    return sz ? sz.replace(' (1/2 L)', ' (½L)').replace(' Litre', 'L') : '';
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dfd5bf]/90 hover:border-[#103b1d]/40 p-2.5 sm:p-3.5 flex flex-col justify-between group relative shadow-[0_2px_8px_rgba(16,59,29,0.04)] hover:shadow-[0_10px_24px_rgba(16,59,29,0.09)] transition-all duration-300 text-left">
      
      <div>
        {/* Crisp Product Image Frame with Organic Cream Backdrop */}
        <div 
          onClick={() => navigateToProduct(product.id)}
          className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden mb-2.5 bg-gradient-to-b from-[#faf6ee] to-[#f4ede0]/60 flex items-center justify-center border border-[#e2d5b5]/50 cursor-pointer group/img p-2.5 sm:p-3.5"
        >
          {/* Main Product Image */}
          {product.image && (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-contain transform-gpu group-hover/img:scale-106 transition-transform duration-500 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.06)]" 
            />
          )}

          {/* Top-Left: Indian Veg Mark & Discount Tag */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 pointer-events-none">
            {/* Classic Indian Green Veg Symbol */}
            <div className="w-3.5 h-3.5 rounded-[3px] border border-emerald-700 bg-white/95 flex items-center justify-center shadow-2xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div>
            </div>
            {activeDiscount && (
              <span className="bg-[#d52518] text-white font-black text-[9px] px-1.5 py-0.5 rounded-[4px] shadow-2xs tracking-wide">
                {activeDiscount}
              </span>
            )}
          </div>

          {/* Top-Right: Quick Action Icons (Wishlist & Quick View) */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                showToast(`Saved ${product.shortName || product.name} to wishlist!`);
              }}
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-red-500 flex items-center justify-center shadow-2xs border border-stone-200/60 transition-transform active:scale-90 cursor-pointer"
              title="Add to Wishlist"
            >
              <Heart className="w-3.5 h-3.5 transition-colors" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (setQuickViewProduct) setQuickViewProduct(product);
              }}
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-[#103b1d] hidden sm:flex items-center justify-center shadow-2xs border border-stone-200/60 transition-transform active:scale-90 cursor-pointer"
              title="Quick Preview"
            >
              <Eye className="w-3.5 h-3.5 transition-colors" />
            </button>
          </div>

          {/* Bottom Floating Craft Tag (Artisanal Godavari USP in Rich Forest Green) */}
          {product.craftTag && (
            <div className="absolute bottom-2 left-2 right-2 flex justify-center pointer-events-none z-10">
              <span className="bg-[#103b1d] text-white text-[9.5px] font-black px-2.5 py-0.5 rounded-full tracking-wider shadow-xs truncate max-w-[95%] border border-[#18542a]/80">
                {product.craftTag}
              </span>
            </div>
          )}
        </div>

        {/* Row 1: Category Tag on Left & Rating on Right */}
        <div className="flex items-center justify-between mb-1 text-[10px] font-bold">
          <span className="text-[#18542a] uppercase tracking-wider font-extrabold truncate max-w-[65%]">
            {product.category}
          </span>
          <div className="flex items-center space-x-1 shrink-0 bg-[#faf5ea] px-1.5 py-0.5 rounded-md border border-[#dfd5bf]/60">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="font-extrabold text-[#103b1d]">{product.rating}</span>
            <span className="text-stone-400 font-medium text-[9px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Row 2: Product Title + Pack Size */}
        <div className="flex items-center gap-1.5 mb-1">
          <h3 
            onClick={() => navigateToProduct(product.id)}
            className="font-urbanist font-extrabold text-xs sm:text-sm text-[#103b1d] truncate cursor-pointer hover:text-[#18542a] transition-colors leading-snug"
            title={product.name}
          >
            {product.shortName || product.name}
          </h3>
          <span className="text-[10px] font-extrabold text-[#556b54] bg-[#faf5ea] px-1.5 py-0.5 rounded-md border border-[#dfd5bf]/80 shrink-0">
            {formatPackLabel(selectedCardSize)}
          </span>
        </div>
      </div>

      {/* Row 3: Bottom Bar (Dynamic Price & Morphing Yellow Add Button) */}
      <div className="pt-2 flex items-center justify-between gap-1.5 border-t border-stone-100/90 mt-1">
        {/* Price Block */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline space-x-1.5">
            <span className="font-urbanist font-black text-sm sm:text-base text-[#103b1d] leading-none">
              ₹{activePrice}
            </span>
            {activeOriginalPrice && (
              <span className="text-[10px] sm:text-[11px] text-stone-400 line-through font-medium leading-none">
                ₹{activeOriginalPrice}
              </span>
            )}
          </div>
          {savingsAmount > 0 && (
            <div className="mt-1">
              <span className="inline-block text-[9px] font-extrabold text-[#18542a] bg-[#eaf4ec] px-1.5 py-0.5 rounded border border-[#c8e2cd]/80 leading-none">
                Save ₹{savingsAmount}
              </span>
            </div>
          )}
        </div>

        {/* High-Converting Golden Yellow Add / Stepper Button */}
        {inCartQty === 0 ? (
          <button
            onClick={handleQuickAdd}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#ffc926] hover:bg-[#eab308] text-[#103b1d] text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1 shrink-0 cursor-pointer border border-[#e5b318]"
            title="Add to Cart"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>ADD</span>
          </button>
        ) : (
          <div className="flex items-center bg-[#ffc926] text-[#103b1d] rounded-xl shadow-xs overflow-hidden shrink-0 border border-[#e5b318]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, selectedCardSize, -1);
              }}
              className="w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center hover:bg-[#eab308] transition-colors active:scale-90 cursor-pointer text-[#103b1d]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3 stroke-[3]" />
            </button>
            <span className="w-6 text-center text-xs font-black font-urbanist text-[#103b1d] select-none">
              {inCartQty}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, selectedCardSize, 1);
              }}
              className="w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center hover:bg-[#eab308] transition-colors active:scale-90 cursor-pointer text-[#103b1d]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
