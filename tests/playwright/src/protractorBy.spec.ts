import { test, setPage } from "../playwright-utils";

test.describe('protractorBy conversion', () => {

	test('should convert right expressions', async ({page}) => {
        setPage(page);

		// by.tagName('a');
		'a';

		// by.css('.a');
		'.a';

		// by.cssContainingText('a', 'b');
		'a >> text=b';

		// by.linkText('b');
		'*css=a:visible >> text="b"';

		// by.partialLinkText('b');
		'*css=a:visible >> text=b';

		// by.buttonText('a');
		'*css=button, input[type="button"], input[type="submit"] >> text="a"';

		// by.partialButtonText('a');
		'*css=button, input[type="button"], input[type="submit"] >> text=a';

		// by.className('a');
		'.a';

		// by.id('a');
		'#a';

		// by.xpath('a');
		'xpath=a';


	});
});