/* eslint-disable prefer-rest-params,no-undef */

describe('browser conversion', () => {
	it('should work with js', async () => {
		// await browser.get('https://playwright.dev/');
		await browser.get('https://playwright.dev/');

		// await element(by.css('something'));
		await element(by.css('something'));
	});
});
