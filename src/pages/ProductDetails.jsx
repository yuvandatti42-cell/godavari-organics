import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/Breadcrumb';
import QuantitySelector from '../components/QuantitySelector';
import Accordion from '../components/Accordion';
import ProductCard from '../components/ProductCard';
import { 
  Star, 
  ShoppingBag, 
  Search, 
  ArrowLeft, 
  Heart,
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Leaf
} from 'lucide-react';

export default function ProductDetails() {
  const { 
    selectedProduct, 
    addToCart, 
    setCurrentPage, 
    goBack, 
    products, 
    cartCount, 
    setSearchModalOpen,
    navigateToProduct,
    showToast 
  } = useCart();

  const [selectedSize, setSelectedSize] = useState(
    selectedProduct.packSizes?.[0] || selectedProduct.weight || '1kg'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [wishlist, setWishlist] = useState({});

  // Sync selected size and reset quantity whenever a new product is selected
  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize(selectedProduct.packSizes?.[0] || selectedProduct.weight || '1kg');
      setQuantity(1);
      setActiveThumbnail(0);
    }
  }, [selectedProduct?.id]);

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    setWishlist(prev => {
      const isWished = !prev[productId];
      showToast(isWished ? 'Added to your Wishlist ♥' : 'Removed from Wishlist');
      return { ...prev, [productId]: isWished };
    });
  };

  const productImages = selectedProduct.images && selectedProduct.images.length > 0 
    ? selectedProduct.images 
    : [
        selectedProduct.image,
        '/categories/oil.png',
        '/categories/rice.png',
        '/categories/spices.png'
      ];

  const currentMainImage = productImages[activeThumbnail] || selectedProduct.image;
  
  // 4 related products for desktop 4-column grid matching wireframe
  const relatedProducts = products.filter(p => p.id !== selectedProduct.id).slice(0, 4);

  const packOptions = selectedProduct.packSizes || [selectedProduct.weight || '1kg'];

  // Dynamically calculated prices for the currently selected pack size
  const currentPrice = (selectedProduct.prices && selectedProduct.prices[selectedSize]) 
    ? selectedProduct.prices[selectedSize] 
    : selectedProduct.price;

  const currentOriginalPrice = (selectedProduct.originalPrices && selectedProduct.originalPrices[selectedSize]) 
    ? selectedProduct.originalPrices[selectedSize] 
    : selectedProduct.originalPrice;

  const currentDiscount = (currentOriginalPrice && currentPrice < currentOriginalPrice)
    ? `${Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF`
    : selectedProduct.discount;

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedSize, quantity);
    setCurrentPage('checkout');
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-4 md:py-8 space-y-6 md:space-y-8 font-sans text-[#103b1d]">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Shop', page: 'shop' },
          { label: selectedProduct.category, page: 'shop' },
          { label: selectedProduct.name }
        ]} 
      />

      {/* Main 2-Column Product Grid Card */}
      <div className="bg-white rounded-3xl border border-[#dfd5bf]/90 p-4 sm:p-6 md:p-8 shadow-[0_4px_24px_rgba(16,59,29,0.05)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Gallery Frame */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#faf6ee] to-[#f4ede0]/70 border border-[#e2d5b5]/70 flex items-center justify-center p-6 sm:p-8 shadow-inner group">
              <img 
                src={currentMainImage} 
                alt={selectedProduct.name}
                className="w-full h-full object-contain transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] group-hover:scale-105"
              />
              
              {/* Top-Left: Indian Veg Mark & Discount Tag */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
                <div className="w-4 h-4 rounded-[4px] border border-emerald-700 bg-white/95 flex items-center justify-center shadow-2xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-700"></div>
                </div>
                {currentDiscount && (
                  <span className="bg-[#d52518] text-white text-xs font-black px-2.5 py-1 rounded-md shadow-2xs uppercase tracking-wider">
                    {currentDiscount}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
              {productImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveThumbnail(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer p-1.5 bg-[#faf6ee] ${
                    activeThumbnail === idx 
                      ? 'border-[#103b1d] ring-2 ring-[#18542a]/30 shadow-xs' 
                      : 'border-[#dfd5bf] opacity-80 hover:opacity-100 hover:border-[#103b1d]/40'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Thumbnail Counter Badge */}
            <div className="text-center lg:text-left">
              <span className="inline-block px-3 py-0.5 bg-[#faf5ea] text-[#103b1d] text-[11px] font-bold rounded-full border border-[#dfd5bf]">
                {activeThumbnail + 1} / {productImages.length}
              </span>
            </div>
          </div>

          {/* Right Column: Meta, Pricing & Buy Controls */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Product Title & Subtitle */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-[#18542a]">
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.craftTag && (
                    <span className="bg-[#103b1d] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full border border-[#18542a]/80 shadow-2xs">
                      {selectedProduct.craftTag}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-urbanist text-[#103b1d] leading-tight">
                  {selectedProduct.name}
                </h1>
                {selectedProduct.subtitle && (
                  <p className="text-xs sm:text-sm font-bold text-[#556b54]">
                    {selectedProduct.subtitle}
                  </p>
                )}
              </div>

              {/* Rating & Review Count */}
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <div className="flex text-[#ffc926]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-[#ffc926] text-[#ffc926]' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="font-extrabold text-[#103b1d]">{selectedProduct.rating}</span>
                <span className="text-[#556b54] font-semibold">({selectedProduct.reviewsCount || 128} customer reviews)</span>
              </div>

              {/* Dynamic Price Row */}
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-black text-[#103b1d] font-urbanist">
                  ₹{currentPrice}
                </span>
                {currentOriginalPrice && (
                  <span className="text-lg text-stone-400 line-through font-semibold">
                    ₹{currentOriginalPrice}
                  </span>
                )}
                {currentDiscount && (
                  <span className="px-2.5 py-0.5 bg-[#eaf4ec] text-[#18542a] border border-[#c8e2cd] text-xs font-black rounded-md uppercase tracking-wider">
                    {currentDiscount}
                  </span>
                )}
                <span className="text-xs text-[#556b54] font-bold">
                  / {selectedSize}
                </span>
              </div>

              {/* Product Intro Description */}
              <p className="text-xs sm:text-sm text-[#556b54] leading-relaxed font-medium">
                {selectedProduct.description}
              </p>

              <hr className="border-[#dfd5bf]/70" />

              {/* Select Pack Size */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-xs sm:text-sm text-[#103b1d] block uppercase tracking-wider">
                    Select Pack Size:
                  </label>
                  <span className="text-xs font-bold text-[#18542a] bg-[#faf5ea] px-2.5 py-0.5 rounded-full border border-[#dfd5bf]">
                    Selected: {selectedSize}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {packOptions.map((size) => {
                    const sizePrice = selectedProduct.prices?.[size];
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center space-x-2 ${
                          isSelected
                            ? 'bg-[#103b1d] text-white shadow-md ring-2 ring-[#103b1d] scale-102'
                            : 'bg-[#faf6ee] text-[#103b1d] border border-[#dfd5bf] hover:border-[#103b1d] hover:bg-white'
                        }`}
                      >
                        <span>{size}</span>
                        {sizePrice && (
                          <span className={`text-[11px] font-bold ${isSelected ? 'text-[#ffc926]' : 'text-[#18542a]'}`}>
                            • ₹{sizePrice}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Controls & Action Buttons Row: Quantity Selector & Add to Cart / Buy Now */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity Control [- 1 +] */}
                <div className="shrink-0 flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#103b1d] uppercase tracking-wider hidden xs:inline">Qty:</span>
                  <QuantitySelector quantity={quantity} onChange={setQuantity} className="bg-white border border-[#dfd5bf]" />
                </div>

                {/* Golden Yellow Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-[#ffc926] hover:bg-[#eab308] text-[#103b1d] border border-[#e5b318] text-xs sm:text-sm font-black rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.98] text-center flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>Add to Cart — ₹{currentPrice * quantity}</span>
                </button>

                {/* Forest Green Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-6 bg-[#103b1d] hover:bg-[#18542a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.98] text-center"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100">
                <div className="flex items-center space-x-2 text-[11px] font-bold text-[#556b54]">
                  <Truck className="w-4 h-4 text-[#18542a] shrink-0" />
                  <span>Free Delivery &gt; ₹999</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] font-bold text-[#556b54]">
                  <ShieldCheck className="w-4 h-4 text-[#18542a] shrink-0" />
                  <span>100% Purity Assured</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] font-bold text-[#556b54]">
                  <Leaf className="w-4 h-4 text-[#18542a] shrink-0" />
                  <span>Zero Chemicals Added</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Full-Width Accordions Section Below 2-Column Grid */}
      <div className="bg-white rounded-3xl border border-[#dfd5bf]/90 p-4 sm:p-6 md:p-8 space-y-2 shadow-[0_4px_24px_rgba(16,59,29,0.05)]">
        <Accordion title="Crop & Farming Description" defaultOpen={true}>
          <p className="text-xs sm:text-sm text-[#556b54] leading-relaxed">
            {selectedProduct.description} Harvested naturally without synthetic pesticides or chemical fertilizers across certified organic soil belts.
          </p>
        </Accordion>

        <Accordion title="Farm Origin & Traceability Information">
          <p className="text-xs sm:text-sm text-[#556b54] leading-relaxed">
            Directly traceable to {selectedProduct.origin || 'Godavari River Basin Cooperative, Andhra Pradesh'}. Certified organic with zero artificial polishing, preservatives, or adulteration.
          </p>
        </Accordion>

        <Accordion title="Certifications & Quality Standards">
          <div className="flex flex-wrap gap-2 pt-1">
            {(selectedProduct.certifications || ['100% Certified Organic', 'Jaivik Bharat', 'FSSAI Verified']).map((cert, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#faf6ee] border border-[#dfd5bf] rounded-full text-xs font-bold text-[#103b1d]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18542a]" />
                {cert}
              </span>
            ))}
          </div>
        </Accordion>

        <Accordion title="Nutritional Standard Breakdowns">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs bg-[#faf6ee] p-4 rounded-xl border border-[#dfd5bf] text-[#103b1d] font-bold text-center">
            <div>
              <div className="text-[#18542a] text-[10px] font-black uppercase tracking-wider">Energy</div>
              <div className="text-sm font-black">350 kcal</div>
            </div>
            <div>
              <div className="text-[#18542a] text-[10px] font-black uppercase tracking-wider">Protein</div>
              <div className="text-sm font-black">8.5g</div>
            </div>
            <div>
              <div className="text-[#18542a] text-[10px] font-black uppercase tracking-wider">Carbs</div>
              <div className="text-sm font-black">77g</div>
            </div>
            <div>
              <div className="text-[#18542a] text-[10px] font-black uppercase tracking-wider">Fiber</div>
              <div className="text-sm font-black">2.2g</div>
            </div>
            <div>
              <div className="text-[#18542a] text-[10px] font-black uppercase tracking-wider">Fat</div>
              <div className="text-sm font-black">0.8g</div>
            </div>
            <div>
              <div className="text-[#18542a] text-[10px] font-black uppercase tracking-wider">Iron</div>
              <div className="text-sm font-black">1.4mg</div>
            </div>
          </div>
        </Accordion>

        <Accordion title="Safe Storage Instructions">
          <p className="text-xs sm:text-sm text-[#556b54] leading-relaxed">
            Store in a cool dry place inside an airtight glass container or traditional stainless steel vessel. Keep sealed away from humidity and direct sunlight for long-lasting freshness.
          </p>
        </Accordion>
      </div>

      {/* You May Also Like Section (4-Column Grid on Desktop matching wireframe) */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[#dfd5bf] pb-3">
          <h3 className="font-extrabold text-lg sm:text-xl font-urbanist text-[#103b1d]">
            You May Also Like
          </h3>
          <button 
            type="button"
            onClick={() => setCurrentPage('shop')}
            className="text-xs sm:text-sm font-bold text-[#103b1d] hover:text-[#18542a] underline underline-offset-4 cursor-pointer"
          >
            View All Products
          </button>
        </div>

        {/* 4 Columns Grid matching desktop wireframe layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
          {relatedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

    </div>
  );
}
