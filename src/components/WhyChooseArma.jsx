import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ShieldCheck, Users, Leaf, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const WHY_CHOOSE_ITEMS = [
  {
    id: 1,
    title: '100% Certified Organic',
    subtitle: 'Completely trace pesticide-free & unadulterated',
    icon: CheckCircle2,
    badge: 'Certified Organic',
    productName: 'Godavari Basmati Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    color: '#18542a'
  },
  {
    id: 2,
    title: 'Rigorous Bio-Testing',
    subtitle: 'Lab tested nutrition & micro-analyzed purity',
    icon: ShieldCheck,
    badge: 'Lab Tested Purity',
    productName: 'Wild Harvest Turmeric',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    color: '#d97706'
  },
  {
    id: 3,
    title: 'Fair-Trade Agriculture',
    subtitle: 'Direct economic empowerment to AP farm families',
    icon: Users,
    badge: 'Cooperative Model',
    productName: 'Traditional Organic Jaggery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    color: '#9abc05'
  },
  {
    id: 4,
    title: 'Naturally Stone-Ground',
    subtitle: 'Cold-milled extraction preserving vital organic fibers',
    icon: Leaf,
    badge: 'Wood-Pressed Oils',
    productName: 'Pure Cold Pressed Oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    color: '#047857'
  }
];

export default function WhyChooseArma() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % WHY_CHOOSE_ITEMS.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + WHY_CHOOSE_ITEMS.length) % WHY_CHOOSE_ITEMS.length);
  };

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, activeIndex]);

  // Swipe handling
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
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      nextSlide(); // Swiped left -> next card
    } else if (distance < -minSwipeDistance) {
      prevSlide(); // Swiped right -> prev card
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* DESKTOP VIEW (md:flex) - Original 2x2 Grid design maintained */}
      <div className="hidden md:flex md:flex-col md:justify-between space-y-3 sm:space-y-4 text-left h-full">
        <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight">
          Why Choose Arma
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
          {WHY_CHOOSE_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id} 
                className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl p-4 sm:p-5 flex flex-col justify-between text-left hover:border-[#18542a] hover:shadow-md transition-all group cursor-pointer"
              >
                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e6dec9] border border-[#c8b894] text-[#18542a] flex items-center justify-center group-hover:bg-[#18542a] group-hover:text-white group-hover:border-[#18542a] transition-all">
                    <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <h4 className="font-urbanist font-extrabold text-xs sm:text-sm md:text-base text-[#103b1d] mt-3 group-hover:text-[#18542a] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#556b54] font-medium leading-relaxed mt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE VIEW (md:hidden) - FULL COVER IMAGE GALLERY DECK */}
      <div className="block md:hidden space-y-3 text-left w-full overflow-hidden py-1">
        {/* Mobile Title Header with Slide Index */}
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="inline-flex items-center space-x-1 bg-[#18542a]/10 text-[#18542a] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-[#ffc926]" />
              <span>Arma Standard</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-xl text-[#103b1d] tracking-tight">
              Why Choose Arma
            </h2>
          </div>

          {/* Slider Count Badge */}
          <div className="bg-[#f3e8cc] border border-[#d9ca9d] px-3 py-1 rounded-full text-xs font-urbanist font-extrabold text-[#103b1d] shadow-2xs">
            <span className="text-[#18542a]">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="text-[#556b54]/60 mx-1">/</span>
            <span className="text-[#556b54]">{String(WHY_CHOOSE_ITEMS.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Dynamic Gallery Deck Carousel Container */}
        <div 
          className="relative w-full h-[360px] sm:h-[380px] px-2 flex items-center justify-center touch-pan-y select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {WHY_CHOOSE_ITEMS.map((item, index) => {
            const IconComponent = item.icon;
            
            // Calculate relative offset from active slide
            const total = WHY_CHOOSE_ITEMS.length;
            let offset = (index - activeIndex + total) % total;
            if (offset > total / 2) offset -= total; // Handle wrap-around (-1, 0, 1, 2)

            // Styling logic for 3D stacked deck effect
            let transformClass = '';
            let opacityClass = 'opacity-0 pointer-events-none z-0';

            if (offset === 0) {
              // ACTIVE CARD (Center front)
              transformClass = 'translate-x-0 scale-100 z-30 shadow-xl';
              opacityClass = 'opacity-100 pointer-events-auto';
            } else if (offset === 1) {
              // NEXT CARD (Peeking from right with transparency)
              transformClass = 'translate-x-[22%] scale-[0.88] z-20 shadow-md translate-y-2';
              opacityClass = 'opacity-55 pointer-events-auto cursor-pointer hover:opacity-80';
            } else if (offset === -1 || offset === total - 1) {
              // PREVIOUS CARD (Peeking from left with transparency)
              transformClass = '-translate-x-[22%] scale-[0.88] z-10 shadow-sm translate-y-2';
              opacityClass = 'opacity-40 pointer-events-auto cursor-pointer hover:opacity-70';
            } else if (offset === 2) {
              // FAR NEXT CARD
              transformClass = 'translate-x-[38%] scale-[0.76] z-0';
              opacityClass = 'opacity-20 pointer-events-none';
            } else {
              // FAR PREV CARD
              transformClass = '-translate-x-[38%] scale-[0.76] z-0';
              opacityClass = 'opacity-0 pointer-events-none';
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (offset !== 0) {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute top-0 w-[86%] sm:w-[82%] h-full rounded-3xl overflow-hidden border border-[#d9ca9d] shadow-lg flex flex-col justify-end transition-all duration-500 ease-out transform ${transformClass} ${opacityClass}`}
                style={{
                  boxShadow: offset === 0 ? '0 16px 36px -6px rgba(16, 59, 29, 0.3)' : 'none'
                }}
              >
                {/* Full Cover Product Image (NO inner frames/boxes) */}
                <img 
                  src={item.image} 
                  alt={item.productName} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay for optimal contrast & text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 bg-[#18542a]/90 backdrop-blur-md text-[#ffc926] text-[10px] font-extrabold px-3 py-1 rounded-full border border-[#9abc05]/40 flex items-center space-x-1.5 shadow-md">
                  <IconComponent className="w-3.5 h-3.5 text-[#ffc926]" />
                  <span>{item.badge}</span>
                </div>

                {/* Bottom Content Area with small padding */}
                <div className="relative z-10 p-4 pb-3 pt-6 text-left text-white space-y-1.5">
                  <span className="text-[10px] font-extrabold text-[#c2eb4c] uppercase tracking-wider block">
                    {item.productName}
                  </span>
                  
                  <h4 className="font-urbanist font-extrabold text-lg text-white leading-snug drop-shadow-sm flex items-center space-x-2">
                    <span>{item.title}</span>
                  </h4>
                  
                  <p className="text-xs text-stone-200/90 font-medium leading-relaxed">
                    {item.subtitle}
                  </p>

                  {/* Swipe hint on active card */}
                  {offset === 0 && (
                    <div className="pt-2 flex items-center justify-between text-[10px] text-white/80 font-bold border-t border-white/20 mt-2">
                      <span className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c2eb4c] animate-ping" />
                        <span>Swipe or tap deck to explore</span>
                      </span>
                      <span className="text-[#c2eb4c]">100% Pure</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Deck Navigation Bar (Arrows + Dot Indicators) */}
        <div className="flex items-center justify-between px-3 pt-1">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="w-8 h-8 rounded-full bg-[#f3e8cc] border border-[#d9ca9d] text-[#18542a] flex items-center justify-center active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Interactive Dot Indicators */}
          <div className="flex items-center space-x-1.5">
            {WHY_CHOOSE_ITEMS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex 
                    ? 'w-7 bg-[#18542a]' 
                    : 'w-2 bg-[#d9ca9d] hover:bg-[#18542a]/40'
                }`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="w-8 h-8 rounded-full bg-[#f3e8cc] border border-[#d9ca9d] text-[#18542a] flex items-center justify-center active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
