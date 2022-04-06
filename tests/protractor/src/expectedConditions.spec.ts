import { ExpectedConditions } from 'protractor';

describe('browser conversion', () => {
	it('should convert right expressions', async () => {

		// ExpectedConditions.titleContains('a');
		ExpectedConditions.titleContains('a');

		// ExpectedConditions.titleIs('a');
		ExpectedConditions.titleIs('a');

		// ExpectedConditions.urlContains('a');
		ExpectedConditions.urlContains('a');

		// ExpectedConditions.urlIs('a');
		ExpectedConditions.urlIs('a');


	});

	outside();
});

function outside() {

	// ExpectedConditions.titleContains('a');
	ExpectedConditions.titleContains('a');

	// ExpectedConditions.titleIs('a');
	ExpectedConditions.titleIs('a');

	// ExpectedConditions.urlContains('a');
	ExpectedConditions.urlContains('a');

	// ExpectedConditions.urlIs('a');
	ExpectedConditions.urlIs('a');

}
