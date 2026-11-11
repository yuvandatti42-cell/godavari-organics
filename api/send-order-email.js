import nodemailer from 'nodemailer';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

// Helper to generate clean, responsive branded HTML email
function generateOrderEmailHtml(order) {
  const customerName = order.customerName || 'Valued Customer';
  const orderId = order.id || 'GOF-NEW';
  const items = order.items || [];
  const total = Number(order.total || 0).toLocaleString('en-IN');
  const subtotal = Number(order.subtotal || order.total || 0).toLocaleString('en-IN');
  const shippingFee = order.deliveryCharge ? `₹${order.deliveryCharge}` : 'FREE';
  const discount = order.discount ? `-₹${Number(order.discount).toLocaleString('en-IN')}` : null;
  const address = order.shippingAddress || {};
  const trackingUrl = `https://www.armafarms.com/#/track-order?id=${encodeURIComponent(orderId)}`;
  const orderDate = order.date ? new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today';

  const itemsHtml = items.map((item) => `
    <tr style="border-bottom: 1px solid #e6dec9;">
      <td style="padding: 12px 8px; vertical-align: middle;">
        <strong style="color: #103b1d; font-size: 13px; display: block;">${item.productName || item.name}</strong>
        <span style="color: #556b54; font-size: 11px;">Size: ${item.unit || '1 unit'} &bull; Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 8px; text-align: right; vertical-align: middle; font-weight: bold; color: #103b1d; font-size: 13px;">
        ₹${((item.unitPrice || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Godavari Organic Foods</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf5ea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1d271c;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #faf5ea; padding: 25px 15px;">
    <tr>
      <td align="center">
        <!-- Container Box -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; border: 1px solid #d9ca9d; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          
          <!-- Green Header Banner -->
          <tr>
            <td style="background-color: #18542a; padding: 30px 25px; text-align: center;">
              <h1 style="color: #ffc926; margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                GODAVARI ORGANICS
              </h1>
              <p style="color: #f3e8cc; margin: 0; font-size: 12px; font-weight: 500;">
                Pure Natural Andhra Farm Goodness
              </p>
            </td>
          </tr>

          <!-- Confirmation Body -->
          <tr>
            <td style="padding: 30px 25px;">
              <h2 style="color: #103b1d; margin: 0 0 10px 0; font-size: 20px; font-weight: 700;">
                Thank you for your order, ${customerName}!
              </h2>
              <p style="color: #556b54; margin: 0 0 20px 0; font-size: 13px; line-height: 1.6;">
                Your order of traditional Godavari harvest grains, cold-pressed oils, and spices has been received. Our farm team is carefully packing your package for express dispatch.
              </p>

              <!-- Order Summary Pill -->
              <table role="presentation" width="100%" style="background-color: #faf5ea; border-radius: 12px; border: 1px solid #dfd5bf; padding: 15px; margin-bottom: 25px;">
                <tr>
                  <td>
                    <span style="color: #8c7355; font-size: 11px; text-transform: uppercase; font-weight: bold; display: block;">Order Reference</span>
                    <strong style="color: #18542a; font-size: 16px; font-family: monospace;">#${orderId}</strong>
                  </td>
                  <td align="right">
                    <span style="color: #8c7355; font-size: 11px; text-transform: uppercase; font-weight: bold; display: block;">Order Date</span>
                    <strong style="color: #103b1d; font-size: 13px;">${orderDate}</strong>
                  </td>
                </tr>
              </table>

              <!-- Ordered Items Table -->
              <h3 style="color: #103b1d; margin: 0 0 10px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                Items in Your Box
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                ${itemsHtml}
              </table>

              <!-- Cost Summary Breakdown -->
              <table role="presentation" width="100%" style="border-top: 2px solid #e6dec9; padding-top: 12px; margin-bottom: 25px; font-size: 13px;">
                <tr>
                  <td style="color: #556b54; padding: 4px 0;">Subtotal</td>
                  <td style="color: #103b1d; font-weight: bold; text-align: right; padding: 4px 0;">₹${subtotal}</td>
                </tr>
                <tr>
                  <td style="color: #556b54; padding: 4px 0;">Delivery Charges</td>
                  <td style="color: #18542a; font-weight: bold; text-align: right; padding: 4px 0;">${shippingFee}</td>
                </tr>
                ${discount ? `
                <tr>
                  <td style="color: #556b54; padding: 4px 0;">Special Harvest Discount</td>
                  <td style="color: #18542a; font-weight: bold; text-align: right; padding: 4px 0;">${discount}</td>
                </tr>` : ''}
                <tr>
                  <td style="color: #103b1d; font-size: 15px; font-weight: 800; padding: 8px 0; border-top: 1px solid #e6dec9;">Total Amount</td>
                  <td style="color: #18542a; font-size: 16px; font-weight: 800; text-align: right; padding: 8px 0; border-top: 1px solid #e6dec9;">₹${total}</td>
                </tr>
              </table>

              <!-- Delivery Address Box -->
              <table role="presentation" width="100%" style="background-color: #f3e8cc; border-radius: 12px; border: 1px solid #d9ca9d; padding: 15px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <strong style="color: #18542a; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">
                      📍 Delivering To:
                    </strong>
                    <p style="color: #103b1d; margin: 0; font-size: 12px; line-height: 1.5;">
                      <strong>${customerName}</strong><br>
                      ${address.street || address.address || ''}<br>
                      ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}<br>
                      Phone: ${order.customerPhone || ''}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Track Order CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                <tr>
                  <td align="center">
                    <a href="${trackingUrl}" target="_blank" style="background-color: #18542a; color: #ffc926; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 12px; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(24,84,42,0.25);">
                      🚚 Track Your Package Live
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #8c7355; font-size: 11px; text-align: center; margin: 0; line-height: 1.5;">
                You can track your package directly at anytime by clicking the button above or visiting <a href="${trackingUrl}" style="color: #18542a; text-decoration: underline;">armafarms.com/#/track-order</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3e8cc; padding: 20px 25px; text-align: center; border-top: 1px solid #d9ca9d; font-size: 11px; color: #556b54;">
              <p style="margin: 0 0 6px 0; font-weight: bold; color: #103b1d;">
                Godavari Organic Foods &bull; Rajahmundry & Eluru, Andhra Pradesh
              </p>
              <p style="margin: 0 0 6px 0;">
                Have questions? Call or WhatsApp us at <strong>+91 90100 88063</strong> or reply to <strong>godhavariorganicfoods@gmail.com</strong>
              </p>
              <p style="margin: 0; font-size: 10px; color: #8c7355;">
                &copy; ${new Date().getFullYear()} Godavari Organic Foods. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export default async function handler(req, res) {
  // CORS Headers for storefront and admin panel requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'Order Email Service Active' });
  }

  try {
    const payload = req.body || {};
    const isTest = Boolean(payload.test);
    const recipientEmail = isTest 
      ? (payload.recipient || payload.customerEmail || 'godhavariorganicfoods@gmail.com')
      : payload.customerEmail;

    if (!recipientEmail || !recipientEmail.includes('@') || (!isTest && recipientEmail.includes('@customer.godavariorganics.com'))) {
      return res.status(200).json({ skipped: true, reason: 'No valid recipient email address provided.' });
    }

    // 1. Retrieve Gmail Credentials (direct param -> environment variable -> Firestore settings)
    let gmailUser = payload.gmailUser || process.env.GMAIL_USER || 'godhavariorganicfoods@gmail.com';
    let gmailPass = payload.gmailAppPassword || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;

    // Check Firestore settings if not in payload or environment variables
    if (!gmailPass) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists() && snap.data()?.emailConfig) {
          const cfg = snap.data().emailConfig;
          gmailUser = cfg.gmailUser || gmailUser;
          gmailPass = cfg.gmailAppPassword || gmailPass;
        }
      } catch (fErr) {
        console.warn('Could not read email config from Firestore:', fErr);
      }
    }

    if (!gmailPass) {
      console.warn('[Order Email] Gmail App Password not configured yet. Skipping email delivery.');
      return res.status(200).json({
        skipped: true,
        reason: 'Gmail App Password is not yet set in environment variables or Firestore settings.'
      });
    }

    // 2. Configure Nodemailer Transporter
    const cleanPass = gmailPass.replace(/\s+/g, ''); // remove spaces from 16-character code
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser.trim(),
        pass: cleanPass
      }
    });

    let mailSubject = '';
    let mailHtml = '';

    if (isTest) {
      mailSubject = '🌾 Test Email: Godavari Organic Foods Email Service Active!';
      mailHtml = `
        <div style="font-family: sans-serif; background: #faf5ea; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #d9ca9d;">
          <h2 style="color: #18542a; margin-top: 0;">🌾 Connection Successful!</h2>
          <p style="color: #103b1d; font-size: 14px; line-height: 1.6;">
            Your Gmail SMTP service is connected and ready to send automated order confirmation emails from <strong>${gmailUser}</strong> to your customers.
          </p>
          <div style="background: #ffffff; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #18542a; margin: 15px 0;">
            <p style="margin: 0; font-size: 13px; color: #556b54;">
              Sender: <strong>${gmailUser}</strong><br>
              Status: <strong>Active & Verified</strong><br>
              Delivered At: <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</strong>
            </p>
          </div>
          <p style="font-size: 11px; color: #8c7355; margin-bottom: 0;">
            Godavari Organic Foods &bull; armafarms.com
          </p>
        </div>
      `;
    } else {
      mailSubject = `Order Confirmed: #${payload.id} - Your Organic Harvest is on its way! 🌾`;
      mailHtml = generateOrderEmailHtml(payload);
    }

    // 3. Send the Email
    const info = await transporter.sendMail({
      from: `"Godavari Organic Foods" <${gmailUser.trim()}>`,
      to: recipientEmail.trim(),
      subject: mailSubject,
      html: mailHtml
    });

    console.log('[Order Email] Sent successfully to:', recipientEmail, 'MessageId:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      recipient: recipientEmail
    });
  } catch (err) {
    console.error('[Order Email Error]:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || 'Failed to send email. Verify your Gmail App Password and 2-step verification.' 
    });
  }
}
