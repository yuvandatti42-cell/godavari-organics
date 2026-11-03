import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { auth, googleProvider } from '../firebase.js';
import { 
  signInWithPopup, 
  signInWithRedirect,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
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
  KeyRound,
  Loader2,
  AlertCircle,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, user, loginUser, logoutUser, showToast, cartCount, setCurrentPage } = useCart();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Error and diagnostic states
  const [authError, setAuthError] = useState(null);

  // Phone completion for Google Sign-In (optional)
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [googlePhone, setGooglePhone] = useState('');

  if (!authModalOpen) return null;

  // Dismiss modal and remember choice for the current browser session
  const handleClose = () => {
    try {
      sessionStorage.setItem('godavari_auth_dismissed', 'true');
    } catch (e) {
      console.error(e);
    }
    setPendingGoogleUser(null);
    setAuthError(null);
    setAuthModalOpen(false);
  };

  // 1. Google 1-Click Sign-In
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      let existingPhone = fbUser.phoneNumber || '';
      try {
        const cached = JSON.parse(localStorage.getItem('godavari_user') || '{}');
        if (cached.email === fbUser.email && cached.phone) {
          existingPhone = cached.phone;
        }
      } catch (e) {}

      const loggedUser = {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Organic Shopper',
        email: fbUser.email || '',
        phone: existingPhone,
        photoURL: fbUser.photoURL || '',
        authProvider: 'Google',
        isLoggedIn: true,
        memberSince: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      };

      // Directly log user in without friction!
      loginUser(loggedUser);
      showToast(`Welcome ${loggedUser.name}! Signed in with Google.`);
      handleClose();
    } catch (err) {
      console.error('Google sign-in error:', err);
      let errorMsg = 'Unable to sign in with Google.';

      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        errorMsg = 'Google Sign-In is disabled in Firebase Console. Please open Firebase Console > Authentication > Sign-in method > Google and toggle Enable.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMsg = `Domain "${typeof window !== 'undefined' ? window.location.hostname : 'current'}" is not authorized. Add it in Firebase Console > Authentication > Settings > Authorized domains.`;
      } else if (err.code === 'auth/popup-blocked') {
        errorMsg = 'Google sign-in popup was blocked by your browser. Please allow popups for this site, or try redirect below.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Google sign-in window was closed before signing in.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMsg = 'Another sign-in popup is already open. Please switch to it or refresh.';
      } else {
        errorMsg = err.message || 'Google sign-in failed. Please try again.';
      }

      setAuthError({ code: err.code, message: errorMsg });
      showToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback: Google Redirect Sign-In (if popup blocked)
  const handleGoogleRedirectSignIn = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error('Google redirect error:', err);
      showToast(err.message || 'Redirect failed');
      setIsLoading(false);
    }
  };

  // Complete Google user phone number
  const handleCompleteGooglePhone = (e) => {
    e.preventDefault();
    const clean = googlePhone.replace(/\D/g, '');
    if (!clean || clean.length < 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    const formattedPhone = clean.length === 10 ? `+91 ${clean}` : clean;
    const finalUser = {
      ...pendingGoogleUser,
      phone: formattedPhone
    };
    setPendingGoogleUser(null);
    loginUser(finalUser);
    showToast(`Welcome ${finalUser.name}! Mobile number saved.`);
  };

  // 2. Email & Password / Mobile Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // 1. Full name validation
      if (!fullName.trim()) {
        showToast('Please enter your full name');
        return;
      }
      
      // 2. Email validation
      if (!email.trim() || !email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address');
        return;
      }

      // 3. Mobile phone validation
      const cleanPhone = phone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        showToast('Please enter a valid 10-digit mobile number');
        return;
      }

      // 4. Password validation
      if (!password || password.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
      }

      setIsLoading(true);
      try {
        // Real Firebase Email/Password Sign Up
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        try {
          await updateProfile(userCred.user, { displayName: fullName.trim() });
        } catch (pErr) {
          console.warn('Profile name update error:', pErr);
        }

        const formattedPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone}` : cleanPhone;
        const newUser = {
          uid: userCred.user.uid,
          name: fullName.trim(),
          email: email.trim(),
          phone: formattedPhone,
          authProvider: 'Email/Password',
          isLoggedIn: true,
          memberSince: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        };
        loginUser(newUser);
        showToast(`Welcome to Godavari Organic Foods, ${newUser.name}!`);
      } catch (err) {
        console.error('Sign up error:', err);
        if (err.code === 'auth/email-already-in-use') {
          showToast('This email is already registered! Please sign in with your password.');
          setIsSignUp(false);
          setIdentifier(email.trim());
        } else if (err.code === 'auth/weak-password') {
          showToast('Password is too weak. Please use at least 6 characters.');
        } else if (err.code === 'auth/invalid-email') {
          showToast('Please enter a valid email address.');
        } else {
          showToast(err.message || 'Failed to create account.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign In
      if (!identifier.trim()) {
        showToast('Please enter your email or mobile number');
        return;
      }

      setIsLoading(true);
      try {
        if (identifier.includes('@')) {
          if (!password) {
            showToast('Please enter your account password');
            setIsLoading(false);
            return;
          }
          // Real Firebase Email/Password Sign In
          const userCred = await signInWithEmailAndPassword(auth, identifier.trim(), password);
          
          let existingPhone = userCred.user.phoneNumber || '';
          try {
            const cached = JSON.parse(localStorage.getItem('godavari_user') || '{}');
            if (cached.email === identifier.trim() && cached.phone) {
              existingPhone = cached.phone;
            }
          } catch (e) {}

          const loggedUser = {
            uid: userCred.user.uid,
            name: userCred.user.displayName || identifier.split('@')[0],
            email: userCred.user.email,
            phone: existingPhone,
            photoURL: userCred.user.photoURL || '',
            authProvider: 'Email/Password',
            isLoggedIn: true,
            memberSince: 'Oct 2026'
          };
          loginUser(loggedUser);
          showToast(`Welcome back, ${loggedUser.name}!`);
        } else {
          // Fast mobile / phone login
          const cleanId = identifier.replace(/\D/g, '');
          const formattedPhone = cleanId.length === 10 ? `+91 ${cleanId}` : identifier.trim();
          
          const loggedUser = {
            name: 'Customer',
            phone: formattedPhone,
            email: '',
            authProvider: 'Phone',
            isLoggedIn: true,
            memberSince: 'Oct 2026'
          };
          loginUser(loggedUser);
          showToast(`Welcome back!`);
        }
      } catch (err) {
        console.error('Sign in error:', err);
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          showToast('Incorrect password or email. Please check your credentials.');
        } else if (err.code === 'auth/user-not-found') {
          showToast('No account found for this email. Would you like to create one?');
          setIsSignUp(true);
          setEmail(identifier.trim());
        } else {
          showToast(err.message || 'Unable to sign in.');
        }
      } finally {
        setIsLoading(false);
      }
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
        className="w-full max-w-[440px] bg-[#faf5ea] rounded-3xl shadow-2xl border-2 border-[#d9ca9d] relative overflow-hidden transition-all duration-300 scale-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
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
          <div className="p-6 sm:p-8 text-center space-y-6 overflow-y-auto">
            {/* Header & Logo */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#d9ca9d] shadow-xs p-2 flex items-center justify-center mb-3">
                <img 
                  src="/logo.webp" 
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
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#18542a] shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#18542a] text-white flex items-center justify-center text-lg font-black font-urbanist shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-urbanist font-extrabold text-sm sm:text-base text-[#103b1d] truncate">
                    {user.name}
                  </h4>
                  <p className="text-xs text-[#556b54] truncate">
                    {user.email || user.phone || 'Verified Customer'}
                  </p>
                  {user.phone && user.email && (
                    <p className="text-[11px] text-[#8c7355] font-medium truncate mt-0.5">
                      {user.phone}
                    </p>
                  )}
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
        ) : pendingGoogleUser ? (
          /* ------------------------------------------------------------- */
          /* VIEW C: MANDATORY PHONE NUMBER STEP FOR GOOGLE SIGN-IN        */
          /* ------------------------------------------------------------- */
          <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#e8f5ec] border border-[#a3d9b1] text-[#18542a] flex items-center justify-center shadow-xs">
              <Phone className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#8c7355] font-urbanist">
                Complete Profile
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#103b1d] font-normal tracking-tight mt-1">
                Enter Delivery Mobile Number
              </h3>
              <p className="text-xs text-[#556b54] font-medium leading-relaxed mt-1 max-w-xs mx-auto">
                Hi <strong className="text-[#103b1d]">{pendingGoogleUser.name}</strong>! Please enter your 10-digit mobile number so our farm delivery team can update you on dispatch.
              </p>
            </div>

            <form onSubmit={handleCompleteGooglePhone} className="space-y-4 text-left max-w-xs mx-auto">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                  Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-[#18542a] font-mono">+91</span>
                  <input 
                    type="tel"
                    required
                    autoFocus
                    maxLength={10}
                    placeholder="98765 43210"
                    value={googlePhone}
                    onChange={(e) => setGooglePhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#d9ca9d] rounded-xl text-sm font-bold text-[#18542a] tracking-wider placeholder-[#8c7355]/60 focus:outline-none focus:border-[#18542a] focus:ring-1 focus:ring-[#18542a] transition-all font-mono"
                  />
                  <Phone className="w-4 h-4 text-[#8c7355] absolute right-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#18542a] hover:bg-[#103b1d] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
              >
                <span>Save & Continue to Store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPendingGoogleUser(null)}
                className="text-xs text-[#8c7355] hover:text-[#18542a] font-medium transition-colors cursor-pointer hover:underline"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW B: CUSTOMER LOGIN & SIGN-UP INTERFACE                    */
          /* ------------------------------------------------------------- */
          <div className="overflow-y-auto flex-1">
            {/* Modal Header with Official Logo */}
            <div className="pt-6 sm:pt-7 pb-2 px-6 sm:px-8 text-center flex flex-col items-center">
              
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white border border-[#d9ca9d] shadow-xs p-2 flex items-center justify-center mb-2.5">
                <img 
                  src="/logo.webp" 
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

            {/* 1-Tap Google Sign-In Button */}
            <div className="px-6 sm:px-8 pt-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 text-[#103b1d] font-bold text-xs sm:text-sm rounded-xl border border-[#d9ca9d] shadow-xs hover:shadow-md flex items-center justify-center space-x-2.5 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Dynamic Error & Setup Diagnostics */}
              {authError && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Google Sign-In Alert</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {authError.message}
                  </p>
                  {authError.code === 'auth/popup-blocked' && (
                    <button
                      type="button"
                      onClick={handleGoogleRedirectSignIn}
                      className="mt-1 w-full py-1.5 px-3 bg-[#18542a] text-white rounded-lg font-bold text-[11px] hover:bg-[#124020] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Sign In via Full Page Redirect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {(authError.code === 'auth/operation-not-allowed' || authError.code === 'auth/configuration-not-found') && (
                    <a 
                      href="https://console.firebase.google.com/project/godavari-organics-arma/authentication/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-950 underline hover:text-black mt-1"
                    >
                      <span>Enable Google in Firebase Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Elegant Divider */}
            <div className="px-6 sm:px-8 py-3 flex items-center justify-center">
              <div className="border-t border-[#d9ca9d]/70 flex-1" />
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#8c7355] font-urbanist">
                {isSignUp ? 'or register with email & phone' : 'or with email / mobile'}
              </span>
              <div className="border-t border-[#d9ca9d]/70 flex-1" />
            </div>

            {/* Toggle Tabs: Sign In / New Customer */}
            <div className="px-6 sm:px-8">
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
            <form onSubmit={handleSubmit} className="px-6 sm:px-8 pt-3 pb-4 space-y-3 text-left">
              
              {/* ------------------------------------------------------------- */}
              {/* SIGN UP FORM: Full Name, Email, Mobile Number, Password       */}
              {/* ------------------------------------------------------------- */}
              {isSignUp ? (
                <>
                  {/* 1. Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Ramesh Varma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#d9ca9d] rounded-xl text-xs sm:text-sm text-[#18542a] placeholder-[#8c7355]/60 focus:outline-none focus:border-[#18542a] focus:ring-1 focus:ring-[#18542a] transition-all font-medium"
                      />
                      <User className="w-4 h-4 text-[#8c7355] absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* 2. Email Address */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input 
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#d9ca9d] rounded-xl text-xs sm:text-sm text-[#18542a] placeholder-[#8c7355]/60 focus:outline-none focus:border-[#18542a] focus:ring-1 focus:ring-[#18542a] transition-all font-medium"
                      />
                      <Mail className="w-4 h-4 text-[#8c7355] absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* 3. Mobile Number (Mandatory for Delivery) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                        Mobile Number (for Delivery) *
                      </label>
                      <span className="text-[10px] text-[#8c7355] font-semibold">10 Digits</span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-[#18542a] font-mono">+91</span>
                      <input 
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-9 py-2.5 bg-white border border-[#d9ca9d] rounded-xl text-xs sm:text-sm text-[#18542a] placeholder-[#8c7355]/60 focus:outline-none focus:border-[#18542a] focus:ring-1 focus:ring-[#18542a] transition-all font-medium font-mono"
                      />
                      <Phone className="w-4 h-4 text-[#8c7355] absolute right-3" />
                    </div>
                  </div>

                  {/* 4. Password */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                      Create Password *
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
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
                </>
              ) : (
                /* ------------------------------------------------------------- */
                /* SIGN IN FORM: Email or Mobile & Password / OTP                */
                /* ------------------------------------------------------------- */
                <>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                        Email or Mobile Number
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsOtpMode(!isOtpMode)}
                        className="text-[10px] font-bold text-[#18542a] hover:underline cursor-pointer"
                      >
                        {isOtpMode ? 'Use Password' : 'Login with OTP'}
                      </button>
                    </div>

                    <div className="relative">
                      <input 
                        type="text"
                        required
                        placeholder="name@example.com or 98765 43210"
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
                  {!isOtpMode ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#103b1d] uppercase tracking-wider block font-urbanist">
                          Password
                        </label>
                        {identifier.includes('@') && (
                          <span className="text-[10px] text-[#8c7355] cursor-pointer hover:text-[#18542a]">
                            Forgot password?
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          required={identifier.includes('@')}
                          placeholder="Enter your password"
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
                </>
              )}

              {/* Submit CTA Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#18542a] hover:bg-[#103b1d] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting securely...</span>
                    </>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Free Account' : 'Sign In to Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 1-Click Quick Demo Login Button for easy testing */}
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  disabled={isLoading}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-[#8c7355] hover:text-[#18542a] border border-[#d9ca9d] rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#f96015]" />
                  <span>1-Click Fast Login as Yuvan (+91 90100 88063)</span>
                </button>
              </div>

              {/* Skip for now / Browse as Guest Link */}
              <div className="text-center pt-0.5">
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
            <div className="bg-[#f3e8cc]/70 border-t border-[#d9ca9d] px-4 py-3 flex items-center justify-around text-[10px] sm:text-[11px] font-bold text-[#18542a] mt-auto">
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
