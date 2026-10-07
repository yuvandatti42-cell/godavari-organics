import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Smartphone, CreditCard, Landmark, Truck } from 'lucide-react';

export default function Checkout() {
  const { 
    cartItems, 
    cartTotal, 
    clearCart,
    setCurrentPage, 
    goBack,
    showToast 
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    showToast('Order placed successfully!');
    setTimeout(() => {
      clearCart();
      setCurrentPage('order-success');
    }, 800);
  };

  // Demo fallback items matching mockup if cart is empty
  const displayItems = cartItems.length > 0 ? cartItems : [
    { id: 1, name: 'Organic Basmati Rice', selectedSize: '500g', quantity: 1, price: 299 },
    { id: 2, name: 'Turmeric Powder', selectedSize: '200g', quantity: 2, price: 298 },
    { id: 3, name: 'Cold Pressed Oil', selectedSize: '1L', quantity: 1, price: 499 }
  ];

  const finalDisplayTotal = cartItems.length > 0 
    ? cartTotal 
    : displayItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 md:py-6 font-sans text-slate-900 bg-white min-h-screen">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={goBack}
            className="p-1 text-slate-800 hover:text-slate-950 cursor-pointer transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-800" />
          </button>
          <h1 className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
            Checkout
          </h1>
        </div>

        <span className="px-3 py-1 bg-gray-100 text-gray-700 font-medium text-xs rounded-full">
          Step 1 of 3
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
              <label className="font-bold text-slate-800 block text-xs">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                placeholder="e.g. Anand Kumar"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block text-xs">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block text-xs">Email Address</label>
              <input 
                type="email" 
                name="email"
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
              <label className="font-bold text-slate-800 block text-xs">Address Line 1</label>
              <input 
                type="text" 
                name="address1"
                placeholder="House / Flat No., Building Name"
                value={formData.address1}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block text-xs">Address Line 2</label>
              <input 
                type="text" 
                name="address2"
                placeholder="Street Name, Area, Landmark"
                value={formData.address2}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block text-xs">City</label>
                <input 
                  type="text" 
                  name="city"
                  placeholder="City Name"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block text-xs">State</label>
                <input 
                  type="text" 
                  name="state"
                  placeholder="Select State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-slate-800 text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block text-xs">PIN Code</label>
              <input 
                type="text" 
                name="pincode"
                placeholder="6-digit PIN code"
                value={formData.pincode}
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

        {/* Section 3: Items Summary */}
        <section className="space-y-3">
          <h2 className="font-bold text-sm sm:text-base text-slate-900">
            Items Summary
          </h2>

          <div className="space-y-2 text-xs sm:text-sm font-medium">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center text-slate-800">
                  <span className="truncate pr-2">
                    {index + 1}. {item.name} ({item.selectedSize}{item.quantity > 1 ? ` x ${item.quantity}` : ''})
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between items-center text-slate-800">
                  <span>1. Organic Basmati Rice (500g)</span>
                  <span className="font-bold text-slate-900">₹299</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span>2. Turmeric Powder (200g x 2)</span>
                  <span className="font-bold text-slate-900">₹298</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span>3. Cold Pressed Oil (1L)</span>
                  <span className="font-bold text-slate-900">₹499</span>
                </div>
              </>
            )}
          </div>
        </section>

        <hr className="border-gray-200 my-4" />

        {/* Section 4: Payment Method */}
        <section className="space-y-3">
          <h2 className="font-bold text-sm sm:text-base text-slate-900">
            Payment Method
          </h2>

          <div className="space-y-2.5 text-xs sm:text-sm font-semibold">
            {/* UPI */}
            <label 
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'upi' 
                  ? 'border-2 border-slate-900 bg-white' 
                  : 'border border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 text-slate-900">
                <Smartphone className="w-5 h-5 text-slate-700" />
                <span>UPI (GPay, PhonePe, Paytm)</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                paymentMethod === 'upi' ? 'border-slate-900' : 'border-gray-300'
              }`}>
                {paymentMethod === 'upi' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                )}
              </div>
            </label>

            {/* Credit / Debit Card */}
            <label 
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'card' 
                  ? 'border-2 border-slate-900 bg-white' 
                  : 'border border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 text-slate-900">
                <CreditCard className="w-5 h-5 text-slate-700" />
                <span>Credit / Debit Card</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                paymentMethod === 'card' ? 'border-slate-900' : 'border-gray-300'
              }`}>
                {paymentMethod === 'card' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                )}
              </div>
            </label>

            {/* Net Banking */}
            <label 
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'netbanking' 
                  ? 'border-2 border-slate-900 bg-white' 
                  : 'border border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 text-slate-900">
                <Landmark className="w-5 h-5 text-slate-700" />
                <span>Net Banking</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                paymentMethod === 'netbanking' ? 'border-slate-900' : 'border-gray-300'
              }`}>
                {paymentMethod === 'netbanking' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                )}
              </div>
            </label>

            {/* Cash on Delivery */}
            <label 
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'cod' 
                  ? 'border-2 border-slate-900 bg-white' 
                  : 'border border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 text-slate-900">
                <Truck className="w-5 h-5 text-slate-700" />
                <span>Cash on Delivery</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                paymentMethod === 'cod' ? 'border-slate-900' : 'border-gray-300'
              }`}>
                {paymentMethod === 'cod' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                )}
              </div>
            </label>
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 bg-[#0f172a] hover:bg-[#020617] text-white text-sm sm:text-base font-bold rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer text-center"
          >
            Place Order — ₹{finalDisplayTotal.toLocaleString('en-IN')}
          </button>
        </div>

      </form>
    </div>
  );
}
