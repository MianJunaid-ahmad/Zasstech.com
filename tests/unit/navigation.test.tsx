import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
vi.mock('next/navigation', () => ({ usePathname: () => '/products' }));
import { Header } from '@/components/layout/header';
describe('navigation', () => {
  it('marks the current route and exposes all six destinations', () => {
    render(<Header />);
    expect(screen.getAllByRole('link', { name: 'Products' })[0]).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      screen.getAllByRole('link', { name: 'Privacy policy', hidden: true })[0],
    ).toHaveAttribute('href', '/privacy-policy');
  });
  it('supports mobile toggle and Escape focus restoration', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });
});
