import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    productId: 'p_millet_foxtail',
    title: 'Wholesome Millet Power & Siridhanya',
    bannerImage: '/hero.png',
    buttonTextColor: 'text-[#18542a]'
  },
  {
    id: 'slide-2',
    productId: 'p_oil_groundnut',
    title: '100% Pure Cold Pressed Natural Oils',
    bannerImage: '/banners/banner_oil.jpg',
    buttonTextColor: 'text-[#18542a]'
  },
  {
    id: 'slide-3',
    productId: 'p_ghee_cow',
    title: 'Pure Vedic Bilona Desi Cow A2 Ghee',
    bannerImage: '/banners/banner_ghee.jpg',
    buttonTextColor: 'text-[#92400e]'
  },
  {
    id: 'slide-4',
    productId: 'p_rice_red',
    title: 'Traditional Godavari Heritage Rice',
    bannerImage: '/banners/banner_rice.jpg',
    buttonTextColor: 'text-[#991b1b]'
  },
  {
    id: 'slide-5',
    productId: 'p_spice_turmeric',
    title: 'Pure Stone Ground Spices & Turmeric',
    bannerImage: '/banners/banner_spices.jpg',
    buttonTextColor: 'text-[#78350f]'
  }
];

// Extended slides array with clones at start and end for seamless infinite looping
const EXTENDED_SLIDES = [
  { ...HERO_SLIDES[HERO_SLIDES.length - 1], id: 'clone-start' },
  ...HERO_SLIDES,
  { ...HERO_SLIDES[0], id: 'clone-end' }
];

export default function HeroSlider() {
  const { setCurrentPage, navigateToProduct } = useCart();
  const [virtualIndex, setVirtualIndex] = useState(1); // Starts at real slide 1 (index 1)
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const scrollContainerRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);
  const interactionTimerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Helper to scroll to specific virtual index programmatically
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

  // Initial scroll positioning
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

  // Maintain slide alignment on window resize (desktop/tablet resize)
  useEffect(() => {
    const handleResize = () => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const card = container.children[virtualIndex];
      if (card) {
        const targetScrollLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
        container.scrollTo({ left: targetScrollLeft, behavior: 'instant' });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [virtualIndex]);

  // Auto-slide effect (only runs when playing AND user is not interacting)
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

  // User Interaction Handlers (Pause auto-slide when user touches, drags, or hovers)
  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  };

  const handleInteractionEnd = () => {
    // Resume auto-slide after 3.5 seconds of idle time post-interaction
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3500);
  };

  const handlePrev = () => {
    handleInteractionStart();
    const nextIndex = virtualIndex - 1;
    scrollToVirtualIndex(nextIndex, 'smooth');
    handleInteractionEnd();
  };

  const handleNext = () => {
    handleInteractionStart();
    const nextIndex = virtualIndex + 1;
    scrollToVirtualIndex(nextIndex, 'smooth');
    handleInteractionEnd();
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

  // Scroll listener ONLY updates active index during user swipe
  const handleScroll = () => {
    if (isProgrammaticScrollRef.current || !scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;
    
    // Find closest slide index based on current center offset
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

    // Infinite loop jump check after manual swipe ends
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

  // Calculate active real slide index (0 to 6)
  const realIndex = (virtualIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;

  return (
    <section 
      className="w-full bg-[#faf5ea] py-4 sm:py-6 md:py-8 lg:py-2.5 select-none border-b border-[#d9ca9d] lg:h-[calc(66vh-var(--header-height,106px))] lg:min-h-[380px] lg:max-h-[620px] lg:flex lg:flex-col lg:justify-center"
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleInteractionEnd}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
    >
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 relative lg:h-full lg:flex lg:flex-col lg:justify-center">
        
        {/* Carousel Outer Wrapper */}
        <div className="relative group lg:h-full lg:w-full lg:max-w-6xl xl:lg:max-w-7xl lg:mx-auto">
          
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex space-x-3 sm:space-x-6 lg:space-x-0 overflow-x-auto snap-x snap-mandatory no-scrollbar py-2 lg:py-0 scroll-smooth lg:h-full w-full"
          >
            {EXTENDED_SLIDES.map((slide, index) => (
              <div 
                key={`${slide.id}-${index}`}
                onClick={() => handleSlideClick(slide.productId)}
                className={`shrink-0 snap-center relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-lg hover:shadow-2xl border border-black/10 cursor-pointer transition-all duration-300 transform active:scale-[0.99]
                  aspect-[16/10] lg:aspect-auto lg:h-full
                  w-[90vw] max-w-[420px] 
                  sm:w-[74vw] sm:max-w-[660px] 
                  md:w-[60vw] md:max-w-[840px] 
                  lg:w-full lg:min-w-full lg:max-w-none
                `}
              >
                <img 
                  src={slide.bannerImage} 
                  alt={slide.title}
                  className="w-full h-full object-cover object-center lg:object-[center_15%] transition-transform duration-700 hover:scale-105"
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

          {/* Side Navigation Arrow Buttons */}
          <button 
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-xl border border-slate-200 items-center justify-center transition-all cursor-pointer active:scale-90 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800" />
          </button>

          <button 
            onClick={handleNext}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-xl border border-slate-200 items-center justify-center transition-all cursor-pointer active:scale-90 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6 text-slate-800" />
          </button>
        </div>

      </div>
    </section>
  );
}

