const pkg = require('./package.json');
const dependencies = Object.keys(pkg.dependencies);
const typescript = require('@rollup/plugin-typescript');
const path = require('path');
const {promises: fs} = require('fs');

const prepareBuild = () => ({async buildStart() {
	await fs.rm(path.join(__dirname, "dist"), {force: true, recursive: true});
	await fs.copyFile(path.join(__dirname, "scripts/playwright-utils.ts"), path.join(__dirname, "tests/playwright/playwright-utils.ts"));
}});

module.exports = {
	output: [
		{
			file: './dist/cli.js',
			format: 'cjs',
		},
	],
	input: './scripts/cli.ts',
	external: dependencies.concat(['fs', 'path']),
	plugins: [prepareBuild(), typescript()],
};
