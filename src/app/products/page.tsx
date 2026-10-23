import { PageIntro } from '@/components/page-intro';
import { ProductCard } from '@/components/products/product-card';
import { ContactCta } from '@/components/contact-cta';
import { products } from '@/data/products';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata(
  'Our products',
  'Discover ZassFood, the ZassTech Healthcare platform and ZassMarket: digital platforms for food delivery, appointments and commerce.',
  '/products',
);
export const revalidate = 3600;
export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our products"
        title="Three big ideas. Built to work."
        description="Useful technology begins with real people. Explore the ZassTech platforms for food, healthcare and commerce."
        path="/products"
      />
      <section className="section section-grid">
        <div className="container">
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <p className="catalogue-note">
            Product descriptions reflect the public ZassTech website. Availability and enabled
            features depend on the deployment. Contact us to discuss your requirements.
          </p>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
