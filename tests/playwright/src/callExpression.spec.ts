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

		// expect(true).toBeTruthy("true should be truthy");
		expect(true, 'true should be truthy').toBeTruthy();

		// expect(true).withContext("true should be truthy").toBeTruthy();
		expect(true, 'true should be truthy').toBeTruthy();

		// expect(true).withContext("true should be truthy").toBeTruthy("true should really be truthy");
		expect(true, 'true should be truthy, true should really be truthy').toBeTruthy();

		// expect(true).withContext("a").withContext("b").toBeTruthy();
		expect(true, 'a, b').toBeTruthy();

		// expect(true).withContext("a").withContext("b").toBeTruthy("c");
		expect(true, 'a, b, c').toBeTruthy();

		// expect(true).withContext("a").toBeTruthy("b");
		expect(true, 'a, b').toBeTruthy();

		// expect(false).not.toBeTruthy();
		expect(false).not.toBeTruthy();

		// expect(false).not.toBeTruthy("false should not be truthy");
		expect(false, 'false should not be truthy').not.toBeTruthy();

		// expect(["something"]).toContain("something");
		expect(["something"]).toContain("something");

		// expect(["something"]).toContain("something", "should contain 'something'");
		expect(["something"], 'should contain \'something\'').toContain("something");

		// expect(["something"]).not.toContain("wrong");
		expect(["something"]).not.toContain("wrong");

		// expect(["something"]).not.toContain("wrong", "should not contain 'wrong'");
		expect(["something"], 'should not contain \'wrong\'').not.toContain("wrong");

		// expect($$('.a').count()).toBe(0);
		expect(await page.locator('.a').count()).toBe(0);

		const zero = 0;
		// expect($$('.a').count()).toBe(0, "should have " + zero + " .a element");
		expect(await page.locator('.a').count(), `should have ${zero} .a element`).toBe(0);
	});

	test('should add await when required', async ({page}) => {
        setPage(page);

		// $('.a').click();
		await page.locator('.a').click();

	});

	test('should not add await when not required', async ({page}) => {
        setPage(page);
		let promise;

		// promise = $('.a').click();
		promise = page.locator('.a').click();

		await promise;

		// promise = $('.a').click();
		promise = page.locator('.a').click();

		await promise;
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