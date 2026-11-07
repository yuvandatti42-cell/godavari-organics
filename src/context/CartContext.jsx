import {
  subscribeToStorefrontProducts,
  subscribeToStorefrontCategories,
  subscribeToStorefrontContent,
  subscribeToStorefrontPromotions,
  placeStorefrontOrder,
  syncStorefrontCustomer
} from "../services/firebaseService.js";
import { auth } from "../firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

export const INITIAL_PROMOTIONS = [
  {
    id: 'promo-1',
    code: 'GODAVARI10',
    description: '10% discount on all organic harvest items',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 300,
    status: 'Active',
  },
  {
    id: 'promo-2',
    code: 'FARMREADY200',
    description: 'Flat ₹200 off on orders above ₹1,999',
    discountType: 'fixed',
    discountValue: 200,
    minOrderValue: 1999,
    status: 'Active',
  },
  {
    id: 'promo-3',
    code: 'BILONAGHEE',
    description: 'Special ₹150 concession on Vedic A2 Gir Cow Ghee',
    discountType: 'fixed',
    discountValue: 150,
    minOrderValue: 1450,
    status: 'Active',
  },
];

export const INITIAL_PRODUCTS = [
  // -------------------------------------------------------------
  // 1. OILS SECTION (1L or 500ml [1/2 L], Almond Oil is 250ml or 500ml)
  // -------------------------------------------------------------
  {
    id: 'p_oil_groundnut',
    name: 'Cold Pressed Groundnut Oil',
    shortName: 'Groundnut Oil',
    subtitle: '100% Pure Cold Pressed',
    category: 'Oils',
    packSizes: ['500ml (1/2 L)', '1 Litre'],
    weight: '1 Litre',
    price: 399,
    originalPrice: 499,
    prices: {
      '500ml (1/2 L)': 220,
      '1 Litre': 399
    },
    originalPrices: {
      '500ml (1/2 L)': 280,
      '1 Litre': 499
    },
    discount: '20% OFF',
    rating: 4.9,
    reviewsCount: 184,
    description: 'Traditional cold pressed groundnut oil extracted at low temperature from first-grade local farm seeds. Unrefined, unbleached, and rich in natural nutrients.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    craftTag: '100% Cold Pressed',
    image: '/products/oils/groundnut_oil.webp',
    images: ['/products/oils/groundnut_oil.webp', '/products/oils/oil_difference_guide.webp', '/banners/banner_oil.webp'],
    origin: 'Godavari Agri Collective, East Godavari, AP',
    certifications: ['100% Cold Pressed', 'Unrefined', 'Zero Preservatives']
  },
  {
    id: 'p_oil_sesame',
    name: 'Cold Pressed Sesame Oil',
    shortName: 'Sesame Oil',
    subtitle: 'Pure Cold Pressed Gingelly / Til',
    category: 'Oils',
    packSizes: ['500ml (1/2 L)', '1 Litre'],
    weight: '1 Litre',
    price: 450,
    originalPrice: 550,
    prices: {
      '500ml (1/2 L)': 240,
      '1 Litre': 450
    },
    originalPrices: {
      '500ml (1/2 L)': 300,
      '1 Litre': 550
    },
    discount: '18% OFF',
    rating: 4.8,
    reviewsCount: 126,
    description: 'Slow-extracted pure cold pressed sesame oil made with organic white sesame seeds and palm jaggery in the authentic traditional method. Rich in sesamol and zinc.',
    inStock: true,
    isPopular: true,
    isBestseller: false,
    craftTag: '100% Cold Pressed',
    image: '/products/oils/sesame_oil.webp',
    images: ['/products/oils/sesame_oil.webp', '/products/oils/oil_difference_guide.webp', '/banners/banner_oil.webp'],
    origin: 'Delta Organic Farms, Andhra Pradesh',
    certifications: ['Cold Pressed', 'Rich Antioxidants', 'Traditional Method']
  },
  {
    id: 'p_oil_coconut',
    name: 'Cold Pressed Virgin Coconut Oil',
    shortName: 'Coconut Oil',
    subtitle: 'From Sun-Dried Konaseema Coconuts',
    category: 'Oils',
    packSizes: ['500ml (1/2 L)', '1 Litre'],
    weight: '1 Litre',
    price: 420,
    originalPrice: 520,
    prices: {
      '500ml (1/2 L)': 230,
      '1 Litre': 420
    },
    originalPrices: {
      '500ml (1/2 L)': 290,
      '1 Litre': 520
    },
    discount: '19% OFF',
    rating: 4.9,
    reviewsCount: 215,
    description: 'Freshly prepared from mature, naturally sun-dried Konaseema organic coconuts. Sulfur-free, cold-pressed with pleasant raw coconut aroma suitable for cooking and hair care.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    craftTag: '100% Cold Pressed',
    image: '/products/oils/coconut_oil.webp',
    images: ['/products/oils/coconut_oil.webp', '/products/oils/oil_difference_guide.webp', '/banners/banner_oil.webp'],
    origin: 'Konaseema Coconut Belt, Andhra Pradesh',
    certifications: ['100% Virgin', 'Sulfur Free', 'Zero Heat Added']
  },
  {
    id: 'p_oil_black_sesame',
    name: 'Cold Pressed Black Sesame Oil',
    shortName: 'Black Sesame Oil',
    subtitle: 'Indigenous High-Calcium Ayurvedic Oil',
    category: 'Oils',
    packSizes: ['500ml (1/2 L)', '1 Litre'],
    weight: '1 Litre',
    price: 490,
    originalPrice: 600,
    prices: {
      '500ml (1/2 L)': 270,
      '1 Litre': 490
    },
    originalPrices: {
      '500ml (1/2 L)': 340,
      '1 Litre': 600
    },
    discount: '18% OFF',
    rating: 4.8,
    reviewsCount: 92,
    description: 'Cold pressed from native black sesame seeds harvested in agency regions. Revered in Ayurveda for deep nourishment, bone health, and traditional therapeutic cooking.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    craftTag: '100% Cold Pressed',
    image: '/products/oils/black_sesame_oil.webp',
    images: ['/products/oils/black_sesame_oil.webp', '/products/oils/oil_difference_guide.webp', '/banners/banner_oil.webp'],
    origin: 'Agency Tribal Belt, Rampachodavaram',
    certifications: ['Ayurvedic Grade', 'High Calcium', 'Cold Pressed']
  },
  {
    id: 'p_oil_sunflower',
    name: 'Cold Pressed Sunflower Oil',
    shortName: 'Sunflower Oil',
    subtitle: 'Light & Unrefined Heart Health Oil',
    category: 'Oils',
    packSizes: ['500ml (1/2 L)', '1 Litre'],
    weight: '1 Litre',
    price: 350,
    originalPrice: 430,
    prices: {
      '500ml (1/2 L)': 190,
      '1 Litre': 350
    },
    originalPrices: {
      '500ml (1/2 L)': 240,
      '1 Litre': 430
    },
    discount: '19% OFF',
    rating: 4.7,
    reviewsCount: 108,
    description: 'Pure cold-pressed oil made from non-GMO organic sunflower seeds. Naturally golden, light on the stomach, free from hexane, chemical deodorizers, and solvent extraction.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    craftTag: '100% Cold Pressed',
    image: '/products/oils/sunflower_oil.webp',
    images: ['/products/oils/sunflower_oil.webp', '/products/oils/oil_difference_guide.webp', '/banners/banner_oil.webp'],
    origin: 'Godavari Valley Agro, AP',
    certifications: ['Non-GMO', 'Hexane Free', 'Rich Vitamin E']
  },
  {
    id: 'p_oil_safflower',
    name: 'Cold Pressed Safflower Oil',
    shortName: 'Safflower Oil',
    subtitle: 'Kusuma Oil / Kardi Oil',
    category: 'Oils',
    packSizes: ['500ml (1/2 L)', '1 Litre'],
    weight: '1 Litre',
    price: 420,
    originalPrice: 510,
    prices: {
      '500ml (1/2 L)': 230,
      '1 Litre': 420
    },
    originalPrices: {
      '500ml (1/2 L)': 290,
      '1 Litre': 510
    },
    discount: '18% OFF',
    rating: 4.8,
    reviewsCount: 86,
    description: 'Traditional Kusuma oil cold pressed from selected safflower seeds. Known for high smoke point, healthy unsaturated fats, and excellent support for cholesterol balance.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    craftTag: '100% Cold Pressed',
    image: '/products/oils/safflower_oil.webp',
    images: ['/products/oils/safflower_oil.webp', '/products/oils/oil_difference_guide.webp', '/banners/banner_oil.webp'],
    origin: 'Deccan-Godavari Organic Sector',
    certifications: ['Zero Cholesterol', 'High Smoke Point', 'Unrefined']
  },
  {
    id: 'p_oil_mustard',
    name: 'Cold Pressed Mustard Oil',
    shortName: 'Mustard Oil',
    subtitle: 'Pungent & Cold Pressed Sarson Oil',
    category: 'Oils',
    packSizes: ['500ml (1/2 L)', '1 Litre'],
    weight: '1 Litre',
    price: 330,
    originalPrice: 410,
    prices: {
      '500ml (1/2 L)': 180,
      '1 Litre': 330
    },
    originalPrices: {
      '500ml (1/2 L)': 230,
      '1 Litre': 410
    },
    discount: '20% OFF',
    rating: 4.7,
    reviewsCount: 145,
    description: 'Strong natural aroma and signature sharp pungency. Cold pressed from dark organic mustard seeds. Perfect for traditional cooking and pickles.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    craftTag: '100% Cold Pressed',
    image: '/products/oils/mustard_oil.webp',
    images: ['/products/oils/mustard_oil.webp', '/products/oils/oil_difference_guide.webp', '/banners/banner_oil.webp'],
    origin: 'Godavari Natural Farmers Group',
    certifications: ['Cold Pressed', 'Raw Pungency', 'Zero Additives']
  },
  {
    id: 'p_oil_almond',
    name: 'Cold Pressed Almond Oil',
    shortName: 'Almond Oil',
    subtitle: 'Sweet Badam Rogan (250ml & 1/2L)',
    category: 'Oils',
    packSizes: ['250ml', '500ml (1/2 L)'],
    weight: '250ml',
    price: 450,
    originalPrice: 550,
    prices: {
      '250ml': 450,
      '500ml (1/2 L)': 850
    },
    originalPrices: {
      '250ml': 550,
      '500ml (1/2 L)': 1050
    },
    discount: '18% OFF',
    rating: 5.0,
    reviewsCount: 168,
    description: '100% pure sweet almond oil extracted through cold pressing from premium organic almonds. Edible grade, ultra-nourishing for brain health, babies, and skin glow.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    craftTag: '100% Cold Pressed',
    image: '/products/oils/almond_oil.webp',
    images: ['/products/oils/almond_oil.webp', '/products/oils/oil_difference_guide.webp', '/banners/banner_oil.webp'],
    origin: 'Certified Organic Direct, Godavari Network',
    certifications: ['100% Pure Badam', 'Edible Grade', 'Cold Pressed']
  },
  {
    id: 'p_oil_niger',
    name: 'Cold Pressed Niger Oil',
    shortName: 'Niger Oil',
    subtitle: 'Valisalu / Gurellu Seed Oil',
    category: 'Oils',
    packSizes: ['500ml (1/2 L)', '1 Litre'],
    weight: '1 Litre',
    price: 380,
    originalPrice: 470,
    prices: {
      '500ml (1/2 L)': 210,
      '1 Litre': 380
    },
    originalPrices: {
      '500ml (1/2 L)': 270,
      '1 Litre': 470
    },
    discount: '19% OFF',
    rating: 4.8,
    reviewsCount: 64,
    description: 'Traditional indigenous Niger seed oil (Valisala Nune) cold pressed from pure seeds. Packed with essential fatty acids, unique nutty flavor, and rural culinary heritage.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    craftTag: '100% Cold Pressed',
    image: '/products/oils/niger_oil.webp',
    images: ['/products/oils/niger_oil.webp', '/products/oils/oil_difference_guide.webp', '/banners/banner_oil.webp'],
    origin: 'Eastern Ghats Tribal Collectives',
    certifications: ['Wild Harvest Seed', 'Cold Pressed', 'Heritage Recipe']
  },

  // -------------------------------------------------------------
  // 2. RICE SECTION (Red Rice, Black Rice, Sona Rice)
  // -------------------------------------------------------------
  {
    id: 'p_rice_red',
    name: 'Organic Red Rice',
    shortName: 'Red Rice',
    subtitle: 'Unpolished Heirloom Rice',
    category: 'Organic Rice',
    packSizes: ['1kg', '5kg'],
    weight: '1kg',
    price: 140,
    originalPrice: 180,
    prices: {
      '1kg': 140,
      '5kg': 650
    },
    originalPrices: {
      '1kg': 180,
      '5kg': 850
    },
    discount: '22% OFF',
    rating: 4.8,
    reviewsCount: 134,
    description: 'Naturally grown traditional red rice with intact bran layer, high in natural anthocyanin antioxidants, magnesium, and dietary fiber. Low glycemic index grain.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    craftTag: 'Low GI • Heirloom',
    image: '/products/rice/red_rice.webp',
    images: ['/products/rice/red_rice.webp', '/products/rice/red_rice_benefits.webp', '/banners/banner_rice.webp'],
    origin: 'Godavari River Basin Cultivators, AP',
    certifications: ['Unpolished', 'Low GI', 'Heirloom Seed']
  },
  {
    id: 'p_rice_black',
    name: 'Organic Black Rice',
    shortName: 'Black Rice',
    subtitle: 'Superfood Forbidden Rice / Chak-Hao',
    category: 'Organic Rice',
    packSizes: ['1kg', '5kg'],
    weight: '1kg',
    price: 240,
    originalPrice: 300,
    prices: {
      '1kg': 240,
      '5kg': 1100
    },
    originalPrices: {
      '1kg': 300,
      '5kg': 1400
    },
    discount: '20% OFF',
    rating: 4.9,
    reviewsCount: 98,
    description: 'Ancient superfood grain rich in deep purple anthocyanins, vitamins, and minerals. Nutty flavor, delicious in healthy bowls, khichdi, and sweet puddings.',
    inStock: true,
    isPopular: true,
    isBestseller: false,
    craftTag: 'Anthocyanin Superfood',
    image: '/products/rice/black_rice.webp',
    images: ['/products/rice/black_rice.webp', '/products/rice/black_rice_benefits.webp', '/banners/banner_rice.webp'],
    origin: 'Organic Heritage Farmers, AP',
    certifications: ['Superfood', 'Zero Chemicals', 'Rich Anthocyanin']
  },
  {
    id: 'p_rice_sona',
    name: 'Aged Sona Masoori Rice',
    shortName: 'Sona Rice',
    subtitle: 'Naturally Aged Lightweight Rice',
    category: 'Organic Rice',
    packSizes: ['1kg', '5kg'],
    weight: '1kg',
    price: 95,
    originalPrice: 120,
    prices: {
      '1kg': 95,
      '5kg': 450
    },
    originalPrices: {
      '1kg': 120,
      '5kg': 560
    },
    discount: '21% OFF',
    rating: 4.7,
    reviewsCount: 240,
    description: 'Premium naturally aged organic Sona Masoori rice cultivated along Godavari canals without synthetic fertilizers. Non-sticky, aromatic, easy on digestion.',
    inStock: true,
    isPopular: false,
    isBestseller: true,
    craftTag: 'Naturally Aged 12m',
    image: '/products/rice/sona_masoori_rice.webp',
    images: ['/products/rice/sona_masoori_rice.webp', '/products/rice/sona_masoori_rice_benefits.webp', '/banners/banner_rice.webp'],
    origin: 'Krishna-Godavari Delta Basin',
    certifications: ['12 Months Aged', 'Pesticide Free', 'Jaivik Bharat']
  },

  // -------------------------------------------------------------
  // 3. MILLETS SECTION (Foxtail, Kodo, Little, Barnyard, Browntop)
  // -------------------------------------------------------------
  {
    id: 'p_millet_foxtail',
    name: 'Organic Foxtail Millet',
    shortName: 'Foxtail Millet',
    subtitle: 'Korralu / Siridhanya',
    category: 'Organic Millets',
    packSizes: ['500g', '1kg'],
    weight: '500g',
    price: 75,
    originalPrice: 95,
    prices: {
      '500g': 75,
      '1kg': 140
    },
    originalPrices: {
      '500g': 95,
      '1kg': 180
    },
    discount: '21% OFF',
    rating: 4.8,
    reviewsCount: 112,
    description: 'Unpolished native Foxtail millet (Korralu) rich in complex carbs, dietary fiber, and nervous system vitamins. Excellent grain replacement for diabetes management.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    craftTag: 'Siridhanya Korralu',
    image: '/products/millets/foxtail_millet.webp',
    images: ['/products/millets/foxtail_millet.webp', '/products/millets/foxtail_millet_benefits.webp', '/banners/banner_spices_millets.webp'],
    origin: 'Rayalaseema-Godavari Millet Collective',
    certifications: ['Unpolished', 'Gluten Free', 'Diabetic Friendly']
  },
  {
    id: 'p_millet_kodo',
    name: 'Organic Kodo Millet',
    shortName: 'Kodo Millet',
    subtitle: 'Arikelu / Detox Siridhanya',
    category: 'Organic Millets',
    packSizes: ['500g', '1kg'],
    weight: '500g',
    price: 80,
    originalPrice: 100,
    prices: {
      '500g': 80,
      '1kg': 150
    },
    originalPrices: {
      '500g': 100,
      '1kg': 190
    },
    discount: '20% OFF',
    rating: 4.7,
    reviewsCount: 85,
    description: 'Traditional unpolished Kodo millet (Arikelu) prized for blood purification, bone strengthening, and gut microbiome cleansing properties.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    craftTag: 'Detox Arikelu',
    image: '/products/millets/kodo_millet.webp',
    images: ['/products/millets/kodo_millet.webp', '/products/millets/kodo_millet_benefits.webp', '/banners/banner_spices_millets.webp'],
    origin: 'Godavari Natural Farming Society',
    certifications: ['Siridhanya Certified', 'Unpolished', 'Rich Fiber']
  },
  {
    id: 'p_millet_little',
    name: 'Organic Little Millet',
    shortName: 'Little Millet',
    subtitle: 'Samalu / Quick Cook Millet',
    category: 'Organic Millets',
    packSizes: ['500g', '1kg'],
    weight: '500g',
    price: 75,
    originalPrice: 95,
    prices: {
      '500g': 75,
      '1kg': 140
    },
    originalPrices: {
      '500g': 95,
      '1kg': 180
    },
    discount: '21% OFF',
    rating: 4.8,
    reviewsCount: 79,
    description: 'Fine-grained unpolished Little millet (Samalu). Light to digest, cooks in 10 minutes, packed with magnesium, phosphorus, and iron. Ideal for upma and idli batter.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    craftTag: 'Quick-Cook Samalu',
    image: '/products/millets/little_millet.webp',
    images: ['/products/millets/little_millet.webp', '/products/millets/little_millet_benefits.webp', '/banners/banner_spices_millets.webp'],
    origin: 'Organic Millet Producers, AP',
    certifications: ['Easy Digestion', 'Gluten Free', 'Natural Harvest']
  },
  {
    id: 'p_millet_barnyard',
    name: 'Organic Barnyard Millet',
    shortName: 'Barnyard Millet',
    subtitle: 'Oodalu / High Iron Grain',
    category: 'Organic Millets',
    packSizes: ['500g', '1kg'],
    weight: '500g',
    price: 85,
    originalPrice: 110,
    prices: {
      '500g': 85,
      '1kg': 160
    },
    originalPrices: {
      '500g': 110,
      '1kg': 200
    },
    discount: '23% OFF',
    rating: 4.8,
    reviewsCount: 91,
    description: 'Unpolished Barnyard millet (Oodalu) with highest bioavailable iron content among small grains. Low glycemic index, aids energy metabolism and immunity.',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    craftTag: 'High Iron Oodalu',
    image: '/products/millets/barnyard_millet.webp',
    images: ['/products/millets/barnyard_millet.webp', '/products/millets/barnyard_millet_benefits.webp', '/banners/banner_spices_millets.webp'],
    origin: 'Agency Belt Millet Farms, AP',
    certifications: ['Highest Iron', 'Low Calorie', 'Pesticide Free']
  },
  {
    id: 'p_millet_browntop',
    name: 'Organic Browntop Millet',
    shortName: 'Browntop Millet',
    subtitle: 'Andukorralu / 12.5% Fiber Supergrain',
    category: 'Organic Millets',
    packSizes: ['500g', '1kg'],
    weight: '500g',
    price: 110,
    originalPrice: 140,
    prices: {
      '500g': 110,
      '1kg': 210
    },
    originalPrices: {
      '500g': 140,
      '1kg': 260
    },
    discount: '21% OFF',
    rating: 4.9,
    reviewsCount: 105,
    description: 'The rarest and most prized of the Siridhanya millets (Andukorralu). Boasts 12.5% dietary fiber, aids metabolic wellness, weight management, and total gut health.',
    inStock: true,
    isPopular: true,
    isBestseller: false,
    craftTag: '12.5% Fiber Supergrain',
    image: '/products/millets/browntop_millet.webp',
    images: ['/products/millets/browntop_millet.webp', '/products/millets/browntop_millet_benefits.webp', '/banners/banner_spices_millets.webp'],
    origin: 'Eastern Ghats Indigenous Seed Reserve',
    certifications: ['12.5% Fiber', 'Rare Siridhanya', 'Unpolished']
  },

  // -------------------------------------------------------------
  // 4. SPICES SECTION (Turmeric Powder, Chilli Powder)
  // -------------------------------------------------------------
  {
    id: 'p_spice_turmeric',
    name: 'High-Curcumin Turmeric Powder',
    shortName: 'Turmeric Powder',
    subtitle: 'Stone Ground / 5%+ Curcumin',
    category: 'Organic Spices',
    packSizes: ['250g', '500g', '1kg'],
    weight: '250g',
    price: 120,
    originalPrice: 160,
    prices: {
      '250g': 120,
      '500g': 220,
      '1kg': 410
    },
    originalPrices: {
      '250g': 160,
      '500g': 290,
      '1kg': 540
    },
    discount: '25% OFF',
    rating: 4.9,
    reviewsCount: 280,
    description: 'Wild harvest tribal turmeric stone-ground slowly to preserve volatile aromatic oils and natural 5%+ curcumin. Chemical-free, zero lead chromate, zero artificial yellow dyes.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    craftTag: '5%+ Curcumin Stone Ground',
    image: '/products/spices/turmeric_powder.webp',
    images: ['/products/spices/turmeric_powder.webp', '/banners/banner_spices.webp'],
    origin: 'Rampachodavaram Agency Forest, AP',
    certifications: ['5%+ Curcumin', 'Stone Ground', 'Zero Additives']
  },
  {
    id: 'p_spice_chilli',
    name: 'Guntur Pure Red Chilli Powder',
    shortName: 'Chilli Powder',
    subtitle: 'Sun-Dried Pounded Mirchi',
    category: 'Organic Spices',
    packSizes: ['250g', '500g', '1kg'],
    weight: '250g',
    price: 130,
    originalPrice: 170,
    prices: {
      '250g': 130,
      '500g': 240,
      '1kg': 450
    },
    originalPrices: {
      '250g': 170,
      '500g': 310,
      '1kg': 580
    },
    discount: '23% OFF',
    rating: 4.8,
    reviewsCount: 194,
    description: 'Sun-dried traditional Guntur whole chillies pounded with seeds to deliver authentic pungency and natural ruby red color. Zero artificial color, preservatives, or sawdust.',
    inStock: true,
    isPopular: true,
    isBestseller: false,
    craftTag: 'Guntur Sun-Pounded',
    image: '/products/spices/chilli_powder.webp',
    images: ['/products/spices/chilli_powder.webp', '/banners/banner_spices.webp'],
    origin: 'Godavari-Guntur Organic Farmers',
    certifications: ['Sun-Dried', 'Zero Artificial Color', 'Traditional Pounded']
  },

  // -------------------------------------------------------------
  // 5. GHEE SECTION (Only Cow Ghee)
  // -------------------------------------------------------------
  {
    id: 'p_ghee_cow',
    name: 'Desi Gir Cow A2 Ghee',
    shortName: 'Desi Cow Ghee',
    subtitle: 'Vedic Bilona Method Ghee',
    category: 'Oils',
    packSizes: ['250ml', '500ml (1/2 L)', '1 Litre'],
    weight: '500ml (1/2 L)',
    price: 850,
    originalPrice: 990,
    prices: {
      '250ml': 450,
      '500ml (1/2 L)': 850,
      '1 Litre': 1650
    },
    originalPrices: {
      '250ml': 550,
      '500ml (1/2 L)': 990,
      '1 Litre': 1950
    },
    discount: '14% OFF',
    rating: 5.0,
    reviewsCount: 342,
    description: 'Prepared using the sacred ancient Vedic Bilona method: fresh grass-fed Desi Gir cow whole milk cultured into curd, churned with wooden churner, and slow-simmered over cow dung embers. Golden, grainy Danedar texture and heavenly aroma.',
    inStock: true,
    isPopular: true,
    isBestseller: true,
    craftTag: 'Vedic Bilona Danedar',
    image: '/categories/desi_cow_ghee.webp',
    origin: 'Godavari Gomatha Sanctuary, East Godavari, AP',
    certifications: ['Vedic Bilona Method', 'A2 Certified', 'Grass-Fed Cows']
  }
];

export const CATEGORIES = [
  { 
    id: 'cat-oils', 
    name: 'Oils', 
    subtext: 'Cold pressed pure organic oils & ghee', 
    count: 10,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/oil.webp',
    imageUrl: '/categories/oil.webp',
    displayOrder: 1
  },
  { 
    id: 'cat-rice', 
    name: 'Organic Rice', 
    subtext: 'Red, black & traditional sona masoori rice', 
    count: 3,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/rice.webp',
    imageUrl: '/categories/rice.webp',
    displayOrder: 2
  },
  { 
    id: 'cat-millets', 
    name: 'Organic Millets', 
    subtext: 'Unpolished native Siridhanya millets', 
    count: 5,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/millet.webp',
    imageUrl: '/categories/millet.webp',
    displayOrder: 3
  },
  { 
    id: 'cat-spices', 
    name: 'Organic Spices', 
    subtext: 'Pure stone ground turmeric & red chilli', 
    count: 2,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/spices.webp',
    imageUrl: '/categories/spices.webp',
    displayOrder: 4
  }
];

export function CartProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [storeContent, setStoreContent] = useState(null);
  const [promotions, setPromotions] = useState(INITIAL_PROMOTIONS);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Subscribe to live Firebase Firestore updates
  useEffect(() => {
    const unsubProducts = subscribeToStorefrontProducts((liveProducts) => {
      if (liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
        setFirebaseConnected(true);
      }
    });

    const unsubCategories = subscribeToStorefrontCategories((liveCategories) => {
      if (liveCategories && liveCategories.length > 0) {
        setCategories(liveCategories);
      }
    });

    const unsubContent = subscribeToStorefrontContent((liveContent) => {
      if (liveContent) {
        setStoreContent(liveContent);
      }
    });

    const unsubPromotions = subscribeToStorefrontPromotions((livePromos) => {
      if (livePromos && livePromos.length > 0) {
        setPromotions(livePromos);
      }
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubContent();
      unsubPromotions();
    };
  }, []);
  const [currentPage, setCurrentPageState] = useState(() => {
    const hash = window.location.hash.replace('#/', '');
    return hash || 'home';
  });
  const [selectedProductId, setSelectedProductId] = useState('p_oil_groundnut');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Customer Account & Authentication State (persisted in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('godavari_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // Listen to Firebase Auth state changes (Google, Email/Password, etc.)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Organic Shopper'),
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          photoURL: firebaseUser.photoURL || '',
          isLoggedIn: true,
          memberSince: new Date(firebaseUser.metadata?.creationTime || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        };
        setUser(mappedUser);
        try {
          localStorage.setItem('godavari_user', JSON.stringify(mappedUser));
        } catch (e) {
          console.error(e);
        }
        syncStorefrontCustomer(mappedUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginUser = useCallback((userData) => {
    setUser(userData);
    try {
      localStorage.setItem('godavari_user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
    syncStorefrontCustomer(userData);
    setAuthModalOpen(false);
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
    setUser(null);
    try {
      localStorage.removeItem('godavari_user');
      sessionStorage.removeItem('godavari_auth_dismissed');
    } catch (e) {
      console.error(e);
    }
    setAuthModalOpen(false);
  }, []);

  // Note: Automatic intrusive pop-up on first load has been removed to comply with
  // Google Lighthouse Best Practices & WCAG Accessibility standards.
  // AuthModal is triggered on-demand via Header Account button, Sign In, or Checkout.

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
  
  // Cart items state with initial sample items from Godavari organic catalog
  const [cartItems, setCartItems] = useState([
    {
      id: 'p_oil_groundnut',
      name: 'Cold Pressed Groundnut Oil',
      shortName: 'Groundnut Oil',
      price: 399,
      originalPrice: 499,
      weight: '1 Litre',
      selectedSize: '1 Litre',
      quantity: 1,
      image: '/products/oils/groundnut_oil.webp'
    },
    {
      id: 'p_spice_turmeric',
      name: 'High-Curcumin Turmeric Powder',
      shortName: 'Turmeric Powder',
      price: 120,
      originalPrice: 160,
      weight: '250g',
      selectedSize: '250g',
      quantity: 1,
      image: '/products/spices/turmeric_powder.webp'
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
    const packSize = size || product.weight || product.packSizes?.[0] || '1kg';
    const itemPrice = (product.prices && product.prices[packSize]) 
      ? product.prices[packSize] 
      : product.price;
    const itemOriginalPrice = (product.originalPrices && product.originalPrices[packSize]) 
      ? product.originalPrices[packSize] 
      : product.originalPrice;

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
            shortName: product.shortName || product.name,
            price: itemPrice,
            originalPrice: itemOriginalPrice,
            weight: packSize,
            selectedSize: packSize,
            quantity: qty,
            image: product.image
          }
        ];
      }
    });
    showToast(`Added "${product.shortName || product.name}" (${packSize} × ${qty}) to Cart!`);
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

  // Promotion / Coupon state & application
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const applyCoupon = useCallback((code) => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a coupon code.' };
    }
    const clean = code.trim().toUpperCase();
    const promo = promotions.find(p => (p.code || '').toUpperCase() === clean);
    if (!promo || promo.status !== 'Active') {
      return { success: false, message: `Invalid coupon code "${clean}". Only admin published coupons are accepted.` };
    }

    const today = new Date().toISOString().split('T')[0];
    if (promo.startDate && promo.startDate > today) {
      return { success: false, message: `Coupon "${clean}" is not active yet.` };
    }
    if (promo.endDate && promo.endDate < today) {
      return { success: false, message: `Coupon "${clean}" has expired.` };
    }

    if (promo.minOrderValue && cartSubtotal < promo.minOrderValue) {
      return { 
        success: false, 
        message: `Coupon "${clean}" requires a minimum order of ₹${promo.minOrderValue.toLocaleString('en-IN')}.` 
      };
    }

    setAppliedCoupon(promo);
    return { success: true, message: `Coupon "${clean}" applied successfully!`, promo };
  }, [promotions, cartSubtotal]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrderValue && cartSubtotal < appliedCoupon.minOrderValue) {
      return 0;
    }
    let amount = 0;
    if (appliedCoupon.discountType === 'percentage') {
      amount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && amount > appliedCoupon.maxDiscount) {
        amount = appliedCoupon.maxDiscount;
      }
    } else {
      amount = Number(appliedCoupon.discountValue) || 0;
    }
    return Math.min(amount, cartSubtotal);
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const navigateToProduct = (productId) => {
    setSelectedProductId(productId);
    changePage('product', { productId });
  };

  const placeOrder = useCallback(async (orderPayload) => {
    try {
      const savedOrder = await placeStorefrontOrder(orderPayload);
      setLastOrder(savedOrder);
      clearCart();
      return savedOrder;
    } catch (err) {
      console.error("Firestore order placement error:", err);
      const fallbackOrder = {
        ...orderPayload,
        id: "GOF-" + Date.now().toString().slice(-6),
        date: new Date().toISOString()
      };
      setLastOrder(fallbackOrder);
      clearCart();
      return fallbackOrder;
    }
  }, []);

  const normalizeId = (id) => (id || '').toLowerCase().replace(/^(p_|prod-|prod_)/, '').replace(/[-_]/g, '');

  const selectedProduct = products.find(p => 
    p.id === selectedProductId || 
    (normalizeId(p.id) && normalizeId(p.id) === normalizeId(selectedProductId))
  ) || products[0] || INITIAL_PRODUCTS[0];

  return (
    <CartContext.Provider value={{
      currentPage,
      setCurrentPage,
      goBack,
      selectedProductId,
      setSelectedProductId,
      selectedProduct,
      navigateToProduct,
      selectedCategoryFilter,
      setSelectedCategoryFilter,
      mobileMenuOpen,
      setMobileMenuOpen,
      quickViewProduct,
      setQuickViewProduct,
      authModalOpen,
      setAuthModalOpen,
      user,
      loginUser,
      logoutUser,
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
      promotions,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      discountAmount,
      notification,
      showToast,
      products,
      categories,
      storeContent,
      heroSlides: storeContent?.heroSlides || null,
      firebaseConnected,
      placeOrder,
      lastOrder,
      setLastOrder,
      
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);


