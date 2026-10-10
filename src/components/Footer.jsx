import React from 'react';
import { useCart } from '../context/CartContext';
import { Mail, Phone, MapPin, Leaf } from 'lucide-react';

export default function Footer() {
  const { setCurrentPage, showToast } = useCart();

  return (
    <footer className="w-full font-sans mt-12 sm:mt-16">
      
      {/* ========================================================================= */}
      {/* MOBILE FOOTER VIEW (< md) — FOREST GREEN BRAND THEME + WIREFRAME LAYOUT  */}
      {/* ========================================================================= */}
      <div className="block md:hidden bg-[#18542a] text-white border-t border-[#9abc05]/40 p-6 space-y-6">
        {/* Brand Header & Tagline */}
        <div className="space-y-2 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-1 flex items-center justify-center shrink-0 shadow-md border-2 border-[#ffc926] overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Godavari Organic Foods Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <h3 className="font-urbanist font-black text-xl sm:text-2xl text-[#ffc926] tracking-wider uppercase">
              GODAVARI ORGANICS
            </h3>
          </div>
          <p className="text-xs text-[#f3e8cc] font-medium leading-relaxed">
            Bringing pristine, traditional riverbank harvest straight to your modern life.
          </p>
        </div>

        {/* 3-Column Link Grid (SHOP | ABOUT | POLICIES) */}
        <div className="grid grid-cols-3 gap-3 text-left pt-1">
          {/* Column 1: SHOP */}
          <div className="space-y-2">
            <h4 className="font-urbanist font-extrabold text-xs uppercase tracking-wider text-[#ffc926]">
              SHOP
            </h4>
            <ul className="space-y-1.5 text-xs text-[#f3e8cc] font-medium">
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Organic Rice
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Organic Spices
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Traditional Foods
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: ABOUT */}
          <div className="space-y-2">
            <h4 className="font-urbanist font-extrabold text-xs uppercase tracking-wider text-[#ffc926]">
              ABOUT
            </h4>
            <ul className="space-y-1.5 text-xs text-[#f3e8cc] font-medium">
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Our Farms
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Contact support: support@godavariorganic.com')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Godavari Organic Help & FAQs')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: POLICIES */}
          <div className="space-y-2">
            <h4 className="font-urbanist font-extrabold text-xs uppercase tracking-wider text-[#ffc926]">
              POLICIES
            </h4>
            <ul className="space-y-1.5 text-xs text-[#f3e8cc] font-medium">
              <li>
                <button onClick={() => showToast('Shipping & Returns Policy')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Privacy Policy')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Terms of Use')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider Line & Social Circles */}
        <div className="border-t border-[#9abc05]/30 pt-4 space-y-4">
          {/* Social Media Circle Icons */}
          <div className="flex items-center justify-center space-x-3">
            <button 
              onClick={() => showToast('Facebook Page')}
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-[#ffc926] hover:text-[#18542a] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button 
              onClick={() => showToast('Instagram Page')}
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-[#ffc926] hover:text-[#18542a] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
            <button 
              onClick={() => showToast('Twitter Page')}
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-[#ffc926] hover:text-[#18542a] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            <button 
              onClick={() => showToast('YouTube Channel')}
              aria-label="YouTube"
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-[#ffc926] hover:text-[#18542a] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </button>
          </div>

          {/* Copyright Note */}
          <div className="text-center">
            <p className="text-[11px] text-[#f3e8cc] font-medium">
              © 2026 Godavari Organic Foods. All rights reserved.
            </p>
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* DESKTOP FOOTER VIEW (>= md)                                                */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-[#18542a] text-white border-t border-[#9abc05]/40">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-full bg-white p-1 flex items-center justify-center shrink-0 shadow-md border-2 border-[#ffc926] overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Godavari Organic Foods Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="font-urbanist font-black text-xl lg:text-2xl text-white tracking-tight">
                Godavari Organics
              </span>
            </div>

            <p className="text-xs text-[#f3e8cc] leading-relaxed">
              High quality 100% certified organic foods produced directly by traditional farming families along the fertile Godavari river delta.
            </p>

            <div className="space-y-2 text-xs text-[#f3e8cc]">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-[#ffc926] shrink-0" />
                <span>Godavari Delta Farm Hub, Rajahmundry, AP</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#ffc926] shrink-0" />
                <span>+91 98765 43210 / 1800-425-9988</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#ffc926] shrink-0" />
                <span>support@godavariorganic.com</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex items-center space-x-2 pt-2 text-xs font-bold">
              {['Facebook', 'Instagram', 'WhatsApp', 'YouTube'].map((social, i) => (
                <button 
                  key={i}
                  onClick={() => showToast(`Social media channel: ${social}`)}
                  className="px-3 py-1 rounded-full bg-white/15 hover:bg-[#f96015] hover:text-white transition-colors text-[11px] cursor-pointer"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#ffc926] border-b border-[#9abc05]/30 pb-2 font-urbanist">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#f3e8cc]">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Shop Harvest Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('product')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Featured Product Details
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Organic Farming Standards')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Organic Farming Standards
                </button>
              </li>
              <li>
                <button onClick={() => showToast('Bulk Farm Orders')} className="hover:text-[#f96015] transition-colors cursor-pointer">
                  Bulk Farm Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Organic Categories */}
          <div className="space-y-3 text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#ffc926] border-b border-[#9abc05]/30 pb-2 font-urbanist">
              HARVEST CATEGORIES
            </h4>
            <ul className="space-y-2.5 text-xs text-[#f3e8cc]">
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Organic Aged Basmati & Red Rice
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Wood Pressed Ghani Oils & A2 Ghee
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Stone Ground Spices & Turmeric
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Unpolished Dals & Legumes
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-[#9abc05] transition-colors cursor-pointer">
                  Unrefined Cane Jaggery & Raw Honey
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Trust */}
          <div className="space-y-3 text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#ffc926] border-b border-[#9abc05]/30 pb-2 font-urbanist">
              CUSTOMER TRUST
            </h4>
            <p className="text-xs text-[#f3e8cc] leading-relaxed">
              Every product is batch-tested for zero synthetic chemical residues and certified under NPOP Jaivik Bharat organic norms.
            </p>

            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-[#ffc926] block">Accepted Safe Payments:</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-white">
                <span className="bg-white/15 px-2.5 py-1 rounded-full border border-white/10">UPI</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-full border border-white/10">GPay</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-full border border-white/10">PhonePe</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-full border border-white/10">Paytm</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-full border border-white/10">Cards</span>
                <span className="bg-[#d52518] px-2.5 py-1 rounded-full">COD</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="bg-[#103b1d] border-t border-[#9abc05]/30 py-4 px-6 text-center text-xs text-[#f3e8cc]">
          <div className="w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 px-4 sm:px-8 lg:px-12 xl:px-16">
            <span>© 2026 Godavari Organic Foods. All rights reserved.</span>
            <span className="text-[#9abc05] font-bold flex items-center justify-center">
              <Leaf className="w-4 h-4 inline mr-1 text-[#9abc05]" />
              100% Pure Organic Farm Harvest Direct To Your Doorstep
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
