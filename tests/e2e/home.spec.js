const { test, expect } = require('@playwright/test')

test('home page loads and shows Featured Tours', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/TravelWeb|Travel Web/i)
  await expect(page.getByRole('heading', { name: /Featured Tours/i })).toBeVisible()
})

