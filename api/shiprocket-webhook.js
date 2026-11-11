import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ 
      service: 'Godavari Organic Foods Shiprocket Webhook',
      status: 'Active',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const payload = req.body || {};
    console.log('[Shiprocket Webhook] Received payload:', JSON.stringify(payload));

    // Extract Order Reference from Shiprocket payload
    const rawOrderId = payload.channel_order_id || payload.order_id || payload.channel_order_id_raw || '';
    
    // Support formats like "GOF-123456" or "GOF-123456-9999"
    const orderParts = String(rawOrderId).trim().split('-');
    const cleanOrderId = orderParts.length >= 2 ? `${orderParts[0]}-${orderParts[1]}` : rawOrderId;

    const awb = payload.awb || payload.awb_code || '';
    const courier = payload.courier_name || payload.courier || 'Shiprocket Delivery Partner';
    const status = (payload.current_status || payload.shipment_status || '').toUpperCase();

    if (!cleanOrderId) {
      return res.status(200).json({ received: true, note: 'No matching order identifier found' });
    }

    // Map Shiprocket Status to Customer Store Status
    let mappedStatus = 'Shipped';
    if (status.includes('DELIVER') && !status.includes('OUT')) {
      mappedStatus = 'Delivered';
    } else if (status.includes('CANCEL')) {
      mappedStatus = 'Cancelled';
    } else if (status.includes('RTO')) {
      mappedStatus = 'RTO Initiated';
    } else if (status.includes('OUT')) {
      mappedStatus = 'Out for Delivery';
    } else if (status.includes('TRANSIT') || status.includes('PICK')) {
      mappedStatus = 'In Transit';
    }

    const orderRef = doc(db, 'orders', cleanOrderId);
    const snap = await getDoc(orderRef);

    if (snap.exists()) {
      const updates = {
        orderStatus: mappedStatus,
        shiprocketCourierName: courier,
        shiprocketCurrentStatus: status,
      };

      if (awb) {
        updates.shiprocketAwb = awb;
      }

      await updateDoc(orderRef, {
        ...updates,
        timeline: arrayUnion({
          status: `Shiprocket: ${status || mappedStatus}`,
          timestamp: new Date().toISOString(),
          note: `Courier update from ${courier}. AWB: ${awb || snap.data()?.shiprocketAwb || 'Processing'}`
        })
      });

      console.log(`[Shiprocket Webhook] Order #${cleanOrderId} updated to "${mappedStatus}" via ${courier}`);
    }

    return res.status(200).json({
      success: true,
      orderId: cleanOrderId,
      mappedStatus,
      status
    });
  } catch (err) {
    console.error('[Shiprocket Webhook Exception]:', err);
    // Always return HTTP 200 so Shiprocket webhook does not get blocked or spam retries
    return res.status(200).json({ success: false, error: err.message });
  }
}
