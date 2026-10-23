import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JsonLd } from '@/components/json-ld';
import { company, reviewNotice } from '@/data/company';
import { indexable, siteUrl } from '@/lib/seo';
import './globals.css';

const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: 'ZassTech', template: '%s | ZassTech' },
  description: 'Explore ZassTech, discover product information and get in touch.',
  robots: { index: indexable, follow: indexable },
  icons: { icon: '/logos/icon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="preview-notice">{reviewNotice}</div>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: company.name,
            url: company.url,
            email: company.email,
            telephone: company.phone,
            address: company.address,
          }}
        />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: company.name,
            url: siteUrl.href,
          }}
        />
      </body>
    </html>
  );
}
