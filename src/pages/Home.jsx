import React from 'react';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import SpecialOffers from '../components/SpecialOffers';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
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

        {/* 2. SHOP BY CATEGORY SECTION */}
        <section className="space-y-3 sm:space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-urbanist font-extrabold text-lg sm:text-2xl md:text-3xl text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <button 
              onClick={() => setCurrentPage('shop')}
              className="hidden md:inline-flex items-center space-x-1 font-urbanist font-extrabold text-xs sm:text-sm text-slate-900 hover:text-[#18542a] underline underline-offset-4 transition-colors cursor-pointer"
            >
              <span>View All Categories</span>
            </button>
          </div>

          {/* 4-column side-by-side layout matching reference screenshot */}
          <div className="grid grid-cols-4 gap-2.5 xs:gap-3 sm:gap-5 lg:gap-6">
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

        {/* 5. SPECIAL OFFERS — SLIDING MOBILE CAROUSEL & DESKTOP GRID */}
        <SpecialOffers />

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

          {/* RIGHT COLUMN: WHY CHOOSE GODAVARI (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3 sm:space-y-4 text-left">
            <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight">
              Why Choose Godavari
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
              {/* Card 1: 100% Certified Organic */}
              <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl p-4 sm:p-5 flex flex-col justify-between text-left hover:border-[#18542a] hover:shadow-md transition-all group">
                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e6dec9] border border-[#c8b894] text-[#18542a] flex items-center justify-center group-hover:bg-[#18542a] group-hover:text-white group-hover:border-[#18542a] transition-all">
                    <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <h4 className="font-urbanist font-extrabold text-xs sm:text-sm md:text-base text-[#103b1d] mt-3 group-hover:text-[#18542a] transition-colors leading-snug">
                    100% Certified Organic
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#556b54] font-medium leading-relaxed mt-1">
                    Completely trace pesticide-free
                  </p>
                </div>
              </div>

              {/* Card 2: Rigorous Bio-testing */}
              <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl p-4 sm:p-5 flex flex-col justify-between text-left hover:border-[#18542a] hover:shadow-md transition-all group">
                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e6dec9] border border-[#c8b894] text-[#18542a] flex items-center justify-center group-hover:bg-[#18542a] group-hover:text-white group-hover:border-[#18542a] transition-all">
                    <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <h4 className="font-urbanist font-extrabold text-xs sm:text-sm md:text-base text-[#103b1d] mt-3 group-hover:text-[#18542a] transition-colors leading-snug">
                    Rigorous Bio-testing
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#556b54] font-medium leading-relaxed mt-1">
                    Lab tested nutrition integrity
                  </p>
                </div>
              </div>

              {/* Card 3: Fair-Trade Agriculture */}
              <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl p-4 sm:p-5 flex flex-col justify-between text-left hover:border-[#18542a] hover:shadow-md transition-all group">
                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e6dec9] border border-[#c8b894] text-[#18542a] flex items-center justify-center group-hover:bg-[#18542a] group-hover:text-white group-hover:border-[#18542a] transition-all">
                    <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <h4 className="font-urbanist font-extrabold text-xs sm:text-sm md:text-base text-[#103b1d] mt-3 group-hover:text-[#18542a] transition-colors leading-snug">
                    Fair-Trade Agriculture
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#556b54] font-medium leading-relaxed mt-1">
                    Direct economic empowerment
                  </p>
                </div>
              </div>

              {/* Card 4: Naturally Stone-Ground */}
              <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl p-4 sm:p-5 flex flex-col justify-between text-left hover:border-[#18542a] hover:shadow-md transition-all group">
                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e6dec9] border border-[#c8b894] text-[#18542a] flex items-center justify-center group-hover:bg-[#18542a] group-hover:text-white group-hover:border-[#18542a] transition-all">
                    <Leaf className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <h4 className="font-urbanist font-extrabold text-xs sm:text-sm md:text-base text-[#103b1d] mt-3 group-hover:text-[#18542a] transition-colors leading-snug">
                    Naturally Stone-Ground
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#556b54] font-medium leading-relaxed mt-1">
                    Preserves organic fibers
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COMPACT HORIZONTAL BAR BELOW: CERTIFIED QUALITY STANDARDS IN BEIGE */}
        <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-xl p-3.5 sm:p-4 space-y-2.5 text-center shadow-xs">
          <h4 className="font-urbanist font-extrabold text-[10px] sm:text-xs text-[#18542a] uppercase tracking-widest">
            CERTIFIED TRADITIONAL AND ORGANIC QUALITY STANDARDS
          </h4>

          {/* Compact 4 Logo Badges Frame */}
          <div className="flex items-center justify-between sm:justify-center gap-2.5 sm:gap-5 overflow-x-auto pb-0.5 scrollbar-none">
            <div className="flex-1 sm:flex-none min-w-[70px] sm:w-32 h-10 bg-[#e6dec9] border border-[#c8b894] rounded-lg flex items-center justify-center font-urbanist font-black text-[10px] sm:text-xs text-[#103b1d] uppercase tracking-wider shadow-2xs hover:border-[#18542a] transition-all cursor-default">
              USDA ORGANIC
            </div>
            <div className="flex-1 sm:flex-none min-w-[70px] sm:w-32 h-10 bg-[#e6dec9] border border-[#c8b894] rounded-lg flex items-center justify-center font-urbanist font-black text-[10px] sm:text-xs text-[#103b1d] uppercase tracking-wider shadow-2xs hover:border-[#18542a] transition-all cursor-default">
              FSSAI CERTIFIED
            </div>
            <div className="flex-1 sm:flex-none min-w-[70px] sm:w-32 h-10 bg-[#e6dec9] border border-[#c8b894] rounded-lg flex items-center justify-center font-urbanist font-black text-[10px] sm:text-xs text-[#103b1d] uppercase tracking-wider shadow-2xs hover:border-[#18542a] transition-all cursor-default">
              SGS BIO-VERIFIED
            </div>
            <div className="flex-1 sm:flex-none min-w-[70px] sm:w-32 h-10 bg-[#e6dec9] border border-[#c8b894] rounded-lg flex items-center justify-center font-urbanist font-black text-[10px] sm:text-xs text-[#103b1d] uppercase tracking-wider shadow-2xs hover:border-[#18542a] transition-all cursor-default">
              APEDA PURE
            </div>
          </div>
        </div>
      </section>





      {/* 10. CUSTOMER REVIEWS (SLIDING MOBILE CAROUSEL & DESKTOP GRID) */}
      <CustomerReviews />



      </div>
    </div>
  );
}

