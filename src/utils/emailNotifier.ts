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
  designProofUrl?: string;
}

export const TARGET_EMAIL = 'jhovzdesign@gmail.com';

export async function sendEmailNotification(payload: EmailNotificationPayload): Promise<boolean> {
  try {
    const res = await fetch('/api/notify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        recipient: TARGET_EMAIL
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Backend email notification dispatch failed:', err);
    return false;
  }
}

