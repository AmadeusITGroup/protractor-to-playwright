import { Locator } from "@playwright/test";
import { getPage } from "../playwright-utils";

export class UtilityClass {
	// async copyTextAlreadyAsyncA(element1: ElementFinder, element2: ElementFinder) {
	async copyTextAlreadyAsyncA(element1: Locator, element2: Locator) {
		// const text = await element1.getText();
		const text = await element1.innerText();
		// element2.sendKeys(text);
		await element2.type(text);
	}

	// callCopyTextAlreadyAsyncA(element1: ElementFinder, element2: ElementFinder) {
	callCopyTextAlreadyAsyncA(element1: Locator, element2: Locator) {
		// return this.copyTextAlreadyAsyncA(element1, element2);
		return this.copyTextAlreadyAsyncA(element1, element2);
	}

	// callFunctionBecomingAsyncA(element: ElementFinder) {
	async callFunctionBecomingAsyncA(element: Locator) {
		// this.clickNotAsyncYetA(element);
		await this.clickNotAsyncYetA(element);
	}

	// clickNotAsyncYetA(element: ElementFinder) {
	async clickNotAsyncYetA(element: Locator) {
		// element.click();
		await element.click();
	}

	// recursiveNotAsyncA(n: number) {
	recursiveNotAsyncA(n: number) {
		if (n <= 0) {
			return 0;
		} else if (n <= 1) {
			return 1;
		}
		// note: do not use such unoptimized code in real life!
		// return this.recursiveNotAsyncA(n-1) + this.recursiveNotAsyncA(n-2);
		return this.recursiveNotAsyncA(n-1) + this.recursiveNotAsyncA(n-2);
	}

	// recursiveNotYetAsyncA(n: number, element: ElementFinder) {
	async recursiveNotYetAsyncA(n: number, element: Locator) {
		if (n <= 0) {
			return 0;
		} else if (n <= 1) {
			return 1;
		}
		// element.sendKeys(`${n}`);
		await element.type(`${n}`);
		// note: do not use such unoptimized code in real life!
		// return this.recursiveNotYetAsyncA(n-1, element) + this.recursiveNotYetAsyncA(n-2, element);
		return await this.recursiveNotYetAsyncA(n-1, element) + await this.recursiveNotYetAsyncA(n-2, element);
	}
}

export const utils = {
	// async copyTextAlreadyAsyncB(element1: ElementFinder, element2: ElementFinder) {
	async copyTextAlreadyAsyncB(element1: Locator, element2: Locator) {
		// const text = await element1.getText();
		const text = await element1.innerText();
		// element2.sendKeys(text);
		await element2.type(text);
	},

	// callCopyTextAlreadyAsyncB(element1: ElementFinder, element2: ElementFinder) {
	callCopyTextAlreadyAsyncB(element1: Locator, element2: Locator) {
		// return this.copyTextAlreadyAsyncB(element1, element2);
		return this.copyTextAlreadyAsyncB(element1, element2);
	},

	// callFunctionBecomingAsyncB(element: ElementFinder) {
	async callFunctionBecomingAsyncB(element: Locator) {
		// utils.clickNotAsyncYetB(element);
		await utils.clickNotAsyncYetB(element);
	},

	// clickNotAsyncYetB(element: ElementFinder) {
	async clickNotAsyncYetB(element: Locator) {
		// element.click();
		await element.click();
	},

	// clickNotAsyncYetFnExpression: function (element: ElementFinder) {
	clickNotAsyncYetFnExpression: async function (element: Locator) {
		// element.click();
		await element.click();
	},

	// callClickNotAsyncYetFnExpression: function (element: ElementFinder) {
	callClickNotAsyncYetFnExpression: async function (element: Locator) {
		// utils.clickNotAsyncYetFnExpression(element);
		await utils.clickNotAsyncYetFnExpression(element);
	},

	// clickNotAsyncYetArrowFn: (element: ElementFinder) => {
	clickNotAsyncYetArrowFn: async (element: Locator) => {
		// element.click();
		await element.click();
	},

	// callClickNotAsyncYetArrowFn: (element: ElementFinder) => {
	callClickNotAsyncYetArrowFn: async (element: Locator) => {
		// utils.clickNotAsyncYetArrowFn(element);
		await utils.clickNotAsyncYetArrowFn(element);
	},

	// recursiveNotAsyncB(n: number) {
	recursiveNotAsyncB(n: number) {
		if (n <= 0) {
			return 0;
		} else if (n <= 1) {
			return 1;
		}
		// note: do not use such unoptimized code in real life!
		// return utils.recursiveNotAsyncB(n-1) + utils.recursiveNotAsyncB(n-2);
		return utils.recursiveNotAsyncB(n-1) + utils.recursiveNotAsyncB(n-2);
	},

	// recursiveNotYetAsyncB(n: number, element: ElementFinder) {
	async recursiveNotYetAsyncB(n: number, element: Locator) {
		if (n <= 0) {
			return 0;
		} else if (n <= 1) {
			return 1;
		}
		// element.sendKeys(`${n}`);
		await element.type(`${n}`);
		// note: do not use such unoptimized code in real life!
		// return utils.recursiveNotYetAsyncB(n-1, element) + utils.recursiveNotYetAsyncB(n-2, element);
		return await utils.recursiveNotYetAsyncB(n-1, element) + await utils.recursiveNotYetAsyncB(n-2, element);
	},
}

// export async function copyTextAlreadyAsyncC(element1: ElementFinder, element2: ElementFinder) {
export async function copyTextAlreadyAsyncC(element1: Locator, element2: Locator) {
	// const text = await element1.getText();
	const text = await element1.innerText();
	// element2.sendKeys(text);
	await element2.type(text);
}

// export function callCopyTextAlreadyAsyncC(element1: ElementFinder, element2: ElementFinder) {
export function callCopyTextAlreadyAsyncC(element1: Locator, element2: Locator) {
	// return copyTextAlreadyAsyncC(element1, element2);
	return copyTextAlreadyAsyncC(element1, element2);
}

// export function callFunctionBecomingAsyncC(element: ElementFinder) {
export async function callFunctionBecomingAsyncC(element: Locator) {
	// clickNotAsyncYetC(element);
	await clickNotAsyncYetC(element);
}

// export function clickNotAsyncYetC(element: ElementFinder) {
export async function clickNotAsyncYetC(element: Locator) {
	// element.click();
	await element.click();
}

const myUtils = {
	clickNotAsyncYetC: clickNotAsyncYetC,
};

// export const callMyUtilsClickNotAsyncYetC = (element: ElementFinder) => {
export const callMyUtilsClickNotAsyncYetC = async (element: Locator) => {
	// myUtils.clickNotAsyncYetC(element);
	await myUtils.clickNotAsyncYetC(element);
};

const copyClickNotAsyncYetC = clickNotAsyncYetC;

// export const callCopyClickNotAsyncYetC = (element: ElementFinder) => {
export const callCopyClickNotAsyncYetC = async (element: Locator) => {
	// copyClickNotAsyncYetC(element);
	await copyClickNotAsyncYetC(element);
};

// export function recursiveNotAsyncC(n: number) {
export function recursiveNotAsyncC(n: number) {
	if (n <= 0) {
		return 0;
	} else if (n <= 1) {
		return 1;
	}
	// note: do not use such unoptimized code in real life!
	// return recursiveNotAsyncC(n-1) + recursiveNotAsyncC(n-2);
	return recursiveNotAsyncC(n-1) + recursiveNotAsyncC(n-2);
}

// export function recursiveNotYetAsyncC(n: number, element: ElementFinder) {
export async function recursiveNotYetAsyncC(n: number, element: Locator) {
	if (n <= 0) {
		return 0;
	} else if (n <= 1) {
		return 1;
	}
	// element.sendKeys(`${n}`);
	await element.type(`${n}`);
	// note: do not use such unoptimized code in real life!
	// return recursiveNotYetAsyncC(n-1, element) + recursiveNotYetAsyncC(n-2, element);
	return await recursiveNotYetAsyncC(n-1, element) + await recursiveNotYetAsyncC(n-2, element);
}

// export const callCallClickNotAsyncYetA = function (c: UtilityClass, element: ElementFinder) {
export const callCallClickNotAsyncYetA = async function (c: UtilityClass, element: Locator) {
	// callClickNotAsyncYetA(c, element);
	await callClickNotAsyncYetA(c, element);
}

// export const callClickNotAsyncYetA = (c: UtilityClass, element: ElementFinder) => {
export const callClickNotAsyncYetA = async (c: UtilityClass, element: Locator) => {
	// c.clickNotAsyncYetA(element);
	await c.clickNotAsyncYetA(element);
}

// export const alreadyReturnsProtractorPromise = (element: ElementFinder) => {
export const alreadyReturnsProtractorPromise = async (element: Locator) => {
	// element.click();
	await element.click();
	// return element.click();
	return element.click();
};

// export const callAlreadyReturnsProtractorPromise = (element: ElementFinder) => {
export const callAlreadyReturnsProtractorPromise = (element: Locator) => {
	// const promise = alreadyReturnsProtractorPromise(element);
	const promise = alreadyReturnsProtractorPromise(element);
	// return promise.then(() => {
	return promise.then(() => {
		console.log("here");
	});
};

// export const alreadyReturnsStdPromise = (element: ElementFinder) => {
export const alreadyReturnsStdPromise = async (element: Locator) => {
	// element.click();
	await element.click();
	// return Promise.resolve(element.click());
	return Promise.resolve(element.click());
};

// export const callAlreadyReturnsStdPromise = (element: ElementFinder) => {
export const callAlreadyReturnsStdPromise = (element: Locator) => {
	// const promise = alreadyReturnsStdPromise(element);
	const promise = alreadyReturnsStdPromise(element);
	// return promise.then(() => {
	return promise.then(() => {
		console.log("here");
	});
};

// innerFunction itself should not become async, but the function
// returned by innerFunction should become async
// export const innerFunction = (element: ElementFinder) => {
export const innerFunction = (element: Locator) => {
	// return () => {
	return async () => {
		// element.click();
		await element.click();
		// element.click();
		await element.click();
	};
};

// export const callInnerFunction = (element: ElementFinder) => {
export const callInnerFunction = (element: Locator) => {
	// const myFunction = innerFunction(element);
	const myFunction = innerFunction(element);
	return myFunction;
};

class MyPageObject {
	public async clickOnItem(search: string) {
		const element = getPage().locator(search);
		await element.click();
		return element;
	}
}

export const clearItem = async (pageObject: MyPageObject) => {
	await (await pageObject.clickOnItem('recipientAddress')).fill('');
};