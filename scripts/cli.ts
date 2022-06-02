import yargs from 'yargs';
import path from 'path';
import { newProject } from '../scripts/traversal';
import { getTransformNode } from './protractor';


export async function cli(args: string[]) {
	const argv = await yargs(args)
		.usage('Migration tool from protractor to playwright')
		.version()
		.alias('h', 'help')
		.option('cwd', {
			alias: 'c',
			description: 'Current directory to consider. By defaut, the current directory is considered',
			default: process.cwd(),
			type: 'string'
		})
		.option('src', {
			alias: 's',
			description: 'Root folder of the e2e protractor tests. Current directory by default',
			default: '.',
			type: 'string'
		})
		.option('dst', {
			alias: 'd',
			description: 'Destination folder of the converted  files. By default, the files are replaced at the same location.',
			type: 'string'
		})
		.option('tsconfig', {
			alias: 't',
			description: 'tsconfig file, relative to the current directory',
			type: 'string'
		})
		.option('file', {
			alias: 'f',
			description: 'Patterns specifying files to include. Can also be specified as positional arguments. If positional arguments are used, patterns specified through the --file option are ignored.',
			type: 'string',
			array: true,
			default: ['**/*.{ts,js}']
		})
		.option('exclude', {
			alias: 'x',
			description: 'Patterns specifying files to exclude.',
			type: 'string',
			array: true,
			default: ['**/node_modules']
		})
		.option('test', {
			description: `Choose the way you want to convert the 'it': test or test.step`,
			type: 'string',
			choices: ['test', 'step'],
			default: 'test'
		})
		.option('logfile', {
			alias: 'l',
			description: 'Log file of the migration. {cwd}/playwright-migration.log by default',
			default: './playwright-migration.log',
			type: 'string',
		})
		.argv;

	console.log('Start migration');

	if (argv._.length > 0) {
		// positional arguments take priority over the -f/--file option:
		argv.file.splice(0, argv.file.length, ...argv._.map(arg => `${arg}`));
	}
	const {cwd, src, dst, tsconfig, file, exclude, logfile, test} = argv;
	const project = newProject({
		src: path.resolve(cwd, src),
		dst: path.resolve(cwd, dst || src),
		tsconfig: tsconfig ? path.resolve(cwd, tsconfig) : null,
		file,
		exclude,
		logfile: path.resolve(cwd, logfile),
	}, getTransformNode({stepStrategy: test as 'test' | 'step'}));

	project.transformFiles();

	console.log('Migration finished');
}
