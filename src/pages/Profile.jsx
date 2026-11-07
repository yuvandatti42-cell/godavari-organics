import React from 'react';
import { useCart } from '../context/CartContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  ShoppingBag,
  Sparkles,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogIn,
  Truck
} from 'lucide-react';

export default function Profile() {
  const {
    user,
    logoutUser,
    setCurrentPage,
    setAuthModalOpen,
    cartCount,
    lastOrder,
    freeShippingThreshold,
  } = useCart();

  // If user is not logged in, show an inviting customer sign-in landing card
  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#faf5ea] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#dfd5bf] shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#f3e8cc] border border-[#dfd5bf] flex items-center justify-center p-3 shadow-inner">
            <img
              src="/logo.webp"
              alt="Godavari Organic Foods"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8c7355]">
              Customer Account
            </span>
            <h1 className="font-urbanist font-black text-2xl sm:text-3xl text-[#18542a] mt-1">
              Welcome to Godavari Organics
            </h1>
            <p className="text-xs sm:text-sm text-[#556b54] mt-2 leading-relaxed">
              Sign in with your Google account or phone number to manage your profile, view orders, and enjoy member-exclusive harvest discounts.
            </p>
          </div>

          {/* Perks list */}
          <div className="bg-[#faf5ea] rounded-2xl p-4 border border-[#dfd5bf] text-left space-y-2.5 text-xs text-[#18542a]">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#9abc05] shrink-0" />
              <span>Fast 1-click checkout with saved addresses</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#9abc05] shrink-0" />
              <span>Live farm dispatch & tracking updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#9abc05] shrink-0" />
              <span>Free shipping on orders above ₹{freeShippingThreshold || 999}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-3.5 bg-[#18542a] hover:bg-[#103b1d] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
            <button
              onClick={() => setCurrentPage('shop')}
              className="w-full py-3 bg-white hover:bg-[#f3e8cc]/50 text-[#18542a] border border-[#dfd5bf] font-bold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Explore Farm Harvest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active logged-in user profile view
  const userInitials = (user?.name || 'Customer')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'CU';

  return (
    <div className="min-h-screen bg-[#faf5ea] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#8c7355]">
          <button
            onClick={() => setCurrentPage('home')}
            className="hover:text-[#18542a] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-[#dfd5bf]" />
          <span className="text-[#18542a] font-bold">Customer Profile</span>
        </div>

        {/* Profile Header Hero Card */}
        <div className="bg-white rounded-3xl border border-[#dfd5bf] shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar */}
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name || 'Customer'}
                className="w-20 h-20 rounded-3xl object-cover border-2 border-[#18542a] shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-[#18542a] text-[#ffc926] font-urbanist font-black text-2xl flex items-center justify-center shadow-md">
                {userInitials}
              </div>
            )}

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-urbanist font-black text-2xl sm:text-3xl text-[#18542a]">
                  {user.name || 'Organic Shopper'}
                </h1>
                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-[#18542a]/10 border border-[#18542a]/20 rounded-full text-xs font-bold text-[#18542a]">
                  <Sparkles className="w-3.5 h-3.5 text-[#9abc05]" />
                  <span>Verified Member</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 mt-2 text-xs sm:text-sm text-[#556b54]">
                {user.email && (
                  <span className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8c7355]" />
                    <span>{user.email}</span>
                  </span>
                )}
                {user.phone && (
                  <span className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8c7355]" />
                    <span>{user.phone}</span>
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[#8c7355] mt-2 font-medium">
                Member since {user.memberSince || 'October 2026'} • Auth: {user.authProvider || 'Firebase'}
              </p>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logoutUser}
              className="py-2.5 px-4 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
              title="Sign Out of Customer Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#dfd5bf]">
            <div className="bg-[#faf5ea] rounded-2xl p-3.5 border border-[#dfd5bf]">
              <span className="text-[11px] font-semibold text-[#8c7355] block">Cart Items</span>
              <span className="font-urbanist font-extrabold text-xl text-[#18542a]">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="bg-[#faf5ea] rounded-2xl p-3.5 border border-[#dfd5bf]">
              <span className="text-[11px] font-semibold text-[#8c7355] block">Free Shipping</span>
              <span className="font-urbanist font-extrabold text-xl text-[#18542a]">
                Over ₹{freeShippingThreshold || 999}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-[#faf5ea] rounded-2xl p-3.5 border border-[#dfd5bf]">
              <span className="text-[11px] font-semibold text-[#8c7355] block">Organic Guarantee</span>
              <span className="font-urbanist font-extrabold text-xl text-[#18542a] flex items-center space-x-1">
                <ShieldCheck className="w-5 h-5 text-[#9abc05] inline" />
                <span>100% Pure</span>
              </span>
            </div>
          </div>
        </div>

        {/* Recent Order Status Card */}
        <div className="bg-white rounded-3xl border border-[#dfd5bf] shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Package className="w-5 h-5 text-[#18542a]" />
              <h2 className="font-urbanist font-bold text-lg text-[#18542a]">
                Recent Orders & Dispatch
              </h2>
            </div>
            {lastOrder && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Latest Order Placed
              </span>
            )}
          </div>

          {lastOrder ? (
            <div className="bg-[#faf5ea] rounded-2xl p-4 sm:p-5 border border-[#dfd5bf] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dfd5bf]/60 pb-3">
                <div>
                  <span className="text-xs font-bold text-[#18542a]">Order #{lastOrder.id || 'GOF-NEW'}</span>
                  <p className="text-[11px] text-[#8c7355] mt-0.5">
                    {lastOrder.date ? new Date(lastOrder.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#18542a] block">
                    ₹{lastOrder.total || lastOrder.subtotal || 0}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {lastOrder.status || 'Confirmed'}
                  </span>
                </div>
              </div>

              {/* Order address snippet */}
              {lastOrder.shippingAddress && (
                <div className="text-xs text-[#556b54] flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#8c7355] shrink-0 mt-0.5" />
                  <span>
                    Delivering to: {lastOrder.shippingAddress.address}, {lastOrder.shippingAddress.city}, {lastOrder.shippingAddress.pincode}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#faf5ea] rounded-2xl p-6 border border-dashed border-[#dfd5bf] text-center space-y-2">
              <Truck className="w-8 h-8 text-[#8c7355] mx-auto stroke-[1.5]" />
              <p className="text-xs sm:text-sm font-bold text-[#18542a]">
                No orders placed in this session yet
              </p>
              <p className="text-xs text-[#8c7355] max-w-sm mx-auto">
                Discover freshly pressed oils, heirloom grains, and stone-ground spices harvested from the Godavari River Delta.
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setCurrentPage('shop')}
            className="flex-1 py-3.5 px-6 bg-[#18542a] hover:bg-[#103b1d] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping Harvest</span>
          </button>

          {cartCount > 0 && (
            <button
              onClick={() => setCurrentPage('cart')}
              className="py-3.5 px-6 bg-white hover:bg-[#f3e8cc]/60 text-[#18542a] border border-[#dfd5bf] font-bold text-sm rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart ({cartCount})</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
