/* eslint-disable no-var */
import { expect } from "@playwright/test";
import { test, setPage } from "../playwright-utils";

test.describe('angularjs homepage todo list', function() {
	test('should add a todo', async function({page}) {
        setPage(page);
		await page.goto('https://angularjs.org');

		await page.locator('[ng-model="todoList.todoText"]').type('first test');
		await page.locator('[value="add"]').click();

		var todoList = page.locator('[ng-repeat*="todo in todoList.todos"]');
		expect(await todoList.count()).toEqual(3);
		expect(await todoList.nth(2).innerText()).toEqual('first test');

		// You wrote your first test, cross it off the list
		await todoList.nth(2).locator('input').click();
		var completedAmount = page.locator('.done-true');
		expect(await completedAmount.count()).toEqual(2);
	});
});