import React, { useState } from 'react';
import { useCart, INITIAL_PRODUCTS } from '../context/CartContext';
import QuantitySelector from '../components/QuantitySelector';
import { 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Tag, 
  Truck, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

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
    showToast,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    user,
    setAuthModalOpen,
    freeShippingThreshold = 1500,
    isFreeShipping = false,
    remainingForFreeShipping = 0,
    freeShippingProgress = 0
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      showToast('Please enter a valid coupon code');
      return;
    }
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
      showToast(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
      showToast(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    if (!user || !user.isLoggedIn) {
      setAuthModalOpen(true);
      showToast('Please log in to proceed to checkout');
      return;
    }
    setCurrentPage('checkout');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 md:py-8 space-y-6 font-sans">
      
      {/* Header: My Cart with badge count & Continue Shopping */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => goBack()}
            className="sm:hidden p-1.5 -ml-1 text-stone-500 hover:text-[#103b1d] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-urbanist font-extrabold text-2xl sm:text-3xl text-[#103b1d] tracking-tight flex items-center gap-2.5">
            <span>My Cart</span>
            <span className="text-xs font-bold font-sans bg-[#103b1d]/10 text-[#103b1d] px-2.5 py-0.5 rounded-full">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </h1>
        </div>

        <button 
          onClick={() => setCurrentPage('shop')}
          className="text-xs sm:text-sm font-bold text-[#18542a] hover:text-[#103b1d] hover:underline cursor-pointer flex items-center gap-1 transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {cartItems.length > 0 ? (
        <div className="space-y-6">
          
          {/* Dynamic Free Shipping Progress & Notification Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isFreeShipping
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
              : 'bg-[#faf5ea] border-[#dfd5bf] text-[#103b1d]'
          }`}>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
              <div className="flex items-center gap-2">
                <Truck className={`w-4 h-4 ${isFreeShipping ? 'text-emerald-700' : 'text-[#18542a]'}`} />
                <span>
                  {isFreeShipping ? (
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      🎉 <strong>Congratulations! You have unlocked FREE Delivery!</strong>
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-emerald-700 font-extrabold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more to get <strong className="text-[#18542a] uppercase">FREE Shipping</strong>!
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500 hidden sm:inline">
                Threshold: ₹{freeShippingThreshold.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShipping ? 'bg-emerald-600' : 'bg-[#18542a]'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Product Items List: Minimal, Crisp White Card */}
          <div className="bg-white rounded-2xl border border-stone-200/90 divide-y divide-stone-100 overflow-hidden shadow-xs">
            {cartItems.map((item) => {
              const matchedProduct = INITIAL_PRODUCTS.find(p => p.id === item.id || p.name.toLowerCase() === item.name.toLowerCase());
              const displayImage = matchedProduct?.image || item.image;

              return (
                <div 
                  key={`${item.id}-${item.selectedSize}`} 
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-5 text-left hover:bg-stone-50/40 transition-colors"
                >
                  {/* Left Image Thumbnail Frame */}
                  <div 
                    onClick={() => {
                      if (matchedProduct) {
                        setCurrentPage('product', { productId: matchedProduct.id });
                      }
                    }}
                    className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-[#faf8f5] border border-stone-200/80 shrink-0 flex items-center justify-center p-1.5 cursor-pointer group"
                  >
                    <img 
                      src={displayImage} 
                      alt={item.name} 
                      width="88"
                      height="88"
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Center Item Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 
                      onClick={() => {
                        if (matchedProduct) {
                          setCurrentPage('product', { productId: matchedProduct.id });
                        }
                      }}
                      className="font-urbanist font-extrabold text-sm sm:text-base text-[#103b1d] hover:text-[#18542a] leading-snug truncate cursor-pointer transition-colors"
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
                      <span>Pack: <span className="font-semibold text-stone-700">{item.selectedSize}</span></span>
                      <span>•</span>
                      <span>Unit Price: <span className="font-semibold text-stone-700">₹{item.price}</span></span>
                    </p>
                    <div className="text-sm font-extrabold text-stone-900 pt-0.5">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Right Actions: Quantity Selector & Remove Icon */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 shrink-0">
                    <QuantitySelector 
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.id, item.selectedSize, 1)}
                      onDecrease={() => updateQuantity(item.id, item.selectedSize, -1)}
                      min={1}
                      max={99}
                    />

                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      aria-label="Remove item"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guarantee / Info Badge */}
          <div className="bg-[#f5f9f6] border border-[#d2e3d5] rounded-xl p-3.5 text-xs flex items-center justify-between text-[#144723] font-medium shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-[#18542a]/10 flex items-center justify-center text-[#18542a] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-stone-800 text-xs">
                Certified Organic & Farm Fresh Guarantee
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#18542a] hidden sm:inline">
              Direct from Godavari Delta
            </span>
          </div>

          {/* Order Summary & Promo Code Section: Minimalist White Card */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 space-y-5 text-left shadow-xs">
            
            <h2 className="font-urbanist font-extrabold text-lg sm:text-xl text-[#103b1d] tracking-tight">
              Order Summary
            </h2>

            {/* Subtotal & Delivery Charge */}
            <div className="space-y-2.5 text-sm font-medium text-stone-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-extrabold text-stone-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                {isFreeShipping ? (
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded text-xs border border-emerald-200">
                    FREE
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-800">
                    FREE above ₹{freeShippingThreshold.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-700 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon ({appliedCoupon.code})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        showToast('Coupon removed');
                      }}
                      className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Total Amount (Bold divider and row) */}
            <div className="border-t border-stone-200/90 pt-4 flex justify-between items-center text-base sm:text-lg font-extrabold text-stone-900">
              <span>Total Amount</span>
              <span className="text-xl sm:text-2xl font-urbanist font-extrabold text-[#103b1d]">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Promo Code Input & Apply Button */}
            <form onSubmit={handleApplyCoupon} className="pt-1 space-y-2">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Enter Store Coupon (e.g. GODAVARI10)"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    if (couponError) setCouponError('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#103b1d] focus:ring-1 focus:ring-[#103b1d] placeholder-stone-400 text-stone-900 font-medium transition-all uppercase"
                />
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-[#103b1d] text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Apply
                </button>
              </div>

              {/* Coupon Error in RED Color */}
              {couponError && (
                <div className="text-xs text-red-600 font-bold flex items-center gap-2 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}

              {/* Active Coupon Banner in Green */}
              {appliedCoupon && !couponError && (
                <div className="text-xs text-emerald-700 font-semibold flex items-center justify-between pt-1 bg-emerald-50/60 border border-emerald-200 px-3 py-2 rounded-xl">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon "{appliedCoupon.code}" active ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% OFF` : `₹${appliedCoupon.discountValue} OFF`})</span>
                  </span>
                </div>
              )}
            </form>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 sm:py-4 bg-[#103b1d] hover:bg-[#0c2d16] text-white font-urbanist font-extrabold text-base rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99] text-center flex items-center justify-center gap-2 tracking-wide"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      ) : (
        /* Empty Cart State */
        <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-urbanist text-[#103b1d]">Your Cart is Currently Empty</h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
            Explore our aged organic basmati rice, cold pressed ghani oils, stone ground spices, and unrefined jaggery.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => setCurrentPage('shop')}
              className="px-6 py-3 bg-[#103b1d] hover:bg-[#18542a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Browse Farm Harvest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
