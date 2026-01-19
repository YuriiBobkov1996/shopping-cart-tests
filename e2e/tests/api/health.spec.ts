import { test, expect } from '@playwright/test';

test('GET /health should return 200', { tag: ['@api', '@smoke'] }, async ({ request }) => {
  const res = await request.get('/health');
  expect(res.ok()).toBeTruthy(); 
  const contentType = res.headers()['content-type'] ?? '';
  if (contentType.includes('application/json')) {
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining({ status: 'ok' }));
  }
});
