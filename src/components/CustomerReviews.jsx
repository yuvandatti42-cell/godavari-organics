import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_REVIEWS = [
  {
    id: 'test-1',
    name: 'Srinivas Rao K.',
    rating: 5,
    location: 'Rajahmundry, AP',
    quote: 'The traditional Basmati Rice aroma is incredible. Reminds me of actual village-farm cooked food. Clean packaging too.',
    avatar: '/customers/srinivas.webp',
  },
  {
    id: 'test-2',
    name: 'Ananya R.',
    rating: 5,
    location: 'Hyderabad, Telangana',
    quote: 'Switched all our household cooking to Godavari organic oils and basmati rice. Superior quality, zero stones or dust, and clean long grain length!',
    avatar: '/customers/ananya.webp',
  },
  {
    id: 'test-3',
    name: 'Vikram S.',
    rating: 5,
    location: 'Bengaluru, Karnataka',
    quote: 'A2 Gir Cow Ghee and traditional cane jaggery are super pure. Fast shipping, eco-friendly packaging, and genuine natural sweetness.',
    avatar: '/customers/vikram.webp',
  },
];

export default function CustomerReviews() {
  const { storeContent } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe refs for mobile
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 40;

  // Use testimonials from admin if present, else fallback
  const rawReviews = (storeContent?.testimonials && Array.isArray(storeContent.testimonials) && storeContent.testimonials.length > 0)
    ? storeContent.testimonials
    : DEFAULT_REVIEWS;

  const reviews = rawReviews.map((rev, idx) => ({
    id: rev.id || `rev-${idx}`,
    name: rev.name || rev.customerName || 'Verified Customer',
    location: rev.location || rev.role || 'Andhra Pradesh',
    rating: Number(rev.rating) || 5,
    quote: rev.quote || rev.comment || rev.content || '',
    avatar: rev.avatar || rev.avatarUrl || rev.image || rev.imageUrl || DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length].avatar
  }));

  // Auto-slide effect for mobile (1 card at a time)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, reviews.length]);

  // Rotating motion for desktop when reviews > 3
  const maxDesktopIndex = Math.max(0, reviews.length - 3);

  useEffect(() => {
    if (isPaused || reviews.length <= 3) return;

    const interval = setInterval(() => {
      setDesktopIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, reviews.length, maxDesktopIndex]);

  const handlePrevDesktop = () => {
    setDesktopIndex((prev) => (prev <= 0 ? maxDesktopIndex : prev - 1));
  };

  const handleNextDesktop = () => {
    setDesktopIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > minSwipeDistance) {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight text-left">
          What Our Customers Say
        </h2>

        {/* Desktop Controls (visible only when reviews > 3) */}
        {reviews.length > 3 && (
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={handlePrevDesktop}
              aria-label="Previous customer review"
              className="w-8 h-8 rounded-full border border-[#d9ca9d] bg-white/80 hover:bg-[#18542a] text-[#18542a] hover:text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextDesktop}
              aria-label="Next customer review"
              className="w-8 h-8 rounded-full border border-[#d9ca9d] bg-white/80 hover:bg-[#18542a] text-[#18542a] hover:text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* MOBILE RESPONSIVE SLIDER (< md) - SHOWS 1 REVIEW AT A TIME WITH SLIDING */}
      <div className="block md:hidden">
        <div 
          className="overflow-hidden relative rounded-2xl sm:rounded-3xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviews.map((rev) => (
              <div key={rev.id} className="w-full shrink-0 p-1">
                <ReviewCard review={rev} />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Dots matching the number of reviews */}
        <div className="flex items-center justify-center space-x-2 pt-3">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to review ${index + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                currentIndex === index 
                  ? 'w-6 h-2 bg-[#18542a]' 
                  : 'w-2 h-2 bg-[#d9ca9d] hover:bg-[#b8a77a]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP VIEW (>= md) - SIDE BY SIDE WITH ROTATION MOTION WHEN > 3 */}
      <div 
        className="hidden md:block relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {reviews.length <= 3 ? (
          <div className={`grid gap-5 ${
            reviews.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
            reviews.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
            'grid-cols-1 md:grid-cols-3'
          }`}>
            {reviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sliding Carousel Rail Showing 3 Reviews Side-by-Side */}
            <div className="overflow-hidden rounded-3xl py-1">
              <div 
                className="flex transition-transform duration-700 ease-in-out -mx-2.5"
                style={{ transform: `translateX(-${desktopIndex * (100 / 3)}%)` }}
              >
                {reviews.map((rev) => (
                  <div key={rev.id} className="w-1/3 shrink-0 px-2.5">
                    <ReviewCard review={rev} />
                  </div>
                ))}
              </div>
            </div>

            {/* Indicator dots for desktop carousel */}
            <div className="flex items-center justify-center space-x-1.5 pt-2">
              {Array.from({ length: maxDesktopIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setDesktopIndex(idx)}
                  aria-label={`Go to reviews group ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    desktopIndex === idx 
                      ? 'w-6 h-2 bg-[#18542a]' 
                      : 'w-2 h-2 bg-[#d9ca9d] hover:bg-[#b8a77a]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  const starCount = Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5)));

  return (
    <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all h-full min-h-[180px] sm:min-h-[200px] flex items-stretch text-left group">
      {/* LEFT 67%: Review text content, name, rating */}
      <div className="w-[67%] p-4 xs:p-5 sm:p-5 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div>
            <h3 className="font-urbanist font-extrabold text-sm xs:text-base sm:text-base text-[#103b1d] leading-snug flex items-center gap-1.5">
              <span>{review.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#18542a] shrink-0" title="Verified Customer" />
            </h3>
            {review.location && (
              <p className="text-[11px] text-[#556b54] font-medium tracking-tight">
                {review.location}
              </p>
            )}
          </div>

          {/* Stars */}
          <div className="flex items-center space-x-1">
            <div className="flex text-amber-500">
              {Array.from({ length: starCount }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#103b1d] ml-1">
              {starCount}.0
            </span>
          </div>
        </div>

        {/* Review Quote Text */}
        <p className="text-xs sm:text-[13px] text-[#556b54] font-medium leading-relaxed italic line-clamp-4">
          "{review.quote}"
        </p>
      </div>

      {/* RIGHT 33%: Full-height image of the person */}
      <div className="w-[33%] shrink-0 relative overflow-hidden bg-[#e6dec9] border-l border-[#d9ca9d]/80">
        <img 
          src={review.avatar} 
          alt={review.name} 
          width="160"
          height="200"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Subtle left-side shade for soft transition into beige */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#d9ca9d]/30 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
