import { test } from '@playwright/test';
import * as path from 'path';
import { execFile } from './util/execFile';

test.describe('Check protractor tests', () => {
	test('compile with typescript', async () => {
		const protractorDir = path.join(__dirname, '..', 'protractor');
		await execFile('node',	[require.resolve('typescript/bin/tsc'), '--project', protractorDir, '--noEmit', '--moduleResolution', 'node'], {});
	});
});
