import { PageIntro } from '@/components/page-intro';
import { ContactCta } from '@/components/contact-cta';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata(
  'About us',
  'Meet ZassTech, a product studio building useful digital platforms for food, healthcare and commerce, based in Pabbi, Nowshera.',
  '/about-us',
);
export const revalidate = 3600;
export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About us"
        title="Good tech makes room for people."
        description="We’re here for the “what if?” Ambitious ideas deserve technology that feels intuitive, dependable and ready for real life."
        path="/about-us"
      />
      <section className="section">
        <div className="container about-grid">
          <div className="point-of-view">
            <span>OUR POINT OF VIEW</span>
            <p className="quote">
              One team.
              <br />
              Connected
              <br />
              <em>by purpose.</em>
            </p>
            <div className="line" />
            <small>Food. Healthcare. Commerce.</small>
          </div>
          <div className="about-copy">
            <p className="eyebrow">A little about ZassTech</p>
            <h2>
              Digital products.
              <br />
              <span className="accent">A human pulse.</span>
            </h2>
            <p>
              At ZassTech, we believe ambitious ideas deserve technology that feels intuitive,
              dependable, and ready for real life. We turn complex workflows into products people
              can actually enjoy using.
            </p>
            <p>
              From first sketch to launch and beyond, our focus stays on thoughtful details,
              dependable experiences, and foundations built for growth.
            </p>
            <p>
              We are based in Pabbi, Nowshera, Pakistan. Our products connect everyday experiences
              across food delivery, healthcare appointments and digital commerce.
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
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
