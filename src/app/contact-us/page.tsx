import { Mail, MapPin, Phone } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { ContactForm } from '@/components/contact/contact-form';
import { company } from '@/data/company';
import { products } from '@/data/products';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata(
  'Contact us',
  'Talk to ZassTech about food delivery, healthcare appointments or commerce platforms. Contact our team in Pabbi, Nowshera, Pakistan.',
  '/contact-us',
);
export const dynamic = 'force-dynamic';
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const { interest } = await searchParams;
  const product = products.find((item) => item.name === interest);
  return (
    <>
      <PageIntro
        eyebrow="Contact us"
        title="Let’s make a little magic."
        description="Tell us what you’re looking to build or improve. We’ll be in touch to explore what’s possible."
        path="/contact-us"
      />
      <div className="container contact-layout">
        <aside className="contact-aside">
          <p className="eyebrow" style={{ color: 'var(--violet)', marginBottom: 16 }}>
            Get in touch
          </p>
          <h2>
            Good conversations
            <br />
            start here.
          </h2>
          <p>
            Whether you know exactly what you need or you’re still sketching it out, our team is
            happy to listen.
          </p>
          <a className="contact-detail" href={`mailto:${company.email}`}>
            <Mail size={23} />
            <span>
              <small>Send us an email</small>
              {company.email}
            </span>
          </a>
          <a className="contact-detail" href={`tel:${company.phone}`}>
            <Phone size={23} />
            <span>
              <small>Give us a call</small>
              {company.phone}
            </span>
          </a>
          <div className="contact-detail">
            <MapPin size={23} />
            <span>
              <small>Find our home base</small>
              {company.address}
            </span>
          </div>
          <div className="contact-note">
            Local roots. Big ideas. We are based in Pabbi, Nowshera, and ready to hear what you are
            building.
          </div>
        </aside>
        <ContactForm initialSubject={product ? `Enquiry about ${product.name}` : ''} />
      </div>
    </>
  );
}
