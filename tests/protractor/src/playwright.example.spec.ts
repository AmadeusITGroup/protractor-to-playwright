/* eslint-disable no-var */
import { browser, by, element } from "protractor";

describe('angularjs homepage todo list', function() {
	it('should add a todo', function() {
		browser.get('https://angularjs.org');

		element(by.model('todoList.todoText')).sendKeys('first test');
		element(by.css('[value="add"]')).click();

		var todoList = element.all(by.repeater('todo in todoList.todos'));
		expect(todoList.count()).toEqual(3);
		expect(todoList.get(2).getText()).toEqual('first test');

		// You wrote your first test, cross it off the list
		todoList.get(2).element(by.css('input')).click();
		var completedAmount = element.all(by.css('.done-true'));
		expect(completedAmount.count()).toEqual(2);
	});
});