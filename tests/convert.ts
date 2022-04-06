import * as fs from 'fs';
import * as path from 'path';
import {cli} from '../scripts/cli';

export async function runCli(files: string[] | undefined = undefined) {
	const convertedDir = path.join(__dirname, 'converted');
	if (fs.existsSync(convertedDir)) {
		fs.rmSync(convertedDir, {recursive: true})
	}

	if (Array.isArray(files) && !files.length) {
		return;
	}

	await cli([
		`--cwd='${__dirname}'`,
		// `--test='step'`,
		`--src='protractor'`,
		`--dst='converted'`,
		`--tsconfig='protractor/tsconfig.json'`,
		'--colors',
		...(files?.map((file) => `--file=${file}`) ?? [])
	]);
}

if (require.main === module) {
	runCli();
}
