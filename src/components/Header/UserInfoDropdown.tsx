"use client"

import { logout } from "./actions/logout"
import { FC, startTransition, useActionState } from "react"

import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react"

import { ProfilePicture } from "@components/ProfilePicture"

import { PublicUser } from "@typings/user"

export const UserInfoDropdown: FC<{ user: PublicUser }> = ({ user }) => {
	const [, logoutAction] = useActionState(logout, false)

	return (
		<Dropdown>
			<DropdownTrigger>
				<a className="cursor-pointer">
					<ProfilePicture user={user} />
				</a>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Account actions"
				onAction={(key) => {
					switch (key) {
						case "logout":
							startTransition(() => {
								logoutAction()
							})
							break

						default:
							break
					}
				}}
			>
				<DropdownItem href="/user" key="user-page">
					Account
				</DropdownItem>
				<DropdownItem key="logout">Logout</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}
