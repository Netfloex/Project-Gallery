import { heroui } from "@heroui/react"

import type { Config } from "tailwindcss" with { "resolution-mode": "import" }

export default {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: "class",
	plugins: [heroui()],
} satisfies Config
