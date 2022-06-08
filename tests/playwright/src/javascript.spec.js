/* eslint-disable prefer-rest-params,no-undef */
import { test, setPage } from "../playwright-utils";

test.describe('browser conversion', () => {
	test('should work with js', async ({page}) => {
        setPage(page);
		// await browser.get('https://playwright.dev/');
		await page.goto('https://playwright.dev/');

		// await element(by.css('something'));
		await page.locator('something');
	});
});