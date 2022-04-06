import { test, setPage } from "../playwright-utils";

test.describe('elementHelper conversion', () => {

	test('should convert right expressions', async ({page}) => {
        setPage(page);

		// element.all('.b');
		page.locator('.b');

	});
});