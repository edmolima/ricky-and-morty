import { test } from '@playwright/test';

test.describe('Rick and Morty Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
});