import { Locator } from "@playwright/test";
import { test, setPage, makeLocatorArray, locatorMap } from "../playwright-utils";

test.describe('elementFinder conversion', () => {

	let elementArrayFinder: Locator;

	test.beforeEach(async ({page}) => {
        setPage(page);
		elementArrayFinder = page.locator('.a');
	});

	test('should convert right expressions', async ({page}) => {
        setPage(page);

		// elementArrayFinder.element('.b');
		elementArrayFinder.locator('.b');

		// elementArrayFinder.all('.b');
		elementArrayFinder.locator('.b');

		// elementArrayFinder.$('.b');
		elementArrayFinder.locator('.b');

		// elementArrayFinder.$$('.b');
		elementArrayFinder.locator('.b');

		// elementArrayFinder.get(0);
		elementArrayFinder.nth(0);

		// await elementArrayFinder.getText();
		await elementArrayFinder.allInnerTexts();

		// await elementArrayFinder.getText();
		await elementArrayFinder.allInnerTexts();

		// await elementArrayFinder.getAttribute('src');
		await locatorMap(elementArrayFinder, (locator) => locator.getAttribute('src'));

		// await elementArrayFinder.map(element => element);
		await locatorMap(elementArrayFinder, element => element);

		// await elementArrayFinder.each(element => element);
		await locatorMap(elementArrayFinder, element => element);

		// elementArrayFinder.filter(element => element === element);
		(await makeLocatorArray(elementArrayFinder))./* FIXME: filter must be managed specifically */filter(element => element === element);

		// await elementArrayFinder.count();
		await elementArrayFinder.count();

		// elementArrayFinder.first();
		elementArrayFinder.first();

		// elementArrayFinder.last();
		elementArrayFinder.last();

	});
});