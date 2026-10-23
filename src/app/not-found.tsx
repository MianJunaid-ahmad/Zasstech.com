import Link from 'next/link';
import { Button } from '@/components/ui/button';
export default function NotFound() {
  return (
    <section className="container not-found">
      <p className="eyebrow" style={{ justifyContent: 'center', marginBottom: 20 }}>
        404 / A little off track
      </p>
      <h1>That page isn’t here.</h1>
      <p>Head back to explore ZassTech or get in touch.</p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
