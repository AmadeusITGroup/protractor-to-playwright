import type { Node } from "ts-morph";

/**
 * Expose information coming from the child nodes
 */
export interface ChildrenContext {
    /**
     * Whether this node is being processed currently.
     */
    processing?: boolean;

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

    /**
     * if true, the "await" keyword was added in the current function
     */
    addingAwait?: boolean
}
