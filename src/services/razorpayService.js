/**
 * Official Razorpay Payment Gateway Service
 * Godavari Organic Foods
 * 
 * Directly opens the official Razorpay Checkout Gateway modal (checkout.razorpay.com).
 * Dynamically prioritizes UPI & QR Code when selected by customer.
 */

// Official public Razorpay test key from Razorpay docs for instant sandbox testing
const DEFAULT_TEST_KEY = 'rzp_test_1DP5mmOlF5G5ag';

export function loadRazorpayScript() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existing) {
      existing.onload = () => resolve(true);
      existing.onerror = () => resolve(false);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export function getRazorpayKey(customKey) {
  if (customKey && typeof customKey === 'string' && customKey.trim().startsWith('rzp_')) {
    return customKey.trim();
  }
  if (typeof window !== 'undefined' && window.__RAZORPAY_KEY_ID__ && window.__RAZORPAY_KEY_ID__.startsWith('rzp_')) {
    return window.__RAZORPAY_KEY_ID__;
  }
  try {
    const cached = localStorage.getItem('gof_razorpay_key_id');
    if (cached && cached.startsWith('rzp_') && cached !== 'rzp_test_placeholder') {
      return cached;
    }
  } catch (e) {}
  const envKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (envKey && envKey.startsWith('rzp_') && envKey !== 'rzp_test_placeholder') {
    return envKey;
  }
  return DEFAULT_TEST_KEY;
}

export function setRazorpayRuntimeKey(key) {
  if (typeof window !== 'undefined' && key) {
    window.__RAZORPAY_KEY_ID__ = key;
    try {
      localStorage.setItem('gof_razorpay_key_id', key);
    } catch (e) {}
  }
}

/**
 * Directly initiates official Razorpay Standard Checkout
 */
export async function initiateRazorpayPayment({
  orderPayload,
  preferredMethod = 'upi',
  razorpayKeyId,
  merchantName,
  onSuccess,
  onFailure,
  onDismiss
}) {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || !window.Razorpay) {
    if (onFailure) {
      onFailure('Razorpay Checkout failed to load. Please check your internet connection and try again.');
    }
    return;
  }

  const key = getRazorpayKey(razorpayKeyId);
  if (key && key.startsWith('rzp_')) {
    setRazorpayRuntimeKey(key);
  }
  const amountInPaise = Math.round(Number(orderPayload.total) * 100);

  // Map method to Razorpay config
  const upiSelected = preferredMethod === 'upi';

  const options = {
    key: key,
    amount: amountInPaise,
    currency: 'INR',
    name: merchantName || 'Godavari Organic Foods',
    description: `Order #${orderPayload.id} - Traditional Harvest`,
    image: '/logo-circle.webp',
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || null,
          signature: response.razorpay_signature || null,
          method: upiSelected ? 'Razorpay (UPI / QR)' : 'Razorpay (Online)'
        });
      }
    },
    prefill: {
      name: orderPayload.customerName || '',
      email: orderPayload.customerEmail || '',
      contact: orderPayload.customerPhone || '',
      method: upiSelected ? 'upi' : (preferredMethod === 'card' ? 'card' : 'netbanking')
    },
    config: {
      display: {
        blocks: {
          upi: {
            name: 'Pay with UPI / QR Code',
            instruments: [
              {
                method: 'upi',
                flows: ['qr', 'intent', 'collect']
              }
            ]
          },
          other: {
            name: 'Cards & Net Banking',
            instruments: [
              { method: 'card' },
              { method: 'netbanking' }
            ]
          }
        },
        sequence: upiSelected ? ['block.upi', 'block.other'] : ['block.other', 'block.upi'],
        preferences: {
          show_default_blocks: true
        }
      }
    },
    notes: {
      orderId: orderPayload.id,
      deliveryCity: orderPayload.shippingAddress?.city || 'Rajahmundry',
      deliveryAddress: `${orderPayload.shippingAddress?.street || ''}, ${orderPayload.shippingAddress?.city || ''}`
    },
    theme: {
      color: '#18542a'
    },
    modal: {
      confirm_close: true,
      ondismiss: function () {
        if (onDismiss) onDismiss();
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response.error);
      if (onFailure) {
        onFailure(response.error.description || 'Payment was unsuccessful. Please retry.');
      }
    });

    // Directly open the official Razorpay gateway iframe
    rzp.open();
  } catch (err) {
    console.error('Error invoking Razorpay Checkout:', err);
    if (onFailure) onFailure(err.message || 'Error opening payment window');
  }
}
