import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export default function TestimonialCard({ name, location, quote, rating = 5, itemBought, avatar }) {
  const customerAvatar = avatar || `https://images.unsplash.com/photo-${name.includes('Ananya') ? '1534528741775-53994a69daeb' : name.includes('Vikram') ? '1507003211169-0a1dd7228f2d' : '1544005313-94ddf0286df2'}?auto=format&fit=crop&q=80&w=200`;

  return (
    <div className="bg-[#faf8f3] rounded-2xl border border-[#e8e4d8] p-5 flex flex-col justify-between space-y-4 font-sans editorial-card relative">
      <Quote className="w-8 h-8 text-[#ebe7dc] absolute top-4 right-4 pointer-events-none" />

      <div className="space-y-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex text-[#8f8a42]">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < rating ? 'fill-[#8f8a42] text-[#8f8a42]' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="inline-flex items-center space-x-1 text-[10px] text-[#4a5228] font-bold bg-[#d4c870]/30 px-2.5 py-0.5 rounded-full border border-[#d4c870]/50">
            <CheckCircle2 className="w-3 h-3 text-[#4a5228]" />
            <span>Verified Buyer</span>
          </span>
        </div>

        <p className="text-xs text-[#252b16] italic font-serif leading-relaxed">
          "{quote}"
        </p>
      </div>

      <div className="border-t border-[#e2ded2] pt-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={customerAvatar} 
            alt={name}
            className="w-9 h-9 rounded-full object-cover border border-[#b8a84a]"
          />
          <div>
            <h4 className="font-bold text-xs text-[#252b16]">{name}</h4>
            <p className="text-[10px] text-[#6b7340]">{location}</p>
          </div>
        </div>

        {itemBought && (
          <span className="text-[10px] text-[#4a5228] font-semibold bg-[#ebe7dc] px-2.5 py-0.5 rounded-full max-w-[110px] truncate">
            {itemBought}
          </span>
        )}
      </div>
    </div>
  );
}

