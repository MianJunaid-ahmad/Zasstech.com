import type { MetadataRoute } from 'next';
import { allNavigation } from '@/data/navigation';
import { siteUrl } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  return allNavigation.map((item) => ({
    url: new URL(item.href, siteUrl).href,
    changeFrequency: 'monthly',
    priority: item.href === '/' ? 1 : 0.7,
  }));
}
