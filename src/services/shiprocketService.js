/**
 * Shiprocket API Service for Storefront (godavari-organics)
 * Live automated fulfillment with production credentials
 */

export const SHIPROCKET_CONFIG = {
  BASE_URL: 'https://apiv2.shiprocket.in/v1/external',
  DEFAULT_EMAIL: 'nasnaidu01@gmail.com',
  DEFAULT_PASSWORD: 'vGQJtM%5*sam1YT31o94iB9*qXJd9mf9',
  DEFAULT_PICKUP_LOCATION: 'Primary',
  TOKEN_STORAGE_KEY: 'gof_shiprocket_token',
  TOKEN_EXPIRY_KEY: 'gof_shiprocket_token_expiry',
};

export function formatShiprocketDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

let lastAuthFailureTime = 0;
let lastAuthFailureError = '';

async function shiprocketFetch(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (typeof window !== 'undefined') {
    try {
      const proxyUrl = `/api/shiprocket?endpoint=${encodeURIComponent(cleanEndpoint)}`;
      const proxyRes = await fetch(proxyUrl, options);
      if (proxyRes.ok || proxyRes.status < 500) {
        return proxyRes;
      }
    } catch (e) {
      console.warn('[Shiprocket Proxy notice, attempting direct API]', e);
    }
  }

  const directUrl = `${SHIPROCKET_CONFIG.BASE_URL}${cleanEndpoint}`;
  return fetch(directUrl, options);
}

export async function getShiprocketToken(creds, forceRefresh = false) {
  const email = creds?.email || SHIPROCKET_CONFIG.DEFAULT_EMAIL;
  const password = creds?.password || SHIPROCKET_CONFIG.DEFAULT_PASSWORD;

  if (forceRefresh) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(SHIPROCKET_CONFIG.TOKEN_STORAGE_KEY);
        localStorage.removeItem(SHIPROCKET_CONFIG.TOKEN_EXPIRY_KEY);
      } catch {}
    }
    lastAuthFailureTime = 0;
    lastAuthFailureError = '';
  } else {
    if (Date.now() - lastAuthFailureTime < 30 * 1000) {
      throw new Error(`Shiprocket API authentication cooling down: ${lastAuthFailureError}`);
    }

    if (typeof window !== 'undefined') {
      try {
        const cachedToken = localStorage.getItem(SHIPROCKET_CONFIG.TOKEN_STORAGE_KEY);
        const cachedExpiry = localStorage.getItem(SHIPROCKET_CONFIG.TOKEN_EXPIRY_KEY);
        const now = Date.now();
        if (cachedToken && cachedExpiry && now < Number(cachedExpiry)) {
          return cachedToken;
        }
      } catch {
        // ignore
      }
    }
  }

  const res = await shiprocketFetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message = errData.message || `Shiprocket login failed with HTTP ${res.status}`;
    lastAuthFailureTime = Date.now();
    lastAuthFailureError = message;
    throw new Error(message);
  }

  lastAuthFailureTime = 0;
  lastAuthFailureError = '';

  const data = await res.json();
  if (!data.token) {
    throw new Error('No token returned in Shiprocket authentication response');
  }

  if (typeof window !== 'undefined') {
    try {
      // Shiprocket tokens expire in 24 hours. Cache for 10 hours max so tokens are always fresh.
      const expiryTime = Date.now() + 10 * 60 * 60 * 1000;
      localStorage.setItem(SHIPROCKET_CONFIG.TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(SHIPROCKET_CONFIG.TOKEN_EXPIRY_KEY, String(expiryTime));
    } catch {
      // ignore
    }
  }

  return data.token;
}

export async function createShiprocketOrder(order, options = {}) {
  const token = await getShiprocketToken(options?.creds);
  const pickupLocation =
    options?.pickupLocation ||
    options?.creds?.pickupLocation ||
    SHIPROCKET_CONFIG.DEFAULT_PICKUP_LOCATION;

  const nameParts = (order.customerName || 'Valued Customer').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '';

  const orderItems = (order.items && order.items.length > 0)
    ? order.items.map((item, idx) => ({
        name: item.productName || item.name || `Item #${idx + 1}`,
        sku: item.productId || item.id || `SKU-${idx + 1}`,
        units: item.quantity || 1,
        selling_price: String(item.unitPrice || item.price || 0),
        discount: '0',
        tax: '0',
      }))
    : [
        {
          name: 'Organic Grocery Order',
          sku: 'GOF-BUNDLE',
          units: 1,
          selling_price: String(order.total || 0),
          discount: '0',
          tax: '0',
        },
      ];

  const isCOD = (order.paymentMethod || '').toLowerCase().includes('cash');
  const paymentMethod = isCOD ? 'COD' : 'Prepaid';

  const weight = options?.weightKg || Math.max(0.5, (order.items?.length || 1) * 0.4);
  const length = options?.lengthCm || 15;
  const breadth = options?.breadthCm || 15;
  const height = options?.heightCm || 10;

  const cleanPhone = (order.customerPhone || '9010088063').replace(/\D/g, '').slice(-10);

  const payload = {
    order_id: `${order.id}-${Date.now().toString().slice(-4)}`,
    order_date: formatShiprocketDate(order.date),
    pickup_location: pickupLocation,
    channel_id: '',
    comment: order.internalNote || 'Godavari Organics Verified Package',
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: order.shippingAddress?.street || 'Riverbank Road',
    billing_address_2: '',
    billing_city: order.shippingAddress?.city || 'Rajahmundry',
    billing_pincode: order.shippingAddress?.pincode || '533105',
    billing_state: order.shippingAddress?.state || 'Andhra Pradesh',
    billing_country: 'India',
    billing_email: order.customerEmail || 'care@godavariorganic.in',
    billing_phone: cleanPhone || '9010088063',
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: paymentMethod,
    sub_total: Number(order.total || 0),
    length,
    breadth,
    height,
    weight,
  };

  let res = await shiprocketFetch('/orders/create/adhoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let data = await res.json().catch(() => ({}));

  // Auto-recovery: If token expired, clear cache, fetch fresh token and retry immediately
  const isAuthError =
    res.status === 401 ||
    data?.status_code === 401 ||
    data?.message === 'token_expired' ||
    (typeof data?.message === 'string' && (
      data.message.toLowerCase().includes('token') ||
      data.message.toLowerCase().includes('unauthorized')
    ));

  if (isAuthError) {
    console.warn('[Shiprocket] Token expired or unauthorized. Auto-refreshing token and retrying order creation...');
    try {
      const freshToken = await getShiprocketToken(options?.creds, true);
      res = await shiprocketFetch('/orders/create/adhoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${freshToken}`,
        },
        body: JSON.stringify(payload),
      });
      data = await res.json().catch(() => ({}));
    } catch (refreshErr) {
      console.error('[Shiprocket] Token auto-refresh failed:', refreshErr);
    }
  }

  if (!res.ok || data.status_code >= 400) {
    const errorMsg =
      data.message ||
      (data.errors ? JSON.stringify(data.errors) : `HTTP ${res.status} Order creation failed`);
    throw new Error(errorMsg);
  }

  return data;
}

export function getShiprocketTrackingUrl(awbCode) {
  return `https://shiprocket.co//tracking/${awbCode}`;
}

/**
 * Fetch live courier tracking scans from Shiprocket API
 */
export async function fetchShiprocketTracking(awbOrOrderId, creds) {
  if (!awbOrOrderId) return null;
  try {
    let token = await getShiprocketToken(creds);
    const cleanQuery = String(awbOrOrderId).trim();
    const isNumOnly = /^\d+$/.test(cleanQuery);

    let url = `${SHIPROCKET_CONFIG.BASE_URL}/courier/track/awb/${encodeURIComponent(cleanQuery)}`;
    if (!isNumOnly && cleanQuery.toUpperCase().includes('GOF-')) {
      url = `${SHIPROCKET_CONFIG.BASE_URL}/courier/track?order_id=${encodeURIComponent(cleanQuery)}`;
    }

    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      const freshToken = await getShiprocketToken(creds, true);
      res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${freshToken}`,
        },
      });
    }

    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[Shiprocket Tracking] Non-blocking tracking fetch notice:', err);
    return null;
  }
}



