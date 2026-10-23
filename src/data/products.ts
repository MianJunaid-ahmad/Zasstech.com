export interface Product {
  slug: string;
  name: string;
  category: string;
  description: string;
  image?: { src: string; alt: string; width: number; height: number };
  shortName: string;
  theme: 'food' | 'healthcare' | 'commerce';
  tagline: string;
  caption: string;
  features: readonly string[];
  sourceUrl: string;
}

// Verified from https://zasstech.com on 23 October 2026.
// The reference uses gradient illustrations, not product photography.
export const products: readonly Product[] = [
  {
    slug: 'zassfood',
    name: 'ZassFood',
    shortName: 'ZassFood',
    category: 'Food',
    theme: 'food',
    tagline: 'Food, made simple',
    caption: 'A little more joy at your table.',
    description:
      'A multi-vendor food delivery platform that brings hungry customers, local restaurants, and reliable delivery together.',
    features: ['Restaurant discovery', 'Delivery flow'],
    sourceUrl: 'https://zasstech.com/#zassfood',
  },
  {
    slug: 'healthcare',
    name: 'Healthcare platform',
    shortName: 'healthcare',
    category: 'Healthcare',
    theme: 'healthcare',
    tagline: 'Care, connected',
    caption: 'More time for better care.',
    description:
      'A digital appointment system that helps patients connect with providers through online booking and clinician-friendly tools.',
    features: ['Slot management', 'E-prescriptions'],
    sourceUrl: 'https://zasstech.com/#healthcare',
  },
  {
    slug: 'zassmarket',
    name: 'ZassMarket',
    shortName: 'ZassMarket',
    category: 'Commerce',
    theme: 'commerce',
    tagline: 'Commerce, unlocked',
    caption: 'Space for every storefront.',
    description:
      'A high-performance, multi-tenant marketplace that gives merchants the space and tools to build a thriving online business.',
    features: ['Multiple vendors', 'Built to scale'],
    sourceUrl: 'https://zasstech.com/#zassmarket',
  },
];
