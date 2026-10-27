import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [slideProgress, setSlideProgress] = useState(0);

  // Responsive state: ensures only Desktop OR Mobile videos are rendered in the DOM
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Track if audio is active (persists across reels on mobile once unmuted until user mutes)
  const [isAudioActive, setIsAudioActive] = useState(false);
  // Track specific unmuted card ID for desktop isolated card audio
  const [unmutedCardId, setUnmutedCardId] = useState(null);

  const videoRefs = useRef({});
  const sectionRef = useRef(null);

  // Strict helper to mute all audio across the component
  const muteAllAudio = useCallback(() => {
    setIsAudioActive(false);
    setUnmutedCardId(null);
    Object.values(videoRefs.current).forEach((el) => {
      if (el) {
        el.muted = true;
        el.volume = 0;
      }
    });
  }, []);

  // Sync screen size with media query to avoid dual rendering
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handleMediaChange = (e) => {
      setIsDesktop(e.matches);
      muteAllAudio();
    };

    mql.addEventListener('change', handleMediaChange);
    return () => mql.removeEventListener('change', handleMediaChange);
  }, [muteAllAudio]);

  // Toggle Mute / Unmute
  const toggleCardAudio = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isDesktop) {
      // Desktop: individual card audio exclusivity
      const nextUnmutedId = unmutedCardId === id ? null : id;
      setUnmutedCardId(nextUnmutedId);
      setIsAudioActive(nextUnmutedId !== null);

      Object.entries(videoRefs.current).forEach(([key, el]) => {
        if (!el) return;
        const itemId = Number(key);
        if (itemId === nextUnmutedId) {
          el.muted = false;
          el.volume = 1.0;
          const playPromise = el.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          el.muted = true;
          el.volume = 0;
        }
      });
    } else {
      // Mobile: once unmuted, sound persists seamlessly across reels until user taps mute again
      const nextState = !isAudioActive;
      setIsAudioActive(nextState);
      setUnmutedCardId(nextState ? id : null);

      Object.entries(videoRefs.current).forEach(([key, el]) => {
        if (!el) return;
        const itemId = Number(key);
        if (nextState && itemId === id) {
          el.muted = false;
          el.volume = 1.0;
          const playPromise = el.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          el.muted = true;
          el.volume = 0;
        }
      });
    }
  };

  // Synchronize muted and volume properties on Desktop
  useEffect(() => {
    if (!isDesktop) return;
    Object.entries(videoRefs.current).forEach(([key, el]) => {
      if (!el) return;
      const itemId = Number(key);
      const isCardUnmuted = unmutedCardId === itemId;
      el.muted = !isCardUnmuted;
      el.volume = isCardUnmuted ? 1.0 : 0;
    });
  }, [unmutedCardId, isDesktop]);

  // Mute audio when user switches tabs or window minimizes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        muteAllAudio();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [muteAllAudio]);

  // Automatically mute audio when the section is scrolled away from view
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When scrolled away (less than 15% visible or not intersecting), auto-mute
          if (!entry.isIntersecting || entry.intersectionRatio < 0.15) {
            muteAllAudio();
          }
        });
      },
      {
        threshold: [0, 0.15],
      }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, [muteAllAudio]);

  // Cleanup all audio and playback when unmounting
  useEffect(() => {
    const currentVideos = videoRefs.current;
    return () => {
      Object.values(currentVideos).forEach((el) => {
        if (el) {
          el.muted = true;
          el.pause();
        }
      });
    };
  }, []);

  // Slide navigation for mobile: maintains unmuted audio state if user previously turned sound ON!
  const nextSlide = () => {
    const nextIndex = (activeIndex + 1) % REEL_ITEMS.length;
    setActiveIndex(nextIndex);
    setSlideProgress(0);
    if (isAudioActive) {
      setUnmutedCardId(REEL_ITEMS[nextIndex].id);
    }
  };

  const prevSlide = () => {
    const nextIndex = (activeIndex - 1 + REEL_ITEMS.length) % REEL_ITEMS.length;
    setActiveIndex(nextIndex);
    setSlideProgress(0);
    if (isAudioActive) {
      setUnmutedCardId(REEL_ITEMS[nextIndex].id);
    }
  };

  const selectSlide = (index) => {
    setActiveIndex(index);
    setSlideProgress(0);
    if (isAudioActive) {
      setUnmutedCardId(REEL_ITEMS[index].id);
    }
  };

  // Synchronize mobile deck reel playback and persistent audio state whenever activeIndex or isAudioActive changes
  useEffect(() => {
    if (isDesktop) return;

    REEL_ITEMS.forEach((item, idx) => {
      const mobileEl = videoRefs.current[item.id];
      if (mobileEl) {
        if (idx === activeIndex) {
          mobileEl.currentTime = 0;
          const shouldHaveAudio = isAudioActive;
          mobileEl.muted = !shouldHaveAudio;
          mobileEl.volume = shouldHaveAudio ? 1.0 : 0;
          const playPromise = mobileEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          // All inactive background reels are strictly paused and silenced
          mobileEl.pause();
          mobileEl.currentTime = 0;
          mobileEl.muted = true;
          mobileEl.volume = 0;
        }
      }
    });
  }, [activeIndex, isDesktop, isAudioActive]);

  // Ensure desktop videos continue looping when desktop layout mounts
  useEffect(() => {
    if (isDesktop) {
      REEL_ITEMS.forEach((item) => {
        const desktopEl = videoRefs.current[item.id];
        if (desktopEl) {
          desktopEl.muted = unmutedCardId !== item.id;
          desktopEl.volume = unmutedCardId === item.id ? 1.0 : 0;
          const playPromise = desktopEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        }
      });
    }
  }, [isDesktop, unmutedCardId]);

  // Touch Swipe Handling for Mobile
  const handleTouchStart = (e) => {
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
  };

  return (
    <div ref={sectionRef} className="w-full space-y-4 sm:space-y-6">
      
      {/* ======================================================== */}
      {/* DESKTOP VIEW (>= md): 4-COLUMN VERTICAL REEL CARDS       */}
      {/* Renders ONLY when isDesktop is true                       */}
      {/* ======================================================== */}
      {isDesktop ? (
        <div className="space-y-5 text-left">
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
                onClick={muteAllAudio}
                className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#18542a] text-white border border-[#18542a] shadow-sm animate-pulse hover:bg-[#134321] transition-all"
                title="Click to mute sound"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#c2eb4c]" />
                <span>Mute Audio</span>
              </button>
            )}
          </div>

          {/* 4 Vertical Reel Cards with Individual Audio Controls */}
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
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[item.id] = el;
                      } else {
                        delete videoRefs.current[item.id];
                      }
                    }}
                    src={item.video}
                    poster={item.image}
                    autoPlay
                    loop
                    muted={!isCardAudioPlaying}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient scrim on top and bottom */}
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

                  {/* Bottom Title & Direct Reel Link */}
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
      ) : (
        /* ======================================================== */
        /* MOBILE VIEW (< md): 3D PERSPECTIVE REEL DECK             */
        /* Renders ONLY when isDesktop is false                     */
        /* ======================================================== */
        <div className="space-y-3.5 text-left w-full overflow-hidden py-1">
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

            <div className="flex items-center space-x-2">
              {/* Quick Mute on Mobile if unmuted */}
              {isAudioActive && (
                <button
                  type="button"
                  onClick={muteAllAudio}
                  className="cursor-pointer inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#18542a] text-white border border-[#18542a] shadow-xs animate-pulse"
                  title="Mute sound"
                >
                  <Volume2 className="w-3 h-3 text-[#c2eb4c]" />
                  <span>Mute</span>
                </button>
              )}

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
          >
            {REEL_ITEMS.map((item, index) => {
              const total = REEL_ITEMS.length;
              
              // Relative offset from active slide: (-1, 0, 1)
              let offset = (index - activeIndex + total) % total;
              if (offset > total / 2) offset -= total;

              const isActive = offset === 0;
              const isNext = offset === 1;
              const isPrev = offset === -1;
              const isCardAudioPlaying = isAudioActive && isActive;

              // 3D Stack transforms with tilt and scale
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
                      selectSlide(index);
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
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[item.id] = el;
                      } else {
                        delete videoRefs.current[item.id];
                      }
                    }}
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

                  {/* Top & bottom gradient */}
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

                  {/* Bottom Title & Tap to Open Reel */}
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
                  onClick={() => selectSlide(idx)}
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
      )}

    </div>
  );
}
