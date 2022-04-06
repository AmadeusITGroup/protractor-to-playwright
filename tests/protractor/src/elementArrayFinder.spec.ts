import { ElementArrayFinder, $$ } from 'protractor';

describe('elementFinder conversion', () => {

	let elementArrayFinder: ElementArrayFinder;

	beforeEach(() => {
		elementArrayFinder = $$('.a');
	});

	it('should convert right expressions', async () => {

		// elementArrayFinder.element('.b');
		elementArrayFinder.element('.b');

		// elementArrayFinder.all('.b');
		elementArrayFinder.all('.b');

		// elementArrayFinder.$('.b');
		elementArrayFinder.$('.b');

		// elementArrayFinder.$$('.b');
		elementArrayFinder.$$('.b');

		// elementArrayFinder.get(0);
		elementArrayFinder.get(0);

		// await elementArrayFinder.getText();
		await elementArrayFinder.getText();

		// await elementArrayFinder.getText();
		await elementArrayFinder.getText();

		// await elementArrayFinder.getAttribute('src');
		await elementArrayFinder.getAttribute('src');

		// await elementArrayFinder.map(element => element);
		await elementArrayFinder.map(element => element);

		// await elementArrayFinder.each(element => element);
		await elementArrayFinder.each(element => element);

		// elementArrayFinder.filter(element => element === element);
		elementArrayFinder.filter(element => element === element);

		// await elementArrayFinder.count();
		await elementArrayFinder.count();

		// elementArrayFinder.first();
		elementArrayFinder.first();

		// elementArrayFinder.last();
		elementArrayFinder.last();

	});
});
