import {test as base, Locator, Page} from '@playwright/test';

let currentPage: Page | null;

/**
 * Get the [Playwright page object](https://playwright.dev/docs/api/class-page) previously stored by {@link setPage}
 * @returns
 */
export function getPage(): Page {
	if (!currentPage) {
		throw new Error('Playwright page not initialized, it must be done by using {page} in the test function parameter.');
	}
	return currentPage;
}

/**
 * Cache the given page to be retrieved later and used when the page is not directly accessible,
 * for example in page objects.
 * The stored page is cleared after each test, to be sure to not use an outdated reference.
 * @param page The [Playwright page object](https://playwright.dev/docs/api/class-page)
 *
 */
export function setPage(page: Page) {
	currentPage = page;
}

export const test = base.extend({
	page: async ({ page }, use) => {
		try {
			await use(page);
		} finally {
			currentPage = null;
		}
	}
});

/**
 * Code based on the [Protractor ExpectedConditions](https://github.com/angular/protractor/blob/master/lib/expectedConditions.ts)
 */
export class ExpectedConditions {

	static not(expectedCondition: Function): (() => Promise<boolean>) {
		return async(): Promise<boolean> => {
			const bool = await expectedCondition();
			return !bool;
		};
	}

	/**
	 * Helper function that is equivalent to the logical_and if defaultRet==true,
	 * or logical_or if defaultRet==false
	 *
	 * @param {boolean} defaultRet
	 * @param {Array.<Function>} fns An array of expected conditions to chain.
	 *
	 * @returns {!function} An expected condition that returns a promise which
	 *     evaluates to the result of the logical chain.
	 */
	private static logicalChain_(defaultRet: boolean, fns: Array<Function>): (() => Promise<boolean>) {
		return async(): Promise<boolean> => {
			if (fns.length === 0) {
				return defaultRet;
			}
			const fn = fns[0];
			const bool = await fn();
			if (bool === defaultRet) {
				return ExpectedConditions.logicalChain_(defaultRet, fns.slice(1))();
			} else {
				return !defaultRet;
			}
		};
	}

	static and(...args: Function[]): (() => Promise<boolean>) {
		return ExpectedConditions.logicalChain_(true, args);
	}

	static or(...args: Function[]): (() => Promise<boolean>) {
		return ExpectedConditions.logicalChain_(false, args);
	}

	static alertIsPresent() {
		throw 'alertIsPresent usage must be refactored';
	}

	static elementToBeClickable(locator: Locator) {
		return ExpectedConditions.and(ExpectedConditions.visibilityOf(locator), () => locator.isEnabled());
	}

	static textToBePresentInElement(locator: Locator, text: string): (() => Promise<boolean>) {
		const hasText = async () => {
			try {
				const actualText = await locator.innerHTML();
				return actualText.replace(/\r?\n|\r/g, '').indexOf(text) > -1;
			} catch (e) {
				return false;
			}
		};
		return ExpectedConditions.and(ExpectedConditions.presenceOf(locator), hasText);
	}

	static textToBePresentInElementValue(locator: Locator, text: string): (() => Promise<boolean>) {
		const hasText = async () => {
			try {
				const actualText = await locator.inputValue();
				return actualText.indexOf(text) > -1;
			} catch (e) {
				return false;
			}
		};
		return ExpectedConditions.and(ExpectedConditions.presenceOf(locator), hasText);
	}

	static titleContains(page: Page, title: string): (() => Promise<boolean>) {
		return async(): Promise<boolean> => {
			const actualTitle = await page.title();
			return actualTitle.indexOf(title) > -1;
		};
	}

	static titleIs(page: Page, title: string): (() => Promise<boolean>) {
		return async(): Promise<boolean> => {
			const actualTitle = await page.title();
			return actualTitle === title;
		};
	}

	static urlContains(page: Page, url: string): (() => Promise<boolean>) {
		return async(): Promise<boolean> => {
			const actualUrl = page.url();
			return actualUrl.indexOf(url) > -1;
		};
	}

	static urlIs(page: Page, url: string): (() => Promise<boolean>) {
		return async(): Promise<boolean> => {
			const actualUrl = page.url();
			return actualUrl === url;
		};
	}

	static presenceOf(locator: Locator): (() => Promise<boolean>) {
		return async function() {
			return (await locator.count())  > 0;
		}
	}

	static stalenessOf(locator: Locator): (() => Promise<boolean>) {
		return ExpectedConditions.not(ExpectedConditions.presenceOf(locator));
	}

	static visibilityOf(locator: Locator): (() => Promise<boolean>) {
		return () => locator.isVisible();
	}

	static invisibilityOf(locator: Locator): (() => Promise<boolean>) {
		return ExpectedConditions.not(ExpectedConditions.visibilityOf(locator));
	}

	static elementToBeSelected(locator: Locator): (() => Promise<boolean>) {
		return ExpectedConditions.and(ExpectedConditions.presenceOf(locator), () => locator.isChecked());
	}
}


function isPromise(obj): obj is (Promise<any>) {
	return !!(obj && obj.then);
}

export function waitCondition<T>(condition: Promise<T> | (() => Promise<T>), opt_timeout = 30000, opt_message = '', pollTimeout = 200): Promise<T> {
	return isPromise(condition) ? condition : new Promise((resolve, reject) => {
		const timeoutTime = Date.now() + opt_timeout;
		const timeoutFn = async function () {
			const conditionValue = await condition();
			if (conditionValue) {
				resolve(conditionValue);
			} else if (Date.now() > timeoutTime) {
				reject('waitCondition timeout' + (opt_message ? ': ' + opt_message : ''));
			} else {
				setTimeout(timeoutFn, pollTimeout);
			}
		};
		setTimeout(timeoutFn, pollTimeout);
	});
}

export async function makeLocatorArray(locator: Locator): Promise<Locator[]> {
	return Array.from({length: await locator.count()}, (_, i) => locator.nth(i));
}

export async function locatorMap<T>(locator: Locator, fn: (Locator) => T | Promise<T>): Promise<Array<T>> {
	const count = await locator.count();
	const result: any[] = [];
	for(let i = 0; i < count; i++) {
		result[i] = fn(locator.nth(i));
	}
	return Promise.all(result);
}
export async function getCssValue(locator: Locator, cssProperty: string) {
	return await locator.evaluate((el, _cssProperty) => {
		return window.getComputedStyle(el).getPropertyValue(_cssProperty);
	}, cssProperty)
}
