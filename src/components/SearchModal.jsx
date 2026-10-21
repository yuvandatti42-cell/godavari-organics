import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import { Search, Clock, X, XCircle } from 'lucide-react';

export default function SearchModal() {
  const { searchModalOpen, setSearchModalOpen, products, navigateToProduct } = useCart();
  const [query, setQuery] = useState('');
  
  // Sample initial recent search items matching catalog
  const [recentSearches, setRecentSearches] = useState([
    'Cold Pressed Groundnut Oil',
    'Desi Gir Cow A2 Ghee',
    'High-Curcumin Turmeric Powder'
  ]);

  // Sample popular search pill tags
  const popularTags = ['Oils', 'Organic Rice', 'Organic Millets', 'Organic Spices'];

  if (!searchModalOpen) return null;

  const handleRemoveRecent = (itemToRemove, e) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter(item => item !== itemToRemove));
  };

  const handleSelectQuery = (text) => {
    setQuery(text);
  };

  // Filter products by search query
  const matchingProducts = query.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Trending default products to display when search box is empty
  const trendingProducts = products.slice(2, 6); // e.g. Organic Jaggery, Red Rice, etc.
  const displayProducts = query.trim() ? matchingProducts : trendingProducts;

  return (
    <div className="fixed inset-0 z-50 bg-[#faf5ea] flex flex-col font-sans overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-4 space-y-6 flex-1 flex flex-col">
        
        {/* 1. TOP SEARCH BAR ROW (Matching Screenshot: [🔍 Organic R | ] Cancel) */}
        <div className="flex items-center space-x-3 pt-2">
          <div className="flex-1 relative">
            <input 
              type="text"
              autoFocus
              placeholder="Search organic products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-urbanist font-extrabold text-[#103b1d] focus:outline-none focus:bg-white focus:border-[#103b1d] focus:ring-1 focus:ring-[#103b1d] placeholder-stone-400"
            />
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button 
            onClick={() => setSearchModalOpen(false)}
            className="text-sm font-urbanist font-extrabold text-stone-600 hover:text-[#103b1d] px-2 py-1 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* 2. RECENT SEARCHES SECTION */}
        {recentSearches.length > 0 && !query && (
          <div className="space-y-2 text-left">
            <h3 className="font-urbanist font-extrabold text-sm text-[#103b1d] tracking-tight">
              Recent Searches
            </h3>
            
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
              {recentSearches.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectQuery(item)}
                  className="px-4 py-3 flex items-center justify-between text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{item}</span>
                  </div>

                  <button 
                    onClick={(e) => handleRemoveRecent(item, e)}
                    className="text-stone-300 hover:text-rose-500 p-0.5"
                    title="Remove from history"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. POPULAR SEARCHES SECTION */}
        {!query && (
          <div className="space-y-2 text-left">
            <h3 className="font-urbanist font-extrabold text-sm text-[#103b1d] tracking-tight">
              Popular Searches
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectQuery(tag)}
                  className="px-4 py-1.5 bg-white hover:bg-[#103b1d] hover:text-white border border-stone-200 text-stone-700 text-xs font-bold rounded-full transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. TRENDING PRODUCTS / MATCHING RESULTS GRID */}
        <div className="space-y-3 text-left flex-1 pb-6">
          <h3 className="font-urbanist font-extrabold text-sm text-[#103b1d] tracking-tight">
            {query ? `Search Results (${matchingProducts.length})` : 'Trending Products'}
          </h3>

          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {displayProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  onClick={() => setSearchModalOpen(false)}
                >
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-2">
              <p className="text-xs text-stone-500 font-medium">No organic products found for "{query}".</p>
              <button 
                onClick={() => setQuery('')}
                className="text-xs font-extrabold text-[#18542a] underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
