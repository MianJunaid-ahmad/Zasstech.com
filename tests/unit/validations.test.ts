import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/validations';
import { cn } from '@/lib/utils';
export const validContact = {
  name: 'Test Person',
  email: 'person@example.com',
  subject: 'Product enquiry',
  message: 'I would like to discuss your product.',
};
describe('contact validation', () => {
  it('accepts valid input and defaults optional values', () => {
    expect(contactSchema.parse(validContact)).toMatchObject({ phone: '', website: '' });
  });
  it.each([
    { email: 'bad-address' },
    { name: 'A' },
    { subject: 'Hello\r\nBcc: victim@example.com' },
    { email: 'person@example.com\r\nBcc: test@example.com' },
    { message: 'short' },
    { message: 'x'.repeat(2001) },
    { phone: '<script>' },
    { name: 'John\u0000' },
  ])('rejects invalid or unsafe fields %j', (fields) => {
    expect(contactSchema.safeParse({ ...validContact, ...fields }).success).toBe(false);
  });
  it('rejects unexpected fields', () => {
    expect(contactSchema.safeParse({ ...validContact, to: 'elsewhere@example.com' }).success).toBe(
      false,
    );
  });
  it('allows Unicode names and multiline messages', () => {
    expect(
      contactSchema.safeParse({
        ...validContact,
        name: 'علی احمد',
        message: 'A project enquiry.\nPlease tell me more.',
      }).success,
    ).toBe(true);
  });
});
it('merges conditional Tailwind classes', () => {
  expect(cn('px-2', false && 'hidden', 'px-4')).toBe('px-4');
});
