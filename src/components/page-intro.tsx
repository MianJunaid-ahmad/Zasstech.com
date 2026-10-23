import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JsonLd } from './json-ld';
import { breadcrumbData } from '@/lib/seo';

export function PageIntro({
  eyebrow,
  title,
  description,
  path,
}: {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
}) {
  return (
    <>
      <JsonLd data={breadcrumbData(eyebrow, path)} />
      <section className="page-intro">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ArrowRight size={12} />
            <span>{eyebrow}</span>
          </div>
          <p className="eyebrow">
            <span />
            {eyebrow}
          </p>
          <h1>{title}</h1>
          <p className="intro-description">{description}</p>
        </div>
      </section>
    </>
  );
}
