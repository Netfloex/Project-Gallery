import { LoginMenu } from "./LoginMenu"
import { UserInfo } from "./UserInfo"
import Link from "next/link"
import { Suspense } from "react"

import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react"

import type { FC } from "react"

export const Header: FC = () => (
	<Navbar>
		<NavbarBrand>
			<Link href="/">
				<p className="font-bold text-inherit">Project Gallery</p>
			</Link>
		</NavbarBrand>
		<NavbarContent justify="end">
			<Suspense fallback={<LoginMenu />}>
				<UserInfo />
			</Suspense>
		</NavbarContent>
	</Navbar>
)
