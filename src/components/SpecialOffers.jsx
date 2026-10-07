import React, { useState, useEffect, useRef } from 'react';
import OfferCard from './OfferCard';

const offers = [
  {
    id: 1,
    tag: "LIMITED TIME ONLY",
    title: "Up to 30% Off on First Order",
    description: "Use code GODAVARI30 at checkout. Valid on all traditional rice and spices.",
    buttonText: "Grab Offer",
    code: "GODAVARI30",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    tag: "BULK GRAINS PACK",
    title: "Free Rice Storage Tin",
    description: "Applicable on purchasing 10kg grains.",
    buttonText: "View Grains",
    code: "FREETIN",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    tag: "FESTIVE COMBO",
    title: "Flat ₹200 Cashback on Spices",
    description: "Buy 3 or more traditional organic spice packs & get instant cashback.",
    buttonText: "Shop Spices",
    code: "SPICE200",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
  }
];

export default function SpecialOffers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Touch swipe handling
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 40;

  // Auto-slide effect for mobile
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 4000); // Slides slowly every 4 seconds

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
      // Swiped left -> next offer
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev offer
      setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-slate-900 tracking-tight">
          Special Offers
        </h2>
      </div>

      {/* MOBILE SLIDER (< md) - ONLY SHOWS ONE OFFER AT A TIME WITH SLIDING */}
      <div className="block md:hidden">
        <div 
          className="overflow-hidden relative rounded-xl sm:rounded-2xl"
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
            {offers.map((offer) => (
              <div key={offer.id} className="w-full shrink-0">
                <OfferCard {...offer} />
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Pagination Carousel Dots (Mobile Indicator) */}
        <div className="flex items-center justify-center space-x-2 pt-3">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to offer ${index + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                currentIndex === index 
                  ? 'w-6 h-2 bg-slate-900' 
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP GRID (>= md) - SHOWS ALL OFFERS SIDE BY SIDE */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.map((offer) => (
          <OfferCard key={offer.id} {...offer} />
        ))}
      </div>
    </section>
  );
}
