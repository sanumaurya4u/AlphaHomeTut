import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const AUTO_REPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Send contact form data via EmailJS (notifies you) and
 * sends an auto-reply to the user's email.
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

  // Send notification email to you
  const notifyPromise = emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

  // Send auto-reply to the user (only if they provided an email and template is configured)
  const autoReplyPromise =
    email && AUTO_REPLY_TEMPLATE_ID
      ? emailjs.send(SERVICE_ID, AUTO_REPLY_TEMPLATE_ID, templateParams, PUBLIC_KEY)
      : Promise.resolve(null);

  const [notifyResponse, autoReplyResponse] = await Promise.all([
    notifyPromise,
    autoReplyPromise.catch((err) => {
      console.error('Auto-reply email failed:', err);
      return null;
    }),
  ]);

  return { notifyResponse, autoReplyResponse };
}
