import { test, expect } from '@playwright/test';

/* Darbvirsmai jāstrādā slēgtā tīklā. Nejauša CDN atsauce izstrādē
   paliek nepamanīta — resurss taču ielādējas — tāpēc te tiek bloķēts
   viss, kas nav no mūsu servera. Ja lapai kaut kā pietrūkst, tests
   krīt skaļi, nevis klusi strādā tikai izstrādātāja datorā. */
test.describe('Nekādu ārējo pieprasījumu', () => {
  test('lapa neprasa neko no ārpuses', async ({ page, context, baseURL }) => {
    const external = [];

    await context.route('**/*', route => {
      const url = route.request().url();
      const local = url.startsWith(baseURL) || url.startsWith('data:') || url.startsWith('blob:');
      if (!local) {
        external.push(url);
        return route.abort();
      }
      return route.continue();
    });

    const failed = [];
    const errors = [];
    page.on('requestfailed', r => failed.push(`${r.url()} — ${r.failure()?.errorText}`));
    /* 404 ir veiksmīga HTTP saruna, tāpēc requestfailed to nepamana.
       Bez šīs pārbaudes nepareizi izšķirti @import ceļi paliek neredzami. */
    page.on('response', r => {
      if (r.status() >= 400) failed.push(`${r.url()} — HTTP ${r.status()}`);
    });
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

    await page.goto('/index.html');
    await page.waitForLoadState('load');
    await page.evaluate(() => document.fonts.ready);

    expect(external, 'ārējie pieprasījumi').toEqual([]);
    expect(failed, 'neizdevušies pieprasījumi').toEqual([]);
    expect(errors, 'konsoles kļūdas').toEqual([]);

    // Lapa tiešām uzzīmējās, nevis tikai neko neprasīja.
    await expect(page.locator('.lp-tile')).toHaveCount(9);
  });

  test('visi trīs fontu komplekti ielādējas lokāli', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => document.fonts.ready);

    const loaded = await page.evaluate(() => {
      const has = n => [...document.fonts].some(f => f.family.includes(n) && f.status === 'loaded');
      return { gilroy: has('Gilroy'), googleSans: has('Google Sans'), fontAwesome: has('Font Awesome') };
    });

    expect(loaded).toEqual({ gilroy: true, googleSans: true, fontAwesome: true });
  });

  test('index.html strādā arī no file://', async ({ page }) => {
    /* Chromium file:// izcelsmi uzskata par svešu, tāpēc te ķeras
       tieši tās kļūdas, ko serveris noslēpj — piemēram mask-image. */
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('requestfailed', r => errors.push(`failed: ${r.url()}`));

    const root = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
    await page.goto(`file://${root}/index.html`);
    await page.waitForLoadState('load');

    expect(errors).toEqual([]);
    await expect(page.locator('.lp-tile')).toHaveCount(9);
  });
});
