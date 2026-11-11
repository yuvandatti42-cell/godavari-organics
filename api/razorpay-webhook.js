import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { createShiprocketOrder } from '../src/services/shiprocketService.js';

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
      service: 'Godavari Organic Foods Razorpay Webhook',
      status: 'Active',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const body = req.body || {};
    const event = body.event;
    console.log('[Razorpay Webhook] Event received:', event);

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = body.payload?.payment?.entity || {};
      const notes = payment.notes || {};
      
      const orderId = notes.orderId || notes.order_id || notes.id || '';
      const paymentId = payment.id || '';
      const method = payment.method || 'online';
      const amount = payment.amount ? payment.amount / 100 : 0;

      console.log(`[Razorpay Webhook] Payment Captured for Order: ${orderId}, Payment ID: ${paymentId}, Amount: ₹${amount}`);

      if (orderId) {
        const orderRef = doc(db, 'orders', orderId);
        const snap = await getDoc(orderRef);

        if (snap.exists()) {
          const currentOrder = snap.data();
          const updates = {
            paymentStatus: 'Paid',
            paymentId: paymentId,
            paymentMethod: `Razorpay (${method.toUpperCase()})`,
            timeline: arrayUnion({
              status: 'Payment Captured (Razorpay Webhook)',
              timestamp: new Date().toISOString(),
              note: `Automated server verification: ₹${amount} received via ${method.toUpperCase()} (ID: ${paymentId})`
            })
          };

          // If not already synced to Shiprocket, sync it now
          if (!currentOrder.shiprocketOrderId) {
            try {
              const fullOrder = { ...currentOrder, id: orderId, ...updates };
              const srCreated = await createShiprocketOrder(fullOrder);
              if (srCreated?.order_id) {
                updates.shiprocketOrderId = srCreated.order_id;
                updates.shiprocketShipmentId = srCreated.shipment_id;
                updates.shiprocketStatus = srCreated.status || 'NEW';
              }
            } catch (srErr) {
              console.warn('[Razorpay Webhook] Shiprocket auto-dispatch notice:', srErr);
            }
          }

          await updateDoc(orderRef, updates);
          console.log(`[Razorpay Webhook] Order #${orderId} verified and updated in Firestore.`);
        }
      }
    } else if (event === 'payment.failed') {
      const payment = body.payload?.payment?.entity || {};
      const orderId = payment.notes?.orderId;
      if (orderId) {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
          timeline: arrayUnion({
            status: 'Payment Failed',
            timestamp: new Date().toISOString(),
            note: `Payment attempt failed via ${payment.method || 'Razorpay'}: ${payment.error_description || 'Payment error'}`
          })
        }).catch(() => {});
      }
    }

    // Always respond with 200 OK so Razorpay marks webhook delivered
    return res.status(200).json({ status: 'ok', received: true });
  } catch (err) {
    console.error('[Razorpay Webhook Exception]:', err);
    return res.status(200).json({ status: 'error', message: err.message });
  }
}

