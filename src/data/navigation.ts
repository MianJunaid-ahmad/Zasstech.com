export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about-us', label: 'About us' },
  { href: '/contact-us', label: 'Contact us' },
] as const;
export const legalNavigation = [
  { href: '/terms-and-conditions', label: 'Terms & conditions' },
  { href: '/privacy-policy', label: 'Privacy policy' },
] as const;
export const allNavigation = [...navigation, ...legalNavigation];
