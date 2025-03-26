import { Metadata } from "next"

import "./globals.css"

import { Providers } from "./Providers"

import { Footer } from "@components/Footer"
import { Header } from "@components/Header"

import { FCC } from "@typings/FCC"

const RootLayout: FCC = ({ children }) => (
	<html className="solarized h-full" lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta content="width=device-width" name="viewport" />
		</head>
		{/* min-h-screen makes sure the entire length is used. */}
		{/* flex col stacks all children vertically (probably needs to be edited in the future) */}
		<body className="flex min-h-screen flex-col">
			<Header />
			{/* flex 1 fills the rest of the page up so the footer is pushed down */}
			<main className="flex-1">
				<Providers>{children}</Providers>
			</main>
			<Footer />
		</body>
	</html>
)

export const metadata: Metadata = {
	title: {
		default: "Project Gallery",
		template: `%s | Project Gallery`,
	},
	description: "Project Gallery",
}

export default RootLayout
