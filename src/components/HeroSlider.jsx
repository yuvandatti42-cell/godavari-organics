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

export default function HeroSlider() {
  const { setCurrentPage, navigateToProduct } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const scrollContainerRef = useRef(null);

  // Auto-slide effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync scroll position for mobile/touch slider
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.children[currentIndex];
      if (card) {
        const left = card.offsetLeft - 16;
        container.scrollTo({ left, behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleSlideClick = (productId) => {
    if (productId && navigateToProduct) {
      navigateToProduct(productId);
    } else {
      setCurrentPage('shop');
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.children[0]?.clientWidth || 300;
    const index = Math.round(scrollLeft / (cardWidth + 12));
    if (index >= 0 && index < HERO_SLIDES.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <section 
      className="w-full bg-[#faf5ea] pt-3 sm:pt-5 pb-4 sm:pb-6 select-none border-b border-[#d9ca9d]"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 relative">
        
        {/* Carousel Outer Wrapper */}
        <div className="relative group">
          
          {/* Scrollable Container (Swipeable on Mobile, Peeking next card) */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex space-x-3 sm:space-x-5 overflow-x-auto snap-x snap-mandatory no-scrollbar py-1"
          >
            {HERO_SLIDES.map((slide, index) => (
              <div 
                key={slide.id}
                onClick={() => handleSlideClick(slide.productId)}
                className={`shrink-0 snap-start relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-md border border-black/10 cursor-pointer transition-all duration-300 transform active:scale-[0.99]
                  w-[85vw] max-w-[340px] h-[210px] xs:h-[235px] 
                  sm:w-[65vw] sm:max-w-[540px] sm:h-[300px]
                  md:w-[50vw] md:max-w-[700px] md:h-[360px]
                  lg:w-[42vw] lg:max-w-[800px] lg:h-[400px]
                `}
              >
                {/* 1. THE ENTIRE FRAME IS AN IMAGE (NO text, NO extra overlay images) */}
                <img 
                  src={slide.bannerImage} 
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                />

                {/* Subtle bottom gradient vignette to ensure white button contrast */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

                {/* 2. THE ONLY THING ON THE FRAME IS THE SHOP NOW BUTTON */}
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

          {/* Side Navigation Arrow Buttons (Desktop >= sm) */}
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

        {/* 3. PAGINATION BAR: Dark Pill Badge Counter ("1/7") + Dots (• • • •) */}
        <div className="flex items-center justify-center space-x-3 pt-4 sm:pt-5">
          {/* Dark Pill Badge Counter */}
          <span className="px-3.5 py-1 rounded-full bg-[#33373d] text-white text-[11px] sm:text-xs font-bold font-mono tracking-wider shadow-xs">
            {currentIndex + 1}/{HERO_SLIDES.length}
          </span>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index 
                    ? 'w-3 h-3 bg-slate-800 scale-110 shadow-xs' 
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Pause / Play Toggle Button */}
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

