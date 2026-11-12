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
    const today = new Date().toISOString().split('T')[0];

    // Core static URLs
    const staticUrls = [
      { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily', image: `${BASE_URL}/banners/banner1.webp`, title: 'Godavari Organic Foods — Pure Andhra Farm Harvest' },
      { loc: `${BASE_URL}/#/shop`, priority: '0.9', changefreq: 'daily' },
      { loc: `${BASE_URL}/#/track-order`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${BASE_URL}/#/shop?category=Oils`, priority: '0.85', changefreq: 'daily', image: `${BASE_URL}/categories/cold_pressed_oils.webp`, title: 'Cold Pressed Traditional Wood Ghani Oils' },
      { loc: `${BASE_URL}/#/shop?category=Organic+Rice`, priority: '0.85', changefreq: 'daily', image: `${BASE_URL}/categories/organic_rice.webp`, title: 'Heirloom Organic Rice from Godavari Basin' },
      { loc: `${BASE_URL}/#/shop?category=Organic+Millets`, priority: '0.85', changefreq: 'daily', image: `${BASE_URL}/categories/millets.webp`, title: 'Ancient Siridhanya Unpolished Millets' },
      { loc: `${BASE_URL}/#/shop?category=Organic+Spices`, priority: '0.85', changefreq: 'daily', image: `${BASE_URL}/categories/spices.webp`, title: 'Stone-Ground Pure Farm Spices' },
    ];

    // Fetch dynamic products from Firestore
    let productUrls = [];
    try {
      const snap = await getDocs(collection(db, 'products'));
      snap.forEach(doc => {
        const p = doc.data();
        const id = p.id || doc.id;
        const name = p.name || 'Organic Product';
        const image = p.image || (p.images && p.images[0]) || '';
        const fullImg = image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
        
        productUrls.push({
          loc: `${BASE_URL}/#/product?id=${encodeURIComponent(id)}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today,
          image: fullImg,
          title: escapeXml(name),
          caption: escapeXml(p.subtitle || p.description?.slice(0, 150) || '')
        });
      });
    } catch (e) {
      console.warn('Could not read Firestore products for sitemap, using standard set:', e);
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Write static URLs
    staticUrls.forEach(u => {
      xml += `  <url>\n`;
      xml += `    <loc>${u.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      xml += `    <priority>${u.priority}</priority>\n`;
      if (u.image) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${u.image}</image:loc>\n`;
        if (u.title) xml += `      <image:title>${escapeXml(u.title)}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    });

    // Write product URLs
    productUrls.forEach(u => {
      xml += `  <url>\n`;
      xml += `    <loc>${u.loc}</loc>\n`;
      xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      xml += `    <priority>${u.priority}</priority>\n`;
      if (u.image) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${u.image}</image:loc>\n`;
        if (u.title) xml += `      <image:title>${u.title}</image:title>\n`;
        if (u.caption) xml += `      <image:caption>${u.caption}</image:caption>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('Error generating sitemap');
  }
}
