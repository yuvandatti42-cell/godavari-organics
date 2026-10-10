import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    productId: 'p1',
    title: 'Fresh Godavari Organic Harvest',
    bannerImage: '/hero.png',
    buttonTextColor: 'text-[#18542a]'
  },
  {
    id: 'slide-2',
    productId: 'p8',
    title: 'Pure Forest & Farm Goodness',
    bannerImage: '/banners/banner2.jpg',
    buttonTextColor: 'text-[#18542a]'
  },
  {
    id: 'slide-3',
    productId: 'p2',
    title: 'Traditional & Pure Wellness Picks',
    bannerImage: '/banners/banner3.jpg',
    buttonTextColor: 'text-[#78350f]'
  },
  {
    id: 'slide-4',
    productId: 'p3',
    title: 'Stone Milled Organic Spices & Oils',
    bannerImage: '/banners/banner1.jpg',
    buttonTextColor: 'text-[#5c1922]'
  },
  {
    id: 'slide-5',
    productId: 'p4',
    title: 'Wild Forest Raw Honey & Nuts',
    bannerImage: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=1400',
    buttonTextColor: 'text-[#701a75]'
  },
  {
    id: 'slide-6',
    productId: 'p5',
    title: 'Ancient Native Organic Millets',
    bannerImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1400',
    buttonTextColor: 'text-[#14532d]'
  },
  {
    id: 'slide-7',
    productId: 'p6',
    title: 'Natural Palm Jaggery & Sweeteners',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1400',
    buttonTextColor: 'text-[#713f12]'
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
      className="w-full bg-[#faf5ea] py-4 sm:py-6 md:py-8 select-none border-b border-[#d9ca9d]"
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleInteractionEnd}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
    >
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-12 relative">
        
        {/* Carousel Outer Wrapper */}
        <div className="relative group">
          
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
                className={`shrink-0 snap-center relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-lg hover:shadow-2xl border border-black/10 cursor-pointer transition-all duration-300 transform active:scale-[0.99] aspect-[16/10]
                  w-[90vw] max-w-[420px] 
                  sm:w-[74vw] sm:max-w-[660px] 
                  md:w-[60vw] md:max-w-[840px] 
                  lg:w-[52vw] lg:max-w-[980px]
                `}
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

          {/* Side Navigation Arrow Buttons */}
          <button 
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-xl border border-slate-200 items-center justify-center transition-all cursor-pointer active:scale-90 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800" />
          </button>

          <button 
            onClick={handleNext}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-xl border border-slate-200 items-center justify-center transition-all cursor-pointer active:scale-90 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6 text-slate-800" />
          </button>
        </div>

      </div>
    </section>
  );
}

