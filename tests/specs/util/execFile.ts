import { promisify } from 'util';
import { execFile as execFileNodeRaw } from 'child_process';
const execFileNode = promisify(execFileNodeRaw);

export async function execFile(...args: Parameters<typeof execFileNode>) {
	try {
		const result = await execFileNode(...args);
		if (result.stdout) {
			console.log(`stdout:\n${result.stdout}`);
		}
		if (result.stderr) {
			console.log(`stderr:\n${result.stderr}`);
		}
	} catch (error) {
		let errorMsg = `${error.message ?? error}`.trim();
		if (error.code) {
			errorMsg += `\n\nExit code: ${error.code}`;
		}
		if (error.stdout) {
			errorMsg += `\n\nstdout:\n${error.stdout}`;
		}
		if (error.stderr) {
			errorMsg += `\n\nstderr:\n${error.stderr}`;
		}
		throw new Error(errorMsg);
	}
}
