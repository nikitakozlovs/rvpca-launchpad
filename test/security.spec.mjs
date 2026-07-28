import { test, expect } from '@playwright/test';

/* config/apps.js rediģē cilvēks, un dokumentācija aicina to darīt arī tiem,
   kas nav izstrādātāji. Tāpēc konfigurācija te tiek uzskatīta par ievadi, no
   kuras jāaizsargājas, nevis par uzticamu avotu.

   Katrs no šiem testiem atbilst reāli izpildāmam uzbrukumam, kas tika
   demonstrēts pirms labojuma. */

const MALICIOUS = {
  title: 'T',
  groups: [{
    id: 'g',
    title: 'G',
    icon: 'fa-users lp-wallboard',            // klašu injekcija
    apps: [
      { id: 'a', title: 'Tile',    url: "javascript:window.__pwned('url')" },
      { id: 'b', title: 'Contact', url: '#', contact: "javascript:window.__pwned('contact')" },
      { id: 'c', title: 'Access',  url: '#', accessUrl: "javascript:window.__pwned('access')" },
      { id: 'd', title: 'Mark',    url: '#', mark: 'https://evil.example/pixel.svg' },
      { id: 'e', title: 'Spaced',  url: "java\tscript:window.__pwned('obfuscated')" },
      { id: 'f', title: 'Data',    url: 'data:text/html,<script>window.__pwned("data")</script>' },
      { id: 'g2', title: 'Proto',  url: '#', mark: '//evil.example/pixel.svg' },
    ],
  }],
};

async function loadWith(page, config) {
  await page.addInitScript(cfg => {
    Object.defineProperty(window, 'RVPCA_LAUNCHPAD', {
      configurable: true, set() {}, get() { return cfg; },
    });
  }, config);
}

test.describe('Konfigurācija kā nedroša ievade', () => {
  test('javascript: adreses netiek izpildītas', async ({ page }) => {
    const fired = [];
    await page.exposeFunction('__pwned', where => fired.push(where));
    await loadWith(page, MALICIOUS);

    await page.goto('/index.html');
    await page.waitForTimeout(300);

    /* Neviena bīstamā shēma nedrīkst nonākt href atribūtā. */
    const hrefs = await page.locator('a').evaluateAll(
      as => as.map(a => a.getAttribute('href') || ''));
    expect(hrefs.filter(h => /^(javascript|data|vbscript):/i.test(h))).toEqual([]);

    /* Un arī piespiedu klikšķis neko neizpilda. */
    const links = page.locator('.lp-tile__link, .lp-tile__action');
    for (let i = 0; i < await links.count(); i++) {
      await links.nth(i).click({ force: true }).catch(() => {});
    }
    await page.waitForTimeout(200);
    expect(fired, 'izpildījās XSS slodze').toEqual([]);
  });

  test('marķējums nedrīkst nākt no citas izcelsmes', async ({ page, context }) => {
    const external = [];
    await context.route('**/*', route => {
      const u = route.request().url();
      if (!u.startsWith('http://127.0.0.1') && !u.startsWith('data:')) {
        external.push(u);
        return route.abort();
      }
      return route.continue();
    });

    await loadWith(page, MALICIOUS);
    await page.goto('/index.html');
    await page.waitForTimeout(400);

    /* Ārēja adrese `mark` laukā salauztu solījumu, ka lapa neveic nevienu
       ārēju pieprasījumu, un derētu kā izsekošanas pikselis. */
    expect(external).toEqual([]);
    const srcs = await page.locator('img').evaluateAll(
      imgs => imgs.map(i => i.getAttribute('src') || ''));
    expect(srcs.filter(s => /^(https?:)?\/\//.test(s))).toEqual([]);
  });

  test('ikonas nosaukums nevar pievienot svešas klases', async ({ page }) => {
    await loadWith(page, MALICIOUS);
    await page.goto('/index.html');
    await page.waitForTimeout(200);

    const cls = await page.evaluate(() =>
      document.querySelector('.lp-group__icon')?.className || '');
    expect(cls).not.toContain('lp-wallboard');
    await expect(page.locator('body')).not.toHaveClass(/lp-wallboard/);
  });

  test('derīga konfigurācija joprojām strādā', async ({ page }) => {
    /* Pārbaude, ka aizsardzība nav pārāk strikta. */
    await page.goto('/index.html');
    await expect(page.locator('.lp-tile')).toHaveCount(9);
    await expect(page.locator('.lp-group__icon')).toHaveCount(3);
    await expect(page.locator('.lp-tile__action[href^="mailto:"]')).toHaveCount(9);
    await expect(page.locator('img.lp-tile__mark')).toHaveCount(6);
  });
});

test.describe('Ārējo saišu higiēna', () => {
  test('target=_blank vienmēr ar noopener', async ({ page }) => {
    await page.goto('/index.html');
    const bad = await page.locator('a[target="_blank"]').evaluateAll(
      as => as.filter(a => !/noopener/.test(a.rel)).map(a => a.outerHTML.slice(0, 80)));
    expect(bad, 'reverse tabnabbing').toEqual([]);
  });

  test('lapā nav inline skriptu — CSP var būt bez unsafe-inline', async ({ page }) => {
    await page.goto('/index.html');
    const inline = await page.evaluate(() =>
      [...document.querySelectorAll('script')].filter(s => !s.src).length);
    expect(inline, 'inline <script> liktu CSP atslābināt').toBe(0);
  });

  test('lapa strādā ar stingru CSP', async ({ page, context }) => {
    /* Tā pati politika, kas deploy/ konfigurācijās. Ja lapa te salūztu,
       drošības galvenes klusi salauztu ražošanas vidi. */
    const csp = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; "
              + "img-src 'self' data:; font-src 'self'; connect-src 'none'; base-uri 'none'; "
              + "form-action 'none'; frame-ancestors 'none'; object-src 'none'";

    await context.route('**/index.html', async route => {
      const r = await route.fetch();
      await route.fulfill({ response: r, headers: { ...r.headers(), 'content-security-policy': csp } });
    });

    await page.goto('/index.html');
    await page.waitForTimeout(500);

    await expect(page.locator('.lp-tile')).toHaveCount(9);
    /* Izkārtojums nāk no style.setProperty — CSSOM, ko CSP neaizliedz. */
    const span = await page.locator('.lp-tile--lg').first()
      .evaluate(el => getComputedStyle(el).gridColumn);
    expect(span).toBe('span 6');
  });
});
