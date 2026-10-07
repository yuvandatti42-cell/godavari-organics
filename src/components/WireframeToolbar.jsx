import React from 'react';
import { useCart } from '../context/CartContext';
import { Monitor, Smartphone, Layout, ShoppingBag, ShoppingCart, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';

export default function WireframeToolbar() {
  const { currentPage, setCurrentPage, deviceFrame, setDeviceFrame } = useCart();

  return (
    <div className="bg-neutral-900 text-neutral-200 border-b border-neutral-800 text-xs px-4 py-2 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Title */}
        <div className="flex items-center space-x-2 font-mono">
          <span className="bg-neutral-800 text-amber-400 px-2 py-0.5 rounded text-[11px] font-bold border border-neutral-700">
            FIGMA WIREFRAME CANVAS
          </span>
          <span className="text-neutral-400 hidden md:inline">|</span>
          <span className="text-neutral-300 font-semibold hidden md:inline">GODAVARI ORGANIC FOODS</span>
        </div>

        {/* Center Page Selector */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none text-[11px]">
          <span className="text-neutral-500 font-mono uppercase mr-1 text-[10px]">Page:</span>
          
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center space-x-1 ${
              currentPage === 'home'
                ? 'bg-neutral-100 text-neutral-900 font-bold border-white'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            <Layout className="w-3 h-3" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setCurrentPage('shop')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center space-x-1 ${
              currentPage === 'shop'
                ? 'bg-neutral-100 text-neutral-900 font-bold border-white'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Shop Harvest</span>
          </button>

          <button
            onClick={() => setCurrentPage('product')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center space-x-1 ${
              currentPage === 'product'
                ? 'bg-neutral-100 text-neutral-900 font-bold border-white'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            <span>Product Detail</span>
          </button>

          <button
            onClick={() => setCurrentPage('cart')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center space-x-1 ${
              currentPage === 'cart'
                ? 'bg-neutral-100 text-neutral-900 font-bold border-white'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            <ShoppingCart className="w-3 h-3" />
            <span>Cart Screen</span>
          </button>

          <button
            onClick={() => setCurrentPage('checkout')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center space-x-1 ${
              currentPage === 'checkout'
                ? 'bg-neutral-100 text-neutral-900 font-bold border-white'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            <CreditCard className="w-3 h-3" />
            <span>Checkout Screen</span>
          </button>

          <button
            onClick={() => setCurrentPage('order-success')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center space-x-1 ${
              currentPage === 'order-success'
                ? 'bg-neutral-100 text-neutral-900 font-bold border-white'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmation</span>
          </button>
        </div>

        {/* Right Viewport Mode Switcher */}
        <div className="flex items-center space-x-1 border-l border-neutral-700 pl-3">
          <button
            onClick={() => setDeviceFrame('desktop')}
            className={`px-2 py-1 rounded text-[11px] flex items-center space-x-1 border ${
              deviceFrame === 'desktop'
                ? 'bg-amber-400 text-neutral-950 font-bold border-amber-300'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
            }`}
            title="Force Desktop Wireframe View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDeviceFrame('mobile')}
            className={`px-2 py-1 rounded text-[11px] flex items-center space-x-1 border ${
              deviceFrame === 'mobile'
                ? 'bg-amber-400 text-neutral-950 font-bold border-amber-300'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
            }`}
            title="Force Mobile Frame (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile Frame</span>
          </button>

          <button
            onClick={() => setDeviceFrame('responsive')}
            className={`px-2 py-1 rounded text-[11px] flex items-center space-x-1 border ${
              deviceFrame === 'responsive'
                ? 'bg-neutral-200 text-neutral-900 font-bold border-white'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
            }`}
            title="Auto Responsive View"
          >
            <span>Auto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
