import { by } from 'protractor';

describe('protractorBy conversion', () => {

	it('should convert right expressions', async () => {

		// by.tagName('a');
		by.tagName('a');

		// by.css('.a');
		by.css('.a');

		// by.cssContainingText('a', 'b');
		by.cssContainingText('a', 'b');

		// by.linkText('b');
		by.linkText('b');

		// by.partialLinkText('b');
		by.partialLinkText('b');

		// by.buttonText('a');
		by.buttonText('a');

		// by.partialButtonText('a');
		by.partialButtonText('a');

		// by.className('a');
		by.className('a');

		// by.id('a');
		by.id('a');

		// by.xpath('a');
		by.xpath('a');

		// by.name('a');
		by.name('a');

	});
});
