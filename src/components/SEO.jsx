import { useEffect } from 'react';

const DEFAULT_TITLE = 'Godavari Organic Foods — Pure, Authentic Farm Harvest';
const DEFAULT_DESC = 'Direct from Godavari delta farms: 100% Cold Pressed Wood Ghani Oils, Desi Gir Cow Vedic A2 Ghee, Unpolished Heirloom Rice, Siridhanya Millets, and Stone-Ground Spices.';
const DEFAULT_IMAGE = 'https://www.armafarms.com/banners/banner1.webp';
const BASE_URL = 'https://www.armafarms.com';

function setMetaTag(attr, key, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url) {
  if (!url) return;
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

function setJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export default function SEO({
  title,
  description,
  image,
  url,
  canonical,
  noindex = false,
  product = null,
  breadcrumbs = null,
}) {
  useEffect(() => {
    const fullTitle = title 
      ? `${title} | Godavari Organic Foods` 
      : DEFAULT_TITLE;
    const metaDesc = description || DEFAULT_DESC;
    const fullUrl = url ? (url.startsWith('http') ? url : `${BASE_URL}${url}`) : BASE_URL;
    const canonicalUrl = canonical || fullUrl;
    
    let ogImage = DEFAULT_IMAGE;
    if (image) {
      ogImage = image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
    }

    // 1. Document Title
    document.title = fullTitle;

    // 2. Meta Description & Robots
    setMetaTag('name', 'description', metaDesc);
    setMetaTag('name', 'title', fullTitle);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // 3. Canonical Link
    setCanonical(canonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', metaDesc);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', fullUrl);
    setMetaTag('property', 'og:type', product ? 'product' : 'website');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', metaDesc);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Dynamic Product JSON-LD Schema (for Google Shopping & Rich Results)
    if (product) {
      const productImage = product.image || (product.images && product.images[0]) || DEFAULT_IMAGE;
      const fullProductImg = productImage.startsWith('http') 
        ? productImage 
        : `${BASE_URL}${productImage.startsWith('/') ? '' : '/'}${productImage}`;

      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: fullProductImg,
        description: product.description || metaDesc,
        sku: product.id || 'GOF-PROD',
        mpn: product.id || 'GOF-PROD',
        brand: {
          '@type': 'Brand',
          name: 'Godavari Organic Foods'
        },
        offers: {
          '@type': 'Offer',
          url: fullUrl,
          priceCurrency: 'INR',
          price: product.price || 0,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.inStock !== false 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Godavari Organic Foods'
          }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating || 4.9,
          reviewCount: product.reviewsCount || 120,
          bestRating: 5,
          worstRating: 1
        }
      };
      setJsonLd('dynamic-product-jsonld', productSchema);
    } else {
      setJsonLd('dynamic-product-jsonld', null);
    }

    // 7. Dynamic BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`
        }))
      };
      setJsonLd('dynamic-breadcrumb-jsonld', breadcrumbSchema);
    } else {
      setJsonLd('dynamic-breadcrumb-jsonld', null);
    }

    // Clean up on component change
    return () => {
      // Intentionally keep base tags intact, will be overwritten by next route SEO component
    };
  }, [title, description, image, url, canonical, noindex, product, breadcrumbs]);

  return null;
}
