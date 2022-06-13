/* eslint-disable prefer-rest-params */
import {browser } from 'protractor';

describe('browser conversion', () => {
	it('should convert right expressions', async () => {

		// await browser.get('https://playwright.dev/');
		await browser.get('https://playwright.dev/');

		// await browser.get('https://playwright.dev/', 1);
		await browser.get('https://playwright.dev/', 1);

		// await browser.wait(async () => true);
		await browser.wait(async () => true);

		// await browser.wait(async () => true, 1);
		await browser.wait(async () => true, 1);

		// await browser.sleep(1);
		await browser.sleep(1);

		// await browser.refresh();
		await browser.refresh();

		// await browser.refresh(1);
		await browser.refresh(1);

		// await browser.getCurrentUrl();
		await browser.getCurrentUrl();

		// await browser.getTitle();
		await browser.getTitle();

	});

	it('should convert executeScript', async () => {

		// browser.executeScript('window.scrollTo(0,0);');
		browser.executeScript('window.scrollTo(0,0);');

		// await browser.executeScript('window.scrollTo(0,0);');
		await browser.executeScript('window.scrollTo(0,0);');

		// await browser.executeScript('return window.scrollTo(0,0);');
		await browser.executeScript('return window.scrollTo(0,0);');

		// await browser.executeScript('console.log("test");return window.scrollTo(0,0);');
		await browser.executeScript('console.log("test");return window.scrollTo(0,0);');

		// await browser.executeScript('window.scrollTo(arguments[0], 0);', 0);
		await browser.executeScript('window.scrollTo(arguments[0], 0);', 0);

		// await browser.executeScript('return window.scrollTo(arguments[0], 0);', 0);
		await browser.executeScript('return window.scrollTo(arguments[0], 0);', 0);

		// await browser.executeScript('window.scrollTo(arguments[0], arguments[1]);', 0, 0);
		await browser.executeScript('window.scrollTo(arguments[0], arguments[1]);', 0, 0);

		// await browser.executeScript('return window.scrollTo(arguments[0], arguments[1]);', 0, 0);
		await browser.executeScript('return window.scrollTo(arguments[0], arguments[1]);', 0, 0);

		const args1 = [0, 0];

		// await browser.executeScript('return window.scrollTo(arguments[0], arguments[1]);', ...args1);
		await browser.executeScript('return window.scrollTo(arguments[0], arguments[1]);', ...args1);


		// await browser.executeScript(function() {console.log('test');});
		await browser.executeScript(function() {console.log('test');});

		// await browser.executeScript(function(a) {console.log(a);}, 'a');
		await browser.executeScript(function(a) {console.log(a);}, 'a');

		// await browser.executeScript(function(a, b) {console.log(a, b);}, 'a', 'b');
		await browser.executeScript(function(a, b) {console.log(a, b);}, 'a', 'b');

		// await browser.executeScript(function(a, b) {console.log(arguments[0], b);}, 'a', 'b');
		await browser.executeScript(function(a, b) {console.log(arguments[0], b);}, 'a', 'b');

		// await browser.executeScript(function() {console.log(arguments[0], arguments[1]);}, 'a', 'b');
		await browser.executeScript(function() {console.log(arguments[0], arguments[1]);}, 'a', 'b');


		// const args2 = ['a', 'b'];
		// await browser.executeScript(function() {console.log(arguments[0], arguments[1]);}, ...args2);
		const args2 = ['a', 'b'];
		await browser.executeScript(function() {console.log(arguments[0], arguments[1]);}, ...args2);


		// const fn = function(a, b) {console.log(arguments[0], b);};
		// await browser.executeScript(fn, 'a', 'b');
		const fn = function(a, b) {console.log(arguments[0], b);};
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await browser.executeScript(fn, 'a', 'b');

	});
});
