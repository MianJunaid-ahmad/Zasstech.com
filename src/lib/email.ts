import nodemailer from 'nodemailer';
import { z } from 'zod';
import type { ContactData } from './validations';

export function getMailConfiguration() {
  const config = z
    .object({
      host: z.string().min(1),
      port: z.coerce.number().int().min(1).max(65535),
      secure: z.enum(['true', 'false']),
      user: z.string().min(1),
      password: z.string().min(1),
      to: z.string().email(),
      from: z.string().email(),
    })
    .safeParse({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      to: process.env.CONTACT_TO_EMAIL,
      from: process.env.CONTACT_FROM_EMAIL,
    });
  if (!config.success) return null;
  if (config.data.port === 465 && config.data.secure !== 'true') return null;
  return config.data;
}
export async function sendContactEmail(data: ContactData): Promise<void> {
  const config = getMailConfiguration();
  if (!config) throw new Error('Mail configuration unavailable');
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure === 'true',
    requireTLS: config.secure !== 'true',
    auth: { user: config.user, pass: config.password },
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    await transport.sendMail({
      from: config.from,
      to: config.to,
      replyTo: { name: data.name, address: data.email },
      subject: `[ZassTech enquiry] ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nSubject: ${data.subject}\n\n${data.message}`,
    });
  } finally {
    transport.close();
  }
}
