import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase.js';

export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  PROMOTIONS: 'promotions',
  STORE_CONTENT: 'storeContent',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
  CALLBACKS: 'callbackRequests'
};

// Real-time listener for live promotions & coupons synced from Admin
export function subscribeToStorefrontPromotions(callback, onError) {
  const q = query(collection(db, COLLECTIONS.PROMOTIONS));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          ...data,
          code: (data.code || '').toUpperCase().trim(),
          discountType: data.discountType || 'percentage',
          discountValue: Number(data.discountValue) || 0,
          minOrderValue: Number(data.minOrderValue) || 0,
          maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
          status: data.status || 'Active'
        });
      });
      callback(items);
    },
    (err) => {
      console.warn('Storefront promotions subscription warning:', err);
      if (onError) onError(err);
    }
  );
}

// Real-time listener for live products synced from Admin
export function subscribeToStorefrontProducts(callback, onError) {
  const q = query(collection(db, COLLECTIONS.PRODUCTS));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Skip archived or draft items for customer storefront
        if (data.status === 'Archived' || data.status === 'Draft' || data.visibility === 'Hidden') return;

        // Only hide if explicitly marked as off-store
        if (data.onStore === false || data.isLiveOnStore === false) return;

        let mainImage = data.imageUrl || data.image;
        if (data.id === 'prod-spice-chilli' || data.id === 'p_spice_chilli' || data.name?.toLowerCase().includes('chilli')) {
          mainImage = '/products/spices/chilli_powder.webp';
        } else if (data.id === 'prod-spice-turmeric' || data.id === 'p_spice_turmeric' || data.name?.toLowerCase().includes('turmeric')) {
          mainImage = '/products/spices/turmeric_powder.webp';
        } else if (!mainImage) {
          const nameLower = (data.name || '').toLowerCase();
          if (nameLower.includes('groundnut')) mainImage = '/products/oils/groundnut_oil.webp';
          else if (nameLower.includes('sesame') && nameLower.includes('black')) mainImage = '/products/oils/black_sesame_oil.webp';
          else if (nameLower.includes('sesame')) mainImage = '/products/oils/sesame_oil.webp';
          else if (nameLower.includes('coconut')) mainImage = '/products/oils/coconut_oil.webp';
          else if (nameLower.includes('sunflower')) mainImage = '/products/oils/sunflower_oil.webp';
          else if (nameLower.includes('safflower')) mainImage = '/products/oils/safflower_oil.webp';
          else if (nameLower.includes('mustard')) mainImage = '/products/oils/mustard_oil.webp';
          else if (nameLower.includes('almond')) mainImage = '/products/oils/almond_oil.webp';
          else if (nameLower.includes('niger')) mainImage = '/products/oils/niger_oil.webp';
          else if (nameLower.includes('ghee') || nameLower.includes('cow')) mainImage = '/categories/desi_cow_ghee.webp';
          else if (nameLower.includes('red rice')) mainImage = '/products/rice/red_rice.webp';
          else if (nameLower.includes('black rice')) mainImage = '/products/rice/black_rice.webp';
          else if (nameLower.includes('sona')) mainImage = '/products/rice/sona_masoori_rice.webp';
          else if (nameLower.includes('foxtail')) mainImage = '/products/millets/foxtail_millet.webp';
          else if (nameLower.includes('kodo')) mainImage = '/products/millets/kodo_millet.webp';
          else if (nameLower.includes('little')) mainImage = '/products/millets/little_millet.webp';
          else if (nameLower.includes('barnyard')) mainImage = '/products/millets/barnyard_millet.webp';
          else if (nameLower.includes('browntop')) mainImage = '/products/millets/browntop_millet.webp';
          else mainImage = '/categories/oil.webp';
        }

        const gallery = Array.isArray(data.images) && data.images.length > 0 
          ? data.images 
          : [mainImage];

        const unit = data.unit || data.weight || '1 unit';
        const price = Number(data.price) || 0;
        const origPrice = Number(data.originalPrice || data.compareAtPrice || price);
        const discountText = origPrice > price 
          ? `${Math.round(((origPrice - price) / origPrice) * 100)}% OFF` 
          : (data.discount || '');

        const catName = data.category || data.categoryName || 'General';
        let catId = data.categoryId;
        if (!catId) {
          const lower = catName.toLowerCase();
          if (lower.includes('rice')) catId = 'cat-rice';
          else if (lower.includes('oil') || lower.includes('ghee')) catId = 'cat-oils';
          else if (lower.includes('millet')) catId = 'cat-millets';
          else if (lower.includes('spice')) catId = 'cat-spices';
          else catId = `cat-${lower.replace(/\s+/g, '-')}`;
        }

        items.push({
          id: docSnap.id,
          name: data.name,
          shortName: data.shortName || data.name,
          subtitle: data.subtitle || data.description?.slice(0, 60) || '',
          category: catName,
          categoryName: catName,
          categoryId: catId,
          packSizes: Array.isArray(data.packSizes) && data.packSizes.length > 0 ? data.packSizes : [unit],
          weight: unit,
          price: price,
          originalPrice: origPrice,
          prices: data.prices || { [unit]: price },
          originalPrices: data.originalPrices || { [unit]: origPrice },
          discount: discountText,
          rating: Number(data.rating) || 4.9,
          reviewsCount: Number(data.reviewsCount || data.salesCount || 120),
          description: data.description || '',
          inStock: data.inStock !== undefined ? Boolean(data.inStock) : (data.stock > 0 && data.status === 'Active'),
          isPopular: Boolean(data.isPopular || data.featured),
          isBestseller: Boolean(data.isBestseller || (data.salesCount && data.salesCount > 80)),
          craftTag: (data.craftTag || (data.category?.includes('Oil') ? 'Cold Pressed' : ''))
            .replace(/100%\s*(certified\s*|pure\s*)?organic/gi, '')
            .trim(),
          image: mainImage,
          images: gallery,
          origin: data.origin || data.harvestLocation || 'Godavari Delta, Andhra Pradesh',
          certifications: Array.isArray(data.certifications) && data.certifications.length > 0 
            ? data.certifications.map(c => c.replace(/100%\s*(certified\s*|pure\s*)?organic/gi, 'Certified Organic').trim()) 
            : ['Certified Organic', 'Zero Chemicals', 'Farm Fresh']
        });
      });
      callback(items);
    },
    (err) => {
      console.warn('Storefront products subscription warning:', err);
      if (onError) onError(err);
    }
  );
}

// Real-time listener for live categories synced from Admin
export function subscribeToStorefrontCategories(callback, onError) {
  const q = query(collection(db, COLLECTIONS.CATEGORIES));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.visibility === 'Hidden') return;
        let catImage = data.imageUrl || data.image;
        if (!catImage) {
          const nameLower = (data.name || docSnap.id).toLowerCase();
          if (nameLower.includes('rice')) catImage = '/categories/rice.webp';
          else if (nameLower.includes('millet')) catImage = '/categories/millet.webp';
          else if (nameLower.includes('spice')) catImage = '/categories/spices.webp';
          else if (nameLower.includes('ghee') || nameLower.includes('cow')) catImage = '/categories/desi_cow_ghee.webp';
          else catImage = '/categories/oil.webp';
        }
        items.push({
          id: docSnap.id,
          name: data.name,
          slug: data.slug || docSnap.id,
          description: data.description || '',
          subtext: data.description || data.subtext || '',
          count: data.count || 0,
          bgTint: data.bgTint || 'bg-[#f3e8cc]',
          image: catImage,
          imageUrl: catImage,
          displayOrder: data.displayOrder || 0
        });
      });
      items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      callback(items);
    },
    (err) => {
      console.warn('Storefront categories subscription warning:', err);
      if (onError) onError(err);
    }
  );
}


// Real-time listener for general store settings (shipping threshold, standard delivery fee)
export function subscribeToStorefrontSettings(callback, onError) {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn('Storefront settings subscription warning:', err);
      if (onError) onError(err);
    }
  );
}

// Real-time listener for visual store content (Hero slides, offer banners)
export function subscribeToStorefrontContent(callback, onError) {
  const docRef = doc(db, COLLECTIONS.STORE_CONTENT, 'active');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn('Storefront content subscription warning:', err);
      if (onError) onError(err);
    }
  );
}

// Helper to sanitize undefined values before saving to Firestore
export function sanitizeForFirestore(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => (item !== null && typeof item === 'object' ? sanitizeForFirestore(item) : item));
  }
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (value !== null && typeof value === 'object') {
      result[key] = sanitizeForFirestore(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Place a new customer order into Firebase Firestore
export async function placeStorefrontOrder(orderData) {
  try {
    const orderId = orderData.id || `GOF-${Date.now().toString().slice(-6)}`;
    const fullOrder = sanitizeForFirestore({
      ...orderData,
      id: orderId,
      date: new Date().toISOString(),
      orderStatus: 'Pending',
      paymentStatus: orderData.paymentMethod?.toLowerCase().includes('cash') ? 'Pending' : 'Paid',
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: `Customer placed order on website via ${orderData.paymentMethod || 'Online'}`
        }
      ]
    });

    // 1. Save order to Firestore
    await setDoc(doc(db, COLLECTIONS.ORDERS, orderId), fullOrder);

    // 2. Log real-time notification for Admin Portal
    try {
      const notifId = `notif-ord-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notifId), {
        id: notifId,
        title: `Live Order: #${orderId}`,
        message: `${orderData.customerName || 'Customer'} placed an order of ₹${orderData.total.toLocaleString('en-IN')}`,
        timestamp: new Date().toISOString(),
        type: 'order',
        read: false,
        link: '/orders'
      });
    } catch (nErr) {
      console.warn('Admin notification creation non-blocking error:', nErr);
    }

    // 3. Upsert customer record
    if (orderData.customerPhone || orderData.customerEmail) {
      const customerId = (orderData.customerPhone || orderData.customerEmail).replace(/[^a-zA-Z0-9]/g, '_');
      const now = new Date().toISOString();
      try {
        const custRef = doc(db, COLLECTIONS.CUSTOMERS, customerId);
        const existingCust = await getDoc(custRef);
        if (existingCust.exists()) {
          const cData = existingCust.data();
          const newOrders = (cData.totalOrders || 0) + 1;
          const newSpent = (cData.totalSpent || 0) + (orderData.total || 0);
          await updateDoc(custRef, sanitizeForFirestore({
            name: orderData.customerName || cData.name || undefined,
            email: orderData.customerEmail || cData.email || undefined,
            phone: orderData.customerPhone || cData.phone || undefined,
            totalOrders: newOrders,
            totalSpent: newSpent,
            hasPurchased: true,
            firstOrderDate: cData.firstOrderDate || now,
            lastOrderDate: now,
            recentOrderIds: [orderId, ...(cData.recentOrderIds || []).filter(id => id !== orderId).slice(0, 9)],
            city: orderData.shippingAddress?.city || cData.city || '',
            state: orderData.shippingAddress?.state || cData.state || '',
            status: newSpent >= 5000 ? 'VIP' : 'Active'
          }));
        } else {
          await setDoc(custRef, sanitizeForFirestore({
            id: customerId,
            name: orderData.customerName || 'Online Customer',
            email: orderData.customerEmail || '',
            phone: orderData.customerPhone || '',
            city: orderData.shippingAddress?.city || '',
            state: orderData.shippingAddress?.state || '',
            totalOrders: 1,
            totalSpent: orderData.total || 0,
            hasPurchased: true,
            firstOrderDate: now,
            lastOrderDate: now,
            lastLoginDate: now,
            joinedDate: now.split('T')[0],
            status: (orderData.total || 0) >= 5000 ? 'VIP' : 'Active',
            recentOrderIds: [orderId]
          }));
        }
      } catch (cErr) {
        console.warn('Customer upsert non-blocking error:', cErr);
      }
    }

    return fullOrder;
  } catch (err) {
    console.error('Failed to place order in Firestore:', err);
    throw err;
  }
}

// Sync customer account on login / registration
export async function syncStorefrontCustomer(userData) {
  if (!userData || (!userData.phone && !userData.email)) return;
  const customerId = (userData.phone || userData.email).replace(/[^a-zA-Z0-9]/g, '_');
  const now = new Date().toISOString();
  try {
    const custRef = doc(db, COLLECTIONS.CUSTOMERS, customerId);
    const existing = await getDoc(custRef);
    if (!existing.exists()) {
      const newRecord = sanitizeForFirestore({
        id: customerId,
        uid: userData.uid || '',
        name: userData.name || 'Organic Shopper',
        phone: userData.phone || '',
        email: userData.email || '',
        photoURL: userData.photoURL || '',
        city: userData.city || '',
        state: userData.state || '',
        totalOrders: 0,
        totalSpent: 0,
        hasPurchased: false,
        joinedDate: now.split('T')[0],
        lastLoginDate: now,
        authProvider: userData.authProvider || (userData.email && userData.uid ? 'Google' : 'Email/Password'),
        loginCount: 1,
        status: 'Active',
        recentOrderIds: []
      });
      await setDoc(custRef, newRecord);
    } else {
      const cData = existing.data();
      const updates = sanitizeForFirestore({
        name: userData.name || cData.name || undefined,
        phone: userData.phone || cData.phone || undefined,
        email: userData.email || cData.email || undefined,
        photoURL: userData.photoURL || cData.photoURL || undefined,
        uid: userData.uid || cData.uid || undefined,
        lastLoginDate: now,
        loginCount: (cData.loginCount || 1) + 1,
        authProvider: userData.authProvider || cData.authProvider || undefined
      });
      if (Object.keys(updates).length > 0) {
        await updateDoc(custRef, updates);
      }
    }
  } catch (e) {
    console.warn('Sync customer non-blocking error:', e);
  }
}

// Push a customer callback request to Firestore
export async function addCallbackRequest(phone, source = 'Website Quick Callback') {
  if (!phone || !phone.trim()) return false;
  const cleanPhone = phone.trim();
  const id = `cb-${Date.now()}`;
  const now = new Date().toISOString();
  try {
    const cbRef = doc(db, COLLECTIONS.CALLBACKS, id);
    await setDoc(cbRef, {
      id,
      phone: cleanPhone,
      timestamp: now,
      status: 'Pending',
      source,
      notes: ''
    });

    // Also push a live notification to admin notifications collection
    try {
      const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, `notif-cb-${Date.now()}`);
      await setDoc(notifRef, {
        id: `notif-cb-${Date.now()}`,
        title: 'New Callback Request',
        message: `Customer requested a callback at ${cleanPhone}`,
        timestamp: now,
        type: 'customer',
        read: false,
        link: '/dashboard'
      });
    } catch (nErr) {
      console.warn('Admin notification creation warning:', nErr);
    }
    return true;
  } catch (err) {
    console.error('Failed to save callback request to Firestore:', err);
    throw err;
  }
}
