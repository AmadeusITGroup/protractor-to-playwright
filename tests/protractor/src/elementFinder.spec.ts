import { ElementFinder, element } from 'protractor';

describe('elementFinder conversion', () => {

	let elementFinder: ElementFinder;

	beforeEach(() => {
		elementFinder = element('.a');
	});

	it('should convert right expressions', async () => {

		// await elementFinder.click();
		await elementFinder.click();

		// elementFinder.element('.b');
		elementFinder.element('.b');

		// elementFinder.all('.b');
		elementFinder.all('.b');

		// await elementFinder.click();
		await elementFinder.click();

		// elementFinder.$('.b');
		elementFinder.$('.b');

		// elementFinder.$$('.b');
		elementFinder.$$('.b');

		// await elementFinder.getText();
		await elementFinder.getText();

		// await elementFinder.getWebElement();
		await elementFinder.getWebElement();

		// await elementFinder.getSize();
		await elementFinder.getSize();

		// await elementFinder.getCssValue('');
		await elementFinder.getCssValue('');

		// await elementFinder.clear();
		await elementFinder.clear();

		// await elementFinder.sendKeys('a');
		await elementFinder.sendKeys('a');

		// await elementFinder.isDisplayed();
		await elementFinder.isDisplayed();

		// await elementFinder.isElementPresent('.b');
		await elementFinder.isElementPresent('.b');

		// await elementFinder.isPresent();
		await elementFinder.isPresent();

		// await elementFinder.isSelected();
		await elementFinder.isSelected();

		// await elementFinder.isEnabled();
		await elementFinder.isEnabled();

		// await elementFinder.getAttribute('src');
		await elementFinder.getAttribute('src');

		// await elementFinder.takeScreenshot();
		await elementFinder.takeScreenshot();
	});
});
