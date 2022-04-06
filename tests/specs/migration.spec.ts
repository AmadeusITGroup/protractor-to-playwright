import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as mime from 'mime';
import {runCli} from '../convert';
import {execFile} from './util/execFile';

const endLineRegExp = /(\r\n|\n\r)/g;
function convertLineEnd(content) {
	return content.trim().replace(endLineRegExp, '\n');
}

test.describe('Conversion tool', () => {
	const snapshotDir = path.join(__dirname, "..", "playwright");
	const convertedDir = path.join(__dirname, "..", "converted");
	const files = glob.sync('**/*.ts', {cwd: path.join(__dirname, '../protractor'), ignore: ["**/node_modules/**"]});
	let filteredFiles = files;

	test.beforeAll(async () => {
		mime.define({'text/plain': ['ts']}, true);
		// GREP and GREPFLAG are defined in global-setup.ts
		const grep = new RegExp(process.env.GREP, process.env.GREPFLAG);
		if (grep.source !== '.*') {
			filteredFiles = files.filter((file) => {
				return grep.test(`compare ${file}`);
			});
			await runCli(filteredFiles);
		} else {
			await runCli();
		}
	});

	test('compile with typescript', async () => {
		await execFile(
			'node', [require.resolve('typescript/bin/tsc'), '--target', 'es5', '--noEmit', ...filteredFiles],
			{ cwd: path.join(__dirname, '../converted') }
		);
	});

	for(const file of files) {
		// eslint-disable-next-line no-empty-pattern
		test(`compare ${file}`, async function({}, testInfo) {
			testInfo.snapshotSuffix = '';
			testInfo.snapshotDir = snapshotDir;
			const fileContent = await fs.readFile(path.join(convertedDir, file), "utf8");
			expect(convertLineEnd(fileContent)).toMatchSnapshot({name: [file]});
		});
	}

	test(`check that src/node_modules/skip.ts was not converted`, async function () {
		await expect(async () => await fs.readFile(path.join(convertedDir, "src", "node_modules", "skip.ts"))).rejects.toThrow('ENOENT');
	});
});