import React from 'react';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import FeaturedHarvestProducts from '../components/FeaturedHarvestProducts';
import WhyChooseArma from '../components/WhyChooseArma';
import CustomerReviews from '../components/CustomerReviews';
import { ArrowRight, ArrowUpRight, ShieldCheck, Users, HeartHandshake, Sprout, CheckCircle2, Award, Leaf, Truck, Sparkles, MapPin, Gift, Image } from 'lucide-react';

export default function Home() {
  const { setCurrentPage, products, categories, showToast } = useCart();

  const popularProducts = products.filter(p => p.isPopular);

  return (
    <div className="w-full font-sans bg-[#faf5ea] text-[#103b1d]">
      
      {/* 1. HERO SLIDER SECTION — DYNAMIC BACKGROUND transitions, DUAL BUTTONS, NO FRAMES */}
      <HeroSlider />

      {/* Main Page Body Container (Top Section) - Expanded to Full Desktop Width */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 sm:pt-10 pb-2">

        {/* STANDALONE ENLARGED CERTIFIED QUALITY STANDARDS BADGES */}
        {/* Desktop: One single horizontal line | Mobile: Continuous smooth right-to-left marquee scroll */}
        <div className="mb-8 sm:mb-10 py-3 overflow-hidden">
          {/* Mobile continuous right-to-left marquee scroll (< sm) */}
          <div className="block sm:hidden w-full overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex items-center space-x-10 py-3">
              <div className="flex items-center space-x-10 shrink-0">
                <img src="/fssai.webp" alt="FSSAI Certified" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
                <img src="/USDA.gif" alt="USDA Organic" className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs" />
                <img src="/SGS.png" alt="SGS Bio-Verified" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
                <img src="/apeda-pure.png" alt="APEDA Pure" className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs" />
              </div>
              {/* Duplicated set for seamless continuous right-to-left marquee loop on mobile */}
              <div className="flex items-center space-x-10 shrink-0">
                <img src="/fssai.webp" alt="FSSAI Certified" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
                <img src="/USDA.gif" alt="USDA Organic" className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs" />
                <img src="/SGS.png" alt="SGS Bio-Verified" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
                <img src="/apeda-pure.png" alt="APEDA Pure" className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs" />
              </div>
            </div>
          </div>

          {/* Desktop floating logos row (>= sm) */}
          <div className="hidden sm:flex items-center justify-around gap-8 md:gap-12 lg:gap-20 py-3 px-4 max-w-6xl mx-auto">
            <img 
              src="/fssai.webp" 
              alt="FSSAI Certified" 
              className="h-16 sm:h-20 lg:h-24 max-h-28 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer drop-shadow-xs" 
            />
            <img 
              src="/USDA.gif" 
              alt="USDA Organic" 
              className="h-20 sm:h-24 lg:h-28 max-h-32 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer drop-shadow-xs" 
            />
            <img 
              src="/SGS.png" 
              alt="SGS Bio-Verified" 
              className="h-16 sm:h-20 lg:h-24 max-h-28 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer drop-shadow-xs" 
            />
            <img 
              src="/apeda-pure.png" 
              alt="APEDA Pure" 
              className="h-20 sm:h-24 lg:h-28 max-h-32 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer drop-shadow-xs" 
            />
          </div>
        </div>

        {/* 2. CATEGORY SECTION (Matches reference screenshot layout) */}
        <section className="space-y-4 sm:space-y-6 pt-2 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight">
              Our Harvest Categories
            </h2>
          </div>

          {/* 4-column equal frame row matching reference screenshot */}
          <div className="grid grid-cols-4 gap-3 xs:gap-4 sm:gap-6 lg:gap-8 items-stretch">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

      </div>

      {/* 3. FULL-WIDTH TICKER MARQUEE BAR — SPANS 100% EDGE-TO-EDGE ACROSS ENTIRE PAGE IN ITS ORIGINAL POSITION */}
      <section className="w-full bg-[#18542a] text-[#ffc926] py-3 sm:py-3.5 border-y border-[#9abc05]/40 overflow-hidden shadow-sm relative z-20 my-4 sm:my-6">
        <div className="animate-marquee whitespace-nowrap flex items-center text-xs sm:text-sm font-extrabold uppercase tracking-widest">
          <div className="flex items-center space-x-8 sm:space-x-12 shrink-0 pr-8 sm:pr-12">
            <span>GREAT TASTE</span>
            <span className="text-[#9abc05]">•</span>
            <span>FAST DELIVERY GUARANTEED</span>
            <span className="text-[#9abc05]">•</span>
            <span>SUSTAINABLE PRODUCTION PRACTICES</span>
            <span className="text-[#9abc05]">•</span>
            <span>100% CERTIFIED ORGANIC</span>
            <span className="text-[#9abc05]">•</span>
            <span>GODAVARI RIVER BASIN HARVEST</span>
            <span className="text-[#9abc05]">•</span>
            <span>ZERO PESTICIDES & LAB TESTED</span>
            <span className="text-[#9abc05]">•</span>
          </div>

          <div className="flex items-center space-x-8 sm:space-x-12 shrink-0 pr-8 sm:pr-12">
            <span>GREAT TASTE</span>
            <span className="text-[#9abc05]">•</span>
            <span>FAST DELIVERY GUARANTEED</span>
            <span className="text-[#9abc05]">•</span>
            <span>SUSTAINABLE PRODUCTION PRACTICES</span>
            <span className="text-[#9abc05]">•</span>
            <span>100% CERTIFIED ORGANIC</span>
            <span className="text-[#9abc05]">•</span>
            <span>GODAVARI RIVER BASIN HARVEST</span>
            <span className="text-[#9abc05]">•</span>
            <span>ZERO PESTICIDES & LAB TESTED</span>
            <span className="text-[#9abc05]">•</span>
          </div>
        </div>
      </section>

      {/* Main Page Body Container (Remaining Content) - Expanded to Full Desktop Width */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 space-y-10 sm:space-y-14">

        {/* 4. EDITORIAL BRAND INTRO STATEMENT */}
        <section className="hidden md:block max-w-4xl mx-auto text-center px-4 py-2 space-y-3">
          <span className="text-[11px] font-extrabold text-[#f96015] uppercase tracking-widest">Pure & Authentic Organic Craft</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-urbanist text-[#18542a] leading-snug font-extrabold">
            "Our produce is grown in the fertile Godavari river delta using traditional organic methods, offering a pure, authentic taste experience that is perfect for enhancing every meal."
          </h2>
          <div className="w-12 h-1 bg-[#9abc05] mx-auto rounded-full mt-4"></div>
        </section>

        {/* FEATURED HARVEST PRODUCTS SECTION (Matches reference screenshot 1:1) */}
        <FeaturedHarvestProducts />

      {/* 7. POPULAR PRODUCTS GRID — DESKTOP VIEW MATCHING WIREFRAME (HIDDEN ON MOBILE < md) */}
      <section className="hidden md:block space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight">
            Popular Products
          </h2>
          <button 
            onClick={() => setCurrentPage('shop')}
            className="inline-flex items-center space-x-1 font-urbanist font-extrabold text-xs sm:text-sm text-[#103b1d] hover:text-[#9abc05] underline underline-offset-4 transition-colors cursor-pointer"
          >
            <span>Explore Full Store</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
          {popularProducts.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 8. COMBINED ABOUT US & WHY CHOOSE US — DESKTOP SPLIT ROW MATCHING WIREFRAME */}
      <section className="space-y-5 sm:space-y-6">
        {/* Split Grid: Left = About Us (wider lg:col-span-7), Right = Why Choose Us (lg:col-span-5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">
          
          {/* LEFT COLUMN: ABOUT GODAVARI / OUR COOPERATIVE FARMING CORE (WIDER: lg:col-span-7) */}
          <div className="lg:col-span-7 bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-4 xs:p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all text-left group">
            <div className="space-y-3.5">
              {/* Feature Image Showcase Box Frame in Beige */}
              <div className="relative h-44 xs:h-48 sm:h-56 md:h-60 w-full rounded-xl overflow-hidden bg-[#e6dec9] border border-[#c8b894]">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" 
                  alt="Godavari Organic Farming Lands" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Title & Copy */}
              <div className="space-y-2">
                <h3 className="font-urbanist font-extrabold text-lg sm:text-xl text-[#103b1d] leading-snug tracking-tight">
                  Our Cooperative Farming Core
                </h3>
                <p className="text-xs sm:text-sm text-[#556b54] font-medium leading-relaxed">
                  We partner directly with family farms in the fertile Godavari Basin of Andhra Pradesh. By guaranteeing fair-trade pricing and investing in certified organic systems, we make sure every bag of grains preserves old-growth native species.
                </p>
              </div>
            </div>

            {/* Action Link */}
            <div className="pt-3 border-t border-[#d9ca9d]/60 mt-3">
              <button 
                onClick={() => {
                  showToast('Welcome to Godavari Organic Cooperative Model!');
                  setCurrentPage('shop');
                }}
                className="inline-flex items-center space-x-1.5 font-urbanist font-extrabold text-xs sm:text-sm text-[#18542a] hover:text-[#9abc05] group/btn transition-colors cursor-pointer"
              >
                <span className="underline underline-offset-4 decoration-2 decoration-[#18542a]/30 group-hover/btn:decoration-[#9abc05]">
                  Learn About Our Cooperative Model
                </span>
                <ArrowRight className="w-4 h-4 text-[#18542a] group-hover/btn:text-[#9abc05] group-hover/btn:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: WHY CHOOSE ARMA (lg:col-span-5) */}
          <div className="lg:col-span-5 h-full">
            <WhyChooseArma />
          </div>

        </div>
      </section>

      {/* Quick Enquiry Form Section */}
      <section className="w-full bg-[#f3e8cc] rounded-3xl border border-[#d9ca9d] p-6 sm:p-8 md:p-10 shadow-xs text-left relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
          <div className="text-center space-y-1.5">
            <span className="inline-block bg-[#18542a] text-[#ffc926] text-[10px] sm:text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-xs">
              Quick Enquiry
            </span>
            <h3 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight">
              Have Questions? Get in Touch with Us
            </h3>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const name = form.clientName.value.trim();
              const phone = form.clientPhone.value.trim();
              if (name && phone) {
                showToast(`Thank you ${name}! We will call you at ${phone} shortly.`);
                form.reset();
              } else {
                showToast('Please fill in your Name and Phone Number.');
              }
            }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 max-w-xl mx-auto pt-1"
          >
            <div className="w-full sm:flex-1">
              <input 
                type="text" 
                name="clientName"
                required
                placeholder="Your Full Name"
                className="w-full px-4 py-3 sm:py-3.5 bg-white border border-[#d9ca9d] rounded-2xl text-xs sm:text-sm text-[#103b1d] placeholder-[#556b54]/70 focus:outline-none focus:border-[#18542a] focus:ring-2 focus:ring-[#18542a]/20 font-medium shadow-xs"
              />
            </div>

            <div className="w-full sm:flex-1">
              <input 
                type="tel" 
                name="clientPhone"
                required
                placeholder="Phone Number (+91)"
                className="w-full px-4 py-3 sm:py-3.5 bg-white border border-[#d9ca9d] rounded-2xl text-xs sm:text-sm text-[#103b1d] placeholder-[#556b54]/70 focus:outline-none focus:border-[#18542a] focus:ring-2 focus:ring-[#18542a]/20 font-medium shadow-xs"
              />
            </div>

            <button 
              type="submit"
              className="w-full sm:w-auto px-7 py-3 sm:py-3.5 bg-[#18542a] hover:bg-[#103b1d] text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-md transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              Submit Enquiry
            </button>
          </form>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS (SLIDING MOBILE CAROUSEL & DESKTOP GRID) */}
      <CustomerReviews />



      </div>
    </div>
  );
}

