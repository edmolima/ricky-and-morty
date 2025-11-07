import { expect, test } from '@playwright/test';

test.describe('Rick and Morty Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads dashboard with title and characters', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Rick and Morty Dashboard');

    await expect(page.locator('table')).toBeVisible();

    await expect(page.locator('thead th')).toHaveCount(5);
  });

  test('search functionality works', async ({ page }) => {
    await page.waitForSelector('table');

    const searchInput = page.getByPlaceholder('Search characters...');
    await searchInput.fill('Rick');

    await page.waitForTimeout(500);

    const countText = page.locator('text=/\\d+ characters loaded/');
    await expect(countText).toBeVisible();
  });

  test('clear search button works', async ({ page }) => {
    await page.waitForSelector('table');

    const searchInput = page.getByPlaceholder('Search characters...');

    await searchInput.fill('Morty');

    const clearButton = page.getByRole('button', { name: /clear/i });
    await expect(clearButton).toBeVisible();

    await clearButton.click();

    await expect(searchInput).toHaveValue('');

    await expect(clearButton).not.toBeVisible();
  });

  test('infinite scroll loads more characters', async ({ page }) => {
    await page.waitForSelector('table tbody tr');

    const initialRows = await page.locator('table tbody tr').count();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));


    await page.waitForTimeout(2000);

    const newRows = await page.locator('table tbody tr').count();
    expect(newRows).toBeGreaterThan(initialRows);
  });

  test('location chart displays correctly', async ({ page }) => {
    await expect(page.locator('text=Top Locations')).toBeVisible();

    await page.waitForSelector('.recharts-pie');

    const pieChart = page.locator('.recharts-pie');
    await expect(pieChart).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    await page.waitForLoadState('networkidle');


    const themeButton = page.getByRole('button', { name: /switch to (light|dark) mode/i });
    await expect(themeButton).toBeVisible({ timeout: 10000 });

    const currentTheme = await page.locator('html').getAttribute('data-theme');

    await themeButton.click();

    await page.waitForTimeout(500);

    const newTheme = await page.locator('html').getAttribute('data-theme');
    expect(newTheme).not.toBe(currentTheme);
  });

  test('displays character images', async ({ page }) => {
    await page.waitForSelector('table tbody tr');

    const firstImage = page.locator('table tbody tr img').first();
    await expect(firstImage).toBeVisible();

    const alt = await firstImage.getAttribute('alt');
    expect(alt).toBeTruthy();
  });

  test('handles no search results gracefully', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search characters...');
    await searchInput.fill('xyzabc123nonexistent');

    await page.waitForTimeout(1000);

    const characterCount = page.locator('text=/0 characters loaded/');
    await expect(characterCount).toBeVisible();
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.getByPlaceholder('Search characters...');

    await searchInput.focus();
    await page.keyboard.type('Rick');

    await expect(searchInput).toHaveValue('Rick');
  });

  test('responsive design on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    const searchInput = page.getByPlaceholder('Search characters...');
    await expect(searchInput).toBeVisible();
  });
});