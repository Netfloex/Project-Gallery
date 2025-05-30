"use server"

import { ProfilePicture } from "./ProfilePicture"
import * as session from "@utils/session"
import Link from "next/link"

import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react"

import type { FC } from "react"

export const Header: FC = async () => {
	const sessionData = await session.get()

	return (
		<Navbar>
			<NavbarBrand>
				<Link href="/">
					<p className="font-bold text-inherit">Project Gallery</p>
				</Link>
			</NavbarBrand>
			<NavbarContent justify="end">
				{sessionData !== null && (
					<NavbarItem className="hidden lg:flex">
						<Link href="/user">
							<ProfilePicture user={sessionData.user} />
						</Link>
					</NavbarItem>
				)}
				{sessionData === null && (
					<>
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
					</>
				)}
			</NavbarContent>
		</Navbar>
	)
}
