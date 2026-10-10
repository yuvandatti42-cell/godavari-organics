import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/Breadcrumb';
import QuantitySelector from '../components/QuantitySelector';
import Accordion from '../components/Accordion';
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

  const [selectedSize, setSelectedSize] = useState(selectedProduct.weight || '500g');
  const [quantity, setQuantity] = useState(1);
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [wishlist, setWishlist] = useState({});

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
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400'
      ];

  const currentMainImage = productImages[activeThumbnail] || selectedProduct.image;
  
  // 4 related products for desktop 4-column grid matching wireframe
  const relatedProducts = products.filter(p => p.id !== selectedProduct.id).slice(0, 4);

  const packOptions = selectedProduct.packSizes || ['500g', '1kg', '2kg', '5kg'];

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
      <div className="bg-[#f3e8cc] rounded-3xl border border-[#d9ca9d] p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Gallery Frame */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden bg-[#e6dec9] border border-[#c8b894] shadow-inner flex items-center justify-center">
              <img 
                src={currentMainImage} 
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {selectedProduct.discount && (
                <span className="absolute top-4 left-4 bg-[#d52518] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                  {selectedProduct.discount}
                </span>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
              {productImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveThumbnail(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeThumbnail === idx 
                      ? 'border-[#103b1d] ring-2 ring-[#18542a]' 
                      : 'border-[#c8b894] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Thumbnail Counter Badge */}
            <div className="text-center lg:text-left">
              <span className="inline-block px-3 py-0.5 bg-[#e6dec9] text-[#103b1d] text-[11px] font-bold rounded-full border border-[#c8b894]">
                {activeThumbnail + 1} / {productImages.length}
              </span>
            </div>
          </div>

          {/* Right Column: Meta, Pricing & Buy Controls */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-urbanist text-[#103b1d] leading-tight">
                {selectedProduct.name} — Premium Aged Grains
              </h1>

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

              {/* Price Row */}
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-black text-[#103b1d]">
                  ₹{selectedProduct.price}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-lg text-gray-500 line-through font-semibold">
                    ₹{selectedProduct.originalPrice}
                  </span>
                )}
                {selectedProduct.discount && (
                  <span className="px-3 py-1 bg-[#e6dec9] text-[#103b1d] border border-[#c8b894] text-xs font-extrabold rounded-md uppercase tracking-wider">
                    {selectedProduct.discount} SPECIAL
                  </span>
                )}
              </div>

              {/* Product Intro Description */}
              <p className="text-xs sm:text-sm text-[#556b54] leading-relaxed font-medium">
                Nurtured alongside the riverbanks of the Godavari Basin, this traditional long-grain unpolished basmati retains crucial crop nutrition, dietary fibers, and an intense rural cooking aroma. Aged naturally to yield fluffier organic servings.
              </p>

              <hr className="border-[#d9ca9d]" />

              {/* Select Pack Size */}
              <div className="space-y-2.5">
                <label className="font-extrabold text-xs sm:text-sm text-[#103b1d] block uppercase tracking-wider">
                  Select Pack Size:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {packOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#103b1d] text-white shadow-sm'
                          : 'bg-white text-[#103b1d] border border-[#c8b894] hover:border-[#103b1d]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls & Action Buttons Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity Control */}
                <div className="shrink-0">
                  <QuantitySelector quantity={quantity} onChange={setQuantity} />
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-[#103b1d] hover:bg-[#18542a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-[0.99] text-center"
                >
                  Add to Cart
                </button>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-6 bg-white hover:bg-[#e6dec9] text-[#103b1d] border-2 border-[#103b1d] text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.99] text-center"
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Full-Width Accordions Section Below 2-Column Grid */}
      <div className="bg-[#f3e8cc] rounded-3xl border border-[#d9ca9d] p-4 sm:p-6 md:p-8 space-y-2 shadow-sm">
        <Accordion title="Crop & Farming Description" defaultOpen={true}>
          <p className="text-xs sm:text-sm text-[#556b54] leading-relaxed">
            Sown during early monsoon sessions on high-mineral delta tracts. Our basmati utilizes pure surface riverwater channels to guarantee a wholesome texture naturally preserved from synthetic additives.
          </p>
        </Accordion>

        <Accordion title="Cooperative Traceability Information">
          <p className="text-xs sm:text-sm text-[#556b54] leading-relaxed">
            Directly traceable to traditional farming cooperatives in Konaseema & Godavari river basin communities. Certified NPOP organic with zero chemical pesticides or artificial polishing agents.
          </p>
        </Accordion>

        <Accordion title="Nutritional Standard Breakdowns">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs bg-[#e6dec9] p-4 rounded-xl border border-[#c8b894] text-[#103b1d] font-bold text-center">
            <div>
              <div className="text-[#556b54] text-[10px] uppercase">Energy</div>
              <div className="text-sm">350 kcal</div>
            </div>
            <div>
              <div className="text-[#556b54] text-[10px] uppercase">Protein</div>
              <div className="text-sm">8.5g</div>
            </div>
            <div>
              <div className="text-[#556b54] text-[10px] uppercase">Carbs</div>
              <div className="text-sm">77g</div>
            </div>
            <div>
              <div className="text-[#556b54] text-[10px] uppercase">Fiber</div>
              <div className="text-sm">2.2g</div>
            </div>
            <div>
              <div className="text-[#556b54] text-[10px] uppercase">Fat</div>
              <div className="text-sm">0.8g</div>
            </div>
            <div>
              <div className="text-[#556b54] text-[10px] uppercase">Iron</div>
              <div className="text-sm">1.4mg</div>
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
        <div className="flex items-center justify-between border-b border-[#d9ca9d] pb-3">
          <h3 className="font-extrabold text-lg sm:text-xl font-urbanist text-[#103b1d]">
            You May Also Like
          </h3>
          <button 
            type="button"
            onClick={() => setCurrentPage('shop')}
            className="text-xs sm:text-sm font-bold text-[#103b1d] hover:text-[#18542a] underline underline-offset-4 cursor-pointer"
          >
            View All Grains
          </button>
        </div>

        {/* 4 Columns Grid matching desktop wireframe layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
          {relatedProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-[#f3e8cc] rounded-2xl border border-[#d9ca9d] p-3.5 flex flex-col justify-between space-y-3 shadow-xs hover:border-[#103b1d] transition-all relative group"
            >
              {/* Product Photo Container */}
              <div 
                onClick={() => navigateToProduct(prod.id)}
                className="relative aspect-square rounded-xl overflow-hidden bg-[#e6dec9] border border-[#c8b894] cursor-pointer"
              >
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={(e) => toggleWishlist(prod.id, e)}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors cursor-pointer"
                  title="Add to Wishlist"
                >
                  <Heart 
                    className={`w-4 h-4 ${wishlist[prod.id] ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} 
                  />
                </button>
              </div>

              {/* Product Meta */}
              <div className="space-y-1 text-left flex-1">
                <h4 
                  onClick={() => navigateToProduct(prod.id)}
                  className="font-bold text-xs sm:text-sm text-[#103b1d] truncate cursor-pointer hover:underline"
                >
                  {prod.shortName || prod.name}
                </h4>
                
                <p className="text-[11px] text-[#556b54] truncate">
                  {prod.category}
                </p>

                <div className="flex items-center space-x-1 text-[11px] pt-0.5">
                  <div className="flex text-[#ffc926]">
                    <Star className="w-3 h-3 fill-[#ffc926] text-[#ffc926]" />
                  </div>
                  <span className="font-bold text-[#103b1d]">{prod.rating}</span>
                </div>

                <div className="flex items-baseline space-x-2 pt-1">
                  <span className="font-extrabold text-sm text-[#103b1d]">
                    ₹{prod.price}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{prod.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Full-width Add to Cart button */}
              <button
                type="button"
                onClick={() => addToCart(prod, prod.weight, 1)}
                className="w-full py-2.5 bg-[#103b1d] hover:bg-[#18542a] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer text-center active:scale-[0.99]"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
