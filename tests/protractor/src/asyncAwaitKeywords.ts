import { $, ElementFinder } from 'protractor';

export class UtilityClass {
	// async copyTextAlreadyAsyncA(element1: ElementFinder, element2: ElementFinder) {
	async copyTextAlreadyAsyncA(element1: ElementFinder, element2: ElementFinder) {
		// const text = await element1.getText();
		const text = await element1.getText();
		// element2.sendKeys(text);
		element2.sendKeys(text);
	}

	// callCopyTextAlreadyAsyncA(element1: ElementFinder, element2: ElementFinder) {
	callCopyTextAlreadyAsyncA(element1: ElementFinder, element2: ElementFinder) {
		// return this.copyTextAlreadyAsyncA(element1, element2);
		return this.copyTextAlreadyAsyncA(element1, element2);
	}

	// callFunctionBecomingAsyncA(element: ElementFinder) {
	callFunctionBecomingAsyncA(element: ElementFinder) {
		// this.clickNotAsyncYetA(element);
		this.clickNotAsyncYetA(element);
	}

	// clickNotAsyncYetA(element: ElementFinder) {
	clickNotAsyncYetA(element: ElementFinder) {
		// element.click();
		element.click();
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
	recursiveNotYetAsyncA(n: number, element: ElementFinder) {
		if (n <= 0) {
			return 0;
		} else if (n <= 1) {
			return 1;
		}
		// element.sendKeys(`${n}`);
		element.sendKeys(`${n}`);
		// note: do not use such unoptimized code in real life!
		// return this.recursiveNotYetAsyncA(n-1, element) + this.recursiveNotYetAsyncA(n-2, element);
		return this.recursiveNotYetAsyncA(n-1, element) + this.recursiveNotYetAsyncA(n-2, element);
	}
}

export const utils = {
	// async copyTextAlreadyAsyncB(element1: ElementFinder, element2: ElementFinder) {
	async copyTextAlreadyAsyncB(element1: ElementFinder, element2: ElementFinder) {
		// const text = await element1.getText();
		const text = await element1.getText();
		// element2.sendKeys(text);
		element2.sendKeys(text);
	},

	// callCopyTextAlreadyAsyncB(element1: ElementFinder, element2: ElementFinder) {
	callCopyTextAlreadyAsyncB(element1: ElementFinder, element2: ElementFinder) {
		// return this.copyTextAlreadyAsyncB(element1, element2);
		return this.copyTextAlreadyAsyncB(element1, element2);
	},

	// callFunctionBecomingAsyncB(element: ElementFinder) {
	callFunctionBecomingAsyncB(element: ElementFinder) {
		// utils.clickNotAsyncYetB(element);
		utils.clickNotAsyncYetB(element);
	},

	// clickNotAsyncYetB(element: ElementFinder) {
	clickNotAsyncYetB(element: ElementFinder) {
		// element.click();
		element.click();
	},

	// clickNotAsyncYetFnExpression: function (element: ElementFinder) {
	clickNotAsyncYetFnExpression: function (element: ElementFinder) {
		// element.click();
		element.click();
	},

	// callClickNotAsyncYetFnExpression: function (element: ElementFinder) {
	callClickNotAsyncYetFnExpression: function (element: ElementFinder) {
		// utils.clickNotAsyncYetFnExpression(element);
		utils.clickNotAsyncYetFnExpression(element);
	},

	// clickNotAsyncYetArrowFn: (element: ElementFinder) => {
	clickNotAsyncYetArrowFn: (element: ElementFinder) => {
		// element.click();
		element.click();
	},

	// callClickNotAsyncYetArrowFn: (element: ElementFinder) => {
	callClickNotAsyncYetArrowFn: (element: ElementFinder) => {
		// utils.clickNotAsyncYetArrowFn(element);
		utils.clickNotAsyncYetArrowFn(element);
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
	recursiveNotYetAsyncB(n: number, element: ElementFinder) {
		if (n <= 0) {
			return 0;
		} else if (n <= 1) {
			return 1;
		}
		// element.sendKeys(`${n}`);
		element.sendKeys(`${n}`);
		// note: do not use such unoptimized code in real life!
		// return utils.recursiveNotYetAsyncB(n-1, element) + utils.recursiveNotYetAsyncB(n-2, element);
		return utils.recursiveNotYetAsyncB(n-1, element) + utils.recursiveNotYetAsyncB(n-2, element);
	},
}

// export async function copyTextAlreadyAsyncC(element1: ElementFinder, element2: ElementFinder) {
export async function copyTextAlreadyAsyncC(element1: ElementFinder, element2: ElementFinder) {
	// const text = await element1.getText();
	const text = await element1.getText();
	// element2.sendKeys(text);
	element2.sendKeys(text);
}

// export function callCopyTextAlreadyAsyncC(element1: ElementFinder, element2: ElementFinder) {
export function callCopyTextAlreadyAsyncC(element1: ElementFinder, element2: ElementFinder) {
	// return copyTextAlreadyAsyncC(element1, element2);
	return copyTextAlreadyAsyncC(element1, element2);
}

// export function callFunctionBecomingAsyncC(element: ElementFinder) {
export function callFunctionBecomingAsyncC(element: ElementFinder) {
	// clickNotAsyncYetC(element);
	clickNotAsyncYetC(element);
}

// export function clickNotAsyncYetC(element: ElementFinder) {
export function clickNotAsyncYetC(element: ElementFinder) {
	// element.click();
	element.click();
}

const myUtils = {
	clickNotAsyncYetC: clickNotAsyncYetC,
};

// export const callMyUtilsClickNotAsyncYetC = (element: ElementFinder) => {
export const callMyUtilsClickNotAsyncYetC = (element: ElementFinder) => {
	// myUtils.clickNotAsyncYetC(element);
	myUtils.clickNotAsyncYetC(element);
};

const copyClickNotAsyncYetC = clickNotAsyncYetC;

// export const callCopyClickNotAsyncYetC = (element: ElementFinder) => {
export const callCopyClickNotAsyncYetC = (element: ElementFinder) => {
	// copyClickNotAsyncYetC(element);
	copyClickNotAsyncYetC(element);
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
export function recursiveNotYetAsyncC(n: number, element: ElementFinder) {
	if (n <= 0) {
		return 0;
	} else if (n <= 1) {
		return 1;
	}
	// element.sendKeys(`${n}`);
	element.sendKeys(`${n}`);
	// note: do not use such unoptimized code in real life!
	// return recursiveNotYetAsyncC(n-1, element) + recursiveNotYetAsyncC(n-2, element);
	return recursiveNotYetAsyncC(n-1, element) + recursiveNotYetAsyncC(n-2, element);
}

// export const callCallClickNotAsyncYetA = function (c: UtilityClass, element: ElementFinder) {
export const callCallClickNotAsyncYetA = function (c: UtilityClass, element: ElementFinder) {
	// callClickNotAsyncYetA(c, element);
	callClickNotAsyncYetA(c, element);
}

// export const callClickNotAsyncYetA = (c: UtilityClass, element: ElementFinder) => {
export const callClickNotAsyncYetA = (c: UtilityClass, element: ElementFinder) => {
	// c.clickNotAsyncYetA(element);
	c.clickNotAsyncYetA(element);
}

// export const alreadyReturnsProtractorPromise = (element: ElementFinder) => {
export const alreadyReturnsProtractorPromise = (element: ElementFinder) => {
	// element.click();
	element.click();
	// return element.click();
	return element.click();
};

// export const callAlreadyReturnsProtractorPromise = (element: ElementFinder) => {
export const callAlreadyReturnsProtractorPromise = (element: ElementFinder) => {
	// const promise = alreadyReturnsProtractorPromise(element);
	const promise = alreadyReturnsProtractorPromise(element);
	// return promise.then(() => {
	return promise.then(() => {
		console.log("here");
	});
};

// export const alreadyReturnsStdPromise = (element: ElementFinder) => {
export const alreadyReturnsStdPromise = (element: ElementFinder) => {
	// element.click();
	element.click();
	// return Promise.resolve(element.click());
	return Promise.resolve(element.click());
};

// export const callAlreadyReturnsStdPromise = (element: ElementFinder) => {
export const callAlreadyReturnsStdPromise = (element: ElementFinder) => {
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
export const innerFunction = (element: ElementFinder) => {
	// return () => {
	return () => {
		// element.click();
		element.click();
		// element.click();
		element.click();
	};
};

// export const callInnerFunction = (element: ElementFinder) => {
export const callInnerFunction = (element: ElementFinder) => {
	// const myFunction = innerFunction(element);
	const myFunction = innerFunction(element);
	return myFunction;
};

class MyPageObject {
	public clickOnItem(search: string) {
		const element = $(search);
		element.click();
		return element;
	}
}

export const clearItem = async (pageObject: MyPageObject) => {
	await pageObject.clickOnItem('recipientAddress').clear();
};
