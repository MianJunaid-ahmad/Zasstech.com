// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
const sendMail = vi.hoisted(() => vi.fn().mockResolvedValue({}));
const close = vi.hoisted(() => vi.fn());
const createTransport = vi.hoisted(() => vi.fn(() => ({ sendMail, close })));
vi.mock('nodemailer', () => ({ default: { createTransport } }));
import { getMailConfiguration, sendContactEmail } from '@/lib/email';
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});
function configure() {
  for (const [key, value] of Object.entries({
    SMTP_HOST: 'smtp.example.com',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: 'user',
    SMTP_PASSWORD: 'test-only',
    CONTACT_TO_EMAIL: 'to@example.com',
    CONTACT_FROM_EMAIL: 'from@example.com',
  }))
    vi.stubEnv(key, value);
}
it('requires complete mail configuration', () => {
  vi.stubEnv('SMTP_HOST', '');
  expect(getMailConfiguration()).toBeNull();
});
it('sends through a TLS transport with fixed recipients and validated reply-to', async () => {
  configure();
  await sendContactEmail({
    name: 'Test Person',
    email: 'person@example.com',
    phone: '',
    subject: 'Product enquiry',
    message: 'Please tell me about it.',
    website: '',
  });
  expect(createTransport).toHaveBeenCalledWith(
    expect.objectContaining({ requireTLS: true, disableFileAccess: true, disableUrlAccess: true }),
  );
  expect(sendMail).toHaveBeenCalledWith(
    expect.objectContaining({
      from: 'from@example.com',
      to: 'to@example.com',
      replyTo: { name: 'Test Person', address: 'person@example.com' },
    }),
  );
  expect(close).toHaveBeenCalledOnce();
});
