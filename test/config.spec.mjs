import { test, expect } from '@playwright/test';

/* Konfigurāciju labo cilvēks rokām. Bojāts ieraksts drīkst izskatīties
   neitrāls, bet nedrīkst nogāzt visu lapu. */
/* Divi publicēšanas gadījumi, kas reāli notikuši: skripti neizpildās vispār.
   Tad neizpildās arī kļūdas apstrāde, tāpēc paskaidrojums ir jāieliek jau
   HTML — citādi lietotājs redz tikai tukšu lapu. */
test.describe('Skripti neizpildās', () => {
  test('rezerves paziņojums ir redzams, ja app.js neielādējas', async ({ page, context }) => {
    await context.route('**/app.js', route => route.fulfill({ status: 404, body: '' }));

    await page.goto('/index.html');
    await page.waitForTimeout(300);

    /* Hroms ir vietā, kartes nav — un lietotājs redz, kāpēc. */
    await expect(page.locator('.lp-topbar')).toBeVisible();
    await expect(page.locator('.lp-tile')).toHaveCount(0);
    await expect(page.locator('.lp-boot')).toBeVisible();
    await expect(page.locator('.lp-boot__title')).toContainText('neizdevās ielādēt');
  });

  test('rezerves paziņojums parādās arī pie nepareiza MIME tipa', async ({ page, context }) => {
    /* Ar nosniff pārlūks atsakās izpildīt skriptu, kas atdots kā text/plain.
       Serveris atbild 200, tāpēc neviena tīkla kļūda to nenoķer. */
    await context.route('**/*.js', async route => {
      const r = await route.fetch();
      await route.fulfill({
        response: r,
        headers: { ...r.headers(), 'content-type': 'text/plain', 'x-content-type-options': 'nosniff' },
      });
    });

    await page.goto('/index.html');
    await page.waitForTimeout(400);

    await expect(page.locator('.lp-tile')).toHaveCount(0);
    await expect(page.locator('.lp-boot')).toBeVisible();
  });

  test('kad skripti izpildās, rezerves paziņojums pazūd', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('body')).toHaveClass(/lp-ready/);
    await expect(page.locator('.lp-boot')).toBeHidden();
    await expect(page.locator('.lp-tile')).toHaveCount(9);
  });
});

test.describe('Bojāta konfigurācija', () => {
  test('nederīgi ieraksti tiek izlaisti, lapa paliek dzīva', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));

    await page.addInitScript(() => {
      Object.defineProperty(window, 'RVPCA_LAUNCHPAD', {
        configurable: true,
        set() { /* norij īsto konfigurāciju */ },
        get() {
          return {
            title: 'Junk test',
            groups: [
              null,                                  // tukša grupa
              { title: 'Nav apps masīva' },
              { title: 'Tukšs apps', apps: [] },
              { title: 'Jaukts', span: 'muļķības', apps: [
                null,
                {},                                   // pilnīgi tukša lietotne
                { title: 'Ābols' },                   // bez url un ikonas
                { title: 'Slikts izmērs', url: '#', size: 'milzīgs' },
                { title: 'Slikta saime', url: '#', mono: 'Xx', family: 'Chartreuse' },
                { id: 'tikai-id', url: '#' },
                { title: '123', url: '#' },           // bez burtiem monogrammai
                { title: 'Slikts datums', url: '#', added: 'nav datums' },
                { title: 'Nezināma vide', url: '#', env: 'staging' },
              ]},
            ],
          };
        },
      });
    });

    await page.goto('/index.html');
    await page.waitForTimeout(300);

    expect(errors).toEqual([]);
    await expect(page.locator('.lp-group')).toHaveCount(1);
    await expect(page.locator('.lp-tile')).toHaveCount(7);

    /* Nosaukums no id, un monogramma no nosaukuma pirmajiem burtiem. */
    await expect(page.getByText('tikai-id')).toHaveCount(1);
    const monos = await page.locator('.lp-tile__mono').allTextContents();
    expect(monos).toContain('??');            // '123' — nav neviena burta
    expect(monos).toContain('Āb');            // diakritika saglabāta

    /* Nederīgs datums un nezināma vide nedrīkst uzzīmēt nozīmīti. */
    await expect(page.locator('.lp-pill--new')).toHaveCount(0);
    await expect(page.locator('.lp-pill--test, .lp-pill--demo')).toHaveCount(0);
  });

  test('trūkstoša konfigurācija rāda paskaidrojumu, nevis tukšu lapu', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'RVPCA_LAUNCHPAD', {
        configurable: true, set() {}, get() { return undefined; },
      });
    });

    await page.goto('/index.html');
    await expect(page.locator('#empty')).toBeVisible();
    await expect(page.locator('.lp-empty__title')).toContainText('Konfigurācija nav ielādēta');
    await expect(page.locator('.lp-empty__art')).toBeVisible();
  });

  test('trūkstošs marķējums atkāpjas uz monogrammu', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'RVPCA_LAUNCHPAD', {
        configurable: true,
        set() {},
        get() {
          return { title: 'T', groups: [{ id: 'g', title: 'G', apps: [
            { id: 'x', title: 'Nav bildes', url: '#', mark: 'brand/assets/nav-taada-faila.svg' },
          ] }] };
        },
      });
    });

    await page.goto('/index.html');
    await page.waitForTimeout(400);

    /* Salauzta attēla ikona ir sliktāka par monogrammu. */
    await expect(page.locator('.lp-tile__mark')).toHaveCount(0);
    await expect(page.locator('.lp-tile__mono')).toHaveText('Na');
  });
});
