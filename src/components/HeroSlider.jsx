import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sprout, Cog, Droplets } from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    productId: 'p_oil_groundnut',
    eyebrow: 'COLD PRESSED / WOODEN PRESSED',
    headlineMain: 'Know your oil.',
    headlineSub: 'Trust every meal.',
    subtitle: 'Discover the flavour. Explore the traditional slow wooden pressing process.',
    title: '100% Pure Cold Pressed Natural Oils',
    bannerImage: '/banners/banner_oil.jpg',
    buttonText: 'Shop Oils',
    buttonTextColor: 'text-[#18542a]'
  },
  {
    id: 'slide-2',
    productId: 'p_ghee_cow',
    eyebrow: 'VEDIC BILONA METHOD / A2 GIR COW',
    headlineMain: 'Pure Vedic ghee.',
    headlineSub: 'Golden aroma.',
    subtitle: 'Slow simmered bilona ghee handcrafted from cultured curd of grass-fed desi cows.',
    title: 'Pure Vedic Bilona Desi Cow A2 Ghee',
    bannerImage: '/banners/banner_ghee.jpg',
    buttonText: 'Shop Ghee',
    buttonTextColor: 'text-[#92400e]'
  },
  {
    id: 'slide-3',
    productId: 'p_millet_foxtail',
    eyebrow: 'WHOLESOME GRAINS / ZERO CHEMICALS',
    headlineMain: 'Ancient millets.',
    headlineSub: 'Pure daily energy.',
    subtitle: 'Unpolished traditional grains sourced directly from fertile Godavari river delta farms.',
    title: 'Wholesome Millet Power & Siridhanya',
    bannerImage: '/hero.png',
    buttonText: 'Shop Millets',
    buttonTextColor: 'text-[#18542a]'
  },
  {
    id: 'slide-4',
    productId: 'p_rice_red',
    eyebrow: 'HERITAGE HARVEST / GODAVARI DELTA',
    headlineMain: 'Heritage rice.',
    headlineSub: 'Rooted in health.',
    subtitle: 'Naturally grown red, black & aged sona masoori rice harvested from native heirloom seeds.',
    title: 'Traditional Godavari Heritage Rice',
    bannerImage: '/banners/banner_rice.jpg',
    buttonText: 'Shop Rice',
    buttonTextColor: 'text-[#991b1b]'
  },
  {
    id: 'slide-5',
    productId: 'p_spice_turmeric',
    eyebrow: 'STONE GROUND / HIGH CURCUMIN',
    headlineMain: 'Authentic spices.',
    headlineSub: 'Real farm aroma.',
    subtitle: 'Hand-picked turmeric, chillies, and aromatic whole spices with zero adulteration.',
    title: 'Pure Stone Ground Spices & Turmeric',
    bannerImage: '/banners/banner_spices.jpg',
    buttonText: 'Shop Spices',
    buttonTextColor: 'text-[#78350f]'
  }
];

// Extended slides array with clones at start and end for seamless infinite looping (Mobile Carousel - 100% UNTOUCHED)
const EXTENDED_SLIDES = [
  { ...HERO_SLIDES[HERO_SLIDES.length - 1], id: 'clone-start' },
  ...HERO_SLIDES,
  { ...HERO_SLIDES[0], id: 'clone-end' }
];

export default function HeroSlider() {
  const { setCurrentPage, navigateToProduct } = useCart();
  
  // Mobile Carousel State (Kept completely intact)
  const [virtualIndex, setVirtualIndex] = useState(1);
  const [isPlaying] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const scrollContainerRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);
  const interactionTimerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Desktop Hero Carousel State
  // Starts at index 0 (Cold Pressed Oils: "Know your oil. Trust every meal.")
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [isDesktopHovered, setIsDesktopHovered] = useState(false);

  // Desktop Auto-Play: transitions smoothly every 5.5 seconds when not hovered
  useEffect(() => {
    if (isDesktopHovered) return;
    const interval = setInterval(() => {
      setDesktopIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isDesktopHovered]);

  const handlePrevDesktop = (e) => {
    if (e) e.stopPropagation();
    setDesktopIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextDesktop = (e) => {
    if (e) e.stopPropagation();
    setDesktopIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleSeeProcess = () => {
    const el = document.getElementById('why-choose-arma');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 750, behavior: 'smooth' });
    }
  };

  // Helper to scroll to specific virtual index programmatically (Mobile)
  const scrollToVirtualIndex = useCallback((targetIndex, behavior = 'smooth') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const card = container.children[targetIndex];
    if (card) {
      isProgrammaticScrollRef.current = true;
      setVirtualIndex(targetIndex);
      
      const targetScrollLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({ left: targetScrollLeft, behavior });
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        
        // Handle clone wrap-arounds
        if (targetIndex === EXTENDED_SLIDES.length - 1) {
          const firstRealCard = container.children[1];
          if (firstRealCard) {
            const firstScrollLeft = firstRealCard.offsetLeft - (container.clientWidth - firstRealCard.clientWidth) / 2;
            container.scrollTo({ left: firstScrollLeft, behavior: 'instant' });
            setVirtualIndex(1);
          }
        } else if (targetIndex === 0) {
          const lastRealCard = container.children[HERO_SLIDES.length];
          if (lastRealCard) {
            const lastScrollLeft = lastRealCard.offsetLeft - (container.clientWidth - lastRealCard.clientWidth) / 2;
            container.scrollTo({ left: lastScrollLeft, behavior: 'instant' });
            setVirtualIndex(HERO_SLIDES.length);
          }
        }
      }, behavior === 'instant' ? 0 : 450);
    }
  }, []);

  // Initial scroll positioning (Mobile)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.children[1];
      if (card) {
        const targetScrollLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
        container.scrollLeft = targetScrollLeft;
      }
    }
  }, []);

  // Auto-slide effect for mobile
  useEffect(() => {
    if (!isPlaying || isInteracting) return;
    const interval = setInterval(() => {
      setVirtualIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        scrollToVirtualIndex(nextIndex, 'smooth');
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, isInteracting, scrollToVirtualIndex]);

  // User Interaction Handlers (Mobile)
  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  };

  const handleInteractionEnd = () => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3500);
  };

  const handleDotClick = (index) => {
    handleInteractionStart();
    const targetVirtual = index + 1;
    scrollToVirtualIndex(targetVirtual, 'smooth');
    handleInteractionEnd();
  };

  const handleSlideClick = (productId) => {
    if (productId && navigateToProduct) {
      navigateToProduct(productId);
    } else {
      setCurrentPage('shop');
    }
  };

  // Scroll listener for mobile touch swipe
  const handleScroll = () => {
    if (isProgrammaticScrollRef.current || !scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;
    
    let closestIndex = 1;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== virtualIndex) {
      setVirtualIndex(closestIndex);
    }

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      if (isProgrammaticScrollRef.current) return;
      if (closestIndex === EXTENDED_SLIDES.length - 1) {
        const firstRealCard = container.children[1];
        if (firstRealCard) {
          const targetScroll = firstRealCard.offsetLeft - (container.clientWidth - firstRealCard.clientWidth) / 2;
          container.scrollTo({ left: targetScroll, behavior: 'instant' });
          setVirtualIndex(1);
        }
      } else if (closestIndex === 0) {
        const lastRealCard = container.children[HERO_SLIDES.length];
        if (lastRealCard) {
          const targetScroll = lastRealCard.offsetLeft - (container.clientWidth - lastRealCard.clientWidth) / 2;
          container.scrollTo({ left: targetScroll, behavior: 'instant' });
          setVirtualIndex(HERO_SLIDES.length);
        }
      }
    }, 150);
  };

  const realIndex = (virtualIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
  const activeDesktopSlide = HERO_SLIDES[desktopIndex];

  return (
    <section className="w-full bg-[#faf5ea] select-none border-b border-[#d9ca9d] relative overflow-hidden py-4 sm:py-6 md:py-0">
      
      {/* ======================================================== */}
      {/* MOBILE RESPONSIVE CAROUSEL (< md)                        */}
      {/* KEPT 100% UNCHANGED AS REQUESTED                         */}
      {/* ======================================================== */}
      <div 
        className="block md:hidden relative group px-3 sm:px-6"
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onTouchCancel={handleInteractionEnd}
      >
        {/* Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex space-x-3 sm:space-x-6 overflow-x-auto snap-x snap-mandatory no-scrollbar py-2 scroll-smooth"
        >
          {EXTENDED_SLIDES.map((slide, index) => (
            <div 
              key={`${slide.id}-${index}`}
              onClick={() => handleSlideClick(slide.productId)}
              className="shrink-0 snap-center relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-lg hover:shadow-2xl border border-black/10 cursor-pointer transition-all duration-300 transform active:scale-[0.99] aspect-[16/10] w-[90vw] max-w-[420px]"
            >
              <img 
                src={slide.bannerImage} 
                alt={slide.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                loading="eager"
                draggable={false}
              />

              {/* Bottom Shadow Gradient */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" />

              {/* Left Side: Shop Now Button */}
              <div className="absolute left-4 sm:left-6 bottom-3.5 sm:bottom-5 z-10">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlideClick(slide.productId);
                  }}
                  className={`px-5 py-2.5 sm:px-6 sm:py-3 bg-white hover:bg-amber-50 ${slide.buttonTextColor || 'text-slate-900'} text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-full shadow-lg border border-white/80 active:scale-95 transition-all inline-flex items-center space-x-1.5 cursor-pointer`}
                >
                  <span>SHOP NOW</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram-Style Fixed Dots (No frame box, clean floating transparent dots) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3.5 sm:bottom-5 z-20 flex items-center space-x-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] pointer-events-auto">
          {HERO_SLIDES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={(e) => {
                e.stopPropagation();
                handleDotClick(dotIdx);
              }}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                realIndex === dotIdx 
                  ? 'w-2 h-2 bg-white scale-125 shadow-sm' 
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/85'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP VIEW (>= md): EDITORIAL HERO MATCHING REFERENCE  */}
      {/* USING ORIGINAL HERO IMAGES                               */}
      {/* ======================================================== */}
      <div 
        className="hidden md:block w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-12"
        onMouseEnter={() => setIsDesktopHovered(true)}
        onMouseLeave={() => setIsDesktopHovered(false)}
      >
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="md:col-span-5 text-left space-y-4 lg:space-y-6">
            
            {/* Category / Process Eyebrow */}
            <div className="text-[11px] lg:text-xs font-extrabold tracking-widest text-[#8c7355] uppercase font-urbanist">
              {activeDesktopSlide.eyebrow}
            </div>

            {/* Serif Headline (Know your oil. Trust every meal.) */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#103b1d] font-normal tracking-tight leading-[1.08]">
              <span className="block">{activeDesktopSlide.headlineMain}</span>
              <span className="block">{activeDesktopSlide.headlineSub}</span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm lg:text-base text-[#4a5849] font-medium leading-relaxed max-w-md">
              {activeDesktopSlide.subtitle}
            </p>

            {/* CTA Dual Buttons */}
            <div className="flex items-center space-x-3 lg:space-x-4 pt-1 sm:pt-2">
              <button 
                onClick={() => handleSlideClick(activeDesktopSlide.productId)}
                className="h-11 lg:h-12 px-6 lg:px-7 bg-[#18542a] hover:bg-[#103b1d] text-white font-bold text-xs lg:text-sm rounded-lg transition-all shadow-sm hover:shadow-md flex items-center space-x-2 group cursor-pointer active:scale-95"
              >
                <span>{activeDesktopSlide.buttonText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={handleSeeProcess}
                className="h-11 lg:h-12 px-6 lg:px-7 bg-transparent hover:bg-[#18542a]/5 text-[#18542a] border border-[#18542a]/30 hover:border-[#18542a] font-bold text-xs lg:text-sm rounded-lg transition-all cursor-pointer active:scale-95"
              >
                <span>See Our Process</span>
              </button>
            </div>

            {/* Refined Carousel Controls: Forest Green Active, Muted Gold Inactive, Circular Buttons */}
            <div className="flex items-center space-x-4 pt-3 lg:pt-4">
              {/* Slide Indicators */}
              <div className="flex items-center space-x-1.5">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDesktopIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                      desktopIndex === idx 
                        ? 'w-9 bg-[#18542a] shadow-2xs' 
                        : 'w-2 bg-[#d9ca9d] hover:bg-[#c8b894]'
                    }`}
                  />
                ))}
              </div>

              {/* Clean Monospace Slide Counter */}
              <span className="text-xs font-bold text-[#8c7355] font-mono tracking-wider tabular-nums select-none">
                0{desktopIndex + 1} / 0{HERO_SLIDES.length}
              </span>

              {/* Circular Prev/Next Arrow Buttons with Elegant Border & Smooth Transitions */}
              <div className="flex items-center space-x-1.5 pl-1">
                <button
                  onClick={handlePrevDesktop}
                  aria-label="Previous Slide"
                  className="w-9 h-9 rounded-full border border-[#d9ca9d] hover:border-[#18542a] bg-white/80 hover:bg-[#18542a] text-[#18542a] hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                </button>
                <button
                  onClick={handleNextDesktop}
                  aria-label="Next Slide"
                  className="w-9 h-9 rounded-full border border-[#d9ca9d] hover:border-[#18542a] bg-white/80 hover:bg-[#18542a] text-[#18542a] hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Original Hero Banner Images */}
          <div className="md:col-span-7 flex items-center justify-center">
            <div 
              onClick={() => handleSlideClick(activeDesktopSlide.productId)}
              className="relative w-full aspect-[16/10] overflow-hidden cursor-pointer group select-none"
            >
              {HERO_SLIDES.map((slide, idx) => (
                <img
                  key={slide.id}
                  src={slide.bannerImage}
                  alt={slide.title}
                  className={`absolute inset-0 w-full h-full object-contain object-center transition-all duration-700 ease-in-out transform ${
                    desktopIndex === idx 
                      ? 'opacity-100 scale-100 z-10' 
                      : 'opacity-0 scale-[1.01] z-0 pointer-events-none'
                  }`}
                  loading={idx === 0 || idx === 1 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </div>

        </div>

        {/* 3-Column Trust Strip (Matching Reference Image) */}
        <div className="w-full border-t border-[#d9ca9d]/50 mt-10 lg:mt-12 pt-6 lg:pt-8 grid grid-cols-3 gap-6 lg:gap-10">
          <div className="flex items-start space-x-3.5 text-left">
            <div className="w-10 h-10 rounded-full border border-[#d9ca9d] bg-white/70 flex items-center justify-center shrink-0 text-[#18542a] shadow-2xs">
              <Sprout className="w-5 h-5 text-[#18542a]" />
            </div>
            <div>
              <h4 className="font-urbanist font-extrabold text-xs lg:text-sm text-[#103b1d]">
                Seed Sourcing
              </h4>
              <p className="text-xs text-[#556b54] font-medium leading-relaxed mt-0.5">
                Thoughtfully sourced, naturally better
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 text-left">
            <div className="w-10 h-10 rounded-full border border-[#d9ca9d] bg-white/70 flex items-center justify-center shrink-0 text-[#18542a] shadow-2xs">
              <Cog className="w-5 h-5 text-[#18542a]" />
            </div>
            <div>
              <h4 className="font-urbanist font-extrabold text-xs lg:text-sm text-[#103b1d]">
                Extraction Process
              </h4>
              <p className="text-xs text-[#556b54] font-medium leading-relaxed mt-0.5">
                Slow pressed for natural flavour
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 text-left">
            <div className="w-10 h-10 rounded-full border border-[#d9ca9d] bg-white/70 flex items-center justify-center shrink-0 text-[#18542a] shadow-2xs">
              <Droplets className="w-5 h-5 text-[#18542a]" />
            </div>
            <div>
              <h4 className="font-urbanist font-extrabold text-xs lg:text-sm text-[#103b1d]">
                Quality Details
              </h4>
              <p className="text-xs text-[#556b54] font-medium leading-relaxed mt-0.5">
                Simple, transparent, honest
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
