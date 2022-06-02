import * as fs from 'fs';
import * as path from 'path';
import { Project, Node, SourceFile, ProjectOptions } from 'ts-morph';
import color from 'picocolors';
import * as cliProgress from 'cli-progress';

export function newProject<Context extends Record<string, any>>(config: {
	src: string;
	dst: string;
	tsconfig?: string | null;
	file: string[];
	exclude: string[];
	logfile: string;
}, nodeCallback: (node: Node, context: Partial<Context>, project: ReturnType<typeof newProject>) => void) {

	let progressBar: cliProgress.Bar | null = null;

	const endProgressBar = () => {
		progressBar?.stop();
		progressBar = null;
	};

	const startProgressBar = (title: string, length: number) => {
		endProgressBar();
		progressBar = new cliProgress.SingleBar({
			hideCursor: true,
			clearOnComplete: true,
			format: `${title} ${color.cyan('{bar}')} | {percentage}% | {value}/{total} | {filename}`,
		}, cliProgress.Presets.shades_classic);
		progressBar.start(length, 0, {filename: ""});
	};

	const updateProgressBar = (index: number, filename: string) => {
		progressBar?.update(index + 1, {filename: path.basename(filename)});
	};

	const screenLog = (text: string) => {
		const terminal = (progressBar as any)?.terminal;
		terminal?.cursorTo(0);
		terminal?.clearBottom();
		terminal?.lineWrapping(true);
		console.log(text);
		terminal?.cursorSave();
		progressBar?.render();
	};

	let filesToSave: Array<{
        filename: string,
        sourceFile: SourceFile,
    }>;

	const convertionErrors: Array<{
        filetrace,
        error,
    }> = [];

	const {src, dst, tsconfig, file: filePatterns, exclude, logfile} = config;

	const filebuffer = fs.createWriteStream(logfile);
	function log(msg, screen = true) {
		if (screen) {
			screenLog(msg);
		}
		filebuffer.write(msg + '\n');
	}

	const projectConfig: ProjectOptions = {
		compilerOptions: {
			allowJs: true
		}
	};
	if (tsconfig) {
		Object.assign(projectConfig, {
			tsConfigFilePath: tsconfig,
			skipAddingFilesFromTsConfig: true,
		});
	}

	const project = new Project(projectConfig);

	project.addSourceFilesAtPaths(filePatterns.map(pattern => path.join(src, pattern)).concat(exclude.map(pattern => `!${path.join(src, pattern)}`)));

	const srcPath = src.replace(/\\/g, '/') + '/';
	const dstPath = dst.replace(/\\/g, '/') + '/';

	function transformFiles() {
		filesToSave = [];
		const sourceFiles = project.getSourceFiles();
		const length = sourceFiles.length;
		startProgressBar("Analysing", length);
		sourceFiles.forEach((sourceFile, index) => {
			const filename = sourceFile.getFilePath();
			updateProgressBar(index, filename);
			log(`Analysing ${filename}`, false);

			processNode(sourceFile);

			filesToSave.push({
				filename,
				sourceFile,
			})
		});
		endProgressBar();
		finish();
	}

	/**
     *
     * @param node
     * @param parentTree Used to store information about the nodes
     */
	function processNode(node: Node) {
		// Context filled by the children
		const context: Partial<Context> = {};

		node.forEachChild((childNode) => {
			Object.assign(context, processNode(childNode))
		});

		try {
			nodeCallback(node, context, api);
		} catch(error) {
			const filetrace = getFileTrace(node);
			log(`Conversion error in ${filetrace}`);
			convertionErrors.push({filetrace, error});
		}

		return context;
	}

	const queue: Array<{fn: () => void, node: Node}> = [];
	function queueTransform(fn: () => void, node: Node) {
		queue.push({fn, node});
	}

	function finish() {

		// Apply all tranformations
		const length = queue.length;
		log(`Apply ${length} transformations`);
		startProgressBar("Applying changes", length);
		for(let value = 0; value < length; value++) {
			const {fn, node} = queue[value];
			updateProgressBar(value, node.getSourceFile().getFilePath());
			try {
				fn();
			} catch (error) {
				const filetrace = getFileTrace(node);
				log(`Transformation error in ${filetrace}`);
				convertionErrors.push({filetrace, error});
			}
		}
		endProgressBar();

		// Save files
		for(const {filename, sourceFile} of filesToSave) {
			const dstFile = filename.replace(srcPath, dstPath);
			fs.mkdirSync(path.dirname(dstFile), { recursive: true });
			fs.writeFileSync(dstFile, sourceFile.getFullText(), {});

		}

		if (convertionErrors.length) {
			log(color.yellow(`Errors found during the conversion in the following files:`));
			convertionErrors.forEach(({filetrace, error}) => {
				log(`${filetrace} : ${error}`);
			});
		}

		filebuffer.close();

	}

	const api = {srcPath, dstPath, transformFiles, queueTransform, log};
	return api;

}

export function getFileTrace(node: Node) {
	const sourceFile = node.getSourceFile();
	const pos = sourceFile.getLineAndColumnAtPos(node.getStart());
	return `${sourceFile.getFilePath()}:${pos.line}:${pos.column}`;
}



