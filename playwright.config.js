const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: process.env.PW_WEB_SERVER_CMD || 'npm run build && npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})

