import Link from 'next/link';
import { Brand } from './brand';
import { ArrowUpRight } from 'lucide-react';
import { allNavigation } from '@/data/navigation';
import { company } from '@/data/company';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" aria-label="ZassTech home">
              <Brand light />
            </Link>
            <p>
              Digital products with a human pulse. We help ambitious teams create better everyday
              experiences.
            </p>
            <a className="footer-note" href={`mailto:${company.email}`}>
              {company.email}
            </a>
            <span className="footer-note">
              {company.phone} · {company.address}
            </span>
          </div>
          <div className="footer-links">
            {allNavigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {company.name}.
          </span>
          <span>Thoughtfully engineered for what’s next.</span>
        </div>
      </div>
    </footer>
  );
}
