import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "godavari-organics-arma",
  appId: "1:317984776709:web:71e24a5ab450303d1bb26c",
  storageBucket: "godavari-organics-arma.firebasestorage.app",
  apiKey: "AIzaSyClBi5ndrttDLKkkf_Lp5rzx8XVT4fgfHI",
  authDomain: "godavari-organics-arma.firebaseapp.com",
  messagingSenderId: "317984776709",
  measurementId: "G-FNFXP76FTV"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_URL = 'https://www.armafarms.com';

const FALLBACK_PRODUCTS = [
  {
    id: 'p_oil_groundnut',
    name: 'Cold Pressed Groundnut Oil (100% Pure Wood Ghani)',
    description: 'Traditional cold pressed peanut oil extracted at low temperature from premium farm groundnuts. Unrefined, unbleached, rich in natural aroma and vitamin E.',
    price: 399,
    image: '/products/oils/groundnut_oil.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
  },
  {
    id: 'p_oil_sesame',
    name: 'Cold Pressed Sesame Oil (Pure Gingelly / Til Oil)',
    description: 'Slow-extracted pure cold pressed sesame oil with organic seeds and palm jaggery. Rich in natural sesamol and antioxidants.',
    price: 450,
    image: '/products/oils/sesame_oil.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
  },
  {
    id: 'p_oil_coconut',
    name: 'Cold Pressed Virgin Coconut Oil',
    description: 'Extracted from mature sun-dried Konaseema organic coconuts. 100% unrefined, raw aroma, sulfur-free.',
    price: 420,
    image: '/products/oils/coconut_oil.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
  },
  {
    id: 'p_oil_black_sesame',
    name: 'Cold Pressed Black Sesame Oil (Ayurvedic High Calcium)',
    description: 'Indigenous cold pressed black sesame oil from agency tribal belt. Revered in Ayurveda for bone strength and traditional wellness.',
    price: 490,
    image: '/products/oils/black_sesame_oil.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
  },
  {
    id: 'p_oil_sunflower',
    name: 'Cold Pressed Sunflower Oil (Light & Unrefined)',
    description: 'Cold pressed non-GMO organic sunflower cooking oil. Light on the stomach, hexane-free, chemical deodorizer free.',
    price: 350,
    image: '/products/oils/sunflower_oil.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
  },
  {
    id: 'p_oil_safflower',
    name: 'Cold Pressed Safflower Oil (Kusuma Oil)',
    description: 'Traditional Kusuma oil cold pressed from selected safflower seeds. High smoke point and zero cholesterol.',
    price: 420,
    image: '/products/oils/safflower_oil.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
  },
  {
    id: 'p_oil_mustard',
    name: 'Cold Pressed Mustard Oil (Pure Sarson Oil)',
    description: 'Strong natural aroma and sharp pungency. Cold pressed from dark organic mustard seeds for authentic flavour.',
    price: 330,
    image: '/products/oils/mustard_oil.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
  },
  {
    id: 'p_oil_almond',
    name: 'Cold Pressed Sweet Almond Oil (Badam Rogan)',
    description: '100% pure edible sweet almond oil extracted through cold pressing. Ultra nourishing for brain, skin, and babies.',
    price: 450,
    image: '/products/oils/almond_oil.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
  },
  {
    id: 'p_oil_niger',
    name: 'Cold Pressed Niger Oil (Valisalu / Gurellu)',
    description: 'Indigenous Niger seed oil packed with essential fatty acids and rural heritage recipe.',
    price: 380,
    image: '/products/oils/niger_oil.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
  },
  {
    id: 'p_ghee_cow',
    name: 'Desi Gir Cow A2 Vedic Bilona Ghee',
    description: 'Sacred ancient Vedic Bilona method cultured curd ghee from grass-fed Gir cows. Golden Danedar texture and heavenly aroma.',
    price: 850,
    image: '/categories/desi_cow_ghee.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Dairy Products > Butter & Margarine'
  },
  {
    id: 'p_rice_red',
    name: 'Organic Red Rice (Unpolished Heirloom Low-GI)',
    description: 'Traditional unpolished red rice with bran intact. High anthocyanin antioxidants and low glycemic index.',
    price: 140,
    image: '/products/rice/red_rice.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Rice'
  },
  {
    id: 'p_rice_black',
    name: 'Organic Black Rice (Chak-Hao Forbidden Superfood)',
    description: 'Ancient nutrient-dense purple black rice rich in antioxidants, dietary fiber, and essential minerals.',
    price: 240,
    image: '/products/rice/black_rice.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Rice'
  },
  {
    id: 'p_rice_sona',
    name: 'Naturally Aged Sona Masoori Rice (12 Months Aged)',
    description: 'Premium lightweight aromatic Sona Masoori rice naturally aged for 12 months. Pesticide free, non-sticky.',
    price: 95,
    image: '/products/rice/sona_masoori_rice.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Rice'
  },
  {
    id: 'p_millet_foxtail',
    name: 'Organic Foxtail Millet (Korralu Siridhanya)',
    description: 'Unpolished native Foxtail millet rich in dietary fiber and B-vitamins. Diabetic friendly ancient grain.',
    price: 75,
    image: '/products/millets/foxtail_millet.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Grains'
  },
  {
    id: 'p_millet_kodo',
    name: 'Organic Kodo Millet (Arikelu Detox Grain)',
    description: 'Unpolished Kodo millet prized for blood purification and gut microbiome health.',
    price: 80,
    image: '/products/millets/kodo_millet.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Grains'
  },
  {
    id: 'p_millet_little',
    name: 'Organic Little Millet (Samalu Quick-Cook)',
    description: 'Fine-grained unpolished Little millet. Easy on digestion, cooks in 10 minutes, gluten-free.',
    price: 75,
    image: '/products/millets/little_millet.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Grains'
  },
  {
    id: 'p_millet_barnyard',
    name: 'Organic Barnyard Millet (Oodalu High Iron)',
    description: 'Unpolished Barnyard millet with high bioavailable iron content and low glycemic index.',
    price: 85,
    image: '/products/millets/barnyard_millet.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Grains'
  },
  {
    id: 'p_millet_browntop',
    name: 'Organic Browntop Millet (Andukorralu 12.5% Fiber Supergrain)',
    description: 'The rarest Siridhanya supergrain boasting 12.5% dietary fiber for total metabolic cleansing.',
    price: 110,
    image: '/products/millets/browntop_millet.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Grains'
  },
  {
    id: 'p_spice_turmeric',
    name: 'High-Curcumin Turmeric Powder (5%+ Curcumin Stone Ground)',
    description: 'Wild harvest tribal turmeric stone ground to preserve essential volatile oils and 5%+ curcumin. Zero chemicals or artificial dyes.',
    price: 120,
    image: '/products/spices/turmeric_powder.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Condiments & Sauces > Herbs & Spices'
  },
  {
    id: 'p_spice_chilli',
    name: 'Guntur Pure Red Chilli Powder (Sun-Pounded Mirchi)',
    description: 'Authentic sun-dried pounded Guntur chillies with pure seed pungency. Zero artificial red colour or preservatives.',
    price: 130,
    image: '/products/spices/chilli_powder.webp',
    category: 'Food, Beverages & Tobacco > Food Items > Condiments & Sauces > Herbs & Spices'
  }
];

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req, res) {
  try {
    let productsList = [...FALLBACK_PRODUCTS];

    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        const firestoreList = [];
        snap.forEach(doc => {
          const d = doc.data();
          firestoreList.push({
            id: d.id || doc.id,
            name: d.name || 'Organic Farm Produce',
            description: d.description || d.subtitle || 'Pure organic farm product from Godavari River delta.',
            price: d.price || 100,
            image: d.image || (d.images && d.images[0]) || '/banners/banner1.webp',
            category: d.category?.toLowerCase().includes('oil') 
              ? 'Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils'
              : (d.category?.toLowerCase().includes('rice') 
                ? 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Rice'
                : 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal > Grains')
          });
        });
        if (firestoreList.length > 0) {
          productsList = firestoreList;
        }
      }
    } catch (dbErr) {
      console.warn('Google Shopping feed using fallback list:', dbErr);
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n`;
    xml += `  <channel>\n`;
    xml += `    <title>Godavari Organic Foods — Google Shopping Feed</title>\n`;
    xml += `    <link>${BASE_URL}</link>\n`;
    xml += `    <description>Official Google Shopping Product Feed for Godavari Organic Foods (armafarms.com)</description>\n`;

    productsList.forEach(p => {
      const imgPath = p.image.startsWith('http') 
        ? p.image 
        : `${BASE_URL}${p.image.startsWith('/') ? '' : '/'}${p.image}`;
      const productUrl = `${BASE_URL}/#/product?id=${encodeURIComponent(p.id)}`;

      xml += `    <item>\n`;
      xml += `      <g:id>${escapeXml(p.id)}</g:id>\n`;
      xml += `      <g:title>${escapeXml(p.name)}</g:title>\n`;
      xml += `      <g:description>${escapeXml(p.description)}</g:description>\n`;
      xml += `      <g:link>${escapeXml(productUrl)}</g:link>\n`;
      xml += `      <g:image_link>${escapeXml(imgPath)}</g:image_link>\n`;
      xml += `      <g:condition>new</g:condition>\n`;
      xml += `      <g:availability>in_stock</g:availability>\n`;
      xml += `      <g:price>${Number(p.price).toFixed(2)} INR</g:price>\n`;
      xml += `      <g:brand>Godavari Organic Foods</g:brand>\n`;
      xml += `      <g:identifier_exists>no</g:identifier_exists>\n`;
      xml += `      <g:google_product_category>${escapeXml(p.category)}</g:google_product_category>\n`;
      xml += `      <g:shipping>\n`;
      xml += `        <g:country>IN</g:country>\n`;
      xml += `        <g:service>Standard Courier Delivery</g:service>\n`;
      xml += `        <g:price>50.00 INR</g:price>\n`;
      xml += `      </g:shipping>\n`;
      xml += `    </item>\n`;
    });

    xml += `  </channel>\n`;
    xml += `</rss>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('Google Shopping feed generation error:', err);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('Error generating Google Shopping feed');
  }
}
