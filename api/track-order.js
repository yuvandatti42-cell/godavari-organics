import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

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

const SHIPROCKET_CONFIG = {
  BASE_URL: 'https://apiv2.shiprocket.in/v1/external',
  EMAIL: 'api@armafarms.com',
  PASSWORD: '7FyvlanWBRvoQRGltSU3@9yk$NSPSj28'
};

async function getShiprocketToken() {
  const res = await fetch(`${SHIPROCKET_CONFIG.BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: SHIPROCKET_CONFIG.EMAIL, password: SHIPROCKET_CONFIG.PASSWORD })
  });
  if (!res.ok) throw new Error('Shiprocket auth failed');
  const data = await res.json();
  return data.token;
}

export default async function handler(req, res) {
  const searchQuery = req.query.q || req.query.orderId || req.query.awb || '';
  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query (q, orderId, or awb) is required.' });
  }

  try {
    const qStr = String(searchQuery).trim();
    let order = null;

    // 1. Direct document search
    try {
      const snap = await getDoc(doc(db, 'orders', qStr));
      if (snap.exists()) order = { id: snap.id, ...snap.data() };
    } catch (e) {}

    // Variations
    if (!order) {
      const variations = [
        qStr.toUpperCase(),
        qStr.startsWith('GOF-') ? qStr.toUpperCase() : `GOF-${qStr.toUpperCase()}`,
        qStr.replace(/^GOF-/i, '')
      ];
      for (const v of variations) {
        try {
          const snap = await getDoc(doc(db, 'orders', v));
          if (snap.exists()) {
            order = { id: snap.id, ...snap.data() };
            break;
          }
        } catch (e) {}
      }
    }

    // By AWB
    if (!order) {
      try {
        const awbSnap = await getDocs(query(collection(db, 'orders'), where('shiprocketAwb', '==', qStr), limit(1)));
        if (!awbSnap.empty) {
          order = { id: awbSnap.docs[0].id, ...awbSnap.docs[0].data() };
        }
      } catch (e) {}
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found. Please verify your Order ID or AWB.' });
    }

    // 2. Fetch live Shiprocket scans if available
    let liveTracking = null;
    const awb = order.shiprocketAwb;
    const srOrderId = order.shiprocketOrderId;

    if (awb || srOrderId) {
      try {
        const token = await getShiprocketToken();
        const url = awb 
          ? `${SHIPROCKET_CONFIG.BASE_URL}/courier/track/awb/${encodeURIComponent(awb)}`
          : `${SHIPROCKET_CONFIG.BASE_URL}/courier/track?order_id=${encodeURIComponent(order.id)}`;

        const srRes = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (srRes.ok) {
          const srData = await srRes.json();
          liveTracking = srData;
        }
      } catch (srErr) {
        console.warn('Shiprocket tracking query notice:', srErr);
      }
    }

    return res.status(200).json({
      success: true,
      order,
      liveTracking
    });
  } catch (err) {
    console.error('[Track Order API Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal tracking error' });
  }
}
