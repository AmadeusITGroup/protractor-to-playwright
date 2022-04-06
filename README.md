# Protractor to Playwright migration tool

This tool is designed to automatically migrate code from Protractor to Playwright. It is inspired by the ["Migrating from Protractor" guide](https://playwright.dev/docs/protractor) in Playwright documentation.

## Commands

The migration can be done directly by executing the following command in the e2e root folder:

```
npx @amadeus-it-group/protractor-to-playwright@latest --dst='relative/path/to/e2e-playwright-folder' --tsconfig='relative/path/to/tsconfig.conf.ts'
```

Basically, it takes these arguments:

- cwd: Current directory to consider.Current directory by default,
- src: Root folder of the e2e protractor tests. Current directory by default,
- dst: Destination folder of the converted files. By default, the files are replaced at the same location,
- tsconfig: tsconfig file, relative to the current directory. Whereas this parameter is not mandatory, it is advised to fill it if your e2e project is setup with a tsconfig.
- file: optional glob pattern of the files to convert. By default '**/*.{ts, js}'.
- test: optional parameter to convert the it keywords to test or test.step. You can prefer to use the steps if your successive tests in your files are not independant. It can take the following values:
  - test (default): 'it' are replaced by 'test', the {page} parameter is inserted and the setPage(page) is called at the first line to save the page globally.
  - step: 'it' are replaced by 'await test.step'. You will have to finish the conversion by wrapping your test.step in a test.

You can get the help on the usage with `npx @amadeus-it-group/protractor-to-playwright@latest --help`

## Architecture

A file 'playwright-utils' is added at the root of destination folder. It contains useful functions to help the conversion.

In protractor, there is a notion of current page from where you can do actions. In Playwright, this page is given in the callback function parameter of a test. In order to reproduce the Protractor behaviour, the `setPage` function (of playwright-utils) must be used at the start of each test to store the current page, which can be retrieved at any time with the `getPage` function. The `test` object of playwright-utils must be used as well, in order to clear the current page at the end of the test.

## Migration stategy

You can adopt different migration strategies depending on your project. This is an example of how it can be done:

  - Create a new branch for the migration,
  - Create the e2e-playwright folder, and setup a [Playwright configuration](https://playwright.dev/docs/test-configuration#global-configuration).
  - Go to your project folder and open a command line,
  - Run `npx @amadeus-it-group/protractor-to-playwright@latest --src=e2e --dst='e2e-playwright' --tsconfig='e2e/tsconfig.conf.ts'` (e2e contains the protractor suite, e2e-playwright the folder for Playwright, e2e/tsconfig.conf.ts is the tsconfig for your protractor tests),
  - Check the results:
    - Check the console output (also saved in playwright-migration.log) to see some not transformed code.
    - Check the Typescript errors of the new files.
    - Check the work to be finished on your side (see the next section for more explanation).

The new code will not work directly and will require manual changes. At this point, either you detect that something can be improved in the tool, so you can contact us or open a PR, or the migration can be finished on your side in a reasonable time. At any time, you can use the 'file' parameter to migrate only a set of files.

At this point you can either wait for a new release with fixes or finish the work on your side (and you will not need the migration tool anymore :).

## Code that will need a review/refactor by the application team

- **The test functions (replacement of 'it') are run with isolation**, meaning that a new browser page is recreated for each test. After the conversion, you should check that:
  - beforeAll and afterAll would probably need to be converted in beforeEach and afterEach.
  - Your tests are independent. If it's not the case, they will need to be converted in ['test.step'](https://playwright.dev/docs/api/class-test#test-step) inside a test (you can use the test parameter to convert them globally, if it's easier to finish the conversion).

    For example, after the migration, you can have:
    ```typescript
        test('test 1', async({page}) => {
            ...
        });

        test('test 2', async({page}) => {
            // Test 2 depends on the actions done in test 1
            ...
        });
    ```

    As test 2 depends on test 1, you will need to convert the code this way:
    ```typescript
        import { setPage } from "../../playwright-utils"; // Path to be adapted
        ...
        test('Global description', async ({page}) => {
            setPage(page);

            await test.step('test 1', async () => {
                ...
            });

            await test.step('test 2', async () => {
                // Test 2 depends on the actions done in test 1
                ...
            });
        });
    ```

- ElementArrayFinder.filter : This function returns a ElementArrayFinder, which can be chained with usual protractor methods. It will probably need to be refactored.
- ExpectedConditions : even if a lot of these utility methods have been translated, the code would probably not need it and be refactored.

For example, in the following code:

```typescript
    const button = this.page.locator('#buttonId');
    await browser.wait(ExpectedConditions.presenceOf(button));
    await button.click();
```

The line `browser.wait` is not needed at all, as Playwright provides all this waiting actions in the button.click.

Or:

```typescript
    await browser.wait(ExpectedConditions.titleIs('My title'));
```

Must be replaced by:

```typescript
    await expect(page).toHaveTitle('My title')​
```

- ExpectedConditions.alertIsPresent : alerts are managed with events in playwright. Need to be done differently.
- ExpectedConditions.elementToBeClickable : usually useless, as Playwright manage it internally.
- `by.model(...)` and `by.repeater(...)` are converted into `[ng-model="..."]` and `[ng-repeat*="..."]` selectors, but the logic in Protractor is more complex (see [here for ng-model](https://github.com/angular/protractor/blob/4bc80d1a459542d883ea9200e4e1f48d265d0fda/lib/clientsidescripts.js#L580) and [here for ng-repeat](https://github.com/angular/protractor/blob/4bc80d1a459542d883ea9200e4e1f48d265d0fda/lib/clientsidescripts.js#L335)). You'll have to adapt them if needed.

## Found an issue?

This tool is designed to help the migration by doing as much as possible, but the migration may have to be completed manually.

If you detect a generic case which can be handled by the tool, don't hesitate to contact us. Some specific cases are project dependant, and must be managed by the project developers to finish the migration.


