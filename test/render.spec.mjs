import { test, expect } from '@playwright/test';

const WIDTHS = [1440, 1024, 768, 480, 360];

test.describe('Attēlošana un izkārtojums', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('grupas un flīzes tiek uzzīmētas kārtībā', async ({ page }) => {
    await expect(page.locator('.lp-group')).toHaveCount(3);
    await expect(page.locator('.lp-tile')).toHaveCount(9);

    /* `order` nosaka secību, nevis vieta konfigurācijā. */
    const groups = await page.locator('.lp-group').evaluateAll(g => g.map(n => n.id));
    expect(groups).toEqual(['iepirkumi', 'cilveki', 'parvaldiba']);
  });

  test('pieejamā flīze ir īsta saite, izstrādē esošā nav', async ({ page }) => {
    await expect(page.locator('a.lp-tile__link')).toHaveCount(7);

    const off = page.locator('.lp-tile__link--off').first();
    await expect(off).toHaveAttribute('aria-disabled', 'true');
    await expect(off).toHaveAttribute('role', 'link');
    await expect(off).not.toHaveAttribute('href', /./);
    /* Fokusējama, lai to var izlasīt — tikai ne aktivizējama. */
    await expect(off).toHaveAttribute('tabindex', '0');

    const before = page.url();
    await off.click({ force: true });
    expect(page.url()).toBe(before);
  });

  test('nozīmītes atbilst konfigurācijai', async ({ page }) => {
    await expect(page.locator('.lp-pill--izstrade')).toHaveCount(2);
    await expect(page.locator('.lp-pill--test')).toHaveCount(1);
    /* `added` ir datums, tāpēc atzīme noveco pati. */
    await expect(page.locator('.lp-pill--new')).toHaveCount(2);
  });

  test('kontakts un piekļuve ir atsevišķas saites kartē', async ({ page }) => {
    await expect(page.locator('.lp-tile__action[href^="mailto:"]')).toHaveCount(9);
    await expect(page.locator('.lp-tile__action[href*="piekluve"]')).toHaveCount(2);
    /* Ligzdotas <a> ir nederīgs HTML — karte pati vairs nav saite. */
    await expect(page.locator('a.lp-tile__inner')).toHaveCount(0);
    await expect(page.locator('a a')).toHaveCount(0);
  });

  test('jaunā cilnē atveras ar noopener', async ({ page }) => {
    const tab = page.locator('.lp-tile__action--tab').first();
    await expect(tab).toHaveAttribute('target', '_blank');
    await expect(tab).toHaveAttribute('rel', /noopener/);
  });

  test('kartes ir ar apmali, nevis ēnu', async ({ page }) => {
    const shadow = await page.locator('.lp-tile__inner').first()
      .evaluate(el => getComputedStyle(el).boxShadow);
    expect(shadow).toBe('none');
  });

  for (const width of WIDTHS) {
    test(`bez horizontālās ritināšanas pie ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForTimeout(200);
      const { scrollW, clientW } = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
      }));
      expect(scrollW).toBeLessThanOrEqual(clientW + 1);
    });
  }

  test('blīvums pazeminās zem 1024px', async ({ page }) => {
    const pad = async () => page.locator('.lp-tile__inner').first()
      .evaluate(el => getComputedStyle(el).padding);

    await page.setViewportSize({ width: 1440, height: 1000 });
    expect(await pad()).toBe('32px');

    await page.setViewportSize({ width: 800, height: 1000 });
    expect(await pad()).toBe('20px');
  });

  test('tumšais režīms pārslēdz abus slāņus', async ({ page }) => {
    await page.click('#theme-toggle');

    /* .dark pārslēdz markas, data-theme pārslēdz DaisyUI mainīgos. */
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sintakse-dark');
    await expect(page.locator('html')).toHaveClass(/dark/);

    /* Fonam ir 220ms pāreja, tāpēc uzreiz pēc klikšķa nolasītā vērtība ir
       kaut kur pa vidu. Gaidām, līdz tā nostājas, nevis lasām vienreiz. */
    await expect.poll(
      () => page.evaluate(() => getComputedStyle(document.body).backgroundColor),
      { timeout: 3000 }
    ).toBe('rgb(0, 11, 64)');
  });

  test('saraksta skats pārslēdzas un saglabājas', async ({ page }) => {
    await page.click('#view-toggle');
    await expect(page.locator('body')).toHaveClass(/lp-view-list/);

    await page.reload();
    await expect(page.locator('body')).toHaveClass(/lp-view-list/);
  });

  test('sienas ekrāna režīms noņem hromu', async ({ page }) => {
    await page.goto('/index.html?mode=wallboard');
    await expect(page.locator('body')).toHaveClass(/lp-wallboard/);
    await expect(page.locator('.lp-topbar')).toBeHidden();
    await expect(page.locator('.lp-footer')).toBeHidden();
    await expect(page.locator('.lp-tile')).toHaveCount(9);
  });

  test('grupu enkuri ved uz sadaļu', async ({ page }) => {
    const anchor = page.locator('.lp-group__anchor').first();
    await expect(anchor).toHaveAttribute('href', '#iepirkumi');
  });

  test('meklēšana un faktūra ir noņemtas', async ({ page }) => {
    await expect(page.locator('input')).toHaveCount(0);
    await expect(page.locator('[class*=texture]')).toHaveCount(0);
  });
});
