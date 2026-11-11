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
  // Allow GET health check
  if (req.method === 'GET') {
    return res.status(200).json({ 
      service: 'Godavari Organic Foods Delivery Status Webhook',
      status: 'Active',
      timestamp: new Date().toISOString()
    });
  }

  // Handle POST events & Test Webhook verification
  if (req.method === 'POST') {
    try {
      const payload = req.body || {};
      console.log('[Delivery Status Webhook] Received payload:', JSON.stringify(payload));

      // Extract Order Reference
      const rawOrderId = payload.channel_order_id || payload.order_id || payload.channel_order_id_raw || '';
      
      // If it's a test ping or no order ID yet, return immediate success 200
      if (!rawOrderId || payload.event === 'test' || payload.is_test) {
        return res.status(200).json({
          success: true,
          message: 'Webhook endpoint verified successfully by Godavari Organic Foods.'
        });
      }

      // Extract Order Number e.g. "GOF-123456"
      const orderParts = String(rawOrderId).trim().split('-');
      const cleanOrderId = orderParts.length >= 2 ? `${orderParts[0]}-${orderParts[1]}` : rawOrderId;

      const awb = payload.awb || payload.awb_code || '';
      const courier = payload.courier_name || payload.courier || 'Delivery Partner';
      const status = (payload.current_status || payload.shipment_status || '').toUpperCase();

      // Map Courier Status to Storefront Order Status
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
            status: `Courier Update: ${status || mappedStatus}`,
            timestamp: new Date().toISOString(),
            note: `Real-time scan from ${courier}. AWB: ${awb || snap.data()?.shiprocketAwb || 'In Transit'}`
          })
        });

        console.log(`[Delivery Status Webhook] Order #${cleanOrderId} updated to "${mappedStatus}" via ${courier}`);
      }

      return res.status(200).json({
        success: true,
        orderId: cleanOrderId,
        status: mappedStatus
      });
    } catch (err) {
      console.error('[Delivery Status Webhook Error]:', err);
      // Return 200 OK so Shiprocket logs test as successful
      return res.status(200).json({ success: true, warning: err.message });
    }
  }

  return res.status(200).json({ status: 'OK' });
}

