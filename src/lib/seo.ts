import type { Metadata } from 'next';
import { company } from '@/data/company';

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
export const indexable = process.env.SITE_INDEXABLE === 'true';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: { absolute: `${title} | ${company.name}` },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${company.name}`,
      description,
      url: path,
      type: 'website',
      siteName: company.name,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'ZassTech — digital products with a human pulse',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${company.name}`,
      description,
      images: ['/opengraph-image'],
    },
  };
}
export function breadcrumbData(label: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: new URL('/', siteUrl).href },
      { '@type': 'ListItem', position: 2, name: label, item: new URL(path, siteUrl).href },
    ],
  };
}
