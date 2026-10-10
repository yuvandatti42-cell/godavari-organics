import React, { useState } from 'react';
import { X, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileFilterModal({
  isOpen,
  onClose,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  selectedRatings,
  setSelectedRatings,
  sortBy,
  setSortBy,
  selectedTags = [],
  setSelectedTags = () => {},
  selectedBrands = [],
  setSelectedBrands = () => {},
  onReset
}) {
  const { categories } = useCart();
  const [activeTab, setActiveTab] = useState('sort'); // 'sort' | 'tags' | 'type' | 'brand' | 'price' | 'ratings'

  if (!isOpen) return null;

  const tabs = [
    { id: 'sort', label: 'Sort' },
    { id: 'tags', label: 'Tags' },
    { id: 'type', label: 'Type' },
    { id: 'brand', label: 'Brand' },
    { id: 'price', label: 'Price' },
    { id: 'ratings', label: 'Customer Ratings' },
  ];

  const sortOptions = [
    { id: 'featured', label: 'Relevance' },
    { id: 'price-low', label: 'Price (Low To High)' },
    { id: 'price-high', label: 'Price (High To Low)' },
    { id: 'discount', label: 'Discount (High To Low)' },
    { id: 'rating', label: 'Highest Rated' },
  ];

  const tagOptions = [
    'Organic Certified',
    'Pesticide-Free',
    'Stone-Ground',
    'Delta Farmed',
    'Bestseller'
  ];

  const brandOptions = [
    'Godavari Organics',
    'Delta Heritage Farms',
    'Konaseema Co-op'
  ];

  const priceTiers = [
    { label: 'Under ₹250', min: 100, max: 250 },
    { label: '₹250 - ₹500', min: 250, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: 'All Price Ranges', min: 100, max: 1000 }
  ];

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

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/65 backdrop-blur-xs font-sans animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-[#faf5ea] w-full h-[88vh] sm:h-[82vh] rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden max-w-lg mx-auto border-t border-[#d9ca9d]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#d9ca9d] flex items-center justify-between shrink-0 bg-[#f3e8cc]">
          <h2 className="font-urbanist font-extrabold text-lg sm:text-xl text-[#103b1d]">
            Filter Harvest
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#e6dec9] hover:bg-[#d9ca9d] text-[#103b1d] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Filter"
          >
            <X className="w-4 h-4 text-[#103b1d]" />
          </button>
        </div>

        {/* 2-Column Main Content Body */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* Left Vertical Navigation Tabs */}
          <div className="w-2/5 sm:w-36 bg-[#e6dec9]/50 border-r border-[#d9ca9d] py-2 flex flex-col overflow-y-auto shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-3.5 text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center ${
                    isActive 
                      ? 'font-extrabold text-[#18542a] bg-[#f3e8cc]' 
                      : 'font-semibold text-[#556b54] hover:text-[#103b1d] hover:bg-[#f3e8cc]/60'
                  }`}
                >
                  {/* Left Active Pill Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#18542a] rounded-r-full" />
                  )}
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Options Content Area */}
          <div className="flex-1 p-5 overflow-y-auto bg-[#f3e8cc] text-left">
            
            {/* 1. SORT TAB */}
            {activeTab === 'sort' && (
              <div className="space-y-4">
                <span className="text-[11px] font-extrabold text-[#18542a] tracking-wider uppercase block font-urbanist">
                  SORT BY
                </span>
                <div className="space-y-3.5">
                  {sortOptions.map((option) => {
                    const isSelected = sortBy === option.id;
                    return (
                      <label 
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className="flex items-center space-x-3 cursor-pointer text-xs sm:text-sm text-[#103b1d] font-medium select-none"
                      >
                        {/* Custom Radio Button */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#18542a] bg-[#faf5ea]' : 'border-[#c8b894] bg-[#faf5ea]'
                        }`}>
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#18542a]" />
                          )}
                        </div>
                        <span className={isSelected ? 'font-extrabold text-[#18542a]' : 'font-semibold'}>
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. TAGS TAB */}
            {activeTab === 'tags' && (
              <div className="space-y-4">
                <span className="text-[11px] font-extrabold text-[#18542a] tracking-wider uppercase block font-urbanist">
                  FILTER BY TAGS
                </span>
                <div className="space-y-3">
                  {tagOptions.map((tag) => {
                    const isChecked = selectedTags.includes(tag);
                    return (
                      <label 
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className="flex items-center space-x-3 cursor-pointer text-xs sm:text-sm text-[#103b1d] font-medium select-none"
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isChecked ? 'border-[#18542a] bg-[#18542a] text-[#ffc926]' : 'border-[#c8b894] bg-[#faf5ea]'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? 'font-extrabold text-[#18542a]' : 'font-semibold'}>
                          {tag}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. TYPE (CATEGORIES) TAB */}
            {activeTab === 'type' && (
              <div className="space-y-4">
                <span className="text-[11px] font-extrabold text-[#18542a] tracking-wider uppercase block font-urbanist">
                  PRODUCT TYPES
                </span>
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.name);
                    return (
                      <label 
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.name)}
                        className="flex items-center justify-between cursor-pointer text-xs sm:text-sm text-[#103b1d] font-medium select-none"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isChecked ? 'border-[#18542a] bg-[#18542a] text-[#ffc926]' : 'border-[#c8b894] bg-[#faf5ea]'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={isChecked ? 'font-extrabold text-[#18542a]' : 'font-semibold'}>
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#18542a]">({cat.count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. BRAND TAB */}
            {activeTab === 'brand' && (
              <div className="space-y-4">
                <span className="text-[11px] font-extrabold text-[#18542a] tracking-wider uppercase block font-urbanist">
                  BRANDS
                </span>
                <div className="space-y-3">
                  {brandOptions.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label 
                        key={brand}
                        onClick={() => handleBrandToggle(brand)}
                        className="flex items-center space-x-3 cursor-pointer text-xs sm:text-sm text-[#103b1d] font-medium select-none"
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isChecked ? 'border-[#18542a] bg-[#18542a] text-[#ffc926]' : 'border-[#c8b894] bg-[#faf5ea]'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? 'font-extrabold text-[#18542a]' : 'font-semibold'}>
                          {brand}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. PRICE TAB */}
            {activeTab === 'price' && (
              <div className="space-y-5">
                <span className="text-[11px] font-extrabold text-[#18542a] tracking-wider uppercase block font-urbanist">
                  PRICE RANGE
                </span>

                <div className="space-y-3">
                  {priceTiers.map((tier, idx) => {
                    const isSelected = priceRange[0] === tier.min && priceRange[1] === tier.max;
                    return (
                      <label 
                        key={idx}
                        onClick={() => setPriceRange([tier.min, tier.max])}
                        className="flex items-center space-x-3 cursor-pointer text-xs sm:text-sm text-[#103b1d] font-medium select-none"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#18542a] bg-[#faf5ea]' : 'border-[#c8b894] bg-[#faf5ea]'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#18542a]" />}
                        </div>
                        <span className={isSelected ? 'font-extrabold text-[#18542a]' : 'font-semibold'}>
                          {tier.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <hr className="border-[#d9ca9d]" />

                {/* Custom Slider */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs font-bold text-[#103b1d]">
                    <span>Custom Max Price:</span>
                    <span className="text-[#18542a] font-extrabold">₹{priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="50"
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[#18542a] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 6. CUSTOMER RATINGS TAB */}
            {activeTab === 'ratings' && (
              <div className="space-y-4">
                <span className="text-[11px] font-extrabold text-[#18542a] tracking-wider uppercase block font-urbanist">
                  MINIMUM RATING
                </span>
                <div className="space-y-3">
                  {[4, 3, 2].map((stars) => {
                    const isChecked = selectedRatings.includes(stars);
                    return (
                      <label 
                        key={stars} 
                        onClick={() => handleRatingToggle(stars)}
                        className="flex items-center space-x-3 cursor-pointer text-xs sm:text-sm text-[#103b1d] font-medium select-none"
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isChecked ? 'border-[#18542a] bg-[#18542a] text-[#ffc926]' : 'border-[#c8b894] bg-[#faf5ea]'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="flex items-center space-x-1.5 font-bold">
                          <span>{stars} ★ & Above</span>
                          <Star className="w-3.5 h-3.5 fill-[#ffc926] text-[#ffc926]" />
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Fixed Bottom Footer Action Bar */}
        <div className="px-6 py-4 border-t border-[#d9ca9d] flex items-center justify-between shrink-0 bg-[#f3e8cc]">
          <button
            onClick={() => {
              if (onReset) onReset();
            }}
            className="text-xs sm:text-sm font-bold text-[#18542a] hover:text-[#d52518] cursor-pointer underline underline-offset-4 transition-colors"
          >
            Clear Filters
          </button>

          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#103b1d] hover:bg-[#18542a] text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-md transition-all cursor-pointer active:scale-95 border border-[#103b1d]"
          >
            Apply
          </button>
        </div>

      </div>

    </div>
  );
}
