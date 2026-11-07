import React, { useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_REVIEWS = [
  {
    id: 'test-1',
    name: 'Srinivas Rao K.',
    rating: 5,
    location: 'Rajahmundry, AP',
    comment: 'The traditional Basmati Rice aroma is incredible. Reminds me of actual village-farm cooked food. Clean packaging too.',
    avatarUrl: '/customers/srinivas.webp',
    verified: true,
  },
  {
    id: 'test-2',
    name: 'Ananya R.',
    rating: 5,
    location: 'Hyderabad, Telangana',
    comment: 'Switched all our household cooking to Godavari organic oils and basmati rice. Superior quality, zero stones or dust, and clean long grain length!',
    avatarUrl: '/customers/ananya.webp',
    verified: true,
  },
  {
    id: 'test-3',
    name: 'Vikram S.',
    rating: 5,
    location: 'Bengaluru, Karnataka',
    comment: 'A2 Gir Cow Ghee and traditional cane jaggery are super pure. Fast shipping, eco-friendly packaging, and genuine natural sweetness.',
    avatarUrl: '/customers/vikram.webp',
    verified: true,
  },
];

export default function CustomerReviews() {
  const { storeContent } = useCart();
  const scrollRef = useRef(null);

  // Strictly use testimonials published from Admin panel; fall back to defaults if empty
  const reviews = (storeContent?.testimonials && storeContent.testimonials.length > 0)
    ? storeContent.testimonials
    : DEFAULT_REVIEWS;

  // Manual scroll helper
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Duplicate reviews for seamless continuous auto-scroll ticker loop
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="space-y-4 sm:space-y-6 pt-2 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight text-left">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-[#556b54] font-medium mt-0.5 text-left">
            Authentic verified reviews and photos direct from our customer community
          </p>
        </div>

        {/* Scroll affordance controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-full border border-[#d9ca9d] bg-white text-[#103b1d] hover:bg-[#18542a] hover:text-white transition-colors cursor-pointer shadow-xs active:scale-95"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-full border border-[#d9ca9d] bg-white text-[#103b1d] hover:bg-[#18542a] hover:text-white transition-colors cursor-pointer shadow-xs active:scale-95"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CONTINUOUS AUTO-SCROLLING REVIEW STRIP (Side-by-side with hover pause) */}
      <div 
        ref={scrollRef}
        className="w-full overflow-hidden relative rounded-2xl sm:rounded-3xl py-1"
      >
        <div className="animate-marquee-slow whitespace-nowrap flex items-stretch space-x-5 py-2">
          {duplicatedReviews.map((rev, index) => (
            <div 
              key={`${rev.id}-${index}`} 
              className="w-[300px] xs:w-[360px] sm:w-[420px] md:w-[460px] shrink-0 whitespace-normal"
            >
              <ReviewCard review={rev} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  const avatarSrc = review.avatarUrl || review.avatar || '/customers/srinivas.webp';
  const commentText = review.comment || review.quote || '';
  const starCount = Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5)));

  return (
    <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all h-full min-h-[190px] sm:min-h-[210px] flex items-stretch text-left group">
      {/* LEFT: Review content, customer name, verified, rating */}
      <div className="flex-1 p-4 xs:p-5 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div>
            <h3 className="font-urbanist font-extrabold text-sm xs:text-base text-[#103b1d] leading-snug flex items-center gap-1.5">
              <span>{review.name}</span>
              {review.verified !== false && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18542a] shrink-0" title="Verified Customer" />
              )}
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
        <p className="text-xs sm:text-[13px] text-[#556b54] font-medium leading-relaxed italic line-clamp-3">
          "{commentText}"
        </p>
      </div>

      {/* RIGHT: Customer Avatar Portrait */}
      <div className="w-[110px] xs:w-[130px] sm:w-[150px] shrink-0 relative overflow-hidden bg-[#e6dec9] border-l border-[#d9ca9d]/80">
        <img 
          src={avatarSrc} 
          alt={review.name} 
          width="150"
          height="210"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Soft edge blend gradient */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#d9ca9d]/30 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
