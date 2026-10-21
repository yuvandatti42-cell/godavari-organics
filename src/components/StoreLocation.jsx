import React from 'react';
import { Navigation, ArrowUpRight } from 'lucide-react';

const GOOGLE_MAPS_LINK = "https://www.google.com/maps/place/Godavari+Organic+Foods(Chekha,+wood+preesed+oils)/@16.7089115,81.0895065,17z/data=!3m1!4b1!4m6!3m5!1s0x3a3614b07fcbcc67:0x4c73b6600731c926!8m2!3d16.7089064!4d81.0920814!16s%2Fg%2F11hbvbff4r?entry=ttu";
const MAPS_EMBED_URL = "https://maps.google.com/maps?q=16.7089064,81.0920814&t=&z=16&ie=UTF8&iwloc=&output=embed";

export default function StoreLocation() {
  return (
    <section className="space-y-3 sm:space-y-4 pt-2 pb-2">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-urbanist font-extrabold text-xl sm:text-2xl md:text-3xl text-[#103b1d] tracking-tight text-left">
          Our Location
        </h2>
        <a
          href={GOOGLE_MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 font-urbanist font-extrabold text-xs sm:text-sm text-[#18542a] hover:text-[#103b1d] underline underline-offset-4 transition-colors cursor-pointer"
        >
          <span>Open in Google Maps</span>
          <ArrowUpRight className="w-4 h-4 ml-0.5" />
        </a>
      </div>

      {/* FULL MAP CARD CONTAINER: 100% MAP ONLY */}
      <div className="w-full h-[220px] xs:h-[240px] sm:h-[300px] md:h-[380px] bg-[#f3e8cc] border border-[#d9ca9d] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all relative">
        {/* Full-bleed Google Maps iframe */}
        <iframe
          title="Godavari Organic Foods Google Maps Location"
          src={MAPS_EMBED_URL}
          className="w-full h-full border-0 absolute inset-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating "Get Directions" Pill in the Top Right Corner */}
        <a
          href={GOOGLE_MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white/95 hover:bg-white text-[#103b1d] hover:text-[#18542a] text-xs font-extrabold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#d9ca9d] shadow-md flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <Navigation className="w-3.5 h-3.5 text-[#18542a]" />
          <span>Get Directions</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
