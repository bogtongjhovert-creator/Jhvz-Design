export interface EmailNotificationPayload {
  type: 'Message' | 'Booking';
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  serviceType?: string;
  details: string;
  budget?: string;
  targetDate?: string;
}

export const TARGET_EMAIL = 'jhovzdesign@gmail.com';

export async function sendEmailNotification(payload: EmailNotificationPayload) {
  // 1. Post to backend API endpoint /api/notify-email
  try {
    await fetch('/api/notify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        recipient: TARGET_EMAIL
      })
    });
  } catch (err) {
    console.error('Backend email notification log failed:', err);
  }

  // 2. Generate mailto URL to directly notify jhovzdesign@gmail.com
  const subjectText = payload.type === 'Booking'
    ? `[JHVZ DESIGN BOOKING] ${payload.serviceType || 'Design Service'} - From ${payload.name}`
    : `[JHVZ DESIGN MESSAGE] ${payload.subject || 'Inquiry'} - From ${payload.name}`;

  const bodyLines = [
    `Hello JHVZ DESIGN,`,
    ``,
    `You have received a new ${payload.type.toLowerCase()} submission from your portfolio website:`,
    ``,
    `--------------------------------------------------`,
    `Client Name: ${payload.name}`,
    `Client Email: ${payload.email}`,
    payload.phone ? `Phone / Telegram: ${payload.phone}` : null,
    payload.serviceType ? `Service Requested: ${payload.serviceType}` : null,
    payload.budget ? `Budget Range: ${payload.budget}` : null,
    payload.targetDate ? `Target Date: ${payload.targetDate}` : null,
    `--------------------------------------------------`,
    ``,
    `Message / Project Details:`,
    payload.details,
    ``,
    `--------------------------------------------------`,
    `Submitted at: ${new Date().toLocaleString()}`
  ].filter(line => line !== null).join('\n');

  const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyLines)}`;

  return {
    mailtoUrl,
    triggerMailto: () => {
      try {
        window.open(mailtoUrl, '_blank');
      } catch (e) {
        window.location.href = mailtoUrl;
      }
    }
  };
}
