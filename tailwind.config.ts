import { heroui } from "@heroui/react"

import type { Config } from "tailwindcss" with { "resolution-mode": "import" }

export default {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				// these colors use the CSS variable values you set in globals.css
				background: "var(--background)",
				text: "var(--text-color)",
			},
		},
	},
	plugins: [heroui()],
} satisfies Config
