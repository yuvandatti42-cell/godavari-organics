import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Volume2, VolumeX, ExternalLink } from 'lucide-react';

function InstagramIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const REEL_ITEMS = [
  {
    id: 1,
    title: 'Our Journey & 10,000+ Customers',
    video: '/videos/reel1.mp4',
    image: '/videos/reel1.jpg',
    reelUrl: 'https://www.instagram.com/reel/DebtmOYhEqD/'
  },
  {
    id: 2,
    title: 'Super Millet Powder: Blood Sugar Response',
    video: '/videos/reel2.mp4',
    image: '/videos/reel2.jpg',
    reelUrl: 'https://www.instagram.com/reel/DeMOYGMhABC/'
  },
  {
    id: 3,
    title: 'Daily Low-GI Rice (స్థిరమైన ఎనర్జీ)',
    video: '/videos/reel3.mp4',
    image: '/videos/reel3.jpg',
    reelUrl: 'https://www.instagram.com/reel/Da0aFDMBbzw/'
  },
  {
    id: 4,
    title: "Baby's First Food: Raw Banana Powder",
    video: '/videos/reel4.mp4',
    image: '/videos/reel4.jpg',
    reelUrl: 'https://www.instagram.com/reel/DbLJpzChSoB/'
  }
];

export default function WhyChooseArma() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  
  // Track which specific video card is unmuted (null = all muted by default)
  const [unmutedCardId, setUnmutedCardId] = useState(null);

  const progressIntervalRef = useRef(null);
  const videoRefs = useRef({});

  // Toggle Mute / Unmute for a single specific video card
  const toggleCardAudio = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setUnmutedCardId((current) => (current === id ? null : id));
  };

  // Sync muted state directly to all video DOM elements
  useEffect(() => {
    REEL_ITEMS.forEach((item) => {
      const isCardUnmuted = unmutedCardId === item.id;
      const desktopEl = videoRefs.current[`desktop-${item.id}`];
      const mobileEl = videoRefs.current[`mobile-${item.id}`];

      if (desktopEl) {
        desktopEl.muted = !isCardUnmuted;
      }
      if (mobileEl) {
        mobileEl.muted = !isCardUnmuted;
      }
    });
  }, [unmutedCardId]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % REEL_ITEMS.length);
    setSlideProgress(0);
    setUnmutedCardId(null);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + REEL_ITEMS.length) % REEL_ITEMS.length);
    setSlideProgress(0);
    setUnmutedCardId(null);
  };


  // Synchronize active mobile reel playback whenever activeIndex changes
  useEffect(() => {
    REEL_ITEMS.forEach((item, idx) => {
      const mobileEl = videoRefs.current[`mobile-${item.id}`];
      if (mobileEl) {
        if (idx === activeIndex) {
          mobileEl.currentTime = 0;
          const playPromise = mobileEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          mobileEl.pause();
          mobileEl.currentTime = 0;
        }
      }
    });
    setSlideProgress(0);
  }, [activeIndex]);


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
    setTimeout(() => setIsPaused(false), 2000);
  };


  return (
    <div className="w-full space-y-4 sm:space-y-6">
      
      {/* ======================================================== */}
      {/* DESKTOP VIEW (>= md): CLEAN 4-COLUMN VERTICAL REEL CARDS */}
      {/* ======================================================== */}
      <div className="hidden md:block space-y-5 text-left">
        <div className="flex items-end justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-[#18542a]/10 text-[#18542a] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#e5a00d]" />
              <span>Watch Our Reels</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-2xl lg:text-3xl text-[#103b1d] tracking-tight">
              Why Choose Arma
            </h2>
          </div>
          
          {/* Quick Mute All Button if any video is playing audio */}
          {unmutedCardId !== null && (
            <button
              type="button"
              onClick={() => setUnmutedCardId(null)}
              className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#18542a] text-white border border-[#18542a] shadow-sm animate-pulse transition-all"
              title="Click to mute sound"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#c2eb4c]" />
              <span>Mute Audio</span>
            </button>
          )}
        </div>

        {/* 4 Clean Vertical Reel Cards with Individual Audio Controls */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {REEL_ITEMS.map((item) => {
            const isCardAudioPlaying = unmutedCardId === item.id;
            return (
              <div
                key={item.id}
                className="group relative h-[420px] lg:h-[460px] w-full rounded-2xl overflow-hidden bg-black border border-[#d9ca9d] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 flex flex-col justify-between"
              >
                {/* Direct Authentic Instagram Reel Video */}
                <video
                  ref={(el) => (videoRefs.current[`desktop-${item.id}`] = el)}
                  src={item.video}
                  poster={item.image}
                  autoPlay
                  loop
                  muted={!isCardAudioPlaying}
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Minimal gradient scrim on top and bottom only */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                {/* Top Controls: Reel Badge & Individual Unmute Button */}
                <div className="relative z-20 p-3 flex items-center justify-between">
                  <a
                    href={item.reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-black/50 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <InstagramIcon className="w-3 h-3 text-[#ff3040]" />
                    <span>Instagram</span>
                  </a>

                  {/* Individual Card Unmute Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleCardAudio(item.id, e)}
                    aria-label={isCardAudioPlaying ? 'Mute this video' : 'Unmute this video'}
                    className={`backdrop-blur-md border text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1 cursor-pointer active:scale-95 transition-all ${
                      isCardAudioPlaying
                        ? 'bg-[#18542a] text-white border-[#18542a]'
                        : 'bg-black/50 hover:bg-black/80 border-white/25 text-white'
                    }`}
                  >
                    {isCardAudioPlaying ? (
                      <>
                        <Volume2 className="w-3 h-3 text-[#c2eb4c] animate-pulse" />
                        <span className="text-[9px] text-[#c2eb4c] uppercase tracking-wider">Sound On</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3 h-3 text-white/90" />
                        <span className="text-[9px] uppercase tracking-wider">Unmute</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bottom Clean Title & Direct Reel Link */}
                <div className="relative z-20 p-3.5 flex items-center justify-between">
                  <span className="text-white font-urbanist font-extrabold text-xs leading-snug drop-shadow-md pr-2 line-clamp-1">
                    {item.title}
                  </span>

                  <a
                    href={item.reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE VIEW (< md): CLEAN 3D PERSPECTIVE REEL DECK */}
      {/* ======================================================== */}
      <div className="block md:hidden space-y-3.5 text-left w-full overflow-hidden py-1">
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-[#18542a]/10 text-[#18542a] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-[#e5a00d]" />
              <span>Watch Our Reels</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-xl text-[#103b1d] tracking-tight">
              Why Choose Arma
            </h2>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Slide Counter Badge */}
            <div className="bg-[#f3e8cc] border border-[#d9ca9d] px-2.5 py-1 rounded-full text-xs font-urbanist font-extrabold text-[#103b1d] shadow-2xs flex items-center space-x-1">
              <span className="text-[#18542a]">0{activeIndex + 1}</span>
              <span className="text-[#556b54]/50">/</span>
              <span className="text-[#556b54]">0{REEL_ITEMS.length}</span>
            </div>
          </div>
        </div>

        {/* 3D PERSPECTIVE DECK CONTAINER */}
        <div 
          className="relative w-full h-[460px] sm:h-[490px] flex items-center justify-center select-none"
          style={{ perspective: '1100px' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {REEL_ITEMS.map((item, index) => {
            const total = REEL_ITEMS.length;
            
            // Calculate relative offset from active slide: (-1, 0, 1)
            let offset = (index - activeIndex + total) % total;
            if (offset > total / 2) offset -= total;

            const isActive = offset === 0;
            const isNext = offset === 1;
            const isPrev = offset === -1;
            const isCardAudioPlaying = unmutedCardId === item.id;

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
                    setUnmutedCardId(null);
                  }
                }}
                className={`absolute top-0 w-[84%] sm:w-[80%] h-full rounded-3xl overflow-hidden bg-black border border-[#d9ca9d] flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
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
                {/* Full Cover Authentic Instagram Reel Video */}
                <video
                  ref={(el) => (videoRefs.current[`mobile-${item.id}`] = el)}
                  src={item.video}
                  poster={item.image}
                  autoPlay={isActive}
                  muted={!isCardAudioPlaying}
                  playsInline
                  onTimeUpdate={(e) => {
                    if (isActive && e.target.duration) {
                      setSlideProgress((e.target.currentTime / e.target.duration) * 100);
                    }
                  }}
                  onEnded={() => {
                    if (isActive) {
                      nextSlide();
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Minimal top & bottom gradient only */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                {/* Story Timer Progress Bar (Only visible on active card) */}
                {isActive && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/20 z-40 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#c2eb4c] to-[#9abc05] transition-all duration-75 ease-linear"
                      style={{ width: `${slideProgress}%` }}
                    />
                  </div>
                )}

                {/* Top Controls: Instagram Badge + Individual Unmute Button */}
                <div className="relative z-30 p-3.5 flex items-center justify-between">
                  <a
                    href={item.reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-black/55 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-md"
                  >
                    <InstagramIcon className="w-3 h-3 text-[#ff3040]" />
                    <span>Instagram</span>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => toggleCardAudio(item.id, e)}
                    aria-label={isCardAudioPlaying ? 'Mute this video' : 'Unmute this video'}
                    className={`backdrop-blur-md border text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1 cursor-pointer active:scale-95 transition-all ${
                      isCardAudioPlaying
                        ? 'bg-[#18542a] text-white border-[#18542a]'
                        : 'bg-black/55 hover:bg-black/80 border-white/25 text-white'
                    }`}
                  >
                    {isCardAudioPlaying ? (
                      <>
                        <Volume2 className="w-3 h-3 text-[#c2eb4c] animate-pulse" />
                        <span className="text-[#c2eb4c] uppercase text-[9px]">Sound On</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3 h-3 text-white/90" />
                        <span className="uppercase text-[9px]">Unmute</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bottom Clean Title & Tap to Open Reel */}
                <div 
                  className={`relative z-30 p-4 text-left text-white flex items-center justify-between transition-all duration-500 ease-out ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <span className="font-urbanist font-extrabold text-xs sm:text-sm text-white leading-snug drop-shadow-md pr-2 line-clamp-1">
                    {item.title}
                  </span>

                  <a
                    href={item.reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 bg-white/25 hover:bg-white text-white hover:text-black backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center space-x-1 shadow-md transition-all active:scale-95"
                  >
                    <span>Watch</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* DECK NAVIGATION CONTROLS */}
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
            {REEL_ITEMS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setSlideProgress(0);
                  setUnmutedCardId(null);
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




