import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS with the public key (required in v4+)
emailjs.init({ publicKey: PUBLIC_KEY });

/**
 * Send contact form notification email via EmailJS.
 *
 * This sends ONE email — the notification to the admin.
 * The auto-reply to the user is handled by EmailJS's built-in
 * "Auto-Reply" feature configured on the template in the dashboard.
 *
 * Template variables: from_name, from_email, phone, message
 */
export async function sendContactEmail({ name, email, phone, message }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('EmailJS credentials missing. Please check your .env configuration.');
  }

  const templateParams = {
    from_name: name,
    from_email: email || 'Not provided',
    phone: phone || 'Not provided',
    message,
  };

  // Send only the notification email to admin
  const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  return response;
}
