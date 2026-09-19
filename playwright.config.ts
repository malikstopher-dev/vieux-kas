import {defineConfig, devices} from "@playwright/test";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 90_000,
  expect: {timeout: 10_000},
  workers: 1,
  reporter: [["list"], ["html", {open: "never"}]],
  use: {
    baseURL: externalBaseUrl ?? "http://127.0.0.1:3000",
    trace: "off",
    screenshot: "only-on-failure",
    video: "off",
    ...devices["Desktop Chrome"],
  },
  webServer: externalBaseUrl ? undefined : {
    command: "npm run start",
    url: "http://127.0.0.1:3000/en",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
