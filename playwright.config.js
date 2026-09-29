// Playwright tests of how pages respond to real clicks, taps, and drags (tests/*.spec.js).
//
//   npm test                         every test, on a desktop and on a phone
//   npx playwright test polyhedra    one file;  --project=phone for one screen;  --headed to watch
//
// tests/fixtures.js serves outside files (three.js, fonts) from tools/.cache, like tools/snap.mjs, so runs don't depend on the CDN.
const {defineConfig, devices} = require('@playwright/test');
module.exports = defineConfig({
  testDir: 'tests',
  timeout: 60000,
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173/',
    // WebGL in headless Chrome, for the 3D views
    launchOptions: {args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']},
  },
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome']}},
    {name: 'phone', use: {...devices['Pixel 7']}},
  ],
  webServer: {command: 'node tools/serve.mjs', url: 'http://127.0.0.1:4173/', reuseExistingServer: !process.env.CI},
});
