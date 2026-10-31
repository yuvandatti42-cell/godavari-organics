import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, User, Menu, X, Leaf, Sparkles, ChevronRight, CheckCircle2, Truck, Phone, Home, Package, CreditCard, MapPin, ArrowLeft } from 'lucide-react';

export default function Header() {
  const headerRef = useRef(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty('--header-height', `${headerRef.current.offsetHeight}px`);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);
  const { 
    currentPage, 
    setCurrentPage, 
    goBack,
    cartCount, 
    setMobileMenuOpen, 
    mobileMenuOpen, 
    showToast,
    setAuthModalOpen,
    user,
    setSearchModalOpen,
    navigateToProduct,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    products
  } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = searchQuery.trim() 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchModalOpen(true);
  };

  return (
    <header ref={headerRef} className="w-full font-sans sticky top-0 z-40 shadow-sm">
      {/* Top Organic Announcement Bar */}
      <div className="bg-[#18542a] text-white text-xs py-2 px-4 border-b border-[#9abc05]/30">
        <div className="w-full max-w-[1920px] mx-auto flex justify-between items-center text-[11px] font-semibold tracking-wide">
          <div className="flex items-center space-x-2.5">
            <span className="bg-[#ffc926] text-[#18542a] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase shadow-xs">
              100% Organic
            </span>
            <span className="hidden sm:inline text-[#f3e8cc]">
              Directly Sourced From Godavari River Delta Farmers
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[#f3e8cc]">
            <span className="hidden md:inline text-[#ffc926] font-bold flex items-center">
              <Truck className="w-3.5 h-3.5 inline mr-1 text-[#ffc926]" />
              Free Shipping over ₹999
            </span>
            <span className="hidden md:inline opacity-40">|</span>
            <button 
              onClick={() => window.open('tel:+919010088063', '_self')} 
              className="hover:text-[#ffc926] transition-colors flex items-center"
            >
              <Phone className="w-3.5 h-3.5 inline mr-1 text-[#ffc926]" />
              +91 90100 88063
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Nav - Matches Wireframe Reference on Mobile & Editorial Desktop */}
      <div className="bg-[#f3e8cc] border-b border-[#e2d5b5] transition-all">
        <div className="w-full max-w-[1920px] mx-auto px-2.5 sm:px-8 lg:px-12 xl:px-16 py-2.5 lg:py-3.5 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Left Side: Navigation Links on Desktop & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-[#18542a] hover:bg-[#e8d9b5] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden lg:flex items-center space-x-5 text-xs font-bold text-[#18542a] tracking-wider uppercase">
              {[
                {
                  id: 'home',
                  label: 'Home',
                  action: () => setCurrentPage('home'),
                  isActive: currentPage === 'home',
                },
                {
                  id: 'all',
                  label: 'All Shop',
                  action: () => {
                    if (setSelectedCategoryFilter) setSelectedCategoryFilter('');
                    setCurrentPage('shop');
                  },
                  isActive: currentPage === 'shop' && (!selectedCategoryFilter || selectedCategoryFilter === ''),
                },
                {
                  id: 'oils',
                  label: 'Oils',
                  action: () => {
                    if (setSelectedCategoryFilter) setSelectedCategoryFilter('Oils');
                    setCurrentPage('shop');
                  },
                  isActive: currentPage === 'shop' && selectedCategoryFilter === 'Oils',
                },
                {
                  id: 'rice',
                  label: 'Rice',
                  action: () => {
                    if (setSelectedCategoryFilter) setSelectedCategoryFilter('Organic Rice');
                    setCurrentPage('shop');
                  },
                  isActive: currentPage === 'shop' && selectedCategoryFilter === 'Organic Rice',
                },
                {
                  id: 'millets',
                  label: 'Millets',
                  action: () => {
                    if (setSelectedCategoryFilter) setSelectedCategoryFilter('Organic Millets');
                    setCurrentPage('shop');
                  },
                  isActive: currentPage === 'shop' && selectedCategoryFilter === 'Organic Millets',
                },
                {
                  id: 'spices',
                  label: 'Spices',
                  action: () => {
                    if (setSelectedCategoryFilter) setSelectedCategoryFilter('Organic Spices');
                    setCurrentPage('shop');
                  },
                  isActive: currentPage === 'shop' && selectedCategoryFilter === 'Organic Spices',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`transition-all duration-200 cursor-pointer ${
                    item.isActive
                      ? 'font-extrabold text-[#18542a] underline underline-offset-4 decoration-[#9abc05] decoration-3'
                      : 'hover:text-[#9abc05]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Center: Brand Logo & Title (Flex-Centered, No Overlap) */}
          <div className="flex-1 min-w-0 flex items-center justify-center px-1">
            <button 
              onClick={() => setCurrentPage('home')}
              className="group flex items-center space-x-2 sm:space-x-3 text-center transition-transform active:scale-95 cursor-pointer py-0.5 min-w-0"
            >
              <img 
                src="/logo.png" 
                alt="Godavari Organics Symbol Logo" 
                className="h-9 xs:h-10 sm:h-12 lg:h-14 w-auto object-contain transition-transform group-hover:scale-105 shrink-0 drop-shadow-xs" 
              />
              <span className="font-urbanist font-black text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl text-[#18542a] tracking-tight group-hover:text-[#9abc05] transition-colors leading-none uppercase truncate">
                Godavari Organics
              </span>
            </button>
          </div>

          {/* Right Side: Search Input & Cart Count Badge */}
          <div className="flex items-center space-x-1.5 sm:space-x-4 shrink-0">
            {/* Mobile Search Button */}
            <button 
              onClick={() => setSearchModalOpen(true)}
              className="lg:hidden p-1.5 text-[#18542a] hover:bg-[#e8d9b5] rounded-lg transition-colors cursor-pointer"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Live Search Bar for Desktop */}
            <div className="hidden lg:block relative max-w-[180px]">
              <div 
                onClick={() => setSearchModalOpen(true)}
                className="relative cursor-pointer"
              >
                <input 
                  type="text" 
                  readOnly
                  placeholder="Search..."
                  className="w-full pl-3 pr-8 py-1.5 text-xs bg-white/70 border-b-2 border-[#18542a]/40 focus:border-[#18542a] focus:outline-none placeholder:text-[#18542a]/60 text-[#18542a] rounded-t-md cursor-pointer"
                />
                <Search className="w-3.5 h-3.5 absolute right-2 top-2.5 text-[#18542a] pointer-events-none" />
              </div>

              {/* Live Search Results Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full right-0 w-64 mt-2 bg-[#faf5ea] rounded-xl shadow-xl border border-[#9abc05]/40 p-2 z-50 animate-fadeIn space-y-1">
                  <div className="text-[10px] font-extrabold text-[#f96015] uppercase px-3 py-1">Matching Products</div>
                  {searchResults.map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        navigateToProduct(prod.id);
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="p-2 hover:bg-[#f3e8cc] rounded-lg cursor-pointer flex items-center space-x-3 transition-colors"
                    >
                      <img src={prod.image} alt={prod.name} className="w-9 h-9 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-xs font-bold text-[#18542a] truncate">{prod.name}</div>
                        <div className="text-[10px] text-[#9abc05] font-extrabold">₹{prod.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account Icon / Customer Profile Pill */}
            {user ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 py-1 px-2.5 sm:px-3 bg-[#18542a]/10 hover:bg-[#18542a]/20 border border-[#18542a]/30 rounded-xl text-xs font-bold text-[#18542a] transition-all cursor-pointer shadow-xs active:scale-95"
                title={`Signed in as ${user.name}`}
              >
                <div className="w-5 h-5 rounded-full bg-[#18542a] text-white flex items-center justify-center text-[10px] uppercase font-black">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="hidden md:inline max-w-[90px] truncate">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center space-x-1 p-2 text-[#18542a] hover:bg-[#e8d9b5] rounded-xl transition-colors cursor-pointer"
                title="Customer Sign In"
              >
                <User className="w-5 h-5" />
                <span className="hidden xl:inline text-xs font-bold uppercase tracking-wider pl-1">Sign In</span>
              </button>
            )}

            {/* Cart Icon & Count Badge */}
            <button 
              onClick={() => setCurrentPage('cart')}
              className="flex items-center space-x-1.5 text-xs font-bold text-[#18542a] hover:text-[#f96015] transition-colors bg-white/80 border border-[#9abc05]/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#18542a]" />
              <span className="bg-[#18181b] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs min-w-5 text-center">
                {cartCount}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f3e8cc] border-b border-[#e2d5b5] px-4 py-5 space-y-4 font-sans text-xs shadow-xl animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input 
              type="text" 
              placeholder="Search organic products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#9abc05]/40 rounded-xl text-xs focus:outline-none focus:border-[#18542a] text-[#18542a]"
            />
            <Search className="w-4 h-4 absolute left-3 text-[#18542a]/60 pointer-events-none" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-center">
            <button 
              onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left font-bold flex items-center space-x-2 ${currentPage === 'home' ? 'bg-[#18542a] text-white border-[#18542a]' : 'bg-white text-[#18542a] border-[#e2d5b5]'}`}
            >
              <Home className="w-4 h-4 flex-shrink-0" />
              <span>Home Page</span>
            </button>
            <button 
              onClick={() => { setCurrentPage('shop'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left font-bold flex items-center space-x-2 ${currentPage === 'shop' ? 'bg-[#18542a] text-white border-[#18542a]' : 'bg-white text-[#18542a] border-[#e2d5b5]'}`}
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              <span>Shop Harvest</span>
            </button>
            <button 
              onClick={() => { setCurrentPage('product'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left font-bold flex items-center space-x-2 ${currentPage === 'product' ? 'bg-[#18542a] text-white border-[#18542a]' : 'bg-white text-[#18542a] border-[#e2d5b5]'}`}
            >
              <Package className="w-4 h-4 flex-shrink-0" />
              <span>Product Details</span>
            </button>
            <button 
              onClick={() => { setCurrentPage('cart'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left font-bold flex items-center space-x-2 ${currentPage === 'cart' ? 'bg-[#18542a] text-white border-[#18542a]' : 'bg-white text-[#18542a] border-[#e2d5b5]'}`}
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              <span>My Cart ({cartCount})</span>
            </button>
            <button 
              onClick={() => { setCurrentPage('checkout'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left font-bold flex items-center space-x-2 ${currentPage === 'checkout' ? 'bg-[#18542a] text-white border-[#18542a]' : 'bg-white text-[#18542a] border-[#e2d5b5]'}`}
            >
              <CreditCard className="w-4 h-4 flex-shrink-0" />
              <span>Checkout</span>
            </button>
            <button 
              onClick={() => { setCurrentPage('order-success'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left font-bold flex items-center space-x-2 ${currentPage === 'order-success' ? 'bg-[#18542a] text-white border-[#18542a]' : 'bg-white text-[#18542a] border-[#e2d5b5]'}`}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Confirmation</span>
            </button>
          </div>

          {/* Mobile Customer Sign In / Account Button */}
          <div className="pt-2">
            <button
              onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full p-3 rounded-xl border border-[#18542a]/30 bg-white hover:bg-amber-50 text-left font-bold flex items-center justify-between text-[#18542a] text-xs transition-colors shadow-2xs"
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-[#18542a]" />
                <span>{user ? `Signed in: ${user.name}` : 'Customer Sign In'}</span>
              </div>
              <span className="text-[10px] text-[#8c7355] font-semibold">
                {user ? 'View Account →' : 'Log In / Register →'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

