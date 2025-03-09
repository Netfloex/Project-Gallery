import { Metadata } from "next"

import "./globals.css"

import { Providers } from "./Providers"

import { Header } from "@components/Header"

import { FCC } from "@typings/FCC"

const RootLayout: FCC = ({ children }) => (
	<html className="dark" lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta content="width=device-width" name="viewport" />
		</head>
		<body>
			<Header />
			<Providers>{children}</Providers>
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
