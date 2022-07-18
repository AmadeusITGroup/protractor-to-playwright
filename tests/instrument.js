const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const foldersToInstrument = [path.join(__dirname, '../scripts')];

const isInFolderToInstrument = (file) =>
	foldersToInstrument.some((folder) => file.startsWith(folder));

const shouldInstrument = (filename) =>
	isInFolderToInstrument(filename) && /\.ts$/.test(filename);

const instrumentFile = (code, filename) =>
	require('@babel/core').transform(code, {
		filename,
		plugins: ['@babel/plugin-syntax-typescript', 'babel-plugin-istanbul'],
	}).code;

const coverage = {};
global.__coverage__ = coverage;

// override readFileSync to provide instrumented files:
const trueReadFileSync = fs.readFileSync;
fs.readFileSync = (...args) => {
	const code = trueReadFileSync(...args);
	const filename = path.normalize(args[0]);
	if (shouldInstrument(filename)) {
		const isBuffer = Buffer.isBuffer(code);
		const strCode = isBuffer ? code.toString('utf8') : code;
		const strConvertedCode = instrumentFile(strCode, filename);
		return isBuffer ? Buffer.from(strConvertedCode, 'utf8') : strConvertedCode;
	}
	return code;
};

process.on('exit', () => {
	const outputFile = path.join(
		__dirname,
		'..',
		'.nyc_output',
		crypto.randomBytes(16).toString('hex')
	);
	fs.writeFileSync(outputFile, JSON.stringify(coverage));
});
