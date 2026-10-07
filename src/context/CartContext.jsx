import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Organic Basmati Rice',
    shortName: 'Organic Basmati Rice',
    category: 'Organic Rice',
    price: 299,
    originalPrice: 399,
    discount: '25% OFF',
    rating: 4.8,
    reviewsCount: 142,
    weight: '1kg',
    packSizes: ['500g', '1kg', '5kg', '10kg'],
    description: 'Traditional scented long grain basmati rice naturally aged and pesticide-free.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    origin: 'East Godavari Delta, AP',
    certifications: ['Jaivik Bharat', 'NPOP Organic', 'FSSAI']
  },
  {
    id: 'p2',
    name: 'Turmeric Powder',
    shortName: 'Turmeric Powder',
    category: 'Organic Spices',
    price: 149,
    originalPrice: 199,
    discount: '25% OFF',
    rating: 4.9,
    reviewsCount: 235,
    weight: '250g',
    packSizes: ['100g', '250g', '500g', '1kg'],
    description: 'High curcumin wild harvest organic turmeric powder stone-milled.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    origin: 'Agency Tribal Belt, Rampachodavaram',
    certifications: ['High Curcumin', 'Stone Ground']
  },
  {
    id: 'p3',
    name: 'Cold Pressed Oil',
    shortName: 'Cold Pressed Oil',
    category: 'Natural Products',
    price: 499,
    originalPrice: 599,
    discount: '17% OFF',
    rating: 4.7,
    reviewsCount: 98,
    weight: '1 Litre',
    packSizes: ['500ml', '1L', '2L', '5L'],
    description: 'Pure wood-pressed groundnut oil extracted at low temperature.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    origin: 'Godavari Agri Collective, AP',
    certifications: ['100% Wood Pressed', 'Unrefined']
  },
  {
    id: 'p4',
    name: 'Organic Jaggery',
    shortName: 'Organic Jaggery',
    category: 'Traditional Foods',
    price: 120,
    originalPrice: 160,
    discount: '25% OFF',
    rating: 4.6,
    reviewsCount: 110,
    weight: '1kg',
    packSizes: ['500g', '1kg', '2kg'],
    description: 'Natural chemical-free sweetener prepared traditionally over woodfires.',
    inStock: true,
    isPopular: true,
    isBestseller: false,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    origin: 'Sankhavaram Organic Farms, AP',
    certifications: ['Chemical Free', 'Rich Iron']
  },
  {
    id: 'p5',
    name: 'Red Rice',
    shortName: 'Red Rice',
    category: 'Organic Rice',
    price: 210,
    originalPrice: 280,
    discount: '25% OFF',
    rating: 4.5,
    reviewsCount: 76,
    weight: '1kg',
    packSizes: ['1kg', '5kg'],
    description: 'Unpolished premium nutrient-dense traditional indigenous red rice.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=800',
    origin: 'Godavari Seed Savers Network',
    certifications: ['Heirloom Seed', 'Rich Anthocyanin']
  },
  {
    id: 'p6',
    name: 'Millet Flour',
    shortName: 'Millet Flour',
    category: 'Traditional Foods',
    price: 180,
    originalPrice: 240,
    discount: '25% OFF',
    rating: 4.4,
    reviewsCount: 64,
    weight: '1kg',
    packSizes: ['500g', '1kg', '5kg'],
    description: 'Freshly ground organic mix of nutrient-rich low-GI native millets.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
    origin: 'Rayalaseema-Godavari Organic Belt',
    certifications: ['Gluten Free', 'Low GI']
  },
  {
    id: 'p7',
    name: 'Organic Toor Dal',
    shortName: 'Organic Toor Dal',
    category: 'Organic Rice',
    price: 195,
    originalPrice: 250,
    discount: '22% OFF',
    rating: 4.8,
    reviewsCount: 89,
    weight: '1kg',
    packSizes: ['500g', '1kg', '2kg'],
    description: 'Unpolished hand-split pigeon peas grown without synthetic pesticides.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    image: 'https://images.unsplash.com/photo-1515543237350-b3eae1bc91b5?auto=format&fit=crop&q=80&w=800',
    origin: 'West Godavari Farmers Group',
    certifications: ['Unpolished', 'High Protein']
  },
  {
    id: 'p8',
    name: 'Desi Gir Cow Ghee',
    shortName: 'Desi Gir Cow Ghee',
    category: 'Natural Products',
    price: 850,
    originalPrice: 990,
    discount: '14% OFF',
    rating: 5.0,
    reviewsCount: 184,
    weight: '500ml',
    packSizes: ['250ml', '500ml', '1L'],
    description: 'Traditional Vedic Bilona method A2 Gir cow ghee with golden aroma.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1589927986076-2d54245388c3?auto=format&fit=crop&q=80&w=800',
    origin: 'Godavari Sanctuary',
    certifications: ['A2 Certified', 'Bilona Processed']
  }
];

export const CATEGORIES = [
  { 
    id: 'c1', 
    name: 'Fresh Vegetables', 
    subtext: 'Farm fresh organic vegetables', 
    count: 12,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/vegetables.jpg'
  },
  { 
    id: 'c2', 
    name: 'Fresh Fruits', 
    subtext: 'Seasonal fresh fruits', 
    count: 10,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/fruits.jpg'
  },
  { 
    id: 'c3', 
    name: 'Dairy, Bread and Eggs', 
    subtext: 'Dairy, fresh bread & eggs', 
    count: 8,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/dairy_bread.jpg'
  },
  { 
    id: 'c4', 
    name: 'Meat and Seafood', 
    subtext: 'Clean fresh meat & seafood', 
    count: 9,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/meat_seafood.jpg'
  },
];

export function CartProvider({ children }) {
  const [currentPage, setCurrentPageState] = useState(() => {
    const hash = window.location.hash.replace('#/', '');
    return hash || 'home';
  });
  const [selectedProductId, setSelectedProductId] = useState('p1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core navigation function synchronized with browser history
  const changePage = useCallback((page, options = {}) => {
    const targetProductId = options.productId || selectedProductId;

    if (options.productId) {
      setSelectedProductId(options.productId);
    }

    if (!options.fromPopState) {
      const stateObj = { page, productId: targetProductId };
      const hashUrl = `#/${page}${page === 'product' ? `?id=${targetProductId}` : ''}`;
      if (options.replace) {
        window.history.replaceState(stateObj, '', hashUrl);
      } else {
        window.history.pushState(stateObj, '', hashUrl);
      }
    }

    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProductId]);

  const setCurrentPage = useCallback((page, options = {}) => {
    changePage(page, options);
  }, [changePage]);

  // Unified goBack handler for in-app back buttons and browser back button
  const goBack = useCallback(() => {
    if (window.history.state && window.history.length > 1) {
      window.history.back();
    } else {
      setCurrentPage('home');
    }
  }, [setCurrentPage]);

  // Listen for browser popstate (browser back/forward button clicks)
  useEffect(() => {
    if (!window.history.state) {
      const initialPage = window.location.hash.replace('#/', '') || 'home';
      window.history.replaceState({ page: initialPage, productId: selectedProductId }, '', `#/${initialPage}`);
    }

    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPageState(event.state.page);
        if (event.state.productId) {
          setSelectedProductId(event.state.productId);
        }
      } else {
        const hash = window.location.hash.replace('#/', '');
        setCurrentPageState(hash || 'home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProductId]);
  
  // Cart items state with initial sample items matching wireframe screenshot
  const [cartItems, setCartItems] = useState([
    {
      id: 'p1',
      name: 'Organic Basmati Rice',
      price: 299,
      weight: '500g',
      selectedSize: '500g',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300'
    },
    {
      id: 'p2',
      name: 'Turmeric Powder',
      price: 149,
      weight: '200g',
      selectedSize: '200g',
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300'
    },
    {
      id: 'p3',
      name: 'Cold Pressed Oil',
      price: 499,
      weight: '1L',
      selectedSize: '1L',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300'
    }
  ]);

  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  const addToCart = (product, size = null, qty = 1) => {
    const packSize = size || product.weight || '1kg';
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.selectedSize === packSize);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            weight: product.weight,
            selectedSize: packSize,
            quantity: qty,
            image: product.image
          }
        ];
      }
    });
    showToast(`Added "${product.shortName || product.name}" (${packSize}) to Cart!`);
  };

  const updateQuantity = (id, selectedSize, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id && item.selectedSize === selectedSize) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id, selectedSize) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === selectedSize)));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = cartSubtotal > 1500 || cartSubtotal === 0 ? 0 : 50;
  const taxFee = 0; // Simplified to match wireframe directly (Subtotal + Delivery Charge)
  const cartTotal = cartSubtotal + shippingFee;

  const navigateToProduct = (productId) => {
    setSelectedProductId(productId);
    changePage('product', { productId });
  };

  const selectedProduct = INITIAL_PRODUCTS.find(p => p.id === selectedProductId) || INITIAL_PRODUCTS[0];

  return (
    <CartContext.Provider value={{
      currentPage,
      setCurrentPage,
      goBack,
      selectedProductId,
      setSelectedProductId,
      selectedProduct,
      navigateToProduct,
      mobileMenuOpen,
      setMobileMenuOpen,
      quickViewProduct,
      setQuickViewProduct,
      authModalOpen,
      setAuthModalOpen,
      searchModalOpen,
      setSearchModalOpen,
      searchQuery,
      setSearchQuery,
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartSubtotal,
      shippingFee,
      taxFee,
      cartTotal,
      notification,
      showToast,
      products: INITIAL_PRODUCTS,
      categories: CATEGORIES,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

