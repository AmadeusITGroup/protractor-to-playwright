import { Locator } from "@playwright/test";
import { test, setPage, getCssValue } from "../playwright-utils";

test.describe('elementFinder conversion', () => {

	let elementFinder: Locator;

	test.beforeEach(async ({page}) => {
        setPage(page);
		elementFinder = page.locator('.a');
	});

	test('should convert right expressions', async ({page}) => {
        setPage(page);

		// await elementFinder.click();
		await elementFinder.click();

		// elementFinder.element('.b');
		elementFinder.locator('.b');

		// elementFinder.all('.b');
		elementFinder.locator('.b');

		// await elementFinder.click();
		await elementFinder.click();

		// elementFinder.$('.b');
		elementFinder.locator('.b');

		// elementFinder.$$('.b');
		elementFinder.locator('.b');

		// await elementFinder.getText();
		await elementFinder.innerText();

		// await elementFinder.getWebElement();
		await elementFinder.elementHandle();

		// await elementFinder.getSize();
		await elementFinder.boundingBox();

		// await elementFinder.getCssValue('');
		await getCssValue(elementFinder, '');

		// await elementFinder.clear();
		await elementFinder.fill('');

		// await elementFinder.sendKeys('a');
		await elementFinder.type('a');

		// await elementFinder.isDisplayed();
		await elementFinder.isVisible();

		// await elementFinder.isElementPresent('.b');
		await elementFinder.locator('.b').count().then((count) => count > 0);

		// await elementFinder.isPresent();
		await elementFinder.count().then((count) => count > 0);

		// await elementFinder.isSelected();
		await elementFinder.isChecked();

		// await elementFinder.isEnabled();
		await elementFinder.isEnabled();

		// await elementFinder.getAttribute('src');
		await elementFinder.getAttribute('src');

		// await elementFinder.takeScreenshot();
		await elementFinder.screenshot().then(buffer => buffer.toString('base64'));
	});
});