import React from 'react';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import FeaturedHarvestProducts from '../components/FeaturedHarvestProducts';
import WhyChooseArma from '../components/WhyChooseArma';
import CustomerReviews from '../components/CustomerReviews';
import StoreLocation from '../components/StoreLocation';
import { ArrowRight, PhoneCall } from 'lucide-react';

export default function Home() {
  const { 
    setCurrentPage, 
    products, 
    categories, 
    showToast, 
    setSelectedCategoryFilter 
  } = useCart();

  const popularProducts = products.filter(p => p.isPopular);

  return (
    <div className="w-full font-sans bg-[#faf5ea] text-[#103b1d]">
      <h1 className="sr-only">Godavari Organic Foods — Pure, Authentic Farm Harvest Direct to Your Doorstep</h1>
      
      {/* 1. HERO SLIDER SECTION */}
      <HeroSlider />

      {/* Main Page Body Container */}
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

      </div>

      {/* 4. FULL-WIDTH TICKER MARQUEE BAR */}
      <section className="w-full bg-[#18542a] text-[#ffc926] py-3 sm:py-3.5 border-y border-[#9abc05]/40 overflow-hidden shadow-sm relative z-20 my-4 sm:my-6">
        <div className="animate-marquee whitespace-nowrap flex items-center text-xs sm:text-sm font-extrabold uppercase tracking-widest">
          <div className="flex items-center space-x-8 sm:space-x-12 shrink-0 pr-8 sm:pr-12">
            <span>GREAT TASTE</span>
            <span className="text-[#9abc05]">•</span>
            <span>FAST DELIVERY GUARANTEED</span>
            <span className="text-[#9abc05]">•</span>
            <span>SUSTAINABLE PRODUCTION PRACTICES</span>
            <span className="text-[#9abc05]">•</span>
            <span>NATURAL & WHOLESOME INGREDIENTS</span>
            <span className="text-[#9abc05]">•</span>
          </div>
          <div className="flex items-center space-x-8 sm:space-x-12 shrink-0 pr-8 sm:pr-12">
            <span>GREAT TASTE</span>
            <span className="text-[#9abc05]">•</span>
            <span>FAST DELIVERY GUARANTEED</span>
            <span className="text-[#9abc05]">•</span>
            <span>SUSTAINABLE PRODUCTION PRACTICES</span>
            <span className="text-[#9abc05]">•</span>
            <span>NATURAL & WHOLESOME INGREDIENTS</span>
            <span className="text-[#9abc05]">•</span>
          </div>
        </div>
      </section>

      {/* Main Page Body Container (Lower Section) */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 space-y-10 sm:space-y-14">

        {/* 5. EDITORIAL BRAND INTRO STATEMENT */}
        <section className="max-w-3xl mx-auto text-center px-4 py-4 sm:py-6 space-y-3">
          <span className="font-reatro text-xs sm:text-sm md:text-base text-[#f96015] uppercase tracking-wider block">
            Pure & Authentic Organic Craft
          </span>
          <h2 className="font-reatro text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#18542a] leading-relaxed tracking-normal">
            "Our produce is grown in the fertile Godavari river delta using traditional organic methods, offering a pure, authentic taste experience that is perfect for enhancing every meal."
          </h2>
          <div className="w-14 h-1 bg-[#9abc05] mx-auto rounded-full mt-3"></div>
        </section>

        {/* FEATURED HARVEST PRODUCTS SECTION */}
        <FeaturedHarvestProducts />

        {/* POPULAR PRODUCTS GRID */}
        <section className="hidden md:block space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight">
              Popular Products
            </h2>
            <button 
              onClick={() => { if (setSelectedCategoryFilter) setSelectedCategoryFilter(''); setCurrentPage('shop'); }}
              aria-label="Explore Full Store harvest catalog"
              className="inline-flex items-center space-x-1 font-urbanist font-extrabold text-xs sm:text-sm text-[#103b1d] hover:text-[#18542a] underline underline-offset-4 transition-colors cursor-pointer"
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

        {/* WHY CHOOSE ARMA REELS */}
        <section id="why-choose-arma" className="space-y-5 sm:space-y-6">
          <WhyChooseArma />
        </section>

        {/* Sleek Minimal Quick Callback Bar */}
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
              <label htmlFor="quick-callback-phone" className="sr-only">Phone number for callback</label>
              <input 
                type="tel" 
                id="quick-callback-phone"
                name="clientPhone"
                aria-label="Enter your phone number for callback"
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

        {/* CUSTOMER REVIEWS (SIDE BY SIDE AUTO-SCROLLING TICKER) */}
        <CustomerReviews />

        {/* STORE & MILL LOCATION (GOOGLE MAPS) */}
        <StoreLocation />

      </div>
    </div>
  );
}
