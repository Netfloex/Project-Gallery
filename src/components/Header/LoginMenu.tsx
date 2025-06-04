"use client"

import Link from "next/link"
import { FC } from "react"

import { Button, NavbarItem } from "@heroui/react"

export const LoginMenu: FC = () => (
	<>
		<NavbarItem className="hidden lg:flex">
			<Link href="/login">Login</Link>
		</NavbarItem>
		<NavbarItem>
			<Button as={Link} color="primary" href="/register" variant="flat">
				Register
			</Button>
		</NavbarItem>
	</>
)
