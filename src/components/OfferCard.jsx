import React from 'react';
import { useCart } from '../context/CartContext';
import { Image, ArrowRight } from 'lucide-react';

export default function OfferCard({ title, tag, description, buttonText = "Grab Offer", image, code }) {
  const { setCurrentPage, showToast } = useCart();

  const offerImage = image || (tag?.includes('SPICE') || tag?.includes('Spice') 
    ? 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'
    : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600');

  return (
    <div className="bg-[#f3e8cc] border border-[#d9ca9d] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center justify-between shadow-xs hover:shadow-md hover:border-[#18542a]/60 transition-all group">
      
      {/* Real Product Thumbnail Image Frame in Beige */}
      <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden relative flex-shrink-0 bg-[#e6dec9] border border-[#c8b894] shadow-2xs">
        <img 
          src={offerImage} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 space-y-1 text-left w-full">
        <span className="text-[10px] font-extrabold text-[#f96015] uppercase tracking-widest block">
          {tag}
        </span>

        <h3 className="font-urbanist font-extrabold text-lg sm:text-xl text-[#103b1d] leading-snug">
          {title}
        </h3>

        <p className="text-xs text-[#556b54] font-medium leading-relaxed">
          {description}
        </p>

        <div className="pt-2">
          <button 
            onClick={() => {
              if (code) showToast(`Coupon code ${code} activated!`);
              setCurrentPage('shop');
            }}
            className="px-4 py-2 bg-[#18542a] hover:bg-[#103b1d] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}


