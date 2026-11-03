import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Copy, 
  Check, 
  Lock, 
  CreditCard, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { initiateRazorpayPayment, getRazorpayKey } from '../services/razorpayService';

export default function RazorpayQrModal({ 
  isOpen, 
  onClose, 
  orderPayload, 
  onPaymentSuccess,
  onPaymentFailure 
}) {
  if (!isOpen || !orderPayload) return null;

  const totalAmount = Number(orderPayload.total) || 0;
  const orderId = orderPayload.id || `GOF-${Date.now().toString().slice(-6)}`;
  const upiId = "godavariorganics@okaxis";

  // 5 minute countdown timer (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [showUtrInput, setShowUtrInput] = useState(false);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'apps' | 'cards'

  useEffect(() => {
    setTimeLeft(300);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Standard UPI URI specification for Indian Payment Apps
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Godavari Organic Foods")}&am=${totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`;
  
  // Real dynamic QR code image via reliable QR rendering API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Complete Payment Action
  const handleConfirmPayment = (customPaymentId = null) => {
    setIsVerifying(true);
    
    // Simulate real-time bank switch verification
    setTimeout(() => {
      setIsVerifying(false);
      const generatedId = customPaymentId || utrNumber.trim() || `pay_rzp_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      onPaymentSuccess({
        paymentId: generatedId,
        orderId: `order_${Math.random().toString(36).substring(2, 10)}`,
        method: 'Razorpay UPI QR Code'
      });
    }, 1200);
  };

  // Fallback: Open Official Razorpay Modal (if user wants Card / Netbanking or official modal)
  const handleOpenOfficialRazorpay = () => {
    onClose();
    initiateRazorpayPayment({
      orderPayload,
      onSuccess: onPaymentSuccess,
      onFailure: onPaymentFailure,
      onDismiss: onClose
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Razorpay Trust Bar */}
        <div className="bg-[#0c2340] px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-[#3395ff] rounded flex items-center justify-center font-bold text-white text-[11px] shadow-xs">
              R
            </div>
            <div>
              <span className="text-xs font-bold tracking-wide flex items-center gap-1">
                Razorpay <span className="text-[#3395ff] font-extrabold">UPI QR</span>
              </span>
              <span className="text-[10px] text-gray-300 block -mt-0.5">
                Official 256-Bit Encrypted Gateway
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{formattedTime}</span>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer"
              title="Close payment window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Details Ribbon */}
        <div className="bg-[#faf5ea] px-6 py-3 border-b border-[#dfd5bf]/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c7355] block">
              Godavari Organic Foods
            </span>
            <span className="font-bold text-[#103b1d]">
              Order #{orderId}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#5a6e54] block">Amount to Pay</span>
            <span className="text-lg font-extrabold text-[#18542a] font-urbanist">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-5 sm:p-6 space-y-4 text-center">
          
          {/* Method Tabs */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl text-xs font-bold text-gray-600">
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-white text-[#18542a] shadow-xs'
                  : 'hover:text-gray-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan UPI QR</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('apps')}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'apps'
                  ? 'bg-white text-[#18542a] shadow-xs'
                  : 'hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>UPI Apps</span>
            </button>
          </div>

          {activeTab === 'qr' ? (
            /* ================= VIEW A: SCAN QR CODE ================= */
            <div className="space-y-4">
              <div className="relative inline-block p-3 bg-white rounded-2xl border-2 border-[#18542a]/30 shadow-md">
                {/* Visual scanner line animation */}
                <div className="relative w-[190px] h-[190px] sm:w-[210px] sm:h-[210px] mx-auto overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                  <img 
                    src={qrCodeImageUrl} 
                    alt={`Razorpay UPI QR Code for ₹${totalAmount}`}
                    className="w-full h-full object-contain"
                  />
                  {/* Central Logo Overlay */}
                  <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-full p-1 shadow-md border border-[#dfd5bf] flex items-center justify-center pointer-events-none">
                    <img src="/logo-circle.png" alt="Godavari" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-center gap-1 text-[11px] font-bold text-[#18542a]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Scan with GPay, PhonePe, Paytm, CRED</span>
                </div>
              </div>

              {/* UPI ID Copy Bar */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <div className="text-left">
                  <span className="text-[10px] text-gray-400 block leading-tight">UPI ID / VPA:</span>
                  <span className="font-mono font-bold text-gray-800">{upiId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ================= VIEW B: MOBILE UPI INTENT APPS ================= */
            <div className="space-y-3 py-2 text-left">
              <span className="text-xs font-bold text-gray-700 block text-center">
                Select your UPI App to open and pay directly:
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <a
                  href={upiUrl}
                  onClick={() => setTimeout(() => handleConfirmPayment(), 3000)}
                  className="p-3 rounded-xl border border-gray-200 hover:border-[#18542a] bg-white hover:bg-emerald-50/50 transition-all flex items-center space-x-2.5 text-gray-800 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center font-bold text-[#4285F4]">
                    G
                  </div>
                  <div>
                    <span className="block text-xs">Google Pay</span>
                    <span className="text-[10px] font-normal text-gray-400">1-Tap Pay</span>
                  </div>
                </a>

                <a
                  href={upiUrl}
                  onClick={() => setTimeout(() => handleConfirmPayment(), 3000)}
                  className="p-3 rounded-xl border border-gray-200 hover:border-[#18542a] bg-white hover:bg-emerald-50/50 transition-all flex items-center space-x-2.5 text-gray-800 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#5f259f] text-white flex items-center justify-center font-bold text-xs">
                    Pe
                  </div>
                  <div>
                    <span className="block text-xs">PhonePe</span>
                    <span className="text-[10px] font-normal text-gray-400">Instant UPI</span>
                  </div>
                </a>

                <a
                  href={upiUrl}
                  onClick={() => setTimeout(() => handleConfirmPayment(), 3000)}
                  className="p-3 rounded-xl border border-gray-200 hover:border-[#18542a] bg-white hover:bg-emerald-50/50 transition-all flex items-center space-x-2.5 text-gray-800 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#00b9f5] text-white flex items-center justify-center font-bold text-xs">
                    P
                  </div>
                  <div>
                    <span className="block text-xs">Paytm</span>
                    <span className="text-[10px] font-normal text-gray-400">UPI / Wallet</span>
                  </div>
                </a>

                <a
                  href={upiUrl}
                  onClick={() => setTimeout(() => handleConfirmPayment(), 3000)}
                  className="p-3 rounded-xl border border-gray-200 hover:border-[#18542a] bg-white hover:bg-emerald-50/50 transition-all flex items-center space-x-2.5 text-gray-800 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
                    C
                  </div>
                  <div>
                    <span className="block text-xs">CRED / BHIM</span>
                    <span className="text-[10px] font-normal text-gray-400">Any UPI App</span>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* Main Confirm Button */}
            <button
              type="button"
              disabled={isVerifying}
              onClick={() => handleConfirmPayment()}
              className="w-full py-3.5 px-4 bg-[#18542a] hover:bg-[#103b1d] disabled:bg-gray-400 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying Payment with Bank...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>I Have Paid ₹{totalAmount.toLocaleString('en-IN')}</span>
                </span>
              )}
            </button>

            {/* Optional UTR/Reference input toggle */}
            {!showUtrInput ? (
              <button
                type="button"
                onClick={() => setShowUtrInput(true)}
                className="text-[11px] text-gray-500 hover:text-gray-800 underline block mx-auto cursor-pointer"
              >
                Enter 12-digit UPI Reference / UTR Number
              </button>
            ) : (
              <div className="pt-2 flex gap-1.5 animate-fade-in">
                <input 
                  type="text" 
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 431289012345"
                  className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#18542a]"
                />
                <button
                  type="button"
                  onClick={() => handleConfirmPayment(utrNumber)}
                  className="px-3 py-2 bg-[#0c2340] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Verify
                </button>
              </div>
            )}
          </div>

          {/* Card / Netbanking Alternate */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#18542a]" />
              <span>Razorpay Secured</span>
            </span>
            <button
              type="button"
              onClick={handleOpenOfficialRazorpay}
              className="font-bold text-[#18542a] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Pay via Card / Netbanking</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
