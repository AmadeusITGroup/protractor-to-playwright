// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

Error.stackTraceLimit = Infinity;

const config: PlaywrightTestConfig = {
	globalSetup: './global-setup',
	testDir: './specs/',
	forbidOnly: !!process.env.CI,
	retries: 0,
	reporter: [['list'], ['html', {open: 'never'}]],
	snapshotPathTemplate: 'playwright/{arg}{ext}'
};
export default config;