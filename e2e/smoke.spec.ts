import { test, expect } from '@playwright/test';

test.describe('AIncide 스모크 테스트', () => {
  test('홈페이지 로드', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/aincide/i);
  });

  test('status 페이지 로드', async ({ page }) => {
    const response = await page.goto('/status');
    expect(response?.status()).toBe(200);
  });

  test('todo 페이지 로드', async ({ page }) => {
    const response = await page.goto('/todo');
    expect(response?.status()).toBe(200);
  });

  test('새 글 작성 페이지 로드', async ({ page }) => {
    const response = await page.goto('/posts/new');
    expect(response?.status()).toBe(200);
  });

  test('홈페이지에서 네비게이션 링크 존재', async ({ page }) => {
    await page.goto('/');
    // 페이지에 링크가 하나 이상 있는지
    const links = page.locator('a[href]');
    await expect(links.first()).toBeVisible();
  });

  test('status 페이지에 봇 정보 표시', async ({ page }) => {
    await page.goto('/status');
    // CLIProxy 미설정이면 설정 가이드가 보여야 하고,
    // 설정되어 있으면 사용량 카드(Claude MAX/Codex)가 보여야 한다.
    const setupGuide = page.getByText('CLIProxyAPI 설정 필요');
    const usageCard = page.getByText('Claude MAX').or(page.getByText('Codex'));
    await expect(setupGuide.or(usageCard)).toBeVisible({ timeout: 15000 });
  });
});
