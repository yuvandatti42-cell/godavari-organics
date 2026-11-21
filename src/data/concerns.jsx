import React from 'react';

export function GlucoseMeterIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="2" width="14" height="20" rx="3.5" />
      <path d="M12 6c-1.3 1.8-2 3.1-2 4.4a2 2 0 1 0 4 0c0-1.3-.7-2.6-2-4.4z" fill="currentColor" fillOpacity="0.2" />
      <line x1="8" y1="16" x2="16" y2="16" />
      <circle cx="12" cy="18.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function DigestiveGutIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 2v3" />
      <path d="M7 5h10c1.1 0 2 .9 2 2s-.9 2-2 2H7c-1.1 0-2 .9-2 2s.9 2 2 2h10c1.1 0 2 .9 2 2s-.9 2-2 2H8c-1.1 0-2 .9-2 2s.9 2 2 2h9" />
      <path d="M15 19v3" />
    </svg>
  );
}

export function ImmunityShieldIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v6M9 11h6" strokeWidth="2.5" />
    </svg>
  );
}

export function OverallWellnessIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M7 17l10-10" />
      <path d="M11 7a2 2 0 0 1 2 2c0 1.1-.9 2-2 2" />
      <path d="M7 11a2 2 0 0 1 2 2c0 1.1-.9 2-2 2" />
      <path d="M13 11a2 2 0 0 1 2 2c0 1.1-.9 2-2 2" />
      <path d="M9 15a2 2 0 0 1 2 2c0 1.1-.9 2-2 2" />
    </svg>
  );
}

export const HEALTH_CONCERNS = [
  {
    id: 'low-gi',
    name: 'Low GI',
    subtitle: 'Sugar & Diabetes Friendly',
    description: 'Slow-burning, complex fiber grains and cold-pressed oils with low glycemic index to support steady blood sugar levels.',
    keywords: ['foxtail', 'kodo', 'little', 'barnyard', 'browntop', 'millet', 'black rice', 'mustard', 'low gi', 'diabetic'],
    icon: GlucoseMeterIcon,
    accentBg: 'bg-[#e8dec5]',
  },
  {
    id: 'digestive-support',
    name: 'Digestive Support',
    subtitle: 'Gut Health & Easy Digestion',
    description: 'Nourishing Vedic A2 Bilona ghee, aged easy-digest rice, and gentle gut-cleansing millets rich in soothing fibers.',
    keywords: ['ghee', 'bilona', 'sona masoori', 'aged', 'kodo', 'little', 'coconut', 'turmeric', 'digest', 'gut'],
    icon: DigestiveGutIcon,
    accentBg: 'bg-[#f3e8cc]',
  },
  {
    id: 'immunity-support',
    name: 'Immunity Support',
    subtitle: 'Natural Defense & Vitality',
    description: 'High-curcumin turmeric, nutrient-dense almond and sesame oils, and antioxidant-rich black rice for strong daily immunity.',
    keywords: ['turmeric', 'curcumin', 'ghee', 'almond', 'black sesame', 'black rice', 'mustard', 'immunity', 'antioxidant'],
    icon: ImmunityShieldIcon,
    accentBg: 'bg-[#e8dec5]',
  },
  {
    id: 'overall-wellness',
    name: 'Overall Wellness',
    subtitle: 'Heart Health & Daily Nourishment',
    description: 'Pure wood-pressed oils, mineral-rich red rice, and natural farm staples for everyday vitality and heart wellness.',
    keywords: ['groundnut', 'sesame', 'safflower', 'sunflower', 'niger', 'red rice', 'chilli', 'wellness', 'heart'],
    icon: OverallWellnessIcon,
    accentBg: 'bg-[#f3e8cc]',
  },
];

export function getConcernIcon(concernIdOrName, props = {}) {
  const c = HEALTH_CONCERNS.find(item => 
    item.id.toLowerCase() === String(concernIdOrName).toLowerCase() ||
    item.name.toLowerCase() === String(concernIdOrName).toLowerCase()
  );
  if (c && c.icon) {
    const IconComponent = c.icon;
    return <IconComponent {...props} />;
  }
  return <OverallWellnessIcon {...props} />;
}

export function matchesHealthConcern(product, concernIdOrName) {
  if (!product || !concernIdOrName) return true;
  const target = String(concernIdOrName).toLowerCase().trim();
  const concern = HEALTH_CONCERNS.find(c => 
    c.id.toLowerCase() === target || 
    c.name.toLowerCase() === target
  );
  if (!concern) return true;

  // 1. If product explicitly has concerns array or string
  if (Array.isArray(product.concerns)) {
    if (product.concerns.some(c => c.toLowerCase().includes(target) || target.includes(c.toLowerCase()))) {
      return true;
    }
  }
  if (typeof product.concern === 'string') {
    if (product.concern.toLowerCase().includes(target) || target.includes(product.concern.toLowerCase())) {
      return true;
    }
  }

  // 2. Keyword matching on name, category, subtitle, craftTag, description, certifications
  const textBlob = [
    product.name,
    product.shortName,
    product.subtitle,
    product.category,
    product.categoryName,
    product.craftTag,
    product.description,
    ...(product.certifications || [])
  ].filter(Boolean).join(' ').toLowerCase();

  return concern.keywords.some(kw => textBlob.includes(kw));
}
