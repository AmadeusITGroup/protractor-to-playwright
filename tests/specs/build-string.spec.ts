import { expect, test } from '@playwright/test';
import {
	ExpressionStatement,
	ParenthesizedExpression,
	Project
} from 'ts-morph';
import { buildString } from '../../scripts/build-string';

const expr = (snippet: string) => {
	const project = new Project();
	const sourceFile = project.createSourceFile('myFile.ts', `(${snippet})`);
	return (
		(
			sourceFile.getStatements()[0] as ExpressionStatement
		).getExpression() as ParenthesizedExpression
	).getExpression();
};

test('build-string', () => {
	expect(buildString()).toEqual("''");
	expect(buildString('')).toEqual("''");
	expect(buildString('', '')).toEqual("''");
	expect(buildString('hello ${a}')).toEqual("'hello ${a}'");
	expect(buildString(expr("'hello ${a}'"))).toEqual("'hello ${a}'");
	expect(buildString(expr("'hello ${a}'"), expr("b"))).toEqual("`hello \\${a}${b}`");
	expect(buildString(expr("`hello ${a}`"), expr("'${b}'"))).toEqual("`hello ${a}\\${b}`");
	expect(buildString('hello ', "'world'")).toEqual("'hello \\'world\\''");
	expect(buildString('hello ', expr('"\\"world\\""'))).toEqual(
		'\'hello "world"\''
	);
	expect(buildString('hello ', expr("'\\'world\\''"))).toEqual(
		"'hello \\'world\\''"
	);
	expect(buildString('hello ', expr('`\\`world\\``'))).toEqual(
		"'hello `world`'"
	);
	expect(buildString(expr('a'))).toEqual('`${a}`');
	expect(buildString(expr('a'), expr('a'))).toEqual('`${a}${a}`');
	expect(buildString(expr('a'), ' >> ', expr('b'))).toEqual('`${a} >> ${b}`');
	expect(
		buildString(expr('`hello ${name}`'), ', how are ', expr('`you ${name}?`'))
	).toEqual('`hello ${name}, how are you ${name}?`');
	expect(
		buildString(expr('`hello ${"world"}`'), ', how are ', expr('"you"'), '?')
	).toEqual("'hello world, how are you?'");
	expect(
		buildString(expr('"hello " + "world"'), ', how are ', expr('"you"'), '?')
	).toEqual("'hello world, how are you?'");
	expect(buildString(expr('"hello " + (name + ",")'), ' how are you?')).toEqual(
		'`hello ${name}, how are you?`'
	);
});
