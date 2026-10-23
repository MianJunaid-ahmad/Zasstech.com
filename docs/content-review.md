# Content review before launch

- [x] Recover company mark, favicon, homepage, contact and legal source.
- [x] Use the three verified public product descriptions without prices or new capabilities.
- [x] Use public email, telephone and locality; omit invented street address, map and socials.
- [x] Preserve source legal text and its last-updated date (22 October 2026).
- [ ] Owner/legal adviser: supply registered business name, full business address and governing jurisdiction. Both existing legal pages contain unresolved instructions.
- [ ] Privacy adviser: verify the intended-practice statements in the old policy against actual product deployments, controller/processor roles, rights handling, security and retention.
- [ ] Approve contact-form data processing through the chosen SMTP and Redis providers; confirm service locations, retention and contracts.
- [ ] Approve a concrete retention schedule for enquiries, email, logs and rate keys. Rate keys in this implementation expire after 600 seconds; enquiry retention depends on the receiving mailbox.
- [ ] Confirm the new site's no-analytics/no-marketing-cookie behavior. No analytics library, tracking pixel or optional cookie is installed. Infrastructure logs may still collect technical data.
- [ ] Confirm the public email/phone remain current. Validate SMTP sender identity, recipient and SPF/DKIM/DMARC.
- [ ] Review whether the healthcare platform has an official brand name; source naming varies.
- [ ] Approve the typography change from DM Sans / Space Grotesk to self-hosted Inter.
- [ ] Compare new and reference pages visually on desktop/mobile; approve icon substitution for emoji.
- [ ] Approve release, remove preview/review notices only after replacing unresolved legal content, and set SITE_INDEXABLE=true.

No testimonial, customer list, certification, founding date, team biography, product pricing or numerical business-performance claim has been added. Legal review is a launch dependency, not a hidden prerequisite for running the local implementation.
