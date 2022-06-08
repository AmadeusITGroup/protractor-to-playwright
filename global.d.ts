import * as p from "protractor";

declare global {
	const protractor: typeof p;
	const browser: typeof p.browser;
	const $: typeof p.$;
	const $$: typeof p.$$;
	const element: typeof p.element;
	const by: typeof p.by;
	const ExpectedConditions: typeof p.ExpectedConditions;
}
