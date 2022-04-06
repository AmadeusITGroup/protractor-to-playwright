import { element, $, $$, ElementFinder, ElementArrayFinder } from "protractor";

describe('common conversion', () => {

	it(`convert 'await $$'`, async () => {

		// const elements = await $$('.a');
		// elements.length;
		const elements = await $$('.a');
		elements.length;

		// (await $$('.a')).length;
		(await $$('.a')).length;


		// const array = ['a', 'b'].map(a => $$(a));
		// await array;
		// Ensure that await ElementArrayFinder[] is not converted to makeLocatorArray
		const array = ['a', 'b'].map(a => $$(a));
		await array;

	});

	it(`add necessary 'await'`, async () => {

		// $('.a').click();
		$('.a').click();

		// $$('.a').click();
		$$('.a').click();

		// element('.a').click();
		element('.a').click();

		// expect($('.a').getText()).toBe('b');
		expect($('.a').getText()).toBe('b');

	});

	it(`remove unnecessary parenthesis`, async () => {

		// ($('.a'));
		($('.a'));

		// ($$('.a'));
		($$('.a'));

		// (element('.a'));
		(element('.a'));

	});

	it(`convert types`, async () => {

		// const elementFinder: ElementFinder = $('.a');
		const elementFinder: ElementFinder = $('.a');
		elementFinder.click();

		// const elementArrayFinder: ElementArrayFinder = $$('.a');
		const elementArrayFinder: ElementArrayFinder = $$('.a');
		elementArrayFinder.first().click();

	});

});
