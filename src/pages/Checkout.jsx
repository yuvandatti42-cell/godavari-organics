import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { initiateRazorpayPayment, loadRazorpayScript } from '../services/razorpayService';

export default function Checkout() {
  const { 
    cartItems, 
    cartTotal, 
    clearCart,
    setCurrentPage, 
    goBack,
    showToast,
    user,
    setAuthModalOpen,
    placeOrder,
    cartSubtotal,
    shippingFee,
    freeShippingThreshold = 1000,
    isFreeShipping = false,
    appliedCoupon,
    discountAmount,
    storeSettings
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preload Razorpay checkout script in background
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: true
  });

  // Keep user fields in sync if user logs in while on checkout
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // If user is not logged in, require login before checkout/payment
  if (!user || !user.isLoggedIn) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-16 text-center space-y-6 bg-white min-h-[70vh] flex flex-col justify-center items-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-[#e8f0eb] text-[#18542a] flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="font-urbanist font-extrabold text-2xl text-[#103b1d]">Login Required for Checkout</h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Please sign in with your phone or email to access saved delivery addresses and secure online payments via Razorpay.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-3.5 bg-[#18542a] hover:bg-[#124020] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Login / Register to Continue</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('cart')}
            className="w-full py-2.5 text-xs text-gray-600 hover:text-black font-semibold cursor-pointer"
          >
            ← Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const displayItems = cartItems;
  const finalPayableTotal = cartTotal;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      showToast("Your cart is empty. Please add products to check out.");
      setCurrentPage('shop');
      return;
    }

    if (!formData.fullName.trim()) {
      showToast("Please enter your full name");
      return;
    }
    if (!formData.phone.trim()) {
      showToast("Please enter your phone number");
      return;
    }
    if (!formData.address1.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      showToast("Please complete your delivery address");
      return;
    }

    setIsSubmitting(true);
    const orderItems = cartItems.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      unit: item.selectedSize || item.weight || "1 unit",
      imageUrl: item.image
    }));

    const orderPayload = {
      id: "GOF-" + Math.floor(100000 + Math.random() * 900000),
      customerName: formData.fullName.trim(),
      customerPhone: formData.phone.trim(),
      customerEmail: formData.email.trim() || (formData.phone.trim() + "@customer.godavariorganics.com"),
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryCharge: shippingFee || 0,
      discount: discountAmount || 0,
      couponCode: appliedCoupon?.code || null,
      total: finalPayableTotal,
      paymentMethod: "Razorpay (Online)",
      shippingAddress: {
        street: (formData.address1 + " " + (formData.address2 || "")).trim(),
        city: formData.city.trim(),
        state: formData.state.trim() || "Andhra Pradesh",
        pincode: formData.pincode.trim()
      }
    };

    // Directly launch official Razorpay Checkout Gateway
    try {
      const activeRazorpayKey = storeSettings?.payment?.razorpayKeyId || 'rzp_live_TxEroHWhWBTnwr';
      const merchantTitle = storeSettings?.payment?.merchantName || 'Godavari Organic Foods';

      await initiateRazorpayPayment({
        orderPayload,
        preferredMethod: 'upi',
        razorpayKeyId: activeRazorpayKey,
        merchantName: merchantTitle,
        onSuccess: async (rzpRes) => {
          try {
            const finalOrder = {
              ...orderPayload,
              paymentId: rzpRes.paymentId,
              razorpayOrderId: rzpRes.orderId || null,
              paymentStatus: 'Paid',
              paymentMethod: rzpRes.method || 'Razorpay (Online)'
            };
            await placeOrder(finalOrder);
            showToast(`Payment successful! Order #${orderPayload.id} confirmed.`);
            setTimeout(() => {
              setCurrentPage("order-success");
            }, 500);
          } catch (pErr) {
            console.error("Order sync error post payment:", pErr);
            showToast(`Order #${orderPayload.id} placed successfully!`);
            setCurrentPage("order-success");
          } finally {
            setIsSubmitting(false);
          }
        },
        onFailure: (errMsg) => {
          setIsSubmitting(false);
          showToast(errMsg || "Payment was not completed. Please try again.");
        },
        onDismiss: () => {
          setIsSubmitting(false);
          showToast("Payment window closed. Please complete payment to confirm your order.");
        }
      });
    } catch (err) {
      console.error("Razorpay initiation error:", err);
      setIsSubmitting(false);
      showToast("Unable to start payment gateway. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 md:py-6 font-sans text-slate-900 bg-white min-h-screen">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goBack()}
            className="p-1 text-gray-500 hover:text-black rounded-lg cursor-pointer"
            aria-label="Back to Cart"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg sm:text-xl text-[#103b1d] tracking-tight">
            Checkout
          </h1>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-[#18542a] font-bold text-xs rounded-full border border-emerald-200">
          Secure Razorpay Payment
        </span>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-5">
        
        {/* Section 1: Customer Details */}
        <section className="space-y-3">
          <h2 className="font-bold text-sm sm:text-base text-slate-900">
            Customer Details
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="space-y-1">
              <label htmlFor="checkout-fullName" className="font-bold text-slate-800 block text-xs">Full Name</label>
              <input 
                type="text" 
                id="checkout-fullName"
                name="fullName"
                autoComplete="name"
                placeholder="e.g. Anand Varma"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="checkout-phone" className="font-bold text-slate-800 block text-xs">Phone Number (Required for Delivery & SMS)</label>
              <input 
                type="tel" 
                id="checkout-phone"
                name="phone"
                autoComplete="tel"
                placeholder="e.g. 9848022338"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="checkout-email" className="font-bold text-slate-800 block text-xs">Email Address (Optional for Invoice)</label>
              <input 
                type="email" 
                id="checkout-email"
                name="email"
                autoComplete="email"
                placeholder="e.g. anand@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-4" />

        {/* Section 2: Delivery Address */}
        <section className="space-y-3">
          <h2 className="font-bold text-sm sm:text-base text-slate-900">
            Delivery Address
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="space-y-1">
              <label htmlFor="checkout-address1" className="font-bold text-slate-800 block text-xs">Address Line 1</label>
              <input 
                type="text" 
                id="checkout-address1"
                name="address1"
                autoComplete="address-line1"
                placeholder="House / Flat No., Building Name"
                value={formData.address1}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="checkout-address2" className="font-bold text-slate-800 block text-xs">Address Line 2</label>
              <input 
                type="text" 
                id="checkout-address2"
                name="address2"
                autoComplete="address-line2"
                placeholder="Street Name, Area, Landmark"
                value={formData.address2}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="checkout-city" className="font-bold text-slate-800 block text-xs">City</label>
                <input 
                  type="text" 
                  id="checkout-city"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="e.g. Rajahmundry"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="checkout-pincode" className="font-bold text-slate-800 block text-xs">PIN Code</label>
                <input 
                  type="text" 
                  id="checkout-pincode"
                  name="pincode"
                  autoComplete="postal-code"
                  placeholder="e.g. 533101"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="checkout-state" className="font-bold text-slate-800 block text-xs">State</label>
              <input 
                type="text" 
                id="checkout-state"
                name="state"
                autoComplete="address-level1"
                placeholder="Andhra Pradesh / Telangana"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input 
                type="checkbox" 
                id="saveAddress"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <label htmlFor="saveAddress" className="text-xs font-medium text-gray-600 cursor-pointer select-none">
                Save this address for future orders
              </label>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-4" />

        {/* Section 3: Items & Price Breakdown */}
        <section className="space-y-3">
          <h2 className="font-bold text-sm sm:text-base text-slate-900">
            Order & Price Summary
          </h2>

          <div className="space-y-2 text-xs sm:text-sm font-medium">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.selectedSize || ''}`} className="flex justify-between items-center text-slate-800">
                <span className="truncate pr-2">
                  {index + 1}. {item.name} ({item.selectedSize || item.weight}{item.quantity > 1 ? ` × ${item.quantity}` : ''})
                </span>
                <span className="font-bold text-slate-900 shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs text-gray-600 font-medium">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-bold text-slate-900">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            {appliedCoupon && discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount ({appliedCoupon.code})</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#103b1d] pt-2 border-t border-gray-200">
              <span>Final Total to Pay</span>
              <span>₹{finalPayableTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-4" />

        {/* Section 4: Payment Method (Razorpay Online Only) */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <h2 className="font-bold text-sm sm:text-base text-slate-900">
              Payment Method
            </h2>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#18542a] bg-[#e8f5ec] px-2.5 py-1 rounded-full border border-[#a3d9b1] w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#18542a]" />
              <span>Razorpay Secured Gateway</span>
            </div>
          </div>

          {/* Single Razorpay Online Payment Option */}
          <div className="p-4 rounded-xl border-2 border-[#18542a] bg-[#f8faf8] shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3.5 text-slate-900">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#18542a] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="block font-bold text-sm text-[#103b1d]">Razorpay Online Payment</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#18542a] text-white">Secure</span>
                </div>
                <span className="text-[11px] text-gray-500 block mt-0.5">UPI (GPay / PhonePe / Paytm / QR), Debit/Credit Cards & Net Banking</span>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-[#18542a] flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#18542a]"></div>
            </div>
          </div>
        </section>

        {/* Action Button & Security Guarantee */}
        <div className="pt-2 space-y-2.5">
          <button
            type="submit"
            disabled={isSubmitting} 
            className="w-full py-4 bg-[#18542a] hover:bg-[#124020] disabled:bg-gray-400 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Opening Razorpay Gateway...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Pay ₹{finalPayableTotal.toLocaleString("en-IN")} via Razorpay</span>
              </span>
            )}
          </button>

          <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-[#18542a]" />
            <span>100% Encrypted • Powered by Razorpay & RBI Regulations</span>
          </p>
        </div>

      </form>
    </div>
  );
}
