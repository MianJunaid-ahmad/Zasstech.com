import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  Cross,
  Layers,
  MousePointer2,
  ShoppingBag,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { ContactCta } from '@/components/contact-cta';
import { products } from '@/data/products';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Digital products with a human pulse',
  'ZassTech builds useful digital platforms for food, healthcare and commerce. Explore ZassFood, our healthcare platform and ZassMarket.',
  '/',
);
export const revalidate = 3600;
const icons = [Utensils, Cross, ShoppingBag];
export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">
              <span />
              Ideas into everyday impact
            </p>
            <h1>
              We make digital
              <br />
              work <em>feel human.</em>
            </h1>
            <p className="hero-description">
              Meet ZassTech. We build the platforms that bring good food closer, make care easier to
              reach, and help commerce move at full speed.
            </p>
            <div className="hero-actions">
              <Button asChild variant="light">
                <Link href="/products">
                  Explore our products <ArrowDown size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact-us">
                  Start a conversation <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>
            <div className="hero-bottom">
              <div className="industry-icons">
                {icons.map((Icon, i) => (
                  <span key={i}>
                    <Icon size={13} />
                  </span>
                ))}
              </div>
              <span>One team. Three connected industries.</span>
            </div>
          </div>
          <div className="universe">
            <span className="spark" aria-hidden="true">
              <Sparkles size={25} />
            </span>
            <div className="universe-top">
              <strong>Product universe</strong>
              <span>01 — 03</span>
            </div>
            {products.map((product, i) => {
              const Icon = icons[i];
              return (
                <Link
                  href={`/products#${product.slug}`}
                  className="universe-item"
                  key={product.slug}
                >
                  <span className="product-icon">
                    <Icon size={22} />
                  </span>
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.caption}</small>
                  </span>
                  <ArrowUpRight size={18} />
                </Link>
              );
            })}
            <div className="universe-bottom">
              <span>Designed for the real world</span>
              <span>✦ &nbsp; ZassTech</span>
            </div>
          </div>
        </div>
        <div className="sector-strip">
          <div className="container">
            <span>THOUGHTFUL PRODUCTS. EVERYDAY IMPACT.</span>
            <strong>
              <Utensils size={15} />
              Food & delivery
            </strong>
            <strong>
              <Cross size={15} />
              Connected healthcare
            </strong>
            <strong>
              <ShoppingBag size={15} />
              Digital commerce
            </strong>
          </div>
        </div>
      </section>
      <section className="section section-grid">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">01 / Made for what matters</p>
              <h2>
                Three big ideas.
                <br />
                <span className="accent">Built to work.</span>
              </h2>
            </div>
            <p>
              Useful technology begins with real people. Each ZassTech product is shaped around
              everyday moments it can make better.
            </p>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.slug} />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container about-grid">
          <div className="point-of-view">
            <span>OUR POINT OF VIEW &nbsp; ↗</span>
            <p className="quote">
              Good tech
              <br />
              makes room
              <br />
              <em>for people.</em>
            </p>
            <div className="line" />
            <small>Thoughtfully engineered. Always evolving.</small>
          </div>
          <div className="about-copy">
            <p className="eyebrow">02 / A little about us</p>
            <h2>
              We’re here for
              <br />
              the <span className="accent">“what if?”</span>
            </h2>
            <p>
              At ZassTech, we believe ambitious ideas deserve technology that feels intuitive,
              dependable, and ready for real life. We turn complex workflows into products people
              can actually enjoy using.
            </p>
            <div className="values-inline">
              <div>
                <strong>People first</strong>
                <span>Clear, considered experiences</span>
              </div>
              <div>
                <strong>Built to grow</strong>
                <span>A solid base for your next step</span>
              </div>
            </div>
            <Link className="text-link" href="/about-us">
              Get to know ZassTech <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="container capabilities" aria-label="Our approach">
        <div className="capability-grid">
          <article>
            <MousePointer2 size={23} />
            <h3>Thoughtful details</h3>
            <p>Clear, considered experiences shaped around the people who use them.</p>
          </article>
          <article>
            <Layers size={23} />
            <h3>Dependable foundations</h3>
            <p>Intuitive, dependable technology ready for the demands of real life.</p>
          </article>
          <article>
            <Sparkles size={23} />
            <h3>Room to grow</h3>
            <p>From first sketch to launch and beyond, foundations built for growth.</p>
          </article>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
