import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { ContactForm } from '@/components/contact/contact-form';
afterEach(() => vi.unstubAllGlobals());
it('shows accessible validation errors without sending', async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  render(<ContactForm />);
  await userEvent.click(screen.getByRole('button', { name: /Send your message/ }));
  expect(await screen.findByText('Enter a valid email address.')).toBeVisible();
  expect(screen.getByLabelText('Email address *')).toHaveAttribute('aria-invalid', 'true');
  expect(fetchMock).not.toHaveBeenCalled();
});
it('submits valid input and reports success', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
  vi.stubGlobal('fetch', fetchMock);
  const user = userEvent.setup();
  render(<ContactForm initialSubject="ZassFood enquiry" />);
  await user.type(screen.getByLabelText('Full name *'), 'Test Person');
  await user.type(screen.getByLabelText('Email address *'), 'person@example.com');
  await user.type(
    screen.getByLabelText('Tell us a little more *'),
    'Please tell me about your platform.',
  );
  await user.click(screen.getByRole('button', { name: /Send your message/ }));
  await waitFor(() => expect(screen.getByText(/Your message has been sent/)).toBeVisible());
  expect(fetchMock).toHaveBeenCalledOnce();
});
it('preserves the message on a delivery failure', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Mail is temporarily unavailable.' }),
    }),
  );
  const user = userEvent.setup();
  render(<ContactForm initialSubject="Product enquiry" />);
  await user.type(screen.getByLabelText('Full name *'), 'Test Person');
  await user.type(screen.getByLabelText('Email address *'), 'person@example.com');
  await user.type(
    screen.getByLabelText('Tell us a little more *'),
    'Please tell me about your platform.',
  );
  await user.click(screen.getByRole('button', { name: /Send your message/ }));
  await waitFor(() => expect(screen.getByText('Mail is temporarily unavailable.')).toBeVisible());
  expect(screen.getByLabelText('Tell us a little more *')).toHaveValue(
    'Please tell me about your platform.',
  );
});
