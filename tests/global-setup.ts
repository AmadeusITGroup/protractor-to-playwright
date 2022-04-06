import { FullConfig } from "@playwright/test";
import NYC from 'nyc';
import path from "path";
import fs from "fs/promises";

async function globalSetup(config: FullConfig) {
	const grep = <RegExp>config.grep
	process.env.GREP = grep.source;
	process.env.GREPFLAG = grep.flags;

	const enableCoverage = process.env.ENABLE_COVERAGE === "1";

	if (enableCoverage) {
		process.env.NODE_OPTIONS = `--require ${require.resolve('./instrument')}`;

		const reportDir = path.join(__dirname, `../coverage`);
		const nycDir = path.join(__dirname, '../.nyc_output');
		await fs.rm(reportDir, {recursive: true, force: true});
		await fs.rm(nycDir, {recursive: true, force: true});
		await fs.mkdir(nycDir);
		const nycInstance = new NYC({
			cwd: path.join(__dirname, '..'),
			reportDir,
			reporter: ['lcov', 'json', 'text-summary']
		});
		return async () => {
			await nycInstance.report();
			await fs.rm(nycDir, {recursive: true, force: true});
		}
	}
}

export default globalSetup;