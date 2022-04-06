import { expect } from "@playwright/test";
import { test, setPage } from "../playwright-utils";

test.describe('callExpression conversion', () => {

	// beforeAll(() => {'/**/'});
	/* FIXME: check if this test must be replaced by test.beforeEach('...', async ({page}) => {...}) */ test.beforeAll(() => {'/**/'});

	// beforeEach(() => {/**/});
	test.beforeEach(async ({page}) => {
        setPage(page);/**/});

	// afterEach(() => {/**/});
	test.afterEach(async ({page}) => {
        setPage(page);/**/});

	// afterAll(() => {/**/});
	/* FIXME: check if this test must be replaced by test.afterEach('...', async ({page}) => {...}) */ test.afterAll(() => {/**/});


	test(`should convert 'elementFinder'`, async ({page}) => {
        setPage(page);

		// await $('.a').click();
		await page.locator('.a').click();


		// await $$('.a').click();
		await page.locator('.a').click();


		// await element('.a').click();
		await page.locator('.a').click();

	});

	test('should convert expect', async ({page}) => {
        setPage(page);

		// expect(true).toBeTruthy();
		expect(true).toBeTruthy();

		// expect($$('.a').count()).toBe(0);
		expect(await page.locator('.a').count()).toBe(0);

	});

	test('should add await when required', async ({page}) => {
        setPage(page);

		// $('.a').click();
		await page.locator('.a').click();

	});

});

test.describe('xdescribe conversion', () => {
    test.skip();

	// xit('shoud convert xit', () => {/**/});
	test.skip('shoud convert xit', async ({page}) => {
        setPage(page);/**/});

});

test.describe.only('fdescribe conversion', () => {

	// fit('shoud convert fit', () => {/**/});
	test.only('shoud convert fit', async ({page}) => {
        setPage(page);/**/});

});