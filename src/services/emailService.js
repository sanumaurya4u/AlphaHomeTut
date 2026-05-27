import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Send contact form data via EmailJS.
 * Template variables: from_name, from_email, phone, message
 */
export async function sendContactEmail({ name, email, phone, message }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS credentials missing – skipping email notification.');
    return null;
  }

  const templateParams = {
    from_name: name,
    from_email: email || 'Not provided',
    phone: phone || 'Not provided',
    message,
  };

  const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
  return response;
}
