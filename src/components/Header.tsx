import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react"

import type { FC } from "react"

export const Header: FC = () => (
	<Navbar>
		<NavbarBrand>
			<p className="font-bold text-inherit">Project Gallery</p>
		</NavbarBrand>
		<NavbarContent justify="end">
			<NavbarItem className="hidden lg:flex">
				<Link href="#">Login</Link>
			</NavbarItem>
			<NavbarItem>
				<Button as={Link} color="primary" href="#" variant="flat">
					Register
				</Button>
			</NavbarItem>
		</NavbarContent>
	</Navbar>
)
