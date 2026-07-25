import { defineConfig, devices } from '@playwright/test';

/* Lapa ir statiska, tāpēc testiem pietiek ar parastu failu serveri.
   Ports ir fiksēts, lai testi varētu bloķēt visu, kas nav no tā. */
const PORT = 8123;

export default defineConfig({
  testDir: './test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        /* Pārlūks ir jau vidē; Playwright to nelejupielādē no jauna. */
        launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
      },
    },
  ],

  webServer: {
    command: `python3 -m http.server ${PORT} --bind 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
  },
});
