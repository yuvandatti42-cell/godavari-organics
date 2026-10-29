import React from 'react';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import FeaturedHarvestProducts from '../components/FeaturedHarvestProducts';
import WhyChooseArma from '../components/WhyChooseArma';
import CustomerReviews from '../components/CustomerReviews';
import StoreLocation from '../components/StoreLocation';
import { ArrowRight, ArrowUpRight, ShieldCheck, Users, HeartHandshake, Sprout, CheckCircle2, Award, Leaf, Truck, Sparkles, MapPin, Gift, Image, PhoneCall } from 'lucide-react';

export default function Home() {
  const { setCurrentPage, products, categories, showToast } = useCart();

  const popularProducts = products.filter(p => p.isPopular);

  return (
    <div className="w-full font-sans bg-[#faf5ea] text-[#103b1d]">
      
      {/* 1. HERO SLIDER SECTION — DYNAMIC BACKGROUND transitions, DUAL BUTTONS, NO FRAMES */}
      <HeroSlider />

      {/* Main Page Body Container (Top Section) - Expanded to Full Desktop Width */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 sm:pt-10 pb-2">

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

        {/* STANDALONE CERTIFIED QUALITY STANDARDS BADGES */}
        {/* Desktop: One single horizontal line | Mobile: Continuous smooth right-to-left marquee scroll */}
        <div className="mt-2 sm:mt-4 mb-3 sm:mb-5 py-1.5 sm:py-2 overflow-hidden">
          {/* Mobile continuous right-to-left marquee scroll (< sm) */}
          <div className="block sm:hidden w-full overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex items-center space-x-8 py-1.5">
              <div className="flex items-center space-x-8 shrink-0">
                <img src="/fssai.webp" alt="FSSAI Certified" className="h-9 w-auto object-contain" />
                <img src="/USDA.gif" alt="USDA Organic" className="h-10 w-auto object-contain" />
                <img src="/SGS.png" alt="SGS Bio-Verified" className="h-9 w-auto object-contain" />
                <img src="/apeda-pure.png" alt="APEDA Pure" className="h-10 w-auto object-contain" />
              </div>
              {/* Duplicated set for seamless continuous right-to-left marquee loop on mobile */}
              <div className="flex items-center space-x-8 shrink-0">
                <img src="/fssai.webp" alt="FSSAI Certified" className="h-9 w-auto object-contain" />
                <img src="/USDA.gif" alt="USDA Organic" className="h-10 w-auto object-contain" />
                <img src="/SGS.png" alt="SGS Bio-Verified" className="h-9 w-auto object-contain" />
                <img src="/apeda-pure.png" alt="APEDA Pure" className="h-10 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Desktop floating logos row (>= sm) */}
          <div className="hidden sm:flex items-center justify-around gap-6 md:gap-10 lg:gap-14 py-2 px-4 max-w-4xl mx-auto">
            <img 
              src="/fssai.webp" 
              alt="FSSAI Certified" 
              className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer" 
            />
            <img 
              src="/USDA.gif" 
              alt="USDA Organic" 
              className="h-12 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer" 
            />
            <img 
              src="/SGS.png" 
              alt="SGS Bio-Verified" 
              className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer" 
            />
            <img 
              src="/apeda-pure.png" 
              alt="APEDA Pure" 
              className="h-12 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer" 
            />
          </div>
        </div>

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
        <section className="max-w-3xl mx-auto text-center px-4 py-4 sm:py-6 space-y-3">
          <span className="font-reatro text-xs sm:text-sm md:text-base text-[#f96015] uppercase tracking-wider block">
            Pure & Authentic Organic Craft
          </span>
          <h2 className="font-reatro text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#18542a] leading-relaxed tracking-normal">
            "Our produce is grown in the fertile Godavari river delta using traditional organic methods, offering a pure, authentic taste experience that is perfect for enhancing every meal."
          </h2>
          <div className="w-14 h-1 bg-[#9abc05] mx-auto rounded-full mt-3"></div>
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

      {/* 8. WHY CHOOSE ARMA */}
      <section className="space-y-5 sm:space-y-6">
        <WhyChooseArma />
      </section>

      {/* Sleek Minimal Quick Callback Bar - Seamless with No Background Card */}
      <section className="w-full py-4 sm:py-6">
        <div className="max-w-xl mx-auto px-4 text-center space-y-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#18542a]">
              <PhoneCall className="w-3.5 h-3.5 text-[#18542a]" />
              Quick Callback
            </span>
            <h3 className="font-urbanist font-extrabold text-lg sm:text-2xl text-[#103b1d] tracking-tight">
              Have questions? We'll call you right back
            </h3>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const phone = form.clientPhone.value.trim();
              if (phone) {
                showToast(`Thank you! We'll call you at ${phone} shortly.`);
                form.reset();
              } else {
                showToast('Please enter your phone number.');
              }
            }}
            className="flex items-center w-full max-w-md mx-auto bg-white border border-[#d9ca9d] rounded-full p-1 sm:p-1.5 pl-4 sm:pl-5 shadow-xs focus-within:border-[#18542a] focus-within:ring-2 focus-within:ring-[#18542a]/20 transition-all"
          >
            <input 
              type="tel" 
              name="clientPhone"
              required
              placeholder="Enter your phone number..."
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#103b1d] placeholder-[#556b54]/60 focus:outline-none font-medium min-w-0"
            />
            <button 
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#18542a] hover:bg-[#103b1d] text-white text-xs sm:text-sm font-bold rounded-full shadow-xs transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
            >
              <span>Request Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS (SLIDING MOBILE CAROUSEL & DESKTOP GRID) */}
      <CustomerReviews />

      {/* 11. STORE & MILL LOCATION (GOOGLE MAPS) */}
      <StoreLocation />



      </div>
    </div>
  );
}

