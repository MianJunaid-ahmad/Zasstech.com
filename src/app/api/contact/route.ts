import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { getMailConfiguration, sendContactEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (body: object, status: number, headers?: Record<string, string>) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

async function readBody(request: Request): Promise<string> {
  if (Number(request.headers.get('content-length')) > 16384) throw new Error('Body too large');
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0,
    text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        throw new Error('Body too large');
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}
export async function POST(request: Request) {
  const expectedOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    .origin;
  if (request.headers.get('origin') !== expectedOrigin)
    return json({ error: 'Please send your enquiry from this website.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return json({ error: 'Unsupported request format.' }, 415);
  try {
    // The reverse proxy must overwrite X-Real-IP; never expose the Node port publicly.
    const rate = await checkRateLimit(request.headers.get('x-real-ip') || 'unknown');
    if (!rate.allowed)
      return json({ error: 'Too many enquiries. Please try again later.' }, 429, {
        'Retry-After': String(rate.retryAfter),
      });
  } catch {
    return json(
      { error: 'Enquiries are temporarily unavailable. Please contact us by email.' },
      503,
    );
  }
  let raw: unknown;
  try {
    raw = JSON.parse(await readBody(request));
  } catch {
    return json({ error: 'Invalid or oversized enquiry.' }, 400);
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success)
    return json(
      { error: 'Please check the form fields.', fields: parsed.error.flatten().fieldErrors },
      400,
    );
  if (parsed.data.website) return json({ success: true }, 200);
  if (!getMailConfiguration())
    return json(
      { error: 'The contact form is temporarily unavailable. Please use our email address.' },
      503,
    );
  try {
    await sendContactEmail(parsed.data);
    return json({ success: true }, 200);
  } catch {
    // Do not log submitted content, credentials or SMTP errors containing personal data.
    console.error('Contact email delivery failed');
    return json(
      { error: 'Your message could not be sent. Please try again or contact us by email.' },
      502,
    );
  }
}
