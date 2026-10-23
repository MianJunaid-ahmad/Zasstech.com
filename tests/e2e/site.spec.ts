import { expect, test } from '@playwright/test';
test('capture desktop and mobile home for visual review', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
});
const routes = [
  '/',
  '/products',
  '/about-us',
  '/terms-and-conditions',
  '/privacy-policy',
  '/contact-us',
];
for (const route of routes) {
  test(`${route} is crawlable and has unique metadata`, async ({ page, request }) => {
    const browserErrors: string[] = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<h1');
    expect(html).toContain('ZassTech');
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/ZassTech/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `http://localhost:3000${route === '/' ? '' : route}`,
    );
    await expect(page.locator('main')).toBeVisible();
    expect(browserErrors).toEqual([]);
  });
}
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`all pages fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  });
}
test('mobile navigation opens, navigates and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Products' })
    .click();
  await expect(page).toHaveURL('/products');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});
test('all internal links resolve and missing pages return 404', async ({ page, request }) => {
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) => elements.map((element) => element.getAttribute('href')!)))
      links.add(href.split('#')[0]);
  }
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
  expect((await request.get('/no-such-page')).status()).toBe(404);
});
test('contact validation and mocked delivery success', async ({ page }) => {
  await page.goto('/contact-us');
  await page.getByRole('button', { name: /Send your message/ }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    }),
  );
  await page.getByLabel('Full name *').fill('Test Person');
  await page.getByLabel('Email address *').fill('person@example.com');
  await page.getByLabel('Subject *').fill('Product enquiry');
  await page.getByLabel('Tell us a little more *').fill('Please tell me about your platform.');
  await page.getByRole('button', { name: /Send your message/ }).click();
  await expect(page.getByText(/Your message has been sent/)).toBeVisible();
});
test('metadata routes and structured data are valid', async ({ page, request }) => {
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  await page.goto('/');
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.map((text) => JSON.parse(text)['@type'])).toEqual(
    expect.arrayContaining(['Organization', 'WebSite']),
  );
  const social = await request.get('/opengraph-image');
  expect(social.status()).toBe(200);
  expect(social.headers()['content-type']).toContain('image/png');
});
test('page content works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/products');
  await expect(page.getByRole('heading', { name: 'ZassFood', exact: true })).toBeVisible();
  await context.close();
});
