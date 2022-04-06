module.exports = {
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	env: { node: true },
	overrides: [
		{
			files: ['**/*.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
		{
			files: ['scripts/playwright-utils.ts'],
			rules: {
				'@typescript-eslint/ban-types': 'off',
			},
		},
	],
	rules: {
		indent: ['error', 'tab', {SwitchCase: 1}],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
	},
};
