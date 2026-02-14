import { defineConfig } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT ? Number(process.env.PLAYWRIGHT_PORT) : 3100;
const baseURL = `http://127.0.0.1:${port}`;
const dbUrl = `file:/tmp/aincide-playwright-${port}.db`;
const envPrefix = `TURSO_DATABASE_URL="" TURSO_AUTH_TOKEN="" DATABASE_URL="${dbUrl}"`;

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL,
    headless: true,
  },
  webServer: {
    command: `${envPrefix} npm run db:push && ${envPrefix} npm run dev -- --webpack --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
