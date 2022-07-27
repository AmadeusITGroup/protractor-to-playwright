import { veryUsefulClickUtility } from './node_modules/skip';
import { Locator } from "@playwright/test";

// Checks that the callClickUtility function does not become async
// as the veryUsefulClickUtility function (which belongs to an
// excluded file) will not become async

// export const callClickUtility = (element: ElementFinder) => {
export const callClickUtility = (element: Locator) => {
	// veryUsefulClickUtility(element);
	veryUsefulClickUtility(element);
}