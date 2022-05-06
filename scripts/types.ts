import type { Node } from "ts-morph";

/**
 * Expose information coming from the child nodes
 */
export interface ChildrenContext {

    /**
     * If true, the page variable is used in the descendants.
     */
    usePage?: boolean;

    /**
     * If true, setPage(...) is used in the descendants
     */
    useSetPage?: boolean;

    /**
     * If true, getPage() is used in the descendants
     */
    useGetPage?: boolean;

    /**
     * If true, the playwright test is used in the descendants.
     */
    useTest?: boolean;

    /**
     * If defined, the playwright expect is used in the descendants.
     * When defined, messages is an array of messages to attach
     * to the expect call.
     */
    useExpect?: { messages: (string | Node)[] };

    /**
     * If true, the Locator type is used in the descendants.
     */
    useLocatorType?: boolean;

    /**
     * If true, the file need the usage of the custom locatorMap function.
     */
     useLocatorMap?: boolean;

    /**
     * If true, the file need the usage of the custom makeLocatorArray function.
     */
     useLocatorArray?: boolean;

    /**
     * if true, "page: Page" is implemented in all the constructors of the given call
     * (usefull only in a ClassDelaration on ClassExpression)
     */
    usePageInConstructor?: boolean

   /**
     * if true, ExpectedConditions is used
     */
    useExpectedConditions?: boolean

   /**
     * if true, the file uses the waitCondition utility (to replace browser.wait)
     */
    useWaitCondition?: boolean

   /**
     * if true, the file uses the getCssValue utility (to replace ElementFinder.getCssValue)
     */
    useGetCssValue?: boolean

}
