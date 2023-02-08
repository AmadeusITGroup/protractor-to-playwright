import * as cliProgress from 'cli-progress';
import * as fs from 'fs';
import * as path from 'path';
import color from 'picocolors';
import { ModuleResolutionKind, Node, Project, ProjectOptions, SourceFile } from 'ts-morph';

export function newProject<Context extends {processing: boolean}>(config: {
	src: string;
	dst: string;
	tsconfig?: string | null;
	file: string[];
	exclude: string[];
	logfile: string;
	ambientFiles?: string[];
	isContextToBeSaved: (node: Node) => boolean;
	mergeContext: (parentContext: Partial<Context>, childContext: Partial<Context>, parentNode: Node, childNode: Node) => void
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

	const {src, dst, tsconfig, file: filePatterns, exclude, logfile, ambientFiles, mergeContext, isContextToBeSaved} = config;

	const filebuffer = fs.createWriteStream(logfile);
	function log(msg, screen = true) {
		if (screen) {
			screenLog(msg);
		}
		filebuffer.write(msg + '\n');
	}

	const projectConfig: ProjectOptions = {
		compilerOptions: {
			allowJs: true,
			moduleResolution: ModuleResolutionKind.NodeJs,
		}
	};
	if (tsconfig) {
		Object.assign(projectConfig, {
			tsConfigFilePath: tsconfig,
			skipAddingFilesFromTsConfig: true,
		});
	}

	const project = new Project(projectConfig);

	const ambientFilesSet = new Set(project.addSourceFilesAtPaths(ambientFiles ?? []));
	const filePatternsResolved = filePatterns.map(pattern => path.join(src, pattern)).concat(exclude.map(pattern => `!${path.join(src, pattern)}`));
	const sourceFiles = new Set(project.addSourceFilesAtPaths(filePatternsResolved));
	const nbFiles = sourceFiles.size;
	const savedContexts = new WeakMap<Node, Partial<Context>>();

	// Log context information
	log(``);
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	log(`protractor-to-playwright version ${color.green(require('../package.json').version)}`);
	log(`Source folder : ${color.green(src)}`);
	log(`Destination folder : ${color.green(dst)}`);
	log(`File patterns resolved to:`);
	for(const pattern of filePatternsResolved) {
		log(`  - ${color.green(color.green(pattern))}`);
	}
	log(`${nbFiles} file${nbFiles > 1 ? 's' : ''} found`);
	log(``);

	const srcPath = src.replace(/\\/g, '/') + '/';
	const dstPath = dst.replace(/\\/g, '/') + '/';

	function transformFiles() {
		filesToSave = [];
		const sourceFiles = project.getSourceFiles().filter(file => !ambientFilesSet.has(file));
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

	function processNode(node: Node) {
		// Context filled by the children
		const context: Partial<Context> = {};
		if (isContextToBeSaved(node)) {
			const existingContext = savedContexts.get(node);
			if (existingContext) {
				return existingContext;
			}
			savedContexts.set(node, context);
		}
		context.processing = true;

		node.forEachChild((childNode) => {
			const subContext = processNode(childNode);
			if (subContext.processing) {
				const filetrace = getFileTrace(node);
				log(`Recursion error in ${filetrace}`);
				convertionErrors.push({filetrace, error: new Error('Recursion error')});
				return;
			}
			mergeContext(context, subContext, node, childNode);
		});

		try {
			nodeCallback(node, context, api);
		} catch(error) {
			const filetrace = getFileTrace(node);
			log(`Conversion error in ${filetrace}`);
			convertionErrors.push({filetrace, error});
		}

		delete context.processing;
		return context;
	}

	function publicProcessNode(node: Node) {
		if (!isContextToBeSaved(node) || !sourceFiles.has(node.getSourceFile())) {
			return null;
		}
		return processNode(node);
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
		let remaining = length;
		while(remaining > 0) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const {fn, node} = queue.shift()!;
			updateProgressBar(length - remaining, node.getSourceFile().getFilePath());
			remaining = queue.length;
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

	const api = {srcPath, dstPath, transformFiles, queueTransform, log, processNode: publicProcessNode};
	return api;

}

export function getFileTrace(node: Node) {
	const sourceFile = node.getSourceFile();
	const pos = sourceFile.getLineAndColumnAtPos(node.getStart());
	return `${sourceFile.getFilePath()}:${pos.line}:${pos.column}`;
}



