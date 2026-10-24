import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import MobileFilterModal from '../components/MobileFilterModal';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X, Search, Sparkles } from 'lucide-react';

const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Items', category: '' },
  { id: 'oils', label: 'Oils & Ghee', category: 'Oils' },
  { id: 'rice', label: 'Organic Rice', category: 'Organic Rice' },
  { id: 'millets', label: 'Siridhanya Millets', category: 'Organic Millets' },
  { id: 'spices', label: 'Farm Spices', category: 'Organic Spices' },
];

export default function Shop() {
  const { products, showToast, goBack, selectedCategoryFilter, setSelectedCategoryFilter } = useCart();
  
  const [selectedCategories, setSelectedCategories] = useState(
    selectedCategoryFilter ? [selectedCategoryFilter] : []
  );
  const [priceRange, setPriceRange] = useState([50, 2000]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [inShopSearch, setInShopSearch] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Category Ribbon Scroll & Drag State
  const categoryScrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (selectedCategoryFilter) {
      setSelectedCategories([selectedCategoryFilter]);
    } else {
      setSelectedCategories([]);
    }
  }, [selectedCategoryFilter]);

  // Dynamic category product counter
  const getCategoryCount = (catName) => {
    if (!catName) return products.length;
    return products.filter(p => p.category === catName).length;
  };

  // Check overflow and scroll positions for arrow buttons
  const updateScrollButtons = useCallback(() => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons, products]);

  // Click arrow button to slide
  const handleScrollRibbon = (direction) => {
    if (!categoryScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -220 : 220;
    categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Mouse Drag to Slide handlers
  const handleMouseDown = (e) => {
    if (!categoryScrollRef.current) return;
    isDraggingRef.current = true;
    setHasDragged(false);
    startXRef.current = e.pageX - categoryScrollRef.current.offsetLeft;
    scrollLeftRef.current = categoryScrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !categoryScrollRef.current) return;
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - startXRef.current);
    if (Math.abs(walk) > 4) {
      setHasDragged(true);
    }
    categoryScrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Mouse wheel to slide horizontally
  const handleWheel = (e) => {
    if (!categoryScrollRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      categoryScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Filter products logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      // Rating filter
      if (selectedRatings.length > 0) {
        const passesRating = selectedRatings.some(r => product.rating >= r);
        if (!passesRating) return false;
      }
      // In-shop instant text search
      if (inShopSearch.trim()) {
        const q = inShopSearch.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(q);
        const matchShort = product.shortName?.toLowerCase().includes(q);
        const matchSub = product.subtitle?.toLowerCase().includes(q);
        const matchCraft = product.craftTag?.toLowerCase().includes(q);
        if (!matchName && !matchShort && !matchSub && !matchCraft) return false;
      }
      return true;
    });
  }, [products, selectedCategories, priceRange, selectedRatings, inShopSearch]);

  // Sorting
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [filteredProducts, sortBy]);

  const handleReset = () => {
    setSelectedCategories([]);
    if (setSelectedCategoryFilter) setSelectedCategoryFilter('');
    setPriceRange([50, 2000]);
    setSelectedRatings([]);
    setSelectedTags([]);
    setSelectedBrands([]);
    setSortBy('featured');
    setInShopSearch('');
    showToast('Filters reset to default');
  };

  const handleQuickCategoryClick = (catCategory) => {
    if (!catCategory) {
      setSelectedCategories([]);
      if (setSelectedCategoryFilter) setSelectedCategoryFilter('');
    } else {
      setSelectedCategories([catCategory]);
      if (setSelectedCategoryFilter) setSelectedCategoryFilter(catCategory);
    }
    setCurrentPageNum(1);
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-12 xl:px-16 py-3 md:py-6 space-y-4 sm:space-y-6 font-sans">
      
      {/* 1. Control Bar: Filter, Quick Search & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 py-2 border-b border-[#d9ca9d] text-xs">
        {/* Left Side: Filter Modal Trigger + Product Count */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#f3e8cc] hover:bg-[#e6dec9] border border-[#d9ca9d] text-[#103b1d] font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#18542a]" />
            <span>Filters</span>
          </button>
          
          <span className="text-[#556b54] font-bold text-xs">
            {sortedProducts.length} items
          </span>
        </div>

        {/* Center: In-page Quick Search Pill */}
        <div className="relative flex-1 min-w-[150px] max-w-[260px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={inShopSearch}
            onChange={(e) => setInShopSearch(e.target.value)}
            placeholder="Search oils, rice, spices..."
            className="w-full pl-8 pr-7 py-1.5 bg-[#fbf8f0] border border-[#d9ca9d] rounded-xl text-xs text-[#103b1d] placeholder:text-stone-400 focus:outline-none focus:border-[#103b1d]"
          />
          {inShopSearch && (
            <button
              onClick={() => setInShopSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Right Side: Sort Dropdown Pill */}
        <div className="flex items-center space-x-1.5 bg-[#f3e8cc] border border-[#d9ca9d] px-2.5 sm:px-3 py-1.5 rounded-xl shadow-2xs">
          <span className="text-slate-500 font-medium hidden xs:inline">Sort:</span>
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
          <ArrowUpDown className="w-3 h-3 text-[#18542a] pointer-events-none" />
        </div>
      </div>

      {/* 2. Interactive Horizontal Category Quick-Filter Ribbon with Multi-Input Sliding */}
      <div className="relative w-full max-w-full group">
        {/* Left Scroll Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScrollRibbon('left')}
            className="absolute -left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white text-[#103b1d] shadow-md border border-[#dfd5bf] flex items-center justify-center hover:bg-[#103b1d] hover:text-white transition-all cursor-pointer active:scale-90"
            aria-label="Slide categories left"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {/* Sliding Categories Container */}
        <div
          ref={categoryScrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          className="flex items-center space-x-2 overflow-x-auto py-1 px-1 no-scrollbar touch-pan-x cursor-grab active:cursor-grabbing select-none w-full scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {QUICK_CATEGORIES.map((cat) => {
            const isSelected = (!cat.category && selectedCategories.length === 0) ||
              (cat.category && selectedCategories.length === 1 && selectedCategories[0] === cat.category);
            const count = getCategoryCount(cat.category);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => {
                  if (hasDragged) {
                    e.preventDefault();
                    return;
                  }
                  handleQuickCategoryClick(cat.category);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#103b1d] text-white border-[#103b1d] shadow-sm ring-2 ring-[#ffc926]/30'
                    : 'bg-[#faf6ee] hover:bg-[#f3ebd7] text-[#103b1d] border-[#dfd5bf]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isSelected ? 'bg-[#ffc926] text-[#103b1d]' : 'bg-[#ebdcb9] text-[#103b1d]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScrollRibbon('right')}
            className="absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white text-[#103b1d] shadow-md border border-[#dfd5bf] flex items-center justify-center hover:bg-[#103b1d] hover:text-white transition-all cursor-pointer active:scale-90"
            aria-label="Slide categories right"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Active Filter Chips Strip (If Any Filter Applied) */}
      {(selectedCategories.length > 0 || inShopSearch) && (
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <span className="text-stone-500 text-[11px] font-medium">Active:</span>
          {selectedCategories.map((c) => (
            <span 
              key={c}
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-[#eaf4ec] text-[#18542a] border border-[#a3cca8] rounded-full text-[11px] font-bold"
            >
              <span>{c}</span>
              <button 
                onClick={() => setSelectedCategories(prev => prev.filter(x => x !== c))}
                className="hover:text-red-500 cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {inShopSearch && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-[#fbf2da] text-[#855e08] border border-[#d9ca9d] rounded-full text-[11px] font-bold">
              <span>"{inShopSearch}"</span>
              <button 
                onClick={() => setInShopSearch('')}
                className="hover:text-red-500 cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleReset}
            className="text-[11px] font-extrabold text-[#18542a] hover:underline cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}

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

        {/* Mobile Split-Tab Filter Overlay Modal */}
        <MobileFilterModal 
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          onReset={handleReset}
        />

        {/* Products Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4.5">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-12 text-center space-y-3 shadow-xs">
              <div className="text-[#18542a] text-sm font-semibold">No products match your selected filters.</div>
              <button 
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#18542a] hover:bg-[#103b1d] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Clean Pagination / Product Status Bar */}
          <div className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-3.5 flex items-center justify-between text-xs font-medium shadow-xs">
            <span className="text-[#556b54] font-bold">
              Showing all {sortedProducts.length} certified organic products
            </span>

            <div className="flex items-center space-x-1">
              <span className="text-[11px] font-bold text-[#18542a] bg-[#e6dec9] px-2.5 py-1 rounded-lg border border-[#d9ca9d]">
                100% Certified Farm Pure
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

