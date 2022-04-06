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

		// expect($$('.a').count()).toBe(0);
		expect($$('.a').count()).toBe(0);

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
