'use client';
import { Button } from '@/components/ui/button';
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container not-found">
      <h1>Something went wrong.</h1>
      <p>Please try loading this page again.</p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
