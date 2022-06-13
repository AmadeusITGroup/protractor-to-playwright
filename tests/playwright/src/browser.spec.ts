/* eslint-disable prefer-rest-params */
import { test, setPage, waitCondition } from "../playwright-utils";

test.describe('browser conversion', () => {
	test('should convert right expressions', async ({page}) => {
        setPage(page);

		// await browser.get('https://playwright.dev/');
		await page.goto('https://playwright.dev/');

		// await browser.get('https://playwright.dev/', 1);
		await page.goto('https://playwright.dev/', {timeout: 1});

		// await browser.wait(async () => true);
		await waitCondition(async () => true);

		// await browser.wait(async () => true, 1);
		await waitCondition(async () => true, 1);

		// await browser.sleep(1);
		await page.waitForTimeout(1);

		// await browser.refresh();
		await page.reload();

		// await browser.refresh(1);
		await page.reload({timeout: 1});

		// await browser.getCurrentUrl();
		page.url();

		// await browser.getTitle();
		await page.title();

	});

	test('should convert executeScript', async ({page}) => {
        setPage(page);

		// browser.executeScript('window.scrollTo(0,0);');
		await page.evaluate('window.scrollTo(0,0);');

		// await browser.executeScript('window.scrollTo(0,0);');
		await page.evaluate('window.scrollTo(0,0);');

		// await browser.executeScript('return window.scrollTo(0,0);');
		await page.evaluate('window.scrollTo(0,0);');

		// await browser.executeScript('console.log("test");return window.scrollTo(0,0);');
		await page.evaluate(function() {console.log("test");return window.scrollTo(0,0);});

		// await browser.executeScript('window.scrollTo(arguments[0], 0);', 0);
		await page.evaluate(function() {window.scrollTo(arguments[0], 0);}, 0);

		// await browser.executeScript('return window.scrollTo(arguments[0], 0);', 0);
		await page.evaluate(function() {return window.scrollTo(arguments[0], 0);}, 0);

		// await browser.executeScript('window.scrollTo(arguments[0], arguments[1]);', 0, 0);
		await page.evaluate(args => {window.scrollTo(args[0], args[1]);}, [0, 0]);

		// await browser.executeScript('return window.scrollTo(arguments[0], arguments[1]);', 0, 0);
		await page.evaluate(args => {return window.scrollTo(args[0], args[1]);}, [0, 0]);

		const args1 = [0, 0];

		// await browser.executeScript('return window.scrollTo(arguments[0], arguments[1]);', ...args1);
		await page.evaluate(args => {return window.scrollTo(args[0], args[1]);}, [...args1]);


		// await browser.executeScript(function() {console.log('test');});
		await page.evaluate(function() {console.log('test');});

		// await browser.executeScript(function(a) {console.log(a);}, 'a');
		await page.evaluate(function(a) {console.log(a);}, 'a');

		// await browser.executeScript(function(a, b) {console.log(a, b);}, 'a', 'b');
		await page.evaluate(function([a, b]) {console.log(a, b);}, ['a', 'b']);

		// await browser.executeScript(function(a, b) {console.log(arguments[0], b);}, 'a', 'b');
		await page.evaluate(function(args) {
            const [a, b] = args;console.log(args[0], b);
        }, ['a', 'b']);

		// await browser.executeScript(function() {console.log(arguments[0], arguments[1]);}, 'a', 'b');
		await page.evaluate(function(args) {
            console.log(args[0], args[1]);
        }, ['a', 'b']);


		// const args2 = ['a', 'b'];
		// await browser.executeScript(function() {console.log(arguments[0], arguments[1]);}, ...args2);
		const args2 = ['a', 'b'];
		await page.evaluate(function(args) {
            console.log(args[0], args[1]);
        }, [...args2]);


		// const fn = function(a, b) {console.log(arguments[0], b);};
		// await browser.executeScript(fn, 'a', 'b');
		const fn = function(a, b) {console.log(arguments[0], b);};
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await page.evaluate(/* FIXME: Arguments have been wrapped in an array, you must reflect this change in the function */ fn, ['a', 'b']);

	});
});