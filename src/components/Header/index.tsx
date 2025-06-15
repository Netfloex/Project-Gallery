import { LoginMenu } from "./LoginMenu"
import logo from "./logo.png"
import { UserInfo } from "./UserInfo"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar"

import type { FC } from "react"

export const Header: FC = () => (
	<Navbar>
		<NavbarBrand className="gap-2">
			<Image alt="PG" src={logo} width={30} />
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
