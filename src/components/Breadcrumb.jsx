import React from 'react';
import { useCart } from '../context/CartContext';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  const { setCurrentPage } = useCart();

  return (
    <nav className="flex items-center space-x-2 text-xs text-[#103b1d] font-sans py-2 mb-4 border-b border-[#d9ca9d]/70">
      <button 
        type="button"
        onClick={() => setCurrentPage('home')}
        className="flex items-center space-x-1 hover:text-[#18542a] hover:underline cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-[#556b54]" />
          {item.page ? (
            <button 
              type="button"
              onClick={() => setCurrentPage(item.page)}
              className="hover:text-[#18542a] hover:underline cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[#103b1d] font-bold truncate max-w-[200px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
