import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Cross, ShoppingBag, Utensils } from 'lucide-react';
import type { Product } from '@/data/products';

export function ProductCard({ product }: { product: Product }) {
  const Icon =
    product.category === 'Food'
      ? Utensils
      : product.category === 'Healthcare'
        ? Cross
        : ShoppingBag;
  return (
    <article className="product-card" id={product.slug}>
      {product.image ? (
        <Image {...product.image} alt={product.image.alt} sizes="(max-width: 767px) 100vw, 33vw" />
      ) : (
        <div className={`product-art ${product.theme}`}>
          <Icon className="art-icon" size={190} strokeWidth={1} />
          <p className="eyebrow">{product.tagline}</p>
          <div>
            <p>{product.caption}</p>
            <h3>{product.name}</h3>
          </div>
        </div>
      )}
      <div className="product-body">
        <p>{product.description}</p>
        <div className="product-tags">
          {product.features.map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
        <Link
          className="text-link"
          href={`/contact-us?interest=${encodeURIComponent(product.name)}#contact-form`}
        >
          Explore {product.shortName} <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
