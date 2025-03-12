// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

module.exports = {
	endOfLine: "lf",
	trailingComma: "all",
	useTabs: true,
	semi: false,
	singleQuote: false,
	tabWidth: 4,
	printWidth: 80,
	arrowParens: "always",
	plugins: [
		"@ianvs/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
	importOrder: [
		".*scss$",
		"",
		"<BUILTIN_MODULES>",
		"",
		"<THIRD_PARTY_MODULES>",
		"",
		"^@heroui/.*",
		"",
		"^@hooks/.*",
		"",
		"^@api/.*",
		"",
		"^(@|\\./)components/*",
		"",
		"",
		"<TYPES>",
		"",
		"^@typings/.*",
	],
}
