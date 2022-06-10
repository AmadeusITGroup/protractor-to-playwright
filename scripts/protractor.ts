import { CallExpression, Node, ArrowFunction, FunctionExpression, SyntaxKind } from 'ts-morph';
import { buildString } from './build-string';
import { ChildrenContext } from './types';
import { newProject, getFileTrace } from './traversal';
import color from 'picocolors';
import path from 'path';
import fs from 'fs';

const importFromProtractorRegExp = /^import\(".*?node_modules\/protractor\/.*?"\)/;
const promiseRegExp = /^import\(".*?node_modules\/@types\/selenium-webdriver\/index"\)\.promise\.Promise<.*>$/;
const jasmineMatcherRegExp = /^jasmine\.(ArrayLike)?Matchers<.*>$/;

const elementFinderRegExp = /(ElementFinder|ElementArrayFinder)$/;
const elementArrayFinderRegExp = /ElementArrayFinder$/;
const protractorModuleregExp = /^protractor(\/|$)/;
const utilsFileName = 'playwright-utils';

function isElementArrayFinder(node: Node) {
	const type = node.getType().getText();
	return importFromProtractorRegExp.test(type) && elementArrayFinderRegExp.test(type);
}

function isElementOrElementArrayFinder(node: Node) {
	const type = node.getType().getText();
	return importFromProtractorRegExp.test(type) && elementFinderRegExp.test(type);
}

const testDefRegExp = /^(it|fit|xit|beforeEach|beforeAll|afterEach|afterAll])$/;
function isTestDefinition(node: Node | undefined): node is (CallExpression) {
	if (Node.isCallExpression(node)) {
		const text = node.getExpression().getText();
		return testDefRegExp.test(text);
	}
	return false;
}

function isNotTestDefinition(_parentNode, node: Node | undefined) {
	return !isTestDefinition(node);
}

function insertStatements(node: ArrowFunction | FunctionExpression, statement: string) {
	const body = node.getBody();
	if (Node.isArrowFunction(node) && body.getKind() !== SyntaxKind.Block) {
		body.replaceWithText(`{ return ${body.getText()}; }`)
	}
	const indentation = node.getStatements()[0]?.getIndentationText() ?? '';
	node.insertStatements(0, (writer) => {
		if (indentation) {
			writer.setIndentationLevel(0);
		}
		writer.write(`${indentation}${statement}`);
	});
}

export function getTransformNode({stepStrategy}: {stepStrategy: 'test' | 'step'}) {

	let isUtilsFileCreated = false;

	/**
	 * Update useThisPage or usePage in the context depending if the node is inside a class
	 * Returns 'this.page' or 'page' depending on its usage context
	 * @param node
	 * @param context Context to update
	 * @param stepStrategy
	 */
	const getPageText = stepStrategy === 'test' ? function(node: Node, context: ChildrenContext) {
		const parent = node.getParentWhile(isNotTestDefinition);
		if (parent && parent !== node.getSourceFile()) {
			context.usePage = true;
			return 'page';
		} else {
			context.useGetPage = true;
			return 'getPage()';
		}
	} : function(_node: Node, context: ChildrenContext) {
		context.useGetPage = true;
		return 'getPage()';
	}

	function transformNode(node: Node, context: ChildrenContext, project: ReturnType<typeof newProject>) {

		const {queueTransform} = project;

		if (Node.isCallExpression(node)) {
			transformCallExpression(node, context, project);
		} else if (Node.isImportDeclaration(node)) {
			if (protractorModuleregExp.test(node.getModuleSpecifierValue())) {
				queueTransform(function() {
					node.remove();
				}, node);
			}
		} else if (Node.isAwaitExpression(node)) {
			const expression = node.getExpression();
			if (isElementArrayFinder(expression)) {
				context.useLocatorArray = true;
				queueTransform(function() {
					const expression = node.getExpression();
					expression.replaceWithText(`makeLocatorArray(${expression.getText()})`);
				}, node);
			} else if (Node.isCallExpression(expression)) {
				const innerExpression = expression.getExpression();
				if (Node.isPropertyAccessExpression(innerExpression)) {
					const leftType = innerExpression.getExpression().getType().getText();
					if (
						importFromProtractorRegExp.test(leftType) &&
						leftType.endsWith(".ProtractorBrowser") &&
						innerExpression.getName() === 'getCurrentUrl'
					) {
						// Remove 'await' for the browser.getCurrentUrl conversion
						queueTransform(function() {
							node.replaceWithText(node.getExpression().getText());
						}, node);
					}
				}
			}
		} else if (Node.isExpressionStatement(node)) {
			const expression = node.getExpression();
			if (promiseRegExp.test(expression.getType().getText())) {
				queueTransform(function() {
					expression.replaceWithText(`await ${expression.getText()}`);
				}, expression);
			}
		} else if (Node.isParenthesizedExpression(node)) {
			const expression = node.getExpression();
			if (isElementOrElementArrayFinder(expression)) {
				queueTransform(function() {
					node.replaceWithText(expression.getText());
				}, node);
			}
		} else if (Node.isTypeReference(node)) {
			if (isElementOrElementArrayFinder(node)) {
				context.useLocatorType = true;
				queueTransform(function() {
					node.replaceWithText('Locator');
				}, node);
			}
		} else if (Node.isSourceFile(node)) {
			const playwrightImports: string[] = [];
			if (context.useExpect) {
				playwrightImports.push('expect');
			}

			if (context.useLocatorType) {
				playwrightImports.push('Locator');
			}

			if (playwrightImports.length) {
				queueTransform(function() {
					node
						.addImportDeclaration({
							moduleSpecifier: '@playwright/test',
						})
						.addNamedImports(playwrightImports);

				}, node);
			}

			const playwrightUtilsImport: string[] = [];
			if (context.useTest) {
				playwrightUtilsImport.push('test');
			}
			if (context.useSetPage) {
				playwrightUtilsImport.push('setPage');
			}
			if (context.useGetPage) {
				playwrightUtilsImport.push('getPage');
			}
			if (context.useExpectedConditions) {
				playwrightUtilsImport.push('ExpectedConditions');
			}

			if (context.useWaitCondition) {
				playwrightUtilsImport.push('waitCondition');
			}

			if (context.useLocatorArray) {
				playwrightUtilsImport.push('makeLocatorArray');
			}

			if (context.useLocatorMap) {
				playwrightUtilsImport.push('locatorMap');
			}

			if (context.useGetCssValue) {
				playwrightUtilsImport.push('getCssValue');
			}

			if (playwrightUtilsImport.length) {
				const {srcPath, dstPath} = project;
				const playwrightUtilsModuleSpecifier = path.relative(path.dirname(node.getSourceFile().getFilePath()), path.join(srcPath, utilsFileName)).replace(/\\/g, '/');
				queueTransform(function() {
					node
						.addImportDeclaration({
							moduleSpecifier: playwrightUtilsModuleSpecifier,
						})
						.addNamedImports(playwrightUtilsImport);

					if (!isUtilsFileCreated) {
						const fileName = `${utilsFileName}.ts`;
						fs.mkdirSync(dstPath, {recursive: true});
						fs.copyFileSync(path.join(__dirname, "../scripts", fileName), path.join(dstPath, fileName));
						isUtilsFileCreated = true;
					}

				}, node);
			}
		}
	}

	function transformCallExpression(node: CallExpression, context: ChildrenContext, project: ReturnType<typeof newProject>) {
		const {queueTransform, log} = project;

		function addPageParameter(fn: Node, comment = '') {
			if (Node.isArrowFunction(fn) || Node.isFunctionExpression(fn)) {
				if (fn.getParameters().length) {
					log(`${getFileTrace(node)} : Test function contains parameters`);
				}
				context.useSetPage = true;
				queueTransform(function() {
					fn.setIsAsync(true);
					const text = <string[]>[];
					if (comment) {
						text.push(`/* ${comment} */ `);
					}
					text.push('{page}');
					fn.insertParameter(0, {
						name: text.join(''),
					});
					insertStatements(fn, 'setPage(page);');
				}, node);
			}
		}

		const expression = node.getExpression();
		if (Node.isIdentifier(expression)) {
			const text = expression.getText();
			switch (text) {
				case 'xdescribe':
					context.useTest = true;
					queueTransform(function() {
						expression.replaceWithText('test.describe');
						const fn = node.getArguments()[1];
						if (Node.isArrowFunction(fn) || Node.isFunctionExpression(fn)) {
							insertStatements(fn, 'test.skip();');
						}
					}, expression);
					break;

				case 'fdescribe':
				case 'describe': {
					const newText = text === 'fdescribe' ? 'test.describe.only' : 'test.describe'
					context.useTest = true;
					queueTransform(function() {
						expression.replaceWithText(newText);
					}, expression);
					break;
				}

				case 'it': {
					context.useTest = true;
					if (stepStrategy === 'test') {
						addPageParameter(node.getArguments()[1]);
						queueTransform(function() {
							expression.replaceWithText('test');
						}, expression);
					} else if (stepStrategy === 'step') {
						queueTransform(function() {
							expression.replaceWithText('test.step');
							node.replaceWithText(`await ${node.getText()}`);
						}, expression);
					}
					break;
				}

				case 'xit':
				case 'fit': {
					const newText = text === 'xit' ? 'test.skip' : 'test.only';
					context.useTest = true;
					addPageParameter(node.getArguments()[1]);
					queueTransform(function() {
						expression.replaceWithText(newText);
					}, expression);
					break;
				}

				case 'beforeAll': {
					context.useTest = true;
					if (context.usePage) {
						addPageParameter(node.getArguments()[0], `FIXME: {page} doesn't work in beforeAll, refactor required`);
					}
					queueTransform(function() {
						expression.replaceWithText(`/* FIXME: check if this test must be replaced by test.beforeEach('...', async ({page}) => {...}) */ test.beforeAll`);
					}, expression);
					break;
				}

				case 'afterAll': {
					context.useTest = true;
					if (context.usePage) {
						addPageParameter(node.getArguments()[0], `FIXME: {page} doesn't work in afterAll, refactor required`);
					}
					queueTransform(function() {
						expression.replaceWithText(`/* FIXME: check if this test must be replaced by test.afterEach('...', async ({page}) => {...}) */ test.afterAll`);
					}, expression);
					break;
				}

				case 'beforeEach': {
					context.useTest = true;
					addPageParameter(node.getArguments()[0]);
					queueTransform(function() {
						expression.replaceWithText('test.beforeEach');
					}, expression);
					break;
				}

				case 'afterEach': {
					context.useTest = true;
					addPageParameter(node.getArguments()[0]);
					queueTransform(function() {
						expression.replaceWithText('test.afterEach');
					}, expression);
					break;
				}

				case 'expect': {
					context.useExpect = {messages: []};
					const expectInfo = context.useExpect;
					const firstArg = node.getArguments()[0];
					if (firstArg && promiseRegExp.test(firstArg.getType().getText())) {
						queueTransform(function() {
							firstArg.replaceWithText(`await ${firstArg.getText()}`);
						}, firstArg);
					}
					queueTransform(function () {
						const messages = expectInfo.messages;
						if (messages.length > 0) {
							// inserts a comma between each message:
							for (let i = messages.length - 1; i > 0; i--) {
								messages.splice(i, 0, ", ");
							}
							node.addArgument(buildString(...expectInfo.messages));
						}
					}, node);
					break;
				}

				case '$':
				case '$$':
				case 'element': {
					const newText = `${getPageText(node, context)}.locator`;
					queueTransform(function() {
						expression.replaceWithText(newText);
					}, expression);
					break;
				}

				default:
					break;
			}
		} else if (Node.isPropertyAccessExpression(expression)) {
			const left = expression.getExpression();
			const leftType = left.getType().getText();
			if (importFromProtractorRegExp.test(leftType)) {
				const expressionName = expression.getName();
				if (leftType.endsWith(".ElementFinder")) {
					switch (expressionName) {
						case 'click':
							// Nothing to transform
							break;
						case 'element':
						case 'all':
						case '$':
						case '$$':
							queueTransform(function() {
								expression.replaceWithText(
									`${expression.getExpression().getText()}.locator`
								);
							}, expression);
							break;
						case 'getText':
							queueTransform(function() {
								expression.replaceWithText(
									`${expression.getExpression().getText()}.innerText`
								);
							}, expression);
							break;
						case 'getWebElement':
							queueTransform(function() {
								expression.replaceWithText(
									`${expression.getExpression().getText()}.elementHandle`
								);
							}, expression);
							break;
						case 'getSize':
							queueTransform(function() {
								expression.replaceWithText(
									`${expression.getExpression().getText()}.boundingBox`
								);
							}, expression);
							break;
						case 'getCssValue':
							context.useGetCssValue = true;
							queueTransform(function() {
								const [arg0] = node.getArguments();
								node.replaceWithText(
									`getCssValue(${expression.getExpression().getText()}, ${arg0.getText()})`
								);
							}, node);
							break;
						case 'clear':
							queueTransform(function() {
								node.replaceWithText(
									`${expression.getExpression().getText()}.fill('')`
								);
							}, node);
							break;
						case 'sendKeys':
							queueTransform(function() {
								expression.replaceWithText(
									// 'fill' is a specific Playwright feature to speed up the test for simpler form filling,
									// but is not the same ('type' can be used instead)
									// What is the best ?
									`${expression.getExpression().getText()}.type`
								);
							}, expression);
							break;
						case 'isDisplayed':
							queueTransform(function() {
								expression.replaceWithText(
									`${expression.getExpression().getText()}.isVisible`
								);
							}, expression);
							break;
						case 'isElementPresent':
							queueTransform(function() {
								const [arg0] = node.getArguments();
								node.replaceWithText(`${expression.getExpression().getText()}.locator(${arg0.getText()}).count().then((count) => count > 0)`);
							}, node);
							break;
						case 'isPresent':
							queueTransform(function() {
								node.replaceWithText(`${expression.getExpression().getText()}.count().then((count) => count > 0)`);
							}, node);
							break;
						case 'isSelected':
							queueTransform(function() {
								expression.replaceWithText(
									`${expression.getExpression().getText()}.isChecked`
								);
							}, expression);
							break;
						case 'isEnabled':
						case 'getAttribute':
							// Nothing to do
							break;

						default:
							log(color.yellow(`${getFileTrace(node)} : missing transform for ElementFinder.${expressionName}`));
					}
				} else if (leftType.endsWith(".ElementArrayFinder")) {
					switch (expressionName) {
						case 'element':
						case 'all':
						case '$':
						case '$$':
							queueTransform(function() {
								expression.replaceWithText(
									`${expression.getExpression().getText()}.locator`
								);
							}, expression);
							break;
						case 'get':
							queueTransform(function() {
								expression.replaceWithText(`${expression.getExpression().getText()}.nth`);
							}, expression);
							break;
						case 'getText':
							queueTransform(function() {
								expression.replaceWithText(`${expression.getExpression().getText()}.allInnerTexts`);
							}, expression);
							break;
						case 'getAttribute':
							context.useLocatorMap = true;
							queueTransform(function() {
								node.replaceWithText(`locatorMap(${expression.getExpression().getText()}, (locator) => locator.getAttribute(${node.getArguments()[0].getText()}))`);
							}, node);
							break;
						case 'map':
						case 'each':
							context.useLocatorMap = true;
							queueTransform(function() {
								node.replaceWithText(`locatorMap(${expression.getExpression().getText()}, ${node.getArguments()[0].getText()})`);
							}, node);
							break;
						case 'filter':
							context.useLocatorArray = true;
							queueTransform(function() {
								expression.replaceWithText(`(await makeLocatorArray(${expression.getExpression().getText()}))./* FIXME: filter must be managed specifically */filter`);
							}, expression);
							log(color.yellow(`${getFileTrace(node)}: ElementArrayFinder.filter cannot be fully transformed. You must manage the resulting expression.`));
							break;
						case 'count':
						case 'first':
						case 'last':
							// Nothing to do
							break;
						default:
							log(color.yellow(`${getFileTrace(node)} : missing transform for ElementArrayFinder.${expressionName}`));
							break;
					}
				} else if (leftType.endsWith(".ProtractorBrowser")) {
					switch (expressionName) {
						case 'get': {
							const newText = `${getPageText(node, context)}.goto`;
							const [,timeoutArgument] = node.getArguments();
							queueTransform(function() {
								if (timeoutArgument) {
									timeoutArgument.replaceWithText(`{timeout: ${timeoutArgument.getText()}}`);
								}
								expression.replaceWithText(newText);
							}, expression);
							break;
						}

						case 'wait':
							context.useWaitCondition = true;
							queueTransform(function() {
								expression.replaceWithText('waitCondition');
							}, expression);
							break;

						case 'sleep': {
							const newText = `${getPageText(node, context)}.waitForTimeout`;
							queueTransform(function() {
								expression.replaceWithText(newText);
							}, expression);
							break;
						}

						case 'refresh': {
							const newText = `${getPageText(node, context)}.reload`;
							const [timeoutArgument] = node.getArguments();
							queueTransform(function() {
								if (timeoutArgument) {
									timeoutArgument.replaceWithText(`{timeout: ${timeoutArgument.getText()}}`);
								}
								expression.replaceWithText(newText);
							}, expression);
							break;
						}

						case 'getCurrentUrl': {
							const newText = `${getPageText(node, context)}.url`;
							queueTransform(function() {
								expression.replaceWithText(newText);
							}, expression);
							break;
						}

						case 'executeScript': {
							transformExecuteScript(node, context, project);
							break;
						}

						default:
							log(color.yellow(`${getFileTrace(node)} : missing transform for ProtractorBrowser.${expressionName}`));
							break;
					}
				} else if (leftType.endsWith(".ElementHelper")) {
					if (expressionName === 'all') {
						const newText = `${getPageText(node, context)}.locator`;
						queueTransform(function() {
							expression.replaceWithText(newText);
						}, expression);
					}
				} else if (leftType.endsWith(".ProtractorBy")) {
					const [arg0, arg1] = node.getArguments();
					switch (expressionName) {
						case 'tagName':
						case 'css':
							queueTransform(function() {
								node.replaceWithText(arg0.getText());
							}, node);
							break;

						case 'cssContainingText':
							queueTransform(function() {
								node.replaceWithText(buildString(arg0, ' >> text=', arg1));
							}, node);
							break;

						case 'linkText':
							queueTransform(function() {
								node.replaceWithText(buildString('*css=a:visible >> text="', arg0, '"'));
							}, node);
							break;

						case 'partialLinkText':
							queueTransform(function() {
								node.replaceWithText(buildString('*css=a:visible >> text=', arg0));
							}, node);
							break;

						case 'buttonText':
							queueTransform(function() {
								node.replaceWithText(buildString('*css=button, input[type="button"], input[type="submit"] >> text="', arg0, '"'));
							}, node);
							break;

						case 'partialButtonText':
							queueTransform(function() {
								node.replaceWithText(buildString('*css=button, input[type="button"], input[type="submit"] >> text=', arg0));
							}, node);
							break;

						case 'className':
							queueTransform(function() {
								node.replaceWithText(buildString('.', arg0));
							}, node);
							break;

						case 'id':
							queueTransform(function() {
								node.replaceWithText(buildString('#', arg0));
							}, node);
							break;

						case 'xpath':
							queueTransform(function() {
								node.replaceWithText(buildString('xpath=', arg0));
							}, node);
							break;

						case 'name':
							queueTransform(function() {
								node.replaceWithText(buildString('[name="', arg0, '"]'));
							}, node);
							break;

						case 'model':
							queueTransform(function() {
								node.replaceWithText(buildString('[ng-model="', arg0, '"]'));
							}, node);
							break;

						case 'repeater':
							queueTransform(function() {
								node.replaceWithText(buildString('[ng-repeat*="', arg0, '"]'));
							}, node);
							break;

						default:
							log(color.yellow(`${getFileTrace(node)} : missing transform for ProtractorBy.${expressionName}`));
							break;
					}
				} else if (leftType.endsWith(".ProtractorExpectedConditions")) {
					context.useExpectedConditions = true;
					switch (expressionName) {
						case 'titleContains':
						case 'titleIs':
						case 'urlContains':
						case 'urlIs': {
							const pageText = getPageText(node, context);
							queueTransform(function() {
								node.insertArgument(0, pageText);
							}, node)
							break;
						}
						default:
							break;
					}
					queueTransform(function() {
						// Force the 'ExpectedConditions' usage
						left.replaceWithText('ExpectedConditions');
					}, left)
				}
			} else if (jasmineMatcherRegExp.test(leftType)) {
				const args = node.getArguments();
				const argsLength = args.length;
				const useExpectInfo = context.useExpect;
				if (useExpectInfo && argsLength > 0) {
					const expressionName = expression.getName();
					if (expressionName === "withContext") {
						useExpectInfo.messages.push(args[0]);
						queueTransform(function() {
							node.replaceWithText(expression.getExpression().getText());
						}, node);
					} else {
						// remove expectationFailOutput argument (always the last one)
						const isExpectMessage = expression.getType().getCallSignatures().map(signature => signature.getParameters()[argsLength - 1]?.getName()).filter(item => !!item).every(item => item === 'expectationFailOutput');
						if (isExpectMessage) {
							useExpectInfo.messages.push(args[argsLength - 1]);
							queueTransform(function() {
								node.removeArgument(argsLength - 1);
							}, node);
						}
					}
				}
			}
		}
	}

	const startReturnRegExp = /^\s*return /g;
	const returnRegExp = /\breturn\b/g;
	const argumentsRegExp = /\barguments\b/gi;
	function transformExecuteScript(node: CallExpression, context: ChildrenContext, project: ReturnType<typeof newProject>) {
		const {queueTransform} = project;
		const [script, ...args] = node.getArguments();
		const expression = node.getExpression();
		const isSpreadArg = args[0] && Node.isSpreadElement(args[0]);
		if (Node.isStringLiteral(script) || Node.isNoSubstitutionTemplateLiteral(script)) {
			let switchCase: 'noChange' | 'simpleFunction' | 'arrowFunctionWithArguments';
			const argsLength = args.length;
			const scriptLitteralText = script.getLiteralText();
			const startWithReturn = startReturnRegExp.test(scriptLitteralText);
			if (argsLength === 0) {
				switchCase = startWithReturn || !returnRegExp.test(scriptLitteralText) ? 'noChange' : 'simpleFunction';
			} else if (argsLength === 1 && !isSpreadArg) {
				switchCase = 'simpleFunction';
			} else {
				switchCase = 'arrowFunctionWithArguments';
			}

			switch (switchCase) {
				case 'noChange': {
					const newText = `${getPageText(node, context)}.evaluate`;
					const newScriptText = buildString(scriptLitteralText.replace(startReturnRegExp, ''));
					queueTransform(function() {
						script.replaceWithText(newScriptText)
						expression.replaceWithText(newText);
					}, node);
					break;
				}

				case 'simpleFunction': {
					const newText = `${getPageText(node, context)}.evaluate`;
					const newScriptText = `function() {${scriptLitteralText}}`;
					queueTransform(function() {
						script.replaceWithText(newScriptText)
						expression.replaceWithText(newText);
					}, node);
					break;
				}

				case 'arrowFunctionWithArguments': {
					const argsString = `[${args.map((arg) => arg.getText()).join(', ')}]`;
					const text = script.getLiteralText().replace(argumentsRegExp, 'args');
					const newText = `${getPageText(node, context)}.evaluate(args => {${text}}, ${argsString})`;
					queueTransform(function() {
						node.replaceWithText(newText);
					}, node);
					break;
				}
			}
		} else {
			let switchCase: 'noChange' | 'wrapArgs';
			const argsLength = args.length;
			if (argsLength < 2 && !isSpreadArg) {
				switchCase = 'noChange';
			} else {
				switchCase = 'wrapArgs';
			}

			switch (switchCase) {
				case 'noChange': {
					const newText = `${getPageText(node, context)}.evaluate`;
					queueTransform(function() {
						expression.replaceWithText(newText);
					}, expression);
					break;
				}

				case 'wrapArgs': {
					const argsString = `[${args.map((arg) => arg.getText()).join(', ')}]`;
					queueTransform(function() {
						args[0].replaceWithText(argsString);
						for(let i = 1; i < args.length; i++) {
							node.removeArgument(args[1]);
						}
					}, node);
					if (Node.isFunctionExpression(script) || Node.isArrowFunction(script)) {
						const parameters = script.getParameters();
						let paramsString, newFunctionBody;
						if (parameters.length) {
							paramsString = `[${parameters.map((param) => param.getText()).join(', ')}]`;
						}
						const functionBody = script.getBodyText();
						if (functionBody && !Node.isArrowFunction(script) && argumentsRegExp.test(functionBody)) {
							newFunctionBody = functionBody.replace(argumentsRegExp, 'args');
							if (paramsString) {
								newFunctionBody = `const ${paramsString} = args;${newFunctionBody}`;
							}
							paramsString = 'args';

						}
						const newText = `${getPageText(node, context)}.evaluate`;
						queueTransform(function() {
							expression.replaceWithText(newText);

							if (newFunctionBody) {
								script.setBodyText(newFunctionBody);
							}

							if (paramsString) {
								for(const parameter of parameters) {
									parameter.remove();
								}
								script.insertParameter(0, {name: paramsString});
							}
						}, node);
					} else {
						const newText = `${getPageText(node, context)}.evaluate`;
						const newScriptText = `/* FIXME: Arguments have been wrapped in an array, you must reflect this change in the function */ ${script.getText()}`
						queueTransform(function() {
							script.replaceWithText(newScriptText);
							expression.replaceWithText(newText);
						}, node);
					}
					break;
				}

			}
		}
	}

	return transformNode;
}