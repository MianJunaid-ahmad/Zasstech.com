import { LegalDocument } from '@/components/legal-document';
import privacy from '@/data/privacy.json';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata(
  'Privacy policy',
  'Read how the existing ZassTech privacy notice describes information handling and your choices. Privacy and legal review are pending.',
  '/privacy-policy',
);
export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      description="How ZassTech handles information shared with our website and products."
      path="/privacy-policy"
      sections={privacy}
    />
  );
}
