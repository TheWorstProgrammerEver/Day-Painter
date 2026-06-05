import { defineConfig, devices } from '@playwright/test'

const testServerUrl = 'http://127.0.0.1:5174'

export default defineConfig({
  testDir: './tests/visual',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02
    }
  },
  use: {
    baseURL: testServerUrl,
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'zsh -lc "source ~/.nvm/nvm.sh; nvm use; npm run dev -- --host 127.0.0.1 --port 5174 --strictPort"',
    url: testServerUrl,
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 }
      }
    }
  ]
})
