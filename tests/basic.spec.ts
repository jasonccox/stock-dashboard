import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('http://server:3000/');
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle('Jason\'s Stock Dashboard');
});

test('starts with no watched stocks', async ({ page }) => {
  await expect(page.getByText('You aren\'t watching any stocks yet.')).toBeVisible();
});

test('adds watched stocks', async ({ page }) => {
  const input = page.getByLabel('Symbol');
  const button = page.getByRole('button', { name: 'Add' });

  await input.fill('AAA');
  await button.click();

  await expect(page.getByRole('cell', { name: 'AAA' })).toBeVisible();
  await expect(page.getByRole('cell', { name: /[0-9]+\.[0-9][0-9]/, exact: true })).toBeVisible();

  await input.fill('BBB');
  await button.click();

  await expect(page.getByRole('cell', { name: 'BBB' })).toBeVisible();
  await expect(page.getByRole('cell', { name: /[0-9]+\.[0-9][0-9]/, exact: true })).toHaveCount(2);
});

test('clears input text when adding stock', async ({ page }) => {
  const input = page.getByLabel('Symbol');
  const button = page.getByRole('button', { name: 'Add' });

  await input.fill('CCC');
  await button.click();

  await expect(input).toHaveText('');
});

test('prevents adding duplicate stocks', async ({ page }) => {
  const input = page.getByLabel('Symbol');
  const button = page.getByRole('button', { name: 'Add' });

  await input.fill('DDD');
  await button.click();

  await input.fill('DDD');
  await button.click();

  await expect(page.getByRole('cell', { name: 'DDD' })).toHaveCount(1);
  await expect(page.getByRole('alert')).toBeVisible();
});

test('does not allow spaces in stock symbols', async ({ page }) => {
  const input = page.getByLabel('Symbol');
  const button = page.getByRole('button', { name: 'Add' });

  await input.fill('A B C');
  await button.click();

  await expect(page.getByRole('cell')).toHaveCount(0);
  await expect(page.getByRole('alert')).toBeVisible();
});

test('updates stock prices', async ({ page }) => {
  const input = page.getByLabel('Symbol');
  const button = page.getByRole('button', { name: 'Add' });

  await input.fill('EEE');
  await button.click();

  await input.fill('FFF');
  await button.click();

  const cells = page.getByRole('cell', { name: /[0-9]+\.[0-9][0-9]/, exact: true });

  const price1 = await cells.nth(0).textContent();
  const price2 = await cells.nth(1).textContent();

  await expect.poll(async () => (
    (await cells.nth(0).textContent()) !== price1
      && (await cells.nth(1).textContent()) !== price2
  ), {
    intervals: [5000, 1000, 1000, 1000],
    timeout: 10000,
  }).toBeTruthy();
});

test('removes watched stocks', async ({ page }) => {
  const input = page.getByLabel('Symbol');
  const button = page.getByRole('button', { name: 'Add' });

  await input.fill('GGG');
  await button.click();

  await input.fill('HHH');
  await button.click();

  await expect(page.getByRole('cell', { name: 'GGG' })).toHaveCount(1);
  await expect(page.getByRole('cell', { name: 'HHH' })).toHaveCount(1);

  await page.getByRole('button', { name: 'Remove' }).first().click();
  await expect(page.getByRole('cell', { name: 'GGG' })).toHaveCount(0);
  await expect(page.getByRole('cell', { name: 'HHH' })).toHaveCount(1);

  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(page.getByRole('cell', { name: 'HHH' })).toHaveCount(0);
});

test('retains watch list after a refresh', async ({ page }) => {
  const input = page.getByLabel('Symbol');
  const button = page.getByRole('button', { name: 'Add' });

  await input.fill('III');
  await button.click();

  await input.fill('JJJ');
  await button.click();

  await expect(page.getByRole('cell', { name: 'III' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'JJJ' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('cell', { name: 'III' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'JJJ' })).toBeVisible();
});

test('clears watch list when cookies are cleared', async ({ page, context }) => {
  const input = page.getByLabel('Symbol');
  const button = page.getByRole('button', { name: 'Add' });

  await input.fill('III');
  await button.click();

  await input.fill('JJJ');
  await button.click();

  await expect(page.getByRole('cell', { name: 'III' })).toHaveCount(1);
  await expect(page.getByRole('cell', { name: 'JJJ' })).toHaveCount(1);

  await context.clearCookies();
  await page.reload();

  await expect(page.getByRole('cell', { name: 'III' })).toHaveCount(0);
  await expect(page.getByRole('cell', { name: 'JJJ' })).toHaveCount(0);
});
