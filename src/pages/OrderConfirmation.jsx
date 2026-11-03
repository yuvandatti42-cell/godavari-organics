import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ShoppingBag, Printer, Leaf, MapPin, CreditCard, Calendar } from 'lucide-react';

export default function OrderConfirmation() {
  const { setCurrentPage, showToast, lastOrder } = useCart();

  const orderId = lastOrder?.id || 'GO-2026-98421';
  const totalAmount = lastOrder?.total ? `₹${lastOrder.total.toLocaleString('en-IN')}` : '₹758';
  const paymentMethod = lastOrder?.paymentMethod || 'UPI / Google Pay';
  const addressStr = lastOrder?.shippingAddress
    ? `${lastOrder.shippingAddress.street ? lastOrder.shippingAddress.street + ', ' : ''}${lastOrder.shippingAddress.city || 'Rajahmundry'}, ${lastOrder.shippingAddress.state || 'AP'} - ${lastOrder.shippingAddress.pincode || '533101'}`
    : 'Rajahmundry, AP - 533101';

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans py-4 px-4">
      
      {/* Confirmation Box */}
      <div className="bg-[#f3e8cc] rounded-3xl border border-[#d9ca9d] p-8 md:p-10 text-center space-y-5 shadow-xl">
        
        <div className="w-16 h-16 bg-[#18542a] text-[#ffc926] rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
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
            Order Reference ID: <strong className="text-[#103b1d] font-mono">{orderId}</strong>
          </p>
        </div>

        <p className="text-xs md:text-sm text-[#556b54] max-w-md mx-auto leading-relaxed">
          Your order of traditional Godavari organic harvest has been confirmed, logged in Firebase cloud, and assigned to our farm dispatch hub.
        </p>

        {/* Order Details Grid in Beige */}
        <div className="bg-[#e6dec9] rounded-2xl border border-[#c8b894] p-5 text-left text-xs space-y-3 font-medium text-[#103b1d]">
          <div className="flex justify-between items-center border-b border-[#c8b894]/60 pb-2">
            <span className="text-[#556b54] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Estimated Delivery:</span>
            </span>
            <span className="font-bold text-[#103b1d]">3 - 4 Days (Express Farm Dispatch)</span>
          </div>

          <div className="flex justify-between items-start border-b border-[#c8b894]/60 pb-2">
            <span className="text-[#556b54] flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5" />
              <span>Delivery Address:</span>
            </span>
            <span className="font-bold text-[#103b1d] text-right truncate max-w-[260px]">
              {addressStr}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-[#c8b894]/60 pb-2">
            <span className="text-[#556b54] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment Mode:</span>
            </span>
            <span className="font-bold text-white bg-[#18542a] px-2.5 py-0.5 rounded-md text-[11px]">
              {paymentMethod.toUpperCase()}
            </span>
          </div>

          {lastOrder?.paymentId && (
            <div className="flex justify-between items-center border-b border-[#c8b894]/60 pb-2">
              <span className="text-[#556b54] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18542a]" />
                <span>Razorpay Txn ID:</span>
              </span>
              <span className="font-mono font-bold text-[#103b1d] text-[11px] bg-[#d9ca9d]/50 px-2 py-0.5 rounded">
                {lastOrder.paymentId}
              </span>
            </div>
          )}

          {lastOrder?.items && lastOrder.items.length > 0 && (
            <div className="border-b border-[#c8b894]/60 pb-2 space-y-1">
              <span className="text-[#556b54] block text-[11px]">Items Ordered:</span>
              {lastOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[11px] text-[#103b1d]">
                  <span className="truncate pr-2">{it.productName} ({it.unit}) x {it.quantity}</span>
                  <span className="font-bold shrink-0">₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-1 font-bold text-sm text-[#103b1d]">
            <span>Total Paid Amount:</span>
            <span className="text-base text-[#18542a]">{totalAmount}</span>
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
