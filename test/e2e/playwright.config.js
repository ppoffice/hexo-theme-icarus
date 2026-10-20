const path = require('path');
const { defineConfig, devices } = require('@playwright/test');

const TMP = path.join(__dirname, '../.tmp');

module.exports = defineConfig({
    testDir: __dirname,
    testMatch: '**/*.spec.js',
    globalSetup: require.resolve('./global-setup'),
    outputDir: path.join(TMP, 'playwright-results'),
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    reporter: process.env.CI
        ? [['list'], ['html', { open: 'never', outputFolder: path.join(TMP, 'playwright-report') }]]
        : [['list']],
    use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure'
    },
    projects: [{ name: 'chromium' }]
});
