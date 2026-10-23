import { LegalDocument } from '@/components/legal-document';
import terms from '@/data/terms.json';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata(
  'Terms and conditions',
  'Read the existing ZassTech website terms covering product information, acceptable use and contact details. Legal review is pending.',
  '/terms-and-conditions',
);
export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms and conditions"
      description="A clear framework for using the ZassTech website."
      path="/terms-and-conditions"
      sections={terms}
    />
  );
}
