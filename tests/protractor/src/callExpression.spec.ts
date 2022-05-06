import { element, $, $$ } from 'protractor';

describe('callExpression conversion', () => {

	// beforeAll(() => {'/**/'});
	beforeAll(() => {'/**/'});

	// beforeEach(() => {/**/});
	beforeEach(() => {/**/});

	// afterEach(() => {/**/});
	afterEach(() => {/**/});

	// afterAll(() => {/**/});
	afterAll(() => {/**/});


	it(`should convert 'elementFinder'`, async () => {

		// await $('.a').click();
		await $('.a').click();


		// await $$('.a').click();
		await $$('.a').click();


		// await element('.a').click();
		await element('.a').click();

	});

	it('should convert expect', async () => {

		// expect(true).toBeTruthy();
		expect(true).toBeTruthy();

		// expect(true).toBeTruthy("true should be truthy");
		expect(true).toBeTruthy("true should be truthy");

		// expect(true).withContext("true should be truthy").toBeTruthy();
		expect(true).withContext("true should be truthy").toBeTruthy();

		// expect(true).withContext("true should be truthy").toBeTruthy("true should really be truthy");
		expect(true).withContext("true should be truthy").toBeTruthy("true should really be truthy");

		// expect(true).withContext("a").withContext("b").toBeTruthy();
		expect(true).withContext("a").withContext("b").toBeTruthy();

		// expect(true).withContext("a").withContext("b").toBeTruthy("c");
		expect(true).withContext("a").withContext("b").toBeTruthy("c");

		// expect(true).withContext("a").toBeTruthy("b");
		expect(true).withContext("a").toBeTruthy("b");

		// expect(false).not.toBeTruthy();
		expect(false).not.toBeTruthy();

		// expect(false).not.toBeTruthy("false should not be truthy");
		expect(false).not.toBeTruthy("false should not be truthy");

		// expect(["something"]).toContain("something");
		expect(["something"]).toContain("something");

		// expect(["something"]).toContain("something", "should contain 'something'");
		expect(["something"]).toContain("something", "should contain 'something'");

		// expect(["something"]).not.toContain("wrong");
		expect(["something"]).not.toContain("wrong");

		// expect(["something"]).not.toContain("wrong", "should not contain 'wrong'");
		expect(["something"]).not.toContain("wrong", "should not contain 'wrong'");

		// expect($$('.a').count()).toBe(0);
		expect($$('.a').count()).toBe(0);

		const zero = 0;
		// expect($$('.a').count()).toBe(0, "should have " + zero + " .a element");
		expect($$('.a').count()).toBe(0, "should have " + zero + " .a element");
	});

	it('should add await when required', async () => {

		// $('.a').click();
		$('.a').click();

	});

});

xdescribe('xdescribe conversion', () => {

	// xit('shoud convert xit', () => {/**/});
	xit('shoud convert xit', () => {/**/});

});

fdescribe('fdescribe conversion', () => {

	// fit('shoud convert fit', () => {/**/});
	fit('shoud convert fit', () => {/**/});

});
