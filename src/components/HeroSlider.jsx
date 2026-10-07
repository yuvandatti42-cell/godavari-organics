import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    productId: 'p1',
    title: 'Fresh Godavari Organic Harvest',
    bannerImage: '/banners/banner1.jpg',
    buttonTextColor: 'text-[#5c1922]'
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
    bannerImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1400',
    buttonTextColor: 'text-[#7c2d12]'
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
  const scrollContainerRef = useRef(null);
  const isAutoScrollingRef = useRef(false);

  // Auto-slide effect (3.5 second interval)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVirtualIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Initial scroll setup to position at index 1 without animation
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.children[1];
      if (card) {
        container.scrollLeft = card.offsetLeft - 16;
      }
    }
  }, []);

  // Sync scroll position for seamless infinite loop
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const card = container.children[virtualIndex];

    if (card) {
      isAutoScrollingRef.current = true;
      const left = card.offsetLeft - 16;
      container.scrollTo({ left, behavior: 'smooth' });

      const timer = setTimeout(() => {
        // If we scrolled forward into the clone-end at index 8, instantly jump to real slide 1 at index 1
        if (virtualIndex === EXTENDED_SLIDES.length - 1) {
          const realFirstCard = container.children[1];
          if (realFirstCard) {
            container.scrollTo({ left: realFirstCard.offsetLeft - 16, behavior: 'instant' });
            setVirtualIndex(1);
          }
        }
        // If we scrolled backward into the clone-start at index 0, instantly jump to real slide 7 at index 7
        else if (virtualIndex === 0) {
          const realLastCard = container.children[HERO_SLIDES.length];
          if (realLastCard) {
            container.scrollTo({ left: realLastCard.offsetLeft - 16, behavior: 'instant' });
            setVirtualIndex(HERO_SLIDES.length);
          }
        }

        isAutoScrollingRef.current = false;
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [virtualIndex]);

  const handlePrev = () => {
    setVirtualIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setVirtualIndex((prev) => prev + 1);
  };

  const handleSlideClick = (productId) => {
    if (productId && navigateToProduct) {
      navigateToProduct(productId);
    } else {
      setCurrentPage('shop');
    }
  };

  const handleScroll = () => {
    if (isAutoScrollingRef.current || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.children[0]?.clientWidth || 300;
    const index = Math.round(scrollLeft / (cardWidth + 12));
    if (index >= 0 && index < EXTENDED_SLIDES.length && index !== virtualIndex) {
      setVirtualIndex(index);
    }
  };

  // Calculate active real slide index (0 to 6)
  const realIndex = (virtualIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;

  return (
    <section 
      className="w-full bg-[#faf5ea] pt-3 sm:pt-5 pb-4 sm:pb-6 select-none border-b border-[#d9ca9d]"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 relative">
        
        {/* Carousel Outer Wrapper */}
        <div className="relative group">
          
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex space-x-3 sm:space-x-5 overflow-x-auto snap-x snap-mandatory no-scrollbar py-1"
          >
            {EXTENDED_SLIDES.map((slide, index) => (
              <div 
                key={`${slide.id}-${index}`}
                onClick={() => handleSlideClick(slide.productId)}
                className={`shrink-0 snap-start relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-md border border-black/10 cursor-pointer transition-transform duration-300 transform active:scale-[0.99]
                  w-[85vw] max-w-[340px] h-[210px] xs:h-[235px] 
                  sm:w-[65vw] sm:max-w-[540px] sm:h-[300px]
                  md:w-[50vw] md:max-w-[700px] md:h-[360px]
                  lg:w-[42vw] lg:max-w-[800px] lg:h-[400px]
                `}
              >
                <img 
                  src={slide.bannerImage} 
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlideClick(slide.productId);
                    }}
                    className={`px-5 py-2.5 sm:px-6 sm:py-3 bg-white hover:bg-slate-100 ${slide.buttonTextColor || 'text-slate-900'} text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-full shadow-lg border border-white/80 active:scale-95 transition-all inline-flex items-center space-x-1.5 cursor-pointer`}
                  >
                    <span>SHOP NOW</span>
                  </button>
                </div>
              </div>
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

        {/* PAGINATION BAR */}
        <div className="flex items-center justify-center space-x-3 pt-4 sm:pt-5">
          <span className="px-3.5 py-1 rounded-full bg-[#33373d] text-white text-[11px] sm:text-xs font-bold font-mono tracking-wider shadow-xs">
            {realIndex + 1}/{HERO_SLIDES.length}
          </span>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setVirtualIndex(index + 1)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  realIndex === index 
                    ? 'w-3 h-3 bg-slate-800 scale-110 shadow-xs' 
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
            className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-all cursor-pointer ml-1"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
          </button>
        </div>

      </div>
    </section>
  );
}

