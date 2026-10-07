import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/QuantitySelector';
import { Trash2, ArrowLeft, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

export default function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    shippingFee, 
    cartTotal,
    cartCount,
    setCurrentPage, 
    goBack,
    showToast 
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      setCouponApplied(true);
      showToast(`Coupon "${couponCode.toUpperCase()}" applied!`);
    }
  };

  const discountAmount = couponApplied ? Math.round(cartSubtotal * 0.10) : 0;
  const finalTotal = cartTotal - discountAmount;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 md:py-8 space-y-6 font-sans">
      
      {/* Wireframe Header: ← My Cart (3) */}
      <div className="flex items-center justify-between py-2 border-b border-[#d9ca9d]">
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={goBack}
            className="p-1 text-[#103b1d] hover:text-[#18542a] cursor-pointer transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#103b1d]" />
          </button>
          <h1 className="font-urbanist font-extrabold text-xl sm:text-2xl text-[#103b1d]">
            My Cart ({cartCount})
          </h1>
        </div>

        <button 
          onClick={() => setCurrentPage('shop')}
          className="text-xs font-bold text-[#18542a] hover:underline cursor-pointer hidden sm:inline"
        >
          Continue Shopping →
        </button>
      </div>

      {cartItems.length > 0 ? (
        <div className="space-y-6">
          
          {/* Product Items List (Wireframe Layout) */}
          <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] divide-y divide-[#d9ca9d]/70 overflow-hidden shadow-xs">
            {cartItems.map((item) => (
              <div 
                key={`${item.id}-${item.selectedSize}`} 
                className="p-4 sm:p-5 flex items-start justify-between gap-3 sm:gap-4 text-left"
              >
                {/* Left Image Thumbnail Frame (Beige background, clean image, no cross mark) */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#e6dec9] border border-[#c8b894] flex-shrink-0 flex items-center justify-center p-1">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Center Item Details */}
                <div className="flex-1 min-w-0 pt-0.5 space-y-1">
                  <h3 className="font-urbanist font-extrabold text-sm sm:text-base text-[#103b1d] leading-snug truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#556b54] font-medium">
                    {item.selectedSize || item.weight}
                  </p>
                  <div className="font-urbanist font-extrabold text-base sm:text-lg text-[#103b1d] pt-1">
                    ₹{item.price * item.quantity}
                  </div>
                </div>

                {/* Right Side: Top Trash Icon & Bottom Stepper */}
                <div className="flex flex-col items-end justify-between h-20 sm:h-24 flex-shrink-0 pt-0.5">
                  {/* Delete Trash Icon */}
                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-[#556b54] hover:text-red-600 transition-colors p-1 cursor-pointer"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#556b54]" />
                  </button>

                  {/* Quantity Stepper [- 1 +] */}
                  <QuantitySelector 
                    quantity={item.quantity} 
                    onChange={(newQty) => updateQuantity(item.id, item.selectedSize, newQty - item.quantity)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee / Info Badge */}
          <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl p-3.5 text-xs flex items-center justify-between text-[#18542a] font-medium shadow-2xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#18542a]" />
              <span>100% Certified Organic & Farm Fresh Guarantee</span>
            </div>
          </div>

          {/* Order Summary & Promo Code Section (Wireframe screenshot styling) */}
          <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-5 sm:p-6 space-y-5 text-left shadow-xs">
            
            <h2 className="font-urbanist font-extrabold text-lg sm:text-xl text-[#103b1d]">
              Order Summary
            </h2>

            {/* Subtotal & Delivery Charge */}
            <div className="space-y-2.5 text-sm font-medium text-[#556b54]">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-extrabold text-[#103b1d]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                <span className="font-extrabold text-[#103b1d]">₹{shippingFee}</span>
              </div>

              {couponApplied && (
                <div className="flex justify-between items-center text-[#18542a] font-bold">
                  <span>Discount (10%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
            </div>

            {/* Total Amount (Bold divider and row) */}
            <div className="border-t border-[#d9ca9d] pt-3.5 flex justify-between items-center text-base sm:text-lg font-extrabold text-[#103b1d]">
              <span>Total Amount</span>
              <span className="text-xl sm:text-2xl font-urbanist font-extrabold">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Promo Code Input & Apply Button */}
            <form onSubmit={handleApplyCoupon} className="pt-1">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Enter Promo Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#faf5ea] border border-[#d9ca9d] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103b1d] placeholder-[#556b54] text-[#103b1d] font-medium"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <div className="text-xs text-[#18542a] font-semibold flex items-center space-x-1 pt-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Promo Code Applied Successfully!</span>
                </div>
              )}
            </form>

            {/* Proceed to Checkout CTA (Full-width Dark Button matching screenshot) */}
            <button
              onClick={() => setCurrentPage('checkout')}
              className="w-full py-4 bg-[#111827] hover:bg-black text-white font-urbanist font-extrabold text-base rounded-xl shadow-md transition-all cursor-pointer active:scale-98 text-center"
            >
              Proceed to Checkout
            </button>

          </div>

        </div>
      ) : (
        /* Empty Cart State */
        <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-12 text-center space-y-4 shadow-xs">
          <ShoppingBag className="w-14 h-14 mx-auto text-[#18542a]/40" />
          <h2 className="text-xl font-bold font-urbanist text-[#103b1d]">Your Cart is Currently Empty</h2>
          <p className="text-xs text-[#556b54] max-w-sm mx-auto">
            Explore our aged organic basmati rice, cold pressed ghani oils, stone ground spices, and unrefined jaggery.
          </p>
          <div>
            <button 
              onClick={() => setCurrentPage('shop')}
              className="px-7 py-3 bg-[#18542a] hover:bg-[#103b1d] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Browse Farm Harvest →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
