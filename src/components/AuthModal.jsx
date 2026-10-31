import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  ShoppingBag,
  KeyRound
} from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, user, loginUser, logoutUser, showToast, cartCount, setCurrentPage } = useCart();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' | 'email'
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  if (!authModalOpen) return null;

  // Dismiss modal and remember choice for the current browser session
  const handleClose = () => {
    try {
      sessionStorage.setItem('godavari_auth_dismissed', 'true');
    } catch (e) {
      console.error(e);
    }
    setAuthModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (!fullName.trim()) {
        showToast('Please enter your full name');
        return;
      }
      const newUser = {
        name: fullName.trim(),
        phone: identifier.trim(),
        email: identifier.includes('@') ? identifier.trim() : '',
        isLoggedIn: true,
        memberSince: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      };
      loginUser(newUser);
      showToast(`Welcome to Godavari Organic Foods, ${newUser.name}!`);
    } else {
      if (!identifier.trim()) {
        showToast('Please enter your mobile number or email');
        return;
      }
      const existingName = identifier.includes('@') 
        ? identifier.split('@')[0] 
        : 'Customer';
      
      const loggedUser = {
        name: existingName.charAt(0).toUpperCase() + existingName.slice(1),
        phone: !identifier.includes('@') ? identifier.trim() : '+91 90100 88063',
        email: identifier.includes('@') ? identifier.trim() : 'customer@godavariorganics.com',
        isLoggedIn: true,
        memberSince: 'Oct 2026'
      };
      loginUser(loggedUser);
      showToast(`Welcome back, ${loggedUser.name}!`);
    }
  };

  // Instant 1-Click Fast Login for easy testing
  const handleQuickDemoLogin = () => {
    const demoUser = {
      name: 'Yuvan',
      phone: '+91 90100 88063',
      email: 'yuvan@godavariorganics.com',
      isLoggedIn: true,
      memberSince: 'Oct 2026'
    };
    loginUser(demoUser);
    showToast('Signed in successfully as Yuvan!');
  };

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      showToast('Please enter your mobile number first');
      return;
    }
    setOtpSent(true);
    showToast('OTP sent to ' + identifier + ' (Use 1234)');
    setOtp('1234');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-[440px] bg-[#faf5ea] rounded-3xl shadow-2xl border-2 border-[#d9ca9d] relative overflow-hidden transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button (Circular matching reference buttons) */}
        <button 
          onClick={handleClose}
          aria-label="Close Login Modal"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 rounded-full border border-[#d9ca9d] bg-white/90 hover:bg-[#18542a] text-[#18542a] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs active:scale-95 z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* VIEW A: IF CUSTOMER IS ALREADY LOGGED IN                      */}
        {/* ------------------------------------------------------------- */}
        {user ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            {/* Header & Logo */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#d9ca9d] shadow-xs p-2 flex items-center justify-center mb-3">
                <img 
                  src="/logo.png" 
                  alt="Godavari Organic Foods" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#8c7355] font-urbanist">
                Godavari Organic Foods
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#103b1d] font-normal tracking-tight mt-1">
                My Customer Account
              </h3>
            </div>

            {/* Profile Card */}
            <div className="bg-[#f3e8cc]/80 rounded-2xl p-4 sm:p-5 border border-[#d9ca9d] text-left space-y-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-[#18542a] text-white flex items-center justify-center text-lg font-black font-urbanist shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-urbanist font-extrabold text-sm sm:text-base text-[#103b1d] truncate">
                    {user.name}
                  </h4>
                  <p className="text-xs text-[#556b54] truncate">
                    {user.phone || user.email || 'Verified Customer'}
                  </p>
                </div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#18542a]/10 border border-[#18542a]/30 rounded-full text-[10px] font-bold text-[#18542a]">
                  <Sparkles className="w-3 h-3 text-[#9abc05]" />
                  <span>Member</span>
                </span>
              </div>

              <div className="pt-2 border-t border-[#d9ca9d]/50 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/70 rounded-xl p-2.5 border border-[#d9ca9d]/50">
                  <span className="text-[10px] font-bold text-[#8c7355] block">Farm Orders</span>
                  <span className="font-extrabold text-[#103b1d] text-sm">Active Member</span>
                </div>
                <div className="bg-white/70 rounded-xl p-2.5 border border-[#d9ca9d]/50">
                  <span className="text-[10px] font-bold text-[#8c7355] block">Special Perk</span>
                  <span className="font-extrabold text-[#18542a] text-sm">10% OFF Active</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  setAuthModalOpen(false);
                  setCurrentPage('shop');
                }}
                className="w-full py-3 bg-[#18542a] hover:bg-[#103b1d] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {cartCount > 0 && (
                <button
                  onClick={() => {
                    setAuthModalOpen(false);
                    setCurrentPage('cart');
                  }}
                  className="w-full py-2.5 bg-white hover:bg-amber-50 text-[#18542a] border border-[#18542a]/30 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View My Cart ({cartCount} items)</span>
                </button>
              )}

              <button
                onClick={logoutUser}
                className="w-full py-2.5 text-xs text-red-700 hover:text-red-800 font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer pt-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW B: CUSTOMER LOGIN & SIGN-UP INTERFACE                    */
          /* ------------------------------------------------------------- */
          <div>
            {/* Modal Header with Official Logo */}
            <div className="pt-6 sm:pt-7 pb-2 px-6 sm:px-8 text-center flex flex-col items-center">
              
              {/* Logo Frame matching website aesthetic */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white border border-[#d9ca9d] shadow-xs p-2 flex items-center justify-center mb-2.5">
                <img 
                  src="/logo.png" 
                  alt="Godavari Organic Foods" 
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#8c7355] font-urbanist">
                Godavari Organic Foods
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#103b1d] font-normal tracking-tight mt-0.5">
                {isSignUp ? 'Create Free Account' : 'Customer Sign In'}
              </h2>

              <p className="text-xs text-[#556b54] font-medium leading-relaxed mt-1 max-w-xs">
                {isSignUp 
                  ? 'Join 10,000+ families enjoying authentic wooden-pressed oils & farm-direct harvests.'
                  : 'Log in to track orders, access farm-direct pricing & faster checkout.'
                }
              </p>
            </div>

            {/* Toggle Tabs: Sign In / New Customer */}
            <div className="px-6 sm:px-8 pt-2">
              <div className="grid grid-cols-2 p-1 bg-[#ede4ce] rounded-xl border border-[#d9ca9d]/70 text-xs font-bold font-urbanist">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setIsOtpMode(false);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    !isSignUp 
                      ? 'bg-[#18542a] text-white shadow-xs' 
                      : 'text-[#18542a] hover:text-[#103b1d]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    isSignUp 
                      ? 'bg-[#18542a] text-white shadow-xs' 
                      : 'text-[#18542a] hover:text-[#103b1d]'
                  }`}
                >
                  New Customer
                </button>
              </div>
            </div>

            {/* Login & Registration Form */}
            <form onSubmit={handleSubmit} className="px-6 sm:px-8 pt-4 pb-5 space-y-3.5 text-left">
              
              {/* Full Name (Sign Up only) */}
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Yuvan Datti"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#d9ca9d] rounded-xl text-xs sm:text-sm text-[#18542a] placeholder-[#8c7355]/60 focus:outline-none focus:border-[#18542a] focus:ring-1 focus:ring-[#18542a] transition-all font-medium"
                    />
                    <User className="w-4 h-4 text-[#8c7355] absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* Mobile Number or Email */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                    {isSignUp ? 'Mobile Number or Email *' : 'Mobile Number or Email'}
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setIsOtpMode(!isOtpMode)}
                      className="text-[10px] font-bold text-[#18542a] hover:underline cursor-pointer"
                    >
                      {isOtpMode ? 'Use Password instead' : 'Login with OTP'}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input 
                    type="text"
                    required
                    placeholder="90100 88063 or name@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#d9ca9d] rounded-xl text-xs sm:text-sm text-[#18542a] placeholder-[#8c7355]/60 focus:outline-none focus:border-[#18542a] focus:ring-1 focus:ring-[#18542a] transition-all font-medium"
                  />
                  {identifier.includes('@') ? (
                    <Mail className="w-4 h-4 text-[#8c7355] absolute left-3 top-3" />
                  ) : (
                    <Phone className="w-4 h-4 text-[#8c7355] absolute left-3 top-3" />
                  )}
                </div>
              </div>

              {/* Password OR OTP Input */}
              {(!isOtpMode || isSignUp) ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                      {isSignUp ? 'Create Password *' : 'Password'}
                    </label>
                    {!isSignUp && (
                      <span className="text-[10px] text-[#8c7355] cursor-pointer hover:text-[#18542a]">
                        Forgot?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#d9ca9d] rounded-xl text-xs sm:text-sm text-[#18542a] placeholder-[#8c7355]/60 focus:outline-none focus:border-[#18542a] focus:ring-1 focus:ring-[#18542a] transition-all font-medium"
                    />
                    <Lock className="w-4 h-4 text-[#8c7355] absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#8c7355] hover:text-[#18542a] p-0.5 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                /* OTP Mode */
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                      Enter 4-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[10px] font-bold text-[#18542a] hover:underline cursor-pointer"
                    >
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="text"
                      maxLength={4}
                      placeholder="1234"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#d9ca9d] rounded-xl text-xs sm:text-sm text-[#18542a] tracking-widest font-mono placeholder-[#8c7355]/60 focus:outline-none focus:border-[#18542a] focus:ring-1 focus:ring-[#18542a] transition-all font-bold text-center"
                    />
                    <KeyRound className="w-4 h-4 text-[#8c7355] absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* Submit CTA Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#18542a] hover:bg-[#103b1d] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                >
                  <span>{isSignUp ? 'Create Free Account' : 'Sign In to Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 1-Click Quick Demo Login Button for easy testing */}
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-[#8c7355] hover:text-[#18542a] border border-[#d9ca9d] rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#f96015]" />
                  <span>1-Click Test Login as Yuvan</span>
                </button>
              </div>

              {/* Skip for now / Browse as Guest Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs text-[#8c7355] hover:text-[#18542a] font-medium transition-colors cursor-pointer hover:underline"
                >
                  Skip for now & explore farm harvest →
                </button>
              </div>

            </form>

            {/* Bottom 3-Point Trust Strip */}
            <div className="bg-[#f3e8cc]/70 border-t border-[#d9ca9d] px-4 py-3 flex items-center justify-around text-[10px] sm:text-[11px] font-bold text-[#18542a]">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#9abc05] shrink-0" />
                <span>100% Organic</span>
              </div>
              <span className="text-[#d9ca9d]">•</span>
              <div className="flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-[#9abc05] shrink-0" />
                <span>Free Ship ₹999+</span>
              </div>
              <span className="text-[#d9ca9d]">•</span>
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9abc05] shrink-0" />
                <span>Farm-Direct</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
