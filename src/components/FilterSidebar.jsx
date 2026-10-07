import React from 'react';
import { useCart } from '../context/CartContext';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';

export default function FilterSidebar({ 
  selectedCategories, 
  setSelectedCategories, 
  priceRange, 
  setPriceRange,
  selectedRatings,
  setSelectedRatings,
  onReset
}) {
  const { categories } = useCart();

  const handleCategoryToggle = (catName) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  const handleRatingToggle = (stars) => {
    if (selectedRatings.includes(stars)) {
      setSelectedRatings(selectedRatings.filter(r => r !== stars));
    } else {
      setSelectedRatings([...selectedRatings, stars]);
    }
  };

  return (
    <aside className="w-full bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-5 space-y-6 font-sans shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#d9ca9d]/70 pb-3">
        <div className="flex items-center space-x-2 font-extrabold text-xs text-[#18542a] uppercase tracking-wider font-urbanist">
          <Filter className="w-4 h-4 text-[#18542a]" />
          <span>Refine Harvest</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#18542a] hover:text-[#f96015] font-extrabold flex items-center space-x-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3 text-[#f96015]" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#18542a] border-b border-[#f3e8cc] pb-1.5 font-urbanist">
          Categories
        </h4>
        <div className="space-y-2 text-xs">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat.name);
            return (
              <label 
                key={cat.id} 
                className="flex items-center space-x-2.5 cursor-pointer text-[#18542a]/80 hover:text-[#18542a] select-none font-medium"
              >
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={() => handleCategoryToggle(cat.name)}
                  className="w-4 h-4 rounded border-gray-300 text-[#18542a] focus:ring-[#9abc05] accent-[#18542a]"
                />
                <span className={`flex-1 ${isChecked ? 'font-extrabold text-[#18542a]' : ''}`}>{cat.name}</span>
                <span className="text-[10px] font-extrabold text-[#9abc05]">({cat.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider Filter */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#18542a] border-b border-[#f3e8cc] pb-1.5 font-urbanist">
          Max Price (₹{priceRange[1]})
        </h4>
        <div className="space-y-2">
          <input 
            type="range" 
            min="100" 
            max="1000" 
            step="50"
            value={priceRange[1]} 
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-[#18542a] cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-[#18542a] font-extrabold">
            <span className="border border-[#9abc05]/40 rounded-lg px-2.5 py-1 bg-[#f3e8cc]/40">₹{priceRange[0]}</span>
            <span className="text-[#9abc05] font-bold">to</span>
            <span className="border border-[#9abc05]/40 rounded-lg px-2.5 py-1 bg-[#f3e8cc]/40">₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#18542a] border-b border-[#f3e8cc] pb-1.5 font-urbanist">
          Minimum Rating
        </h4>
        <div className="space-y-2 text-xs">
          {[5, 4, 3].map((stars) => {
            const isChecked = selectedRatings.includes(stars);
            return (
              <label key={stars} className="flex items-center space-x-2 cursor-pointer select-none text-[#18542a]">
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleRatingToggle(stars)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#18542a]"
                />
                <span className="flex items-center space-x-1 font-bold">
                  <span>{stars} Stars & Above</span>
                  <Star className="w-3.5 h-3.5 fill-[#ffc926] text-[#ffc926]" />
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-2 pt-2 border-t border-[#f3e8cc]">
        <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#18542a] font-bold">
          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 accent-[#18542a]" />
          <span>In Stock Only</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#18542a] font-bold">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#18542a]" />
          <span className="text-[#d52518]">On Special Discount</span>
        </label>
      </div>
    </aside>
  );
}

