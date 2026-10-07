import React, { useState, useEffect, useRef } from 'react';
import { Star, User } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Srinivas Rao K.",
    rating: 4.5,
    location: "Rajahmundry, AP",
    quote: "The traditional Basmati Rice aroma is incredible. Reminds me of actual village-farm cooked food. Clean packaging too.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "Ananya R.",
    rating: 5.0,
    location: "Hyderabad, Telangana",
    quote: "Switched all our household cooking to Godavari organic oils and basmati rice. Superior quality, zero stones or dust, and clean long grain length!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 3,
    name: "Vikram S.",
    rating: 5.0,
    location: "Bengaluru, Karnataka",
    quote: "A2 Gir Cow Ghee and traditional cane jaggery are super pure. Fast shipping, eco-friendly packaging, and genuine natural sweetness.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
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
      <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-slate-900 tracking-tight text-left">
        What Our Customers Say
      </h2>

      {/* MOBILE RESPONSIVE SLIDER (< md) - SHOWS 1 REVIEW AT A TIME WITH SLIDING */}
      <div className="block md:hidden">
        <div 
          className="overflow-hidden relative rounded-2xl"
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
              <div key={rev.id} className="w-full shrink-0 p-0.5">
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
                  ? 'w-6 h-2 bg-slate-900' 
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
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
    <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl p-5 sm:p-6 text-left space-y-3.5 shadow-xs hover:shadow-md transition-all h-full flex flex-col justify-between">
      {/* Top Header: Avatar + Name + Rating */}
      <div className="flex items-start space-x-3.5">
        {/* User Circle Avatar Frame */}
        <div className="w-11 h-11 rounded-full bg-[#e6dec9] border border-[#c8b894] overflow-hidden shrink-0 flex items-center justify-center">
          {review.avatar ? (
            <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-[#556b54]" />
          )}
        </div>

        {/* Name & Stars */}
        <div className="space-y-1">
          <h3 className="font-urbanist font-extrabold text-sm sm:text-base text-[#103b1d] leading-snug">
            {review.name}
          </h3>

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
            <span className="text-xs font-bold text-slate-800">
              {review.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Review Quote Text */}
      <p className="text-xs sm:text-sm text-[#556b54] font-medium leading-relaxed italic">
        "{review.quote}"
      </p>
    </div>
  );
}
