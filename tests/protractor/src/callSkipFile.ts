import { ElementFinder } from 'protractor';
import { veryUsefulClickUtility } from './node_modules/skip';

// Checks that the callClickUtility function does not become async
// as the veryUsefulClickUtility function (which belongs to an
// excluded file) will not become async

// export const callClickUtility = (element: ElementFinder) => {
export const callClickUtility = (element: ElementFinder) => {
	// veryUsefulClickUtility(element);
	veryUsefulClickUtility(element);
}
