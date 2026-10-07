import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ArrowRight, ShoppingBag, PackageCheck, Printer, Leaf } from 'lucide-react';

export default function OrderConfirmation() {
  const { setCurrentPage, showToast } = useCart();

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans py-4">
      
      {/* Confirmation Box */}
      <div className="bg-[#f3e8cc] rounded-3xl border border-[#d9ca9d] p-8 md:p-10 text-center space-y-5 shadow-xl">
        
        <div className="w-16 h-16 bg-[#18542a] text-[#ffc926] rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 bg-[#e6dec9] text-[#18542a] text-xs font-bold px-3 py-1 rounded-full uppercase border border-[#c8b894]">
            <Leaf className="w-3.5 h-3.5" />
            <span>ORDER CONFIRMED & DISPATCHED</span>
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-[#103b1d]">
            Thank You for Shopping Organic!
          </h1>
          <p className="text-xs text-[#556b54] font-medium">
            Order Reference ID: <strong className="text-[#103b1d]">GO-2026-98421</strong>
          </p>
        </div>

        <p className="text-xs md:text-sm text-[#556b54] max-w-md mx-auto leading-relaxed">
          Your order of traditional Godavari organic harvest has been confirmed and assigned to our farm dispatch hub. A confirmation invoice receipt has been sent to your email.
        </p>

        {/* Order Details Grid in Beige */}
        <div className="bg-[#e6dec9] rounded-2xl border border-[#c8b894] p-5 text-left text-xs space-y-2.5 font-medium text-[#103b1d]">
          <div className="flex justify-between border-b border-[#c8b894]/60 pb-2">
            <span className="text-[#556b54]">Estimated Delivery:</span>
            <span className="font-bold text-[#103b1d]">Oct 02, 2026 (3-4 Days)</span>
          </div>

          <div className="flex justify-between border-b border-[#c8b894]/60 pb-2">
            <span className="text-[#556b54]">Delivery Address:</span>
            <span className="font-bold text-[#103b1d]">Rajahmundry, AP - 533101</span>
          </div>

          <div className="flex justify-between border-b border-[#c8b894]/60 pb-2">
            <span className="text-[#556b54]">Payment Status:</span>
            <span className="font-bold text-white bg-[#18542a] px-2.5 py-0.5 rounded-md">PAID VIA UPI</span>
          </div>

          <div className="flex justify-between pt-1 font-bold text-sm text-[#103b1d]">
            <span>Total Paid Amount:</span>
            <span>₹758</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-6 py-3 bg-[#18542a] hover:bg-[#103b1d] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#ffc926]" />
            <span>Continue Shopping</span>
          </button>

          <button
            onClick={() => showToast('Printing tax invoice receipt...')}
            className="px-5 py-3 bg-[#e6dec9] hover:bg-[#d9ca9d] text-[#103b1d] text-xs font-bold rounded-xl border border-[#c8b894] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#18542a]" />
            <span>Download Invoice Receipt</span>
          </button>
        </div>

      </div>

    </div>
  );
}

