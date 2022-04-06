import { test, setPage, getPage, ExpectedConditions } from "../playwright-utils";

test.describe('browser conversion', () => {
	test('should convert right expressions', async ({page}) => {
        setPage(page);

		// ExpectedConditions.titleContains('a');
		ExpectedConditions.titleContains(page, 'a');

		// ExpectedConditions.titleIs('a');
		ExpectedConditions.titleIs(page, 'a');

		// ExpectedConditions.urlContains('a');
		ExpectedConditions.urlContains(page, 'a');

		// ExpectedConditions.urlIs('a');
		ExpectedConditions.urlIs(page, 'a');


	});

	outside();
});

function outside() {

	// ExpectedConditions.titleContains('a');
	ExpectedConditions.titleContains(getPage(), 'a');

	// ExpectedConditions.titleIs('a');
	ExpectedConditions.titleIs(getPage(), 'a');

	// ExpectedConditions.urlContains('a');
	ExpectedConditions.urlContains(getPage(), 'a');

	// ExpectedConditions.urlIs('a');
	ExpectedConditions.urlIs(getPage(), 'a');

}