const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

/**
 * Dynamically load the Razorpay checkout script if not already loaded.
 * @returns {Promise<void>}
 */
export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window.Razorpay !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

/**
 * Create a Razorpay order by calling the Supabase Edge Function.
 * @param {number} amount - Amount in paise (e.g. 49900 for ₹499)
 * @param {string} currency - Currency code (default: INR)
 * @param {string} receipt - Receipt ID for your records
 * @returns {Promise<{ order_id: string, amount: number, currency: string, key_id: string }>}
 */
export async function createRazorpayOrder(amount, currency = 'INR', receipt = '') {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/razorpay-create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create order');
  }

  return data;
}

/**
 * Verify a Razorpay payment by calling the Supabase Edge Function.
 * @param {string} razorpay_payment_id
 * @param {string} razorpay_order_id
 * @param {string} razorpay_signature
 * @returns {Promise<{ verified: boolean }>}
 */
export async function verifyRazorpayPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/razorpay-verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Payment verification failed');
  }

  return data;
}

/**
 * Open the Razorpay checkout modal.
 * Returns a promise that resolves with payment details on success,
 * or rejects on cancel/failure.
 *
 * @param {Object} options
 * @param {string} options.order_id - Razorpay order ID
 * @param {number} options.amount - Amount in paise
 * @param {string} options.currency - Currency code
 * @param {string} [options.name] - Business name shown in modal
 * @param {string} [options.description] - Payment description
 * @param {string} [options.image] - Logo URL
 * @param {Object} [options.prefill] - { name, email, contact }
 * @param {Object} [options.theme] - { color }
 * @returns {Promise<{ razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string }>}
 */
export function openRazorpayCheckout({
  order_id,
  amount,
  currency = 'INR',
  name = 'Alpha Home Tuition',
  description = 'Membership Plan Payment',
  image = '',
  prefill = {},
  theme = { color: '#061B45' },
}) {
  return new Promise((resolve, reject) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount,
      currency,
      name,
      description,
      image,
      order_id,
      prefill,
      theme,
      handler: function (response) {
        // Called on successful payment
        resolve({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled by user'));
        },
        escape: true,
        confirm_close: true,
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      reject(
        new Error(
          response.error?.description ||
            response.error?.reason ||
            'Payment failed'
        )
      );
    });

    rzp.open();
  });
}
