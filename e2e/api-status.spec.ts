import { test, expect } from '@playwright/test';

test.describe('Status API Routes', () => {
  test.describe.configure({ mode: 'parallel' });

  test('GET /api/proxy/usage returns valid structure or configuration hint', async ({ request }) => {
    const response = await request.get('/api/proxy/usage');
    const status = response.status();

    // 200: Success, 503: Not configured, 502: Upstream unreachable
    expect([200, 502, 503]).toContain(status);

    const data = await response.json().catch(() => null);

    if (status === 200) {
      expect(data).toHaveProperty('accounts');
      expect(Array.isArray(data.accounts)).toBeTruthy();
      expect(data).toHaveProperty('codex');
      expect(Array.isArray(data.codex)).toBeTruthy();
    }

    if (status === 503) {
      expect(data).toHaveProperty('error');
    }
  });

  test('GET /api/proxy/bot-status returns valid structure or graceful error', async ({ request }) => {
    const response = await request.get('/api/proxy/bot-status');
    const status = response.status();
    
    // 200: Success, 502: Gateway Timeout (upstream down), 500: Internal Error (should be rare)
    expect([200, 502, 504]).toContain(status);

    if (status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('bots');
      expect(Array.isArray(data.bots)).toBeTruthy();
      if (data.bots.length > 0) {
        const bot = data.bots[0];
        expect(bot).toHaveProperty('id');
        expect(bot).toHaveProperty('status');
      }
    }
  });

  test('GET /api/proxy/bot-usage returns valid structure or graceful error', async ({ request }) => {
    const response = await request.get('/api/proxy/bot-usage');
    const status = response.status();
    
    expect([200, 502, 504]).toContain(status);

    if (status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('accounts');
      expect(Array.isArray(data.accounts)).toBeTruthy();
    }
  });

  test('GET /api/proxy/auth-files/download returns 400 when name missing', async ({ request }) => {
    const response = await request.get('/api/proxy/auth-files/download');
    expect(response.status()).toBe(400);
  });

  test('GET /api/proxy/auth-files/download returns 503 when not configured (or 200/502 when configured)', async ({ request }) => {
    const response = await request.get('/api/proxy/auth-files/download?name=test.json');
    expect([200, 502, 503]).toContain(response.status());
  });

  test('GET /api/proxy/services returns service status list', async ({ request }) => {
    const response = await request.get('/api/proxy/services');
    expect(response.status()).toBe(200); // This endpoint handles its own errors and always returns JSON
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    if (data.length > 0) {
      const service = data[0];
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('url');
      expect(service).toHaveProperty('status');
      expect(['online', 'offline']).toContain(service.status);
    }
  });
});
