import { expect, Locator } from "@playwright/test";
import { test, setPage, makeLocatorArray } from "../playwright-utils";

test.describe('common conversion', () => {

	test(`convert 'await $$'`, async ({page}) => {
        setPage(page);

		// const elements = await $$('.a');
		// elements.length;
		const elements = await makeLocatorArray(page.locator('.a'));
		elements.length;

		// (await $$('.a')).length;
		(await makeLocatorArray(page.locator('.a'))).length;


		// const array = ['a', 'b'].map(a => $$(a));
		// await array;
		// Ensure that await ElementArrayFinder[] is not converted to makeLocatorArray
		const array = ['a', 'b'].map(a => page.locator(a));
		await array;

	});

	// it(`add necessary 'async'`, () => {
	test(`add necessary 'async'`, async ({page}) => {
        setPage(page);
		// $('.a').click();
		await page.locator('.a').click();
	});

	test(`add necessary 'await'`, async ({page}) => {
        setPage(page);

		// $('.a').click();
		await page.locator('.a').click();

		// $$('.a').click();
		await page.locator('.a').click();

		// element('.a').click();
		await page.locator('.a').click();

		// expect($('.a').getText()).toBe('b');
		expect(await page.locator('.a').innerText()).toBe('b');

	});

	test(`remove unnecessary parenthesis`, async ({page}) => {
        setPage(page);

		// ($('.a'));
		page.locator('.a');

		// ($$('.a'));
		page.locator('.a');

		// (element('.a'));
		page.locator('.a');

	});

	test(`convert types`, async ({page}) => {
        setPage(page);

		// const elementFinder: ElementFinder = $('.a');
		const elementFinder: Locator = page.locator('.a');
		await elementFinder.click();

		// const elementArrayFinder: ElementArrayFinder = $$('.a');
		const elementArrayFinder: Locator = page.locator('.a');
		await elementArrayFinder.first().click();

	});

});