import { chromium } from '@playwright/test';

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const [name, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 375, 812],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto('https://zasstech.com', { waitUntil: 'networkidle', timeout: 60000 });
    await page.screenshot({ path: `docs/reference/home-${name}.png`, fullPage: true });
    console.log(
      name,
      JSON.stringify(
        await page.evaluate(() => ({
          title: document.title,
          viewport: innerWidth,
          contentWidth: document.documentElement.scrollWidth,
        })),
      ),
    );
    if (name === 'mobile') {
      await page.getByRole('button', { name: 'Open navigation menu' }).click();
      console.log(
        'reference mobile menu expanded:',
        await page.getByRole('button').first().getAttribute('aria-expanded'),
      );
    }
  }
} finally {
  await browser.close();
}
