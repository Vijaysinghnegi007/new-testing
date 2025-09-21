const { test, expect } = require('@playwright/test')

const paths = [
  { url: '/about', heading: /About/i },
  { url: '/help', heading: /Help|FAQ/i },
  { url: '/privacy', heading: /Privacy Policy/i },
  { url: '/terms', heading: /Terms of Service/i },
  { url: '/contact', heading: /Contact Us/i },
]

for (const p of paths) {
  test(`${p.url} loads and shows heading`, async ({ page }) => {
    await page.goto(p.url)
    await expect(page.getByRole('heading', { name: p.heading })).toBeVisible()
  })
}

