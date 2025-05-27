import Link from "next/link"

import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react"

import type { FC } from "react"

export const Header: FC = () => (
	<Navbar>
		<NavbarBrand>
			<Link href="/">
				<p className="font-bold text-inherit">Project Gallery</p>
			</Link>
		</NavbarBrand>
		<NavbarContent justify="end">
			<NavbarItem className="hidden lg:flex">
				<Link href="/runner">Run Projects</Link>
			</NavbarItem>
			<NavbarItem className="hidden lg:flex">
				<Link href="/login">Login</Link>
			</NavbarItem>
			<NavbarItem>
				<Button
					as={Link}
					color="primary"
					href="/register"
					variant="flat"
				>
					Register
				</Button>
			</NavbarItem>
		</NavbarContent>
	</Navbar>
)
