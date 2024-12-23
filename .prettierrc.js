// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

module.exports = {
	trailingComma: "all",
	useTabs: true,
	semi: false,
	singleQuote: false,
	tabWidth: 4,
	printWidth: 80,
	arrowParens: "always",
	plugins: ["@ianvs/prettier-plugin-sort-imports"],
	importOrder: [
		".*scss$",
		"",
		"<BUILTIN_MODULES>",
		"",
		"<THIRD_PARTY_MODULES>",
		"",
		"^@hooks/.*",
		"",
		"^(@lib)|(@utils)/.*",
		"",
		"",
		"^(@|\\./)components/*",
		"",
		"",
		"<TYPES>",
		"",
		"^@typings/.*",
	],
}
