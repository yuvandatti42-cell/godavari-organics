import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { getOrderForTracking } from '../services/firebaseService';
import SEO from '../components/SEO';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  MessageCircle,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function TrackOrder() {
  const { trackingQuery, setTrackingQuery, setCurrentPage, lastOrder, showToast } = useCart();

  const [inputQuery, setInputQuery] = useState(trackingQuery || lastOrder?.id || '');
  const [order, setOrder] = useState(null);
  const [liveTracking, setLiveTracking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedAwb, setCopiedAwb] = useState(false);

  // Perform order search
  const handleSearch = useCallback(async (queryToSearch) => {
    const q = (queryToSearch || inputQuery || '').trim();
    if (!q) {
      setErrorMessage('Please enter an Order ID (e.g. GOF-123456), AWB tracking number, or mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setHasSearched(true);

    try {
      // 1. Fetch order from Firestore
      const foundOrder = await getOrderForTracking(q);
      
      if (!foundOrder) {
        setOrder(null);
        setLiveTracking(null);
        setErrorMessage(`No matching order found for "${q}". Please double-check your Order ID or phone number.`);
        setIsLoading(false);
        return;
      }

      setOrder(foundOrder);
      if (setTrackingQuery) {
        setTrackingQuery(foundOrder.id);
      }

      // 2. Fetch live Shiprocket scans if available
      try {
        const res = await fetch(`/api/track-order?q=${encodeURIComponent(foundOrder.shiprocketAwb || foundOrder.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.liveTracking) {
            setLiveTracking(data.liveTracking);
          }
        }
      } catch (e) {
        // Non-blocking
      }
    } catch (err) {
      console.error('Order tracking error:', err);
      setErrorMessage('Could not load tracking information. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, [inputQuery, setTrackingQuery]);

  // Auto-search if trackingQuery was provided in context or URL
  useEffect(() => {
    if (trackingQuery) {
      setInputQuery(trackingQuery);
      handleSearch(trackingQuery);
    } else if (lastOrder?.id) {
      setInputQuery(lastOrder.id);
      handleSearch(lastOrder.id);
    }
  }, [trackingQuery, lastOrder, handleSearch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputQuery);
  };

  const handleCopyAwb = (awbCode) => {
    if (!awbCode) return;
    navigator.clipboard.writeText(awbCode);
    setCopiedAwb(true);
    showToast('AWB tracking code copied to clipboard!');
    setTimeout(() => setCopiedAwb(false), 2500);
  };

  // Determine active milestone step (0: Placed, 1: Packed/Dispatched, 2: In Transit/Out for Delivery, 3: Delivered)
  const getProgressStep = (currentOrder) => {
    const status = (currentOrder?.shiprocketCurrentStatus || currentOrder?.orderStatus || '').toUpperCase();
    if (status.includes('DELIVER') && !status.includes('OUT')) return 3;
    if (status.includes('OUT') || status.includes('TRANSIT') || status.includes('SHIPPED') || status.includes('PICK')) return 2;
    if (currentOrder?.shiprocketOrderId || currentOrder?.shiprocketAwb || status.includes('PACK') || status.includes('CONFIRM')) return 1;
    return 0;
  };

  const activeStep = getProgressStep(order);

  const steps = [
    {
      title: 'Order Confirmed',
      desc: 'Verified & logged in organic dispatch queue',
      date: order?.date ? new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Confirmed'
    },
    {
      title: 'Packed & Assigned',
      desc: order?.shiprocketCourierName ? `Assigned to ${order.shiprocketCourierName}` : 'Handcrafted at Godavari farm warehouse',
      date: order?.shiprocketOrderId ? `Shiprocket ID #${order.shiprocketOrderId}` : 'Ready for Courier'
    },
    {
      title: 'In Transit',
      desc: order?.shiprocketAwb ? `AWB: ${order.shiprocketAwb}` : 'On the road via express partner network',
      date: order?.shiprocketCurrentStatus ? order.shiprocketCurrentStatus : 'Estimated 2 - 4 Days'
    },
    {
      title: 'Delivered',
      desc: 'Handed over fresh at your doorstep',
      date: activeStep === 3 ? 'Delivered' : 'Awaiting Delivery'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#faf5ea] font-sans text-[#1d271c] py-6 sm:py-10 px-3.5 sm:px-6 lg:px-8">
      <SEO 
        title={order ? `Tracking Order #${order.id}` : 'Track Your Package Live'}
        description="Track your Godavari Organic Foods package live with real-time Shiprocket dispatch updates, courier AWB tracking, and milestone stages."
        url="/#/track-order"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Track Order', url: '/#/track-order' }
        ]}
      />
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">

        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18542a] hover:text-[#103b1d] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Store</span>
          </button>

          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8c7355] bg-[#f3e8cc] px-3 py-1 rounded-full border border-[#d9ca9d]">
            Live Dispatch Tracking
          </span>
        </div>

        {/* Hero & Search Header */}
        <div className="bg-[#f3e8cc] rounded-3xl border border-[#d9ca9d] p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#9abc05]/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#18542a] text-[#ffc926] flex items-center justify-center mx-auto shadow-md">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-urbanist text-[#103b1d] tracking-tight">
              Track Your Harvest Package
            </h1>

            <p className="text-xs sm:text-sm text-[#556b54] leading-relaxed">
              Enter your <strong>Order ID</strong> (e.g. <code>GOF-123456</code>), <strong>Shiprocket AWB tracking number</strong>, or <strong>mobile number</strong> to view live courier status.
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleFormSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8c7355] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Enter Order ID (e.g. GOF-123456) or AWB #"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d9ca9d] bg-white text-xs sm:text-sm font-semibold text-[#103b1d] placeholder:text-[#8c7355]/70 focus:outline-none focus:ring-2 focus:ring-[#18542a] transition-all shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#18542a] hover:bg-[#103b1d] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#ffc926]" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 text-[#ffc926]" />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Pills if customer has recent order */}
            {lastOrder?.id && (
              <div className="pt-2 flex items-center justify-center gap-2 text-xs">
                <span className="text-[#8c7355] text-[11px]">Your Recent Order:</span>
                <button
                  type="button"
                  onClick={() => {
                    setInputQuery(lastOrder.id);
                    handleSearch(lastOrder.id);
                  }}
                  className="inline-flex items-center gap-1 font-mono font-bold text-[11px] text-[#18542a] bg-white px-2.5 py-1 rounded-lg border border-[#d9ca9d] hover:bg-[#18542a] hover:text-white transition-colors cursor-pointer"
                >
                  <span>#{lastOrder.id}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-900 shadow-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{errorMessage}</p>
              <p className="text-[11px] text-rose-700">
                Tip: You can find your Order ID in your order confirmation SMS, WhatsApp message, or under your Account Profile.
              </p>
            </div>
          </div>
        )}

        {/* MAIN ORDER TRACKING DISPLAY */}
        {order && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">

            {/* 1. Order Status Summary Bar */}
            <div className="bg-white rounded-3xl border border-[#dfd5bf] p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dfd5bf]/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-extrabold font-urbanist text-[#103b1d]">
                      Order #{order.id}
                    </span>
                    <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase border ${
                      activeStep === 3
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : activeStep === 2
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {order.orderStatus || 'Confirmed'}
                    </span>
                  </div>

                  <p className="text-xs text-[#8c7355] mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Placed on {order.date ? new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-[#8c7355] block">Total Amount</span>
                    <span className="text-lg font-extrabold text-[#18542a]">
                      ₹{(order.total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#faf5ea] text-[#18542a] border border-[#d9ca9d]">
                    {order.paymentMethod || 'Online'}
                  </span>
                </div>
              </div>

              {/* 2. Visual Progress Stepper */}
              <div className="pt-2 pb-4">
                {/* Horizontal Progress bar for sm+ screens */}
                <div className="relative">
                  <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-[#e6dec9] rounded-full z-0">
                    <div
                      className="h-full bg-[#18542a] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= activeStep;
                      const isCurrent = idx === activeStep;

                      return (
                        <div key={idx} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 sm:text-center">
                          {/* Step Circle Indicator */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-[#18542a] text-[#ffc926] shadow-md ring-4 ring-[#18542a]/15'
                              : 'bg-white border-2 border-[#d9ca9d] text-[#8c7355]'
                          } ${isCurrent ? 'scale-110' : ''}`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <span className="text-xs font-bold font-mono">{idx + 1}</span>
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="space-y-0.5">
                            <h4 className={`text-xs font-extrabold tracking-tight ${
                              isCompleted ? 'text-[#103b1d]' : 'text-[#8c7355]'
                            }`}>
                              {step.title}
                            </h4>
                            <p className="text-[11px] text-[#556b54] leading-tight max-w-[170px]">
                              {step.desc}
                            </p>
                            <span className="text-[10px] font-bold text-[#8c7355] block pt-0.5">
                              {step.date}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Courier Logistics & Tracking Information Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Courier Partner Info */}
              <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#18542a] font-bold text-xs">
                  <Truck className="w-4 h-4 text-[#18542a]" />
                  <span>Courier Logistics Partner</span>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-extrabold text-[#103b1d] block">
                    {order.shiprocketCourierName || 'Shiprocket Express Network'}
                  </span>
                  <p className="text-[11px] text-[#556b54]">
                    Official Partner: Delhivery, Blue Dart, DTDC, Shadowfax
                  </p>
                </div>

                {order.shiprocketAwb ? (
                  <div className="pt-2 border-t border-[#d9ca9d]/70 space-y-1.5">
                    <span className="text-[10.5px] text-[#8c7355] font-semibold block">
                      Live AWB Waybill Code:
                    </span>
                    <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-[#d9ca9d]">
                      <span className="font-mono font-bold text-xs text-[#103b1d] tracking-wider">
                        {order.shiprocketAwb}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyAwb(order.shiprocketAwb)}
                        className="text-[11px] font-bold text-[#18542a] hover:text-[#103b1d] flex items-center gap-1 cursor-pointer"
                        title="Copy tracking number"
                      >
                        {copiedAwb ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#d9ca9d]/70 text-[11px] text-[#556b54] italic">
                    Shipment order created in Shiprocket. AWB tracking code will update once picked up by courier.
                  </div>
                )}
              </div>

              {/* Origin & Destination Hubs */}
              <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#18542a] font-bold text-xs">
                  <MapPin className="w-4 h-4 text-[#18542a]" />
                  <span>Dispatch & Delivery Route</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#18542a] mt-1 shrink-0" />
                    <div>
                      <span className="text-[10.5px] text-[#8c7355] block">Farm Origin Hub:</span>
                      <strong className="text-[#103b1d] text-xs">
                        Godavari Organic Foods, Eluru / Rajahmundry, AP
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1 border-t border-[#d9ca9d]/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                    <div>
                      <span className="text-[10.5px] text-[#8c7355] block">Destination:</span>
                      <strong className="text-[#103b1d] text-xs">
                        {order.shippingAddress?.city || 'Customer City'}, {order.shippingAddress?.state || 'AP'} - {order.shippingAddress?.pincode || ''}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expected Delivery Date & Guarantee */}
              <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#18542a] font-bold text-xs">
                    <Clock className="w-4 h-4 text-[#18542a]" />
                    <span>Estimated Arrival</span>
                  </div>

                  <div className="pt-2">
                    <span className="text-xl font-extrabold font-urbanist text-[#18542a] block">
                      {activeStep === 3 ? 'Delivered' : '2 - 4 Business Days'}
                    </span>
                    <p className="text-[11px] text-[#556b54] mt-0.5 leading-snug">
                      Farm-fresh dispatch with eco-friendly corrugated protection.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#18542a] bg-white/70 px-2.5 py-1.5 rounded-xl border border-[#d9ca9d]">
                  <ShieldCheck className="w-4 h-4 text-[#9abc05] shrink-0" />
                  <span>100% Purity & Transit Insured</span>
                </div>
              </div>
            </div>

            {/* 4. Package Contents (What's in the Box) */}
            <div className="bg-white rounded-3xl border border-[#dfd5bf] p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#dfd5bf]/60 pb-3">
                <h3 className="font-urbanist font-extrabold text-base text-[#103b1d] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#18542a]" />
                  <span>Items in This Package ({order.items?.length || 0})</span>
                </h3>
                <span className="text-xs text-[#8c7355] font-semibold">
                  Fresh Harvest Batch
                </span>
              </div>

              <div className="divide-y divide-[#dfd5bf]/60">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName || item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-[#f3e8cc] border border-[#d9ca9d]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#f3e8cc] border border-[#d9ca9d] flex items-center justify-center text-[#18542a]">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-[#103b1d] text-xs sm:text-sm">
                            {item.productName || item.name}
                          </h4>
                          <span className="text-[11px] text-[#8c7355]">
                            Pack Size: {item.unit || '1 unit'} &bull; Qty: <strong>{item.quantity}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-[#103b1d] text-xs sm:text-sm block">
                          ₹{((item.unitPrice || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#8c7355]">
                          (₹{item.unitPrice || item.price} each)
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8c7355] py-2">Standard Organic Produce Bundle</p>
                )}
              </div>

              {/* Price summary */}
              <div className="pt-3 border-t border-[#dfd5bf] flex flex-wrap items-center justify-between text-xs text-[#556b54] gap-2">
                <span>Subtotal: ₹{(order.subtotal || order.total || 0).toLocaleString('en-IN')} | Delivery: {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge || 0}`}</span>
                <span className="font-extrabold text-[#18542a] text-sm">
                  Grand Total: ₹{(order.total || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 5. Activity Log & Timeline */}
            <div className="bg-white rounded-3xl border border-[#dfd5bf] p-5 sm:p-7 shadow-sm space-y-4">
              <h3 className="font-urbanist font-extrabold text-base text-[#103b1d] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#18542a]" />
                <span>Dispatch & Courier Activity Timeline</span>
              </h3>

              <div className="space-y-3 pt-1">
                {order.timeline && order.timeline.length > 0 ? (
                  order.timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs border-l-2 border-[#18542a] pl-3 py-1">
                      <div className="w-2 h-2 rounded-full bg-[#18542a] -ml-[17px] mt-1.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#103b1d] block">
                          {event.status}
                        </span>
                        <p className="text-[11px] text-[#556b54]">
                          {event.note || event.comment}
                        </p>
                        <span className="text-[10px] font-semibold text-[#8c7355]">
                          {event.timestamp ? new Date(event.timestamp).toLocaleString('en-IN') : 'Recent'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#8c7355]">
                    Order confirmed and dispatched to our Godavari farm warehouse. Further courier scan updates will appear here automatically.
                  </div>
                )}
              </div>
            </div>

            {/* 6. Help & Support Banner */}
            <div className="bg-[#FAF5EA] rounded-3xl border border-[#d9ca9d] p-6 text-center space-y-3">
              <h4 className="font-urbanist font-bold text-sm sm:text-base text-[#103b1d]">
                Need Help with Your Delivery?
              </h4>
              <p className="text-xs text-[#556b54] max-w-md mx-auto">
                Our farm customer care team in East Godavari is available Monday through Saturday (9:00 AM - 7:00 PM).
              </p>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/919010088063?text=Hi%20Godavari%20Organics,%20I%20would%20like%20an%20update%20on%20my%20order%20%23${order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 90100 88063)</span>
                </a>

                <a
                  href="tel:+919010088063"
                  className="px-5 py-2.5 bg-white hover:bg-[#f3e8cc] text-[#103b1d] font-bold text-xs rounded-xl border border-[#d9ca9d] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#18542a]" />
                  <span>Call Support</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* When not searched yet */}
        {!hasSearched && !order && (
          <div className="bg-white rounded-3xl border border-[#dfd5bf] p-8 text-center space-y-4 shadow-sm max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#f3e8cc] flex items-center justify-center mx-auto text-[#18542a]">
              <Sparkles className="w-6 h-6 text-[#9abc05]" />
            </div>

            <h3 className="font-urbanist font-extrabold text-base text-[#103b1d]">
              Live In-House Courier Tracking
            </h3>

            <p className="text-xs text-[#556b54] leading-relaxed">
              Track your organic grain, cold pressed oil, and millet packages with live milestone updates from Godavari farm dispatch to your doorstep.
            </p>

            <div className="text-[11px] text-[#8c7355] bg-[#faf5ea] p-4 rounded-xl border border-[#dfd5bf] text-left space-y-1">
              <strong className="text-[#103b1d] block">Where to find your tracking number:</strong>
              <ul className="list-disc list-inside space-y-0.5 text-[#556b54]">
                <li>Order confirmation email or SMS received post checkout</li>
                <li>Your customer Profile page under &ldquo;Recent Orders&rdquo;</li>
                <li>10-digit mobile number used during order checkout</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

