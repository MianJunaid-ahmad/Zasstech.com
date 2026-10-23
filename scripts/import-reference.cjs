// This one-off reference importer is CommonJS so it can run directly in Node.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('node:fs');
fs.mkdirSync('public/logos', { recursive: true });
fs.copyFileSync('docs/reference/assets-zasstech-mark.svg', 'public/logos/zasstech-mark.svg');
fs.copyFileSync('docs/reference/assets-favicon.svg', 'public/logos/icon.svg');
for (const [file, out] of [
  ['privacy-policy.php', 'privacy'],
  ['terms-and-conditions.php', 'terms'],
]) {
  const source = fs.readFileSync('docs/reference/' + file, 'utf8');
  const article = source.slice(source.indexOf('<article'), source.indexOf('</article>'));
  const clean = (text) =>
    text
      .replace(/<span[^>]*class="__cf_email__"[^>]*>.*?<\/span>/g, 'rtwebcoder@gmail.com')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&#160;|&nbsp;/g, ' ')
      .trim();
  const sections = [...article.matchAll(/<section id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)].map(
    (match) => ({
      id: match[1],
      title: clean(match[2].match(/<h2[^>]*>([\s\S]*?)<\/h2>/)[1]),
      paragraphs: [...match[2].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((p) => clean(p[1])),
    }),
  );
  if (!sections.length) throw new Error('No legal sections found in ' + file);
  fs.writeFileSync('src/data/' + out + '.json', JSON.stringify(sections, null, 2) + '\n');
  console.log(out, sections.length, 'sections imported');
}
if (fs.existsSync('reference-home.html'))
  fs.renameSync('reference-home.html', 'docs/reference/home.html');
