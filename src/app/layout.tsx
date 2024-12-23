import { Metadata } from "next"

import "./globals.css"

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}

export const metadata: Metadata = {
	title: "Nextjs Template",
	description: "Basic Nextjs template",
	manifest: "/manifest.json",
}
