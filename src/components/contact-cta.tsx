import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';
export function ContactCta() {
  return (
    <section className="container cta-section">
      <div>
        <p className="eyebrow">A conversation is a good place to start</p>
        <h2>
          What’s your next
          <br />
          big idea?
        </h2>
      </div>
      <div>
        <p>
          Tell us what you have in mind.
          <br />
          Let’s explore the next step together.
        </p>
        <Button asChild variant="light">
          <Link href="/contact-us">
            Get in touch <ArrowUpRight size={18} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
