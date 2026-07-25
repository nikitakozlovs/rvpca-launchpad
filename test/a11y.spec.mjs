import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* Automātiska pārbaude atrod aptuveni trešdaļu pieejamības problēmu.
   Tā neaizstāj pārbaudi ar īstu ekrānlasītāju — sk. docs/lv/izstrade.md. */

test.describe('Pieejamība', () => {
  for (const [name, setup] of [
    ['gaišais režīms', async () => {}],
    ['tumšais režīms', async page => { await page.click('#theme-toggle'); }],
    ['saraksta skats', async page => { await page.click('#view-toggle'); }],
  ]) {
    test(`axe: bez pārkāpumiem — ${name}`, async ({ page }) => {
      await page.goto('/index.html');
      await setup(page);
      await page.waitForTimeout(200);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const summary = results.violations.map(v =>
        `${v.id} (${v.impact}) × ${v.nodes.length}: ${v.help}`);
      expect(summary, summary.join('\n')).toEqual([]);
    });
  }

  test('flīzes nosaukums ir saites pieejamais nosaukums', async ({ page }) => {
    await page.goto('/index.html');
    const link = page.getByRole('link', { name: 'Sagāde', exact: true });
    await expect(link).toHaveCount(1);

    /* Apraksts un nozīmītes ir piesaistītas caur aria-describedby. */
    const described = await link.getAttribute('aria-describedby');
    expect(described).toBeTruthy();
    for (const id of described.split(' ')) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('izstrādē esošā flīze nolasās kā nepieejama', async ({ page }) => {
    await page.goto('/index.html');

    /* Pieejamības koks, nevis DOM: tā redzams tas, ko dzird lietotājs. */
    const tree = await page.locator('.lp-tile--izstrade').first().ariaSnapshot();
    expect(tree).toContain('link "Budžets" [disabled]');

    /* Pieejamā flīze tajā pašā kokā ir parasta saite ar adresi. */
    const ok = await page.locator('.lp-tile').first().ariaSnapshot();
    expect(ok).toContain('link "Sagāde"');
    expect(ok).not.toContain('[disabled]');
  });

  test('sekundāro saišu etiķetes ir gramatiskas', async ({ page }) => {
    await page.goto('/index.html');
    /* Nosaukums stāv aiz kola un paliek nominatīvā — locījumu no
       patvaļīga nosaukuma ģenerēt nevar. */
    await expect(page.getByLabel('Atvērt jaunā cilnē: Sagāde')).toHaveCount(1);
    await expect(page.getByLabel('Atbildīgais: Iepirkumu nodaļa (Sagāde)')).toHaveCount(1);
    await expect(page.getByLabel('Pieprasīt piekļuvi: Starts')).toHaveCount(1);
  });

  test('virsrakstu hierarhija ir nepārtraukta', async ({ page }) => {
    await page.goto('/index.html');
    const levels = await page.locator('h1, h2, h3').evaluateAll(
      els => els.map(e => Number(e.tagName[1])));

    expect(levels[0], 'lapai jāsākas ar h1').toBe(1);
    /* Neviens līmenis netiek pārlēkts — h1 → h3 bez h2 ir kļūda. */
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test('fokusa gredzens ir redzams uz flīzes', async ({ page }) => {
    await page.goto('/index.html');
    const outline = await page.locator('a.lp-tile__link').first().evaluate(el => {
      el.focus();
      return getComputedStyle(el.closest('.lp-tile__inner')).outlineWidth;
    });
    expect(outline).not.toBe('0px');
  });

  test('bultiņas pārvieto fokusu pa režģi', async ({ page }) => {
    await page.goto('/index.html');
    const first = page.locator('.lp-tile__link').first();
    await first.focus();
    const before = await page.evaluate(() => document.activeElement.textContent);

    await page.keyboard.press('ArrowRight');
    const after = await page.evaluate(() => document.activeElement.textContent);
    expect(after).not.toBe(before);

    await page.keyboard.press('End');
    const last = await page.evaluate(() => document.activeElement.textContent);
    expect(last).not.toBe(after);
  });

  test('visas flīzes paliek Tab secībā', async ({ page }) => {
    await page.goto('/index.html');
    /* Bultiņas ir papildinājums, nevis aizvietotājs: neviena flīze
       nedrīkst pazust no parastās tabulēšanas. */
    const tabbable = await page.locator('.lp-tile__link').evaluateAll(
      els => els.filter(e => e.tabIndex >= 0).length);
    expect(tabbable).toBe(9);
  });

  test('tēmas maiņa tiek paziņota', async ({ page }) => {
    await page.goto('/index.html');
    const region = page.locator('#announce');
    await expect(region).toHaveAttribute('aria-live', 'polite');

    await page.click('#theme-toggle');
    await expect(region).toHaveText(/režīms/, { timeout: 2000 });
  });

  test('teksta kontrasts atbilst WCAG AA', async ({ page }) => {
    await page.goto('/index.html');

    /* axe pārbauda tikai to, kas ir lapā; te tiek nomērīti konkrētie
       pāri, kas iepriekš bija par gaišiem uz papīra fona. */
    const failures = await page.evaluate(() => {
      const lum = c => {
        const [r, g, b] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number)
          .map(v => v / 255)
          .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const bgOf = el => {
        for (let n = el; n; n = n.parentElement) {
          const c = getComputedStyle(n).backgroundColor;
          if (c && !/rgba?\(0, 0, 0, 0\)|transparent/.test(c)) return c;
        }
        return 'rgb(255,255,255)';
      };
      const ratio = (a, b) => {
        const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
        return (hi + 0.05) / (lo + 0.05);
      };

      const out = [];
      const sel = ['.lp-tile__title', '.lp-tile__desc', '.lp-group__count',
                   '.lp-tile__action', '.lp-pill', '.lp-footer__label',
                   '.lp-footer__credit', '.lp-techlist__role'];
      for (const s of sel) {
        for (const el of document.querySelectorAll(s)) {
          const cs = getComputedStyle(el);
          const size = parseFloat(cs.fontSize);
          const bold = parseInt(cs.fontWeight, 10) >= 700;
          /* AA: liels teksts (>=24px, vai >=18.66px treknraksts) 3:1, citādi 4.5:1 */
          const large = size >= 24 || (bold && size >= 18.66);
          const need = large ? 3 : 4.5;
          const got = ratio(cs.color, bgOf(el));
          if (got < need) {
            out.push(`${s} "${(el.textContent || '').trim().slice(0, 20)}" ${got.toFixed(2)}:1 < ${need}`);
          }
          break;                       /* viens paraugs no katra veida pietiek */
        }
      }
      return out;
    });

    expect(failures, failures.join('\n')).toEqual([]);
  });
});
