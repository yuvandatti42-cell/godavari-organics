import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ShieldCheck, Users, Leaf, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

const WHY_CHOOSE_ITEMS = [
  {
    id: 1,
    title: '100% Certified Organic',
    subtitle: 'Completely trace pesticide-free & unadulterated from native fertile soil.',
    icon: CheckCircle2,
    badge: 'Certified Organic',
    productName: 'Godavari Basmati Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=900',
    color: '#18542a',
    highlight: 'Zero Chemicals',
    tag: 'APEDA Certified'
  },
  {
    id: 2,
    title: 'Rigorous Bio-Testing',
    subtitle: 'Lab tested nutrition & micro-analyzed purity guaranteed for each harvest.',
    icon: ShieldCheck,
    badge: 'Lab Tested Purity',
    productName: 'Wild Harvest Turmeric',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=900',
    color: '#d97706',
    highlight: 'High Curcumin',
    tag: 'SGS Bio-Verified'
  },
  {
    id: 3,
    title: 'Fair-Trade Agriculture',
    subtitle: 'Direct economic empowerment & transparent pricing for AP farm families.',
    icon: Users,
    badge: 'Cooperative Model',
    productName: 'Traditional Organic Jaggery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=900',
    color: '#9abc05',
    highlight: 'Farmer Direct',
    tag: 'Fair-Trade Pricing'
  },
  {
    id: 4,
    title: 'Naturally Stone-Ground',
    subtitle: 'Cold-milled extraction preserving vital organic fibers and raw nutrients.',
    icon: Leaf,
    badge: 'Wood-Pressed Oils',
    productName: 'Pure Cold Pressed Oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=900',
    color: '#047857',
    highlight: 'Cold-Pressed',
    tag: 'Traditional Churn'
  }
];

export default function WhyChooseArma() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const progressIntervalRef = useRef(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % WHY_CHOOSE_ITEMS.length);
    setSlideProgress(0);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + WHY_CHOOSE_ITEMS.length) % WHY_CHOOSE_ITEMS.length);
    setSlideProgress(0);
  };

  // Progress bar animation timer
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 4000;
    const stepTime = 50;
    const increment = (stepTime / intervalTime) * 100;

    progressIntervalRef.current = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, activeIndex]);

  // Touch Swipe Handling
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 35;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setTimeout(() => setIsPaused(false), 2500);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      
      {/* ======================================================== */}
      {/* DESKTOP VIEW (>= md): ELEGANT 4-COLUMN CARDS WITH HOVER LIFT */}
      {/* ======================================================== */}
      <div className="hidden md:block space-y-5 text-left">
        <div className="flex items-end justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-[#18542a]/10 text-[#18542a] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#e5a00d]" />
              <span>Arma Standard</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-2xl lg:text-3xl text-[#103b1d] tracking-tight">
              Why Choose Arma
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-[#556b54] font-medium max-w-md text-right">
            Every grain, oil, and spice verified with complete traceability from certified Andhra family farms.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {WHY_CHOOSE_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-[#f7f2e4] hover:bg-white border border-[#d9ca9d] hover:border-[#18542a] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between text-left cursor-pointer transform hover:-translate-y-2"
              >
                {/* Top Image Preview Frame with subtle zoom */}
                <div className="relative h-44 w-full overflow-hidden bg-[#e6dec9]">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle dark gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#18542a] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-white/40 shadow-xs flex items-center space-x-1">
                    <IconComponent className="w-3 h-3 text-[#18542a]" />
                    <span>{item.badge}</span>
                  </div>

                  {/* Highlight pill */}
                  <div className="absolute bottom-2.5 left-3">
                    <span className="text-[10px] font-extrabold tracking-wider text-[#c2eb4c] uppercase drop-shadow-sm">
                      {item.productName}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div className="space-y-1.5">
                    <h4 className="font-urbanist font-extrabold text-base text-[#103b1d] group-hover:text-[#18542a] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#556b54] font-medium leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Bottom trust footer */}
                  <div className="pt-2 border-t border-[#d9ca9d]/60 flex items-center justify-between text-[11px] font-bold text-[#18542a]">
                    <span>{item.tag}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#18542a] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE VIEW (< md): HIGHLY ANIMATED 3D STACKED DECK */}
      {/* ======================================================== */}
      <div className="block md:hidden space-y-3.5 text-left w-full overflow-hidden py-1">
        
        {/* Mobile Header with Badge and Index Counter */}
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-[#18542a]/10 text-[#18542a] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-[#e5a00d]" />
              <span>Arma Standard</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-xl text-[#103b1d] tracking-tight">
              Why Choose Arma
            </h2>
          </div>

          {/* Glowing Slide Counter Badge */}
          <div className="bg-[#f3e8cc] border border-[#d9ca9d] px-3 py-1 rounded-full text-xs font-urbanist font-extrabold text-[#103b1d] shadow-2xs flex items-center space-x-1">
            <span className="text-[#18542a]">0{activeIndex + 1}</span>
            <span className="text-[#556b54]/50">/</span>
            <span className="text-[#556b54]">0{WHY_CHOOSE_ITEMS.length}</span>
          </div>
        </div>

        {/* 3D PERSPECTIVE DECK CONTAINER */}
        <div 
          className="relative w-full h-[410px] sm:h-[430px] flex items-center justify-center select-none"
          style={{ perspective: '1100px' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {WHY_CHOOSE_ITEMS.map((item, index) => {
            const IconComponent = item.icon;
            const total = WHY_CHOOSE_ITEMS.length;
            
            // Calculate relative offset from active slide: (-1, 0, 1)
            let offset = (index - activeIndex + total) % total;
            if (offset > total / 2) offset -= total;

            const isActive = offset === 0;
            const isNext = offset === 1;
            const isPrev = offset === -1;

            // Smooth 3D Stack transforms with tilt and scale
            let transformStyle = '';
            let opacityVal = 0;
            let zIndexVal = 0;
            let filterVal = 'none';

            if (isActive) {
              transformStyle = 'translateX(0%) translateY(0px) scale(1) rotate(0deg)';
              opacityVal = 1;
              zIndexVal = 30;
              filterVal = 'none';
            } else if (isNext) {
              transformStyle = 'translateX(28%) translateY(10px) scale(0.88) rotate(4deg)';
              opacityVal = 0.55;
              zIndexVal = 20;
              filterVal = 'brightness(0.9)';
            } else if (isPrev) {
              transformStyle = 'translateX(-28%) translateY(10px) scale(0.88) rotate(-4deg)';
              opacityVal = 0.55;
              zIndexVal = 10;
              filterVal = 'brightness(0.9)';
            } else {
              transformStyle = 'translateX(0%) translateY(30px) scale(0.75) rotate(0deg)';
              opacityVal = 0;
              zIndexVal = 0;
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isActive) {
                    setActiveIndex(index);
                    setSlideProgress(0);
                  }
                }}
                className={`absolute top-0 w-[86%] sm:w-[82%] h-full rounded-3xl overflow-hidden border border-[#d9ca9d] flex flex-col justify-end transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
                  isActive ? 'pointer-events-auto cursor-default' : 'pointer-events-auto cursor-pointer hover:opacity-80'
                }`}
                style={{
                  transform: transformStyle,
                  opacity: opacityVal,
                  zIndex: zIndexVal,
                  filter: filterVal,
                  boxShadow: isActive ? '0 24px 48px -12px rgba(16, 59, 29, 0.4)' : '0 10px 25px -8px rgba(0,0,0,0.2)'
                }}
              >
                {/* Full Cover High-Res Image with Slow Zoom on Active */}
                <img 
                  src={item.image} 
                  alt={item.productName} 
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Rich Gradient Scrim for optimal contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15 pointer-events-none" />

                {/* Animated Story Timer Progress Bar (Only visible on active card) */}
                {isActive && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/20 z-40 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#c2eb4c] to-[#9abc05] transition-all duration-75 ease-linear"
                      style={{ width: `${slideProgress}%` }}
                    />
                  </div>
                )}

                {/* Top Badge Overlay */}
                <div className="absolute top-3.5 left-3.5 z-20 bg-black/45 backdrop-blur-md border border-white/25 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg">
                  <IconComponent className="w-3.5 h-3.5 text-[#c2eb4c]" />
                  <span>{item.badge}</span>
                </div>

                {/* Top Right Mini Index Counter */}
                <div className="absolute top-3.5 right-3.5 z-20 bg-black/45 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                  <span>0{index + 1}</span>
                </div>

                {/* Active Card Content Area - Cleanly hidden on side cards to eliminate visual cutoffs */}
                <div 
                  className={`relative z-20 p-5 sm:p-6 pb-4 pt-6 text-left text-white space-y-2 transition-all duration-500 ease-out ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-[#c2eb4c] uppercase tracking-wider block">
                      {item.productName}
                    </span>
                    <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-white/95">
                      {item.highlight}
                    </span>
                  </div>
                  
                  <h4 className="font-urbanist font-extrabold text-xl text-white leading-snug drop-shadow-sm">
                    {item.title}
                  </h4>
                  
                  <p className="text-xs text-stone-200/95 font-medium leading-relaxed">
                    {item.subtitle}
                  </p>

                  {/* Interactive swipe explore footer */}
                  <div className="pt-2.5 flex items-center justify-between text-[10px] text-white/80 font-bold border-t border-white/20 mt-2">
                    <span className="flex items-center space-x-1.5 text-stone-300">
                      <span className="w-2 h-2 rounded-full bg-[#c2eb4c] animate-pulse" />
                      <span>Swipe or tap deck to explore</span>
                    </span>
                    <span className="text-[#c2eb4c] font-extrabold tracking-wide">{item.tag}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DECK NAVIGATION CONTROLS (Smooth Circular Arrows + Expanding Indicator Pills) */}
        <div className="flex items-center justify-between px-3 pt-1">
          {/* Previous Arrow Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#d9ca9d] text-[#18542a] flex items-center justify-center active:scale-90 hover:bg-[#18542a] hover:text-white transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Interactive Expanding Dots */}
          <div className="flex items-center space-x-1.5">
            {WHY_CHOOSE_ITEMS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setSlideProgress(0);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === activeIndex 
                    ? 'w-8 bg-[#18542a] shadow-xs' 
                    : 'w-2 bg-[#d9ca9d] hover:bg-[#18542a]/40'
                }`}
              />
            ))}
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#d9ca9d] text-[#18542a] flex items-center justify-center active:scale-90 hover:bg-[#18542a] hover:text-white transition-all shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
