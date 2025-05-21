import Link from "next/link"

import type { FC } from "react"

export const Footer: FC = () => (
	<footer className="bg-background/80">
		<div className="container mx-auto px-6 py-8">
			<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
				{/* Left Section */}
				<div className="flex flex-col items-center md:items-start">
					<h3 className="mb-2 text-lg font-bold">Project Gallery</h3>
					<p className="text-default-400 max-w-xs text-center md:text-left">
						Temp text
					</p>
				</div>

				{/* Right Section */}
				<div className="flex flex-wrap justify-center gap-6 md:gap-8">
					<div className="flex flex-col items-center md:items-start">
						<h4 className="mb-2 font-semibold">Links</h4>
						{/* TODO: make this dynamic. */}
						<div className="flex flex-col items-center gap-2 md:items-start">
							<Link
								className="text-default-300 transition-opacity hover:opacity-75"
								href="/login"
							>
								Login
							</Link>
							<Link
								className="text-default-300 transition-opacity hover:opacity-75"
								href="/register"
							>
								Register
							</Link>
							<Link
								className="text-default-300 transition-opacity hover:opacity-75"
								href="/compiler"
							>
								Compiler
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Copyright */}
			<div className="border-default-700 text-default-400 mt-8 border-t pt-6 text-center text-sm">
				<p>
					&copy; {new Date().getFullYear()} Project Gallery. All
					rights reserved. I think?
				</p>
			</div>
		</div>
	</footer>
)
