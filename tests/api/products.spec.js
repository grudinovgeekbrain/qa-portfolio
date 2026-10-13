const { test, expect } = require('@playwright/test');

const API_BASE_URL = 'https://fakestoreapi.com';

test.describe('Fake Store API — products', () => {
  test('GET /products returns a non-empty array with expected fields and types', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/products`, { timeout: 20_000 });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    const ids = new Set();
    for (const product of products) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('image');

      expect(typeof product.id).toBe('number');
      expect(typeof product.title).toBe('string');
      expect(product.title.trim().length).toBeGreaterThan(0);
      expect(typeof product.price).toBe('number');
      expect(Number.isFinite(product.price)).toBe(true);
      expect(product.price).toBeGreaterThanOrEqual(0);
      expect(typeof product.description).toBe('string');
      expect(typeof product.category).toBe('string');
      expect(typeof product.image).toBe('string');

      expect(ids.has(product.id)).toBe(false);
      ids.add(product.id);
    }
  });

  test('POST /products accepts a valid test product and returns matching data', async ({ request }) => {
    const payload = {
      title: 'QA Portfolio Test Product',
      price: 42.5,
      description: 'Temporary product payload for API test practice',
      image: 'https://example.com/qa-portfolio-test-product.png',
      category: 'electronics'
    };

    const response = await request.post(`${API_BASE_URL}/products`, {
      data: payload,
      timeout: 20_000
    });

    // Fake Store API is a demo service; allow the documented success conventions seen by this test.
    expect([200, 201]).toContain(response.status());
    expect(response.headers()['content-type']).toContain('application/json');

    const createdProduct = await response.json();
    expect(createdProduct).toMatchObject(payload);
    expect(createdProduct).toHaveProperty('id');
    expect(typeof createdProduct.id).toBe('number');

    // A success response from this demo API does not prove persistent storage.
  });
});
