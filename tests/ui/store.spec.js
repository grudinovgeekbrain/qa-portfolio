const { test, expect } = require('@playwright/test');

const testProducts = [
  {
    id: 101,
    title: 'Cotton Shirt for Men',
    price: 20,
    description: 'Cotton shirt used as stable UI test data',
    category: "men's clothing",
    image: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
  },
  {
    id: 102,
    title: 'Casual Denim Jacket',
    price: 55,
    description: 'Denim jacket used as stable UI test data',
    category: "men's clothing",
    image: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
  },
  {
    id: 103,
    title: 'Basic T-Shirt',
    price: 10,
    description: 'Basic t-shirt used as stable UI test data',
    category: "men's clothing",
    image: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
  }
];

const productsEndpoint = '**/fakestoreapi.com/products';

async function mockProducts(page, body = testProducts, status = 200) {
  await page.route(productsEndpoint, route => route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body)
  }));
}

async function getVisiblePrices(page) {
  const textValues = await page.locator('.product p').allTextContents();
  return textValues.map(value => Number(value.replace('$', '').trim()));
}

test.describe('Demo shop UI', () => {
  test.beforeEach(async ({ page }) => {
    await mockProducts(page);
    await page.goto('/web-testing/online_market.html');
    await expect(page.locator('.product')).toHaveCount(testProducts.length);
  });

  test('renders products returned by the API', async ({ page }) => {
    await expect(page.locator('.product h3')).toHaveText([
      'Cotton Shirt for Men',
      'Casual Denim Jacket',
      'Basic T-Shirt'
    ]);
  });

  test('filters products by a case-insensitive partial title', async ({ page }) => {
    await page.locator('.search-input').fill('sHiRt');

    const titles = await page.locator('.product h3').allTextContents();
    expect(titles).toHaveLength(2);
    expect(titles.every(title => title.toLowerCase().includes('shirt'))).toBe(true);
  });

  test('shows no product cards when search has no matches', async ({ page }) => {
    await page.locator('.search-input').fill('no-such-product-987');
    await expect(page.locator('.product')).toHaveCount(0);
  });

  test('sorts products by price from low to high', async ({ page }) => {
    await page.locator('.sort-select').selectOption('cheap');
    expect(await getVisiblePrices(page)).toEqual([10, 20, 55]);
  });

  test('sorts products by price from high to low', async ({ page }) => {
    await page.locator('.sort-select').selectOption('expensive');
    expect(await getVisiblePrices(page)).toEqual([55, 20, 10]);
  });

  test('resets both search and sorting', async ({ page }) => {
    await page.locator('.search-input').fill('shirt');
    await page.locator('.sort-select').selectOption('expensive');
    await page.getByRole('button', { name: 'Сбросить фильтры' }).click();

    await expect(page.locator('.search-input')).toHaveValue('');
    await expect(page.locator('.sort-select')).toHaveValue('default');
    await expect(page.locator('.product')).toHaveCount(3);
    expect(await getVisiblePrices(page)).toEqual([20, 55, 10]);
  });

  test('adds a product and increments quantity when added again', async ({ page }) => {
    const productCard = page.locator('.product').filter({ hasText: 'Cotton Shirt for Men' });
    await productCard.getByRole('button', { name: 'Добавить в корзину' }).click();
    await expect(page.locator('.cart-item')).toHaveCount(1);
    await expect(page.locator('.cart-item-quantity')).toHaveText('1');

    await productCard.getByRole('button', { name: 'Добавить в корзину' }).click();
    await expect(page.locator('.cart-item-quantity')).toHaveText('2');
    await expect(page.locator('.cart-total')).toContainText('$40.00');
  });

  test('removes a cart item when decrement reduces quantity to zero', async ({ page }) => {
    const productCard = page.locator('.product').filter({ hasText: 'Basic T-Shirt' });
    await productCard.getByRole('button', { name: 'Добавить в корзину' }).click();
    await page.locator('.cart-btn[data-action="decrement"]').click();

    await expect(page.locator('.cart-item')).toHaveCount(0);
    await expect(page.locator('.cart-body')).toContainText('Корзина пуста');
  });

  test('deletes one selected product from a cart with multiple items', async ({ page }) => {
    await page.locator('.product').filter({ hasText: 'Cotton Shirt for Men' })
      .getByRole('button', { name: 'Добавить в корзину' }).click();
    await page.locator('.product').filter({ hasText: 'Casual Denim Jacket' })
      .getByRole('button', { name: 'Добавить в корзину' }).click();

    await expect(page.locator('.cart-item')).toHaveCount(2);
    await page.locator('.cart-item').filter({ hasText: 'Cotton Shirt for Men' })
      .locator('button[data-action="delete"]').click();

    await expect(page.locator('.cart-item')).toHaveCount(1);
    await expect(page.locator('.cart-item-title')).toHaveText('Casual Denim Jacket');
  });

  test('clears every item from the cart', async ({ page }) => {
    await page.locator('.product').filter({ hasText: 'Cotton Shirt for Men' })
      .getByRole('button', { name: 'Добавить в корзину' }).click();
    await page.locator('.product').filter({ hasText: 'Casual Denim Jacket' })
      .getByRole('button', { name: 'Добавить в корзину' }).click();

    await page.getByRole('button', { name: 'Очистить всё' }).click();

    await expect(page.locator('.cart-item')).toHaveCount(0);
    await expect(page.locator('.cart-body')).toContainText('Корзина пуста');
  });

  test('persists the cart after page reload', async ({ page }) => {
    const productCard = page.locator('.product').filter({ hasText: 'Casual Denim Jacket' });
    await productCard.getByRole('button', { name: 'Добавить в корзину' }).click();
    await expect(page.locator('.cart-item-title')).toHaveText('Casual Denim Jacket');

    await page.reload();

    await expect(page.locator('.cart-item-title')).toHaveText('Casual Denim Jacket');
    await expect(page.locator('.cart-item-quantity')).toHaveText('1');
  });

  test('shows a useful message when the product API fails', async ({ page }) => {
    await page.unroute(productsEndpoint);
    await page.route(productsEndpoint, route => route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Service unavailable' })
    }));

    await page.reload();

    await expect(page.locator('.error-message')).toContainText('Не удалось загрузить товары');
    await expect(page.getByRole('button', { name: 'Обновить страницу' })).toBeVisible();
  });
});
