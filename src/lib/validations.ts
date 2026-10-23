import { z } from 'zod';
const headerText = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} must contain at least ${min} characters.`)
    .max(max, `${label} is too long.`)
    .refine((value) => !/[\r\n\x00-\x1f\x7f]/.test(value), `${label} contains invalid characters.`);
export const contactSchema = z
  .object({
    name: headerText(2, 100, 'Name'),
    email: z
      .string()
      .trim()
      .max(254)
      .email('Enter a valid email address.')
      .refine((value) => !/[\r\n\x00]/.test(value), 'Invalid email address.'),
    phone: z
      .string()
      .trim()
      .max(40)
      .regex(/^[+\d\s().-]*$/, 'Enter a valid phone number.')
      .optional()
      .default(''),
    subject: headerText(3, 120, 'Subject'),
    message: z
      .string()
      .trim()
      .min(10, 'Please enter at least 10 characters.')
      .max(2000, 'Please use 2,000 characters or fewer.')
      .refine(
        (value) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value),
        'Message contains invalid characters.',
      ),
    website: z.string().max(200).optional().default(''),
  })
  .strict();
export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
