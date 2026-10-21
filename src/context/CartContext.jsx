import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

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
    image: '/products/oils/groundnut_oil.png',
    images: ['/products/oils/groundnut_oil.png', '/products/oils/oil_difference_guide.png', '/banners/banner_oil.jpg'],
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
    image: '/products/oils/sesame_oil.png',
    images: ['/products/oils/sesame_oil.png', '/products/oils/oil_difference_guide.png', '/banners/banner_oil.jpg'],
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
    image: '/products/oils/coconut_oil.png',
    images: ['/products/oils/coconut_oil.png', '/products/oils/oil_difference_guide.png', '/banners/banner_oil.jpg'],
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
    image: '/products/oils/black_sesame_oil.png',
    images: ['/products/oils/black_sesame_oil.png', '/products/oils/oil_difference_guide.png', '/banners/banner_oil.jpg'],
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
    image: '/products/oils/sunflower_oil.png',
    images: ['/products/oils/sunflower_oil.png', '/products/oils/oil_difference_guide.png', '/banners/banner_oil.jpg'],
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
    image: '/products/oils/safflower_oil.png',
    images: ['/products/oils/safflower_oil.png', '/products/oils/oil_difference_guide.png', '/banners/banner_oil.jpg'],
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
    image: '/products/oils/mustard_oil.png',
    images: ['/products/oils/mustard_oil.png', '/products/oils/oil_difference_guide.png', '/banners/banner_oil.jpg'],
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
    image: '/products/oils/almond_oil.png',
    images: ['/products/oils/almond_oil.png', '/products/oils/oil_difference_guide.png', '/banners/banner_oil.jpg'],
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
    image: '/products/oils/niger_oil.png',
    images: ['/products/oils/niger_oil.png', '/products/oils/oil_difference_guide.png', '/banners/banner_oil.jpg'],
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
    image: '/products/rice/red_rice.png',
    images: ['/products/rice/red_rice.png', '/products/rice/red_rice_benefits.png', '/banners/banner_rice.jpg'],
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
    image: '/products/rice/black_rice.png',
    images: ['/products/rice/black_rice.png', '/products/rice/black_rice_benefits.png', '/banners/banner_rice.jpg'],
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
    image: '/products/rice/sona_masoori_rice.png',
    images: ['/products/rice/sona_masoori_rice.png', '/products/rice/sona_masoori_rice_benefits.png', '/banners/banner_rice.jpg'],
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
    image: '/products/millets/foxtail_millet.png',
    images: ['/products/millets/foxtail_millet.png', '/products/millets/foxtail_millet_benefits.png', '/banners/banner_spices_millets.jpg'],
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
    image: '/products/millets/kodo_millet.png',
    images: ['/products/millets/kodo_millet.png', '/products/millets/kodo_millet_benefits.png', '/banners/banner_spices_millets.jpg'],
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
    image: '/products/millets/little_millet.png',
    images: ['/products/millets/little_millet.png', '/products/millets/little_millet_benefits.png', '/banners/banner_spices_millets.jpg'],
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
    image: '/products/millets/barnyard_millet.png',
    images: ['/products/millets/barnyard_millet.png', '/products/millets/barnyard_millet_benefits.png', '/banners/banner_spices_millets.jpg'],
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
    image: '/products/millets/browntop_millet.png',
    images: ['/products/millets/browntop_millet.png', '/products/millets/browntop_millet_benefits.png', '/banners/banner_spices_millets.jpg'],
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
    image: '/categories/spices.png',
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
    image: '/categories/spices.png',
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
    image: '/categories/desi_cow_ghee.jpg',
    origin: 'Godavari Gomatha Sanctuary, East Godavari, AP',
    certifications: ['Vedic Bilona Method', 'A2 Certified', 'Grass-Fed Cows']
  }
];

export const CATEGORIES = [
  { 
    id: 'c1', 
    name: 'Oils', 
    subtext: 'Cold pressed pure organic oils & ghee', 
    count: 10,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/oil.png'
  },
  { 
    id: 'c2', 
    name: 'Organic Rice', 
    subtext: 'Red, black & traditional sona masoori rice', 
    count: 3,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/rice.png'
  },
  { 
    id: 'c3', 
    name: 'Organic Millets', 
    subtext: 'Unpolished native Siridhanya millets', 
    count: 5,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/millet.png'
  },
  { 
    id: 'c4', 
    name: 'Organic Spices', 
    subtext: 'Pure stone ground turmeric & red chilli', 
    count: 2,
    bgTint: 'bg-[#f3e8cc]',
    image: '/categories/spices.png'
  }
];

export function CartProvider({ children }) {
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
      image: '/products/oils/groundnut_oil.png'
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
      image: '/categories/spices.png'
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
      selectedCategoryFilter,
      setSelectedCategoryFilter,
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


