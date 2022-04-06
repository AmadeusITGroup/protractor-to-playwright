import { getPage } from "../playwright-utils";

// This test checks that the unnecessary imports are not imported in Playwright, for example 'test', 'expect', ...
export class PageObject {

	get selector() {
		return getPage().locator('.a');
	}

}