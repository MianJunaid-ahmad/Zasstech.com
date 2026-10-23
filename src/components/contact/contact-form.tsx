'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';
import { contactSchema, type ContactInput, type ContactData } from '@/lib/validations';
import { Button } from '@/components/ui/button';

export function ContactForm({ initialSubject = '' }: { initialSubject?: string }) {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const reduceMotion = useReducedMotion();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: initialSubject,
      message: '',
      website: '',
    },
  });
  const submit = async (data: ContactData) => {
    setStatus(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.fields)
          for (const name of ['name', 'email', 'phone', 'subject', 'message'] as const)
            if (result.fields[name]?.[0]) setError(name, { message: result.fields[name][0] });
        throw new Error(result.error || 'Please try again later.');
      }
      if (!result.success) throw new Error('Please try again later.');
      setStatus({ type: 'success', message: 'Thank you. Your message has been sent to ZassTech.' });
      reset();
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error && error.name !== 'TimeoutError'
            ? error.message
            : 'Your message could not be sent. Please try again or contact us by email.',
      });
    }
  };
  return (
    <form
      className="contact-form"
      id="contact-form"
      noValidate
      onSubmit={handleSubmit(submit)}
      aria-busy={isSubmitting}
    >
      <p className="eyebrow" style={{ color: 'var(--violet)', marginBottom: 12 }}>
        The first hello
      </p>
      <h2 style={{ fontSize: 28, marginBottom: 10 }}>What’s on your mind?</h2>
      <p className="form-help">Fields marked * are required.</p>
      <div role="status" aria-live="polite" aria-atomic="true">
        <AnimatePresence>
          {status && (
            <motion.div
              key={status.message}
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`form-status ${status.type === 'error' ? 'error' : ''}`}
            >
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="form-grid">
        {(['name', 'email', 'phone', 'subject'] as const).map((name) => (
          <div className={`form-field ${name === 'subject' ? 'full' : ''}`} key={name}>
            <label htmlFor={name}>
              {
                {
                  name: 'Full name *',
                  email: 'Email address *',
                  phone: 'Phone number',
                  subject: 'Subject *',
                }[name]
              }{' '}
              {name === 'phone' && <span>(optional)</span>}
            </label>
            <input
              id={name}
              type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
              autoComplete={name === 'subject' ? 'off' : name === 'phone' ? 'tel' : name}
              maxLength={
                name === 'email' ? 254 : name === 'phone' ? 40 : name === 'subject' ? 120 : 100
              }
              required={name !== 'phone'}
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
              {...register(name)}
            />
            {errors[name] && (
              <p className="field-error" id={`${name}-error`}>
                {errors[name]?.message}
              </p>
            )}
          </div>
        ))}
        <div className="form-field full">
          <label htmlFor="message">Tell us a little more *</label>
          <textarea
            id="message"
            rows={5}
            maxLength={2000}
            required
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error message-help' : 'message-help'}
            {...register('message')}
          />
          <p id="message-help" className="form-help" style={{ marginBlock: 6 }}>
            10–2,000 characters. Please don’t include medical records, passwords or payment details.
          </p>
          {errors.message && (
            <p className="field-error" id="message-error">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>
      <p className="form-help">
        Read our <Link href="/privacy-policy">privacy policy</Link> for information about enquiry
        handling.
      </p>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send your message <ArrowUpRight size={16} />
          </>
        )}
      </Button>
      <noscript>
        <p className="form-help">
          Please enable JavaScript to use this form, or contact ZassTech using the email address on
          this page.
        </p>
      </noscript>
    </form>
  );
}
