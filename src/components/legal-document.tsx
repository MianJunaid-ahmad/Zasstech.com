import { PageIntro } from './page-intro';
export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
}
export function LegalDocument({
  title,
  description,
  path,
  sections,
}: {
  title: string;
  description: string;
  path: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageIntro eyebrow={title} title={title} description={description} path={path} />
      <div className="container legal-layout">
        <aside className="legal-toc">
          <h2>On this page</h2>
          <nav aria-label={`${title} contents`}>
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>
        <article className="legal-document">
          <p className="legal-date">
            Reference last updated: <time dateTime="2026-10-22">22 October 2026</time>
          </p>
          <div className="review-box">
            <strong>Draft requiring legal review.</strong> The existing public document is
            reproduced below. It contains unresolved business-identity details and has not been
            independently approved for this new implementation. Confirm company details, governing
            law and actual processing practices before publication.
          </div>
          {sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
