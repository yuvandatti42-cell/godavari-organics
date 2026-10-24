import React, { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Srinivas Rao K.",
    rating: 4.5,
    location: "Rajahmundry, AP",
    quote: "The traditional Basmati Rice aroma is incredible. Reminds me of actual village-farm cooked food. Clean packaging too.",
    avatar: "/customers/srinivas.jpg"
  },
  {
    id: 2,
    name: "Ananya R.",
    rating: 5.0,
    location: "Hyderabad, Telangana",
    quote: "Switched all our household cooking to Godavari organic oils and basmati rice. Superior quality, zero stones or dust, and clean long grain length!",
    avatar: "/customers/ananya.jpg"
  },
  {
    id: 3,
    name: "Vikram S.",
    rating: 5.0,
    location: "Bengaluru, Karnataka",
    quote: "A2 Gir Cow Ghee and traditional cane jaggery are super pure. Fast shipping, eco-friendly packaging, and genuine natural sweetness.",
    avatar: "/customers/vikram.jpg"
  }
];

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe refs
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 40;

  // Auto-slide effect for mobile
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

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
      <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight text-left">
        What Our Customers Say
      </h2>

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

      {/* DESKTOP GRID (>= md) - SHOWS ALL REVIEWS SIDE BY SIDE */}
      <div className="hidden md:grid md:grid-cols-3 gap-5">
        {reviews.map((rev) => (
          <ReviewCard key={rev.id} review={rev} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all h-full min-h-[180px] sm:min-h-[200px] flex items-stretch text-left group">
      {/* LEFT 67%: Review text content, name, rating */}
      <div className="w-[67%] p-4 xs:p-5 sm:p-5 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Reviewer Name without avatar icon */}
          <div>
            <h3 className="font-urbanist font-extrabold text-sm xs:text-base sm:text-base text-[#103b1d] leading-snug">
              {review.name}
            </h3>
            {review.location && (
              <p className="text-[11px] text-[#556b54] font-medium tracking-tight">
                {review.location}
              </p>
            )}
          </div>

          {/* Stars & Rating */}
          <div className="flex items-center space-x-1.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(review.rating)
                      ? 'fill-amber-500 text-amber-500'
                      : i < review.rating
                      ? 'fill-amber-500/50 text-amber-500'
                      : 'text-[#c8b894] fill-[#d9ca9d]'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#103b1d]">
              {review.rating}
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
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Subtle left-side shade for soft transition into beige */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#d9ca9d]/30 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
