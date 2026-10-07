import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X, Sprout } from 'lucide-react';

export default function Shop() {
  const { products, showToast, goBack } = useCart();
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([100, 1000]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products logic
  const filteredProducts = products.filter(product => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (selectedRatings.length > 0) {
      const passesRating = selectedRatings.some(r => product.rating >= r);
      if (!passesRating) return false;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  const handleReset = () => {
    setSelectedCategories([]);
    setPriceRange([100, 1000]);
    setSelectedRatings([]);
    setSortBy('featured');
    showToast('Filters reset to default');
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 md:py-8 space-y-6 font-sans">
      
      {/* Page Header (← Shop [🔍 ⇶]) */}
      <div className="flex items-center justify-between py-2 border-b border-[#d9ca9d]">
        <div className="flex items-center space-x-3">
          <button 
            onClick={goBack}
            className="p-1 text-[#103b1d] hover:text-[#18542a] cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-urbanist font-extrabold text-xl text-[#103b1d]">
            Shop
          </h1>
        </div>

        <div className="flex items-center space-x-3 text-[#103b1d]">
          <button 
            onClick={() => showToast('Search catalog...')} 
            className="p-1 hover:text-[#18542a] cursor-pointer"
          >
            <SlidersHorizontal className="w-5 h-5 rotate-90" />
          </button>
          <button 
            onClick={() => setMobileFilterOpen(true)}
            className="p-1 hover:text-[#18542a] cursor-pointer"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Control Bar (Matching Screenshot: [Filter] | [Sort by: Relevance v] | 128 products) */}
      <div className="flex items-center justify-between gap-2 py-2 border-b border-[#d9ca9d] text-xs">
        {/* Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="px-3.5 py-2 bg-[#f3e8cc] hover:bg-[#e6dec9] border border-[#d9ca9d] text-[#103b1d] font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#18542a]" />
          <span>Filter</span>
        </button>

        {/* Sort Dropdown Selector Pill */}
        <div className="flex items-center space-x-1.5 bg-[#f3e8cc] border border-[#d9ca9d] px-3 py-1.5 rounded-xl shadow-2xs">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-[#103b1d] font-bold focus:outline-none text-xs cursor-pointer"
          >
            <option value="featured">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <ArrowUpDown className="w-3 h-3 text-[#18542a] pointer-events-none ml-1" />
        </div>

        {/* Product Count Indicator */}
        <div className="text-[#556b54] font-medium text-xs">
          {sortedProducts.length} products
        </div>
      </div>

      {/* Main Shop Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-3">
          <FilterSidebar 
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
            onReset={handleReset}
          />
        </div>

        {/* Mobile Filter Overlay Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end lg:hidden">
            <div className="bg-white w-full max-w-xs h-full p-5 overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-[#f3e8cc] pb-3">
                <h3 className="font-extrabold text-sm text-[#18542a] font-urbanist uppercase">Filter Harvest</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1.5 rounded-full bg-[#f3e8cc] text-[#18542a]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <FilterSidebar 
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedRatings={selectedRatings}
                setSelectedRatings={setSelectedRatings}
                onReset={handleReset}
              />

              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#18542a] text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-12 text-center space-y-3 shadow-xs">
              <div className="text-[#18542a] text-sm font-semibold">No products match your selected filters.</div>
              <button 
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#18542a] hover:bg-[#103b1d] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Bar Frame in Beige */}
          <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-4 flex items-center justify-between text-xs font-medium shadow-xs">
            <span className="text-[#556b54] font-semibold">Page 1 of 3</span>

            <div className="flex items-center space-x-1.5">
              <button 
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum(p => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-xl border border-[#d9ca9d] bg-[#e6dec9] hover:bg-[#d9ca9d] text-[#18542a] flex items-center justify-center disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setCurrentPageNum(1)}
                className={`w-8 h-8 rounded-xl font-extrabold transition-colors ${currentPageNum === 1 ? 'bg-[#18542a] text-white' : 'bg-[#e6dec9] text-[#18542a] hover:bg-[#ffc926]'}`}
              >
                1
              </button>

              <button 
                onClick={() => setCurrentPageNum(2)}
                className={`w-8 h-8 rounded-xl font-extrabold transition-colors ${currentPageNum === 2 ? 'bg-[#18542a] text-white' : 'bg-[#e6dec9] text-[#18542a] hover:bg-[#ffc926]'}`}
              >
                2
              </button>

              <button 
                onClick={() => setCurrentPageNum(3)}
                className={`w-8 h-8 rounded-xl font-extrabold transition-colors ${currentPageNum === 3 ? 'bg-[#18542a] text-white' : 'bg-[#e6dec9] text-[#18542a] hover:bg-[#ffc926]'}`}
              >
                3
              </button>

              <button 
                onClick={() => setCurrentPageNum(p => Math.min(3, p + 1))}
                className="w-8 h-8 rounded-xl border border-[#d9ca9d] bg-[#e6dec9] hover:bg-[#d9ca9d] text-[#18542a] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

